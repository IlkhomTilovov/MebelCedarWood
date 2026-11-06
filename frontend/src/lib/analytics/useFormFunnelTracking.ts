import { useEffect, useRef } from 'react';
import { trackEvent } from './track';

const STEP_NAMES = ['personal_info', 'furniture_type', 'order_requirements', 'review'] as const;
const FORM_START_FLAG = 'cw_form_start_fired';

export function useFormFunnelTracking(currentStep: number, isSubmitted: boolean) {
  const lastStep = useRef<number | null>(null);
  const submittedRef = useRef(isSubmitted);

  useEffect(() => {
    submittedRef.current = isSubmitted;
  }, [isSubmitted]);

  useEffect(() => {
    if (lastStep.current === currentStep) return;

    const stepName = STEP_NAMES[currentStep - 1] ?? null;
    if (!stepName) return;

    if (lastStep.current === null) {
      try {
        if (!sessionStorage.getItem(FORM_START_FLAG)) {
          sessionStorage.setItem(FORM_START_FLAG, '1');
          trackEvent('form_start');
        }
      } catch {
        /* noop */
      }
    } else if (currentStep < lastStep.current) {
      trackEvent('form_step_back', { stepName, stepIndex: currentStep });
    } else {
      const prevStepName = STEP_NAMES[lastStep.current - 1];
      trackEvent('form_step_complete', { stepName: prevStepName, stepIndex: lastStep.current });
    }

    trackEvent('form_step_view', { stepName, stepIndex: currentStep });
    lastStep.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    function handleAbandon() {
      if (!submittedRef.current && lastStep.current !== null) {
        trackEvent('form_abandon', { stepIndex: lastStep.current, stepName: STEP_NAMES[lastStep.current - 1] });
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') handleAbandon();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleAbandon);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleAbandon);
    };
  }, []);
}
