/**
 * Canvas helpers for the main thread.
 * Browsers impose hard limits on canvas size — iOS/iPadOS WebKit caps a canvas at
 * 16,777,216 pixels. Exceeding it produces a blank or null result, so we size to fit.
 */
import { ToolFailure } from '@/lib/errors';
import type { CanvasLimits } from './resize';

function isAppleTouchDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iP(hone|od|ad)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

export function getCanvasLimits(): CanvasLimits {
  if (isAppleTouchDevice()) return { maxSide: 8192, maxArea: 16_777_216 };
  return { maxSide: 16_384, maxArea: 120_000_000 };
}

/** Largest source image we are willing to decode (pixels). Decoding allocates 4 bytes/pixel. */
export function getMaxDecodePixels(): number {
  return isAppleTouchDevice() ? 60_000_000 : 200_000_000;
}

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function get2dContext(canvas: HTMLCanvasElement, options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d', options);
  if (!ctx) throw new ToolFailure('image_too_large');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  return ctx;
}

/** Free canvas backing memory immediately (important on iOS, which caps total canvas memory). */
export function releaseCanvas(canvas: HTMLCanvasElement | OffscreenCanvas | null | undefined): void {
  if (!canvas) return;
  canvas.width = 0;
  canvas.height = 0;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob((blob) => resolve(blob), type, quality);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Apply an EXIF orientation transform. Only used when the browser did not already apply it
 * (all current engines do; this is a safety net for older ones).
 * `width`/`height` are the *displayed* (oriented) target size.
 */
export function drawWithOrientation(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  orientation: number,
  width: number,
  height: number,
): void {
  const rotated = orientation >= 5;
  const w = rotated ? height : width;
  const h = rotated ? width : height;
  ctx.save();
  switch (orientation) {
    case 2: ctx.transform(-1, 0, 0, 1, w, 0); break;
    case 3: ctx.transform(-1, 0, 0, -1, w, h); break;
    case 4: ctx.transform(1, 0, 0, -1, 0, h); break;
    case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
    case 6: ctx.transform(0, 1, -1, 0, h, 0); break;
    case 7: ctx.transform(0, -1, -1, 0, h, w); break;
    case 8: ctx.transform(0, -1, 1, 0, 0, w); break;
    default: break;
  }
  ctx.drawImage(source, 0, 0, w, h);
  ctx.restore();
}

/**
 * High-quality downscale: halve repeatedly while the image is ≥2× the target, then do the
 * final resample. Engines that ignore `imageSmoothingQuality` (older Safari) produce much
 * sharper results this way.
 */
export function drawScaled(
  target: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  width: number,
  height: number,
): void {
  let current: CanvasImageSource = source;
  let cw = sourceWidth;
  let ch = sourceHeight;
  const temps: HTMLCanvasElement[] = [];
  try {
    while (cw / 2 >= width && ch / 2 >= height && cw > 2 && ch > 2) {
      const nw = Math.max(width, Math.floor(cw / 2));
      const nh = Math.max(height, Math.floor(ch / 2));
      const tmp = createCanvas(nw, nh);
      get2dContext(tmp).drawImage(current, 0, 0, cw, ch, 0, 0, nw, nh);
      temps.push(tmp);
      current = tmp;
      cw = nw;
      ch = nh;
    }
    target.drawImage(current, 0, 0, cw, ch, 0, 0, width, height);
  } finally {
    temps.forEach(releaseCanvas);
  }
}
