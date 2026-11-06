import { Router } from 'express';
import { pool } from '../../db/pool.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { resolveDateRange } from '../../services/dateRange.js';

export const adminRecordingsRouter = Router();
adminRecordingsRouter.use(requireAdmin);

adminRecordingsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { from, to } = resolveDateRange(req.query);
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = 25;

    const { rows } = await pool.query(
      `SELECT r.id, r.session_id, r.started_at, r.ended_at, r.event_count, r.duration_seconds,
              s.entry_page, s.device_type, s.traffic_source, s.is_converted
       FROM analytics_recordings r
       LEFT JOIN analytics_sessions s ON s.session_id = r.session_id
       WHERE r.started_at >= $1 AND r.started_at < $2
       ORDER BY r.started_at DESC
       LIMIT $3 OFFSET $4`,
      [from, to, pageSize, (page - 1) * pageSize],
    );
    res.json({ page, pageSize, recordings: rows });
  }),
);

adminRecordingsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { rows: recordingRows } = await pool.query(
      `SELECT r.id, r.session_id, r.started_at, r.ended_at, r.event_count, r.duration_seconds,
              s.entry_page, s.device_type, s.traffic_source, s.region
       FROM analytics_recordings r
       LEFT JOIN analytics_sessions s ON s.session_id = r.session_id
       WHERE r.id = $1`,
      [req.params.id],
    );
    if (recordingRows.length === 0) return res.status(404).json({ error: 'not_found' });

    const { rows: chunkRows } = await pool.query(
      `SELECT events FROM analytics_recording_chunks WHERE recording_id = $1 ORDER BY seq ASC`,
      [req.params.id],
    );
    const events = chunkRows.flatMap((r) => r.events);

    res.json({ recording: recordingRows[0], events });
  }),
);
