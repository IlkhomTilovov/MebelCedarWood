import { Router } from 'express';
import { pool } from '../../db/pool.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { resolveDateRange, previousPeriod, percentChange } from '../../services/dateRange.js';

export const adminAnalyticsRouter = Router();
adminAnalyticsRouter.use(requireAdmin);

async function fetchKpis(from, to) {
  const { rows: sessionRows } = await pool.query(
    `SELECT
       count(*) AS visits,
       count(DISTINCT visitor_id) AS unique_visitors,
       count(*) FILTER (WHERE is_converted) AS converted_sessions,
       avg(duration_seconds) FILTER (WHERE duration_seconds IS NOT NULL) AS avg_duration
     FROM analytics_sessions
     WHERE started_at >= $1 AND started_at < $2`,
    [from, to],
  );

  const { rows: repeatRows } = await pool.query(
    `SELECT count(*) AS repeat_visits
     FROM analytics_sessions s
     JOIN analytics_visitors v ON v.visitor_id = s.visitor_id
     WHERE s.started_at >= $1 AND s.started_at < $2 AND v.first_seen_at < $1`,
    [from, to],
  );

  const { rows: pageViewRows } = await pool.query(
    `SELECT count(*) AS page_views FROM analytics_page_views WHERE entered_at >= $1 AND entered_at < $2`,
    [from, to],
  );

  const { rows: formRows } = await pool.query(
    `SELECT
       count(*) FILTER (WHERE event_type = 'form_submit') AS leads,
       count(*) FILTER (WHERE event_type = 'order_created') AS orders
     FROM analytics_events
     WHERE occurred_at >= $1 AND occurred_at < $2`,
    [from, to],
  );

  const s = sessionRows[0];
  const uniqueVisitors = Number(s.unique_visitors);
  const leads = Number(formRows[0].leads);

  return {
    visits: Number(s.visits),
    uniqueVisitors,
    repeatVisits: Number(repeatRows[0].repeat_visits),
    pageViews: Number(pageViewRows[0].page_views),
    avgSessionSeconds: s.avg_duration ? Math.round(Number(s.avg_duration)) : 0,
    conversionRate: uniqueVisitors > 0 ? Math.round((leads / uniqueVisitors) * 1000) / 10 : 0,
    leads,
    orders: Number(formRows[0].orders),
  };
}

adminAnalyticsRouter.get(
  '/kpis',
  asyncHandler(async (req, res) => {
    const range = resolveDateRange(req.query);
    const prevRange = previousPeriod(range);

    const [current, previous] = await Promise.all([
      fetchKpis(range.from, range.to),
      fetchKpis(prevRange.from, prevRange.to),
    ]);

    const comparison = {};
    for (const key of Object.keys(current)) {
      comparison[key] = percentChange(current[key], previous[key]);
    }

    res.json({ range, current, previous, comparison });
  }),
);

adminAnalyticsRouter.get(
  '/visitors-timeseries',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const { rows } = await pool.query(
      `SELECT date_trunc('day', started_at) AS day,
              count(*) AS visits,
              count(DISTINCT visitor_id) AS unique_visitors
       FROM analytics_sessions
       WHERE started_at >= $1 AND started_at < $2
       GROUP BY 1
       ORDER BY 1`,
      [from, to],
    );
    res.json(rows.map((r) => ({ day: r.day, visits: Number(r.visits), uniqueVisitors: Number(r.unique_visitors) })));
  }),
);

adminAnalyticsRouter.get(
  '/top-pages',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const { rows } = await pool.query(
      `SELECT page_path, count(*) AS views, count(DISTINCT visitor_id) AS unique_viewers
       FROM analytics_page_views
       WHERE entered_at >= $1 AND entered_at < $2 AND page_path IS NOT NULL
       GROUP BY page_path
       ORDER BY views DESC
       LIMIT 20`,
      [from, to],
    );
    res.json(rows.map((r) => ({ pagePath: r.page_path, views: Number(r.views), uniqueViewers: Number(r.unique_viewers) })));
  }),
);

adminAnalyticsRouter.get(
  '/top-elements',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const { rows } = await pool.query(
      `SELECT
         coalesce(payload->>'elementId', payload->>'elementText', 'noma''lum') AS element,
         payload->>'elementType' AS element_type,
         count(*) AS clicks
       FROM analytics_events
       WHERE occurred_at >= $1 AND occurred_at < $2 AND event_type IN ('button_click', 'cta_click')
       GROUP BY 1, 2
       ORDER BY clicks DESC
       LIMIT 20`,
      [from, to],
    );
    res.json(rows.map((r) => ({ element: r.element, elementType: r.element_type, clicks: Number(r.clicks) })));
  }),
);

