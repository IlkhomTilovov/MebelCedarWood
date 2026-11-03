import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, className = '', ...props }: TextareaProps) {
  const textareaId = id ?? props.name;
  return (
    <label htmlFor={textareaId} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-charcoal/80">{label}</span>
      <textarea
        id={textareaId}
        rows={4}
        className={`border px-4 py-3 text-base text-charcoal outline-none transition-colors focus:border-gold ${
          error ? 'border-red-400' : 'border-light-gray'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
