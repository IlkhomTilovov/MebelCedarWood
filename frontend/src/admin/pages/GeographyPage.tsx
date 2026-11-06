import { useEffect, useState } from 'react';
import { adminApi } from '@/admin/adminApi';
import { DateRangeFilter } from '@/admin/components/DateRangeFilter';
import { useDateRangeFilter } from '@/admin/useDateRangeFilter';

interface RegionRow {
  region: string;
  sessions: number;
}

export function GeographyPage() {
  const { range, setRange, params } = useDateRangeFilter();
  const [regions, setRegions] = useState<RegionRow[]>([]);

  useEffect(() => {
    adminApi.get<RegionRow[]>('/geography', params).then(setRegions).catch(() => setRegions([]));
  }, [params.range]);

  const total = regions.reduce((sum, r) => sum + r.sessions, 0) || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">Geografiya</h1>
          <p className="mt-1 text-xs text-charcoal/50">
            Taxminiy — IP-geolokatsiya asosida, xom IP manzil saqlanmaydi.
          </p>
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      <div className="rounded-xl border border-light-gray bg-warm-white p-5">
        <ul className="space-y-2 text-sm">
          {regions.map((r) => (
            <li key={r.region} className="flex items-center justify-between border-b border-light-gray py-2 last:border-0">
              <span className="text-charcoal/70">{r.region}</span>
              <span className="font-semibold text-charcoal">
                {r.sessions} ({Math.round((r.sessions / total) * 100)}%)
              </span>
            </li>
          ))}
          {regions.length === 0 && <li className="text-charcoal/40">Ma'lumot yo'q</li>}
        </ul>
      </div>
    </div>
  );
}
