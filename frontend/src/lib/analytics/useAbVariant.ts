import { useEffect, useRef, useState } from 'react';
import { getOrCreateVisitorId } from './client';
import { trackEvent } from './track';

// visitor_id + testKey'dan barqaror (deterministik) 'a'/'b' tanlaydi — shu visitor
// doim bir xil variantni ko'radi.
function hashToVariant(input: string): 'a' | 'b' {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 2 === 0 ? 'a' : 'b';
}

export function useAbVariant(testKey: string): 'a' | 'b' {
  const [variant] = useState<'a' | 'b'>(() => hashToVariant(`${getOrCreateVisitorId().id}:${testKey}`));
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent('ab_test_exposure', { testKey, variant });
  }, [testKey, variant]);

  return variant;
}
