import { useState } from 'react';
import { adminApi } from '@/admin/adminApi';

interface ChatTurn {
  question: string;
  answer: string;
}

export function AiChatPage() {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { answer } = await adminApi.post<{ answer: string }>('/ai/chat', { question });
      setHistory((prev) => [...prev, { question, answer }]);
      setQuestion('');
    } catch {
      setError("Javob olishda xatolik yuz berdi (OpenAI API kaliti sozlanganmi?).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-charcoal">AI Chat</h1>
      <p className="text-sm text-charcoal/50">
        So'nggi 30 kunlik agregatsiya qilingan statistika asosida savol bering. Har bir savol mustaqil — suhbat tarixi
        AI'ga qayta yuborilmaydi.
      </p>

      <form onSubmit={handleAsk} className="flex flex-wrap gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Masalan: Bugun nima yomon ishladi?"
          className="min-w-[280px] flex-1 rounded-lg border border-light-gray px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal hover:bg-[#a68a56] disabled:opacity-50"
        >
          {loading ? "So'ralmoqda..." : 'Sor'}
        </button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="space-y-4">
        {[...history].reverse().map((turn, i) => (
          <div key={i} className="rounded-xl border border-light-gray bg-warm-white p-5">
            <p className="text-sm font-semibold text-charcoal">{turn.question}</p>
            <p className="mt-2 whitespace-pre-line text-sm text-charcoal/70">{turn.answer}</p>
            <p className="mt-2 text-xs text-charcoal/40">
              AI tahlili — haqiqat sifatida emas, ehtimollik asosidagi xulosa sifatida qabul qiling.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
