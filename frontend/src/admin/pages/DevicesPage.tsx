import { useEffect, useState } from 'react';
import { adminApi } from '@/admin/adminApi';
import { DateRangeFilter } from '@/admin/components/DateRangeFilter';
import { useDateRangeFilter } from '@/admin/useDateRangeFilter';

interface DevicesResponse {
  byDevice: { deviceType: string; sessions: number }[];
  byBrowser: { browser: string; sessions: number }[];
  byOs: { os: string; sessions: number }[];
}

function Breakdown({ title, rows }: { title: string; rows: { label: string; sessions: number }[] }) {
  const total = rows.reduce((sum, r) => sum + r.sessions, 0) || 1;
  return (
    <div className="rounded-xl border border-light-gray bg-warm-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-charcoal">{title}</h2>
      <ul className="space-y-2 text-sm">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between border-b border-light-gray py-1.5 last:border-0">
            <span className="capitalize text-charcoal/70">{r.label}</span>
            <span className="font-semibold text-charcoal">
              {r.sessions} ({Math.round((r.sessions / total) * 100)}%)
            </span>
          </li>
        ))}
        {rows.length === 0 && <li className="text-charcoal/40">Ma'lumot yo'q</li>}
      </ul>
    </div>
  );
}

export function DevicesPage() {
  const { range, setRange, params } = useDateRangeFilter();
  const [devices, setDevices] = useState<DevicesResponse | null>(null);

  useEffect(() => {
    adminApi.get<DevicesResponse>('/devices', params).then(setDevices).catch(() => setDevices(null));
  }, [params.range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-charcoal">Qurilmalar</h1>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Breakdown title="Qurilma turi" rows={(devices?.byDevice ?? []).map((d) => ({ label: d.deviceType, sessions: d.sessions }))} />
        <Breakdown title="Browser" rows={(devices?.byBrowser ?? []).map((d) => ({ label: d.browser, sessions: d.sessions }))} />
        <Breakdown title="OS" rows={(devices?.byOs ?? []).map((d) => ({ label: d.os, sessions: d.sessions }))} />
      </div>
    </div>
  );
}
