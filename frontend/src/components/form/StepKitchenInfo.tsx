import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { StepActions } from '@/components/layout/StepActions';
import { FURNITURE_STYLES, KITCHEN_SHAPES } from '@/lib/regions';
import { kitchenInfoSchema, type KitchenInfoInput } from '@/lib/validation';
import { useApplicationStore } from '@/store/useApplicationStore';

export function StepKitchenInfo() {
  const kitchenInfo = useApplicationStore((s) => s.kitchenInfo);
  const setKitchenInfo = useApplicationStore((s) => s.setKitchenInfo);
  const nextStep = useApplicationStore((s) => s.nextStep);
  const prevStep = useApplicationStore((s) => s.prevStep);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KitchenInfoInput>({
    resolver: zodResolver(kitchenInfoSchema),
    defaultValues: kitchenInfo,
  });

  const onSubmit = (data: KitchenInfoInput) => {
    setKitchenInfo({ ...data, comment: data.comment ?? '' });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="font-heading text-lg font-semibold text-charcoal">Oshxona haqida ma'lumot</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input label="Oshxona joylashgan manzil" {...register('address')} error={errors.address?.message} />
        </div>
        <Input
          label="Taxminiy uzunligi (m)"
          placeholder="masalan, 3.5"
          {...register('kitchenSize')}
          error={errors.kitchenSize?.message}
        />
        <Select
          label="Oshxona shakli"
          options={KITCHEN_SHAPES}
          {...register('kitchenShape')}
          error={errors.kitchenShape?.message}
        />
        <Select
          label="Mebel uslubi"
          options={FURNITURE_STYLES}
          {...register('style')}
          error={errors.style?.message}
        />
        <Input
          label="Material bo'yicha istak"
          placeholder="masalan, MDF, massiv yog'och"
          {...register('materialPreference')}
          error={errors.materialPreference?.message}
        />
        <div className="sm:col-span-2">
          <Textarea label="Qo'shimcha izoh" {...register('comment')} error={errors.comment?.message} />
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
