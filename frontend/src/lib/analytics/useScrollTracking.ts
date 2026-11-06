import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from './track';

const THRESHOLDS = [25, 50, 75, 90, 100] as const;

export function useScrollTracking() {
  const location = useLocation();
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    fired.current = new Set();

    function handleScroll() {
      const doc = document.documentElement;
      const scrollableHeight = doc.scrollHeight - doc.clientHeight;
      if (scrollableHeight <= 0) return;

      const percent = Math.min(100, Math.round((window.scrollY / scrollableHeight) * 100));

      for (const threshold of THRESHOLDS) {
        if (percent >= threshold && !fired.current.has(threshold)) {
          fired.current.add(threshold);
          trackEvent(`scroll_${threshold}`, { viewportWidth: window.innerWidth });
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);
}
