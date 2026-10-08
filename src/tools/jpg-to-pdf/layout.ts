/** Page geometry for JPG to PDF (pure, unit-tested). Units are PDF points (1/72 in). */
export type PageSizeOption = 'fit' | 'a4' | 'letter';
export type OrientationOption = 'auto' | 'portrait' | 'landscape';
export type MarginOption = 'none' | 'small' | 'large';

export interface LayoutOptions {
  pageSize: PageSizeOption;
  orientation: OrientationOption;
  margin: MarginOption;
}

export interface Placement {
  pageWidth: number;
  pageHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const PAGE_SIZES: Record<Exclude<PageSizeOption, 'fit'>, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

export const MARGINS: Record<MarginOption, number> = { none: 0, small: 18, large: 36 };

/** PDF viewers reject pages larger than 14,400 pt (200 in). */
const MAX_PAGE_SIDE = 14_400;
/** Screen pixels → points at 96 DPI. */
const PX_TO_PT = 0.75;

export function computePlacement(imageWidth: number, imageHeight: number, options: LayoutOptions): Placement {
  const margin = MARGINS[options.margin];

  if (options.pageSize === 'fit') {
    let width = imageWidth * PX_TO_PT;
    let height = imageHeight * PX_TO_PT;
    const scale = Math.min(1, (MAX_PAGE_SIDE - 2 * margin) / Math.max(width, height));
    width *= scale;
    height *= scale;
    return { pageWidth: width + 2 * margin, pageHeight: height + 2 * margin, x: margin, y: margin, width, height };
  }

  let [pageWidth, pageHeight] = PAGE_SIZES[options.pageSize];
  const landscape = options.orientation === 'landscape' || (options.orientation === 'auto' && imageWidth > imageHeight);
  if (landscape) [pageWidth, pageHeight] = [pageHeight, pageWidth];

  const availableWidth = pageWidth - 2 * margin;
  const availableHeight = pageHeight - 2 * margin;
  // Fit inside the printable area; never enlarge beyond 1 pt per pixel (avoids blurry upscales).
  const scale = Math.min(availableWidth / imageWidth, availableHeight / imageHeight, 1);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    pageWidth,
    pageHeight,
    x: (pageWidth - width) / 2,
    y: (pageHeight - height) / 2,
    width,
    height,
  };
}