adminAnalyticsRouter.get(
  '/devices',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const [deviceRes, browserRes, osRes] = await Promise.all([
      pool.query(
        `SELECT coalesce(device_type, 'unknown') AS device_type, count(*) AS sessions
         FROM analytics_sessions WHERE started_at >= $1 AND started_at < $2 GROUP BY 1 ORDER BY 2 DESC`,
        [from, to],
      ),
      pool.query(
        `SELECT coalesce(browser, 'unknown') AS browser, count(*) AS sessions
         FROM analytics_sessions WHERE started_at >= $1 AND started_at < $2 GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
        [from, to],
      ),
      pool.query(
        `SELECT coalesce(os, 'unknown') AS os, count(*) AS sessions
         FROM analytics_sessions WHERE started_at >= $1 AND started_at < $2 GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
        [from, to],
      ),
    ]);
    res.json({
      byDevice: deviceRes.rows.map((r) => ({ deviceType: r.device_type, sessions: Number(r.sessions) })),
      byBrowser: browserRes.rows.map((r) => ({ browser: r.browser, sessions: Number(r.sessions) })),
      byOs: osRes.rows.map((r) => ({ os: r.os, sessions: Number(r.sessions) })),
    });
  }),
);

adminAnalyticsRouter.get(
  '/traffic-sources',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const { rows } = await pool.query(
      `SELECT coalesce(traffic_source, 'Direct') AS traffic_source,
              count(*) AS sessions,
              count(*) FILTER (WHERE is_converted) AS conversions
       FROM analytics_sessions
       WHERE started_at >= $1 AND started_at < $2
       GROUP BY 1
       ORDER BY sessions DESC`,
      [from, to],
    );
    res.json(rows.map((r) => ({ trafficSource: r.traffic_source, sessions: Number(r.sessions), conversions: Number(r.conversions) })));
  }),
);

adminAnalyticsRouter.get(
  '/campaigns',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const { rows } = await pool.query(
      `SELECT
         utm_source, utm_medium, utm_campaign,
         count(*) AS sessions,
         count(DISTINCT visitor_id) AS unique_visitors,
         count(*) FILTER (WHERE is_converted) AS leads
       FROM analytics_sessions
       WHERE started_at >= $1 AND started_at < $2 AND utm_campaign IS NOT NULL
       GROUP BY 1, 2, 3
       ORDER BY sessions DESC`,
      [from, to],
    );
    res.json(
      rows.map((r) => ({
        utmSource: r.utm_source,
        utmMedium: r.utm_medium,
        utmCampaign: r.utm_campaign,
        sessions: Number(r.sessions),
        uniqueVisitors: Number(r.unique_visitors),
        leads: Number(r.leads),
        conversionRate: r.sessions > 0 ? Math.round((Number(r.leads) / Number(r.sessions)) * 1000) / 10 : 0,
      })),
    );
  }),
);

adminAnalyticsRouter.get(
  '/geography',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const { rows } = await pool.query(
      `SELECT coalesce(region, 'Noma''lum') AS region, count(*) AS sessions
       FROM analytics_sessions
       WHERE started_at >= $1 AND started_at < $2
       GROUP BY 1
       ORDER BY sessions DESC`,
      [from, to],
    );
    res.json(rows.map((r) => ({ region: r.region, sessions: Number(r.sessions) })));
  }),
);

adminAnalyticsRouter.get(
  '/exit-pages',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const { rows } = await pool.query(
      `SELECT coalesce(exit_page, 'noma''lum') AS exit_page, count(*) AS sessions
       FROM analytics_sessions
       WHERE started_at >= $1 AND started_at < $2 AND ended_at IS NOT NULL
       GROUP BY 1
       ORDER BY sessions DESC
       LIMIT 20`,
      [from, to],
    );
    const total = rows.reduce((sum, r) => sum + Number(r.sessions), 0);
    res.json(rows.map((r) => ({ exitPage: r.exit_page, sessions: Number(r.sessions), share: total > 0 ? Math.round((Number(r.sessions) / total) * 1000) / 10 : 0 })));
  }),
);

const FUNNEL_STEPS = [
  { name: 'personal_info', index: 1, label: "Shaxsiy ma'lumotlar" },
  { name: 'furniture_type', index: 2, label: 'Buyurtma turi' },
  { name: 'order_requirements', index: 3, label: 'Loyiha rejalari' },
  { name: 'review', index: 4, label: 'Tekshirish' },
];

