import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { StepActions } from '@/components/layout/StepActions';
import { HOME_STATUS_OPTIONS, MEASUREMENT_TIMING_OPTIONS, READINESS_TIMING_OPTIONS, START_TIMING_OPTIONS } from '@/lib/regions';
import type { FurnitureCategory } from '@/lib/types';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useConsentStore } from '@/store/useConsentStore';

const CATEGORY_LABELS: Record<FurnitureCategory, string> = {
  kitchen: 'Oshxona mebeli',
  wardrobe: 'Garderob / Shkaf',
  'living-room': 'Mehmonxona mebeli',
  bedroom: 'Yotoqxona mebeli',
  office: 'Ofis mebeli',
  custom: 'Boshqa (individual loyiha)',
};

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3 4.7-5.1" />
    </svg>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-b border-light-gray py-2.5 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <span className="text-charcoal/50">{label}</span>
      <span className="font-medium break-words text-charcoal sm:text-right">{value}</span>
    </div>
  );
}

export function StepReview() {
  const navigate = useNavigate();
  const { personalInfo, furnitureCategories, orderRequirements, prevStep, submit, isSubmitting } = useApplicationStore();
  const { contractVersion, consentDate } = useConsentStore();
  const [submitError, setSubmitError] = useState('');

  const categoryLabel = furnitureCategories.map((c) => CATEGORY_LABELS[c]).join(', ');
  const homeStatusLabel = HOME_STATUS_OPTIONS.find((o) => o.value === orderRequirements.homeStatus)?.label ?? '';
  const measurementTimingLabel =
    MEASUREMENT_TIMING_OPTIONS.find((o) => o.value === orderRequirements.measurementTiming)?.label ?? '';
  const readinessTimingLabel =
    orderRequirements.readinessTiming === 'specific-date'
      ? orderRequirements.specificReadinessDate
      : (READINESS_TIMING_OPTIONS.find((o) => o.value === orderRequirements.readinessTiming)?.label ?? '');
  const startTimingLabel = START_TIMING_OPTIONS.find((o) => o.value === orderRequirements.startTiming)?.label ?? '';

  const handleSubmit = async () => {
    setSubmitError('');
    try {
      await submit();
      navigate('/success');
    } catch {
      setSubmitError("Arizani yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    }
  };

  return (
    <div className="relative space-y-8">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <CheckCircleIcon />
        </span>
        <div>
          <h2 className="font-heading text-xl font-bold text-charcoal">Yakuniy tekshiruv</h2>
          <p className="mt-1 text-sm text-charcoal/60">Barcha ma'lumotlarni tekshirib, arizani yuboring.</p>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold tracking-widest text-gold uppercase">Shaxsiy ma'lumotlar</h3>
        <ReviewRow label="Ism va familiya" value={personalInfo.fullName} />
        <ReviewRow label="Telefon" value={personalInfo.phone} />
        <ReviewRow label="Telegram" value={personalInfo.telegramUsername} />
        <ReviewRow label="Hudud" value={personalInfo.region} />
        <ReviewRow label="Tuman/shahar" value={personalInfo.district} />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold tracking-widest text-gold uppercase">Buyurtma turi</h3>
        <ReviewRow label="Mebel turlari" value={categoryLabel} />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold tracking-widest text-gold uppercase">Loyiha rejalari</h3>
        <ReviewRow label="Uy holati" value={homeStatusLabel} />
        <ReviewRow label="O'lchov uchun" value={measurementTimingLabel} />
        <ReviewRow label="Tayyor bo'lish muddati" value={readinessTimingLabel} />
        <ReviewRow label="Loyihani boshlash" value={startTimingLabel} />
        <ReviewRow label="Qo'shimcha ma'lumot" value={orderRequirements.additionalNotes} />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold tracking-widest text-gold uppercase">Shartnoma</h3>
        <ReviewRow label="Shartnoma versiyasi" value={contractVersion} />
        <ReviewRow
          label="Rozilik sanasi"
          value={consentDate ? new Date(consentDate).toLocaleString('uz-UZ') : ''}
        />
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <StepActions>
        <Button type="button" variant="ghost" onClick={prevStep} disabled={isSubmitting} className="w-full sm:w-auto">
          Orqaga
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Yuborilmoqda...' : 'Arizani yuborish'}
        </Button>
      </StepActions>
    </div>
  );
}
