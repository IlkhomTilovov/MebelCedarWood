import blueprintSketchImage from '@/assets/images/whyus/blueprint-sketch-1.png';
import calendarDeskImage from '@/assets/images/whyus/calendar-desk-1.png';
import materialSamplesImage from '@/assets/images/whyus/material-samples-1.png';
import contractDeskImage from '@/assets/images/whyus/contract-desk-1.png';

function HandshakeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-gold">
      <path d="M2.5 11.5 6 8l3 3-3.2 3.2a1.6 1.6 0 0 1-2.3-2.2Z" />
      <path d="M21.5 11.5 18 8l-3 3 3.2 3.2a1.6 1.6 0 0 0 2.3-2.2Z" />
      <path d="M9 11l2 2a1.4 1.4 0 0 0 2 0l2-2" />
      <path d="M6 8l2.3-1.9a2 2 0 0 1 2.5 0L12 7" />
      <path d="M18 8l-2.3-1.9a2 2 0 0 0-2.5 0L12 7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-gold">
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M16 3v4M8 3v4M3.5 10h17" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-gold">
      <path d="M4 20 20 20 4 4Z" />
      <path d="M4 16.3h3.7M4 12.6h3.7M7.7 20v-3.7" />
    </svg>
  );
}

function GemIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-gold">
      <path d="M6 9h12M9 9l3 11.5L15 9M6 9l2.5-5h7L18 9" />
      <path d="M6 9l6 11.5L18 9" />
    </svg>
  );
}

const reasons = [
  {
    icon: HandshakeIcon,
    title: 'Shartnoma asosida ishlash',
    description: "Har bir buyurtma rasmiy shartnoma bilan tasdiqlanadi, barcha shartlar yozma ko'rinishda.",
    image: contractDeskImage,
  },
  {
    icon: CalendarIcon,
    title: 'Muddat kafolati',
    description: 'Kechikish holatida moliyaviy kompensatsiya shartnomada aniq belgilangan.',
    image: calendarDeskImage,
  },
  {
    icon: RulerIcon,
    title: 'Individual loyihalash',
    description: "Har bir oshxona mijozning o'lchami va didiga mos ravishda ishlab chiqiladi.",
    image: blueprintSketchImage,
  },
  {
    icon: GemIcon,
    title: 'Sifatli material',
    description: "Ishlab chiqarishda faqat tekshirilgan, sifatli materiallardan foydalaniladi.",
    image: materialSamplesImage,
  },
];

export function WhyUs() {
  return (
    <section id="advantages" className="bg-warm-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-gold/40 sm:w-10" />
            <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Afzalliklar</span>
            <span className="h-px w-8 bg-gold/40 sm:w-10" />
          </div>
          <h2 className="mt-4 text-[clamp(1.75rem,5vw,2.75rem)] font-heading font-bold text-charcoal">
            Nima uchun <span className="text-gold">CEDAR WOOD</span>?
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, image }) => (
            <div
              key={title}
              className="group relative flex aspect-[8/7] flex-col overflow-hidden rounded-2xl border border-gold/15 transition-colors hover:border-gold/40"
            >
              <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-charcoal/35" />
              <div className="relative flex h-full flex-col justify-between p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-warm-white/10 bg-warm-white/10 backdrop-blur-sm">
                  <Icon />
                </div>
                <h3 className="line-clamp-2 font-heading text-lg font-semibold text-warm-white">{title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
