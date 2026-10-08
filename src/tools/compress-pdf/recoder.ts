/**
 * Browser JPEG re-encoder for Compress PDF. Works in a worker (OffscreenCanvas) and on the
 * main thread (<canvas>). EXIF is stripped before decoding: PDF viewers ignore EXIF
 * orientation, so letting the browser apply it would rotate the image inside the PDF.
 */
import { stripJpegMetadata } from '@/lib/image/headers';
import type { ImageRecoder, RecodedImage } from './logic';

export function canUseOffscreenCanvas(): boolean {
  try {
    return (
      typeof OffscreenCanvas !== 'undefined' &&
      typeof OffscreenCanvas.prototype.convertToBlob === 'function' &&
      new OffscreenCanvas(1, 1).getContext('2d') !== null
    );
  } catch {
    return false;
  }
}

async function encode(bitmap: ImageBitmap, width: number, height: number, quality: number): Promise<Blob | null> {
  if (canUseOffscreenCanvas()) {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, width, height);
    try {
      return await canvas.convertToBlob({ type: 'image/jpeg', quality });
    } finally {
      canvas.width = 0;
      canvas.height = 0;
    }
  }
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);
  try {
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

export const browserRecoder: ImageRecoder = {
  async recodeJpeg(bytes, { quality, maxDimension }): Promise<RecodedImage | null> {
    const clean = stripJpegMetadata(bytes);
    let bitmap: ImageBitmap;
    try {
      bitmap = await createImageBitmap(new Blob([clean as Uint8Array<ArrayBuffer>], { type: 'image/jpeg' }));
    } catch {
      return null; // undecodable (e.g. unusual JPEG variants) → keep the original image
    }
    try {
      const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const blob = await encode(bitmap, width, height, quality);
      if (!blob || blob.size === 0) return null;
      return { bytes: new Uint8Array(await blob.arrayBuffer()), width, height };
    } finally {
      bitmap.close();
    }
  },
};
