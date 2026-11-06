import { useEffect, useState } from 'react';
import { adminApi } from '@/admin/adminApi';
import { DateRangeFilter } from '@/admin/components/DateRangeFilter';
import { useDateRangeFilter } from '@/admin/useDateRangeFilter';

type AdStatus = 'website_lead' | 'meta_lead' | 'engagement' | 'too_early';

interface AdRoiRow {
  adId: string;
  campaignName: string | null;
  adsetName: string | null;
  adName: string | null;
  spend: number;
  impressions: number;
  clicks: number;
  reach: number;
  metaLeads: number;
  costPerMetaLead: number | null;
  websiteVisits: number;
  websiteLeads: number;
  orders: number;
  costPerWebsiteLead: number | null;
  status: AdStatus;
}

interface RoiResponse {
  rows: AdRoiRow[];
  totalSpend: number;
}

const STATUS_LABELS: Record<AdStatus, string> = {
  website_lead: 'Veb orqali ariza',
  meta_lead: 'Meta lead (Instant Form)',
  engagement: 'Engagement — lead kutilmaydi',
  too_early: 'Hali erta / past xarajat',
};

const STATUS_STYLES: Record<AdStatus, string> = {
  website_lead: 'bg-emerald-100 text-emerald-700',
  meta_lead: 'bg-emerald-100 text-emerald-700',
  engagement: 'bg-light-gray text-charcoal/50',
  too_early: 'bg-amber-100 text-amber-700',
};

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

// Instant Form/Engagement reklamalarida sayt tashrifi tushunchasi qo'llanilmaydi —
// shu holatlarda "0" emas, "—" ko'rsatiladi.
function websiteCell(value: number, status: AdStatus) {
  return status === 'website_lead' ? String(value) : '—';
}

export function AdsRoiPage() {
  const { range, setRange, params } = useDateRangeFilter();
  const [data, setData] = useState<RoiResponse | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    adminApi
      .get<RoiResponse>('/ads/roi', params)
      .then(setData)
      .catch(() => setData(null));
  };

  useEffect(load, [params.range]);

  const handleSync = async () => {
    setSyncing(true);
    setError('');
    try {
      await adminApi.post('/ads/sync', undefined, params);
      load();
    } catch {
      setError("Sync qilishda xatolik — FACEBOOK_ACCESS_TOKEN va FACEBOOK_AD_ACCOUNT_ID sozlanganmi, tekshiring.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">Reklama ROI (Facebook/Meta)</h1>
          <p className="mt-1 text-xs text-charcoal/50">
            Xarajat va "Meta Lead" — Facebook'ning o'zidan (shu jumladan Instant Form, saytga kirmasdan). "Veb"
            ustunlari — bizning saytimizdagi tashrif/ariza, faqat reklama havolasida <code>utm_id={'{{ad.id}}'}</code>{' '}
            bo'lgan va saytga olib boradigan reklamalarda to'ladi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter value={range} onChange={setRange} />
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-charcoal hover:bg-[#a68a56] disabled:opacity-50"
          >
            {syncing ? 'Sync qilinmoqda...' : 'Hozir sync qilish'}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {data && (
        <>
          <div className="rounded-xl border border-light-gray bg-warm-white p-4 text-sm">
            <div className="text-xs uppercase text-charcoal/50">Jami xarajat (davr)</div>
            <div className="font-semibold text-charcoal">{formatMoney(data.totalSpend)}</div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-light-gray bg-warm-white">
            <table className="w-full min-w-[1150px] text-left text-sm">
              <thead>
                <tr className="border-b border-light-gray text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                  <th className="px-4 py-3">Kampaniya</th>
                  <th className="px-4 py-3">Ad set</th>
                  <th className="px-4 py-3">Reklama</th>
                  <th className="px-4 py-3">Xarajat</th>
                  <th className="px-4 py-3">Click</th>
                  <th className="px-4 py-3">Meta Lead</th>
                  <th className="px-4 py-3">CPL (Meta)</th>
                  <th className="px-4 py-3">Veb tashrif</th>
                  <th className="px-4 py-3">Veb ariza</th>
                  <th className="px-4 py-3">Holat</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.adId} className="border-b border-light-gray last:border-0">
                    <td className="px-4 py-3 text-charcoal/70">{r.campaignName ?? '—'}</td>
                    <td className="px-4 py-3 text-charcoal/50">{r.adsetName ?? '—'}</td>
                    <td className="px-4 py-3 text-charcoal/70">{r.adName ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold text-charcoal">{formatMoney(r.spend)}</td>
                    <td className="px-4 py-3">{r.clicks}</td>
                    <td className="px-4 py-3">{r.metaLeads}</td>
                    <td className="px-4 py-3">{r.costPerMetaLead !== null ? formatMoney(r.costPerMetaLead) : '—'}</td>
                    <td className="px-4 py-3">{websiteCell(r.websiteVisits, r.status)}</td>
                    <td className="px-4 py-3">{websiteCell(r.websiteLeads, r.status)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[r.status]}`}>
                        {STATUS_LABELS[r.status]}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.rows.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-charcoal/40">
                      Hali Facebook xarajat ma'lumoti yo'q — "Hozir sync qilish" tugmasini bosing.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
