import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StepActions } from '@/components/layout/StepActions';
import { UZBEKISTAN_REGIONS } from '@/lib/regions';
import { formatUzPhoneInput, personalInfoSchema, type PersonalInfoInput } from '@/lib/validation';
import { useApplicationStore } from '@/store/useApplicationStore';

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="font-heading text-lg font-semibold text-charcoal">Shaxsiy ma'lumotlar</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Ism va familiya" {...register('fullName')} error={errors.fullName?.message} />
        <Input
          label="Telefon raqami"
          value={phone}
          onChange={(e) => setValue('phone', formatUzPhoneInput(e.target.value), { shouldValidate: true })}
          error={errors.phone?.message}
          placeholder="+998 XX XXX XX XX"
        />
        <Input
          label="Telegram username"
          placeholder="@username"
          {...register('telegramUsername')}
          error={errors.telegramUsername?.message}
        />
        <Select
          label="Yashash hududi"
          placeholder="Hududni tanlang"
          options={UZBEKISTAN_REGIONS}
          {...register('region')}
          error={errors.region?.message}
        />
        <div className="sm:col-span-2">
          <Input label="Tuman yoki shahar" {...register('district')} error={errors.district?.message} />
        </div>
      </div>
      <StepActions align="end">
        <Button type="submit" className="w-full sm:w-auto">
          Keyingi
        </Button>
      </StepActions>
    </form>
  );
}
