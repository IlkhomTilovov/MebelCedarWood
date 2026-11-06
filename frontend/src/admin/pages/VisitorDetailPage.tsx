import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminApi } from '@/admin/adminApi';

interface Visitor {
  visitor_id: string;
  first_seen_at: string;
  last_seen_at: string;
  visit_count: number;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  region: string | null;
  first_traffic_source: string | null;
}

interface SessionRow {
  session_id: string;
  started_at: string;
  duration_seconds: number | null;
  entry_page: string | null;
  exit_page: string | null;
  page_view_count: number;
  click_count: number;
  is_converted: boolean;
}

export function VisitorDetailPage() {
  const { visitorId } = useParams();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);

  useEffect(() => {
    if (!visitorId) return;
    adminApi
      .get<{ visitor: Visitor; sessions: SessionRow[] }>(`/visitors/${visitorId}`)
      .then((r) => {
        setVisitor(r.visitor);
        setSessions(r.sessions);
      })
      .catch(() => {
        setVisitor(null);
        setSessions([]);
      });
  }, [visitorId]);

  if (!visitor) return <p className="text-charcoal/50">Yuklanmoqda...</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Visitor #{visitor.visitor_id.slice(0, 8)}</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <InfoCard label="Birinchi tashrif" value={new Date(visitor.first_seen_at).toLocaleDateString('uz-UZ')} />
        <InfoCard label="Manba" value={visitor.first_traffic_source ?? 'Direct'} />
        <InfoCard label="Qurilma" value={`${visitor.device_type ?? '—'} / ${visitor.browser ?? '—'}`} />
        <InfoCard label="Hudud" value={visitor.region ?? "Noma'lum"} />
        <InfoCard label="Tashriflar soni" value={String(visitor.visit_count)} />
      </div>

      <div className="rounded-xl border border-light-gray bg-warm-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-charcoal">Sessiyalar</h2>
        <ul className="space-y-3">
          {sessions.map((s) => (
            <li key={s.session_id} className="flex items-center justify-between border-b border-light-gray pb-3 text-sm last:border-0">
              <div>
                <Link to={`/admin/sessions/${s.session_id}`} className="font-medium text-gold hover:underline">
                  {new Date(s.started_at).toLocaleString('uz-UZ')}
                </Link>
                <div className="text-xs text-charcoal/50">
                  {s.entry_page} → {s.exit_page ?? '...'}
                </div>
              </div>
              <div className="text-right text-xs text-charcoal/60">
                {s.page_view_count} sahifa · {s.click_count} click {s.is_converted ? '· ✅ konversiya' : ''}
              </div>
            </li>
          ))}
          {sessions.length === 0 && <li className="text-charcoal/40">Sessiya topilmadi</li>}
        </ul>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-light-gray bg-warm-white p-4">
      <div className="text-xs font-semibold tracking-widest text-charcoal/50 uppercase">{label}</div>
      <div className="mt-1 text-sm font-semibold text-charcoal">{value}</div>
    </div>
  );
}
