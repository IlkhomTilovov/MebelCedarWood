import { useEffect, useState } from 'react';
import { adminApi } from '@/admin/adminApi';
import { DateRangeFilter } from '@/admin/components/DateRangeFilter';
import { useDateRangeFilter } from '@/admin/useDateRangeFilter';

interface FunnelStep {
  name: string;
  label: string;
  sessions: number;
  percentOfStart: number;
}

export function FunnelPage() {
  const { range, setRange, params } = useDateRangeFilter();
  const [steps, setSteps] = useState<FunnelStep[]>([]);

  useEffect(() => {
    adminApi.get<FunnelStep[]>('/funnel', params).then(setSteps).catch(() => setSteps([]));
  }, [params.range]);

  const maxSessions = Math.max(1, ...steps.map((s) => s.sessions));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-charcoal">Form Analytics — Buyurtma funnel</h1>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      <div className="rounded-xl border border-light-gray bg-warm-white p-6">
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-charcoal">{step.label}</span>
                <span className="text-charcoal/60">
                  {step.sessions} · {step.percentOfStart}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-light-gray">
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${Math.max(2, (step.sessions / maxSessions) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          {steps.length === 0 && <p className="text-charcoal/40">Hozircha ma'lumot yo'q</p>}
        </div>
      </div>
    </div>
  );
}
