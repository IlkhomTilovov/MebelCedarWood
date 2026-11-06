export const shorthands = undefined;

// Ingestion navbati tufayli analytics_sessions qatori hali yozilmagan bo'lishi mumkin —
// recording chunk'lari esa darhol kelishi kerak, shuning uchun FK ularni rad etib
// yubormasligi uchun olib tashlanadi (analytics_events/page_views'da ham FK yo'q,
// xuddi shu sababdan).
export async function up(pgm) {
  pgm.sql(`ALTER TABLE analytics_recordings DROP CONSTRAINT IF EXISTS analytics_recordings_session_id_fkey;`);
  // Har sessiya uchun bitta recording qatori — chunk kelganda upsert qilish uchun.
  pgm.sql(`ALTER TABLE analytics_recordings ADD CONSTRAINT analytics_recordings_session_id_key UNIQUE (session_id);`);
}

export async function down(pgm) {
  pgm.sql(`ALTER TABLE analytics_recordings DROP CONSTRAINT IF EXISTS analytics_recordings_session_id_key;`);
  pgm.sql(`ALTER TABLE analytics_recordings
    ADD CONSTRAINT analytics_recordings_session_id_fkey
    FOREIGN KEY (session_id) REFERENCES analytics_sessions (session_id) ON DELETE CASCADE;`);
}
