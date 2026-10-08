/**
 * Server-side i18n entry point (Astro components, endpoints, build scripts).
 * React islands must NOT import this module — they receive the strings they need as props.
 */
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/config/site';
import en, { type Dictionary } from './locales/en';
import es from './locales/es';

export type { Dictionary };
export { fmt, plural, formatBytes, formatNumber, formatPercent } from './format';
export type { PluralForms, Vars } from './format';

const dictionaries: Record<Locale, Dictionary> = { en, es };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

/** Every locale except the given one — used for alternates and suggestions. */
export function otherLocales(locale: Locale): Locale[] {
  return LOCALES.filter((l) => l !== locale);
}

/** Tool-facing subset of the dictionary that is serialized into island props. */
export type CommonToolStrings = Dictionary['tool'];
