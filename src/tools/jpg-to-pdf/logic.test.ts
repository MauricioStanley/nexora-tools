import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { noisyJpeg, solidPng, toArrayBuffer } from '../../../tests/fixtures';
import { computePlacement, PAGE_SIZES } from './layout';
import { imagesToPdf } from './logic';

describe('computePlacement', () => {
  it('fits a landscape image on an auto-rotated A4 page, centered', () => {
    const place = computePlacement(4000, 3000, { pageSize: 'a4', orientation: 'auto', margin: 'none' });
    expect(place.pageWidth).toBeCloseTo(PAGE_SIZES.a4[1]);
    expect(place.pageHeight).toBeCloseTo(PAGE_SIZES.a4[0]);
    expect(place.width).toBeCloseTo(place.pageHeight * (4 / 3), 0);
    expect(place.x).toBeCloseTo((place.pageWidth - place.width) / 2);
  });

  it('respects forced orientation and margins', () => {
    const place = computePlacement(4000, 3000, { pageSize: 'letter', orientation: 'portrait', margin: 'large' });
    expect(place.pageWidth).toBe(612);
    expect(place.width).toBeCloseTo(612 - 72);
  });

  it('never enlarges small images beyond 1pt per pixel', () => {
    const place = computePlacement(200, 100, { pageSize: 'a4', orientation: 'auto', margin: 'small' });
    expect(place.width).toBe(200);
    expect(place.height).toBe(100);
  });

  it('sizes "fit" pages to the image at 96 DPI, capped at the PDF maximum', () => {
    expect(computePlacement(800, 600, { pageSize: 'fit', orientation: 'auto', margin: 'none' })).toMatchObject({ pageWidth: 600, pageHeight: 450 });
    const huge = computePlacement(40000, 1000, { pageSize: 'fit', orientation: 'auto', margin: 'none' });
    expect(huge.pageWidth).toBeLessThanOrEqual(14400);
  });
});

describe('imagesToPdf', () => {
  it('creates one page per image from JPG and PNG', async () => {
    const result = await imagesToPdf({
      images: [
        { kind: 'jpg', bytes: toArrayBuffer(await noisyJpeg(120, 80)) },
        { kind: 'png', bytes: toArrayBuffer(await solidPng(50, 90)) },
      ],
      pageSize: 'fit',
      orientation: 'auto',
      margin: 'none',
    });
    expect(result.pageCount).toBe(2);
    const doc = await PDFDocument.load(result.bytes);
    expect(doc.getPage(0).getSize()).toEqual({ width: 90, height: 60 });
    expect(doc.getPage(1).getSize()).toEqual({ width: 37.5, height: 67.5 });
  });

  it('fails with a file index for undecodable images', async () => {
    await expect(
      imagesToPdf({ images: [{ kind: 'jpg', bytes: new ArrayBuffer(8) }], pageSize: 'a4', orientation: 'auto', margin: 'none' }),
    ).rejects.toMatchObject({ code: 'image_decode_failed', details: { fileIndex: 0 } });
  });
});
