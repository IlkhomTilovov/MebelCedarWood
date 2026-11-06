export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    CREATE TABLE analytics_events (
      id bigserial,
      event_type text NOT NULL,
      visitor_id uuid NOT NULL,
      session_id uuid NOT NULL,
      page_path text,
      payload jsonb NOT NULL DEFAULT '{}',
      occurred_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (id, occurred_at)
    ) PARTITION BY RANGE (occurred_at);
  `);

  pgm.sql(`CREATE TABLE analytics_events_default PARTITION OF analytics_events DEFAULT;`);

  pgm.sql(`
    DO $$
    DECLARE
      start_date date := date_trunc('month', now())::date;
      i int;
      part_start date;
      part_end date;
      part_name text;
    BEGIN
      FOR i IN 0..3 LOOP
        part_start := (start_date + (i || ' months')::interval)::date;
        part_end := (start_date + ((i + 1) || ' months')::interval)::date;
        part_name := 'analytics_events_' || to_char(part_start, 'YYYY_MM');
        EXECUTE format(
          'CREATE TABLE IF NOT EXISTS %I PARTITION OF analytics_events FOR VALUES FROM (%L) TO (%L);',
          part_name, part_start, part_end
        );
      END LOOP;
    END $$;
  `);

  pgm.sql(`CREATE INDEX analytics_events_type_occurred_idx ON analytics_events (event_type, occurred_at DESC);`);
  pgm.sql(`CREATE INDEX analytics_events_session_id_idx ON analytics_events (session_id);`);
  pgm.sql(`CREATE INDEX analytics_events_payload_gin_idx ON analytics_events USING gin (payload);`);
}

export async function down(pgm) {
  pgm.sql(`DROP TABLE IF EXISTS analytics_events CASCADE;`);
}
