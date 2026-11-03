import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { submitApplication as submitApplicationRequest } from '@/lib/api';
import { CONSENT_TEXT } from '@/lib/contract';
import type {
  ApplicationFormData,
  KitchenInfo,
  OrderRequirements,
  PersonalInfo,
  SubmittedApplication,
} from '@/lib/types';
import { useConsentStore } from '@/store/useConsentStore';

const emptyPersonalInfo: PersonalInfo = {
  fullName: '',
  phone: '+998',
  telegramUsername: '',
  region: '',
  district: '',
};

const emptyKitchenInfo: KitchenInfo = {
  address: '',
  kitchenSize: '',
  kitchenShape: 'straight',
  style: 'modern',
  materialPreference: '',
  comment: '',
};

const emptyOrderRequirements: OrderRequirements = {
  budget: '',
  plannedDate: '',
  additionalRequirements: '',
  photoNames: [],
};

interface ApplicationState {
  currentStep: number;
  personalInfo: PersonalInfo;
  kitchenInfo: KitchenInfo;
  orderRequirements: OrderRequirements;
  photos: File[];
  submittedApplication: SubmittedApplication | null;
  isSubmitting: boolean;
  setPersonalInfo: (data: PersonalInfo) => void;
  setKitchenInfo: (data: KitchenInfo) => void;
  setOrderRequirements: (data: OrderRequirements) => void;
  setPhotos: (files: File[]) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  submit: () => Promise<SubmittedApplication>;
  reset: () => void;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      personalInfo: emptyPersonalInfo,
      kitchenInfo: emptyKitchenInfo,
      orderRequirements: emptyOrderRequirements,
      photos: [],
      submittedApplication: null,
      isSubmitting: false,
      setPersonalInfo: (data) => set({ personalInfo: data }),
      setKitchenInfo: (data) => set({ kitchenInfo: data }),
      setOrderRequirements: (data) => set({ orderRequirements: data }),
      setPhotos: (files) =>
        set({
          photos: files,
          orderRequirements: { ...get().orderRequirements, photoNames: files.map((f) => f.name) },
        }),
      goToStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 4) }),
      nextStep: () => set({ currentStep: Math.min(get().currentStep + 1, 4) }),
      prevStep: () => set({ currentStep: Math.max(get().currentStep - 1, 1) }),
      submit: async () => {
        set({ isSubmitting: true });
        const consent = useConsentStore.getState();
        const form: ApplicationFormData = {
          personalInfo: get().personalInfo,
          kitchenInfo: get().kitchenInfo,
          orderRequirements: get().orderRequirements,
        };
        try {
          const result = await submitApplicationRequest({
            form,
            consent: {
              contractVersion: consent.contractVersion,
              consentGiven: consent.consentGiven,
              consentDate: consent.consentDate ?? '',
              consentText: CONSENT_TEXT,
            },
          });
          set({ submittedApplication: result });
          return result;
        } finally {
          set({ isSubmitting: false });
        }
      },
      reset: () =>
        set({
          currentStep: 1,
          personalInfo: emptyPersonalInfo,
          kitchenInfo: emptyKitchenInfo,
          orderRequirements: emptyOrderRequirements,
          photos: [],
          submittedApplication: null,
          isSubmitting: false,
        }),
    }),
    {
      name: 'cedarwood-application',
      partialize: (state) => ({
        currentStep: state.currentStep,
        personalInfo: state.personalInfo,
        kitchenInfo: state.kitchenInfo,
        orderRequirements: state.orderRequirements,
        submittedApplication: state.submittedApplication,
      }),
    },
  ),
);
