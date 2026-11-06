import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConsentGate } from '@/components/contract/ConsentGate';
import { ContractViewer } from '@/components/contract/ContractViewer';
import { useSeo } from '@/lib/seo';
import { trackEvent } from '@/lib/analytics/track';
import { useConsentStore } from '@/store/useConsentStore';

export function ContractPage() {
  useSeo({
    title: 'Mebel buyurtma shartnomasi',
    description:
      'CEDAR WOOD mebel buyurtma shartnomasi shartlari bilan tanishing: narx, muddat, kafolat va yetkazib berish tartibi.',
    path: '/contract',
  });

  const navigate = useNavigate();
  const scrolledToEnd = useConsentStore((s) => s.scrolledToEnd);
  const setScrolledToEnd = useConsentStore((s) => s.setScrolledToEnd);
  const giveConsent = useConsentStore((s) => s.giveConsent);
  const seenMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    trackEvent('contract_open');
  }, []);

  const handleReachEnd = useCallback(() => {
    setScrolledToEnd(true);
    trackEvent('contract_scroll_100');
  }, [setScrolledToEnd]);

  const handleProgress = useCallback((percent: number) => {
    if (seenMilestones.current.has(percent)) return;
    seenMilestones.current.add(percent);
    trackEvent(`contract_scroll_${percent}`);
  }, []);

  const handleConfirm = () => {
    giveConsent();
    trackEvent('contract_accept');
    navigate('/apply');
  };

  return (
    <div className="bg-light-gray/20 py-6">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <ContractViewer onReachEnd={handleReachEnd} onProgress={handleProgress} />
        <ConsentGate scrolledToEnd={scrolledToEnd} onConfirm={handleConfirm} />
      </div>
    </div>
  );
}
