import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import workshopImage from '@/assets/images/about/workshop-cnc-1.webp';

const points = [
  "Individual o'lchov va loyihalash",
  "Material tanlovi va sifat nazorati",
  "Ishlab chiqarish va o'rnatish",
];

export function About() {
  return (
    <section id="company" className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:gap-12 md:grid-cols-2 md:items-center md:py-24">
      <ImagePlaceholder
        label="Ishlab chiqarish ustaxonasi"
        caption="Ishlab chiqarish ustaxonasi"
        src={workshopImage}
        className="aspect-[16/9] w-full"
      />
      <div>
        <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Kompaniya haqida</span>
        <h2 className="mt-4 font-heading text-3xl font-bold text-charcoal md:text-4xl">
          Har bir detalda sifat. Har bir loyihada individuallik.
        </h2>
        <p className="mt-6 leading-relaxed text-charcoal/70">
          CEDAR WOOD har bir buyurtmani individual loyihalash, sifatli material va aniq muddat
          asosida bajaradi. Biz uchun eng muhim narsa — mijozga berilgan va'daga amal qilish,
          shuning uchun har bir buyurtma shartnoma bilan rasmiylashtiriladi va kechikish holatida
          moliyaviy kafolat beriladi.
        </p>
        <ul className="mt-8 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-charcoal/70">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
