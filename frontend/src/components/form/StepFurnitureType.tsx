import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import bedroomImage from '@/assets/images/portfolio/bedroom-1.webp';
import kitchenImage from '@/assets/images/portfolio/kitchen-1.webp';
import livingRoomImage from '@/assets/images/portfolio/livingroom-1.webp';
import officeImage from '@/assets/images/portfolio/office-1.webp';
import wardrobeImage from '@/assets/images/portfolio/wardrobe-1.webp';
import { Button } from '@/components/ui/Button';
import { StepActions } from '@/components/layout/StepActions';
import { furnitureCategorySchema, type FurnitureCategoryInput } from '@/lib/validation';
import type { FurnitureCategory } from '@/lib/types';
import { useApplicationStore } from '@/store/useApplicationStore';

interface IconProps {
  className?: string;
}

function GridIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
  );
}

function WardrobeIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M12 3v18" />
      <path d="M9.5 12h.01M14.5 12h.01" />
    </svg>
  );
}

function SofaIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <path d="M3 12h18v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z" />
      <path d="M4 18v2M20 18v2" />
    </svg>
  );
}

function BedIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5" />
      <path d="M3 18v2M21 18v2" />
      <path d="M3 13V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function DeskIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 10h18M5 10v9M19 10v9M9 10v5M15 10v5" />
    </svg>
  );
}

function PencilRulerIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m4 20 5-1 10.5-10.5a1.4 1.4 0 0 0-3-3L6 16l-1 5Z" />
      <path d="M13 6.5 17.5 11" />
      <path d="M4 20 15 9M20.5 15.5l-5-5" />
    </svg>
  );
}

function CheckIcon({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
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

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

const CATEGORIES: { value: FurnitureCategory; label: string; icon: (props: IconProps) => ReturnType<typeof GridIcon>; image?: string }[] = [
  { value: 'kitchen', label: 'Oshxona mebeli', icon: GridIcon, image: kitchenImage },
  { value: 'wardrobe', label: 'Garderob / Shkaf', icon: WardrobeIcon, image: wardrobeImage },
  { value: 'living-room', label: 'Mehmonxona mebeli', icon: SofaIcon, image: livingRoomImage },
  { value: 'bedroom', label: 'Yotoqxona mebeli', icon: BedIcon, image: bedroomImage },
  { value: 'office', label: 'Ofis mebeli', icon: DeskIcon, image: officeImage },
  { value: 'custom', label: 'Boshqa (individual loyiha)', icon: PencilRulerIcon },
];

export function StepFurnitureType() {
  const furnitureCategories = useApplicationStore((s) => s.furnitureCategories);
  const setFurnitureCategories = useApplicationStore((s) => s.setFurnitureCategories);
  const nextStep = useApplicationStore((s) => s.nextStep);
  const prevStep = useApplicationStore((s) => s.prevStep);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FurnitureCategoryInput>({
    resolver: zodResolver(furnitureCategorySchema),
    defaultValues: { furnitureCategories },
  });

  const selectedCategories = watch('furnitureCategories') ?? [];

  const onSubmit = (data: FurnitureCategoryInput) => {
    setFurnitureCategories(data.furnitureCategories);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <GridIcon />
        </span>
        <div>
          <h2 className="font-heading text-xl font-bold text-charcoal">Qanday mebel buyurtma bermoqchisiz?</h2>
          <p className="mt-1 text-sm text-charcoal/60">Bir nechta variantni tanlashingiz mumkin.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <label
            key={category.value}
            className="group relative block cursor-pointer overflow-hidden rounded-2xl border-2 border-light-gray bg-warm-white text-left transition-colors has-[:checked]:border-gold hover:border-gold/40"
          >
            <input
              type="checkbox"
              value={category.value}
              checked={selectedCategories.includes(category.value)}
              className="sr-only"
              {...register('furnitureCategories')}
            />
            <div className="relative aspect-video w-full overflow-hidden">
              {category.image ? (
                <img src={category.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-light-gray/20 text-gold">
                  <category.icon className="h-12 w-12" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-charcoal/80 to-transparent" />
              <span className="absolute right-3 bottom-3 left-3 font-semibold text-warm-white">{category.label}</span>
              <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-warm-white bg-warm-white text-warm-white group-has-[:checked]:border-gold group-has-[:checked]:bg-gold">
                <CheckIcon className="hidden group-has-[:checked]:block" />
              </span>
            </div>
          </label>
        ))}
      </div>
      {errors.furnitureCategories && <p className="text-sm text-red-500">{errors.furnitureCategories.message}</p>}

      <StepActions>
        <Button type="button" variant="ghost" onClick={prevStep} className="w-full sm:w-auto">
          <ArrowLeftIcon />
          Orqaga
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          Keyingi
          <ArrowRightIcon />
        </Button>
      </StepActions>
    </form>
  );
}
