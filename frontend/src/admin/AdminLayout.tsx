import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '@/admin/store/useAdminAuthStore';

const NAV_ITEMS = [
  { to: '/admin', label: 'Umumiy', end: true },
  { to: '/admin/realtime', label: 'Real-time' },
  { to: '/admin/sessions', label: 'Tashriflar' },
  { to: '/admin/funnel', label: 'Form Analytics' },
  { to: '/admin/campaigns', label: 'Reklama manbalari' },
  { to: '/admin/devices', label: 'Qurilmalar' },
  { to: '/admin/geography', label: 'Geografiya' },
  { to: '/admin/catalog', label: 'Mahsulotlar' },
  { to: '/admin/exits', label: 'Chiqish sahifalari' },
  { to: '/admin/heatmaps', label: 'Heatmap' },
  { to: '/admin/recordings', label: 'Session Recording' },
];

export function AdminLayout() {
  const username = useAdminAuthStore((s) => s.username);
  const logout = useAdminAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-light-gray/20">
      <aside className="flex w-64 shrink-0 flex-col border-r border-light-gray bg-charcoal text-warm-white">
        <div className="px-6 py-6 font-heading text-lg font-bold tracking-[0.1em]">
          CEDAR<span className="text-gold"> WOOD</span>
          <div className="mt-1 text-xs font-normal tracking-widest text-warm-white/50 uppercase">Analitika</div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-gold/15 text-gold' : 'text-warm-white/70 hover:bg-warm-white/5 hover:text-warm-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-warm-white/10 px-6 py-4 text-xs text-warm-white/50">
          <div className="mb-2 truncate">{username}</div>
          <button type="button" onClick={handleLogout} className="font-semibold text-warm-white/70 hover:text-gold">
            Chiqish
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden p-6 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
