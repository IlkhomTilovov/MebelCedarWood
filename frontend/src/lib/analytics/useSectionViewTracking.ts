import { useEffect, useRef } from 'react';
import { trackEvent } from './track';

// Bo'lim (section) birinchi marta ko'rinish maydoniga kirganda bitta event otadi.
// Qaytarilgan ref'ni kuzatilishi kerak bo'lgan elementga bog'lang.
export function useSectionViewTracking<T extends HTMLElement>(eventType: string) {
  const ref = useRef<T | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || fired.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !fired.current) {
          fired.current = true;
          trackEvent(eventType);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [eventType]);

  return ref;
}
