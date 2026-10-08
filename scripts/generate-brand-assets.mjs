// Generates brand raster assets from SVG sources (run manually: `npm run assets:brand`).
// Outputs are committed to public/, so production builds never depend on sharp.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');

const BG = '#0a0c0f';
const MARK_PATHS = `
  <path d="M10.5 21.5v-11l11 11v-11" fill="none" stroke="url(#g)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="10.5" cy="10.5" r="2.1" fill="#74E6FB"/>
  <circle cx="21.5" cy="21.5" r="2.1" fill="#5B8CFF"/>`;
const GRADIENT = `<linearGradient id="g" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="#74E6FB"/><stop offset="1" stop-color="#5B8CFF"/></linearGradient>`;

/** Favicon / app icon: mark on a graphite tile. */
function markSvg({ size = 32, padding = 0, radius = 9 } = {}) {
  const inner = 32 - padding * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <defs>${GRADIENT}</defs>
  <rect width="32" height="32" rx="${radius}" fill="#12161b"/>
  <rect x="0.5" y="0.5" width="31" height="31" rx="${radius - 0.5}" fill="none" stroke="#333c48" stroke-width="1"/>
  <g transform="translate(${padding} ${padding}) scale(${inner / 32})">${MARK_PATHS}</g>
</svg>`;
}

const OG_COPY = {
  en: { tagline: ['Fast, private tools', 'for everyday files.'], chips: ['Merge PDF', 'Compress images', 'QR codes', 'No uploads'] },
  es: { tagline: ['Herramientas rápidas y', 'privadas para tus archivos.'], chips: ['Unir PDF', 'Comprimir imágenes', 'Códigos QR', 'Sin subidas'] },
};

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function ogSvg(locale) {
  const copy = OG_COPY[locale];
  const font = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
  let x = 96;
  const chips = copy.chips
    .map((label) => {
      const width = Math.round(label.length * 12.5 + 44);
      const chip = `<g transform="translate(${x} 500)">
        <rect width="${width}" height="48" rx="24" fill="#171c22" stroke="#333c48"/>
        <text x="${width / 2}" y="31" text-anchor="middle" font-family="${font}" font-size="21" fill="#a3adba">${escape(label)}</text>
      </g>`;
      x += width + 14;
      return chip;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    ${GRADIENT}
    <radialGradient id="glow" cx="18%" cy="0%" r="70%"><stop offset="0" stop-color="#38d7f5" stop-opacity="0.22"/><stop offset="1" stop-color="#38d7f5" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow2" cx="90%" cy="40%" r="50%"><stop offset="0" stop-color="#5b8cff" stop-opacity="0.16"/><stop offset="1" stop-color="#5b8cff" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.045"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <g transform="translate(96 96) scale(2.6)">
    <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="9" fill="#171c22" stroke="#333c48"/>
    ${MARK_PATHS}
  </g>
  <text x="200" y="146" font-family="${font}" font-size="46" font-weight="600" fill="#edf1f5">Nexora <tspan font-weight="400" fill="#a3adba">Tools</tspan></text>
  <text x="200" y="182" font-family="${font}" font-size="22" fill="#808b99">by Codywork</text>
  ${copy.tagline
    .map((line, i) => `<text x="96" y="${300 + i * 74}" font-family="${font}" font-size="64" font-weight="600" letter-spacing="-2" fill="#edf1f5">${escape(line)}</text>`)
    .join('')}
  <text x="96" y="450" font-family="${font}" font-size="26" fill="#5fe0f8">tools.codywork.com</text>
  ${chips}
</svg>`;
}

async function png(svg, file, size) {
  const target = path.join(pub, file);
  await mkdir(path.dirname(target), { recursive: true });
  let pipeline = sharp(Buffer.from(svg), { density: 300 });
  if (size) pipeline = pipeline.resize(size, size);
  await pipeline.png({ compressionLevel: 9 }).toFile(target);
  console.log('wrote', file);
}

await mkdir(path.join(pub, 'brand'), { recursive: true });
await writeFile(path.join(pub, 'favicon.svg'), markSvg());
await writeFile(path.join(pub, 'brand', 'nexora-mark.svg'), markSvg({ size: 256 }));
console.log('wrote favicon.svg, brand/nexora-mark.svg');

await png(markSvg({ size: 512 }), 'favicon-32.png', 32);
await png(markSvg({ size: 512, radius: 0 }), 'apple-touch-icon.png', 180);
await png(markSvg({ size: 512 }), 'icon-192.png', 192);
await png(markSvg({ size: 512 }), 'icon-512.png', 512);
// Maskable icons need a safe zone: shrink the mark and use a full-bleed background.
await png(markSvg({ size: 512, padding: 6, radius: 0 }), 'icon-512-maskable.png', 512);

for (const locale of Object.keys(OG_COPY)) {
  const target = path.join(pub, 'og', `nexora-${locale}.png`);
  await mkdir(path.dirname(target), { recursive: true });
  await sharp(Buffer.from(ogSvg(locale))).png({ compressionLevel: 9 }).toFile(target);
  console.log('wrote', `og/nexora-${locale}.png`);
}
