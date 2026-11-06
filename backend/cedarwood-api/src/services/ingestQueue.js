import { pool } from '../db/pool.js';
import { bumpClickHeatmap, bumpScrollHeatmap } from './heatmap.js';

const MAX_QUEUE_SIZE = 5000;
const FLUSH_INTERVAL_MS = 2500;
const FLUSH_THRESHOLD = 200;

const CLICK_EVENT_TYPES = new Set(['button_click', 'cta_click']);
const CONVERSION_EVENT_TYPES = new Set([
  'form_start',
  'form_submit',
  'order_created',
  'telegram_click',
  'phone_click',
  'whatsapp_click',
  'consultation_requested',
]);

let queue = [];
let droppedCount = 0;
let flushing = false;

export function enqueueIngestItem(item) {
  if (queue.length >= MAX_QUEUE_SIZE) {
    droppedCount += 1;
    return;
  }
  queue.push(item);
  if (queue.length >= FLUSH_THRESHOLD) {
    flushQueue();
  }
}

export function getQueueStats() {
  return { queued: queue.length, dropped: droppedCount };
}

async function flushQueue() {
  if (flushing || queue.length === 0) return;
  flushing = true;
  const batch = queue;
  queue = [];
  try {
    for (const item of batch) {
      await processItem(item).catch((err) => console.error('ingest item failed', err));
    }
  } finally {
    flushing = false;
  }
}

setInterval(flushQueue, FLUSH_INTERVAL_MS);

async function processItem(item) {
  const { visitorId, sessionId, device, geo, utm, trafficSource, referrer, landingPage, isNewSession, events } =
    item;

  await upsertVisitor({ visitorId, device, geo, utm, trafficSource, landingPage, isNewSession });
  await upsertSession({
    sessionId,
    visitorId,
    device,
    geo,
    utm,
    trafficSource,
    referrer,
    events,
  });
  await insertPageViews(sessionId, visitorId, events);
  await insertEvents(sessionId, visitorId, events);
  await updateHeatmaps(events);
}

async function upsertVisitor({ visitorId, device, geo, utm, trafficSource, landingPage, isNewSession }) {
  await pool.query(
    `INSERT INTO analytics_visitors (
       visitor_id, device_type, browser, os, screen_width, screen_height, language,
       country, region, first_traffic_source, first_utm_source, first_utm_medium,
       first_utm_campaign, first_utm_content, first_utm_term, first_landing_page
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     ON CONFLICT (visitor_id) DO UPDATE SET
       last_seen_at = now(),
       visit_count = analytics_visitors.visit_count + CASE WHEN $17 THEN 1 ELSE 0 END,
       device_type = COALESCE(analytics_visitors.device_type, EXCLUDED.device_type),
       browser = COALESCE(analytics_visitors.browser, EXCLUDED.browser),
       os = COALESCE(analytics_visitors.os, EXCLUDED.os),
       region = COALESCE(analytics_visitors.region, EXCLUDED.region)`,
    [
      visitorId,
      device?.type ?? null,
      device?.browser ?? null,
      device?.os ?? null,
      device?.screenWidth ?? null,
      device?.screenHeight ?? null,
      device?.language ?? null,
      geo?.country ?? 'UZ',
      geo?.region ?? null,
      trafficSource ?? null,
      utm?.source ?? null,
      utm?.medium ?? null,
      utm?.campaign ?? null,
      utm?.content ?? null,
      utm?.term ?? null,
      landingPage ?? null,
      Boolean(isNewSession),
    ],
  );
}

