import { syncAdSpend } from '../services/adSpendSync.js';
import { pool } from '../db/pool.js';

// Kunlik systemd timer orqali ishga tushiriladi — kechagi kun uchun Meta Ads xarajatini tortib oladi.
const until = new Date();
until.setHours(0, 0, 0, 0);
const since = new Date(until);
since.setDate(since.getDate() - 1);

try {
  const count = await syncAdSpend(since, until);
  console.log(`Meta Ads sync: ${count} ta qator yangilandi (${since.toISOString().slice(0, 10)})`);
} catch (err) {
  console.error('Meta Ads sync xatosi', err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
