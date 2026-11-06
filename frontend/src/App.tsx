import { Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ApplicationFormPage } from '@/pages/ApplicationFormPage';
import { ContractPage } from '@/pages/ContractPage';
import { LandingPage } from '@/pages/LandingPage';
import { SuccessPage } from '@/pages/SuccessPage';
// Admin panel kodi (recharts bilan) lazy-load qilinadi — asosiy reklama/landing
// sahifalarining bundle hajmiga ta'sir qilmasin.
const AdminGuard = lazy(() => import('@/admin/AdminGuard').then((m) => ({ default: m.AdminGuard })));
const AdminLayout = lazy(() => import('@/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminLoginPage = lazy(() => import('@/admin/pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const DashboardPage = lazy(() => import('@/admin/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const RealtimePage = lazy(() => import('@/admin/pages/RealtimePage').then((m) => ({ default: m.RealtimePage })));
const SessionsPage = lazy(() => import('@/admin/pages/SessionsPage').then((m) => ({ default: m.SessionsPage })));
const SessionDetailPage = lazy(() =>
  import('@/admin/pages/SessionDetailPage').then((m) => ({ default: m.SessionDetailPage })),
);
const VisitorDetailPage = lazy(() =>
  import('@/admin/pages/VisitorDetailPage').then((m) => ({ default: m.VisitorDetailPage })),
);
const FunnelPage = lazy(() => import('@/admin/pages/FunnelPage').then((m) => ({ default: m.FunnelPage })));
const CampaignsPage = lazy(() => import('@/admin/pages/CampaignsPage').then((m) => ({ default: m.CampaignsPage })));
const DevicesPage = lazy(() => import('@/admin/pages/DevicesPage').then((m) => ({ default: m.DevicesPage })));
const GeographyPage = lazy(() => import('@/admin/pages/GeographyPage').then((m) => ({ default: m.GeographyPage })));
const ExitPagesPage = lazy(() => import('@/admin/pages/ExitPagesPage').then((m) => ({ default: m.ExitPagesPage })));
const CatalogPage = lazy(() => import('@/admin/pages/CatalogPage').then((m) => ({ default: m.CatalogPage })));
const ComingSoonPage = lazy(() => import('@/admin/pages/ComingSoonPage').then((m) => ({ default: m.ComingSoonPage })));
const AiInsightsPage = lazy(() => import('@/admin/pages/AiInsightsPage').then((m) => ({ default: m.AiInsightsPage })));
const AiReportsPage = lazy(() => import('@/admin/pages/AiReportsPage').then((m) => ({ default: m.AiReportsPage })));
const AiChatPage = lazy(() => import('@/admin/pages/AiChatPage').then((m) => ({ default: m.AiChatPage })));
const AbTestsPage = lazy(() => import('@/admin/pages/AbTestsPage').then((m) => ({ default: m.AbTestsPage })));
const AdsRoiPage = lazy(() => import('@/admin/pages/AdsRoiPage').then((m) => ({ default: m.AdsRoiPage })));
const HeatmapPage = lazy(() => import('@/admin/pages/HeatmapPage').then((m) => ({ default: m.HeatmapPage })));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function AdminFallback() {
  return <div className="flex min-h-screen items-center justify-center bg-charcoal text-warm-white/70">Yuklanmoqda...</div>;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contract" element={<ContractPage />} />
          <Route path="/apply" element={<ApplicationFormPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<AdminFallback />}>
              <Routes>
                <Route path="login" element={<AdminLoginPage />} />
                <Route element={<AdminGuard />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="realtime" element={<RealtimePage />} />
                    <Route path="sessions" element={<SessionsPage />} />
                    <Route path="sessions/:sessionId" element={<SessionDetailPage />} />
                    <Route path="visitors/:visitorId" element={<VisitorDetailPage />} />
                    <Route path="funnel" element={<FunnelPage />} />
                    <Route path="campaigns" element={<CampaignsPage />} />
                    <Route path="ads-roi" element={<AdsRoiPage />} />
                    <Route path="devices" element={<DevicesPage />} />
                    <Route path="geography" element={<GeographyPage />} />
                    <Route path="catalog" element={<CatalogPage />} />
                    <Route path="exits" element={<ExitPagesPage />} />
                    <Route path="heatmaps" element={<HeatmapPage />} />
                    <Route
                      path="recordings"
                      element={
                        <ComingSoonPage
                          title="Session Recording"
                          note="Privacy-friendly session replay keyingi bosqichda qo'shiladi."
                        />
                      }
                    />
                    <Route path="ai-insights" element={<AiInsightsPage />} />
                    <Route path="ai-reports" element={<AiReportsPage />} />
                    <Route path="ai-chat" element={<AiChatPage />} />
                    <Route path="ab-tests" element={<AbTestsPage />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default App;
