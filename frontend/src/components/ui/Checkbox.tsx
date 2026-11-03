import type { InputHTMLAttributes, ReactNode } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

export function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  const checkboxId = id ?? props.name;
  return (
    <label
      htmlFor={checkboxId}
      className={`flex cursor-pointer items-start gap-3 ${props.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <input
        id={checkboxId}
        type="checkbox"
        className={`mt-1 h-6 w-6 shrink-0 rounded-md border-2 border-gold accent-gold ${className}`}
        {...props}
      />
      <span className="text-base leading-relaxed font-bold text-charcoal">{label}</span>
    </label>
  );
}
