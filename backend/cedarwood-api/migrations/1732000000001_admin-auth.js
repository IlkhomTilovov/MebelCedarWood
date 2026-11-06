export const shorthands = undefined;

export async function up(pgm) {
  pgm.createExtension('pgcrypto', { ifNotExists: true });

  pgm.sql(`
    CREATE TABLE admin_users (
      id bigserial PRIMARY KEY,
      username text UNIQUE NOT NULL,
      password_hash text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  pgm.sql(`
    CREATE TABLE admin_sessions (
      id text PRIMARY KEY,
      admin_user_id bigint NOT NULL REFERENCES admin_users (id) ON DELETE CASCADE,
      created_at timestamptz NOT NULL DEFAULT now(),
      last_seen_at timestamptz NOT NULL DEFAULT now(),
      expires_at timestamptz NOT NULL
    );
  `);

  pgm.sql(`CREATE INDEX admin_sessions_expires_at_idx ON admin_sessions (expires_at);`);
}

export async function down(pgm) {
  pgm.sql(`DROP TABLE IF EXISTS admin_sessions;`);
  pgm.sql(`DROP TABLE IF EXISTS admin_users;`);
}
