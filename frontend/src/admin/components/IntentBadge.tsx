const STYLES: Record<string, string> = {
  HIGH: 'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW: 'bg-light-gray text-charcoal/50',
};

export function IntentBadge({ score, label }: { score: number; label: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[label] ?? STYLES.LOW}`}>
      {label} · {score}
    </span>
  );
}
