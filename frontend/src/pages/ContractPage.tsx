import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConsentGate } from '@/components/contract/ConsentGate';
import { ContractViewer } from '@/components/contract/ContractViewer';
import { useSeo } from '@/lib/seo';
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

  const handleReachEnd = useCallback(() => setScrolledToEnd(true), [setScrolledToEnd]);

  const handleConfirm = () => {
    giveConsent();
    navigate('/apply');
  };

  return (
    <div className="bg-light-gray/20 py-6">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <ContractViewer onReachEnd={handleReachEnd} />
        <ConsentGate scrolledToEnd={scrolledToEnd} onConfirm={handleConfirm} />
      </div>
    </div>
  );
}
