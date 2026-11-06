import { pool } from '../db/pool.js';

const FUNNEL_EVENT_STAGES = [
  { key: 'product_view', label: 'Mahsulot/katalog ko’rish', types: ['product_view', 'catalog_view'] },
  { key: 'order_start', label: 'Buyurtma boshlash', types: ['order_start', 'product_select'] },
  { key: 'contract_open', label: 'Shartnomani ochish', types: ['contract_open'] },
  { key: 'contract_accept', label: 'Shartnomani qabul qilish', types: ['contract_accept'] },
  { key: 'application_start', label: 'Ariza boshlash', types: ['form_start'] },
  { key: 'application_submit', label: 'Ariza yakunlash', types: ['form_submit'] },
];

const FORM_STEPS = [
  { name: 'personal_info', label: "Shaxsiy ma'lumotlar" },
  { name: 'furniture_type', label: 'Buyurtma turi' },
  { name: 'order_requirements', label: 'Loyiha rejalari' },
  { name: 'review', label: 'Tekshirish' },
];

// Barcha AI'ga yuboriladigan ma'lumot shu yerda tayyorlanadi — xom eventlar EMAS,
// faqat qisqa, agregatsiya qilingan sonlar (spec talabi: AI'ga raw eventlar yuborilmasin).
export async function buildAnalyticsSummary(from, to) {
  const [visitorsRes, funnelRows, contractRes, stepRows, fieldRows, ctaRows, deviceRows, trafficRows] =
    await Promise.all([
      pool.query(
        `SELECT count(DISTINCT visitor_id) AS visitors, count(*) AS sessions
         FROM analytics_sessions WHERE started_at >= $1 AND started_at < $2`,
        [from, to],
      ),
      Promise.all(
        FUNNEL_EVENT_STAGES.map(async (stage) => {
          const { rows } = await pool.query(
            `SELECT count(DISTINCT session_id) AS sessions
             FROM analytics_events
             WHERE occurred_at >= $1 AND occurred_at < $2 AND event_type = ANY($3::text[])`,
            [from, to, stage.types],
          );
          return { ...stage, sessions: Number(rows[0].sessions) };
        }),
      ),
      pool.query(
        `SELECT
           count(DISTINCT session_id) FILTER (WHERE event_type = 'contract_open') AS opened,
           count(DISTINCT session_id) FILTER (WHERE event_type = 'contract_scroll_25') AS scroll_25,
           count(DISTINCT session_id) FILTER (WHERE event_type = 'contract_scroll_50') AS scroll_50,
           count(DISTINCT session_id) FILTER (WHERE event_type = 'contract_scroll_75') AS scroll_75,
           count(DISTINCT session_id) FILTER (WHERE event_type = 'contract_scroll_90') AS scroll_90,
           count(DISTINCT session_id) FILTER (WHERE event_type = 'contract_scroll_100') AS scroll_100,
           count(DISTINCT session_id) FILTER (WHERE event_type = 'contract_accept') AS accepted
         FROM analytics_events
         WHERE occurred_at >= $1 AND occurred_at < $2 AND event_type LIKE 'contract_%'`,
        [from, to],
      ),
      pool.query(
        `SELECT payload->>'stepName' AS step_name,
                count(DISTINCT session_id) FILTER (WHERE event_type = 'form_step_view') AS entered,
                count(DISTINCT session_id) FILTER (WHERE event_type = 'form_step_complete') AS completed,
                count(DISTINCT session_id) FILTER (WHERE event_type = 'form_step_back') AS went_back,
                count(DISTINCT session_id) FILTER (WHERE event_type = 'form_abandon') AS abandoned
         FROM analytics_events
         WHERE occurred_at >= $1 AND occurred_at < $2 AND event_type IN ('form_step_view','form_step_complete','form_step_back','form_abandon')
         GROUP BY 1`,
        [from, to],
      ),
      pool.query(
        `SELECT payload->>'field' AS field,
                count(*) FILTER (WHERE event_type = 'field_focus') AS focus_count,
                count(*) FILTER (WHERE event_type = 'field_completed') AS completed_count,
                count(*) FILTER (WHERE event_type = 'field_error') AS error_count
         FROM analytics_events
         WHERE occurred_at >= $1 AND occurred_at < $2 AND event_type IN ('field_focus','field_completed','field_error')
         GROUP BY 1`,
        [from, to],
      ),
      pool.query(
        `SELECT coalesce(payload->>'elementId', payload->>'elementText', 'noma''lum') AS element, count(*) AS clicks
         FROM analytics_events
         WHERE occurred_at >= $1 AND occurred_at < $2 AND event_type IN ('button_click','cta_click')
         GROUP BY 1 ORDER BY clicks DESC LIMIT 10`,
        [from, to],
      ),
      pool.query(
        `SELECT coalesce(device_type,'unknown') AS device_type, count(*) AS sessions,
                count(*) FILTER (WHERE is_converted) AS conversions
         FROM analytics_sessions WHERE started_at >= $1 AND started_at < $2 GROUP BY 1`,
        [from, to],
      ),
      pool.query(
        `SELECT coalesce(traffic_source,'Direct') AS traffic_source, count(*) AS sessions,
                count(*) FILTER (WHERE is_converted) AS conversions
         FROM analytics_sessions WHERE started_at >= $1 AND started_at < $2 GROUP BY 1 ORDER BY sessions DESC LIMIT 10`,
        [from, to],
      ),
    ]);

  const visitors = Number(visitorsRes.rows[0].visitors);
  const sessions = Number(visitorsRes.rows[0].sessions);

  const funnel = [{ key: 'visitors', label: 'Tashriflar', sessions: visitors }, ...funnelRows];

  const contract = contractRes.rows[0]
    ? Object.fromEntries(Object.entries(contractRes.rows[0]).map(([k, v]) => [k, Number(v)]))
    : {};

  const formSteps = FORM_STEPS.map((step) => {
    const row = stepRows.rows.find((r) => r.step_name === step.name);
    return {
      step: step.name,
      label: step.label,
      entered: Number(row?.entered ?? 0),
      completed: Number(row?.completed ?? 0),
      wentBack: Number(row?.went_back ?? 0),
      abandoned: Number(row?.abandoned ?? 0),
    };
  });

  const formFields = fieldRows.rows.map((r) => ({
    field: r.field,
    focusCount: Number(r.focus_count),
    completedCount: Number(r.completed_count),
    errorCount: Number(r.error_count),
    completionRate: Number(r.focus_count) > 0 ? Math.round((Number(r.completed_count) / Number(r.focus_count)) * 1000) / 10 : null,
  }));

  const topCtas = ctaRows.rows.map((r) => ({ element: r.element, clicks: Number(r.clicks) }));
  const devices = deviceRows.rows.map((r) => ({
    deviceType: r.device_type,
    sessions: Number(r.sessions),
    conversions: Number(r.conversions),
    conversionRate: Number(r.sessions) > 0 ? Math.round((Number(r.conversions) / Number(r.sessions)) * 1000) / 10 : 0,
  }));
  const trafficSources = trafficRows.rows.map((r) => ({
    trafficSource: r.traffic_source,
    sessions: Number(r.sessions),
    conversions: Number(r.conversions),
    conversionRate: Number(r.sessions) > 0 ? Math.round((Number(r.conversions) / Number(r.sessions)) * 1000) / 10 : 0,
  }));

  const applicationsSubmitted = funnel.find((f) => f.key === 'application_submit')?.sessions ?? 0;
  const conversionRate = visitors > 0 ? Math.round((applicationsSubmitted / visitors) * 10000) / 100 : 0;

  return {
    range: { from, to },
    visitors,
    sessions,
    conversionRate,
    funnel,
    contract,
    formSteps,
    formFields,
    topCtas,
    devices,
    trafficSources,
  };
}
