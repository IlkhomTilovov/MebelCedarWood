export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    CREATE TABLE analytics_campaign_daily_stats (
      id bigserial PRIMARY KEY,
      stat_date date NOT NULL,
      utm_source text,
      utm_medium text,
      utm_campaign text,
      visits int NOT NULL DEFAULT 0,
      unique_visitors int NOT NULL DEFAULT 0,
      sessions int NOT NULL DEFAULT 0,
      form_starts int NOT NULL DEFAULT 0,
      leads int NOT NULL DEFAULT 0,
      orders int NOT NULL DEFAULT 0,
      conversion_rate numeric(5,2),
      UNIQUE (stat_date, utm_source, utm_medium, utm_campaign)
    );
  `);

  pgm.sql(`
    CREATE TABLE analytics_click_heatmap (
      page_path text NOT NULL,
      viewport_bucket text NOT NULL,
      x_bucket smallint NOT NULL,
      y_bucket smallint NOT NULL,
      click_count int NOT NULL DEFAULT 0,
      updated_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (page_path, viewport_bucket, x_bucket, y_bucket)
    );
  `);

  pgm.sql(`
    CREATE TABLE analytics_scroll_heatmap (
      page_path text NOT NULL,
      viewport_bucket text NOT NULL,
      depth_bucket smallint NOT NULL,
      visitor_count int NOT NULL DEFAULT 0,
      updated_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (page_path, viewport_bucket, depth_bucket)
    );
  `);
}

export async function down(pgm) {
  pgm.sql(`DROP TABLE IF EXISTS analytics_scroll_heatmap;`);
  pgm.sql(`DROP TABLE IF EXISTS analytics_click_heatmap;`);
  pgm.sql(`DROP TABLE IF EXISTS analytics_campaign_daily_stats;`);
}
