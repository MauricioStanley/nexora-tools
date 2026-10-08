/** Page range parsing for "1-3, 5, 8-" style input. Pages are 1-based and inclusive. */
export interface PageRange {
  start: number;
  end: number;
}

export type RangeError = 'empty' | 'syntax' | 'out_of_bounds' | 'reversed';

export type RangeParseResult = { ok: true; ranges: PageRange[] } | { ok: false; error: RangeError; token?: string };

export function parsePageRanges(input: string, pageCount: number): RangeParseResult {
  const parts = input
    .replace(/[‒-―−]/g, '-') // en/em dashes, minus sign
    .split(/[,;\n]+/)
    .map((p) => p.replace(/\s+/g, ''))
    .filter(Boolean);
  if (parts.length === 0) return { ok: false, error: 'empty' };

  const ranges: PageRange[] = [];
  for (const token of parts) {
    let start: number;
    let end: number;
    let m: RegExpMatchArray | null;
    if ((m = token.match(/^(\d+)$/))) {
      start = end = Number(m[1]);
    } else if ((m = token.match(/^(\d+)-(\d+)$/))) {
      start = Number(m[1]);
      end = Number(m[2]);
    } else if ((m = token.match(/^(\d+)-$/))) {
      start = Number(m[1]);
      end = pageCount;
    } else if ((m = token.match(/^-(\d+)$/))) {
      start = 1;
      end = Number(m[1]);
    } else {
      return { ok: false, error: 'syntax', token };
    }
    if (start > end) return { ok: false, error: 'reversed', token };
    if (start < 1 || end > pageCount) return { ok: false, error: 'out_of_bounds', token };
    ranges.push({ start, end });
  }
  return { ok: true, ranges };
}

/** Flatten ranges into a list of 1-based page numbers (order preserved, duplicates kept). */
export function expandRanges(ranges: readonly PageRange[]): number[] {
  return ranges.flatMap(({ start, end }) => Array.from({ length: end - start + 1 }, (_, i) => start + i));
}

export function formatRange(range: PageRange): string {
  return range.start === range.end ? String(range.start) : `${range.start}-${range.end}`;
}

/** Split `pageCount` pages into consecutive chunks of `size`. */
export function chunkRanges(pageCount: number, size: number): PageRange[] {
  const step = Math.max(1, Math.floor(size));
  const out: PageRange[] = [];
  for (let start = 1; start <= pageCount; start += step) {
    out.push({ start, end: Math.min(pageCount, start + step - 1) });
  }
  return out;
}
