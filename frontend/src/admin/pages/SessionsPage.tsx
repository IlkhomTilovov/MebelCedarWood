import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, exportUrl } from '@/admin/adminApi';
import { DateRangeFilter } from '@/admin/components/DateRangeFilter';
import { IntentBadge } from '@/admin/components/IntentBadge';
import { useDateRangeFilter } from '@/admin/useDateRangeFilter';

interface SessionRow {
  session_id: string;
  visitor_id: string;
  started_at: string;
  duration_seconds: number | null;
  entry_page: string | null;
  exit_page: string | null;
  page_view_count: number;
  click_count: number;
  max_scroll_depth: number;
  traffic_source: string | null;
  device_type: string | null;
  region: string | null;
  is_converted: boolean;
  intent_score: number;
  intent_label: string;
}

export function SessionsPage() {
  const { range, setRange, params } = useDateRangeFilter();
  const [sessions, setSessions] = useState<SessionRow[]>([]);

  useEffect(() => {
    adminApi
      .get<{ sessions: SessionRow[] }>('/sessions', params)
      .then((r) => setSessions(r.sessions))
      .catch(() => setSessions([]));
  }, [params.range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-charcoal">Tashriflar</h1>
        <div className="flex items-center gap-3">
          <DateRangeFilter value={range} onChange={setRange} />
          <a href={exportUrl('/export/sessions.csv', params)} className="rounded-lg border border-light-gray px-3 py-1.5 text-xs font-semibold text-charcoal/70 hover:text-charcoal">
            CSV eksport
          </a>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-light-gray bg-warm-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-light-gray text-xs font-semibold uppercase tracking-wide text-charcoal/50">
              <th className="px-4 py-3">Boshlandi</th>
              <th className="px-4 py-3">Visitor</th>
              <th className="px-4 py-3">Manba</th>
              <th className="px-4 py-3">Qurilma</th>
              <th className="px-4 py-3">Hudud</th>
              <th className="px-4 py-3">Sahifalar</th>
              <th className="px-4 py-3">Davomiylik</th>
              <th className="px-4 py-3">Intent</th>
              <th className="px-4 py-3">Konversiya</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.session_id} className="border-b border-light-gray last:border-0">
                <td className="px-4 py-3 text-charcoal/70">{new Date(s.started_at).toLocaleString('uz-UZ')}</td>
                <td className="px-4 py-3">
                  <Link to={`/admin/visitors/${s.visitor_id}`} className="font-mono text-xs text-gold hover:underline">
                    #{s.visitor_id.slice(0, 8)}
                  </Link>
                </td>
                <td className="px-4 py-3">{s.traffic_source ?? 'Direct'}</td>
                <td className="px-4 py-3 capitalize">{s.device_type ?? '—'}</td>
                <td className="px-4 py-3">{s.region ?? '—'}</td>
                <td className="px-4 py-3">{s.page_view_count}</td>
                <td className="px-4 py-3">{s.duration_seconds ? `${Math.round(s.duration_seconds / 60)} daq` : '—'}</td>
                <td className="px-4 py-3">
                  <IntentBadge score={s.intent_score} label={s.intent_label} />
                </td>
                <td className="px-4 py-3">{s.is_converted ? '✅' : '—'}</td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-charcoal/40">
                  Hozircha ma'lumot yo'q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
