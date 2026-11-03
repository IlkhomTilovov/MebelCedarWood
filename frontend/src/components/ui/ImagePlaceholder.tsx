interface ImagePlaceholderProps {
  label?: string;
  caption?: string;
  className?: string;
  dark?: boolean;
  src?: string;
  framed?: boolean;
}

// Real photography drop-in point: pass `src` once a photo exists under
// src/assets/images/** (see README there). Until then this renders a
// premium architectural-texture swatch instead of an empty box, so the
// layout reads as intentional art direction rather than a missing asset.
export function ImagePlaceholder({
  label,
  caption,
  className = '',
  dark = false,
  src,
  framed = true,
}: ImagePlaceholderProps) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${framed ? 'rounded-xl' : ''} ${className}`}>
        <img src={src} alt={label ?? ''} className="h-full w-full object-cover" />
        {caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-5">
            <span className="text-xs font-medium tracking-wide text-warm-white/90 uppercase">{caption}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${
        framed ? 'rounded-xl border border-gold/20' : ''
      } ${className}`}
    >
      <div
        className={`absolute inset-0 ${
          dark
            ? 'bg-[radial-gradient(ellipse_at_30%_20%,rgba(182,154,101,0.16),transparent_55%),linear-gradient(135deg,#1b1b1a,#252522_55%,#1b1b1a)]'
            : 'bg-[radial-gradient(ellipse_at_70%_15%,rgba(182,154,101,0.22),transparent_55%),linear-gradient(135deg,#252522,#1b1b1a_60%,#2a2824)]'
        }`}
      />
      <div className="absolute inset-0 bg-grid-gold opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.45))]" />
      {(label || caption) && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5">
          <span className="text-xs font-medium tracking-[0.15em] text-warm-white/80 uppercase">
            {caption ?? label}
          </span>
          <span className="h-px flex-1 max-w-10 bg-gold/50" />
        </div>
      )}
    </div>
  );
}
