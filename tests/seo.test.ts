import { describe, expect, it } from 'vitest';
import { brand } from '@/config/brand';
import { absoluteUrl } from '@/lib/routing';
import { buildAlternates, buildPageSeo, buildTitle } from '@/lib/seo/meta';
import { breadcrumbSchema, faqSchema, serializeJsonLd, toolSchema } from '@/lib/seo/schema';
import { getTool, listedTools } from '@/tools/registry';

describe('SEO metadata', () => {
  it('appends the brand to page titles exactly once', () => {
    expect(buildTitle('Merge PDF Files Online', 'en')).toBe(`Merge PDF Files Online | ${brand.productName}`);
    expect(buildTitle(`About ${brand.productName}`, 'en')).toBe(`About ${brand.productName}`);
  });

  it('includes every locale plus x-default in hreflang alternates', () => {
    const links = buildAlternates({ en: '/en/x/', es: '/es/x/' });
    expect(links.map((l) => l.hreflang)).toEqual(['en', 'es', 'x-default']);
    expect(links.at(-1)?.href).toBe(absoluteUrl('/en/x/'));
    expect(buildAlternates({ en: '/en/', es: '/es/' }, { xDefaultPath: '/' }).at(-1)?.href).toBe(absoluteUrl('/'));
  });

  it('builds canonical and OG data', () => {
    const seo = buildPageSeo({ locale: 'es', title: 'Unir PDF', description: 'desc', path: '/es/herramientas/pdf/unir-pdf/', alternates: null });
    expect(seo.canonical).toBe(absoluteUrl('/es/herramientas/pdf/unir-pdf/'));
    expect(seo.ogImage).toBe(absoluteUrl(brand.assets.ogImage.es));
    expect(seo.noindex).toBe(false);
  });

  it('has unique SEO titles and descriptions across all tools and locales', () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const tool of listedTools) {
      for (const content of Object.values(tool.content)) {
        expect(titles.has(content.seo.title), content.seo.title).toBe(false);
        expect(descriptions.has(content.seo.description)).toBe(false);
        titles.add(content.seo.title);
        descriptions.add(content.seo.description);
      }
    }
  });
});

describe('structured data', () => {
  it('describes tools as free WebApplications', () => {
    const tool = getTool('merge-pdf');
    const schema = toolSchema(tool, tool.content.en, 'en', '/en/tools/pdf/merge-pdf/');
    expect(schema['@type']).toBe('WebApplication');
    expect(schema.isAccessibleForFree).toBe(true);
    expect((schema.offers as { price: string }).price).toBe('0');
    expect(schema).not.toHaveProperty('aggregateRating');
  });

  it('mirrors visible FAQ content', () => {
    const tool = getTool('split-pdf');
    const schema = faqSchema(tool.content.es.faq);
    expect((schema?.mainEntity as unknown[]).length).toBe(tool.content.es.faq.length);
  });

  it('builds breadcrumbs with absolute URLs', () => {
    const schema = breadcrumbSchema([
      { name: 'Home', path: '/en/' },
      { name: 'Tools', path: '/en/tools/' },
    ]);
    const items = schema.itemListElement as { position: number; item: string }[];
    expect(items[1]).toMatchObject({ position: 2, item: absoluteUrl('/en/tools/') });
  });

  it('serializes JSON-LD without breaking out of the script element', () => {
    const out = serializeJsonLd({ name: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</script>');
    expect(JSON.parse(out).name).toBe('</script><script>alert(1)</script>');
  });
});
