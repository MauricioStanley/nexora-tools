import { PDFDocument } from 'pdf-lib';
import { unzipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { makePdf, toArrayBuffer } from '../../../tests/fixtures';
import { planGroups, splitPdf, type SplitPayload } from './logic';

const names = { page: 'page', pages: 'pages', extracted: 'extracted' };

async function run(overrides: Partial<SplitPayload>, pages = 5) {
  const file = toArrayBuffer(await makePdf(pages));
  return splitPdf({ file, baseName: 'doc', mode: 'all', names, maxIndividualFiles: 12, ...overrides });
}

describe('splitPdf', () => {
  it('plans groups for every mode', () => {
    expect(planGroups('all', 3)).toHaveLength(3);
    expect(planGroups('every', 5, [], 2).map((g) => g[0])).toEqual([
      { start: 1, end: 2 },
      { start: 3, end: 4 },
      { start: 5, end: 5 },
    ]);
    expect(planGroups('extract', 5, [{ start: 2, end: 2 }, { start: 4, end: 5 }])).toHaveLength(1);
  });

  it('splits every page and packages a ZIP', async () => {
    const result = await run({ mode: 'all' });
    expect(result.totalOutputs).toBe(5);
    expect(result.files.map((f) => f.name)).toEqual(['doc-page-1.pdf', 'doc-page-2.pdf', 'doc-page-3.pdf', 'doc-page-4.pdf', 'doc-page-5.pdf']);
    const zip = unzipSync(result.zip!);
    expect(Object.keys(zip)).toHaveLength(5);
    expect((await PDFDocument.load(zip['doc-page-3.pdf']!)).getPageCount()).toBe(1);
  });

  it('splits by custom ranges', async () => {
    const result = await run({ mode: 'ranges', ranges: [{ start: 1, end: 2 }, { start: 3, end: 5 }] });
    expect(result.files.map((f) => [f.name, f.pages])).toEqual([
      ['doc-pages-1-2.pdf', 2],
      ['doc-pages-3-5.pdf', 3],
    ]);
  });

  it('extracts selected pages into one PDF, in the given order', async () => {
    const result = await run({ mode: 'extract', ranges: [{ start: 4, end: 4 }, { start: 1, end: 2 }] });
    expect(result.files).toHaveLength(1);
    expect(result.zip).toBeNull();
    expect(result.files[0]).toMatchObject({ name: 'doc-extracted.pdf', pages: 3 });
  });

  it('only returns the ZIP when there are too many parts', async () => {
    const result = await run({ mode: 'all', maxIndividualFiles: 2 });
    expect(result.files).toHaveLength(0);
    expect(result.zip).not.toBeNull();
  });

  it('pads page numbers for correct sorting', async () => {
    const result = await run({ mode: 'every', every: 5 }, 12);
    expect(result.files.map((f) => f.name)).toEqual(['doc-pages-01-05.pdf', 'doc-pages-06-10.pdf', 'doc-pages-11-12.pdf']);
  });
});
