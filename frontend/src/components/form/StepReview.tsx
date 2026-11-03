import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { StepActions } from '@/components/layout/StepActions';
import { FURNITURE_STYLES, KITCHEN_SHAPES } from '@/lib/regions';
import { useApplicationStore } from '@/store/useApplicationStore';
import { useConsentStore } from '@/store/useConsentStore';

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
  const { personalInfo, kitchenInfo, orderRequirements, prevStep, submit, isSubmitting } = useApplicationStore();
  const { contractVersion, consentDate } = useConsentStore();
  const [submitError, setSubmitError] = useState('');

  const shapeLabel = KITCHEN_SHAPES.find((s) => s.value === kitchenInfo.kitchenShape)?.label ?? '';
  const styleLabel = FURNITURE_STYLES.find((s) => s.value === kitchenInfo.style)?.label ?? '';

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
    <div className="space-y-8">
      <h2 className="font-heading text-lg font-semibold text-charcoal">Yakuniy tekshiruv</h2>

      <div>
        <h3 className="mb-2 text-xs font-semibold tracking-widest text-gold uppercase">Shaxsiy ma'lumotlar</h3>
        <ReviewRow label="Ism va familiya" value={personalInfo.fullName} />
        <ReviewRow label="Telefon" value={personalInfo.phone} />
        <ReviewRow label="Telegram" value={personalInfo.telegramUsername} />
        <ReviewRow label="Hudud" value={personalInfo.region} />
        <ReviewRow label="Tuman/shahar" value={personalInfo.district} />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold tracking-widest text-gold uppercase">Oshxona ma'lumotlari</h3>
        <ReviewRow label="Manzil" value={kitchenInfo.address} />
        <ReviewRow label="Uzunligi" value={kitchenInfo.kitchenSize} />
        <ReviewRow label="Shakli" value={shapeLabel} />
        <ReviewRow label="Uslub" value={styleLabel} />
        <ReviewRow label="Material" value={kitchenInfo.materialPreference} />
        <ReviewRow label="Izoh" value={kitchenInfo.comment} />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold tracking-widest text-gold uppercase">Buyurtma talablari</h3>
        <ReviewRow label="Budjet" value={orderRequirements.budget} />
        <ReviewRow label="Muddat" value={orderRequirements.plannedDate} />
        <ReviewRow label="Qo'shimcha talablar" value={orderRequirements.additionalRequirements} />
        <ReviewRow label="Yuklangan rasmlar" value={orderRequirements.photoNames.join(', ')} />
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
