import { enqueueEvent } from './client';

export type AnalyticsEventType =
  | 'page_view'
  | 'session_start'
  | 'session_end'
  | 'button_click'
  | 'product_view'
  | 'catalog_view'
  | 'scroll_25'
  | 'scroll_50'
  | 'scroll_75'
  | 'scroll_90'
  | 'scroll_100'
  | 'form_start'
  | 'form_step_view'
  | 'form_step_complete'
  | 'form_step_back'
  | 'form_abandon'
  | 'form_submit'
  | 'order_created'
  | 'phone_click'
  | 'telegram_click'
  | 'whatsapp_click'
  | 'cta_click'
  | 'file_upload'
  | 'search'
  | 'filter_used'
  | string;

export function trackEvent(type: AnalyticsEventType, payload: Record<string, unknown> = {}) {
  enqueueEvent({
    type,
    occurredAt: new Date().toISOString(),
    pagePath: window.location.pathname,
    payload,
  });
}

export function trackPageView() {
  enqueueEvent({
    type: 'page_view',
    occurredAt: new Date().toISOString(),
    pagePath: window.location.pathname,
    pageUrl: window.location.href,
    pageTitle: document.title,
    payload: { referrer: document.referrer || null },
  });
}
