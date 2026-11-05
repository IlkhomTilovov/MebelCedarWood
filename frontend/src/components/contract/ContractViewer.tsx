import { useEffect, useRef, useState } from 'react';
import headerImage from '@/assets/images/portfolio/kitchen-1.webp';
import { CONTRACT_SECTIONS, CONTRACT_SUMMARY, CONTRACT_TITLE } from '@/lib/contract';

interface ContractViewerProps {
  onReachEnd: () => void;
}

interface IconProps {
  className?: string;
}

function PeopleIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 13.3A4.5 4.5 0 0 1 20.5 17.5" />
    </svg>
  );
}

function LayersIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

function CalendarIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M16 3v4M8 3v4M3.5 10h17" />
    </svg>
  );
}

function ShieldAlertIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z" />
      <path d="M12 8v4.5M12 15.5h.01" />
    </svg>
  );
}

function ChecklistIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="3.5" width="16" height="17" rx="1.5" />
      <path d="m8 9 1.5 1.5L12 8M8 15.5l1.5 1.5 2.5-2.5" />
      <path d="M14.5 9.3h3M14.5 15.8h3" />
    </svg>
  );
}

function TruckIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 7h11v9H2z" />
      <path d="M13 10h4l3 3v3h-7z" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="16.5" cy="18" r="1.6" />
    </svg>
  );
}

function ShieldCheckIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ScaleIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v18M7 21h10" />
      <path d="M12 6 5 7.5 3 13a3.5 3.5 0 0 0 7 0L8 7.2" />
      <path d="M12 6l7 1.5L21 13a3.5 3.5 0 0 1-7 0l2-5.8" />
    </svg>
  );
}

function ChevronDownIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function PencilIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      <path d="m14.5 5.5 3 3" />
    </svg>
  );
}

type SectionIconComponent = (props: IconProps) => ReturnType<typeof LayersIcon>;

const SECTION_ICONS: Record<string, SectionIconComponent> = {
  parties: PeopleIcon,
  payment: LayersIcon,
  deadline: CalendarIcon,
  penalty: ShieldAlertIcon,
  'customer-duties': ChecklistIcon,
  delivery: TruckIcon,
  warranty: ShieldCheckIcon,
  final: ScaleIcon,
};

function ContractBlocks({ blocks }: { blocks: (typeof CONTRACT_SECTIONS)[number]['blocks'] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'p') {
          return (
            <p key={i} className="text-sm leading-relaxed text-charcoal/70">
              {block.text}
            </p>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-charcoal/70">
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <div key={i} className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              {block.headers && (
                <thead>
                  <tr>
                    {block.headers.map((header, j) => (
                      <th
                        key={j}
                        className="border border-light-gray bg-gold/15 px-3 py-2 text-left font-semibold text-charcoal"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {block.rows.map((row, j) => (
                  <tr key={j}>
                    {row.map((cell, k) => (
                      <td key={k} className="border border-light-gray px-3 py-2 text-charcoal/70">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

export function ContractViewer({ onReachEnd }: ContractViewerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const numberedSections = CONTRACT_SECTIONS.filter((s) => s.id !== 'signatures');
  const signatures = CONTRACT_SECTIONS.find((s) => s.id === 'signatures');
  const [openId, setOpenId] = useState<string | null>(numberedSections[0]?.id ?? null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onReachEnd();
        }
      },
      { threshold: 1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onReachEnd]);

  return (
    <div className="overflow-hidden rounded-2xl border border-light-gray bg-warm-white">
      <div className="grid gap-6 border-b border-light-gray p-6 sm:p-8 md:grid-cols-[1.3fr_1fr] md:items-stretch">
        <div className="flex flex-col justify-center border-gold md:border-l-4 md:pl-6">
          <h1 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">{CONTRACT_TITLE}</h1>
          <p className="mt-4 text-sm leading-relaxed text-charcoal/60">{CONTRACT_SUMMARY}</p>
        </div>
        <div className="hidden overflow-hidden rounded-xl md:block">
          <img src={headerImage} alt="" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="px-4 py-6 sm:px-8 sm:py-8">
        <div className="mb-6 flex items-start gap-4 rounded-xl bg-gold/10 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold text-charcoal">
            <ShieldAlertIcon className="h-5 w-5" />
          </span>
          <p className="text-sm leading-relaxed text-charcoal/70">
            Ushbu matn <strong>qoralama</strong> hisoblanadi. Qavs ichidagi [ ] maydonlar har bir
            buyurtma uchun aniq ma'lumotlar bilan to'ldiriladi.
          </p>
        </div>

        <div className="space-y-3">
          {numberedSections.map((section, index) => {
            const Icon = SECTION_ICONS[section.id] ?? LayersIcon;
            const isOpen = openId === section.id;
            return (
              <div key={section.id} className="overflow-hidden rounded-xl border border-light-gray bg-warm-white">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : section.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold font-heading text-sm font-bold text-warm-white">
                    {index + 1}
                  </span>
                  <Icon className="h-5 w-5 shrink-0 text-gold" />
                  <h2 className="flex-1 font-heading text-base font-semibold text-charcoal">{section.heading}</h2>
                  <ChevronDownIcon
                    className={`h-4 w-4 shrink-0 text-charcoal/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="space-y-3 border-t border-light-gray px-4 py-4 sm:px-5">
                    <div className="space-y-3 border-l-2 border-gold pl-4">
                      <ContractBlocks blocks={section.blocks} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {signatures && (
          <div className="mt-6 rounded-xl border border-light-gray bg-warm-white px-4 py-5 sm:px-5">
            <div className="flex items-center gap-2">
              <PencilIcon className="h-5 w-5 shrink-0 text-gold" />
              <h2 className="font-heading text-base font-semibold text-charcoal">{signatures.heading}</h2>
            </div>
            <div className="mt-4">
              <ContractBlocks blocks={signatures.blocks} />
            </div>
          </div>
        )}

        <div ref={sentinelRef} className="h-px" />
        <p className="mt-10 text-center text-xs tracking-wide text-charcoal/40 uppercase">
          — Shartnoma matni shu yerda tugaydi —
        </p>
      </div>
    </div>
  );
}
