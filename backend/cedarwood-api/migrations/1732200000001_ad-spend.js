export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    CREATE TABLE ad_spend_daily (
      id bigserial PRIMARY KEY,
      platform text NOT NULL DEFAULT 'facebook',
      stat_date date NOT NULL,
      campaign_id text,
      campaign_name text,
      adset_id text,
      adset_name text,
      ad_id text NOT NULL,
      ad_name text,
      spend numeric(12,2) NOT NULL DEFAULT 0,
      impressions bigint NOT NULL DEFAULT 0,
      clicks bigint NOT NULL DEFAULT 0,
      reach bigint NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (platform, stat_date, ad_id)
    );
  `);
  pgm.sql(`CREATE INDEX ad_spend_daily_date_idx ON ad_spend_daily (stat_date DESC);`);
  pgm.sql(`CREATE INDEX ad_spend_daily_campaign_idx ON ad_spend_daily (campaign_name);`);
  pgm.sql(`CREATE INDEX ad_spend_daily_ad_name_idx ON ad_spend_daily (ad_name);`);
}

export async function down(pgm) {
  pgm.sql(`DROP TABLE IF EXISTS ad_spend_daily;`);
}