async function upsertSession({ sessionId, visitorId, device, geo, utm, trafficSource, referrer, events }) {
  const firstEvent = events[0];
  await pool.query(
    `INSERT INTO analytics_sessions (
       session_id, visitor_id, started_at, entry_page, traffic_source,
       utm_source, utm_medium, utm_campaign, utm_content, utm_term,
       referrer, device_type, browser, os, region
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     ON CONFLICT (session_id) DO NOTHING`,
    [
      sessionId,
      visitorId,
      firstEvent?.occurredAt ?? new Date().toISOString(),
      firstEvent?.pagePath ?? null,
      trafficSource ?? null,
      utm?.source ?? null,
      utm?.medium ?? null,
      utm?.campaign ?? null,
      utm?.content ?? null,
      utm?.term ?? null,
      referrer ?? null,
      device?.type ?? null,
      device?.browser ?? null,
      device?.os ?? null,
      geo?.region ?? null,
    ],
  );

  const pageViewDelta = events.filter((e) => e.type === 'page_view').length;
  const clickDelta = events.filter((e) => CLICK_EVENT_TYPES.has(e.type)).length;
  const scrollDepths = events
    .filter((e) => e.type.startsWith('scroll_'))
    .map((e) => Number(e.type.replace('scroll_', '')) || 0);
  const maxScrollInBatch = scrollDepths.length > 0 ? Math.max(...scrollDepths) : 0;
  const hasConversion = events.some((e) => CONVERSION_EVENT_TYPES.has(e.type));
  const lastEvent = events[events.length - 1];

  await pool.query(
    `UPDATE analytics_sessions SET
       page_view_count = page_view_count + $2,
       click_count = click_count + $3,
       max_scroll_depth = GREATEST(max_scroll_depth, $4),
       exit_page = COALESCE($5, exit_page),
       ended_at = $6,
       duration_seconds = GREATEST(0, EXTRACT(EPOCH FROM ($6::timestamptz - started_at))::int),
       is_converted = is_converted OR $7
     WHERE session_id = $1`,
    [sessionId, pageViewDelta, clickDelta, maxScrollInBatch, lastEvent?.pagePath ?? null, lastEvent?.occurredAt ?? new Date().toISOString(), hasConversion],
  );
}

async function insertPageViews(sessionId, visitorId, events) {
  const pageViews = events.filter((e) => e.type === 'page_view');
  if (pageViews.length === 0) return;

  const values = [];
  const params = [];
  pageViews.forEach((e, i) => {
    const base = i * 7;
    values.push(`($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},$${base + 7})`);
    params.push(
      visitorId,
      sessionId,
      e.pageUrl ?? null,
      e.pagePath ?? null,
      e.pageTitle ?? null,
      e.payload?.referrer ?? null,
      e.occurredAt,
    );
  });

  await pool.query(
    `INSERT INTO analytics_page_views (visitor_id, session_id, page_url, page_path, page_title, referrer, entered_at)
     VALUES ${values.join(',')}`,
    params,
  );
}

async function insertEvents(sessionId, visitorId, events) {
  if (events.length === 0) return;

  const values = [];
  const params = [];
  events.forEach((e, i) => {
    const base = i * 6;
    values.push(`($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6})`);
    params.push(e.type, visitorId, sessionId, e.pagePath ?? null, JSON.stringify(e.payload ?? {}), e.occurredAt);
  });

  await pool.query(
    `INSERT INTO analytics_events (event_type, visitor_id, session_id, page_path, payload, occurred_at)
     VALUES ${values.join(',')}`,
    params,
  );
}

async function updateHeatmaps(events) {
  for (const e of events) {
    if (CLICK_EVENT_TYPES.has(e.type) && typeof e.payload?.x === 'number' && typeof e.payload?.y === 'number') {
      await bumpClickHeatmap({
        pagePath: e.pagePath,
        x: e.payload.x,
        y: e.payload.y,
        viewportWidth: e.payload.viewportWidth,
      });
    }
    if (e.type.startsWith('scroll_')) {
      const depth = Number(e.type.replace('scroll_', ''));
      if (!Number.isNaN(depth)) {
        await bumpScrollHeatmap({ pagePath: e.pagePath, depth, viewportWidth: e.payload?.viewportWidth });
      }
    }
  }
}
