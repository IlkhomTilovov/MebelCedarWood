import { Router } from 'express';
import { stringify } from 'csv-stringify';
import { pool } from '../../db/pool.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { resolveDateRange } from '../../services/dateRange.js';

export const adminExportRouter = Router();
adminExportRouter.use(requireAdmin);

function sendCsv(res, filename, columns, rows) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  const stringifier = stringify({ header: true, columns });
  stringifier.pipe(res);
  for (const row of rows) stringifier.write(row);
  stringifier.end();
}

adminExportRouter.get(
  '/export/sessions.csv',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const { rows } = await pool.query(
      `SELECT session_id, visitor_id, started_at, ended_at, duration_seconds, entry_page, exit_page,
              page_view_count, click_count, max_scroll_depth, traffic_source, utm_campaign, device_type,
              browser, os, region, is_converted
       FROM analytics_sessions
       WHERE started_at >= $1 AND started_at < $2
       ORDER BY started_at DESC`,
      [from, to],
    );
    sendCsv(
      res,
      'sessions.csv',
      [
        'session_id', 'visitor_id', 'started_at', 'ended_at', 'duration_seconds', 'entry_page', 'exit_page',
        'page_view_count', 'click_count', 'max_scroll_depth', 'traffic_source', 'utm_campaign', 'device_type',
        'browser', 'os', 'region', 'is_converted',
      ],
      rows,
    );
  }),
);

adminExportRouter.get(
  '/export/campaigns.csv',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const { rows } = await pool.query(
      `SELECT utm_source, utm_medium, utm_campaign,
              count(*) AS sessions,
              count(DISTINCT visitor_id) AS unique_visitors,
              count(*) FILTER (WHERE is_converted) AS leads
       FROM analytics_sessions
       WHERE started_at >= $1 AND started_at < $2 AND utm_campaign IS NOT NULL
       GROUP BY 1, 2, 3
       ORDER BY sessions DESC`,
      [from, to],
    );
    sendCsv(res, 'campaigns.csv', ['utm_source', 'utm_medium', 'utm_campaign', 'sessions', 'unique_visitors', 'leads'], rows);
  }),
);
