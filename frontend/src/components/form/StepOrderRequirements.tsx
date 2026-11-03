import { zodResolver } from '@hookform/resolvers/zod';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { StepActions } from '@/components/layout/StepActions';
import { orderRequirementsSchema, type OrderRequirementsInput } from '@/lib/validation';
import { useApplicationStore } from '@/store/useApplicationStore';

const MAX_PHOTO_SIZE_MB = 10;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function StepOrderRequirements() {
  const orderRequirements = useApplicationStore((s) => s.orderRequirements);
  const setOrderRequirements = useApplicationStore((s) => s.setOrderRequirements);
  const photos = useApplicationStore((s) => s.photos);
  const setPhotos = useApplicationStore((s) => s.setPhotos);
  const nextStep = useApplicationStore((s) => s.nextStep);
  const prevStep = useApplicationStore((s) => s.prevStep);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderRequirementsInput>({
    resolver: zodResolver(orderRequirementsSchema),
    defaultValues: orderRequirements,
  });

  const previews = useMemo(() => photos.map((file) => ({ file, url: URL.createObjectURL(file) })), [photos]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter(
      (file) => ACCEPTED_TYPES.includes(file.type) && file.size <= MAX_PHOTO_SIZE_MB * 1024 * 1024,
    );
    setPhotos(files);
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const onSubmit = (data: OrderRequirementsInput) => {
    setOrderRequirements({ ...data, additionalRequirements: data.additionalRequirements ?? '', photoNames: photos.map((f) => f.name) });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="font-heading text-lg font-semibold text-charcoal">Buyurtma talablari</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Taxminiy budjet"
          placeholder="masalan, 20-40 mln so'm"
          {...register('budget')}
          error={errors.budget?.message}
        />
        <Input
          label="Qachon amalga oshirmoqchisiz?"
          placeholder="masalan, 1 oy ichida"
          {...register('plannedDate')}
          error={errors.plannedDate?.message}
        />
        <div className="sm:col-span-2">
          <Textarea
            label="Qo'shimcha talablar"
            {...register('additionalRequirements')}
            error={errors.additionalRequirements?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-charcoal/80">
              Mavjud oshxona yoki xona rasmlari (ixtiyoriy)
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={onFileChange}
              className="w-full border border-light-gray px-4 py-3 text-sm text-charcoal file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2.5 file:text-xs file:font-semibold file:tracking-wide file:text-warm-white file:uppercase"
            />
            <span className="text-xs text-charcoal/50">JPG, PNG yoki WEBP, har biri 10MB gacha</span>
          </label>
          {previews.length > 0 && (
            <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {previews.map((preview, index) => (
                <li key={preview.url} className="group relative aspect-square overflow-hidden rounded-lg border border-light-gray">
                  <img src={preview.url} alt={preview.file.name} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    aria-label={`${preview.file.name} rasmini o'chirish`}
                    className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-charcoal/80 text-xs text-warm-white"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <StepActions>
        <Button type="button" variant="ghost" onClick={prevStep} className="w-full sm:w-auto">
          Orqaga
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          Keyingi
        </Button>
      </StepActions>
    </form>
  );
}
