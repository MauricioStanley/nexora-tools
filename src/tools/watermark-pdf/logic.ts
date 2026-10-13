/**
 * Watermark PDF — pure processing logic (worker + Node tests).
 * Text is drawn with a standard font (nothing embedded) on top of every page.
 */
import { ToolFailure } from '@/lib/errors';
import { centeredTextOrigin, displaySize, normalizeRotation, toUserAngle, toUserSpace } from '@/lib/pdf/geometry';
import { loadPdfDocument, stampProducer } from '@/lib/pdf/load';
import { StandardFonts, degrees, rgb } from '@/lib/pdf/pdf-lib';
import { unsupportedChars } from '@/lib/pdf/winansi';
import { parseHexColor, planStamps, WATERMARK_MAX_LENGTH, type WatermarkLayout } from './layout';

export interface WatermarkPayload {
  file: ArrayBuffer;
  text: string;
  layout: WatermarkLayout;
  /** Points. Single stamps shrink below this to fit the page. */
  fontSize: number;
  /** 0..1 */
  opacity: number;
  /** #rrggbb */
  color: string;
}

export interface WatermarkResult {
  bytes: Uint8Array;
  pages: number;
}

export async function watermarkPdf(payload: WatermarkPayload, onProgress?: (value: number) => void): Promise<WatermarkResult> {
  const text = payload.text.trim();
  if (!text || text.length > WATERMARK_MAX_LENGTH || unsupportedChars(text).length > 0) throw new ToolFailure('input_required');

  const doc = await loadPdfDocument(new Uint8Array(payload.file));
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const widthAt1 = font.widthOfTextAtSize(text, 1);
  const heightAt1 = font.heightAtSize(1, { descender: false });
  const { r, g, b } = parseHexColor(payload.color);
  const color = rgb(r, g, b);
  const opacity = Math.min(1, Math.max(0.05, payload.opacity));
  const pages = doc.getPages();

  pages.forEach((page, index) => {
    const rotation = normalizeRotation(page.getRotation().angle);
    const box = page.getCropBox();
    for (const stamp of planStamps(displaySize(box, rotation), payload.layout, widthAt1, payload.fontSize)) {
      const origin = centeredTextOrigin(stamp.center, widthAt1 * stamp.size, heightAt1 * stamp.size, stamp.angle);
      const at = toUserSpace(box, rotation, origin);
      page.drawText(text, {
        x: at.x,
        y: at.y,
        size: stamp.size,
        font,
        color,
        opacity,
        rotate: degrees(toUserAngle(rotation, stamp.angle)),
      });
    }
    if (index % 10 === 0) onProgress?.((0.7 * (index + 1)) / pages.length);
  });

  stampProducer(doc);
  onProgress?.(0.8);
  const bytes = await doc.save({ useObjectStreams: true });
  onProgress?.(1);
  return { bytes, pages: pages.length };
}
