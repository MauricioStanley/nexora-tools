/**
 * Rotate PDF — pure processing logic (worker + Node tests).
 * Only the page's /Rotate entry changes, so content is never re-rendered or re-compressed.
 */
import { normalizeRotation } from '@/lib/pdf/geometry';
import { loadPdfDocument, stampProducer } from '@/lib/pdf/load';
import { degrees } from '@/lib/pdf/pdf-lib';
import { expandRanges, type PageRange } from '@/lib/pdf/ranges';

/** Clockwise. */
export type RotateAngle = 90 | 180 | 270;

export interface RotatePayload {
  file: ArrayBuffer;
  angle: RotateAngle;
  /** Pages to rotate (1-based). Every page when omitted. */
  ranges?: PageRange[];
}

export interface RotateResult {
  bytes: Uint8Array;
  rotatedPages: number;
  totalPages: number;
}

export async function rotatePdf(payload: RotatePayload, onProgress?: (value: number) => void): Promise<RotateResult> {
  const doc = await loadPdfDocument(new Uint8Array(payload.file));
  const pages = doc.getPages();
  const targets = payload.ranges ? new Set(expandRanges(payload.ranges)) : null;
  let rotatedPages = 0;

  pages.forEach((page, index) => {
    if (targets && !targets.has(index + 1)) return;
    page.setRotation(degrees(normalizeRotation(page.getRotation().angle + payload.angle)));
    rotatedPages += 1;
  });

  stampProducer(doc);
  onProgress?.(0.5);
  const bytes = await doc.save({ useObjectStreams: true });
  onProgress?.(1);
  return { bytes, rotatedPages, totalPages: pages.length };
}
