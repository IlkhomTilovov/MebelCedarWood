import { Link, Navigate } from 'react-router-dom';
import { useApplicationStore } from '@/store/useApplicationStore';

export function SuccessPage() {
  const submittedApplication = useApplicationStore((s) => s.submittedApplication);

  if (!submittedApplication) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-[70vh] items-center bg-light-gray/20 py-16">
      <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold text-2xl text-gold">
          ✓
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold text-charcoal">
          Arizangiz muvaffaqiyatli yuborildi!
        </h1>
        <p className="mt-4 text-charcoal/60">CEDAR WOOD mutaxassislari siz bilan bog'lanishadi.</p>
        <div className="mt-8 inline-block max-w-full border border-light-gray bg-warm-white px-6 py-4 sm:px-8">
          <span className="block text-xs tracking-widest text-charcoal/40 uppercase">Ariza raqami</span>
          <span className="font-heading text-xl font-bold break-words text-charcoal">
            {submittedApplication.applicationNumber}
          </span>
        </div>
        <div className="mt-10">
          <Link to="/" className="text-sm font-semibold text-gold underline-offset-4 hover:underline">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
