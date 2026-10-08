import { describe, expect, it } from 'vitest';
import { buildSearchDocuments } from './documents';
import { editDistance, normalize, prepareIndex, search } from './engine';

const en = prepareIndex(buildSearchDocuments('en'));
const es = prepareIndex(buildSearchDocuments('es'));

const top = (index: typeof en, query: string) => search(index, query)[0]?.doc.id;

describe('search engine', () => {
  it('normalizes accents, case and punctuation', () => {
    expect(normalize('  Imágenes  JPG/PNG! ')).toBe('imagenes jpg png');
  });

  it('computes typo distance with transpositions', () => {
    expect(editDistance('mrege', 'merge')).toBe(1);
    expect(editDistance('pdf', 'pdf')).toBe(0);
  });

  it.each([
    ['merge pdf', 'merge-pdf'],
    ['join pdf', 'merge-pdf'],
    ['combine pdf', 'merge-pdf'],
    ['unir pdf', 'merge-pdf'],
    ['mrege pdf', 'merge-pdf'],
    ['compress image', 'compress-image'],
    ['resize photo', 'resize-image'],
    ['qr code', 'qr-code-generator'],
    ['webp jpg', 'webp-to-jpg'],
    ['png to webp', 'to-webp'],
    ['split', 'split-pdf'],
    ['reduce pdf size', 'compress-pdf'],
    ['wifi qr', 'qr-code-generator'],
  ])('en: "%s" → %s', (query, expected) => {
    expect(top(en, query)).toBe(expected);
  });

  it.each([
    ['unir pdf', 'merge-pdf'],
    ['juntar pdf', 'merge-pdf'],
    ['comprimir imagen', 'compress-image'],
    ['comprimir imágenes', 'compress-image'],
    ['redimensionar foto', 'resize-image'],
    ['código qr', 'qr-code-generator'],
    ['merge pdf', 'merge-pdf'],
    ['pdf a jpg', 'pdf-to-jpg'],
  ])('es: "%s" → %s', (query, expected) => {
    expect(top(es, query)).toBe(expected);
  });

  it('returns nothing for empty or unrelated queries', () => {
    expect(search(en, '   ')).toEqual([]);
    expect(search(en, 'zzzzqqq')).toEqual([]);
  });

  it('respects the limit', () => {
    expect(search(en, 'pdf', 2)).toHaveLength(2);
  });
});
