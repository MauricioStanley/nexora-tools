import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/config/site';

/** First supported locale explicitly listed in the browser languages, or null. */
export function matchSupportedLocale(
  browserLanguages: readonly string[] | undefined,
  supported: readonly Locale[] = LOCALES,
): Locale | null {
  for (const tag of browserLanguages ?? []) {
    const base = tag.toLowerCase().split(/[-_]/)[0];
    const match = supported.find((l) => l === base);
    if (match) return match;
  }
  return null;
}

/**
 * Resolve the preferred locale.
 * Priority: an explicit stored choice → the first supported browser language → default.
 */
export function resolvePreferredLocale(
  stored: string | null | undefined,
  browserLanguages: readonly string[] | undefined,
  supported: readonly Locale[] = LOCALES,
  fallback: Locale = DEFAULT_LOCALE,
): Locale {
  if (stored && (supported as readonly string[]).includes(stored)) return stored as Locale;
  return matchSupportedLocale(browserLanguages, supported) ?? fallback;
}
