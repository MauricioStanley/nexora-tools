/**
 * Lazy loader for PDF.js (Mozilla, Apache-2.0) — used only by tools that must *render*
 * pages (PDF to JPG, and the "convert pages to images" mode of Compress PDF).
 * Nothing here is imported until the user starts such a task.
 *
 * The legacy build is used for broader Safari/iOS compatibility. Font, CMap, ICC and WASM
 * assets are copied to /vendor/pdfjs/ by scripts/copy-pdfjs-assets.mjs (same origin, CSP-safe).
 */
import { ToolFailure } from '@/lib/errors';

type PdfjsModule = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
export type PdfjsDocument = Awaited<ReturnType<PdfjsModule['getDocument']>['promise']>;

const VENDOR_BASE = '/vendor/pdfjs/';

let pdfjsPromise: Promise<PdfjsModule> | null = null;

export function loadPdfjs(): Promise<PdfjsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const [lib, worker] = await Promise.all([
        import('pdfjs-dist/legacy/build/pdf.mjs'),
        import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
      ]);
      lib.GlobalWorkerOptions.workerSrc = worker.default;
      return lib;
    })().catch((error) => {
      pdfjsPromise = null;
      throw new ToolFailure('worker_failed', {}, error);
    });
  }
  return pdfjsPromise;
}

export interface OpenedPdf {
  doc: PdfjsDocument;
  close(): Promise<void>;
}

/**
 * Open a PDF for rendering. Note: PDF.js transfers `bytes` to its worker (the buffer is
 * detached afterwards) — pass a copy if the caller still needs the data.
 */
export async function openPdfForRendering(bytes: Uint8Array): Promise<OpenedPdf> {
  const pdfjs = await loadPdfjs();
  const task = pdfjs.getDocument({
    data: bytes,
    cMapUrl: `${VENDOR_BASE}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${VENDOR_BASE}standard_fonts/`,
    wasmUrl: `${VENDOR_BASE}wasm/`,
    iccUrl: `${VENDOR_BASE}iccs/`,
    enableXfa: false,
    stopAtErrors: false,
  });
  try {
    const doc = await task.promise;
    return {
      doc,
      close: async () => {
        await task.destroy();
      },
    };
  } catch (error) {
    await task.destroy().catch(() => undefined);
    const name = (error as { name?: string } | null)?.name;
    if (name === 'PasswordException') throw new ToolFailure('encrypted_pdf', {}, error);
    throw new ToolFailure('corrupt_pdf', {}, error);
  }
}
