import guaranteeImage from '@/assets/images/guarantee/guarantee-cabinetry-1.webp';

const points = [
  { value: '1 KUN', label: 'Kechiksak' },
  { value: '15%', label: 'Shartnoma summasidan qaytariladi' },
  { value: '+1%', label: 'Har keyingi kechikkan kun uchun' },
];

export function Guarantee() {
  return (
    <section className="relative overflow-hidden bg-graphite py-16 text-warm-white md:py-24">
      <img src={guaranteeImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-graphite/65" />
      <div className="absolute inset-0 bg-grid-gold opacity-[0.08]" />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
          Bizning asosiy kafolatimiz
        </span>
        <h2 className="mx-auto mt-4 max-w-3xl text-[clamp(1.5rem,4.5vw,2.25rem)] font-heading font-bold">
          Muddatga aniq rioya qilamiz — aks holda kompensatsiya to'laymiz.
        </h2>
        <div className="mt-10 grid gap-8 divide-y divide-gold/15 sm:mt-16 sm:gap-10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {points.map((point) => (
            <div key={point.label} className="pt-8 first:pt-0 md:px-8 md:pt-0 md:first:pl-0">
              <div className="font-heading text-4xl font-extrabold tracking-tight text-gold sm:text-5xl">{point.value}</div>
              <div className="mt-3 text-sm tracking-wide text-warm-white/70 uppercase">{point.label}</div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-sm text-warm-white/50 sm:mt-14">
          Buyurtmangizni shartnomada belgilangan muddatda topshirish — bizning mas'uliyatimiz.
          Belgilangan muddatga rioya qilmasak, shartnoma shartlariga muvofiq pulingizning bir
          qismini qaytaramiz.
        </p>
      </div>
    </section>
  );
}
