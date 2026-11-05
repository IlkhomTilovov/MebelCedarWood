import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import summaryImage from '@/assets/images/portfolio/kitchen-1.webp';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { StepActions } from '@/components/layout/StepActions';
import {
  HOME_STATUS_OPTIONS,
  MEASUREMENT_TIMING_OPTIONS,
  READINESS_TIMING_OPTIONS,
  START_TIMING_OPTIONS,
} from '@/lib/regions';
import { orderRequirementsSchema, type OrderRequirementsInput } from '@/lib/validation';
import { useApplicationStore } from '@/store/useApplicationStore';

interface IconProps {
  className?: string;
}

function ClipboardListIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="4" width="14" height="17" rx="1.5" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 14.5h6M9 18h3.5" />
    </svg>
  );
}

function HouseCheckIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
      <path d="m9.5 14 1.8 1.8L15 12" />
    </svg>
  );
}

function ToolsIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z" />
    </svg>
  );
}

function BricksIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="14" width="7" height="5" rx="0.5" />
      <rect x="10" y="14" width="7" height="5" rx="0.5" />
      <rect x="17" y="14" width="4" height="5" rx="0.5" />
      <rect x="6.5" y="9" width="7" height="5" rx="0.5" />
      <rect x="13.5" y="9" width="7" height="5" rx="0.5" />
    </svg>
  );
}

function BuildingIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h1M14 7h1M9 11h1M14 11h1" />
      <path d="M10 21v-4h4v4" />
    </svg>
  );
}

function OtherDotsIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
      <circle cx="6" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18" cy="12" r="1.6" />
    </svg>
  );
}

function SunIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

function CalendarArrowIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="5" width="13" height="15" rx="1.5" />
      <path d="M11 3v4M7 3v4M3 9.5h13" />
      <path d="m16 14 4 3-4 3" />
    </svg>
  );
}

function CalendarGridIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M16 3v4M8 3v4M3.5 10h17" />
      <path d="M7.5 14h.01M12 14h.01M16.5 14h.01M7.5 17h.01M12 17h.01" />
    </svg>
  );
}

function ChatIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 5h16v11H9l-5 4V5Z" />
      <path d="M8 9h8M8 12.5h5" />
    </svg>
  );
}

function CalendarTargetIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M16 3v4M8 3v4M3.5 10h17" />
      <circle cx="12" cy="15" r="2.3" />
    </svg>
  );
}

function CalendarStackIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2.5" y="4" width="15" height="3.5" rx="1" opacity="0.4" />
      <rect x="5.5" y="7" width="15" height="13" rx="1.5" />
      <path d="M18 5v4M10 5v4M5.5 11.5h15" />
    </svg>
  );
}

function BoltIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function BarsIcon({ level, className = 'h-5 w-5' }: IconProps & { level: number }) {
  const heights = [6, 10, 14, 18];
  return (
    <svg viewBox="0 0 24 24" className={className}>
      {heights.map((h, i) => (
        <rect
          key={h}
          x={3 + i * 5}
          y={20 - h}
          width={3.2}
          height={h}
          rx={1}
          fill={i < level ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={1.3}
        />
      ))}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <path d="m5 13 4 4L19 7" />
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

const HOME_STATUS_ICONS: Record<string, ReactNode> = {
  repaired: <HouseCheckIcon />,
  'in-progress': <ToolsIcon />,
  'not-started': <BricksIcon />,
  'new-home': <BuildingIcon />,
  other: <OtherDotsIcon />,
};

const MEASUREMENT_TIMING_ICONS: Record<string, ReactNode> = {
  today: <SunIcon />,
  tomorrow: <CalendarArrowIcon />,
  'this-week': <CalendarGridIcon />,
  'next-week': <CalendarArrowIcon />,
  'schedule-later': <ChatIcon />,
};

const READINESS_TIMING_ICONS: Record<string, ReactNode> = {
  '1-2-weeks': <BarsIcon level={1} />,
  '2-3-weeks': <BarsIcon level={2} />,
  '1-month': <BarsIcon level={3} />,
  '1-2-months': <BarsIcon level={4} />,
  'specific-date': <CalendarTargetIcon />,
};

const START_TIMING_ICONS: Record<string, ReactNode> = {
  asap: <BoltIcon />,
  'this-week': <CalendarGridIcon />,
  'next-week': <CalendarArrowIcon />,
  'next-month': <CalendarStackIcon />,
  'schedule-later': <ChatIcon />,
};

const HOME_STATUS_CHOICES = HOME_STATUS_OPTIONS.map((opt) => ({ ...opt, icon: HOME_STATUS_ICONS[opt.value] }));
const MEASUREMENT_TIMING_CHOICES = MEASUREMENT_TIMING_OPTIONS.map((opt) => ({
  ...opt,
  icon: MEASUREMENT_TIMING_ICONS[opt.value],
}));
const READINESS_TIMING_CHOICES = READINESS_TIMING_OPTIONS.map((opt) => ({
  ...opt,
  icon: READINESS_TIMING_ICONS[opt.value],
}));
const START_TIMING_CHOICES = START_TIMING_OPTIONS.map((opt) => ({ ...opt, icon: START_TIMING_ICONS[opt.value] }));

interface OptionGridProps<T extends string> {
  label: string;
  icon: ReactNode;
  requiredMark?: boolean;
  options: readonly { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onSelect: (value: T) => void;
  error?: string;
}

function OptionGrid<T extends string>({ label, icon, requiredMark, options, value, onSelect, error }: OptionGridProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-1.5 text-sm font-semibold text-charcoal">
        <span className="text-gold">{icon}</span>
        {label}
        {requiredMark && <span className="text-gold">*</span>}
      </span>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`relative flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors ${
                selected
                  ? 'border-gold bg-gold/10 text-charcoal'
                  : 'border-light-gray bg-warm-white text-charcoal/70 hover:border-gold/40'
              }`}
            >
              {opt.icon && (
                <span className={`shrink-0 ${selected ? 'text-gold' : 'text-charcoal/35'}`}>{opt.icon}</span>
              )}
              <span>{opt.label}</span>
              {selected && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-charcoal">
                  <CheckIcon />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: ReactNode; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 border-b border-light-gray/60 py-2.5 last:border-0">
      <span className="mt-0.5 shrink-0 text-gold">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-charcoal/50">{label}</p>
        <p className="truncate text-sm font-semibold text-charcoal">{value}</p>
      </div>
    </div>
  );
}

export function StepOrderRequirements() {
  const orderRequirements = useApplicationStore((s) => s.orderRequirements);
  const setOrderRequirements = useApplicationStore((s) => s.setOrderRequirements);
  const nextStep = useApplicationStore((s) => s.nextStep);
  const prevStep = useApplicationStore((s) => s.prevStep);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderRequirementsInput>({
    resolver: zodResolver(orderRequirementsSchema),
    defaultValues: orderRequirements,
  });

  const values = watch();

  const onSubmit = (data: OrderRequirementsInput) => {
    setOrderRequirements({
      ...data,
      specificReadinessDate: data.specificReadinessDate ?? '',
      additionalNotes: data.additionalNotes ?? '',
    });
    nextStep();
  };

  const summaryItems: { icon: ReactNode; label: string; value?: string }[] = [
    {
      icon: <ClipboardListIcon className="h-4 w-4" />,
      label: 'Uy holati',
      value: HOME_STATUS_OPTIONS.find((o) => o.value === values.homeStatus)?.label,
    },
    {
      icon: <CalendarArrowIcon className="h-4 w-4" />,
      label: "O'lchov uchun",
      value: MEASUREMENT_TIMING_OPTIONS.find((o) => o.value === values.measurementTiming)?.label,
    },
    {
      icon: <CalendarGridIcon className="h-4 w-4" />,
      label: 'Tayyor bo\'lish muddati',
      value:
        values.readinessTiming === 'specific-date' && values.specificReadinessDate
          ? values.specificReadinessDate
          : READINESS_TIMING_OPTIONS.find((o) => o.value === values.readinessTiming)?.label,
    },
    {
      icon: <BoltIcon className="h-4 w-4" />,
      label: 'Loyihani boshlash',
      value: START_TIMING_OPTIONS.find((o) => o.value === values.startTiming)?.label,
    },
  ];
  const filledSummaryItems = summaryItems.filter((item) => item.value);

  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-7 lg:col-span-2">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <ClipboardListIcon />
          </span>
          <div>
            <h2 className="font-heading text-xl font-bold text-charcoal">Loyiha rejalari</h2>
            <p className="mt-1 text-sm text-charcoal/60">
              Loyihani qachon boshlash, o'lchovga qachon borish va mebel qachon tayyor bo'lishini belgilang.
            </p>
          </div>
        </div>

        <OptionGrid
          label="Uyingiz hozir qanday holatda?"
          icon={<HouseCheckIcon />}
          requiredMark
          options={HOME_STATUS_CHOICES}
          value={values.homeStatus}
          onSelect={(v) => setValue('homeStatus', v, { shouldValidate: true, shouldDirty: true })}
          error={errors.homeStatus?.message}
        />

        <OptionGrid
          label="O'lchovga qachon borishimiz mumkin?"
          icon={<CalendarArrowIcon />}
          requiredMark
          options={MEASUREMENT_TIMING_CHOICES}
          value={values.measurementTiming}
          onSelect={(v) => setValue('measurementTiming', v, { shouldValidate: true, shouldDirty: true })}
          error={errors.measurementTiming?.message}
        />

        <div className="space-y-3">
          <OptionGrid
            label="Mebel qachongacha tayyor bo'lishi kerak?"
            icon={<CalendarGridIcon />}
            requiredMark
            options={READINESS_TIMING_CHOICES}
            value={values.readinessTiming}
            onSelect={(v) => setValue('readinessTiming', v, { shouldValidate: true, shouldDirty: true })}
            error={errors.readinessTiming?.message}
          />
          {values.readinessTiming === 'specific-date' && (
            <Input
              label="Aniq sana"
              type="date"
              icon={<CalendarTargetIcon />}
              requiredMark
              {...register('specificReadinessDate')}
              error={errors.specificReadinessDate?.message}
            />
          )}
        </div>

        <OptionGrid
          label="Loyihani qachon boshlashni xohlaysiz?"
          icon={<BoltIcon />}
          requiredMark
          options={START_TIMING_CHOICES}
          value={values.startTiming}
          onSelect={(v) => setValue('startTiming', v, { shouldValidate: true, shouldDirty: true })}
          error={errors.startTiming?.message}
        />

        <Textarea
          label="Qo'shimcha ma'lumot"
          placeholder="Masalan: ko'chib kirish sanasi, shoshilinch muddat yoki boshqa muhim ma'lumot..."
          {...register('additionalNotes')}
          error={errors.additionalNotes?.message}
        />

        <StepActions>
          <Button type="button" variant="ghost" onClick={prevStep} className="w-full sm:w-auto">
            Orqaga
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            Keyingi
            <ArrowRightIcon />
          </Button>
        </StepActions>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-6">
        <div className="overflow-hidden rounded-2xl border border-light-gray">
          <img src={summaryImage} alt="" className="h-36 w-full object-cover" />
        </div>
        <div className="rounded-2xl border border-gold/25 bg-warm-white p-6">
          <h3 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <ClipboardListIcon className="h-5 w-5" />
            Sizning rejangiz
          </h3>
          {filledSummaryItems.length === 0 ? (
            <p className="mt-4 text-xs text-charcoal/40">
              Maydonlarni to'ldirishni boshlang — tanlovlaringiz shu yerda ko'rinadi.
            </p>
          ) : (
            <div className="mt-3">
              {filledSummaryItems.map((item) => (
                <SummaryRow key={item.label} icon={item.icon} label={item.label} value={item.value} />
              ))}
            </div>
          )}
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-light-gray bg-light-gray/10 p-3">
            <span className="text-xs leading-relaxed text-charcoal/50">
              O'lchovdan keyin aniq muddatni mutaxassisimiz belgilaydi.
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
