export type FurnitureCategory = 'kitchen' | 'wardrobe' | 'living-room' | 'bedroom' | 'office' | 'custom';

export type HomeStatus = 'repaired' | 'in-progress' | 'not-started' | 'new-home' | 'other';

export type MeasurementTiming = 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'schedule-later';

export type ReadinessTiming = '1-2-weeks' | '2-3-weeks' | '1-month' | '1-2-months' | 'specific-date';

export type StartTiming = 'asap' | 'this-week' | 'next-week' | 'next-month' | 'schedule-later';

export interface PersonalInfo {
  fullName: string;
  phone: string;
  telegramUsername: string;
  region: string;
  district: string;
}

export interface OrderRequirements {
  homeStatus: HomeStatus;
  measurementTiming: MeasurementTiming;
  readinessTiming: ReadinessTiming;
  specificReadinessDate: string;
  startTiming: StartTiming;
  additionalNotes: string;
}

export interface ApplicationFormData {
  personalInfo: PersonalInfo;
  furnitureCategories: FurnitureCategory[];
  orderRequirements: OrderRequirements;
}

export interface SubmittedApplication {
  applicationNumber: string;
  submittedAt: string;
}
