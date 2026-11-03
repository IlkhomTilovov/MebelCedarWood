import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gold text-charcoal hover:bg-[#a68a56] disabled:bg-light-gray disabled:text-gray-400',
  secondary:
    'bg-transparent text-warm-white border border-warm-white/40 hover:border-warm-white disabled:opacity-40',
  ghost:
    'bg-transparent text-charcoal border border-charcoal/20 hover:border-charcoal disabled:opacity-40',
};

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold tracking-wide uppercase transition-colors duration-200 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
