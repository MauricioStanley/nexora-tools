import { ToolFailure } from '@/lib/errors';
import { PDFDocument } from './pdf-lib';

/**
 * Load a PDF with pdf-lib and translate failures into user-facing codes.
 * Encrypted PDFs are refused: pdf-lib cannot decrypt, and copying encrypted content streams
 * would silently produce blank or garbled pages.
 */
export async function loadPdfDocument(bytes: Uint8Array, fileIndex?: number): Promise<PDFDocument> {
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(bytes, { updateMetadata: false, throwOnInvalidObject: false });
  } catch (error) {
    const name = (error as { name?: string } | null)?.name;
    if (name === 'EncryptedPDFError') throw new ToolFailure('encrypted_pdf', { fileIndex }, error);
    throw new ToolFailure('corrupt_pdf', { fileIndex }, error);
  }
  if (doc.getPageCount() === 0) throw new ToolFailure('no_pages', { fileIndex });
  return doc;
}

/** Standard metadata for documents Nexora creates (no personal data). */
export function stampProducer(doc: PDFDocument): void {
  doc.setProducer('Nexora Tools');
  doc.setCreator('Nexora Tools (tools.codywork.com)');
}
