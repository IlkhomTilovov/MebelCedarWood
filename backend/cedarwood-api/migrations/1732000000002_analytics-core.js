export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    CREATE TABLE analytics_visitors (
      visitor_id uuid PRIMARY KEY,
      first_seen_at timestamptz NOT NULL DEFAULT now(),
      last_seen_at timestamptz NOT NULL DEFAULT now(),
      visit_count int NOT NULL DEFAULT 1,
      device_type text,
      browser text,
      os text,
      screen_width int,
      screen_height int,
      language text,
      country text DEFAULT 'UZ',
      region text,
      first_traffic_source text,
      first_utm_source text,
      first_utm_medium text,
      first_utm_campaign text,
      first_utm_content text,
      first_utm_term text,
      first_landing_page text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  pgm.sql(`CREATE INDEX analytics_visitors_last_seen_at_idx ON analytics_visitors (last_seen_at DESC);`);

  pgm.sql(`
    CREATE TABLE analytics_sessions (
      session_id uuid PRIMARY KEY,
      visitor_id uuid NOT NULL REFERENCES analytics_visitors (visitor_id) ON DELETE CASCADE,
      started_at timestamptz NOT NULL,
      ended_at timestamptz,
      duration_seconds int,
      entry_page text,
      exit_page text,
      page_view_count int NOT NULL DEFAULT 0,
      click_count int NOT NULL DEFAULT 0,
      max_scroll_depth smallint NOT NULL DEFAULT 0,
      traffic_source text,
      utm_source text,
      utm_medium text,
      utm_campaign text,
      utm_content text,
      utm_term text,
      referrer text,
      device_type text,
      browser text,
      os text,
      region text,
      is_converted boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  pgm.sql(`CREATE INDEX analytics_sessions_visitor_id_idx ON analytics_sessions (visitor_id);`);
  pgm.sql(`CREATE INDEX analytics_sessions_started_at_idx ON analytics_sessions (started_at DESC);`);
  pgm.sql(`CREATE INDEX analytics_sessions_utm_campaign_idx ON analytics_sessions (utm_campaign);`);

  pgm.sql(`
    CREATE TABLE analytics_page_views (
      id bigserial PRIMARY KEY,
      visitor_id uuid NOT NULL,
      session_id uuid NOT NULL REFERENCES analytics_sessions (session_id) ON DELETE CASCADE,
      page_url text,
      page_path text,
      page_title text,
      referrer text,
      entered_at timestamptz NOT NULL,
      time_on_page_seconds int,
      max_scroll_depth smallint NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  pgm.sql(`CREATE INDEX analytics_page_views_session_id_idx ON analytics_page_views (session_id);`);
  pgm.sql(`CREATE INDEX analytics_page_views_path_entered_idx ON analytics_page_views (page_path, entered_at DESC);`);
}

export async function down(pgm) {
  pgm.sql(`DROP TABLE IF EXISTS analytics_page_views;`);
  pgm.sql(`DROP TABLE IF EXISTS analytics_sessions;`);
  pgm.sql(`DROP TABLE IF EXISTS analytics_visitors;`);
}
