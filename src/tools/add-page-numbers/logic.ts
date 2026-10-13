/**
 * Add page numbers — pure processing logic (worker + Node tests).
 * Numbers are drawn with a standard font (nothing embedded) on top of the existing content.
 */
import { ToolFailure } from '@/lib/errors';
import { anchoredTextOrigin, displaySize, normalizeRotation, toUserAngle, toUserSpace, type Anchor } from '@/lib/pdf/geometry';
import { loadPdfDocument, stampProducer } from '@/lib/pdf/load';
import { StandardFonts, degrees, rgb } from '@/lib/pdf/pdf-lib';
import { unsupportedChars } from '@/lib/pdf/winansi';
import { planLabels } from './labels';

export type NumberSize = 'small' | 'medium' | 'large';

const FONT_SIZES: Record<NumberSize, number> = { small: 9, medium: 11, large: 14 };

export interface PageNumbersPayload {
  file: ArrayBuffer;
  position: Anchor;
  /** Label with `{n}` for the number and optionally `{total}`. */
  template: string;
  start: number;
  /** Leave the first page (a cover) unnumbered; numbering begins on page 2. */
  skipFirst: boolean;
  size: NumberSize;
}

export interface PageNumbersResult {
  bytes: Uint8Array;
  numberedPages: number;
  totalPages: number;
}

export async function addPageNumbers(payload: PageNumbersPayload, onProgress?: (value: number) => void): Promise<PageNumbersResult> {
  if (!payload.template.includes('{n}') || unsupportedChars(payload.template).length > 0) throw new ToolFailure('input_required');

  const doc = await loadPdfDocument(new Uint8Array(payload.file));
  const pages = doc.getPages();
  const labels = planLabels(pages.length, payload.template, payload.start, payload.skipFirst);
  if (labels.every((label) => label === null)) throw new ToolFailure('input_required');

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const size = FONT_SIZES[payload.size];
  const height = font.heightAtSize(size, { descender: false });
  const color = rgb(0.13, 0.13, 0.13);
  let numberedPages = 0;

  pages.forEach((page, index) => {
    const text = labels[index];
    if (!text) return;
    const rotation = normalizeRotation(page.getRotation().angle);
    const box = page.getCropBox();
    const shown = displaySize(box, rotation);
    const margin = Math.max(18, Math.min(36, Math.min(shown.width, shown.height) * 0.05));
    const width = font.widthOfTextAtSize(text, size);
    const origin = toUserSpace(box, rotation, anchoredTextOrigin(shown, payload.position, width, height, margin));
    page.drawText(text, { x: origin.x, y: origin.y, size, font, color, rotate: degrees(toUserAngle(rotation, 0)) });
    numberedPages += 1;
    if (index % 20 === 0) onProgress?.((0.7 * (index + 1)) / pages.length);
  });

  stampProducer(doc);
  onProgress?.(0.8);
  const bytes = await doc.save({ useObjectStreams: true });
  onProgress?.(1);
  return { bytes, numberedPages, totalPages: pages.length };
}
