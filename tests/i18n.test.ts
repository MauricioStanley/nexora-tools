import { describe, expect, it } from 'vitest';
import en from '@/i18n/locales/en';
import es from '@/i18n/locales/es';
import { matchSupportedLocale, resolvePreferredLocale } from '@/i18n/detect';
import { fmt, formatBytes, plural } from '@/i18n/format';

function shape(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return [`${prefix}[]`];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => shape(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

describe('dictionaries', () => {
  it('Spanish has exactly the same keys as English', () => {
    expect(shape(es).sort()).toEqual(shape(en).sort());
  });

  it('has no empty strings', () => {
    const empty: string[] = [];
    const walk = (value: unknown, path: string) => {
      if (typeof value === 'string' && value.trim() === '') empty.push(path);
      else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => walk(v, `${path}.${k}`));
    };
    walk(en, 'en');
    walk(es, 'es');
    expect(empty).toEqual([]);
  });
});

describe('language detection', () => {
  it('prefers an explicit stored choice', () => {
    expect(resolvePreferredLocale('en', ['es-MX', 'es'])).toBe('en');
  });

  it('uses the first supported browser language', () => {
    expect(resolvePreferredLocale(null, ['es-MX', 'en-US'])).toBe('es');
    expect(resolvePreferredLocale(null, ['fr-FR', 'es-ES'])).toBe('es');
    expect(resolvePreferredLocale(null, ['fr-FR', 'de'])).toBe('en');
  });

  it('ignores invalid stored values', () => {
    expect(resolvePreferredLocale('xx', ['es'])).toBe('es');
  });

  it('reports no match when no supported language is listed', () => {
    expect(matchSupportedLocale(['fr', 'de-DE'])).toBeNull();
    expect(matchSupportedLocale(['ES_ar'])).toBe('es');
  });
});

describe('formatting', () => {
  it('interpolates placeholders and brand variables', () => {
    expect(fmt('Hello {name}', { name: 'Ana' })).toBe('Hello Ana');
    expect(fmt('{product} by {company}')).toBe('Nexora Tools by Codywork');
    expect(fmt('Keep {unknown}')).toBe('Keep {unknown}');
  });

  it('pluralizes per locale', () => {
    const forms = { one: '{count} file', other: '{count} files' };
    expect(plural(forms, 1, 'en')).toBe('1 file');
    expect(plural(forms, 3, 'en')).toBe('3 files');
    expect(plural(forms, 1200, 'es')).toBe('1200 files');
  });

  it('formats byte sizes', () => {
    expect(formatBytes(512, 'en')).toBe('512 B');
    expect(formatBytes(1536, 'en')).toBe('1.5 KB');
    expect(formatBytes(1536, 'es')).toBe('1,5 KB');
    expect(formatBytes(25 * 1024 * 1024, 'en')).toBe('25 MB');
  });
});
