import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { StepActions } from '@/components/layout/StepActions';
import { UZBEKISTAN_REGIONS } from '@/lib/regions';
import { formatUzPhoneInput, personalInfoSchema, type PersonalInfoInput } from '@/lib/validation';
import { trackFieldErrors } from '@/lib/analytics/track';
import { useApplicationStore } from '@/store/useApplicationStore';

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M4 5a1 1 0 0 1 1-1h3l2 5-2 1.5a10 10 0 0 0 4.5 4.5L14 13l5 2v3a1 1 0 0 1-1 1h-1C9.4 19 4 13.6 4 6V5Z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="m3 11 18-8-8 18-2.5-7.5L3 11Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" />
      <path d="M10 21v-4h4v4" />
    </svg>
  );
}

function CapitalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 3v18M7 9l5-6 5 6M5 21h14M6 21V9h2v12M18 21V9h-2v12M10 21v-6h4v6" />
    </svg>
  );
}

const REGION_OPTIONS = UZBEKISTAN_REGIONS.map((region) => ({
  value: region,
  label: region,
  icon: region === 'Toshkent shahri' ? <CapitalIcon /> : <BuildingIcon />,
}));

export function StepPersonalInfo() {
  const personalInfo = useApplicationStore((s) => s.personalInfo);
  const setPersonalInfo = useApplicationStore((s) => s.setPersonalInfo);
  const nextStep = useApplicationStore((s) => s.nextStep);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoInput>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo,
  });

  const phone = watch('phone');

  const onSubmit = (data: PersonalInfoInput) => {
    setPersonalInfo({ ...data, telegramUsername: data.telegramUsername ?? '' });
    nextStep();
  };

  const onInvalid = (fieldErrors: Record<string, unknown>) => trackFieldErrors(fieldErrors, 'personal_info');

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="relative space-y-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <PersonIcon />
        </span>
        <div>
          <h2 className="font-heading text-xl font-bold text-charcoal">Shaxsiy ma'lumotlar</h2>
          <p className="mt-1 text-sm text-charcoal/60">Ariza beruvchi haqidagi asosiy ma'lumotlarni kiriting.</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Ism va familiya"
          icon={<PersonIcon />}
          requiredMark
          placeholder="Ismingiz va familiyangiz"
          {...register('fullName')}
          error={errors.fullName?.message}
        />
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-sm font-medium text-charcoal/80">
            <span className="text-gold"><PhoneIcon /></span>
            Telefon raqami
            <span className="text-gold">*</span>
          </span>
          <div
            className={`flex items-stretch overflow-hidden rounded-lg border bg-warm-white transition-colors focus-within:border-gold ${
              errors.phone ? 'border-red-400' : 'border-light-gray'
            }`}
          >
            <span className="flex shrink-0 items-center gap-1.5 border-r border-light-gray px-3.5 text-base text-charcoal">
              <span className="text-lg leading-none">🇺🇿</span>
              +998
            </span>
            <input
              type="tel"
              inputMode="numeric"
              className="w-full bg-transparent px-3.5 py-3 text-base text-charcoal outline-none"
              placeholder="XX XXX XX XX"
              value={phone.replace(/^\+998\s?/, '')}
              onChange={(e) => setValue('phone', formatUzPhoneInput(e.target.value), { shouldValidate: true })}
            />
          </div>
          {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
        </div>
        <Input
          label="Telegram username"
          icon={<SendIcon />}
          placeholder="Username (ixtiyoriy)"
          {...register('telegramUsername')}
          error={errors.telegramUsername?.message}
        />
        <SearchableSelect
          label="Yashash hududi"
          icon={<MapPinIcon />}
          requiredMark
          placeholder="Hududni tanlang"
          searchPlaceholder="Hudud nomini qidiring..."
          options={REGION_OPTIONS}
          value={watch('region')}
          onChange={(value) => setValue('region', value, { shouldValidate: true })}
          error={errors.region?.message}
        />
        <div className="sm:col-span-2">
          <Input
            label="Tuman yoki shahar"
            icon={<BuildingIcon />}
            requiredMark
            placeholder="Tuman yoki shahar nomini kiriting"
            {...register('district')}
            error={errors.district?.message}
          />
        </div>
      </div>
      <StepActions align="end">
        <Button type="submit" data-track="next_button" className="w-full sm:w-auto">
          Keyingi
          <ArrowRightIcon />
        </Button>
      </StepActions>
    </form>
  );
}
