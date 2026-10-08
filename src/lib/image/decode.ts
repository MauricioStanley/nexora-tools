import { ToolFailure } from '@/lib/errors';

export interface DecodedImage {
  source: ImageBitmap | HTMLImageElement;
  /** Displayed width (after EXIF orientation). */
  width: number;
  /** Displayed height (after EXIF orientation). */
  height: number;
  /**
   * EXIF orientation that still has to be applied when drawing (1 = none).
   * Non-1 only when the browser ignored the orientation tag.
   */
  pendingOrientation: number;
  release(): void;
}

export interface DecodeHint {
  orientation?: number;
  rawWidth?: number;
  rawHeight?: number;
}

function resolveOrientation(width: number, height: number, hint: DecodeHint): number {
  const o = hint.orientation ?? 1;
  if (o < 5 || !hint.rawWidth || !hint.rawHeight || hint.rawWidth === hint.rawHeight) return 1;
  // For 90° orientations a browser that applied EXIF returns swapped dimensions.
  const applied = width === hint.rawHeight && height === hint.rawWidth;
  return applied ? 1 : o;
}

async function decodeWithImageElement(blob: Blob): Promise<DecodedImage> {
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  try {
    await img.decode();
  } catch (error) {
    URL.revokeObjectURL(url);
    throw new ToolFailure('image_decode_failed', {}, error);
  }
  return {
    source: img,
    width: img.naturalWidth,
    height: img.naturalHeight,
    pendingOrientation: 1,
    release() {
      img.removeAttribute('src');
      URL.revokeObjectURL(url);
    },
  };
}

/**
 * Decode an image off the main thread where possible (`createImageBitmap`), falling back
 * to an <img> element. Modern engines apply EXIF orientation during decode.
 */
export async function decodeImage(blob: Blob, hint: DecodeHint = {}): Promise<DecodedImage> {
  let decoded: DecodedImage;
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob);
      decoded = {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        pendingOrientation: 1,
        release: () => bitmap.close(),
      };
    } catch {
      decoded = await decodeWithImageElement(blob);
    }
  } else {
    decoded = await decodeWithImageElement(blob);
  }
  if (!decoded.width || !decoded.height) {
    decoded.release();
    throw new ToolFailure('image_decode_failed');
  }
  const pending = resolveOrientation(decoded.width, decoded.height, hint);
  if (pending >= 5) {
    // Browser returned raw pixels: displayed size is the transposed size.
    return { ...decoded, width: decoded.height, height: decoded.width, pendingOrientation: pending };
  }
  return decoded;
}
