import { Router } from 'express';
import { pool } from '../../db/pool.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { resolveDateRange } from '../../services/dateRange.js';
import { syncAdSpend } from '../../services/adSpendSync.js';

export const adminAdsRouter = Router();
adminAdsRouter.use(requireAdmin);

adminAdsRouter.post(
  '/sync',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange({ range: req.query.range ?? '7d', from: req.query.from, to: req.query.to });
    const count = await syncAdSpend(from, to);
    res.json({ ok: true, rowsSynced: count });
  }),
);

function matchKey(campaign, content) {
  return `${campaign ?? ''}|${content ?? ''}`;
}

adminAdsRouter.get(
  '/roi',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);

    const [spendRes, conversionRes] = await Promise.all([
      pool.query(
        `SELECT campaign_name, ad_name,
                sum(spend) AS spend, sum(impressions) AS impressions, sum(clicks) AS clicks, sum(reach) AS reach
         FROM ad_spend_daily
         WHERE stat_date >= $1 AND stat_date < $2
         GROUP BY campaign_name, ad_name
         ORDER BY spend DESC`,
        [from, to],
      ),
      pool.query(
        `SELECT s.utm_campaign, s.utm_content,
                count(DISTINCT s.session_id) AS visits,
                count(DISTINCT e.session_id) FILTER (WHERE e.event_type = 'form_submit') AS leads,
                count(DISTINCT e.session_id) FILTER (WHERE e.event_type = 'order_created') AS orders
         FROM analytics_sessions s
         LEFT JOIN analytics_events e ON e.session_id = s.session_id AND e.event_type IN ('form_submit', 'order_created')
         WHERE s.started_at >= $1 AND s.started_at < $2
         GROUP BY s.utm_campaign, s.utm_content`,
        [from, to],
      ),
    ]);

    const conversionsByKey = new Map(
      conversionRes.rows.map((r) => [
        matchKey(r.utm_campaign, r.utm_content),
        { visits: Number(r.visits), leads: Number(r.leads), orders: Number(r.orders) },
      ]),
    );

    const rows = spendRes.rows.map((r) => {
      const matched = conversionsByKey.get(matchKey(r.campaign_name, r.ad_name)) ?? { visits: 0, leads: 0, orders: 0 };
      const spend = Number(r.spend);
      return {
        campaignName: r.campaign_name,
        adName: r.ad_name,
        spend,
        impressions: Number(r.impressions),
        clicks: Number(r.clicks),
        reach: Number(r.reach),
        visits: matched.visits,
        leads: matched.leads,
        orders: matched.orders,
        costPerLead: matched.leads > 0 ? Math.round((spend / matched.leads) * 100) / 100 : null,
        costPerOrder: matched.orders > 0 ? Math.round((spend / matched.orders) * 100) / 100 : null,
        matched: matched.visits > 0,
      };
    });

    const totalSpend = rows.reduce((sum, r) => sum + r.spend, 0);
    const unmatchedSpend = rows.filter((r) => !r.matched).reduce((sum, r) => sum + r.spend, 0);

    res.json({ range: { from, to }, rows, totalSpend, unmatchedSpend, unmatchedCount: rows.filter((r) => !r.matched).length });
  }),
);
