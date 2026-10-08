import type { APIRoute } from 'astro';
import { brand } from '@/config/brand';
import { DEFAULT_LOCALE } from '@/config/site';
import { getDictionary, fmt } from '@/i18n';

export const GET: APIRoute = () => {
  const t = getDictionary(DEFAULT_LOCALE);
  const manifest = {
    name: brand.productName,
    short_name: brand.productShortName,
    description: fmt(t.meta.homeDescription),
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: brand.themeColor.dark,
    theme_color: brand.themeColor.dark,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
