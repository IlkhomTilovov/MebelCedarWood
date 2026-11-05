import { Navigate } from 'react-router-dom';
import formHeaderImage from '@/assets/images/portfolio/kitchen-1.webp';
import { ProgressIndicator } from '@/components/layout/ProgressIndicator';
import { StepFurnitureType } from '@/components/form/StepFurnitureType';
import { StepOrderRequirements } from '@/components/form/StepOrderRequirements';
import { StepPersonalInfo } from '@/components/form/StepPersonalInfo';
import { StepReview } from '@/components/form/StepReview';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useConsentStore } from '@/store/useConsentStore';

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="5" y="4" width="14" height="17" rx="1.5" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 14.5h6M9 18h3.5" />
    </svg>
  );
}

const STEPS = [
  { title: 'Shaxsiy', subtitle: "Ma'lumotlar" },
  { title: 'Oshxona', subtitle: 'Buyurtma turi' },
  { title: 'Loyiha', subtitle: 'Rejalari' },
  { title: 'Tekshirish', subtitle: "Yakuniy ma'lumot" },
];

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
      <div className={`mx-auto px-4 sm:px-6 ${currentStep === 3 ? 'max-w-5xl' : 'max-w-3xl'}`}>
        <div className="mb-2 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <ClipboardIcon />
          </span>
          <h1 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">Ariza formasi</h1>
        </div>
        <p className="mb-8 text-center text-sm text-charcoal/60">
          Buyurtma berish uchun quyidagi bosqichlarni ketma-ket to'ldiring.
        </p>
        <div className="mb-10">
          <ProgressIndicator steps={STEPS} currentStep={currentStep} />
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-light-gray bg-warm-white p-4 sm:p-10">
          {currentStep === 1 && (
            <div
              className="pointer-events-none absolute top-0 right-0 hidden h-28 w-48 overflow-hidden sm:block"
              style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              <img src={formHeaderImage} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          {currentStep === 1 && <StepPersonalInfo />}
          {currentStep === 2 && <StepFurnitureType />}
          {currentStep === 3 && <StepOrderRequirements />}
          {currentStep === 4 && <StepReview />}
        </div>
      </div>
    </div>
  );
}
