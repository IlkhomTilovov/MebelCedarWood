import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '@/admin/store/useAdminAuthStore';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const status = useAdminAuthStore((s) => s.status);
  const login = useAdminAuthStore((s) => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (status === 'authenticated') {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch {
      setError("Login yoki parol noto'g'ri.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-warm-white/10 bg-warm-white/5 p-8">
        <div className="mb-8 text-center font-heading text-xl font-bold text-warm-white tracking-[0.1em]">
          CEDAR<span className="text-gold"> WOOD</span>
          <div className="mt-1 text-xs font-normal tracking-widest text-warm-white/50 uppercase">Admin panel</div>
        </div>
        <label className="mb-4 block text-sm text-warm-white/70">
          Login
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1.5 w-full rounded-lg border border-warm-white/20 bg-transparent px-3 py-2.5 text-warm-white outline-none focus:border-gold"
          />
        </label>
        <label className="mb-6 block text-sm text-warm-white/70">
          Parol
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1.5 w-full rounded-lg border border-warm-white/20 bg-transparent px-3 py-2.5 text-warm-white outline-none focus:border-gold"
          />
        </label>
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-wide text-charcoal transition-colors hover:bg-[#a68a56] disabled:opacity-60"
        >
          {submitting ? 'Kirilmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  );
}
