/**
 * Route table — every localized URL in the product is produced here.
 *
 * Components never build URLs by string concatenation; they call `pathFor(key, locale)`.
 * That guarantees canonical URLs, hreflang alternates, the sitemap and internal links
 * always agree, and that localized slugs are applied consistently.
 */
import { LOCALES, SITE_URL, type Locale } from '@/config/site';
import { getCategories, getCategory } from '@/data/categories';
import { getTool, listedTools } from '@/tools/registry';

export type StaticPageId = 'about' | 'privacy' | 'terms' | 'contact';
export const STATIC_PAGES: readonly StaticPageId[] = ['about', 'privacy', 'terms', 'contact'];

/** Localized first-level path segments. */
export const SEGMENTS = {
  en: {
    tools: 'tools',
    categories: 'categories',
    about: 'about',
    privacy: 'privacy',
    terms: 'terms',
    contact: 'contact',
  },
  es: {
    tools: 'herramientas',
    categories: 'categorias',
    about: 'acerca-de',
    privacy: 'privacidad',
    terms: 'terminos',
    contact: 'contacto',
  },
} as const satisfies Record<Locale, Record<'tools' | 'categories' | StaticPageId, string>>;

export type RouteKey =
  | { kind: 'home' }
  | { kind: 'tools' }
  | { kind: 'category'; categoryId: string }
  | { kind: 'tool'; toolId: string }
  | { kind: 'page'; pageId: StaticPageId }
  | { kind: 'not-found' };

export interface PageRoute {
  key: RouteKey;
  locale: Locale;
  /** Root-relative path with leading and trailing slash. */
  path: string;
  /** Whether the page belongs in the sitemap and may be indexed. */
  indexable: boolean;
}

/** Root-relative, trailing-slash path for a route in a locale. */
export function pathFor(key: RouteKey, locale: Locale): string {
  const s = SEGMENTS[locale];
  switch (key.kind) {
    case 'home':
      return `/${locale}/`;
    case 'tools':
      return `/${locale}/${s.tools}/`;
    case 'category':
      return `/${locale}/${s.categories}/${getCategory(key.categoryId).content[locale].slug}/`;
    case 'tool': {
      const tool = getTool(key.toolId);
      const categorySlug = getCategory(tool.category).content[locale].slug;
      return `/${locale}/${s.tools}/${categorySlug}/${tool.slugs[locale]}/`;
    }
    case 'page':
      return `/${locale}/${s[key.pageId]}/`;
    case 'not-found':
      return `/${locale}/404/`;
  }
}

/** The same page in every locale. */
export function alternatesFor(key: RouteKey): Record<Locale, string> {
  return Object.fromEntries(LOCALES.map((locale) => [locale, pathFor(key, locale)])) as Record<Locale, string>;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Stable identifier for a route key (tests, analytics, dedupe). */
export function routeId(key: RouteKey): string {
  switch (key.kind) {
    case 'category':
      return `category:${key.categoryId}`;
    case 'tool':
      return `tool:${key.toolId}`;
    case 'page':
      return `page:${key.pageId}`;
    default:
      return key.kind;
  }
}

/** Every page route in every locale (drives getStaticPaths and the sitemap). */
export function getAllRoutes(): PageRoute[] {
  const keys: { key: RouteKey; indexable: boolean }[] = [
    { key: { kind: 'home' }, indexable: true },
    { key: { kind: 'tools' }, indexable: true },
    ...getCategories().map((c) => ({ key: { kind: 'category', categoryId: c.id } as RouteKey, indexable: true })),
    ...listedTools.map((t) => ({ key: { kind: 'tool', toolId: t.id } as RouteKey, indexable: true })),
    ...STATIC_PAGES.map((pageId) => ({ key: { kind: 'page', pageId } as RouteKey, indexable: true })),
    { key: { kind: 'not-found' }, indexable: false },
  ];
  return keys.flatMap(({ key, indexable }) =>
    LOCALES.map((locale) => ({ key, locale, indexable, path: pathFor(key, locale) })),
  );
}
