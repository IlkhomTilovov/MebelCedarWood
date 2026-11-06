import { getOrCreateVisitorId, getOrCreateSession } from './client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.mebel.com.uz';
const RECORDINGS_URL = `${API_BASE_URL}/api/recordings`;
const FLUSH_INTERVAL_MS = 8000;
const MAX_BUFFER_SIZE = 500;

// Hamma tashrif yoziladi (100% sampling) — hozircha trafik kam, keyinroq oshsa
// bu qiymatni kamaytirish mumkin.
const SAMPLING_RATE = 1;

let buffer: unknown[] = [];
let stopFn: (() => void) | null = null;
let flushTimer: ReturnType<typeof setInterval> | null = null;

function flush(useBeacon = false) {
  if (buffer.length === 0) return;
  const events = buffer;
  buffer = [];

  const { id: visitorId } = getOrCreateVisitorId();
  const { id: sessionId } = getOrCreateSession();
  const body = JSON.stringify({ visitorId, sessionId, events });

  try {
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(RECORDINGS_URL, new Blob([body], { type: 'application/json' }));
      return;
    }
    fetch(RECORDINGS_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(
      () => {
        // tarmoq xatosi — recording yo'qoladi, asosiy sayt buzilmaydi
      },
    );
  } catch {
    /* noop */
  }
}

// Shu sessiyada bir marta ishga tushadi. Maxfiy ma'lumotlar (parol, forma qiymatlari)
// hech qachon yozilmaydi — faqat sahifa tuzilishi/sichqoncha/scroll.
export function startSessionRecording() {
  if (stopFn || Math.random() >= SAMPLING_RATE) return;

  import('rrweb')
    .then(({ record }) => {
      const stop = record({
        emit(event) {
          buffer.push(event);
          if (buffer.length >= MAX_BUFFER_SIZE) flush();
        },
        maskAllInputs: true,
        maskInputOptions: {
          password: true,
          text: true,
          email: true,
          tel: true,
          number: true,
          search: true,
          textarea: true,
          select: true,
        },
        maskTextSelector: 'input, textarea, select',
        blockSelector: '[data-no-record]',
        recordCanvas: false,
        collectFonts: false,
        sampling: { mousemove: true, mouseInteraction: true, scroll: 150, input: 'last' },
      });

      stopFn = stop ?? null;
      flushTimer = setInterval(() => flush(), FLUSH_INTERVAL_MS);
      window.addEventListener('pagehide', () => flush(true));
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flush(true);
      });
    })
    .catch(() => {
      // rrweb yuklanmasa ham asosiy sayt ishlashda davom etadi
    });
}

export function stopSessionRecording() {
  stopFn?.();
  stopFn = null;
  if (flushTimer) clearInterval(flushTimer);
  flush(true);
}
