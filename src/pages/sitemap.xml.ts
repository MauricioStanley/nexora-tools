import type { APIRoute } from 'astro';
import { absoluteUrl, alternatesFor, getAllRoutes, type RouteKey } from '@/lib/routing';
import { buildAlternates } from '@/lib/seo/meta';
import { getTool } from '@/tools/registry';

/**
 * XML sitemap with hreflang alternates (xhtml:link) for every indexable localized page.
 * Generated from the same route table as the pages, so it can never drift from reality.
 */
function lastModified(key: RouteKey): string | null {
  return key.kind === 'tool' ? getTool(key.toolId).dateModified : null;
}

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = () => {
  const routes = getAllRoutes().filter((r) => r.indexable);
  const urls = routes.map((route) => {
    const alternates = buildAlternates(alternatesFor(route.key), {
      xDefaultPath: route.key.kind === 'home' ? '/' : undefined,
    });
    const lastmod = lastModified(route.key);
    return [
      '  <url>',
      `    <loc>${escapeXml(absoluteUrl(route.path))}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
      ...alternates.map(
        (alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}"/>`,
      ),
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n');
  });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
