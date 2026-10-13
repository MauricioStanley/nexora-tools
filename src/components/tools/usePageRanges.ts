import { useMemo } from 'react';
import { fmt } from '@/i18n/format';
import { parsePageRanges, type PageRange, type RangeParseResult } from '@/lib/pdf/ranges';
import type { CommonToolStrings } from './types';

export interface PageRangesState {
  parsed: RangeParseResult | null;
  /** Valid ranges, or null while the text is empty, invalid or the page count is unknown. */
  ranges: PageRange[] | null;
  /** Localized message for a non-empty, invalid entry. */
  error?: string;
}

/** Parse a "1-3, 5, 8-" field against the selected PDF's page count. */
export function usePageRanges(text: string, pages: number | null | undefined, strings: CommonToolStrings['pageRanges']): PageRangesState {
  return useMemo(() => {
    if (!pages) return { parsed: null, ranges: null };
    const parsed = parsePageRanges(text, pages);
    if (parsed.ok) return { parsed, ranges: parsed.ranges };
    const error = text.trim() === '' ? undefined : fmt(strings.errors[parsed.error], { token: parsed.token ?? '', pages });
    return { parsed, ranges: null, error };
  }, [text, pages, strings]);
}
