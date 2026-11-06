import bcrypt from 'bcryptjs';
import { pool } from '../db/pool.js';

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

if (!username || !password) {
  console.error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env to seed the admin account');
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);

await pool.query(
  `INSERT INTO admin_users (username, password_hash)
   VALUES ($1, $2)
   ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
  [username, passwordHash],
);

console.log(`Admin user "${username}" seeded/updated.`);
await pool.end();
