/**
 * Merge PDF — pure processing logic (no DOM). Runs in a Web Worker in the browser and in
 * Node for tests, so it can later back an API endpoint unchanged.
 */
import { loadPdfDocument, stampProducer } from '@/lib/pdf/load';
import { PDFDocument } from '@/lib/pdf/pdf-lib';

export interface MergePayload {
  files: ArrayBuffer[];
}

export interface MergeResult {
  bytes: Uint8Array;
  pageCount: number;
}

export async function mergePdfs(payload: MergePayload, onProgress?: (value: number) => void): Promise<MergeResult> {
  const output = await PDFDocument.create();
  stampProducer(output);
  const total = payload.files.length;

  for (let index = 0; index < total; index++) {
    const source = await loadPdfDocument(new Uint8Array(payload.files[index]!), index);
    const pages = await output.copyPages(source, source.getPageIndices());
    for (const page of pages) output.addPage(page);
    onProgress?.(((index + 1) / total) * 0.9);
  }

  onProgress?.(0.92);
  const bytes = await output.save({ useObjectStreams: true });
  onProgress?.(1);
  return { bytes, pageCount: output.getPageCount() };
}
