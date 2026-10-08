import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { readImageDimensions, readJpegInfo, readWebpInfo, stripJpegMetadata } from './headers';
import { computeTargetSize, fitWithinLimits, proportionalSide } from './resize';

async function jpeg(width: number, height: number, orientation?: number): Promise<Uint8Array> {
  let pipeline = sharp({ create: { width, height, channels: 3, background: '#3366cc' } }).jpeg({ quality: 80 });
  if (orientation) pipeline = pipeline.withMetadata({ orientation });
  return new Uint8Array(await pipeline.toBuffer());
}

describe('image headers', () => {
  it('reads JPEG dimensions and EXIF orientation', async () => {
    expect(readJpegInfo(await jpeg(40, 30))).toMatchObject({ width: 40, height: 30, orientation: 1, components: 3 });
    expect(readJpegInfo(await jpeg(40, 30, 6))).toMatchObject({ width: 40, height: 30, orientation: 6 });
  });

  it('reads PNG and WebP dimensions', async () => {
    const png = new Uint8Array(await sharp({ create: { width: 17, height: 9, channels: 4, background: '#0000' } }).png().toBuffer());
    expect(readImageDimensions(png, 'png')).toEqual({ width: 17, height: 9 });
    const lossy = new Uint8Array(await sharp({ create: { width: 21, height: 13, channels: 3, background: '#fff' } }).webp().toBuffer());
    expect(readWebpInfo(lossy)).toMatchObject({ width: 21, height: 13, animated: false });
    const lossless = new Uint8Array(
      await sharp({ create: { width: 33, height: 7, channels: 4, background: '#f00a' } }).webp({ lossless: true }).toBuffer(),
    );
    expect(readWebpInfo(lossless)).toMatchObject({ width: 33, height: 7 });
  });

  it('strips EXIF losslessly and keeps the image decodable', async () => {
    const original = await jpeg(64, 48, 6);
    const stripped = stripJpegMetadata(original);
    expect(stripped.length).toBeLessThan(original.length);
    expect(readJpegInfo(stripped)).toMatchObject({ width: 64, height: 48, orientation: 1 });
    const meta = await sharp(Buffer.from(stripped)).metadata();
    expect(meta.width).toBe(64);
    expect(meta.exif).toBeUndefined();
  });

  it('returns the input untouched when there is nothing to strip or data is malformed', async () => {
    const clean = await jpeg(10, 10);
    const noExif = stripJpegMetadata(clean);
    expect(readJpegInfo(noExif)).toMatchObject({ width: 10, height: 10 });
    const garbage = new Uint8Array([1, 2, 3, 4]);
    expect(stripJpegMetadata(garbage)).toBe(garbage);
  });
});

describe('resize geometry', () => {
  const src = { width: 4000, height: 3000 };

  it('computes each mode', () => {
    expect(computeTargetSize(src, { mode: 'none' })).toEqual(src);
    expect(computeTargetSize(src, { mode: 'percent', percent: 25 })).toEqual({ width: 1000, height: 750 });
    expect(computeTargetSize(src, { mode: 'fit', width: 800, height: 800 })).toEqual({ width: 800, height: 600 });
    expect(computeTargetSize(src, { mode: 'fit', height: 300 })).toEqual({ width: 400, height: 300 });
    expect(computeTargetSize(src, { mode: 'exact', width: 500, height: 500 })).toEqual({ width: 500, height: 500 });
    expect(computeTargetSize(src, { mode: 'max', maxDimension: 2000 })).toEqual({ width: 2000, height: 1500 });
    expect(computeTargetSize({ width: 800, height: 600 }, { mode: 'max', maxDimension: 2000 })).toEqual({ width: 800, height: 600 });
  });

  it('never produces zero-sized output', () => {
    expect(computeTargetSize({ width: 3, height: 1 }, { mode: 'percent', percent: 1 })).toEqual({ width: 1, height: 1 });
  });

  it('keeps proportions', () => {
    expect(proportionalSide(src, 'width', 1600)).toBe(1200);
    expect(proportionalSide(src, 'height', 600)).toBe(800);
  });

  it('fits within device canvas limits (iOS: 16.7 MP)', () => {
    const fitted = fitWithinLimits({ width: 8064, height: 6048 }, { maxSide: 8192, maxArea: 16_777_216 });
    expect(fitted.limited).toBe(true);
    expect(fitted.width * fitted.height).toBeLessThanOrEqual(16_777_216);
    expect(Math.abs(fitted.width / fitted.height - 8064 / 6048)).toBeLessThan(0.01);
    expect(fitWithinLimits({ width: 100, height: 100 }, { maxSide: 8192, maxArea: 16_777_216 }).limited).toBe(false);
  });
});
