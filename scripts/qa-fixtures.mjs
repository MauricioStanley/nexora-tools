// QA helper: writes sample files to dist/__qa/ for manual/browser testing of tools after `npm run build`.
// Never shipped: run it only against a local build (npm run preview), then rebuild before deploying.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import sharp from 'sharp';
const out = path.resolve('dist/__qa');
await mkdir(out, { recursive: true });
async function pdf(pages, label) {
  const doc = await PDFDocument.create(); const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= pages; i++) { const p = doc.addPage([595, 842]); p.drawText(`${label} — page ${i}`, { x: 60, y: 760, size: 28, font, color: rgb(0.1,0.2,0.5) }); }
  return doc.save();
}
await writeFile(path.join(out, 'contract.pdf'), await pdf(3, 'Contract'));
await writeFile(path.join(out, 'annex.pdf'), await pdf(2, 'Annex'));
const photo = await sharp({ create: { width: 3000, height: 2000, channels: 3, background: '#808080', noise: { type: 'gaussian', mean: 128, sigma: 40 } } }).jpeg({ quality: 95 }).toBuffer();
const photoDoc = await PDFDocument.create(); const img = await photoDoc.embedJpg(photo); const pg = photoDoc.addPage([600, 400]); pg.drawImage(img, { x: 0, y: 0, width: 600, height: 400 });
await writeFile(path.join(out, 'scan.pdf'), await photoDoc.save());
// Portrait phone photo stored landscape with EXIF orientation 6 + fake GPS-ish metadata
await writeFile(path.join(out, 'phone.jpg'), await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#cc5533' } }).composite([{ input: Buffer.from('<svg width="1200" height="800"><rect x="0" y="0" width="300" height="800" fill="#113355"/></svg>'), top: 0, left: 0 }]).jpeg({ quality: 92 }).withMetadata({ orientation: 6 }).toBuffer());
await writeFile(path.join(out, 'photo.jpg'), photo);
await writeFile(path.join(out, 'logo.png'), await sharp({ create: { width: 640, height: 480, channels: 4, background: { r: 30, g: 160, b: 230, alpha: 0.6 } } }).png().toBuffer());
await writeFile(path.join(out, 'image.webp'), await sharp({ create: { width: 800, height: 600, channels: 4, background: { r: 200, g: 40, b: 90, alpha: 0.5 } } }).webp({ quality: 80 }).toBuffer());
await writeFile(path.join(out, 'fake.pdf'), 'MZ this is not a pdf');
console.log('fixtures ready');
