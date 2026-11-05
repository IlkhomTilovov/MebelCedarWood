import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface SearchableSelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SearchableSelectProps {
  label: string;
  icon?: ReactNode;
  requiredMark?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  modalTitle?: string;
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  name?: string;
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function SearchableSelect({
  label,
  icon,
  requiredMark,
  placeholder,
  searchPlaceholder,
  modalTitle,
  options,
  value,
  onChange,
  error,
  name,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  function closeModal() {
    setOpen(false);
    setQuery('');
  }

  useLayoutEffect(() => {
    if (!open) return;
    if (listRef.current) listRef.current.scrollTop = 0;
    searchInputRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') closeModal();
    }
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const filtered = options.filter((opt) => opt.label.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-sm font-medium text-charcoal/80">
        {icon && <span className="text-gold">{icon}</span>}
        {label}
        {requiredMark && <span className="text-gold">*</span>}
      </span>
      <button
        type="button"
        name={name}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className={`flex w-full items-center gap-2.5 rounded-lg border bg-warm-white px-4 py-3 text-left text-base outline-none transition-colors ${
          error ? 'border-red-400' : 'border-light-gray'
        }`}
      >
        {icon && <span className="shrink-0 text-charcoal/30">{icon}</span>}
        <span className={`flex-1 truncate ${selected ? 'text-charcoal' : 'text-charcoal/40'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="shrink-0 text-charcoal/40">
          <ChevronDownIcon />
        </span>
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <button
              type="button"
              aria-label="Yopish"
              onClick={closeModal}
              className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px]"
            />
            <div className="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-md sm:rounded-2xl">
              <div className="flex items-center justify-between border-b border-light-gray/60 px-4 py-3.5">
                <h3 className="font-heading text-base font-bold text-charcoal">{modalTitle ?? label}</h3>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Yopish"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal/50 transition-colors hover:bg-warm-white hover:text-charcoal"
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="relative border-b border-light-gray/60 p-3">
                <span className="pointer-events-none absolute top-1/2 left-6 -translate-y-1/2 text-charcoal/30">
                  <SearchIcon />
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-lg bg-warm-white py-2 pr-3 pl-9 text-sm text-charcoal outline-none"
                />
              </div>
              <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain">
                {filtered.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-charcoal/40">Natija topilmadi</p>
                )}
                {filtered.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        closeModal();
                      }}
                      className={`flex w-full items-center gap-3 border-b border-light-gray/30 px-4 py-3.5 text-left text-[15px] text-charcoal transition-colors last:border-b-0 hover:bg-warm-white ${
                        isSelected ? 'bg-gold/15 font-semibold' : ''
                      }`}
                    >
                      {opt.icon && <span className="shrink-0 text-gold/80">{opt.icon}</span>}
                      <span className="flex-1 truncate">{opt.label}</span>
                      {isSelected && <span className="shrink-0 text-gold">{<CheckIcon />}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
