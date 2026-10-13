import type { Size } from './resize';

/** Clockwise quarter turns. */
export type QuarterTurn = 0 | 90 | 180 | 270;

/** Rotation followed by mirroring, both as seen on screen. */
export interface ImageTransform {
  rotate: QuarterTurn;
  flipH: boolean;
  flipV: boolean;
}

export function isIdentityTransform(t: ImageTransform): boolean {
  return t.rotate === 0 && !t.flipH && !t.flipV;
}

export function rotatedSize(size: Size, rotate: QuarterTurn): Size {
  return rotate === 90 || rotate === 270 ? { width: size.height, height: size.width } : { width: size.width, height: size.height };
}

/** CSS equivalent, for previews. Must match `applyTransform`. */
export function cssTransform(t: ImageTransform): string {
  return `scale(${t.flipH ? -1 : 1}, ${t.flipV ? -1 : 1}) rotate(${t.rotate}deg)`;
}

/**
 * Set up `ctx` so that drawing a `draw`-sized image at (0, 0) fills an `out`-sized canvas with
 * the rotated and mirrored result.
 */
export function applyTransform(ctx: CanvasRenderingContext2D, t: ImageTransform, out: Size, draw: Size): void {
  ctx.translate(out.width / 2, out.height / 2);
  ctx.scale(t.flipH ? -1 : 1, t.flipV ? -1 : 1);
  ctx.rotate((t.rotate * Math.PI) / 180);
  ctx.translate(-draw.width / 2, -draw.height / 2);
}
