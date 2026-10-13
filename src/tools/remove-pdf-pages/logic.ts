/**
 * Remove PDF pages — pure processing logic (worker + Node tests).
 * Pages are dropped from the original document, so its metadata and the remaining pages
 * are kept untouched.
 */
import { ToolFailure } from '@/lib/errors';
import { loadPdfDocument, stampProducer } from '@/lib/pdf/load';
import { expandRanges, type PageRange } from '@/lib/pdf/ranges';

export interface RemovePagesPayload {
  file: ArrayBuffer;
  /** Pages to delete (1-based). */
  ranges: PageRange[];
}

export interface RemovePagesResult {
  bytes: Uint8Array;
  removedPages: number;
  remainingPages: number;
}

/** Distinct pages to delete, valid for a document of `pageCount` pages. */
export function pagesToRemove(ranges: readonly PageRange[], pageCount: number): number[] {
  return [...new Set(expandRanges(ranges))].filter((page) => page >= 1 && page <= pageCount);
}

export async function removePdfPages(payload: RemovePagesPayload, onProgress?: (value: number) => void): Promise<RemovePagesResult> {
  const doc = await loadPdfDocument(new Uint8Array(payload.file));
  const total = doc.getPageCount();
  const remove = pagesToRemove(payload.ranges, total);
  if (remove.length === 0 || remove.length >= total) throw new ToolFailure('invalid_range');

  // Highest index first, so earlier indices stay valid while removing.
  remove.sort((a, b) => b - a).forEach((page) => doc.removePage(page - 1));
  stampProducer(doc);
  onProgress?.(0.5);
  const bytes = await doc.save({ useObjectStreams: true });
  onProgress?.(1);
  return { bytes, removedPages: remove.length, remainingPages: total - remove.length };
}
