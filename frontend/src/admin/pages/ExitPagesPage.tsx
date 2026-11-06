import { useEffect, useState } from 'react';
import { adminApi } from '@/admin/adminApi';
import { DateRangeFilter } from '@/admin/components/DateRangeFilter';
import { useDateRangeFilter } from '@/admin/useDateRangeFilter';

interface ExitRow {
  exitPage: string;
  sessions: number;
  share: number;
}

export function ExitPagesPage() {
  const { range, setRange, params } = useDateRangeFilter();
  const [rows, setRows] = useState<ExitRow[]>([]);

  useEffect(() => {
    adminApi.get<ExitRow[]>('/exit-pages', params).then(setRows).catch(() => setRows([]));
  }, [params.range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-charcoal">Chiqish sahifalari</h1>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      <div className="rounded-xl border border-light-gray bg-warm-white p-5">
        <ul className="space-y-2 text-sm">
          {rows.map((r) => (
            <li key={r.exitPage} className="flex items-center justify-between border-b border-light-gray py-2 last:border-0">
              <span className="text-charcoal/70">{r.exitPage}</span>
              <span className="font-semibold text-charcoal">
                {r.sessions} ({r.share}%)
              </span>
            </li>
          ))}
          {rows.length === 0 && <li className="text-charcoal/40">Ma'lumot yo'q</li>}
        </ul>
      </div>
    </div>
  );
}
