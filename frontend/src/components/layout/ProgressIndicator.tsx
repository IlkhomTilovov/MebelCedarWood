interface Step {
  title: string;
  subtitle: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;
        return (
          <li key={step.title} className="flex items-center gap-2 sm:gap-4">
            <div
              className={`flex items-center gap-2.5 rounded-full p-1 transition-colors ${
                isActive ? 'border border-gold/40 bg-gold/15 sm:pr-5' : ''
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  isDone || isActive
                    ? 'border-gold bg-gold text-charcoal'
                    : 'border-light-gray text-charcoal/40'
                }`}
              >
                {isDone ? '✓' : stepNumber}
              </span>
              <span className="hidden flex-col leading-tight sm:flex">
                <span className={`text-xs font-bold ${isActive || isDone ? 'text-charcoal' : 'text-charcoal/50'}`}>
                  {step.title}
                </span>
                <span className="text-[11px] text-charcoal/40">{step.subtitle}</span>
              </span>
            </div>
            {stepNumber !== steps.length && (
              <div className={`h-px w-6 sm:w-10 ${isDone ? 'bg-gold' : 'bg-light-gray'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
