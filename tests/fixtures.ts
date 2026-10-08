/** Test fixtures generated on the fly (no binary files committed). */
import { PDFDocument, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';

export async function makePdf(pages: number, label = 'Page'): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= pages; i++) {
    const page = doc.addPage([400, 500]);
    page.drawText(`${label} ${i}`, { x: 40, y: 440, size: 24, font });
  }
  return doc.save();
}

export function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.slice().buffer as ArrayBuffer;
}

/** A photo-like (noisy) JPEG, which compresses meaningfully when re-encoded. */
export async function noisyJpeg(width: number, height: number, quality = 95): Promise<Uint8Array> {
  const buffer = await sharp({
    create: { width, height, channels: 3, background: '#808080', noise: { type: 'gaussian', mean: 128, sigma: 40 } },
  })
    .jpeg({ quality })
    .toBuffer();
  return new Uint8Array(buffer);
}

export async function solidPng(width: number, height: number): Promise<Uint8Array> {
  return new Uint8Array(await sharp({ create: { width, height, channels: 4, background: '#22aaee' } }).png().toBuffer());
}
