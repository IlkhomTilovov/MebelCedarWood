import { useEffect, useState } from 'react';
import { adminApi } from '@/admin/adminApi';

const PAGE_OPTIONS = [
  { value: '/', label: 'Bosh sahifa' },
  { value: '/contract', label: 'Shartnoma' },
  { value: '/apply', label: 'Ariza formasi' },
  { value: '/success', label: 'Muvaffaqiyat' },
];

const VIEWPORT_OPTIONS = [
  { value: 'mobile', label: 'Mobile', refWidth: 390 },
  { value: 'tablet', label: 'Tablet', refWidth: 900 },
  { value: 'desktop', label: 'Desktop', refWidth: 1440 },
] as const;

type ViewportKey = (typeof VIEWPORT_OPTIONS)[number]['value'];

const COORD_BUCKET_PX = 24;
const SITE_ORIGIN = 'https://mebel.com.uz';
const IFRAME_HEIGHT = 5000;
const PANEL_WIDTH = 760;

interface ClickPoint {
  viewport_bucket: string;
  x_bucket: number;
  y_bucket: number;
  click_count: number;
}

interface ScrollPoint {
  viewport_bucket: string;
  depth_bucket: number;
  visitor_count: number;
}

export function HeatmapPage() {
  const [page, setPage] = useState(PAGE_OPTIONS[0].value);
  const [viewport, setViewport] = useState<ViewportKey>('desktop');
  const [mode, setMode] = useState<'click' | 'scroll'>('click');
  const [clickPoints, setClickPoints] = useState<ClickPoint[]>([]);
  const [scrollPoints, setScrollPoints] = useState<ScrollPoint[]>([]);

  useEffect(() => {
    adminApi
      .get<ClickPoint[]>('/heatmap', { page, type: 'click' })
      .then(setClickPoints)
      .catch(() => setClickPoints([]));
    adminApi
      .get<ScrollPoint[]>('/heatmap', { page, type: 'scroll' })
      .then(setScrollPoints)
      .catch(() => setScrollPoints([]));
  }, [page]);

  const refWidth = VIEWPORT_OPTIONS.find((v) => v.value === viewport)!.refWidth;
  // Hech qachon kattalashtirilmaydi (mobil sahifa haqiqiy o'lchamidan katta ko'rinib
  // ketmasin) — faqat kerak bo'lsa kichraytiriladi.
  const scale = Math.min(1, PANEL_WIDTH / refWidth);
  const displayWidth = refWidth * scale;

  const visiblePoints = clickPoints.filter((p) => p.viewport_bucket === viewport);
  const maxClicks = Math.max(1, ...visiblePoints.map((p) => p.click_count));
  // Haqiqiy sahifa balandligi oldindan noma'lum — eng pastdagi nuqtadan picha pastroqqacha
  // ko'rsatamiz, shunda hozircha kam ma'lumot bo'lsa ham hamma nuqta ko'rinadi.
  const maxPointY = Math.max(0, ...visiblePoints.map((p) => p.y_bucket * COORD_BUCKET_PX));
  const contentHeight = Math.min(IFRAME_HEIGHT, Math.max(1600, maxPointY + 400));

  const scrollForViewport = scrollPoints.filter((p) => p.viewport_bucket === viewport);
  const scrollByDepth = new Map(scrollForViewport.map((p) => [p.depth_bucket, p.visitor_count]));
  const maxScrollVisitors = Math.max(1, ...[25, 50, 75, 90, 100].map((d) => scrollByDepth.get(d) ?? 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">Heatmap</h1>
          <p className="mt-1 text-xs text-charcoal/50">
            Taxminiy — "desktop" guruhidagi turli ekran kengliklari bir xil koordinata tizimiga tekislanadi, shuning
            uchun mobile uchun aniqroq, desktop uchun taxminiyroq natija beradi.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={page}
            onChange={(e) => setPage(e.target.value)}
            className="rounded-lg border border-light-gray px-3 py-2 text-sm"
          >
            {PAGE_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <div className="inline-flex rounded-lg border border-light-gray bg-warm-white p-1">
            {VIEWPORT_OPTIONS.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => setViewport(v.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  viewport === v.value ? 'bg-charcoal text-warm-white' : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="inline-flex rounded-lg border border-light-gray bg-warm-white p-1">
            {(['click', 'scroll'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  mode === m ? 'bg-charcoal text-warm-white' : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                {m === 'click' ? '🔥 Click' : '📜 Scroll'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === 'click' && (
        <div className="overflow-hidden rounded-xl border border-light-gray bg-warm-white">
          {visiblePoints.length === 0 ? (
            <p className="p-8 text-center text-sm text-charcoal/40">
              Bu sahifa/qurilma uchun hali click ma'lumoti yo'q.
            </p>
          ) : (
            <div
              className="bg-light-gray/20"
              style={{ width: displayWidth, height: Math.min(800, contentHeight * scale), overflowY: 'auto', overflowX: 'hidden' }}
            >
              {/* Haqiqiy (transformsiz) balandlikdagi spacer — scroll balandligi shundan hisoblanadi,
                  transform:scale'ga bog'liq brauzerlararo farqlardan qochish uchun. */}
              <div className="relative" style={{ width: displayWidth, height: contentHeight * scale }}>
                <div
                  className="absolute top-0 left-0"
                  style={{ width: refWidth, height: contentHeight, transform: `scale(${scale})`, transformOrigin: 'top left' }}
                >
                  <iframe
                    title="heatmap-preview"
                    src={`${SITE_ORIGIN}${page}`}
                    width={refWidth}
                    height={contentHeight}
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0">
                    {visiblePoints.map((p, i) => {
                      const intensity = p.click_count / maxClicks;
                      const size = 16 + intensity * 28;
                      return (
                        <div
                          key={i}
                          className="absolute rounded-full"
                          style={{
                            left: p.x_bucket * COORD_BUCKET_PX - size / 2,
                            top: p.y_bucket * COORD_BUCKET_PX - size / 2,
                            width: size,
                            height: size,
                            background: `rgba(220, 38, 38, ${0.15 + intensity * 0.55})`,
                            boxShadow: `0 0 ${size}px rgba(220,38,38,${intensity * 0.4})`,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'scroll' && (
        <div className="rounded-xl border border-light-gray bg-warm-white p-6">
          {scrollForViewport.length === 0 ? (
            <p className="text-sm text-charcoal/40">Bu sahifa/qurilma uchun hali scroll ma'lumoti yo'q.</p>
          ) : (
            <div className="space-y-3">
              {[25, 50, 75, 90, 100].map((depth) => {
                const visitors = scrollByDepth.get(depth) ?? 0;
                const pct = Math.round((visitors / maxScrollVisitors) * 100);
                return (
                  <div key={depth}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-charcoal">{depth}% gacha o'qidi</span>
                      <span className="text-charcoal/60">{visitors} ta visitor</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-light-gray">
                      <div className="h-full rounded-full bg-gold" style={{ width: `${Math.max(2, pct)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
