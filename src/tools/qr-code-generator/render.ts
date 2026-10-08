/** QR rendering helpers: matrix → SVG path / SVG document / PNG. Colors are validated hex. */
import { encode } from 'uqr';

export type Ecc = 'L' | 'M' | 'Q' | 'H';

export interface QrMatrix {
  modules: boolean[][];
  size: number;
}

export type EncodeResult = { ok: true; matrix: QrMatrix } | { ok: false; error: 'too_long' };

export function encodeQr(value: string, ecc: Ecc): EncodeResult {
  try {
    const result = encode(value, { ecc, border: 0 });
    return { ok: true, matrix: { modules: result.data, size: result.size } };
  } catch {
    return { ok: false, error: 'too_long' };
  }
}

const HEX = /^#[0-9a-f]{6}$/i;

export function safeColor(value: string, fallback: string): string {
  return HEX.test(value) ? value.toLowerCase() : fallback;
}

/** One path for all dark modules; horizontal runs are merged to keep the SVG small. */
export function qrPath(modules: boolean[][], margin: number): string {
  const parts: string[] = [];
  modules.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x += 1;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run]) run += 1;
      parts.push(`M${x + margin} ${y + margin}h${run}v1h-${run}z`);
      x += run;
    }
  });
  return parts.join('');
}

export interface RenderOptions {
  margin: number;
  foreground: string;
  background: string;
  /** Output size in px (PNG) or width/height attribute (SVG). */
  size: number;
}

export function qrSvgDocument(matrix: QrMatrix, options: RenderOptions): string {
  const total = matrix.size + options.margin * 2;
  const fg = safeColor(options.foreground, '#000000');
  const bg = safeColor(options.background, '#ffffff');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${options.size}" height="${options.size}" shape-rendering="crispEdges">`,
    `<rect width="${total}" height="${total}" fill="${bg}"/>`,
    `<path fill="${fg}" d="${qrPath(matrix.modules, options.margin)}"/>`,
    '</svg>',
    '',
  ].join('\n');
}

/** Crisp PNG: integer pixels per module (final size ≤ requested size). */
export async function qrPngBlob(matrix: QrMatrix, options: RenderOptions): Promise<Blob> {
  const total = matrix.size + options.margin * 2;
  const scale = Math.max(1, Math.floor(options.size / total));
  const px = scale * total;
  const canvas = document.createElement('canvas');
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas unavailable');
  ctx.fillStyle = safeColor(options.background, '#ffffff');
  ctx.fillRect(0, 0, px, px);
  ctx.fillStyle = safeColor(options.foreground, '#000000');
  matrix.modules.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x += 1;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run]) run += 1;
      ctx.fillRect((x + options.margin) * scale, (y + options.margin) * scale, run * scale, scale);
      x += run;
    }
  });
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  canvas.width = 0;
  canvas.height = 0;
  if (!blob) throw new Error('png encoding failed');
  return blob;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colors (1..21). */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(safeColor(a, '#000000'));
  const lb = luminance(safeColor(b, '#ffffff'));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** True when the code is lighter than its background (unsupported by some scanners). */
export function isInverted(foreground: string, background: string): boolean {
  return luminance(safeColor(foreground, '#000000')) > luminance(safeColor(background, '#ffffff'));
}
