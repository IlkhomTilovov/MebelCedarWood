import { generateApplicationNumber } from '@/lib/applicationId';
import type { ApplicationFormData, SubmittedApplication } from '@/lib/types';

export interface ConsentPayload {
  contractVersion: string;
  consentGiven: boolean;
  consentDate: string;
  consentText: string;
}

export interface ApplicationSubmission {
  form: ApplicationFormData;
  consent: ConsentPayload;
}

// MOCK implementation for the frontend-only phase (1-bosqich).
// 2-bosqichda bu funksiya backend'dagi POST /api/applications chaqirig'iga
// almashtiriladi — chaqiruvchi tomon (store) o'zgarmaydi, faqat shu funksiya ichi.
export async function submitApplication(
  submission: ApplicationSubmission,
): Promise<SubmittedApplication> {
  void submission;
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    applicationNumber: generateApplicationNumber(),
    submittedAt: new Date().toISOString(),
  };
}
