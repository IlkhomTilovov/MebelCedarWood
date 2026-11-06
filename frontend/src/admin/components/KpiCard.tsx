interface KpiCardProps {
  label: string;
  value: string | number;
  change?: number;
}

export function KpiCard({ label, value, change }: KpiCardProps) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <div className="rounded-xl border border-light-gray bg-warm-white p-5">
      <div className="text-xs font-semibold tracking-widest text-charcoal/50 uppercase">{label}</div>
      <div className="mt-2 font-heading text-2xl font-bold text-charcoal">{value}</div>
      {change !== undefined && (
        <div className={`mt-1 text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}
          {change}%
        </div>
      )}
    </div>
  );
}
