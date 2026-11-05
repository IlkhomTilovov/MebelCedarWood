import { z } from 'zod';

export const UZ_PHONE_REGEX = /^\+998\d{9}$/;

export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(3, "Ism va familiyani to'liq kiriting"),
  phone: z
    .string()
    .refine((value) => UZ_PHONE_REGEX.test(toRawPhone(value)), {
      message: "Telefon raqamini to'liq kiriting: +998 XX XXX XX XX",
    }),
  telegramUsername: z.string().trim().optional(),
  region: z.string().min(1, 'Hududni tanlang'),
  district: z.string().trim().min(2, "Tuman yoki shaharni kiriting"),
});

export const FURNITURE_CATEGORY_VALUES = ['kitchen', 'wardrobe', 'living-room', 'bedroom', 'office', 'custom'] as const;

export const furnitureCategorySchema = z.object({
  furnitureCategories: z.array(z.enum(FURNITURE_CATEGORY_VALUES)).min(1, 'Kamida bitta mebel turini tanlang'),
});

export const HOME_STATUS_VALUES = ['repaired', 'in-progress', 'not-started', 'new-home', 'other'] as const;

export const MEASUREMENT_TIMING_VALUES = ['today', 'tomorrow', 'this-week', 'next-week', 'schedule-later'] as const;

export const READINESS_TIMING_VALUES = ['1-2-weeks', '2-3-weeks', '1-month', '1-2-months', 'specific-date'] as const;

export const START_TIMING_VALUES = ['asap', 'this-week', 'next-week', 'next-month', 'schedule-later'] as const;

export const orderRequirementsSchema = z
  .object({
    homeStatus: z.enum(HOME_STATUS_VALUES, { message: 'Uy holatini tanlang' }),
    measurementTiming: z.enum(MEASUREMENT_TIMING_VALUES, { message: "O'lchov uchun qulay vaqtni tanlang" }),
    readinessTiming: z.enum(READINESS_TIMING_VALUES, { message: "Mebel tayyor bo'lish muddatini tanlang" }),
    specificReadinessDate: z.string().trim().optional(),
    startTiming: z.enum(START_TIMING_VALUES, { message: 'Loyihani boshlash vaqtini tanlang' }),
    additionalNotes: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.readinessTiming === 'specific-date' && !data.specificReadinessDate?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['specificReadinessDate'], message: 'Aniq sanani kiriting' });
    }
  });

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type FurnitureCategoryInput = z.infer<typeof furnitureCategorySchema>;
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
