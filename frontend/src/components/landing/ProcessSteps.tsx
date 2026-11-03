import stepArizaImage from '@/assets/images/process/step-ariza-1.png';
import stepIshlabChiqarishImage from '@/assets/images/process/step-ishlab-chiqarish-1.png';
import stepLoyihalashImage from '@/assets/images/process/step-loyihalash-1.png';
import stepOlchovImage from '@/assets/images/process/step-olchov-1.png';
import stepOrnatishImage from '@/assets/images/process/step-ornatish-1.png';

interface IconProps {
  className?: string;
}

function DocumentIcon({ className = 'h-9 w-9' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 2h8l4 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
      <path d="M14 2v4h4" />
      <path d="M8 12h5M8 15.5h8M8 9h3" />
    </svg>
  );
}

function RulerIcon({ className = 'h-9 w-9' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2.5" y="9" width="19" height="6" rx="1" />
      <path d="M6 9v2M9.5 9v3M13 9v2M16.5 9v3" />
    </svg>
  );
}

function LaptopIcon({ className = 'h-9 w-9' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="11" rx="1" />
      <path d="M2 19h20l-2-4H4l-2 4Z" />
    </svg>
  );
}

function GearIcon({ className = 'h-9 w-9' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1M18.5 18.5l-2.1-2.1M7.6 7.6 5.5 5.5" />
    </svg>
  );
}

function TruckIcon({ className = 'h-9 w-9' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 7h11v9H2z" />
      <path d="M13 10h4l3 3v3h-7z" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="16.5" cy="18" r="1.6" />
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

const steps = [
  { title: 'Ariza', description: "Shartnoma bilan tanishib, ariza formasini to'ldirasiz.", icon: DocumentIcon, image: stepArizaImage },
  { title: "O'lchov", description: 'Mutaxassisimiz joyga borib aniq o‘lchov oladi.', icon: RulerIcon, image: stepOlchovImage },
  { title: 'Loyihalash', description: "Individual dizayn va narx taklifi tayyorlanadi.", icon: LaptopIcon, image: stepLoyihalashImage },
  { title: 'Ishlab chiqarish', description: 'Shartnomada belgilangan muddatda tayyorlanadi.', icon: GearIcon, image: stepIshlabChiqarishImage },
  { title: "O'rnatish", description: "Oshxona joyida yig'ib, topshirib beriladi.", icon: TruckIcon, image: stepOrnatishImage },
];

export function ProcessSteps() {
  return (
    <section id="process" className="bg-warm-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-gold/40 sm:w-10" />
            <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Jarayon</span>
            <span className="h-px w-8 bg-gold/40 sm:w-10" />
          </div>
          <h2 className="mt-4 text-[clamp(1.75rem,5vw,2.75rem)] font-heading font-bold text-charcoal">
            Buyurtma <span className="text-gold">jarayoni</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-charcoal/60">
            Sizning g'oyangizdan tayyor mebelgacha — 5 ta sodda qadamda.
          </p>
        </div>

        <div className="relative mt-14 grid gap-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 md:grid-cols-5 md:gap-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="relative flex flex-col items-center rounded-2xl border border-gold/30 bg-warm-white px-5 pt-8 pb-6 text-center transition-colors hover:border-gold/60">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-gold/50 bg-warm-white px-3 py-1 font-heading text-xs font-bold text-gold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step.image ? (
                  <img src={step.image} alt="" className="h-11 w-16 object-contain" />
                ) : (
                  <step.icon className="h-9 w-9 text-gold" />
                )}
                <h3 className="mt-3 font-heading text-base font-semibold text-charcoal">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-charcoal/60">{step.description}</p>
              </div>
              {index !== steps.length - 1 && (
                <span className="absolute top-1/2 -right-5 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-warm-white text-gold md:flex">
                  <ChevronRightIcon />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
