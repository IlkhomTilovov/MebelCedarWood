import { Navigate } from 'react-router-dom';
import { ProgressIndicator } from '@/components/layout/ProgressIndicator';
import { StepKitchenInfo } from '@/components/form/StepKitchenInfo';
import { StepOrderRequirements } from '@/components/form/StepOrderRequirements';
import { StepPersonalInfo } from '@/components/form/StepPersonalInfo';
import { StepReview } from '@/components/form/StepReview';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useConsentStore } from '@/store/useConsentStore';

const STEPS = ['Shaxsiy', 'Oshxona', 'Talablar', 'Tekshiruv'];

export function ApplicationFormPage() {
  const consentGiven = useConsentStore((s) => s.consentGiven);
  const currentStep = useApplicationStore((s) => s.currentStep);
  const submittedApplication = useApplicationStore((s) => s.submittedApplication);

  if (!consentGiven) {
    return <Navigate to="/contract" replace />;
  }

  if (submittedApplication) {
    return <Navigate to="/success" replace />;
  }

  return (
    <div className="bg-light-gray/20 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-8 text-center font-heading text-2xl font-bold text-charcoal">Ariza formasi</h1>
        <div className="mb-10">
          <ProgressIndicator steps={STEPS} currentStep={currentStep} />
        </div>
        <div className="border border-light-gray bg-warm-white p-4 sm:p-10">
          {currentStep === 1 && <StepPersonalInfo />}
          {currentStep === 2 && <StepKitchenInfo />}
          {currentStep === 3 && <StepOrderRequirements />}
          {currentStep === 4 && <StepReview />}
        </div>
      </div>
    </div>
  );
}
