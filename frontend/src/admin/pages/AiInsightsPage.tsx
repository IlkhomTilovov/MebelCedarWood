import { useEffect, useState } from 'react';
import { adminApi } from '@/admin/adminApi';

interface Insight {
  id: number;
  insight_date: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string | null;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'done' | 'dismissed';
  created_at: string;
}

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-light-gray text-charcoal/60 border-light-gray',
};

const STATUS_OPTIONS = [
  { value: 'new', label: 'Yangi' },
  { value: 'in_progress', label: 'Jarayonda' },
  { value: 'done', label: 'Bajarildi' },
  { value: 'dismissed', label: 'Bekor qilindi' },
];

export function AiInsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    adminApi
      .get<Insight[]>('/ai/insights')
      .then(setInsights)
      .catch(() => setInsights([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id: number, status: string) => {
    setInsights((prev) => prev.map((i) => (i.id === id ? { ...i, status: status as Insight['status'] } : i)));
    try {
      await adminApi.patch(`/ai/insights/${id}`, { status });
    } catch {
      load();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-charcoal">AI Insights</h1>
      <p className="text-sm text-charcoal/50">
        Kunlik/haftalik hisobotlar generatsiya qilinganda AI topgan muammolar va tavsiyalar shu yerda to'planadi.
      </p>

      {loading && <p className="text-charcoal/40">Yuklanmoqda...</p>}

      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="rounded-xl border border-light-gray bg-warm-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${SEVERITY_STYLES[insight.severity] ?? ''}`}>
                  {insight.severity}
                </span>
                <span className="text-xs text-charcoal/40">{new Date(insight.insight_date).toLocaleDateString('uz-UZ')}</span>
              </div>
              <select
                value={insight.status}
                onChange={(e) => updateStatus(insight.id, e.target.value)}
                className="rounded-lg border border-light-gray px-2 py-1 text-xs"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <h2 className="mt-3 font-heading text-base font-semibold text-charcoal">{insight.title}</h2>
            <p className="mt-1 text-sm text-charcoal/70">{insight.description}</p>
            {insight.recommendation && (
              <p className="mt-2 rounded-lg bg-gold/10 p-3 text-sm text-charcoal/80">
                <strong>Tavsiya:</strong> {insight.recommendation}
              </p>
            )}
          </div>
        ))}
        {!loading && insights.length === 0 && (
          <p className="text-charcoal/40">Hali insight yo'q — "Hisobotlar" bo'limidan kunlik hisobot yarating.</p>
        )}
      </div>
    </div>
  );
}