adminAnalyticsRouter.get(
  '/funnel',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);

    const { rows: startRows } = await pool.query(
      `SELECT count(DISTINCT session_id) AS sessions
       FROM analytics_events
       WHERE occurred_at >= $1 AND occurred_at < $2 AND event_type = 'form_start'`,
      [from, to],
    );
    const { rows: stepRows } = await pool.query(
      `SELECT payload->>'stepName' AS step_name, count(DISTINCT session_id) AS sessions
       FROM analytics_events
       WHERE occurred_at >= $1 AND occurred_at < $2 AND event_type = 'form_step_view'
       GROUP BY 1`,
      [from, to],
    );
    const { rows: submitRows } = await pool.query(
      `SELECT count(DISTINCT session_id) AS sessions
       FROM analytics_events
       WHERE occurred_at >= $1 AND occurred_at < $2 AND event_type = 'form_submit'`,
      [from, to],
    );

    const formStarts = Number(startRows[0].sessions);
    const stepCounts = Object.fromEntries(stepRows.map((r) => [r.step_name, Number(r.sessions)]));
    const submits = Number(submitRows[0].sessions);

    const steps = [
      { name: 'form_start', label: 'Formani ochdi', sessions: formStarts },
      ...FUNNEL_STEPS.map((s) => ({ name: s.name, label: s.label, sessions: stepCounts[s.name] ?? 0 })),
      { name: 'form_submit', label: 'Ariza yubordi', sessions: submits },
    ];

    const base = steps[0].sessions || 1;
    res.json(steps.map((s) => ({ ...s, percentOfStart: Math.round((s.sessions / base) * 1000) / 10 })));
  }),
);

adminAnalyticsRouter.get(
  '/catalog',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const { rows } = await pool.query(
      `SELECT
         payload->>'productName' AS product_name,
         payload->>'category' AS category,
         count(*) AS views,
         count(DISTINCT visitor_id) AS unique_viewers,
         count(*) FILTER (WHERE event_type = 'button_click') AS clicks
       FROM analytics_events
       WHERE occurred_at >= $1 AND occurred_at < $2 AND event_type IN ('product_view', 'catalog_view')
       GROUP BY 1, 2
       ORDER BY views DESC`,
      [from, to],
    );
    res.json(
      rows.map((r) => ({
        productName: r.product_name,
        category: r.category,
        views: Number(r.views),
        uniqueViewers: Number(r.unique_viewers),
        clicks: Number(r.clicks),
      })),
    );
  }),
);

adminAnalyticsRouter.get(
  '/sessions',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = 25;
    const { rows } = await pool.query(
      `SELECT session_id, visitor_id, started_at, ended_at, duration_seconds, entry_page, exit_page,
              page_view_count, click_count, max_scroll_depth, traffic_source, device_type, region, is_converted
       FROM analytics_sessions
       WHERE started_at >= $1 AND started_at < $2
       ORDER BY started_at DESC
       LIMIT $3 OFFSET $4`,
      [from, to, pageSize, (page - 1) * pageSize],
    );
    res.json({ page, pageSize, sessions: rows });
  }),
);

adminAnalyticsRouter.get(
  '/sessions/:sessionId',
  asyncHandler(async (req, res) => {
    const { rows: sessionRows } = await pool.query(`SELECT * FROM analytics_sessions WHERE session_id = $1`, [
      req.params.sessionId,
    ]);
    if (sessionRows.length === 0) return res.status(404).json({ error: 'not_found' });

    const { rows: timeline } = await pool.query(
      `SELECT event_type, page_path, payload, occurred_at
       FROM analytics_events
       WHERE session_id = $1
       ORDER BY occurred_at ASC
       LIMIT 500`,
      [req.params.sessionId],
    );

    res.json({ session: sessionRows[0], timeline });
  }),
);

adminAnalyticsRouter.get(
  '/visitors/:visitorId',
  asyncHandler(async (req, res) => {
    const { rows: visitorRows } = await pool.query(`SELECT * FROM analytics_visitors WHERE visitor_id = $1`, [
      req.params.visitorId,
    ]);
    if (visitorRows.length === 0) return res.status(404).json({ error: 'not_found' });

    const { rows: sessions } = await pool.query(
      `SELECT session_id, started_at, ended_at, duration_seconds, entry_page, exit_page, page_view_count, click_count, is_converted
       FROM analytics_sessions
       WHERE visitor_id = $1
       ORDER BY started_at DESC
       LIMIT 50`,
      [req.params.visitorId],
    );

    res.json({ visitor: visitorRows[0], sessions });
  }),
);

adminAnalyticsRouter.get(
  '/heatmap',
  asyncHandler(async (req, res) => {
    const pagePath = req.query.page;
    const type = req.query.type === 'scroll' ? 'scroll' : 'click';
    if (!pagePath) return res.status(400).json({ error: 'page_required' });

    if (type === 'scroll') {
      const { rows } = await pool.query(
        `SELECT viewport_bucket, depth_bucket, visitor_count
         FROM analytics_scroll_heatmap WHERE page_path = $1 ORDER BY depth_bucket`,
        [pagePath],
      );
      return res.json(rows);
    }

    const { rows } = await pool.query(
      `SELECT viewport_bucket, x_bucket, y_bucket, click_count
       FROM analytics_click_heatmap WHERE page_path = $1 ORDER BY click_count DESC LIMIT 2000`,
      [pagePath],
    );
    res.json(rows);
  }),
);
