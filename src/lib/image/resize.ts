/** Pure geometry for image resizing (unit-tested, no DOM). */
export interface Size {
  width: number;
  height: number;
}

export type ResizeSpec =
  | { mode: 'none' }
  | { mode: 'percent'; percent: number }
  /** Fit inside a box, preserving aspect ratio. Either side may be omitted. */
  | { mode: 'fit'; width?: number; height?: number }
  /** Exact size (may distort). */
  | { mode: 'exact'; width: number; height: number }
  /** Downscale only, so the longest side is ≤ maxDimension. */
  | { mode: 'max'; maxDimension: number };

export const MAX_OUTPUT_SIDE = 20_000;

const clampSide = (value: number) => Math.min(MAX_OUTPUT_SIDE, Math.max(1, Math.round(value)));

export function computeTargetSize(source: Size, spec: ResizeSpec): Size {
  const { width: sw, height: sh } = source;
  switch (spec.mode) {
    case 'none':
      return { width: sw, height: sh };
    case 'percent': {
      const factor = Math.max(0.01, spec.percent / 100);
      return { width: clampSide(sw * factor), height: clampSide(sh * factor) };
    }
    case 'fit': {
      const w = spec.width && spec.width > 0 ? spec.width : undefined;
      const h = spec.height && spec.height > 0 ? spec.height : undefined;
      if (!w && !h) return { width: sw, height: sh };
      const scale = w && h ? Math.min(w / sw, h / sh) : w ? w / sw : h! / sh;
      return { width: clampSide(sw * scale), height: clampSide(sh * scale) };
    }
    case 'exact':
      return { width: clampSide(spec.width), height: clampSide(spec.height) };
    case 'max': {
      const longest = Math.max(sw, sh);
      if (longest <= spec.maxDimension) return { width: sw, height: sh };
      const scale = spec.maxDimension / longest;
      return { width: clampSide(sw * scale), height: clampSide(sh * scale) };
    }
  }
}

/** Given one side, compute the other preserving aspect ratio. */
export function proportionalSide(source: Size, known: 'width' | 'height', value: number): number {
  if (known === 'width') return clampSide((value / source.width) * source.height);
  return clampSide((value / source.height) * source.width);
}

export interface CanvasLimits {
  maxSide: number;
  maxArea: number;
}

/** Scale a size down (never up) to fit canvas limits. */
export function fitWithinLimits(size: Size, limits: CanvasLimits): Size & { limited: boolean } {
  let scale = 1;
  if (size.width > limits.maxSide || size.height > limits.maxSide) {
    scale = Math.min(limits.maxSide / size.width, limits.maxSide / size.height);
  }
  const area = size.width * scale * size.height * scale;
  if (area > limits.maxArea) scale = Math.min(scale, Math.sqrt(limits.maxArea / (size.width * size.height)));
  if (scale >= 1) return { ...size, limited: false };
  return {
    width: Math.max(1, Math.floor(size.width * scale)),
    height: Math.max(1, Math.floor(size.height * scale)),
    limited: true,
  };
}
