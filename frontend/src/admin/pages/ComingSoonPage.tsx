interface ComingSoonPageProps {
  title: string;
  note: string;
}

export function ComingSoonPage({ title, note }: ComingSoonPageProps) {
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-charcoal">{title}</h1>
      <div className="rounded-xl border border-dashed border-light-gray bg-warm-white p-8 text-center text-sm text-charcoal/60">
        {note}
      </div>
    </div>
  );
}
