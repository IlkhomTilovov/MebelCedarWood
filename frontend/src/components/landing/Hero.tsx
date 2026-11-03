import { Link } from 'react-router-dom';
import heroImage from '@/assets/images/hero/hero-kitchen-2.png';
import heroImageMobile from '@/assets/images/hero/hero-kitchen-mobile-1.png';

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 shrink-0 text-gold">
      <path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 shrink-0 text-gold">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 shrink-0 text-gold">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1M18.5 18.5l-2.1-2.1M7.6 7.6 5.5 5.5" />
    </svg>
  );
}

const TRUST_ITEMS = [
  { icon: ShieldIcon, lines: ['Shartnoma', 'asosida'] },
  { icon: LayersIcon, lines: ['Individual', 'loyihalash'] },
  { icon: GearIcon, lines: ['Sifatli', 'ishlab chiqarish'] },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-charcoal text-warm-white lg:flex lg:min-h-[60vh] lg:items-center">
      <div className="absolute inset-0 h-full w-full">
        <img src={heroImageMobile} alt="Premium interyer" className="block h-full w-full object-cover sm:hidden" />
        <img src={heroImage} alt="Premium interyer" className="hidden h-full w-full object-cover sm:block" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/20" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start px-6 py-20 sm:py-28 md:py-36 lg:w-full lg:py-16">
        <span className="mb-5 border border-gold/50 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-gold uppercase sm:mb-6">
          Muddat kafolati
        </span>
        <h1 className="max-w-3xl text-[clamp(2rem,6.5vw,3.75rem)] font-heading leading-[1.1] font-extrabold">
          1 kun kechiksak — shartnoma summasining 15% ini qaytaramiz.
        </h1>
        <p className="mt-5 max-w-xl text-sm text-warm-white/70 sm:mt-6 sm:text-base md:text-lg">
          Har keyingi kechikkan kun uchun yana +1% qo'shiladi.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 sm:mt-10 sm:gap-x-10 sm:gap-y-6">
          {TRUST_ITEMS.map(({ icon: Icon, lines }) => (
            <div key={lines.join(' ')} className="flex items-center gap-3">
              <Icon />
              <span className="text-xs leading-snug font-semibold tracking-wider text-warm-white/85 uppercase">
                {lines[0]}
                <br />
                {lines[1]}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex w-full flex-col gap-3 border-t border-warm-white/15 pt-8 sm:mt-12 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            to="/contract"
            className="inline-flex items-center justify-center rounded-lg bg-gold px-8 py-4 text-sm font-semibold tracking-wide text-charcoal uppercase transition-colors hover:bg-[#a68a56]"
          >
            Loyihani boshlash
          </Link>
        </div>
      </div>
    </section>
  );
}
