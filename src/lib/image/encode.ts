/**
 * Image encoding with capability detection.
 *
 * JPEG and PNG encoding are universal. WebP encoding via canvas is NOT supported by Safari
 * (it silently returns PNG), so for WebP we detect support once and fall back to a WASM
 * encoder (@jsquash/webp, from Google's Squoosh codecs) that is downloaded only when needed.
 */
import { ToolFailure } from '@/lib/errors';
import { canvasToBlob, createCanvas, releaseCanvas } from './canvas';

export type OutputMime = 'image/jpeg' | 'image/png' | 'image/webp';

const support = new Map<OutputMime, Promise<boolean>>();

export function supportsNativeEncoding(mime: OutputMime): Promise<boolean> {
  let cached = support.get(mime);
  if (!cached) {
    cached = (async () => {
      const canvas = createCanvas(2, 2);
      try {
        const blob = await canvasToBlob(canvas, mime, 0.8);
        return blob?.type === mime;
      } finally {
        releaseCanvas(canvas);
      }
    })();
    support.set(mime, cached);
  }
  return cached;
}

async function encodeWebpWasm(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new ToolFailure('image_too_large');
  let imageData: ImageData;
  try {
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch (error) {
    throw new ToolFailure('out_of_memory', {}, error);
  }
  try {
    const { default: encode } = await import('@jsquash/webp/encode');
    const buffer = await encode(imageData, { quality: Math.round(quality * 100) });
    return new Blob([buffer], { type: 'image/webp' });
  } catch (error) {
    throw new ToolFailure('encode_unsupported', {}, error);
  }
}

/** Encode a canvas. `quality` is 0..1 and ignored for PNG. */
export async function encodeCanvas(canvas: HTMLCanvasElement, mime: OutputMime, quality: number): Promise<Blob> {
  if (mime === 'image/webp' && !(await supportsNativeEncoding('image/webp'))) {
    return encodeWebpWasm(canvas, quality);
  }
  const blob = await canvasToBlob(canvas, mime, mime === 'image/png' ? undefined : quality);
  if (!blob || blob.size === 0) {
    // A null blob almost always means the canvas exceeded the device's memory budget.
    throw new ToolFailure('image_too_large');
  }
  if (blob.type !== mime) {
    if (mime === 'image/webp') return encodeWebpWasm(canvas, quality);
    throw new ToolFailure('encode_unsupported');
  }
  return blob;
}

export const MIME_TO_TYPE: Record<OutputMime, 'jpeg' | 'png' | 'webp'> = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
};
