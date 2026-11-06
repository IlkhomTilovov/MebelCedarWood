import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { healthRouter } from './routes/health.js';
import { applicationsRouter } from './routes/applications.js';
import { eventsRouter } from './routes/events.js';
import { adminAuthRouter } from './routes/admin/auth.js';
import { adminAnalyticsRouter } from './routes/admin/analytics.js';
import { adminRealtimeRouter } from './routes/admin/realtime.js';
import { adminExportRouter } from './routes/admin/export.js';
import { eventsRateLimiter } from './middleware/rateLimiter.js';

const rawAllowedOrigins = process.env.ALLOWED_ORIGINS?.trim();
const allowedOrigins = rawAllowedOrigins
  ? rawAllowedOrigins.split(',').map((o) => o.trim()).filter(Boolean)
  : ['https://mebel.com.uz'];

// Admin panel faqat belgilangan origin'dan, cookie bilan (credentials) kirishi mumkin.
const adminCorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('not_allowed_by_cors'));
  },
  credentials: true,
};

export const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

// Admin yo'llari avval ro'yxatdan o'tkaziladi — shunda pastdagi ochiq CORS
// admin so'rovlarini (ayniqsa OPTIONS preflight'ni) hech qachon "ushlab qolmaydi".
app.use('/api/admin', cors(adminCorsOptions));
app.use('/api/admin', adminAuthRouter);
app.use('/api/admin', adminAnalyticsRouter);
app.use('/api/admin', adminRealtimeRouter);
app.use('/api/admin', adminExportRouter);

// Asosiy sayt (forma, tracking) uchun ochiq CORS — avvalgi xatti-harakat bilan bir xil,
// shunda mavjud /api/applications oqimi hech qachon buzilmaydi.
app.use(cors());
app.use('/api', healthRouter);
app.use('/api', applicationsRouter);
app.use('/api', eventsRateLimiter, eventsRouter);

app.use((err, _req, res, _next) => {
  console.error('Unhandled request error', err);
  if (res.headersSent) return;
  res.status(500).json({ error: 'server_error' });
});
