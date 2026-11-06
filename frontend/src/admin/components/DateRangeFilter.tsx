import { DATE_RANGE_OPTIONS, type DateRangeKey } from '@/admin/useDateRangeFilter';

interface DateRangeFilterProps {
  value: DateRangeKey;
  onChange: (value: DateRangeKey) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="inline-flex rounded-lg border border-light-gray bg-warm-white p-1">
      {DATE_RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            value === opt.key ? 'bg-charcoal text-warm-white' : 'text-charcoal/60 hover:text-charcoal'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
