import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { usePageViewTracking } from '@/lib/analytics/usePageViewTracking';
import { useScrollTracking } from '@/lib/analytics/useScrollTracking';
import { useClickTracking } from '@/lib/analytics/useClickTracking';
import { useExitIntentTracking } from '@/lib/analytics/useExitIntentTracking';
import { startSessionRecording, stopSessionRecording } from '@/lib/analytics/recorder';

// Tracking faqat shu (ommaviy) layout ichida ulanadi — shunda admin panelni
// ko'rib chiqish o'z-o'zidan "visitor" sifatida hisoblanib ketmaydi.
function AnalyticsTracking() {
  usePageViewTracking();
  useScrollTracking();
  useClickTracking();
  useExitIntentTracking();

  useEffect(() => {
    startSessionRecording();
    return () => stopSessionRecording();
  }, []);

  return null;
}

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-warm-white">
      <AnalyticsTracking />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
