import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';
import { ApplicationFormPage } from '@/pages/ApplicationFormPage';
import { ContractPage } from '@/pages/ContractPage';
import { LandingPage } from '@/pages/LandingPage';
import { SuccessPage } from '@/pages/SuccessPage';

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

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-warm-white">
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contract" element={<ContractPage />} />
          <Route path="/apply" element={<ApplicationFormPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
