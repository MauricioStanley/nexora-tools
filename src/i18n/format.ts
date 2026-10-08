/**
 * Client-safe string helpers. This module must stay dependency-free: React islands import it,
 * and it must never pull dictionaries into a client bundle.
 */
import { brand } from '@/config/brand';

export type Vars = Record<string, string | number>;

/** Plural forms following Intl.PluralRules categories. `other` is mandatory. */
export interface PluralForms {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

const BRAND_VARS: Vars = {
  product: brand.productName,
  company: brand.companyName,
};

/** Replace `{key}` placeholders. Brand placeholders (`{product}`, `{company}`) are always available. */
export function fmt(template: string, vars: Vars = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key] ?? BRAND_VARS[key];
    return value === undefined ? match : String(value);
  });
}

const pluralRulesCache = new Map<string, Intl.PluralRules>();

function pluralRules(locale: string): Intl.PluralRules {
  let rules = pluralRulesCache.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(locale);
    pluralRulesCache.set(locale, rules);
  }
  return rules;
}

/** Pick the right plural form and interpolate `{count}` (formatted for the locale). */
export function plural(forms: PluralForms, count: number, locale: string, vars: Vars = {}): string {
  const category = count === 0 && forms.zero ? 'zero' : pluralRules(locale).select(count);
  const template = forms[category as keyof PluralForms] ?? forms.other;
  return fmt(template, { count: formatNumber(count, locale), ...vars });
}

export function formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB'] as const;

/** Human-readable size using decimal-ish binary steps (1 KB = 1024 B), localized separators. */
export function formatBytes(bytes: number, locale: string): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = unit === 0 ? 0 : value < 10 ? 1 : 0;
  return `${formatNumber(Number(value.toFixed(digits)), locale, { maximumFractionDigits: digits })} ${BYTE_UNITS[unit]}`;
}

/** Percentage change from `before` to `after`, as a positive magnitude (e.g. 0.42 → "42%"). */
export function formatPercent(ratio: number, locale: string): string {
  return formatNumber(ratio, locale, { style: 'percent', maximumFractionDigits: ratio < 0.1 ? 1 : 0 });
}
