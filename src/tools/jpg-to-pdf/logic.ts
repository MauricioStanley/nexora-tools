/** JPG to PDF — PDF assembly from prepared images (worker + Node tests). */
import { ToolFailure } from '@/lib/errors';
import { stampProducer } from '@/lib/pdf/load';
import { PDFDocument } from '@/lib/pdf/pdf-lib';
import { computePlacement, type LayoutOptions } from './layout';

export interface PreparedImage {
  kind: 'jpg' | 'png';
  bytes: ArrayBuffer;
}

export interface ImagesToPdfPayload extends LayoutOptions {
  images: PreparedImage[];
}

export interface ImagesToPdfResult {
  bytes: Uint8Array;
  pageCount: number;
}

export async function imagesToPdf(payload: ImagesToPdfPayload, onProgress?: (value: number) => void): Promise<ImagesToPdfResult> {
  const doc = await PDFDocument.create();
  stampProducer(doc);
  const total = payload.images.length;

  for (let index = 0; index < total; index++) {
    const image = payload.images[index]!;
    let embedded;
    try {
      embedded = image.kind === 'jpg' ? await doc.embedJpg(new Uint8Array(image.bytes)) : await doc.embedPng(new Uint8Array(image.bytes));
    } catch (error) {
      throw new ToolFailure('image_decode_failed', { fileIndex: index }, error);
    }
    const place = computePlacement(embedded.width, embedded.height, payload);
    const page = doc.addPage([place.pageWidth, place.pageHeight]);
    page.drawImage(embedded, { x: place.x, y: place.y, width: place.width, height: place.height });
    onProgress?.(((index + 1) / total) * 0.9);
  }

  const bytes = await doc.save({ useObjectStreams: true });
  onProgress?.(1);
  return { bytes, pageCount: doc.getPageCount() };
}
