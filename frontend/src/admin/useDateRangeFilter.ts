import { useState } from 'react';

export type DateRangeKey = 'today' | 'yesterday' | '7d' | '30d' | '90d';

export const DATE_RANGE_OPTIONS: { key: DateRangeKey; label: string }[] = [
  { key: 'today', label: 'Bugun' },
  { key: 'yesterday', label: 'Kecha' },
  { key: '7d', label: '7 kun' },
  { key: '30d', label: '30 kun' },
  { key: '90d', label: '90 kun' },
];

export function useDateRangeFilter(initial: DateRangeKey = '7d') {
  const [range, setRange] = useState<DateRangeKey>(initial);
  return { range, setRange, params: { range } };
}
