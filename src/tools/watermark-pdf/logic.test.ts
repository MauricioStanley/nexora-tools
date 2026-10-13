import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { makePdf, toArrayBuffer } from '../../../tests/fixtures';
import { parseHexColor, planStamps } from './layout';
import { watermarkPdf, type WatermarkPayload } from './logic';

const base: Omit<WatermarkPayload, 'file'> = { text: 'CONFIDENTIAL', layout: 'diagonal', fontSize: 60, opacity: 0.3, color: '#808080' };
const page = { width: 600, height: 800 };

describe('watermark layout', () => {
  it('puts one diagonal stamp in the center, shrunk to fit the diagonal', () => {
    const [stamp, ...rest] = planStamps(page, 'diagonal', 8, 200);
    expect(rest).toHaveLength(0);
    expect(stamp!.center).toEqual({ x: 300, y: 400 });
    expect(stamp!.angle).toBeCloseTo(53.13, 1);
    expect(8 * stamp!.size).toBeCloseTo(0.8 * 1000);
  });

  it('keeps the requested size when it already fits', () => {
    expect(planStamps(page, 'horizontal', 8, 40)[0]).toMatchObject({ angle: 0, size: 40 });
  });

  it('covers the page with repeated stamps that stay near it', () => {
    const stamps = planStamps(page, 'tiled', 6, 24);
    expect(stamps.length).toBeGreaterThan(8);
    for (const s of stamps) {
      expect(s.center.x).toBeGreaterThan(-6 * 24);
      expect(s.center.x).toBeLessThan(600 + 6 * 24);
    }
  });

  it('parses colors and falls back to gray', () => {
    expect(parseHexColor('#ff8000')).toEqual({ r: 1, g: 128 / 255, b: 0 });
    expect(parseHexColor('nope')).toEqual({ r: 0.5, g: 0.5, b: 0.5 });
  });
});

describe('watermarkPdf', () => {
  it('stamps every page with a transparent text layer', async () => {
    const source = await makePdf(3);
    const result = await watermarkPdf({ ...base, file: toArrayBuffer(source) });
    expect(result.pages).toBe(3);
    const doc = await PDFDocument.load(result.bytes);
    expect(doc.getPageCount()).toBe(3);
    // The opacity becomes an ExtGState resource on each page.
    const resources = doc.getPage(2).node.Resources()!.toString();
    expect(resources).toMatch(/ExtGState/);
  });

  it('accepts accented Spanish text', async () => {
    const result = await watermarkPdf({ ...base, file: toArrayBuffer(await makePdf(1)), text: 'Borrador · Confidencial ñ', layout: 'tiled', fontSize: 24 });
    expect(result.pages).toBe(1);
  });

  it('rejects empty text and characters the standard font can’t draw', async () => {
    const file = toArrayBuffer(await makePdf(1));
    await expect(watermarkPdf({ ...base, file, text: '   ' })).rejects.toMatchObject({ code: 'input_required' });
    await expect(watermarkPdf({ ...base, file, text: '机密' })).rejects.toMatchObject({ code: 'input_required' });
  });
});
