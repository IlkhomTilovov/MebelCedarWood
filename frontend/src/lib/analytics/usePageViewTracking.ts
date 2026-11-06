import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent, trackPageView } from './track';

const SESSION_START_FLAG = 'cw_session_start_fired';

export function usePageViewTracking() {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === location.pathname) return;
    lastPath.current = location.pathname;

    try {
      if (!sessionStorage.getItem(SESSION_START_FLAG)) {
        sessionStorage.setItem(SESSION_START_FLAG, '1');
        trackEvent('session_start');
      }
    } catch {
      /* noop */
    }

    trackPageView();
  }, [location.pathname]);
}
