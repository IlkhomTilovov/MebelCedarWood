import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.mebel.com.uz';

interface LiveVisitor {
  sessionId: string;
  visitorId: string;
  deviceType: string | null;
  trafficSource: string | null;
  currentPage: string | null;
  enteredAt: number;
  lastSeenAt: number;
}

interface Snapshot {
  count: number;
  visitors: LiveVisitor[];
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function RealtimePage() {
  const [snapshot, setSnapshot] = useState<Snapshot>({ count: 0, visitors: [] });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const source = new EventSource(`${API_BASE_URL}/api/admin/realtime/stream`, { withCredentials: true });
    source.onmessage = (event) => {
      try {
        setSnapshot(JSON.parse(event.data));
      } catch {
        /* noop */
      }
    };
    return () => source.close();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        <h1 className="font-heading text-2xl font-bold text-charcoal">Hozir saytda: {snapshot.count} visitor</h1>
      </div>

      <div className="overflow-x-auto rounded-xl border border-light-gray bg-warm-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-light-gray text-xs font-semibold uppercase tracking-wide text-charcoal/50">
              <th className="px-4 py-3">Visitor</th>
              <th className="px-4 py-3">Qurilma</th>
              <th className="px-4 py-3">Manba</th>
              <th className="px-4 py-3">Hozirgi sahifa</th>
              <th className="px-4 py-3">Davomiylik</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.visitors.map((v) => (
              <tr key={v.sessionId} className="border-b border-light-gray last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-charcoal/70">#{v.visitorId.slice(0, 8)}</td>
                <td className="px-4 py-3 capitalize">{v.deviceType ?? '—'}</td>
                <td className="px-4 py-3">{v.trafficSource ?? 'Direct'}</td>
                <td className="px-4 py-3 text-charcoal/70">{v.currentPage ?? '—'}</td>
                <td className="px-4 py-3 font-mono">{formatDuration(now - v.enteredAt)}</td>
              </tr>
            ))}
            {snapshot.visitors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-charcoal/40">
                  Hozir saytda hech kim yo'q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
