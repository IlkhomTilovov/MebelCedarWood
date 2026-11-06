import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/admin/adminApi';
import { DateRangeFilter } from '@/admin/components/DateRangeFilter';
import { useDateRangeFilter } from '@/admin/useDateRangeFilter';

interface RecordingRow {
  id: number;
  session_id: string;
  started_at: string;
  ended_at: string | null;
  event_count: number;
  duration_seconds: number | null;
  entry_page: string | null;
  device_type: string | null;
  traffic_source: string | null;
  is_converted: boolean;
}

export function RecordingsPage() {
  const { range, setRange, params } = useDateRangeFilter();
  const [recordings, setRecordings] = useState<RecordingRow[]>([]);

  useEffect(() => {
    adminApi
      .get<{ recordings: RecordingRow[] }>('/recordings', params)
      .then((r) => setRecordings(r.recordings))
      .catch(() => setRecordings([]));
  }, [params.range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">Session Recording</h1>
          <p className="mt-1 text-xs text-charcoal/50">
            Parol va forma qiymatlari hech qachon yozilmaydi — faqat sahifa tuzilishi, sichqoncha va scroll.
          </p>
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-light-gray bg-warm-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-light-gray text-xs font-semibold uppercase tracking-wide text-charcoal/50">
              <th className="px-4 py-3">Boshlandi</th>
              <th className="px-4 py-3">Kirish sahifasi</th>
              <th className="px-4 py-3">Qurilma</th>
              <th className="px-4 py-3">Manba</th>
              <th className="px-4 py-3">Davomiylik</th>
              <th className="px-4 py-3">Konversiya</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {recordings.map((r) => (
              <tr key={r.id} className="border-b border-light-gray last:border-0">
                <td className="px-4 py-3 text-charcoal/70">{new Date(r.started_at).toLocaleString('uz-UZ')}</td>
                <td className="px-4 py-3">{r.entry_page ?? '—'}</td>
                <td className="px-4 py-3 capitalize">{r.device_type ?? '—'}</td>
                <td className="px-4 py-3">{r.traffic_source ?? 'Direct'}</td>
                <td className="px-4 py-3">{r.duration_seconds ? `${Math.round(r.duration_seconds / 60)} daq` : '—'}</td>
                <td className="px-4 py-3">{r.is_converted ? '✅' : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/admin/recordings/${r.id}`} className="font-semibold text-gold hover:underline">
                    ▶ Ko'rish
                  </Link>
                </td>
              </tr>
            ))}
            {recordings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-charcoal/40">
                  Hozircha session recording yo'q.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
