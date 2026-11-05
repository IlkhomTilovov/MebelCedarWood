import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-4 transition-all duration-300 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:px-0 sm:pb-0 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <Link
        to="/contract"
        tabIndex={visible ? 0 : -1}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-8 py-4 text-sm font-semibold tracking-wide text-charcoal uppercase shadow-2xl shadow-charcoal/40 transition-colors hover:bg-[#a68a56] sm:w-auto sm:rounded-full"
      >
        Shartnomani ko'rib chiqish
        <ArrowRightIcon />
      </Link>
    </div>
  );
}
