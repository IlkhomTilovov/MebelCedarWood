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

adminAdsRouter.get(
  '/roi',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);

    const [spendRes, conversionRes] = await Promise.all([
      // ad_id bo'yicha guruhlanadi — ad nomi bir nechta ad set'da takrorlanishi
      // mumkin, nom bo'yicha guruhlash xarajatlarni noto'g'ri qo'shib yuboradi.
      pool.query(
        `SELECT ad_id, max(campaign_name) AS campaign_name, max(ad_name) AS ad_name,
                sum(spend) AS spend, sum(impressions) AS impressions, sum(clicks) AS clicks, sum(reach) AS reach,
                sum(meta_leads) AS meta_leads
         FROM ad_spend_daily
         WHERE stat_date >= $1 AND stat_date < $2
         GROUP BY ad_id
         ORDER BY spend DESC`,
        [from, to],
      ),
      // Bizning saytimizdagi tashrif/ariza — utm_id (reklama ID) orqali bog'lanadi,
      // bu esa reklama havolasida utm_id={{ad.id}} parametri bo'lishini talab qiladi.
      pool.query(
        `SELECT s.utm_id,
                count(DISTINCT s.session_id) AS visits,
                count(DISTINCT e.session_id) FILTER (WHERE e.event_type = 'form_submit') AS leads,
                count(DISTINCT e.session_id) FILTER (WHERE e.event_type = 'order_created') AS orders
         FROM analytics_sessions s
         LEFT JOIN analytics_events e ON e.session_id = s.session_id AND e.event_type IN ('form_submit', 'order_created')
         WHERE s.started_at >= $1 AND s.started_at < $2 AND s.utm_id IS NOT NULL
         GROUP BY s.utm_id`,
        [from, to],
      ),
    ]);

    const conversionsByAdId = new Map(
      conversionRes.rows.map((r) => [
        r.utm_id,
        { visits: Number(r.visits), leads: Number(r.leads), orders: Number(r.orders) },
      ]),
    );

    const rows = spendRes.rows.map((r) => {
      const website = conversionsByAdId.get(r.ad_id) ?? { visits: 0, leads: 0, orders: 0 };
      const spend = Number(r.spend);
      const metaLeads = Number(r.meta_leads);
      return {
        adId: r.ad_id,
        campaignName: r.campaign_name,
        adName: r.ad_name,
        spend,
        impressions: Number(r.impressions),
        clicks: Number(r.clicks),
        reach: Number(r.reach),
        metaLeads,
        costPerMetaLead: metaLeads > 0 ? Math.round((spend / metaLeads) * 100) / 100 : null,
        websiteVisits: website.visits,
        websiteLeads: website.leads,
        orders: website.orders,
        costPerWebsiteLead: website.leads > 0 ? Math.round((spend / website.leads) * 100) / 100 : null,
        // Instant Form/Messaging reklamalari saytga umuman kirmaydi — ularda Meta o'zi
        // lead'ni tasdiqlasa, bu "mos kelmagan" emas, shunchaki boshqa turdagi reklama.
        matched: website.visits > 0 || metaLeads > 0,
      };
    });

    const totalSpend = rows.reduce((sum, r) => sum + r.spend, 0);
    const unmatchedRows = rows.filter((r) => !r.matched);
    const unmatchedSpend = unmatchedRows.reduce((sum, r) => sum + r.spend, 0);

    res.json({
      range: { from, to },
      rows,
      totalSpend,
      unmatchedSpend,
      unmatchedCount: unmatchedRows.length,
    });
  }),
);
