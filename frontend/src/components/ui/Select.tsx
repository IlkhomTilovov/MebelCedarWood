import type { ReactNode, SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly SelectOption[] | readonly string[];
  error?: string;
  placeholder?: string;
  icon?: ReactNode;
  requiredMark?: boolean;
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Select({
  label,
  options,
  error,
  placeholder,
  icon,
  requiredMark,
  id,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;
  const normalized = options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
  return (
    <label htmlFor={selectId} className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-sm font-medium text-charcoal/80">
        {icon && <span className="text-gold">{icon}</span>}
        {label}
        {requiredMark && <span className="text-gold">*</span>}
      </span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-charcoal/30">{icon}</span>
        )}
        <select
          id={selectId}
          className={`w-full appearance-none rounded-lg border bg-warm-white px-4 py-3 pr-10 text-base text-charcoal outline-none transition-colors focus:border-gold ${
            icon ? 'pl-11' : ''
          } ${error ? 'border-red-400' : 'border-light-gray'} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {normalized.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-charcoal/40">
          <ChevronDownIcon />
        </span>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
