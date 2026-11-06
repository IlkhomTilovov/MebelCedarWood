import { useEffect } from 'react';
import { trackEvent } from './track';

function isTrackableField(el: EventTarget | null): el is HTMLInputElement | HTMLTextAreaElement {
  return (
    (el instanceof HTMLInputElement && el.type !== 'hidden' && el.type !== 'password') ||
    el instanceof HTMLTextAreaElement
  );
}

// Forma maydonlariga delegated focus/blur tracking — hech qachon qiymatni
// (faqat bo'sh/bo'sh-emasligini) yubormaydi. `ApplicationFormPage.tsx`da bir marta ulanadi.
export function useFormFieldTracking() {
  useEffect(() => {
    function handleFocusIn(event: FocusEvent) {
      const target = event.target;
      if (!isTrackableField(target)) return;
      const field = target.name || target.id;
      if (!field) return;
      trackEvent('field_focus', { field });
    }

    function handleFocusOut(event: FocusEvent) {
      const target = event.target;
      if (!isTrackableField(target)) return;
      const field = target.name || target.id;
      if (!field) return;
      if (target.value) {
        trackEvent('field_completed', { field });
      }
    }

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);
}
