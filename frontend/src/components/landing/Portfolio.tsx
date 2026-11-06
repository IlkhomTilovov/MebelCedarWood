import { useState } from 'react';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import bedroomImage from '@/assets/images/portfolio/bedroom-1.webp';
import kitchenImage from '@/assets/images/portfolio/kitchen-1.webp';
import livingRoomImage from '@/assets/images/portfolio/livingroom-1.webp';
import officeImage from '@/assets/images/portfolio/office-1.webp';
import portfolioBgImage from '@/assets/images/portfolio/portfolio-bg-1.webp';
import { useSectionViewTracking } from '@/lib/analytics/useSectionViewTracking';

type RoomCategory = 'Oshxona' | 'Yotoqxona' | 'Mehmonxona' | 'Ofis' | 'Garderob' | 'Tijorat';

interface IconProps {
  className?: string;
}

interface Project {
  title: string;
  category: RoomCategory;
  src?: string;
}

function LampIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2v3" />
      <path d="M7 9h10l-2 7H9L7 9Z" />
      <path d="M9.5 16v2a2.5 2.5 0 0 0 5 0v-2" />
    </svg>
  );
}

function BedIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5" />
      <path d="M3 18v2M21 18v2" />
      <path d="M3 13V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function SofaIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
      <path d="M3 12h18v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z" />
      <path d="M4 18v2M20 18v2" />
    </svg>
  );
}

function MonitorIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

function WardrobeIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M12 3v18" />
      <path d="M9.5 12h.01M14.5 12h.01" />
    </svg>
  );
}

function BuildingIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" />
      <path d="M10 21v-4h4v4" />
    </svg>
  );
}

function ArrowUpRightIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function ChevronLeftIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function ChevronRightIcon({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

type IconComponent = (props: IconProps) => ReturnType<typeof LampIcon>;

const CATEGORY_ICONS: Record<RoomCategory, IconComponent> = {
  Oshxona: LampIcon,
  Yotoqxona: BedIcon,
  Mehmonxona: SofaIcon,
  Ofis: MonitorIcon,
  Garderob: WardrobeIcon,
  Tijorat: BuildingIcon,
};

const PROJECTS: Project[] = [
  { title: 'Oshxona loyihasi', category: 'Oshxona', src: kitchenImage },
  { title: 'Yotoqxona loyihasi', category: 'Yotoqxona', src: bedroomImage },
  { title: 'Mehmonxona loyihasi', category: 'Mehmonxona', src: livingRoomImage },
  { title: 'Ofis loyihasi', category: 'Ofis', src: officeImage },
];

const PAGE_SIZE = 4;

export function Portfolio() {
  const [page, setPage] = useState(0);
  const sectionRef = useSectionViewTracking<HTMLElement>('catalog_view');

  const pageCount = Math.max(1, Math.ceil(PROJECTS.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = PROJECTS.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden bg-charcoal py-16 text-warm-white md:py-24"
    >
      <img src={portfolioBgImage} alt="" className="absolute top-0 left-0 w-full" />
      <div className="absolute inset-0 bg-charcoal/45" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Portfolio</span>
          <h2 className="mt-4 text-[clamp(1.5rem,4.5vw,2.25rem)] font-heading font-bold text-warm-white">
            Ishlab chiqarilgan loyihalar
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-warm-white/60">
            Turli makonlar uchun zamonaviy, funksional va sifatli mebel yechimlari.
          </p>
        </div>

        {visible.length > 0 ? (
          <>
            <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
              {visible.map((project) => {
                const Icon = CATEGORY_ICONS[project.category];
                return (
                  <a
                    key={project.title}
                    href="/contract"
                    data-track="product_view"
                    data-product-name={project.title}
                    data-product-category={project.category}
                    className="group relative block overflow-hidden rounded-xl border-2 border-gold/40 transition-colors hover:border-gold/70"
                  >
                    <ImagePlaceholder
                      label={project.title}
                      src={project.src}
                      framed={false}
                      className="aspect-video w-full transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
                      <span className="flex items-center gap-1.5 rounded-full bg-charcoal/80 px-3 py-1.5 text-xs font-semibold text-warm-white backdrop-blur-sm">
                        <Icon className="h-3.5 w-3.5" />
                        {project.category}
                      </span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal/80 text-warm-white backdrop-blur-sm">
                        <ArrowUpRightIcon className="h-4 w-4" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

            {pageCount > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4 sm:mt-10">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  aria-label="Oldingi sahifa"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-white/25 text-warm-white/70 transition-colors hover:border-gold/60 hover:text-warm-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeftIcon />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: pageCount }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPage(i)}
                      aria-label={`${i + 1}-sahifa`}
                      className={`h-2 w-2 rounded-full transition-colors ${i === currentPage ? 'bg-gold' : 'bg-warm-white/25 hover:bg-gold/50'}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={currentPage === pageCount - 1}
                  aria-label="Keyingi sahifa"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-warm-white/25 text-warm-white/70 transition-colors hover:border-gold/60 hover:text-warm-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="mt-12 text-center text-sm text-warm-white/50">Hozircha bu turdagi loyihalar yo'q.</p>
        )}
      </div>
    </section>
  );
}
