export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    CREATE TABLE analytics_ai_insights (
      id bigserial PRIMARY KEY,
      insight_date date NOT NULL,
      type text NOT NULL,
      severity text NOT NULL,
      title text NOT NULL,
      description text NOT NULL,
      evidence jsonb NOT NULL DEFAULT '{}',
      recommendation text,
      priority text NOT NULL DEFAULT 'medium',
      status text NOT NULL DEFAULT 'new',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  pgm.sql(`CREATE INDEX analytics_ai_insights_date_idx ON analytics_ai_insights (insight_date DESC);`);
  pgm.sql(`CREATE INDEX analytics_ai_insights_status_idx ON analytics_ai_insights (status);`);

  pgm.sql(`
    CREATE TABLE analytics_ab_tests (
      id bigserial PRIMARY KEY,
      test_key text UNIQUE NOT NULL,
      name text NOT NULL,
      description text,
      variant_a_label text NOT NULL,
      variant_b_label text NOT NULL,
      goal_metric text,
      status text NOT NULL DEFAULT 'draft',
      started_at timestamptz,
      ended_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  pgm.sql(`
    CREATE TABLE analytics_daily_reports (
      id bigserial PRIMARY KEY,
      report_date date UNIQUE NOT NULL,
      summary jsonb NOT NULL,
      ai_summary text,
      ai_insight_ids bigint[] NOT NULL DEFAULT '{}',
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  pgm.sql(`
    CREATE TABLE analytics_weekly_reports (
      id bigserial PRIMARY KEY,
      week_start_date date UNIQUE NOT NULL,
      summary jsonb NOT NULL,
      comparison jsonb,
      ai_summary text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

export async function down(pgm) {
  pgm.sql(`DROP TABLE IF EXISTS analytics_weekly_reports;`);
  pgm.sql(`DROP TABLE IF EXISTS analytics_daily_reports;`);
  pgm.sql(`DROP TABLE IF EXISTS analytics_ab_tests;`);
  pgm.sql(`DROP TABLE IF EXISTS analytics_ai_insights;`);
}
