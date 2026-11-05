import { useEffect } from 'react';

export const SITE_URL = 'https://mebel.com.uz';
export const SITE_NAME = 'CEDAR WOOD';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

function setMetaByName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaByProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSeo({ title, description, path, noindex }: SeoOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;
    setMetaByName('description', description);
    setMetaByName('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    setMetaByProperty('og:title', fullTitle);
    setMetaByProperty('og:description', description);
    setMetaByProperty('og:type', 'website');
    setMetaByProperty('og:url', url);
    setMetaByProperty('og:image', DEFAULT_OG_IMAGE);
    setMetaByProperty('og:site_name', SITE_NAME);
    setMetaByProperty('og:locale', 'uz_UZ');

    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', fullTitle);
    setMetaByName('twitter:description', description);
    setMetaByName('twitter:image', DEFAULT_OG_IMAGE);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, path, noindex]);
}
