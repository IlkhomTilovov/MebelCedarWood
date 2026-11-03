const COUNTER_KEY = 'cedarwood-application-counter';

// Mock ID generator for the frontend-only phase. Will be replaced by the
// backend-assigned ApplicationNumber once POST /api/applications exists.
export function generateApplicationNumber(): string {
  const current = Number(localStorage.getItem(COUNTER_KEY) ?? '0');
  const next = current + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return `CW-${String(next).padStart(5, '0')}`;
}
