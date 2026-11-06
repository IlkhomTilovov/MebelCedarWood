export const shorthands = undefined;

export async function up(pgm) {
  pgm.sql(`
    CREATE TABLE analytics_recordings (
      id bigserial PRIMARY KEY,
      session_id uuid REFERENCES analytics_sessions (session_id) ON DELETE CASCADE,
      started_at timestamptz,
      ended_at timestamptz,
      event_count int NOT NULL DEFAULT 0,
      duration_seconds int,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  pgm.sql(`CREATE INDEX analytics_recordings_session_id_idx ON analytics_recordings (session_id);`);
  pgm.sql(`CREATE INDEX analytics_recordings_created_at_idx ON analytics_recordings (created_at DESC);`);

  pgm.sql(`
    CREATE TABLE analytics_recording_chunks (
      id bigserial PRIMARY KEY,
      recording_id bigint NOT NULL REFERENCES analytics_recordings (id) ON DELETE CASCADE,
      seq int NOT NULL,
      events jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  pgm.sql(`CREATE INDEX analytics_recording_chunks_recording_id_idx ON analytics_recording_chunks (recording_id, seq);`);
}

export async function down(pgm) {
  pgm.sql(`DROP TABLE IF EXISTS analytics_recording_chunks;`);
  pgm.sql(`DROP TABLE IF EXISTS analytics_recordings;`);
}
