import { useEffect, useState } from 'react';
import { adminApi } from '@/admin/adminApi';
import { DateRangeFilter } from '@/admin/components/DateRangeFilter';
import { useDateRangeFilter } from '@/admin/useDateRangeFilter';

interface AdRoiRow {
  adId: string;
  campaignName: string | null;
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
  matched: boolean;
}

interface RoiResponse {
  rows: AdRoiRow[];
  totalSpend: number;
  unmatchedSpend: number;
  unmatchedCount: number;
}

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
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
            Xarajat va "Meta Lead" — Facebook'ning o'zidan (shu jumladan Instant Form). "Veb-sayt" ustunlari — bizning
            saytimizdagi tashrif/ariza, faqat reklama havolasida <code>utm_id={'{{ad.id}}'}</code> bo'lsa bog'lanadi.
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-light-gray bg-warm-white p-4 text-sm">
              <div className="text-xs uppercase text-charcoal/50">Jami xarajat</div>
              <div className="font-semibold text-charcoal">{formatMoney(data.totalSpend)}</div>
            </div>
            <div className="rounded-xl border border-light-gray bg-warm-white p-4 text-sm">
              <div className="text-xs uppercase text-charcoal/50">Signal topilgan reklamalar</div>
              <div className="font-semibold text-charcoal">{data.rows.length - data.unmatchedCount} / {data.rows.length}</div>
            </div>
            <div className="rounded-xl border border-light-gray bg-warm-white p-4 text-sm">
              <div className="text-xs uppercase text-charcoal/50">Signalsiz xarajat</div>
              <div className="font-semibold text-charcoal">{formatMoney(data.unmatchedSpend)}</div>
            </div>
          </div>

          {data.unmatchedCount > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {data.unmatchedCount} ta reklama uchun xarajat bor, lekin na Meta lead, na veb-sayt tashrifi topildi.
              Reklama havolasida <code>utm_id={'{{ad.id}}'}</code> parametri yo'qmi yoki reklama hali juda yangimi, tekshiring.
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-light-gray bg-warm-white">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="border-b border-light-gray text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                  <th className="px-4 py-3">Kampaniya</th>
                  <th className="px-4 py-3">Reklama</th>
                  <th className="px-4 py-3">Xarajat</th>
                  <th className="px-4 py-3">Click</th>
                  <th className="px-4 py-3">Meta Lead</th>
                  <th className="px-4 py-3">CPL (Meta)</th>
                  <th className="px-4 py-3">Veb tashrif</th>
                  <th className="px-4 py-3">Veb ariza</th>
                  <th className="px-4 py-3">Buyurtma</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.adId} className={`border-b border-light-gray last:border-0 ${!r.matched ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 text-charcoal/70">{r.campaignName ?? '—'}</td>
                    <td className="px-4 py-3 text-charcoal/70">{r.adName ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold text-charcoal">{formatMoney(r.spend)}</td>
                    <td className="px-4 py-3">{r.clicks}</td>
                    <td className="px-4 py-3">{r.metaLeads}</td>
                    <td className="px-4 py-3">{r.costPerMetaLead !== null ? formatMoney(r.costPerMetaLead) : '—'}</td>
                    <td className="px-4 py-3">{r.websiteVisits}</td>
                    <td className="px-4 py-3">{r.websiteLeads}</td>
                    <td className="px-4 py-3">{r.orders}</td>
                  </tr>
                ))}
                {data.rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-charcoal/40">
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
