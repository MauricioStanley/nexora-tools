import type { APIRoute } from 'astro';
import { absoluteUrl } from '@/lib/routing';

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    // Machine-readable index and vendored engine assets carry no search value.
    'Disallow: /search-index/',
    'Disallow: /vendor/',
    '',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
