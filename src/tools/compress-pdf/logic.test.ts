import { PDFDict, PDFDocument, PDFName, PDFNumber, PDFRawStream } from 'pdf-lib';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { noisyJpeg, toArrayBuffer } from '../../../tests/fixtures';
import { isRecompressibleJpeg, optimizePdf, removeUnreachableObjects, type ImageRecoder } from './logic';

/** Node stand-in for the browser recoder, using sharp. */
const sharpRecoder: ImageRecoder = {
  async recodeJpeg(bytes, { quality, maxDimension }) {
    const buffer = await sharp(Buffer.from(bytes))
      .resize({ width: maxDimension, height: maxDimension, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: Math.round(quality * 100) })
      .toBuffer({ resolveWithObject: true });
    return { bytes: new Uint8Array(buffer.data), width: buffer.info.width, height: buffer.info.height };
  },
};

async function pdfWithPhoto(width = 2400, height = 1600) {
  const doc = await PDFDocument.create();
  doc.setTitle('Secret title');
  doc.setAuthor('Jane Doe');
  const image = await doc.embedJpg(await noisyJpeg(width, height));
  const page = doc.addPage([600, 400]);
  page.drawImage(image, { x: 0, y: 0, width: 600, height: 400 });
  return doc.save();
}

function images(doc: PDFDocument) {
  return doc.context
    .enumerateIndirectObjects()
    .map(([, obj]) => obj)
    .filter((obj): obj is PDFRawStream => obj instanceof PDFRawStream && obj.dict.lookup(PDFName.of('Subtype')) === PDFName.of('Image'));
}

describe('optimizePdf', () => {
  it('recompresses and downsamples embedded JPEGs without touching page count', async () => {
    const original = await pdfWithPhoto();
    const result = await optimizePdf({ file: toArrayBuffer(original), level: 'strong', removeMetadata: true }, sharpRecoder);

    expect(result.imagesFound).toBe(1);
    expect(result.imagesOptimized).toBe(1);
    expect(result.bytes.length).toBeLessThan(original.length * 0.6);

    const out = await PDFDocument.load(result.bytes);
    expect(out.getPageCount()).toBe(1);
    const [image] = images(out);
    expect((image!.dict.lookup(PDFName.of('Width')) as PDFNumber).asNumber()).toBe(1500);
    expect((image!.dict.lookup(PDFName.of('Height')) as PDFNumber).asNumber()).toBe(1000);
  });

  it('removes document metadata when asked', async () => {
    const result = await optimizePdf({ file: toArrayBuffer(await pdfWithPhoto(400, 300)), level: 'light', removeMetadata: true }, sharpRecoder);
    const out = await PDFDocument.load(result.bytes, { updateMetadata: false });
    expect(out.getTitle()).toBeUndefined();
    expect(out.getAuthor()).toBeUndefined();
  });

  it('keeps metadata when not asked to remove it', async () => {
    const result = await optimizePdf({ file: toArrayBuffer(await pdfWithPhoto(400, 300)), level: 'light', removeMetadata: false }, sharpRecoder);
    const out = await PDFDocument.load(result.bytes, { updateMetadata: false });
    expect(out.getTitle()).toBe('Secret title');
  });

  it('keeps images the recoder cannot decode', async () => {
    const failing: ImageRecoder = { recodeJpeg: async () => null };
    const original = await pdfWithPhoto(800, 600);
    const result = await optimizePdf({ file: toArrayBuffer(original), level: 'recommended', removeMetadata: false }, failing);
    expect(result.imagesOptimized).toBe(0);
    expect(images(await PDFDocument.load(result.bytes))).toHaveLength(1);
  });
});

describe('PDF structure helpers', () => {
  it('drops unreachable objects', async () => {
    const doc = await PDFDocument.create();
    doc.addPage();
    const orphan = doc.context.register(doc.context.obj({ Leftover: 'true' }));
    expect(doc.context.lookup(orphan)).toBeDefined();
    const removed = removeUnreachableObjects(doc.context);
    expect(removed).toBeGreaterThanOrEqual(1);
    expect(doc.context.lookup(orphan)).toBeUndefined();
    expect(doc.getPageCount()).toBe(1);
  });

  it('only recompresses plain RGB/Gray 8-bit JPEGs', async () => {
    const doc = await PDFDocument.create();
    const dict = (entries: Record<string, unknown>) => doc.context.obj(entries as never) as unknown as PDFDict;
    expect(isRecompressibleJpeg(dict({ Subtype: 'Image', Filter: 'DCTDecode', ColorSpace: 'DeviceRGB', BitsPerComponent: 8 }))).toBe(true);
    expect(isRecompressibleJpeg(dict({ Subtype: 'Image', Filter: 'DCTDecode', ColorSpace: 'DeviceCMYK', BitsPerComponent: 8 }))).toBe(false);
    expect(isRecompressibleJpeg(dict({ Subtype: 'Image', Filter: 'FlateDecode', ColorSpace: 'DeviceRGB', BitsPerComponent: 8 }))).toBe(false);
    expect(isRecompressibleJpeg(dict({ Subtype: 'Image', Filter: 'DCTDecode', ColorSpace: 'DeviceGray', Decode: [1, 0] }))).toBe(false);
  });
});
