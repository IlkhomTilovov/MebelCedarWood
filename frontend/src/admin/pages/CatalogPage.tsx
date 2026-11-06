import { useEffect, useState } from 'react';
import { adminApi } from '@/admin/adminApi';
import { DateRangeFilter } from '@/admin/components/DateRangeFilter';
import { useDateRangeFilter } from '@/admin/useDateRangeFilter';

interface CatalogRow {
  productName: string | null;
  category: string | null;
  views: number;
  uniqueViewers: number;
  clicks: number;
}

export function CatalogPage() {
  const { range, setRange, params } = useDateRangeFilter();
  const [rows, setRows] = useState<CatalogRow[]>([]);

  useEffect(() => {
    adminApi.get<CatalogRow[]>('/catalog', params).then(setRows).catch(() => setRows([]));
  }, [params.range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">Mahsulotlar (Portfolio)</h1>
          <p className="mt-1 text-xs text-charcoal/50">
            Hozircha alohida mahsulot sahifalari yo'q — Portfolio kartalariga bosilgan klik asosida.
          </p>
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-light-gray bg-warm-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-light-gray text-xs font-semibold uppercase tracking-wide text-charcoal/50">
              <th className="px-4 py-3">Mahsulot</th>
              <th className="px-4 py-3">Kategoriya</th>
              <th className="px-4 py-3">Ko'rishlar</th>
              <th className="px-4 py-3">Unique</th>
              <th className="px-4 py-3">Click</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-light-gray last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{r.productName ?? '—'}</td>
                <td className="px-4 py-3 text-charcoal/60">{r.category ?? '—'}</td>
                <td className="px-4 py-3">{r.views}</td>
                <td className="px-4 py-3">{r.uniqueViewers}</td>
                <td className="px-4 py-3">{r.clicks}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-charcoal/40">
                  Ma'lumot yo'q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
