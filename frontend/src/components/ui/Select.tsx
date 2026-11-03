import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly SelectOption[] | readonly string[];
  error?: string;
  placeholder?: string;
}

export function Select({ label, options, error, placeholder, id, className = '', ...props }: SelectProps) {
  const selectId = id ?? props.name;
  const normalized = options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt));
  return (
    <label htmlFor={selectId} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-charcoal/80">{label}</span>
      <select
        id={selectId}
        className={`border bg-warm-white px-4 py-3 text-base text-charcoal outline-none transition-colors focus:border-gold ${
          error ? 'border-red-400' : 'border-light-gray'
        } ${className}`}
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
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
