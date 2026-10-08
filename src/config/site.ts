import { brand } from './brand';

/** Supported locales. Adding a locale: extend this list, add a dictionary and route segments. */
export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

/** Locale used when detection fails and for `x-default` alternates. */
export const DEFAULT_LOCALE: Locale = 'en';

/** BCP-47 tags used for `<html lang>`, `og:locale` and `Intl` formatting. */
export const LOCALE_META: Record<Locale, { htmlLang: string; ogLocale: string; label: string; nativeLabel: string }> = {
  en: { htmlLang: 'en', ogLocale: 'en_US', label: 'English', nativeLabel: 'English' },
  es: { htmlLang: 'es', ogLocale: 'es_ES', label: 'Spanish', nativeLabel: 'Español' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Canonical origin without trailing slash.
 * Astro exposes `site` as `import.meta.env.SITE`; tests fall back to the brand URL.
 */
export const SITE_URL: string = (
  (typeof import.meta !== 'undefined' && import.meta.env?.SITE) || brand.productUrl
).replace(/\/+$/, '');

/** localStorage keys. Centralized so they're never duplicated or mistyped. */
export const STORAGE_KEYS = {
  locale: 'nexora:locale',
  theme: 'nexora:theme',
  recentTools: 'nexora:recent-tools',
  localeSuggestionDismissed: 'nexora:locale-suggestion-dismissed',
  analyticsConsent: 'nexora:analytics-consent',
} as const;

export const THEMES = ['dark', 'light'] as const;
export type Theme = (typeof THEMES)[number];
export const DEFAULT_THEME: Theme = 'dark';
