import { useEffect, useState } from 'react';
import { adminApi } from '@/admin/adminApi';

interface AbTest {
  id: number;
  test_key: string;
  name: string;
  description: string | null;
  variant_a_label: string;
  variant_b_label: string;
  goal_metric: string | null;
  status: string;
}

interface AbTestResult {
  variant: string;
  exposedSessions: number;
  convertedSessions: number;
  conversionRate: number;
}

function ResultsPanel({ testKey }: { testKey: string }) {
  const [results, setResults] = useState<AbTestResult[] | null>(null);

  useEffect(() => {
    adminApi
      .get<{ results: AbTestResult[] }>(`/ai/ab-tests/${testKey}/results`)
      .then((r) => setResults(r.results))
      .catch(() => setResults([]));
  }, [testKey]);

  if (!results) return <p className="text-xs text-charcoal/40">Yuklanmoqda...</p>;
  if (results.length === 0) return <p className="text-xs text-charcoal/40">Hali exposure yo'q.</p>;

  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      {results.map((r) => (
        <div key={r.variant} className="rounded-lg bg-light-gray/40 p-3 text-xs">
          <div className="font-semibold uppercase text-charcoal/60">Variant {r.variant}</div>
          <div className="mt-1 text-charcoal">
            {r.exposedSessions} ko'rdi · {r.convertedSessions} konversiya · <strong>{r.conversionRate}%</strong>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AbTestsPage() {
  const [tests, setTests] = useState<AbTest[]>([]);
  const [form, setForm] = useState({
    testKey: '',
    name: '',
    variantALabel: '',
    variantBLabel: '',
    goalMetric: 'form_submit',
  });
  const [submitting, setSubmitting] = useState(false);

  const load = () => adminApi.get<AbTest[]>('/ai/ab-tests').then(setTests).catch(() => setTests([]));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.post('/ai/ab-tests', form);
      setForm({ testKey: '', name: '', variantALabel: '', variantBLabel: '', goalMetric: 'form_submit' });
      load();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-charcoal">A/B Testlar</h1>

      <form onSubmit={handleCreate} className="grid gap-3 rounded-xl border border-light-gray bg-warm-white p-5 sm:grid-cols-2">
        <input
          required
          placeholder="test_key (masalan: contract_cta_copy)"
          value={form.testKey}
          onChange={(e) => setForm({ ...form, testKey: e.target.value })}
          className="rounded-lg border border-light-gray px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Test nomi"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg border border-light-gray px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Variant A matni"
          value={form.variantALabel}
          onChange={(e) => setForm({ ...form, variantALabel: e.target.value })}
          className="rounded-lg border border-light-gray px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Variant B matni"
          value={form.variantBLabel}
          onChange={(e) => setForm({ ...form, variantBLabel: e.target.value })}
          className="rounded-lg border border-light-gray px-3 py-2 text-sm"
        />
        <input
          placeholder="Maqsad event (default: form_submit)"
          value={form.goalMetric}
          onChange={(e) => setForm({ ...form, goalMetric: e.target.value })}
          className="rounded-lg border border-light-gray px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-charcoal hover:bg-[#a68a56] disabled:opacity-50"
        >
          Test yaratish
        </button>
      </form>

      <div className="space-y-4">
        {tests.map((t) => (
          <div key={t.id} className="rounded-xl border border-light-gray bg-warm-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-charcoal">{t.name}</h2>
              <span className="rounded-full bg-light-gray px-2.5 py-0.5 text-xs font-semibold uppercase text-charcoal/60">
                {t.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-charcoal/50">
              {t.test_key} · A: "{t.variant_a_label}" · B: "{t.variant_b_label}" · maqsad: {t.goal_metric}
            </p>
            <ResultsPanel testKey={t.test_key} />
          </div>
        ))}
        {tests.length === 0 && <p className="text-charcoal/40">Hali A/B test yo'q.</p>}
      </div>
    </div>
  );
}
