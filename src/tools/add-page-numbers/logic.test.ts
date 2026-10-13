import { unzlibSync } from 'fflate';
import { PDFDocument, PDFName, PDFRawStream, degrees } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { makePdf, toArrayBuffer } from '../../../tests/fixtures';
import { planLabels } from './labels';
import { addPageNumbers, type PageNumbersPayload } from './logic';

const base: Omit<PageNumbersPayload, 'file'> = { position: 'bottom-center', template: '{n}', start: 1, skipFirst: false, size: 'medium' };

/** Every decoded content stream of a page, concatenated. */
async function pageContent(bytes: Uint8Array, index: number): Promise<string> {
  const doc = await PDFDocument.load(bytes);
  const contents = doc.getPage(index).node.Contents();
  const refs = contents && 'asArray' in contents ? contents.asArray() : contents ? [contents] : [];
  return refs
    .map((ref) => doc.context.lookup(ref))
    .filter((s): s is PDFRawStream => s instanceof PDFRawStream)
    .map((s) => {
      const raw = s.getContents();
      const data = s.dict.get(PDFName.of('Filter')) ? unzlibSync(raw) : raw;
      return new TextDecoder('latin1').decode(data);
    })
    .join('\n');
}

/** Hex form pdf-lib uses for standard-font text. */
const hex = (text: string) => `<${[...text].map((c) => c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join('')}>`;

describe('page labels', () => {
  it('numbers every page from the start value', () => {
    expect(planLabels(3, 'Page {n} of {total}', 1, false)).toEqual(['Page 1 of 3', 'Page 2 of 3', 'Page 3 of 3']);
    expect(planLabels(2, '{n}', 7, false)).toEqual(['7', '8']);
  });

  it('skips the cover and adjusts the total', () => {
    expect(planLabels(4, '{n} / {total}', 1, true)).toEqual([null, '1 / 3', '2 / 3', '3 / 3']);
  });
});

describe('addPageNumbers', () => {
  it('draws the label on each page', async () => {
    const result = await addPageNumbers({ ...base, file: toArrayBuffer(await makePdf(3)), template: 'Page {n} of {total}' });
    expect(result).toMatchObject({ numberedPages: 3, totalPages: 3 });
    expect(await pageContent(result.bytes, 1)).toContain(hex('Page 2 of 3'));
  });

  it('leaves the first page alone when asked', async () => {
    const result = await addPageNumbers({ ...base, file: toArrayBuffer(await makePdf(3)), skipFirst: true });
    expect(result.numberedPages).toBe(2);
    expect(await pageContent(result.bytes, 0)).not.toContain(hex('1'));
    expect(await pageContent(result.bytes, 1)).toContain(hex('1'));
  });

  it('rotates the label with the page so it reads upright', async () => {
    const source = await PDFDocument.load(await makePdf(1));
    source.getPage(0).setRotation(degrees(90));
    const result = await addPageNumbers({ ...base, file: toArrayBuffer(await source.save()) });
    // 400×500 page shown as 500×400: the visual bottom edge is user-space x = 400 - 20 (margin),
    // and the text matrix turns 90° (cos ≈ 0, sin = 1).
    expect(await pageContent(result.bytes, 0)).toMatch(/\S+ 1 -1 \S+ 380 246\.\d+ Tm/);
  });

  it('rejects templates without a number or with unsupported characters', async () => {
    const file = toArrayBuffer(await makePdf(1));
    await expect(addPageNumbers({ ...base, file, template: 'Page' })).rejects.toMatchObject({ code: 'input_required' });
    await expect(addPageNumbers({ ...base, file, template: 'Страница {n}' })).rejects.toMatchObject({ code: 'input_required' });
  });
});
