import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { makePdf, toArrayBuffer } from '../../../tests/fixtures';
import { ToolFailure } from '@/lib/errors';
import { mergePdfs } from './logic';

describe('mergePdfs', () => {
  it('combines pages in order and reports progress', async () => {
    const a = await makePdf(2, 'A');
    const b = await makePdf(3, 'B');
    const progress: number[] = [];
    const result = await mergePdfs({ files: [toArrayBuffer(a), toArrayBuffer(b)] }, (v) => progress.push(v));
    expect(result.pageCount).toBe(5);
    const merged = await PDFDocument.load(result.bytes, { updateMetadata: false });
    expect(merged.getPageCount()).toBe(5);
    expect(merged.getProducer()).toBe('Nexora Tools');
    expect(progress.at(-1)).toBe(1);
  });

  it('rejects files that are not PDFs with a user-facing code and file index', async () => {
    const good = await makePdf(1);
    const bad = new TextEncoder().encode('not a pdf at all');
    await expect(mergePdfs({ files: [toArrayBuffer(good), toArrayBuffer(bad)] })).rejects.toMatchObject({
      code: 'corrupt_pdf',
      details: { fileIndex: 1 },
    } satisfies Partial<ToolFailure>);
  });
});
