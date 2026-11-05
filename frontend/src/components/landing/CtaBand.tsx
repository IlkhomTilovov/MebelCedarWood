import { Link } from 'react-router-dom';
import ctaImage from '@/assets/images/cta/cta-armchair-1.webp';

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 shrink-0 text-gold">
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 15.5h6M9 8.5h3" />
    </svg>
  );
}

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-6 rounded-xl bg-charcoal p-6 text-warm-white sm:p-10">
          <div>
            <DocumentIcon />
            <h3 className="mt-5 font-heading text-xl font-bold sm:text-2xl">Shartnoma bilan ishlash</h3>
            <p className="mt-3 text-sm leading-relaxed text-warm-white/70">
              Har bir buyurtma rasmiy shartnoma asosida amalga oshiriladi. Shartlar, muddatlar va kafolatlar
              aniq belgilangan.
            </p>
          </div>
          <Link
            to="/contract"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3.5 text-xs font-semibold tracking-wide text-charcoal uppercase transition-colors hover:bg-[#a68a56] sm:w-auto"
          >
            Shartnomani ko'rib chiqish
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-xl bg-[#3c2d18] p-6 text-warm-white sm:p-10">
          <img src={ctaImage} alt="" className="absolute inset-0 h-full w-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3c2d18] via-[#3c2d18]/70 to-transparent" />
          <div className="relative">
            <h3 className="font-heading text-xl font-bold sm:text-2xl">
              Orzuingizdagi mebelni birgalikda yaratamiz.
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-warm-white/90">
              Loyihangiz haqida ma'lumot qoldiring. Mutaxassislarimiz siz bilan bog'lanadi.
            </p>
          </div>
          <Link
            to="/contract"
            className="relative inline-flex w-full items-center justify-center gap-2 rounded-lg bg-warm-white px-6 py-3.5 text-xs font-semibold tracking-wide text-charcoal uppercase transition-colors hover:bg-warm-white/90 sm:w-auto"
          >
            Buyurtma berish
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
