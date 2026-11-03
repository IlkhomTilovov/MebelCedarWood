import { z } from 'zod';

export const UZ_PHONE_REGEX = /^\+998\d{9}$/;

export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(3, "Ism va familiyani to'liq kiriting"),
  phone: z.string().regex(UZ_PHONE_REGEX, "Telefon raqamini to'liq kiriting: +998 XX XXX XX XX"),
  telegramUsername: z.string().trim().optional(),
  region: z.string().min(1, 'Hududni tanlang'),
  district: z.string().trim().min(2, "Tuman yoki shaharni kiriting"),
});

export const kitchenInfoSchema = z.object({
  address: z.string().trim().min(5, 'Manzilni to‘liq kiriting'),
  kitchenSize: z.string().trim().min(1, "Taxminiy uzunlikni kiriting"),
  kitchenShape: z.enum(['straight', 'l-shape', 'u-shape', 'other']),
  style: z.enum(['modern', 'minimalist', 'classic', 'other']),
  materialPreference: z.string().trim().min(2, 'Material bo‘yicha istagingizni kiriting'),
  comment: z.string().trim().optional(),
});

export const orderRequirementsSchema = z.object({
  budget: z.string().trim().min(1, 'Taxminiy budjetni kiriting'),
  plannedDate: z.string().trim().min(1, 'Taxminiy sanani kiriting'),
  additionalRequirements: z.string().trim().optional(),
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type KitchenInfoInput = z.infer<typeof kitchenInfoSchema>;
export type OrderRequirementsInput = z.infer<typeof orderRequirementsSchema>;

export function formatUzPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^998/, '');
  const d = digits.slice(0, 9);
  let out = '+998';
  if (d.length > 0) out += ' ' + d.slice(0, 2);
  if (d.length > 2) out += ' ' + d.slice(2, 5);
  if (d.length > 5) out += ' ' + d.slice(5, 7);
  if (d.length > 7) out += ' ' + d.slice(7, 9);
  return out;
}

export function toRawPhone(formatted: string): string {
  const digits = formatted.replace(/\D/g, '').replace(/^998/, '');
  return `+998${digits}`;
}
