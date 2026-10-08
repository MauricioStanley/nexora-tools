/**
 * JSON-LD builders. Only schema types that genuinely describe visible page content are used.
 * See SEO_STRATEGY.md for the rationale behind each type.
 */
import { brand } from '@/config/brand';
import { LOCALE_META, type Locale } from '@/config/site';
import { fmt } from '@/i18n/format';
import { absoluteUrl } from '@/lib/routing';
import type { Tool, ToolContent } from '@/tools/types';

type JsonLd = Record<string, unknown>;

const ORG_ID = `${brand.companyUrl}/#organization`;
const WEBSITE_ID = `${brand.productUrl}/#website`;

export function organizationSchema(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: brand.companyName,
    url: brand.companyUrl,
  };
}

export function websiteSchema(locale: Locale, description: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema(),
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: brand.productName,
        alternateName: brand.relationship,
        url: absoluteUrl(`/${locale}/`),
        description: fmt(description),
        inLanguage: LOCALE_META[locale].htmlLang,
        publisher: { '@id': ORG_ID },
      },
    ],
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * A tool page describes a free web application. `WebApplication` is the accurate type;
 * `offers.price = 0` reflects that it is free. No ratings are emitted (we have none).
 */
export function toolSchema(tool: Tool, content: ToolContent, locale: Locale, path: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: content.name,
    description: content.description,
    url: absoluteUrl(path),
    applicationCategory: tool.schema.applicationCategory,
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
    inLanguage: LOCALE_META[locale].htmlLang,
    isAccessibleForFree: true,
    dateModified: tool.dateModified,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: organizationSchema(),
    isPartOf: { '@type': 'WebSite', '@id': WEBSITE_ID, name: brand.productName },
  };
}

/**
 * FAQPage markup mirrors the FAQ that is visibly rendered on the page. Google limits FAQ
 * rich results to certain sites, but the markup remains valid and accurate.
 */
export function faqSchema(faq: ToolContent['faq']): JsonLd | null {
  if (faq.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function collectionSchema(input: {
  name: string;
  description: string;
  path: string;
  locale: Locale;
  items: { name: string; path: string }[];
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.name,
    description: fmt(input.description),
    url: absoluteUrl(input.path),
    inLanguage: LOCALE_META[input.locale].htmlLang,
    isPartOf: { '@type': 'WebSite', '@id': WEBSITE_ID, name: brand.productName },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: input.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

/**
 * Serialize JSON-LD safely for embedding in a <script> element: escaping `<`, `>` and `&`
 * makes a "</script>" sequence inside any string value impossible.
 */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}
