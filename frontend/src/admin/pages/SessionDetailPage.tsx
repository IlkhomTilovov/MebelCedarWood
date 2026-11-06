import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminApi } from '@/admin/adminApi';

interface SessionDetail {
  session_id: string;
  visitor_id: string;
  started_at: string;
  ended_at: string | null;
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
}

interface TimelineEvent {
  event_type: string;
  page_path: string | null;
  payload: Record<string, unknown>;
  occurred_at: string;
}

export function SessionDetailPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    adminApi
      .get<{ session: SessionDetail; timeline: TimelineEvent[] }>(`/sessions/${sessionId}`)
      .then((r) => {
        setSession(r.session);
        setTimeline(r.timeline);
      })
      .catch(() => {
        setSession(null);
        setTimeline([]);
      });
  }, [sessionId]);

  if (!session) return <p className="text-charcoal/50">Yuklanmoqda...</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-charcoal">
        Sessiya — {new Date(session.started_at).toLocaleString('uz-UZ')}
      </h1>
      <Link to={`/admin/visitors/${session.visitor_id}`} className="text-sm text-gold hover:underline">
        Visitor #{session.visitor_id.slice(0, 8)} profili →
      </Link>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-light-gray bg-warm-white p-4 text-sm">
          <div className="text-xs uppercase text-charcoal/50">Davomiylik</div>
          <div className="font-semibold text-charcoal">{session.duration_seconds ? `${Math.round(session.duration_seconds / 60)} daq` : '—'}</div>
        </div>
        <div className="rounded-xl border border-light-gray bg-warm-white p-4 text-sm">
          <div className="text-xs uppercase text-charcoal/50">Sahifalar</div>
          <div className="font-semibold text-charcoal">{session.page_view_count}</div>
        </div>
        <div className="rounded-xl border border-light-gray bg-warm-white p-4 text-sm">
          <div className="text-xs uppercase text-charcoal/50">Click'lar</div>
          <div className="font-semibold text-charcoal">{session.click_count}</div>
        </div>
        <div className="rounded-xl border border-light-gray bg-warm-white p-4 text-sm">
          <div className="text-xs uppercase text-charcoal/50">Scroll</div>
          <div className="font-semibold text-charcoal">{session.max_scroll_depth}%</div>
        </div>
      </div>

      <div className="rounded-xl border border-light-gray bg-warm-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-charcoal">Session timeline</h2>
        <ol className="space-y-2 text-sm">
          {timeline.map((e, i) => (
            <li key={i} className="flex items-center justify-between border-b border-light-gray pb-2 last:border-0">
              <span className="font-mono text-xs text-charcoal/50">{new Date(e.occurred_at).toLocaleTimeString('uz-UZ')}</span>
              <span className="font-medium text-charcoal">{e.event_type}</span>
              <span className="truncate text-charcoal/50">{e.page_path}</span>
            </li>
          ))}
          {timeline.length === 0 && <li className="text-charcoal/40">Event topilmadi</li>}
        </ol>
      </div>
    </div>
  );
}
