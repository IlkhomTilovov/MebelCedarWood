export const UZBEKISTAN_REGIONS = [
  'Toshkent shahri',
  'Toshkent viloyati',
  "Andijon viloyati",
  "Farg'ona viloyati",
  'Namangan viloyati',
  'Samarqand viloyati',
  'Buxoro viloyati',
  'Navoiy viloyati',
  'Qashqadaryo viloyati',
  'Surxondaryo viloyati',
  'Jizzax viloyati',
  'Sirdaryo viloyati',
  'Xorazm viloyati',
  "Qoraqalpog'iston Respublikasi",
] as const;

export const HOME_STATUS_OPTIONS = [
  { value: 'repaired', label: "Ta'mir tugagan" },
  { value: 'in-progress', label: "Ta'mir jarayonida" },
  { value: 'not-started', label: "Ta'mir hali boshlanmagan" },
  { value: 'new-home', label: 'Yangi uy' },
  { value: 'other', label: 'Boshqa' },
] as const;

export const MEASUREMENT_TIMING_OPTIONS = [
  { value: 'today', label: 'Bugun' },
  { value: 'tomorrow', label: 'Ertaga' },
  { value: 'this-week', label: 'Shu hafta' },
  { value: 'next-week', label: 'Keyingi hafta' },
  { value: 'schedule-later', label: 'Vaqtni kelishamiz' },
] as const;

export const READINESS_TIMING_OPTIONS = [
  { value: '1-2-weeks', label: '1–2 hafta ichida' },
  { value: '2-3-weeks', label: '2–3 hafta ichida' },
  { value: '1-month', label: '1 oy ichida' },
  { value: '1-2-months', label: '1–2 oy ichida' },
  { value: 'specific-date', label: 'Aniq muddatim bor' },
] as const;

export const START_TIMING_OPTIONS = [
  { value: 'asap', label: 'Imkon qadar tezroq' },
  { value: 'this-week', label: 'Shu hafta' },
  { value: 'next-week', label: 'Keyingi hafta' },
  { value: 'next-month', label: 'Keyingi oy' },
  { value: 'schedule-later', label: 'Vaqtni kelishamiz' },
] as const;
