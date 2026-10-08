/**
 * PDF → JPG rendering with PDF.js (main thread canvas; PDF.js parses in its own worker).
 * Loaded on demand only. Each page's canvas is released immediately after encoding.
 */
import { ToolFailure, throwIfAborted } from '@/lib/errors';
import { yieldToMain } from '@/lib/files/read';
import { createCanvas, get2dContext, getCanvasLimits, releaseCanvas } from '@/lib/image/canvas';
import { encodeCanvas } from '@/lib/image/encode';
import { fitWithinLimits } from '@/lib/image/resize';
import { openPdfForRendering } from '@/lib/pdf/pdfjs';

import { MAX_RENDER_PAGES } from './limits';

export { MAX_RENDER_PAGES };

export async function countPdfPages(file: Blob): Promise<number> {
  const opened = await openPdfForRendering(new Uint8Array(await file.arrayBuffer()));
  try {
    return opened.doc.numPages;
  } finally {
    await opened.close();
  }
}

export interface RenderedPage {
  page: number;
  blob: Blob;
  width: number;
  height: number;
}

export async function renderPdfPages(
  file: Blob,
  pages: number[],
  options: { dpi: number; quality: number },
  context: { signal: AbortSignal; onPage: (index: number, total: number) => void },
): Promise<{ pages: RenderedPage[]; limitedPages: number }> {
  if (pages.length > MAX_RENDER_PAGES) throw new ToolFailure('too_many_pages', { vars: { count: MAX_RENDER_PAGES } });
  const opened = await openPdfForRendering(new Uint8Array(await file.arrayBuffer()));
  const limits = getCanvasLimits();
  const output: RenderedPage[] = [];
  let limitedPages = 0;
  try {
    for (let i = 0; i < pages.length; i++) {
      throwIfAborted(context.signal);
      context.onPage(i, pages.length);
      const number = pages[i]!;
      if (number < 1 || number > opened.doc.numPages) throw new ToolFailure('invalid_range');
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
        output.push({ page: number, blob, width: canvas.width, height: canvas.height });
      } finally {
        releaseCanvas(canvas);
        page.cleanup();
      }
      await yieldToMain();
    }
    return { pages: output, limitedPages };
  } finally {
    await opened.close();
  }
}
