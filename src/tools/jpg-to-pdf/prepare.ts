/**
 * Main-thread image preparation for JPG to PDF.
 * - JPEGs are embedded as-is (lossless); metadata can be stripped losslessly.
 * - JPEGs with an EXIF rotation are re-encoded upright (PDF ignores EXIF orientation).
 * - WebP is converted to high-quality JPEG (pdf-lib embeds JPEG and PNG only).
 */
import { ToolFailure } from '@/lib/errors';
import { readBytes } from '@/lib/files/read';
import type { InputFileTypeId } from '@/lib/files/types';
import { readJpegInfo, stripJpegMetadata } from '@/lib/image/headers';
import { processImage } from '@/lib/image/pipeline';
import type { PreparedImage } from './logic';

const REENCODE_QUALITY = 0.92;

async function reencodeAsJpeg(file: Blob, type: InputFileTypeId, signal?: AbortSignal): Promise<PreparedImage> {
  const { blob } = await processImage(file, type, { mime: 'image/jpeg', quality: REENCODE_QUALITY, background: '#ffffff', signal });
  return { kind: 'jpg', bytes: await blob.arrayBuffer() };
}

export async function prepareImage(
  file: Blob,
  type: InputFileTypeId,
  options: { stripMetadata: boolean; signal?: AbortSignal; index: number },
): Promise<PreparedImage> {
  try {
    if (type === 'jpeg') {
      const bytes = await readBytes(file);
      const info = readJpegInfo(bytes);
      if (!info) throw new ToolFailure('image_decode_failed', { fileIndex: options.index });
      if (info.orientation !== 1) return await reencodeAsJpeg(file, type, options.signal);
      const clean = options.stripMetadata ? stripJpegMetadata(bytes) : bytes;
      return { kind: 'jpg', bytes: clean.slice().buffer as ArrayBuffer };
    }
    if (type === 'png') {
      // pdf-lib decodes PNGs to raw pixels, so text/EXIF chunks never reach the PDF.
      return { kind: 'png', bytes: await file.arrayBuffer() };
    }
    return await reencodeAsJpeg(file, type, options.signal);
  } catch (error) {
    if (error instanceof ToolFailure) {
      if (error.details.fileIndex === undefined) throw new ToolFailure(error.code, { ...error.details, fileIndex: options.index }, error);
      throw error;
    }
    throw new ToolFailure('image_decode_failed', { fileIndex: options.index }, error);
  }
}
