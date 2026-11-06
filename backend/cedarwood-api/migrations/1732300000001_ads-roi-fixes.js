export const shorthands = undefined;

export async function up(pgm) {
  // Reklama ID bo'yicha aniq bog'lash uchun (nom bo'yicha moslashtirish bir xil nomli
  // reklamalarni turli ad set'larda noto'g'ri qo'shib yuborgan edi).
  pgm.sql(`ALTER TABLE analytics_sessions ADD COLUMN utm_id text;`);
  pgm.sql(`CREATE INDEX analytics_sessions_utm_id_idx ON analytics_sessions (utm_id);`);

  // Facebook Instant Form/Messaging kabi reklamalar uchun lead saytga umuman kirmaydi —
  // Meta Insights'ning o'z "actions" maydonidagi lead sonini alohida saqlaymiz.
  pgm.sql(`ALTER TABLE ad_spend_daily ADD COLUMN meta_leads bigint NOT NULL DEFAULT 0;`);
}

export async function down(pgm) {
  pgm.sql(`ALTER TABLE ad_spend_daily DROP COLUMN IF EXISTS meta_leads;`);
  pgm.sql(`ALTER TABLE analytics_sessions DROP COLUMN IF EXISTS utm_id;`);
}
