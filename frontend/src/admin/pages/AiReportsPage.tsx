import { useState } from 'react';
import { adminApi, AdminApiError } from '@/admin/adminApi';

interface DailyReport {
  report_date: string;
  summary: {
    visitors: number;
    sessions: number;
    conversionRate: number;
    funnel: { key: string; label: string; sessions: number }[];
  };
  ai_summary: string;
}

interface WeeklyReport {
  week_start_date: string;
  summary: DailyReport['summary'];
  comparison: { conversionRate: { current: number; previous: number } };
  ai_summary: string;
}

export function AiReportsPage() {
  const [mode, setMode] = useState<'daily' | 'weekly'>('daily');
  const [report, setReport] = useState<DailyReport | WeeklyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async (regenerate: boolean) => {
    setLoading(true);
    setError('');
    try {
      const path = mode === 'daily' ? '/ai/daily-report' : '/ai/weekly-report';
      const data = regenerate
        ? await adminApi.post<DailyReport | WeeklyReport>(path, undefined, { regenerate: 'true' })
        : await adminApi.get<DailyReport | WeeklyReport>(path);
      setReport(data);
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 404) {
        setReport(null);
        setError("Bu davr uchun hali hisobot yaratilmagan — pastdagi tugma orqali yarating.");
      } else {
        setError('AI hisobot olishda xatolik yuz berdi (OpenAI API kaliti sozlanganmi?).');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-charcoal">AI Hisobotlar</h1>
        <div className="inline-flex rounded-lg border border-light-gray bg-warm-white p-1">
          {(['daily', 'weekly'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setReport(null);
                setError('');
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                mode === m ? 'bg-charcoal text-warm-white' : 'text-charcoal/60 hover:text-charcoal'
              }`}
            >
              {m === 'daily' ? 'Kunlik' : 'Haftalik'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => load(false)}
          disabled={loading}
          className="rounded-lg border border-light-gray px-4 py-2 text-sm font-semibold text-charcoal hover:bg-light-gray/40 disabled:opacity-50"
        >
          Mavjud hisobotni ko'rish
        </button>
        <button
          type="button"
          onClick={() => load(true)}
          disabled={loading}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-charcoal hover:bg-[#a68a56] disabled:opacity-50"
        >
          {loading ? 'Yaratilmoqda...' : "Yangi hisobot yarat (OpenAI so'rovi)"}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {report && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gold/40 bg-gold/10 p-5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-charcoal/60">AI xulosasi</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-charcoal">{report.ai_summary}</p>
            <p className="mt-3 text-xs text-charcoal/40">
              AI tahlili ehtimollik asosida tuzilgan — har bir xulosani "AI Insights" bo'limida tasdiqlang.
            </p>
          </div>

          <div className="rounded-xl border border-light-gray bg-warm-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-charcoal">Funnel</h2>
            <ul className="space-y-2 text-sm">
              {report.summary.funnel.map((f) => (
                <li key={f.key} className="flex items-center justify-between border-b border-light-gray py-1.5 last:border-0">
                  <span className="text-charcoal/70">{f.label}</span>
                  <span className="font-semibold text-charcoal">{f.sessions}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-light-gray bg-warm-white p-4 text-sm">
              <div className="text-xs uppercase text-charcoal/50">Visitors</div>
              <div className="font-semibold text-charcoal">{report.summary.visitors}</div>
            </div>
            <div className="rounded-xl border border-light-gray bg-warm-white p-4 text-sm">
              <div className="text-xs uppercase text-charcoal/50">Sessiyalar</div>
              <div className="font-semibold text-charcoal">{report.summary.sessions}</div>
            </div>
            <div className="rounded-xl border border-light-gray bg-warm-white p-4 text-sm">
              <div className="text-xs uppercase text-charcoal/50">Conversion</div>
              <div className="font-semibold text-charcoal">{report.summary.conversionRate}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
