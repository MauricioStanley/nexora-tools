/** Compression presets (dependency-free so the UI can import them without pulling pdf-lib). */
export type CompressLevel = 'light' | 'recommended' | 'strong';

export const LEVELS: Record<CompressLevel, { quality: number; maxDimension: number; dpi: number }> = {
  light: { quality: 0.82, maxDimension: 3000, dpi: 150 },
  recommended: { quality: 0.68, maxDimension: 2200, dpi: 120 },
  strong: { quality: 0.5, maxDimension: 1500, dpi: 96 },
};
