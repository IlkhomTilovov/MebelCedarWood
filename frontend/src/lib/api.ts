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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://194.99.21.44';

export async function submitApplication(
  submission: ApplicationSubmission,
): Promise<SubmittedApplication> {
  const response = await fetch(`${API_BASE_URL}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    throw new Error('Arizani yuborishda xatolik yuz berdi');
  }

  return response.json();
}
