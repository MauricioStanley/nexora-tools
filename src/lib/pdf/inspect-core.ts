/** Worker/fallback implementation of PDF inspection. Imports pdf-lib — never import statically from UI code. */
import type { FailureCode } from '@/lib/errors';
import { toFailure } from '@/lib/errors';
import { loadPdfDocument } from './load';

export interface PdfInspection {
  pageCount: number | null;
  problem: Extract<FailureCode, 'encrypted_pdf' | 'corrupt_pdf' | 'no_pages'> | null;
}

export interface InspectPayload {
  files: ArrayBuffer[];
}

export async function inspectBuffers(buffers: ArrayBuffer[]): Promise<PdfInspection[]> {
  const results: PdfInspection[] = [];
  for (const buffer of buffers) {
    try {
      const doc = await loadPdfDocument(new Uint8Array(buffer));
      results.push({ pageCount: doc.getPageCount(), problem: null });
    } catch (error) {
      const code = toFailure(error).code;
      results.push({
        pageCount: null,
        problem: code === 'encrypted_pdf' || code === 'no_pages' ? code : 'corrupt_pdf',
      });
    }
  }
  return results;
}
