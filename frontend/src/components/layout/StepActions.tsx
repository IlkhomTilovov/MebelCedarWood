import type { ReactNode } from 'react';

interface StepActionsProps {
  children: ReactNode;
  align?: 'end' | 'between';
}

export function StepActions({ children, align = 'between' }: StepActionsProps) {
  const alignClass = align === 'end' ? 'sm:justify-end' : 'sm:justify-between';
  return (
    <div
      className={`sticky bottom-0 -mx-4 flex flex-col-reverse gap-3 border-t border-light-gray bg-warm-white px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:flex-row sm:items-center sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 ${alignClass}`}
    >
      {children}
    </div>
  );
}
