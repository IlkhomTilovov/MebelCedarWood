import { pool } from '../db/pool.js';
import { asyncHandler } from './asyncHandler.js';

export const ADMIN_SESSION_COOKIE = 'cw_admin_session';

export const requireAdmin = asyncHandler(async function requireAdmin(req, res, next) {
  const sessionId = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (!sessionId) {
    return res.status(401).json({ error: 'unauthenticated' });
  }

  const { rows } = await pool.query(
    `SELECT s.id, s.expires_at, u.id AS admin_user_id, u.username
     FROM admin_sessions s
     JOIN admin_users u ON u.id = s.admin_user_id
     WHERE s.id = $1`,
    [sessionId],
  );
  const session = rows[0];

  if (!session || new Date(session.expires_at) < new Date()) {
    return res.status(401).json({ error: 'session_expired' });
  }

  pool
    .query(`UPDATE admin_sessions SET last_seen_at = now() WHERE id = $1`, [sessionId])
    .catch((err) => console.error('failed to touch admin session', err));

  req.admin = { id: session.admin_user_id, username: session.username, sessionId: session.id };
  next();
});
