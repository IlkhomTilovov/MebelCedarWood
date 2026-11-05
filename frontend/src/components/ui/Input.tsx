import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  requiredMark?: boolean;
}

export function Input({ label, error, hint, icon, requiredMark, id, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-sm font-medium text-charcoal/80">
        {icon && <span className="text-gold">{icon}</span>}
        {label}
        {requiredMark && <span className="text-gold">*</span>}
      </span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-charcoal/30">{icon}</span>
        )}
        <input
          id={inputId}
          className={`w-full rounded-lg border px-4 py-3 text-base text-charcoal outline-none transition-colors focus:border-gold ${
            icon ? 'pl-11' : ''
          } ${error ? 'border-red-400' : 'border-light-gray'} ${className}`}
          {...props}
        />
      </div>
      {hint && !error && <span className="text-xs text-charcoal/50">{hint}</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
