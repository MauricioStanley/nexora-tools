import { brand } from '@/config/brand';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/config/site';
import { fmt } from '@/i18n/format';
import { getDictionary } from '@/i18n';
import { absoluteUrl } from '@/lib/routing';

export interface AlternateLink {
  hreflang: string;
  href: string;
}

export interface PageSeo {
  title: string;
  description: string;
  canonical: string;
  alternates: AlternateLink[];
  ogImage: string;
  ogType: 'website' | 'article';
  noindex: boolean;
}

/** "Merge PDF online" → "Merge PDF online | Nexora Tools" (unless it already contains the brand). */
export function buildTitle(title: string, locale: Locale): string {
  const resolved = fmt(title);
  if (resolved.includes(brand.productName)) return resolved;
  return fmt(getDictionary(locale).meta.titleTemplate, { title: resolved });
}

/**
 * hreflang set for a page available in every locale.
 * `x-default` points to the default-locale version, except for the home page where the
 * language-detecting root (`/`) is the correct x-default target.
 */
export function buildAlternates(paths: Record<Locale, string>, options: { xDefaultPath?: string } = {}): AlternateLink[] {
  const links: AlternateLink[] = LOCALES.map((locale) => ({ hreflang: locale, href: absoluteUrl(paths[locale]) }));
  links.push({ hreflang: 'x-default', href: absoluteUrl(options.xDefaultPath ?? paths[DEFAULT_LOCALE]) });
  return links;
}

export function buildPageSeo(input: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  alternates: Record<Locale, string> | null;
  xDefaultPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  /** Use the title verbatim (home page). */
  rawTitle?: boolean;
}): PageSeo {
  return {
    title: input.rawTitle ? fmt(input.title) : buildTitle(input.title, input.locale),
    description: fmt(input.description),
    canonical: absoluteUrl(input.path),
    alternates: input.alternates ? buildAlternates(input.alternates, { xDefaultPath: input.xDefaultPath }) : [],
    ogImage: absoluteUrl(input.ogImage ?? brand.assets.ogImage[input.locale]),
    ogType: input.ogType ?? 'website',
    noindex: input.noindex ?? false,
  };
}
