const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.mebel.com.uz';
const EVENTS_URL = `${API_BASE_URL}/api/events`;

const VISITOR_ID_KEY = 'cw_visitor_id';
const VISITOR_COOKIE = 'cw_vid';
const SESSION_ID_KEY = 'cw_session_id';
const SESSION_META_KEY = 'cw_session_meta';
const SESSION_LAST_ACTIVITY_KEY = 'cw_session_last_activity';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

const FLUSH_DEBOUNCE_MS = 2000;
const FLUSH_QUEUE_SIZE = 20;

interface TrackedEvent {
  type: string;
  occurredAt: string;
  pagePath: string | null;
  pageUrl?: string | null;
  pageTitle?: string | null;
  payload?: Record<string, unknown>;
}

interface SessionMeta {
  trafficSource: string;
  utm: { source?: string; medium?: string; campaign?: string; content?: string; term?: string };
  referrer: string;
  landingPage: string;
}

function readCookie(name: string): string | null {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  try {
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
  } catch {
    // brauzer cookie yozishni bloklagan bo'lsa ham asosiy sayt ishlashda davom etadi
  }
}

function createId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

let cachedVisitorId: string | null = null;
let visitorIsNew = false;

export function getOrCreateVisitorId(): { id: string; isNew: boolean } {
  if (cachedVisitorId) return { id: cachedVisitorId, isNew: visitorIsNew };

  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY) ?? readCookie(VISITOR_COOKIE);
    if (existing) {
      localStorage.setItem(VISITOR_ID_KEY, existing);
      writeCookie(VISITOR_COOKIE, existing, 2 * 365 * 24 * 60 * 60);
      cachedVisitorId = existing;
      visitorIsNew = false;
      return { id: existing, isNew: false };
    }
  } catch {
    // storage mavjud emas (masalan, private mode) — yangi id yaratiladi
  }

  const id = createId();
  try {
    localStorage.setItem(VISITOR_ID_KEY, id);
  } catch {
    /* noop */
  }
  writeCookie(VISITOR_COOKIE, id, 2 * 365 * 24 * 60 * 60);
  cachedVisitorId = id;
  visitorIsNew = true;
  return { id, isNew: true };
}

function classifyTrafficSource(url: URL, referrer: string): string {
  const utmSource = url.searchParams.get('utm_source')?.toLowerCase();
  if (utmSource) {
    if (utmSource.includes('instagram')) return 'Instagram';
    if (utmSource.includes('facebook') || utmSource === 'fb') return 'Facebook';
    if (utmSource.includes('google')) return 'Google';
    if (utmSource.includes('telegram')) return 'Telegram';
    if (utmSource.includes('youtube')) return 'YouTube';
    return 'Other';
  }

  if (!referrer) return 'Direct';

  let referrerHost = '';
  try {
    referrerHost = new URL(referrer).hostname;
  } catch {
    return 'Direct';
  }

  if (referrerHost.includes(window.location.hostname)) return 'Direct';
  if (/instagram\./.test(referrerHost)) return 'Instagram';
  if (/facebook\.|fb\.com/.test(referrerHost)) return 'Facebook';
  if (/google\./.test(referrerHost)) return 'Google';
  if (/t\.me|telegram\./.test(referrerHost)) return 'Telegram';
  if (/youtube\.|youtu\.be/.test(referrerHost)) return 'YouTube';
  return 'Referral';
}

function buildSessionMeta(): SessionMeta {
  const url = new URL(window.location.href);
  const referrer = document.referrer ?? '';
  return {
    trafficSource: classifyTrafficSource(url, referrer),
    utm: {
      source: url.searchParams.get('utm_source') ?? undefined,
      medium: url.searchParams.get('utm_medium') ?? undefined,
      campaign: url.searchParams.get('utm_campaign') ?? undefined,
      content: url.searchParams.get('utm_content') ?? undefined,
      term: url.searchParams.get('utm_term') ?? undefined,
    },
    referrer,
    landingPage: url.pathname,
  };
}

let cachedSessionId: string | null = null;
let cachedSessionMeta: SessionMeta | null = null;

function getOrCreateSession(): { id: string; isNew: boolean; meta: SessionMeta } {
  const now = Date.now();

  try {
    const lastActivityRaw = localStorage.getItem(SESSION_LAST_ACTIVITY_KEY);
    const lastActivity = lastActivityRaw ? Number(lastActivityRaw) : 0;
    const expired = !lastActivity || now - lastActivity > SESSION_TIMEOUT_MS;
    const storedSessionId = sessionStorage.getItem(SESSION_ID_KEY);

    if (!expired && storedSessionId && cachedSessionId === storedSessionId) {
      localStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(now));
      return { id: storedSessionId, isNew: false, meta: cachedSessionMeta ?? buildSessionMeta() };
    }

    if (!expired && storedSessionId && !cachedSessionId) {
      const storedMetaRaw = sessionStorage.getItem(SESSION_META_KEY);
      cachedSessionId = storedSessionId;
      cachedSessionMeta = storedMetaRaw ? JSON.parse(storedMetaRaw) : buildSessionMeta();
      localStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(now));
      return { id: storedSessionId, isNew: false, meta: cachedSessionMeta ?? buildSessionMeta() };
    }
  } catch {
    // storage mavjud emas — har safar yangi sessiya hisoblanadi
  }

  const id = createId();
  const meta = buildSessionMeta();
  cachedSessionId = id;
  cachedSessionMeta = meta;
  try {
    sessionStorage.setItem(SESSION_ID_KEY, id);
    sessionStorage.setItem(SESSION_META_KEY, JSON.stringify(meta));
    localStorage.setItem(SESSION_LAST_ACTIVITY_KEY, String(now));
  } catch {
    /* noop */
  }
  return { id, isNew: true, meta };
}

let queue: TrackedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, FLUSH_DEBOUNCE_MS);
}

function buildBatchBody(events: TrackedEvent[]) {
  const { id: visitorId, isNew: isNewVisitor } = getOrCreateVisitorId();
  const { id: sessionId, isNew: isNewSession, meta } = getOrCreateSession();

  return {
    visitorId,
    sessionId,
    isNewVisitor,
    isNewSession,
    device: {
      screenWidth: window.screen?.width,
      screenHeight: window.screen?.height,
      language: navigator.language,
    },
    utm: meta.utm,
    trafficSource: meta.trafficSource,
    referrer: meta.referrer,
    landingPage: meta.landingPage,
    events,
  };
}

function flush(useBeacon = false) {
  if (queue.length === 0) return;
  const batch = queue;
  queue = [];

  let body: string;
  try {
    body = JSON.stringify(buildBatchBody(batch));
  } catch {
    return;
  }

  try {
    if (useBeacon && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(EVENTS_URL, blob);
      return;
    }
    fetch(EVENTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      // tarmoq xatosi — analytics yo'qoladi, asosiy sayt buzilmaydi
    });
  } catch {
    // hech qanday holatda asosiy sayt ishlashiga xalaqit bermaydi
  }
}

export function enqueueEvent(event: TrackedEvent) {
  queue.push(event);
  if (queue.length >= FLUSH_QUEUE_SIZE) {
    flush();
  } else {
    scheduleFlush();
  }
}

export function flushNow() {
  flush();
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true);
  });
  window.addEventListener('pagehide', () => flush(true));
}
