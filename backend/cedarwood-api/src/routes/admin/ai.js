import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../db/pool.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { getWeekStart } from '../../services/dateRange.js';
import { buildAnalyticsSummary } from '../../services/analyticsSummary.js';
import { analyzeAndSummarize, answerQuestion } from '../../services/aiAnalyst.js';

export const adminAiRouter = Router();
adminAiRouter.use(requireAdmin);

function toDateOnly(value) {
  const d = value ? new Date(value) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

async function saveInsights(insightDate, insights) {
  const ids = [];
  for (const insight of insights) {
    const { rows } = await pool.query(
      `INSERT INTO analytics_ai_insights (insight_date, type, severity, title, description, evidence, recommendation, priority)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [
        insightDate,
        insight.type ?? 'funnel_drop_off',
        insight.severity ?? 'medium',
        insight.title ?? '',
        insight.description ?? '',
        JSON.stringify(insight.evidence ?? {}),
        insight.recommendation ?? null,
        insight.priority ?? 'medium',
      ],
    );
    ids.push(rows[0].id);
  }
  return ids;
}

adminAiRouter.get(
  '/insights',
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const { rows } = status
      ? await pool.query(`SELECT * FROM analytics_ai_insights WHERE status = $1 ORDER BY created_at DESC LIMIT 200`, [status])
      : await pool.query(`SELECT * FROM analytics_ai_insights ORDER BY created_at DESC LIMIT 200`);
    res.json(rows);
  }),
);

const statusSchema = z.object({ status: z.enum(['new', 'in_progress', 'done', 'dismissed']) });

adminAiRouter.patch(
  '/insights/:id',
  asyncHandler(async (req, res) => {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_payload' });

    const { rows } = await pool.query(
      `UPDATE analytics_ai_insights SET status = $1, updated_at = now() WHERE id = $2 RETURNING *`,
      [parsed.data.status, req.params.id],
    );
    if (rows.length === 0) return res.status(404).json({ error: 'not_found' });
    res.json(rows[0]);
  }),
);

adminAiRouter.post(
  '/daily-report',
  asyncHandler(async (req, res) => {
    const reportDate = toDateOnly(req.query.date);
    const regenerate = req.query.regenerate === 'true';
    const dateKey = reportDate.toISOString().slice(0, 10);

    if (!regenerate) {
      const { rows } = await pool.query(`SELECT * FROM analytics_daily_reports WHERE report_date = $1`, [dateKey]);
      if (rows.length > 0) return res.json(rows[0]);
    }

    const rangeEnd = new Date(reportDate);
    rangeEnd.setDate(rangeEnd.getDate() + 1);

    const summary = await buildAnalyticsSummary(reportDate, rangeEnd);
    const { summary: aiSummary, insights } = await analyzeAndSummarize(summary);
    const insightIds = await saveInsights(dateKey, insights);

    const { rows } = await pool.query(
      `INSERT INTO analytics_daily_reports (report_date, summary, ai_summary, ai_insight_ids)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (report_date) DO UPDATE SET summary = EXCLUDED.summary, ai_summary = EXCLUDED.ai_summary, ai_insight_ids = EXCLUDED.ai_insight_ids
       RETURNING *`,
      [dateKey, JSON.stringify(summary), aiSummary, insightIds],
    );
    res.json(rows[0]);
  }),
);

adminAiRouter.get(
  '/daily-report',
  asyncHandler(async (req, res) => {
    const dateKey = toDateOnly(req.query.date).toISOString().slice(0, 10);
    const { rows } = await pool.query(`SELECT * FROM analytics_daily_reports WHERE report_date = $1`, [dateKey]);
    if (rows.length === 0) return res.status(404).json({ error: 'not_generated' });
    res.json(rows[0]);
  }),
);

adminAiRouter.post(
  '/weekly-report',
  asyncHandler(async (req, res) => {
    const weekStart = getWeekStart(req.query.week ? new Date(req.query.week) : new Date());
    const regenerate = req.query.regenerate === 'true';
    const weekKey = weekStart.toISOString().slice(0, 10);

    if (!regenerate) {
      const { rows } = await pool.query(`SELECT * FROM analytics_weekly_reports WHERE week_start_date = $1`, [weekKey]);
      if (rows.length > 0) return res.json(rows[0]);
    }

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);

    const [summary, prevSummary] = await Promise.all([
      buildAnalyticsSummary(weekStart, weekEnd),
      buildAnalyticsSummary(prevWeekStart, weekStart),
    ]);

    const comparison = {
      visitors: { current: summary.visitors, previous: prevSummary.visitors },
      conversionRate: { current: summary.conversionRate, previous: prevSummary.conversionRate },
    };

    const { summary: aiSummary, insights } = await analyzeAndSummarize({ ...summary, comparisonToPreviousWeek: comparison });
    await saveInsights(weekKey, insights);

    const { rows } = await pool.query(
      `INSERT INTO analytics_weekly_reports (week_start_date, summary, comparison, ai_summary)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (week_start_date) DO UPDATE SET summary = EXCLUDED.summary, comparison = EXCLUDED.comparison, ai_summary = EXCLUDED.ai_summary
       RETURNING *`,
      [weekKey, JSON.stringify(summary), JSON.stringify(comparison), aiSummary],
    );
    res.json(rows[0]);
  }),
);

adminAiRouter.get(
  '/weekly-report',
  asyncHandler(async (req, res) => {
    const weekKey = getWeekStart(req.query.week ? new Date(req.query.week) : new Date()).toISOString().slice(0, 10);
    const { rows } = await pool.query(`SELECT * FROM analytics_weekly_reports WHERE week_start_date = $1`, [weekKey]);
    if (rows.length === 0) return res.status(404).json({ error: 'not_generated' });
    res.json(rows[0]);
  }),
);

const chatSchema = z.object({ question: z.string().min(2).max(500) });

adminAiRouter.post(
  '/chat',
  asyncHandler(async (req, res) => {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_payload' });

    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    const summary = await buildAnalyticsSummary(from, to);
    const answer = await answerQuestion(parsed.data.question, summary);
    res.json({ answer });
  }),
);

const abTestSchema = z.object({
  testKey: z.string().min(1).max(64),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  variantALabel: z.string().min(1).max(200),
  variantBLabel: z.string().min(1).max(200),
  goalMetric: z.string().max(64).optional(),
});

adminAiRouter.get(
  '/ab-tests',
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`SELECT * FROM analytics_ab_tests ORDER BY created_at DESC`);
    res.json(rows);
  }),
);

adminAiRouter.post(
  '/ab-tests',
  asyncHandler(async (req, res) => {
    const parsed = abTestSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid_payload' });
    const d = parsed.data;

    const { rows } = await pool.query(
      `INSERT INTO analytics_ab_tests (test_key, name, description, variant_a_label, variant_b_label, goal_metric, status, started_at)
       VALUES ($1,$2,$3,$4,$5,$6,'running', now())
       ON CONFLICT (test_key) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description,
         variant_a_label = EXCLUDED.variant_a_label, variant_b_label = EXCLUDED.variant_b_label, goal_metric = EXCLUDED.goal_metric
       RETURNING *`,
      [d.testKey, d.name, d.description ?? null, d.variantALabel, d.variantBLabel, d.goalMetric ?? null],
    );
    res.json(rows[0]);
  }),
);

adminAiRouter.get(
  '/ab-tests/:testKey/results',
  asyncHandler(async (req, res) => {
    const { testKey } = req.params;
    const { rows: testRows } = await pool.query(`SELECT * FROM analytics_ab_tests WHERE test_key = $1`, [testKey]);
    if (testRows.length === 0) return res.status(404).json({ error: 'not_found' });
    const test = testRows[0];
    const goalMetric = test.goal_metric ?? 'form_submit';

    const { rows } = await pool.query(
      `WITH exposures AS (
         SELECT session_id, payload->>'variant' AS variant, min(occurred_at) AS exposed_at
         FROM analytics_events
         WHERE event_type = 'ab_test_exposure' AND payload->>'testKey' = $1
         GROUP BY session_id, payload->>'variant'
       )
       SELECT e.variant,
              count(DISTINCT e.session_id) AS exposed_sessions,
              count(DISTINCT c.session_id) AS converted_sessions
       FROM exposures e
       LEFT JOIN analytics_events c
         ON c.session_id = e.session_id AND c.event_type = $2 AND c.occurred_at >= e.exposed_at
       GROUP BY e.variant`,
      [testKey, goalMetric],
    );

    const results = rows.map((r) => ({
      variant: r.variant,
      exposedSessions: Number(r.exposed_sessions),
      convertedSessions: Number(r.converted_sessions),
      conversionRate:
        Number(r.exposed_sessions) > 0 ? Math.round((Number(r.converted_sessions) / Number(r.exposed_sessions)) * 1000) / 10 : 0,
    }));

    res.json({ test, results });
  }),
);
