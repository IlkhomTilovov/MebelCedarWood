import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COUNTER_FILE = path.join(__dirname, '..', '..', 'counter.json');

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

function nextApplicationNumber() {
  let value = 0;
  try {
    value = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8')).value ?? 0;
  } catch {
    value = 0;
  }
  value += 1;
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ value }));
  return `CW-${String(value).padStart(5, '0')}`;
}

const HOME_STATUS_LABELS = {
  repaired: "Ta'mir tugagan",
  'in-progress': "Ta'mir jarayonida",
  'not-started': "Ta'mir hali boshlanmagan",
  'new-home': 'Yangi uy',
  other: 'Boshqa',
};

const MEASUREMENT_TIMING_LABELS = {
  today: 'Bugun',
  tomorrow: 'Ertaga',
  'this-week': 'Shu hafta',
  'next-week': 'Keyingi hafta',
  'schedule-later': 'Vaqtni kelishamiz',
};

const READINESS_TIMING_LABELS = {
  '1-2-weeks': '1–2 hafta ichida',
  '2-3-weeks': '2–3 hafta ichida',
  '1-month': '1 oy ichida',
  '1-2-months': '1–2 oy ichida',
  'specific-date': 'Aniq muddatim bor',
};

const START_TIMING_LABELS = {
  asap: 'Imkon qadar tezroq',
  'this-week': 'Shu hafta',
  'next-week': 'Keyingi hafta',
  'next-month': 'Keyingi oy',
  'schedule-later': 'Vaqtni kelishamiz',
};

const CATEGORY_LABELS = {
  kitchen: 'Oshxona mebeli',
  wardrobe: 'Garderob / Shkaf',
  'living-room': 'Mehmonxona mebeli',
  bedroom: 'Yotoqxona mebeli',
  office: 'Ofis mebeli',
  custom: 'Boshqa (individual loyiha)',
};

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatMessage(applicationNumber, form) {
  const personal = form.personalInfo ?? {};
  const order = form.orderRequirements ?? {};
  const categories = (form.furnitureCategories ?? []).map((c) => CATEGORY_LABELS[c] ?? c).join(', ');
  const readiness =
    order.readinessTiming === 'specific-date' && order.specificReadinessDate
      ? order.specificReadinessDate
      : (READINESS_TIMING_LABELS[order.readinessTiming] ?? '');

  const lines = [
    `🆕 <b>Yangi ariza</b> #${applicationNumber}`,
    '',
    `👤 <b>${escapeHtml(personal.fullName)}</b>`,
    `📞 ${escapeHtml(personal.phone)}`,
    personal.telegramUsername ? `✈️ @${escapeHtml(String(personal.telegramUsername).replace(/^@/, ''))}` : null,
    `📍 ${escapeHtml(personal.region)}, ${escapeHtml(personal.district)}`,
    '',
    `🪑 <b>Mebel turi:</b> ${escapeHtml(categories)}`,
    '',
    `🏠 <b>Uy holati:</b> ${HOME_STATUS_LABELS[order.homeStatus] ?? ''}`,
    `📅 <b>O'lchov uchun:</b> ${MEASUREMENT_TIMING_LABELS[order.measurementTiming] ?? ''}`,
    `⏳ <b>Tayyor bo'lish muddati:</b> ${escapeHtml(readiness)}`,
    `⚡ <b>Loyihani boshlash:</b> ${START_TIMING_LABELS[order.startTiming] ?? ''}`,
    order.additionalNotes ? `📝 ${escapeHtml(order.additionalNotes)}` : null,
  ].filter((line) => line !== null);

  return lines.join('\n');
}

export const applicationsRouter = Router();

applicationsRouter.post('/applications', async (req, res) => {
  try {
    const { form } = req.body ?? {};
    if (!form?.personalInfo?.fullName || !form?.personalInfo?.phone) {
      return res.status(400).json({ error: 'invalid_payload' });
    }

    const applicationNumber = nextApplicationNumber();
    const submittedAt = new Date().toISOString();
    const text = formatMessage(applicationNumber, form);

    const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
    });
    const tgData = await tgResponse.json();

    if (!tgData.ok) {
      console.error('Telegram sendMessage failed', tgData);
      return res.status(502).json({ error: 'telegram_failed' });
    }

    res.json({ applicationNumber, submittedAt });
  } catch (err) {
    console.error('submit application error', err);
    res.status(500).json({ error: 'server_error' });
  }
});
