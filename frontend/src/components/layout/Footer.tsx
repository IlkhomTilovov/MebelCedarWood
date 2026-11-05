import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Telegram', href: 'https://t.me' },
];

export function Footer() {
  return (
    <footer className="border-t border-warm-white/10 bg-charcoal text-warm-white/60">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="font-heading text-lg font-bold tracking-[0.15em] text-warm-white">
              CEDAR<span className="text-gold"> WOOD</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Premium oshxona mebeli ishlab chiqarish. Individual loyihalash, sifatli materiallar
              va shartnoma asosidagi muddat kafolati bilan ishlaymiz.
            </p>
            <div className="mt-6 flex gap-5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold tracking-widest text-warm-white/50 uppercase transition-colors hover:text-gold"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-widest text-warm-white uppercase">Aloqa</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="tel:+998900000000" className="transition-colors hover:text-warm-white">
                  +998 90 000 00 00
                </a>
              </li>
              <li>
                <a href="mailto:info@mebel.com.uz" className="transition-colors hover:text-warm-white">
                  info@mebel.com.uz
                </a>
              </li>
              <li>Toshkent sh.</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-warm-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} CEDAR WOOD. Barcha huquqlar himoyalangan.</span>
          <Link to="/contract" className="transition-colors hover:text-warm-white">
            Shartnoma shartlari
          </Link>
        </div>
      </div>
    </footer>
  );
}
