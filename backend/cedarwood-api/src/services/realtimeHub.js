const LIVE_TTL_MS = 60_000;
const BROADCAST_INTERVAL_MS = 4_000;

const liveSessions = new Map(); // sessionId -> { visitorId, deviceType, trafficSource, currentPage, enteredAt, lastSeenAt }
const sseClients = new Set();

export function recordHeartbeat(sessionId, data) {
  const existing = liveSessions.get(sessionId);
  liveSessions.set(sessionId, {
    ...existing,
    ...data,
    enteredAt: existing?.enteredAt ?? Date.now(),
    lastSeenAt: Date.now(),
  });
}

function pruneExpired() {
  const now = Date.now();
  for (const [sessionId, visitor] of liveSessions) {
    if (now - visitor.lastSeenAt > LIVE_TTL_MS) {
      liveSessions.delete(sessionId);
    }
  }
}

export function getSnapshot() {
  pruneExpired();
  const visitors = Array.from(liveSessions.entries()).map(([sessionId, v]) => ({ sessionId, ...v }));
  return { count: visitors.length, visitors };
}

export function addSseClient(res) {
  sseClients.add(res);
}

export function removeSseClient(res) {
  sseClients.delete(res);
}

setInterval(() => {
  if (sseClients.size === 0) return;
  const snapshot = getSnapshot();
  const payload = `data: ${JSON.stringify(snapshot)}\n\n`;
  for (const res of sseClients) {
    res.write(payload);
  }
}, BROADCAST_INTERVAL_MS);
