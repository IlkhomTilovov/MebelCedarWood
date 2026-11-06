import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';

const MAX_EVENTS_PER_CHUNK = 500;

const bodySchema = z.object({
  visitorId: z.string().uuid(),
  sessionId: z.string().uuid(),
  events: z.array(z.record(z.string(), z.unknown())).min(1).max(MAX_EVENTS_PER_CHUNK),
});

export const recordingsRouter = Router();

recordingsRouter.post('/recordings', (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_payload' });
  }
  const { sessionId, events } = parsed.data;

  // Darhol javob qaytariladi — saqlash fon rejimida davom etadi, asosiy sayt
  // hech qachon recording tufayli sekinlashmaydi yoki buzilmaydi.
  res.status(202).json({ ok: true });

  saveChunk(sessionId, events).catch((err) => console.error('recording chunk save error', err));
});

async function saveChunk(sessionId, events) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO analytics_recordings (session_id, started_at, ended_at, event_count)
       VALUES ($1, now(), now(), 0)
       ON CONFLICT (session_id) DO UPDATE SET
         ended_at = now(),
         duration_seconds = GREATEST(0, EXTRACT(EPOCH FROM (now() - analytics_recordings.started_at))::int)
       RETURNING id`,
      [sessionId],
    );
    const recordingId = rows[0].id;

    const { rows: seqRows } = await client.query(
      `SELECT COALESCE(MAX(seq), -1) + 1 AS next_seq FROM analytics_recording_chunks WHERE recording_id = $1`,
      [recordingId],
    );

    await client.query(
      `INSERT INTO analytics_recording_chunks (recording_id, seq, events) VALUES ($1, $2, $3)`,
      [recordingId, seqRows[0].next_seq, JSON.stringify(events)],
    );

    await client.query(`UPDATE analytics_recordings SET event_count = event_count + $2 WHERE id = $1`, [
      recordingId,
      events.length,
    ]);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
