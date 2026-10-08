/**
 * File type catalog. Tools reference these ids instead of raw MIME strings so accept
 * attributes, validation, labels and SEO copy stay consistent.
 */
export const FILE_TYPES = {
  pdf: {
    label: 'PDF',
    mimeTypes: ['application/pdf', 'application/x-pdf'],
    extensions: ['.pdf'],
  },
  jpeg: {
    label: 'JPG',
    mimeTypes: ['image/jpeg', 'image/pjpeg'],
    extensions: ['.jpg', '.jpeg', '.jfif', '.jpe'],
  },
  png: {
    label: 'PNG',
    mimeTypes: ['image/png'],
    extensions: ['.png'],
  },
  webp: {
    label: 'WebP',
    mimeTypes: ['image/webp'],
    extensions: ['.webp'],
  },
  svg: {
    label: 'SVG',
    mimeTypes: ['image/svg+xml'],
    extensions: ['.svg'],
  },
  zip: {
    label: 'ZIP',
    mimeTypes: ['application/zip'],
    extensions: ['.zip'],
  },
} as const;

export type FileTypeId = keyof typeof FILE_TYPES;

/** Types that can be *uploaded* to tools (SVG/ZIP are output-only in V1). */
export type InputFileTypeId = Extract<FileTypeId, 'pdf' | 'jpeg' | 'png' | 'webp'>;

/** Canonical MIME type used when producing files of a given type. */
export const OUTPUT_MIME: Record<FileTypeId, string> = {
  pdf: 'application/pdf',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  zip: 'application/zip',
};

export const OUTPUT_EXTENSION: Record<FileTypeId, string> = {
  pdf: '.pdf',
  jpeg: '.jpg',
  png: '.png',
  webp: '.webp',
  svg: '.svg',
  zip: '.zip',
};

/** Value for an `<input type="file" accept>` attribute. */
export function acceptAttribute(types: readonly FileTypeId[]): string {
  return types.flatMap((t) => [...FILE_TYPES[t].mimeTypes, ...FILE_TYPES[t].extensions]).join(',');
}

export function formatLabels(types: readonly FileTypeId[]): string[] {
  return types.map((t) => FILE_TYPES[t].label);
}

export const MB = 1024 * 1024;
