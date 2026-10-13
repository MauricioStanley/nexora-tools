import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { toArrayBuffer } from '../../../tests/fixtures';
import { pagesToRemove, removePdfPages } from './logic';

/** Pages are 101, 102… points wide, so the survivors can be identified by width. */
async function numberedPdf(pages: number): Promise<ArrayBuffer> {
  const doc = await PDFDocument.create();
  doc.setTitle('Quarterly report');
  for (let i = 1; i <= pages; i++) doc.addPage([100 + i, 500]);
  return toArrayBuffer(await doc.save());
}

async function widths(bytes: Uint8Array): Promise<number[]> {
  return (await PDFDocument.load(bytes)).getPages().map((p) => p.getWidth() - 100);
}

describe('removePdfPages', () => {
  it('removes the listed pages and keeps the rest in order', async () => {
    const result = await removePdfPages({ file: await numberedPdf(6), ranges: [{ start: 2, end: 2 }, { start: 4, end: 5 }] });
    expect(result).toMatchObject({ removedPages: 3, remainingPages: 3 });
    expect(await widths(result.bytes)).toEqual([1, 3, 6]);
  });

  it('keeps the document metadata', async () => {
    const result = await removePdfPages({ file: await numberedPdf(3), ranges: [{ start: 1, end: 1 }] });
    expect((await PDFDocument.load(result.bytes)).getTitle()).toBe('Quarterly report');
  });

  it('ignores duplicates and overlapping ranges', async () => {
    expect(pagesToRemove([{ start: 1, end: 3 }, { start: 2, end: 4 }, { start: 9, end: 9 }], 5)).toEqual([1, 2, 3, 4]);
    const result = await removePdfPages({ file: await numberedPdf(5), ranges: [{ start: 1, end: 3 }, { start: 2, end: 2 }] });
    expect(await widths(result.bytes)).toEqual([4, 5]);
  });

  it('refuses to remove every page', async () => {
    await expect(removePdfPages({ file: await numberedPdf(2), ranges: [{ start: 1, end: 2 }] })).rejects.toMatchObject({ code: 'invalid_range' });
  });
});
