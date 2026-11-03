import { useState } from 'react';
import signatureImage from '@/assets/images/process/step-ariza-1.png';
import { Checkbox } from '@/components/ui/Checkbox';
import { CONSENT_TEXT } from '@/lib/contract';

interface ConsentGateProps {
  scrolledToEnd: boolean;
  onConfirm: () => void;
}

interface IconProps {
  className?: string;
}

function DocumentSignatureIllustration() {
  return (
    <div className="relative mx-auto flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
      <div className="absolute inset-0 rounded-full bg-gold/15 blur-2xl" />
      <img src={signatureImage} alt="" className="relative h-24 w-24 object-contain sm:h-28 sm:w-28" />
    </div>
  );
}

function InfoIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function SendIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 11 18-8-8 18-2.5-7.5L3 11Z" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ConsentGate({ scrolledToEnd, onConfirm }: ConsentGateProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="mt-6 rounded-2xl border border-gold/25 bg-warm-white p-6 sm:p-8">
      <DocumentSignatureIllustration />

      {!scrolledToEnd && (
        <p className="mt-6 text-center text-xs font-medium tracking-wide text-gold uppercase">
          Rozilik berish uchun shartnoma matnini oxirigacha o'qib chiqing
        </p>
      )}

      <div className="mt-6">
        <Checkbox
          label={CONSENT_TEXT}
          checked={checked}
          disabled={!scrolledToEnd}
          onChange={(e) => setChecked(e.target.checked)}
        />
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-light-gray bg-light-gray/10 p-4">
        <InfoIcon className="h-5 w-5 shrink-0 text-gold" />
        <p className="text-xs leading-relaxed text-charcoal/50">
          Checkbox'ni belgilash yuridik imzo hisoblanmaydi — bu faqat shartlar bilan tanishish va
          ariza topshirishga rozilik bosqichidir.
        </p>
      </div>

      <button
        type="button"
        disabled={!checked}
        onClick={onConfirm}
        className="mt-6 flex w-full items-center justify-between gap-3 rounded-xl bg-gradient-to-br from-gold to-[#a68a56] px-6 py-4 text-left text-sm font-bold tracking-wide text-warm-white uppercase transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="flex items-center gap-3">
          <SendIcon className="h-5 w-5 shrink-0" />
          <span className="h-6 w-px shrink-0 bg-warm-white/30" />
          <span>Roziman, arizani to'ldirish</span>
        </span>
        <ArrowRightIcon className="h-5 w-5 shrink-0" />
      </button>
    </div>
  );
}
