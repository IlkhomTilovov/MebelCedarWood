interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;
        return (
          <li key={step} className="flex flex-1 items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  isDone
                    ? 'border-gold bg-gold text-charcoal'
                    : isActive
                      ? 'border-gold text-gold'
                      : 'border-light-gray text-charcoal/40'
                }`}
              >
                {isDone ? '✓' : stepNumber}
              </span>
              <span
                className={`hidden text-xs font-medium tracking-wide uppercase sm:inline ${
                  isActive ? 'text-charcoal' : 'text-charcoal/40'
                }`}
              >
                {step}
              </span>
            </div>
            {stepNumber !== steps.length && (
              <div className={`h-px flex-1 ${isDone ? 'bg-gold' : 'bg-light-gray'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
