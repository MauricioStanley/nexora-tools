import { zipSync, type Zippable } from 'fflate';
import { dedupeNames } from './sanitize';

export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

/**
 * Package files into a ZIP archive.
 * Already-compressed formats (JPG, PNG, WebP, PDF) are *stored* (level 0): recompressing
 * them wastes CPU for ~0% gain and keeps this fast enough for the main thread.
 */
export function createZip(entries: readonly ZipEntry[], level: 0 | 1 | 6 = 0): Uint8Array {
  const names = dedupeNames(entries.map((e) => e.name));
  const files: Zippable = {};
  entries.forEach((entry, i) => {
    files[names[i]!] = [entry.data, { level }];
  });
  // Fixed timestamp is not used: entries carry the current time, which is what users expect.
  return zipSync(files, { level });
}
