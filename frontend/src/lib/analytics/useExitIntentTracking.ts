import { useEffect, useRef } from 'react';
import { trackEvent } from './track';

// Sichqoncha sahifa tepasidan chiqib ketganda (desktop'da chiqishga urinish belgisi)
// har bir sessiyada bir marta `exit_intent` eventini otadi.
export function useExitIntentTracking() {
  const fired = useRef(false);

  useEffect(() => {
    function handleMouseLeave(event: MouseEvent) {
      if (fired.current) return;
      if (event.clientY > 0) return;
      fired.current = true;
      trackEvent('exit_intent');
    }

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);
}
