/**
 * Shared image pipeline used by every image tool:
 * validate header → decode → (resize) → draw → encode → release memory.
 */
import { ToolFailure, throwIfAborted } from '@/lib/errors';
import type { InputFileTypeId } from '@/lib/files/types';
import { readBytes } from '@/lib/files/read';
import {
  createCanvas,
  drawScaled,
  drawWithOrientation,
  get2dContext,
  getCanvasLimits,
  getMaxDecodePixels,
  releaseCanvas,
} from './canvas';
import { decodeImage } from './decode';
import { encodeCanvas, type OutputMime } from './encode';
import { readImageDimensions, readJpegInfo, readWebpInfo } from './headers';
import { computeTargetSize, fitWithinLimits, type ResizeSpec } from './resize';

export interface ImageProcessOptions {
  mime: OutputMime;
  /** 0..1 for lossy formats. */
  quality: number;
  resize?: ResizeSpec;
  /** Fill color for transparent areas when the output has no alpha (JPEG). */
  background?: string;
  signal?: AbortSignal;
}

export interface ImageProcessResult {
  blob: Blob;
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
  /** True when the output was scaled down to respect this device's canvas limits. */
  limitedByDevice: boolean;
}

export interface ImageProbe {
  width: number;
  height: number;
  animated: boolean;
}

/** Read dimensions (and animation flag for WebP) without decoding pixels. */
export async function probeImage(file: Blob, type: InputFileTypeId): Promise<ImageProbe | null> {
  const head = await readBytes(file.slice(0, 256 * 1024));
  if (type === 'webp') {
    const info = readWebpInfo(head);
    return info ? { width: info.width, height: info.height, animated: info.animated } : null;
  }
  if (type === 'jpeg') {
    const info = readJpegInfo(head);
    if (!info) return null;
    const rotated = info.orientation >= 5;
    return { width: rotated ? info.height : info.width, height: rotated ? info.width : info.height, animated: false };
  }
  const dims = readImageDimensions(head, type);
  return dims ? { ...dims, animated: false } : null;
}

export async function processImage(file: Blob, type: InputFileTypeId, options: ImageProcessOptions): Promise<ImageProcessResult> {
  const { mime, quality, resize = { mode: 'none' }, background = '#ffffff', signal } = options;

  const head = await readBytes(file.slice(0, 256 * 1024));
  const raw = readImageDimensions(head, type);
  if (raw && raw.width * raw.height > getMaxDecodePixels()) throw new ToolFailure('image_too_large');
  const jpeg = type === 'jpeg' ? readJpegInfo(head) : null;

  throwIfAborted(signal);
  const decoded = await decodeImage(file, {
    orientation: jpeg?.orientation,
    rawWidth: jpeg?.width,
    rawHeight: jpeg?.height,
  });

  let oriented: HTMLCanvasElement | null = null;
  let canvas: HTMLCanvasElement | null = null;
  try {
    throwIfAborted(signal);
    let source: CanvasImageSource = decoded.source;
    if (decoded.pendingOrientation !== 1) {
      oriented = createCanvas(decoded.width, decoded.height);
      drawWithOrientation(get2dContext(oriented), decoded.source, decoded.pendingOrientation, decoded.width, decoded.height);
      source = oriented;
    }

    const target = computeTargetSize({ width: decoded.width, height: decoded.height }, resize);
    const fitted = fitWithinLimits(target, getCanvasLimits());

    canvas = createCanvas(fitted.width, fitted.height);
    const ctx = get2dContext(canvas, { alpha: mime !== 'image/jpeg' });
    if (mime === 'image/jpeg') {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, fitted.width, fitted.height);
    }
    drawScaled(ctx, source, decoded.width, decoded.height, fitted.width, fitted.height);
    throwIfAborted(signal);

    const blob = await encodeCanvas(canvas, mime, quality);
    return {
      blob,
      width: fitted.width,
      height: fitted.height,
      sourceWidth: decoded.width,
      sourceHeight: decoded.height,
      limitedByDevice: fitted.limited,
    };
  } finally {
    decoded.release();
    releaseCanvas(oriented);
    releaseCanvas(canvas);
  }
}
