import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { pool } from '../../db/pool.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAdmin, ADMIN_SESSION_COOKIE } from '../../middleware/requireAdmin.js';
import { loginRateLimiter } from '../../middleware/rateLimiter.js';

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 kun
const isProd = process.env.NODE_ENV === 'production';

// Admin kirgan qurilma asosiy saytga kirganda ham "tashrifchi" sifatida hisoblanib
// ketmasligi uchun — bu cookie mebel.com.uz'da ham o'qiladi (api.mebel.com.uz bu
// domenning subdomeni bo'lgani uchun uning nomidan ota-domenga cookie qo'yish mumkin).
const INTERNAL_VISITOR_COOKIE = 'cw_internal_visitor';
const PUBLIC_SITE_DOMAIN = process.env.PUBLIC_SITE_DOMAIN || 'mebel.com.uz';
const INTERNAL_VISITOR_TTL_MS = 365 * 24 * 60 * 60 * 1000; // 1 yil

export const adminAuthRouter = Router();

adminAuthRouter.post(
  '/auth/login',
  loginRateLimiter,
  asyncHandler(async (req, res) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'invalid_payload' });
    }

    const { rows } = await pool.query(`SELECT id, username, password_hash FROM admin_users WHERE username = $1`, [
      username,
    ]);
    const user = rows[0];
    const valid = user ? await bcrypt.compare(password, user.password_hash) : false;

    if (!valid) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }

    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await pool.query(`INSERT INTO admin_sessions (id, admin_user_id, expires_at) VALUES ($1, $2, $3)`, [
      sessionId,
      user.id,
      expiresAt,
    ]);

    res.cookie(ADMIN_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    // Tracking kodi bu cookie'ni ko'rib, shu brauzerdan hech narsa yubormaydi.
    res.cookie(INTERNAL_VISITOR_COOKIE, '1', {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      domain: isProd ? PUBLIC_SITE_DOMAIN : undefined,
      maxAge: INTERNAL_VISITOR_TTL_MS,
      path: '/',
    });

    res.json({ username: user.username });
  }),
);

adminAuthRouter.post(
  '/auth/logout',
  asyncHandler(async (req, res) => {
    const sessionId = req.cookies?.[ADMIN_SESSION_COOKIE];
    if (sessionId) {
      await pool.query(`DELETE FROM admin_sessions WHERE id = $1`, [sessionId]);
    }
    res.clearCookie(ADMIN_SESSION_COOKIE, { path: '/' });
    res.clearCookie(INTERNAL_VISITOR_COOKIE, { path: '/', domain: isProd ? PUBLIC_SITE_DOMAIN : undefined });
    res.json({ ok: true });
  }),
);

adminAuthRouter.get('/auth/me', requireAdmin, (req, res) => {
  res.json({ username: req.admin.username });
});
