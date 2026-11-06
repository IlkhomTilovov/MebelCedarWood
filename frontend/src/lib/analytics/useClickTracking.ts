import { useEffect } from 'react';
import { trackEvent } from './track';

function classifyByHref(href: string): string | null {
  if (href.startsWith('tel:')) return 'phone_click';
  if (/(^https?:\/\/)?(www\.)?t\.me\//.test(href) || href.startsWith('https://telegram.me/')) return 'telegram_click';
  if (/wa\.me\//.test(href) || /api\.whatsapp\.com/.test(href)) return 'whatsapp_click';
  return null;
}

export function useClickTracking() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>('[data-track], a, button');
      if (!el) return;

      const dataTrack = el.getAttribute('data-track');
      const href = el instanceof HTMLAnchorElement ? el.getAttribute('href') ?? '' : '';
      const elementText = (el.textContent ?? '').trim().slice(0, 120);
      const rect = el.getBoundingClientRect();
      const basePayload = {
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2 + window.scrollY),
        viewportWidth: window.innerWidth,
      };

      if (dataTrack === 'product_view') {
        trackEvent('product_view', {
          ...basePayload,
          productName: el.getAttribute('data-product-name') ?? elementText,
          category: el.getAttribute('data-product-category') ?? null,
        });
        return;
      }

      const hrefType = href ? classifyByHref(href) : null;
      if (hrefType) {
        trackEvent(hrefType, { ...basePayload, elementId: dataTrack ?? el.id ?? null, elementText });
        return;
      }

      trackEvent(dataTrack ? 'cta_click' : 'button_click', {
        ...basePayload,
        elementId: dataTrack ?? el.id ?? null,
        elementType: el.tagName.toLowerCase(),
        elementText,
      });
    }

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);
}
