import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-charcoal/80">{label}</span>
      <input
        id={inputId}
        className={`border px-4 py-3 text-base text-charcoal outline-none transition-colors focus:border-gold ${
          error ? 'border-red-400' : 'border-light-gray'
        } ${className}`}
        {...props}
      />
      {hint && !error && <span className="text-xs text-charcoal/50">{hint}</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
