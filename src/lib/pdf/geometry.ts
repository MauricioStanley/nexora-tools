/**
 * Page geometry for drawing on existing PDFs.
 *
 * Positions are computed in "display space" (the page as a viewer shows it, after its
 * /Rotate entry, origin at the visual bottom-left) and then mapped to PDF user space, so
 * stamps land where the reader expects them even on rotated or offset pages.
 */
export type PageRotation = 0 | 90 | 180 | 270;

export interface PageBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export type Anchor = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export function normalizeRotation(angle: number): PageRotation {
  return ((((Math.round(angle / 90) * 90) % 360) + 360) % 360) as PageRotation;
}

export function displaySize(box: PageBox, rotation: PageRotation): { width: number; height: number } {
  return rotation === 90 || rotation === 270 ? { width: box.height, height: box.width } : { width: box.width, height: box.height };
}

/** Map a display-space point to PDF user space. */
export function toUserSpace(box: PageBox, rotation: PageRotation, point: Point): Point {
  const { width: w, height: h } = box;
  const { x: dx, y: dy } = point;
  let ux = dx;
  let uy = dy;
  if (rotation === 90) {
    ux = w - dy;
    uy = dx;
  } else if (rotation === 180) {
    ux = w - dx;
    uy = h - dy;
  } else if (rotation === 270) {
    ux = dy;
    uy = h - dx;
  }
  return { x: box.x + ux, y: box.y + uy };
}

/** Counter-clockwise angle (degrees) in user space for text that reads at `displayAngle` on screen. */
export function toUserAngle(rotation: PageRotation, displayAngle: number): number {
  return (((displayAngle + rotation) % 360) + 360) % 360;
}

/** Baseline origin of a `width` × `height` text box whose center sits on `center`, rotated `angle`° counter-clockwise. */
export function centeredTextOrigin(center: Point, width: number, height: number, angle: number): Point {
  const a = (angle * Math.PI) / 180;
  const ox = -width / 2;
  const oy = -height / 2;
  return {
    x: center.x + ox * Math.cos(a) - oy * Math.sin(a),
    y: center.y + ox * Math.sin(a) + oy * Math.cos(a),
  };
}

/** Baseline origin (display space, unrotated text) for a label pinned to a page corner or edge. */
export function anchoredTextOrigin(
  page: { width: number; height: number },
  anchor: Anchor,
  textWidth: number,
  textHeight: number,
  margin: number,
): Point {
  const [vertical, horizontal] = anchor.split('-') as ['top' | 'bottom', 'left' | 'center' | 'right'];
  const x = horizontal === 'left' ? margin : horizontal === 'right' ? page.width - margin - textWidth : (page.width - textWidth) / 2;
  const y = vertical === 'bottom' ? margin : page.height - margin - textHeight;
  return { x, y };
}
