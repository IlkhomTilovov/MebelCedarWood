import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuthStore } from '@/admin/store/useAdminAuthStore';

export function AdminGuard() {
  const status = useAdminAuthStore((s) => s.status);
  const checkSession = useAdminAuthStore((s) => s.checkSession);

  useEffect(() => {
    if (status === 'idle') checkSession();
  }, [status, checkSession]);

  if (status === 'idle' || status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center bg-charcoal text-warm-white/70">Yuklanmoqda...</div>;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
