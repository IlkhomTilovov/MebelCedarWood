export const shorthands = undefined;

export async function up(pgm) {
  // Engagement kabi lead kutilmaydigan kampaniyalarni to'g'ri izohlash uchun.
  pgm.sql(`ALTER TABLE ad_spend_daily ADD COLUMN campaign_objective text;`);
}

export async function down(pgm) {
  pgm.sql(`ALTER TABLE ad_spend_daily DROP COLUMN IF EXISTS campaign_objective;`);
}
