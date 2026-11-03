import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CONTRACT_VERSION } from '@/lib/contract';

interface ConsentState {
  contractVersion: string;
  consentGiven: boolean;
  consentDate: string | null;
  scrolledToEnd: boolean;
  setScrolledToEnd: (value: boolean) => void;
  giveConsent: () => void;
  resetConsent: () => void;
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      contractVersion: CONTRACT_VERSION,
      consentGiven: false,
      consentDate: null,
      scrolledToEnd: false,
      setScrolledToEnd: (value) => set({ scrolledToEnd: value }),
      giveConsent: () =>
        set({
          contractVersion: CONTRACT_VERSION,
          consentGiven: true,
          consentDate: new Date().toISOString(),
        }),
      resetConsent: () =>
        set({
          contractVersion: CONTRACT_VERSION,
          consentGiven: false,
          consentDate: null,
          scrolledToEnd: false,
        }),
    }),
    {
      name: 'cedarwood-consent',
      // Agar shartnoma versiyasi o'zgarsa, eski rozilik avtomatik bekor bo'ladi.
      migrate: (persisted) => {
        const state = persisted as ConsentState;
        if (state?.contractVersion !== CONTRACT_VERSION) {
          return {
            contractVersion: CONTRACT_VERSION,
            consentGiven: false,
            consentDate: null,
            scrolledToEnd: false,
          };
        }
        return state;
      },
      version: 1,
    },
  ),
);
