export const shorthands = undefined;

const CONVERSION_EVENT_TYPES = [
  'form_start',
  'form_submit',
  'order_created',
  'telegram_click',
  'phone_click',
  'whatsapp_click',
  'consultation_requested',
];

export async function up(pgm) {
  pgm.sql(`
    CREATE TABLE analytics_alert_rules (
      id bigserial PRIMARY KEY,
      name text NOT NULL,
      metric text NOT NULL,
      comparison_type text NOT NULL,
      threshold_value numeric NOT NULL,
      lookback_window interval NOT NULL,
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  pgm.sql(`
    CREATE TABLE analytics_alert_events (
      id bigserial PRIMARY KEY,
      rule_id bigint REFERENCES analytics_alert_rules (id) ON DELETE CASCADE,
      fired_at timestamptz NOT NULL DEFAULT now(),
      details jsonb NOT NULL DEFAULT '{}'
    );
  `);

  pgm.sql(`
    CREATE VIEW analytics_conversions_v AS
    SELECT * FROM analytics_events
    WHERE event_type IN (${CONVERSION_EVENT_TYPES.map((t) => `'${t}'`).join(', ')});
  `);
}

export async function down(pgm) {
  pgm.sql(`DROP VIEW IF EXISTS analytics_conversions_v;`);
  pgm.sql(`DROP TABLE IF EXISTS analytics_alert_events;`);
  pgm.sql(`DROP TABLE IF EXISTS analytics_alert_rules;`);
}
