export type KitchenShape = 'straight' | 'l-shape' | 'u-shape' | 'other';

export type FurnitureStyle = 'modern' | 'minimalist' | 'classic' | 'other';

export interface PersonalInfo {
  fullName: string;
  phone: string;
  telegramUsername: string;
  region: string;
  district: string;
}

export interface KitchenInfo {
  address: string;
  kitchenSize: string;
  kitchenShape: KitchenShape;
  style: FurnitureStyle;
  materialPreference: string;
  comment: string;
}

export interface OrderRequirements {
  budget: string;
  plannedDate: string;
  additionalRequirements: string;
  photoNames: string[];
}

export interface ApplicationFormData {
  personalInfo: PersonalInfo;
  kitchenInfo: KitchenInfo;
  orderRequirements: OrderRequirements;
}

export interface SubmittedApplication {
  applicationNumber: string;
  submittedAt: string;
}
