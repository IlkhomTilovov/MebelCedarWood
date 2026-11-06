import { useEffect, useState } from 'react';
import { adminApi, exportUrl } from '@/admin/adminApi';
import { DateRangeFilter } from '@/admin/components/DateRangeFilter';
import { useDateRangeFilter } from '@/admin/useDateRangeFilter';

interface Campaign {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  sessions: number;
  uniqueVisitors: number;
  leads: number;
  conversionRate: number;
}

export function CampaignsPage() {
  const { range, setRange, params } = useDateRangeFilter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    adminApi.get<Campaign[]>('/campaigns', params).then(setCampaigns).catch(() => setCampaigns([]));
  }, [params.range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-charcoal">Reklama manbalari (UTM campaigns)</h1>
        <div className="flex items-center gap-3">
          <DateRangeFilter value={range} onChange={setRange} />
          <a href={exportUrl('/export/campaigns.csv', params)} className="rounded-lg border border-light-gray px-3 py-1.5 text-xs font-semibold text-charcoal/70 hover:text-charcoal">
            CSV eksport
          </a>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-light-gray bg-warm-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-light-gray text-xs font-semibold uppercase tracking-wide text-charcoal/50">
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Source / Medium</th>
              <th className="px-4 py-3">Visitors</th>
              <th className="px-4 py-3">Unique</th>
              <th className="px-4 py-3">Leads</th>
              <th className="px-4 py-3">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr key={i} className="border-b border-light-gray last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{c.utmCampaign ?? '—'}</td>
                <td className="px-4 py-3 text-charcoal/60">{c.utmSource} / {c.utmMedium}</td>
                <td className="px-4 py-3">{c.sessions}</td>
                <td className="px-4 py-3">{c.uniqueVisitors}</td>
                <td className="px-4 py-3">{c.leads}</td>
                <td className="px-4 py-3">{c.conversionRate}%</td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-charcoal/40">
                  UTM kampaniya orqali tashrif topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
