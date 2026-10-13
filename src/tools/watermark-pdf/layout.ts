/**
 * Where watermark stamps go on a page, in display space (origin at the visual bottom-left,
 * angles counter-clockwise). Shared by the PDF logic and the live preview, so both agree.
 */
export type WatermarkLayout = 'diagonal' | 'horizontal' | 'tiled';

export interface Stamp {
  center: { x: number; y: number };
  /** Degrees, counter-clockwise. */
  angle: number;
  size: number;
}

const TILE_ANGLE = 30;

/**
 * @param widthAt1 Text width at a font size of 1.
 * @param maxSize Requested size; single stamps shrink so they never run off the page.
 */
export function planStamps(page: { width: number; height: number }, layout: WatermarkLayout, widthAt1: number, maxSize: number): Stamp[] {
  const { width: w, height: h } = page;
  const center = { x: w / 2, y: h / 2 };
  if (widthAt1 <= 0 || maxSize <= 0) return [];

  if (layout === 'diagonal') {
    const angle = (Math.atan2(h, w) * 180) / Math.PI;
    return [{ center, angle, size: Math.min(maxSize, (0.8 * Math.hypot(w, h)) / widthAt1) }];
  }
  if (layout === 'horizontal') {
    return [{ center, angle: 0, size: Math.min(maxSize, (0.85 * w) / widthAt1) }];
  }

  const size = Math.min(maxSize, (0.6 * Math.min(w, h)) / widthAt1);
  const textWidth = widthAt1 * size;
  const stepX = textWidth + size * 3;
  const stepY = size * 4.5;
  const radius = Math.hypot(w, h) / 2 + textWidth;
  const cols = Math.ceil(radius / stepX) + 1;
  const rows = Math.ceil(radius / stepY) + 1;
  const a = (TILE_ANGLE * Math.PI) / 180;
  const stamps: Stamp[] = [];
  for (let row = -rows; row <= rows; row++) {
    const offset = row % 2 === 0 ? 0 : stepX / 2;
    for (let col = -cols; col <= cols; col++) {
      const x = col * stepX + offset;
      const y = row * stepY;
      const point = { x: center.x + x * Math.cos(a) - y * Math.sin(a), y: center.y + x * Math.sin(a) + y * Math.cos(a) };
      const reach = textWidth / 2;
      if (point.x < -reach || point.x > w + reach || point.y < -reach || point.y > h + reach) continue;
      stamps.push({ center: point, angle: TILE_ANGLE, size });
    }
  }
  return stamps;
}

export function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!m) return { r: 0.5, g: 0.5, b: 0.5 };
  return { r: parseInt(m[1]!, 16) / 255, g: parseInt(m[2]!, 16) / 255, b: parseInt(m[3]!, 16) / 255 };
}

export const WATERMARK_MAX_LENGTH = 60;
