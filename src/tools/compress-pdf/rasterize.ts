/**
 * "Convert pages to images" mode: renders each page with PDF.js and rebuilds the PDF from
 * JPEGs. Strongest reduction for scans; removes selectable text by design (clearly disclosed).
 * Loaded on demand only — PDF.js never ships with the default compression path.
 */
import { ToolFailure, throwIfAborted } from '@/lib/errors';
import { createCanvas, get2dContext, getCanvasLimits, releaseCanvas } from '@/lib/image/canvas';
import { encodeCanvas } from '@/lib/image/encode';
import { fitWithinLimits } from '@/lib/image/resize';
import { stampProducer } from '@/lib/pdf/load';
import { PDFDocument } from '@/lib/pdf/pdf-lib';
import { openPdfForRendering } from '@/lib/pdf/pdfjs';

export const MAX_RASTER_PAGES = 300;

export interface RasterizeResult {
  bytes: Uint8Array;
  pageCount: number;
  limitedPages: number;
}

export async function rasterizePdf(
  file: Blob,
  options: { dpi: number; quality: number },
  context: { signal: AbortSignal; onProgress: (value: number, page: number, total: number) => void },
): Promise<RasterizeResult> {
  const data = new Uint8Array(await file.arrayBuffer());
  const opened = await openPdfForRendering(data);
  try {
    const total = opened.doc.numPages;
    if (total > MAX_RASTER_PAGES) throw new ToolFailure('too_many_pages', { vars: { count: MAX_RASTER_PAGES } });
    const output = await PDFDocument.create();
    stampProducer(output);
    const limits = getCanvasLimits();
    let limitedPages = 0;

    for (let number = 1; number <= total; number++) {
      throwIfAborted(context.signal);
      context.onProgress((number - 1) / total, number, total);
      const page = await opened.doc.getPage(number);
      const base = page.getViewport({ scale: 1 });
      let scale = options.dpi / 72;
      const fitted = fitWithinLimits({ width: base.width * scale, height: base.height * scale }, limits);
      if (fitted.limited) {
        scale = fitted.width / base.width;
        limitedPages += 1;
      }
      const viewport = page.getViewport({ scale });
      const canvas = createCanvas(Math.max(1, Math.floor(viewport.width)), Math.max(1, Math.floor(viewport.height)));
      try {
        const ctx = get2dContext(canvas, { alpha: false });
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: ctx, viewport, background: '#ffffff' }).promise;
        const blob = await encodeCanvas(canvas, 'image/jpeg', options.quality);
        const image = await output.embedJpg(new Uint8Array(await blob.arrayBuffer()));
        const pdfPage = output.addPage([base.width, base.height]);
        pdfPage.drawImage(image, { x: 0, y: 0, width: base.width, height: base.height });
      } finally {
        releaseCanvas(canvas);
        page.cleanup();
      }
    }

    context.onProgress(0.97, total, total);
    const bytes = await output.save({ useObjectStreams: true });
    return { bytes, pageCount: total, limitedPages };
  } finally {
    await opened.close();
  }
}
