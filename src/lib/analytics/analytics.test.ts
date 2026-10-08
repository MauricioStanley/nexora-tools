import { describe, expect, it } from 'vitest';
import { durationBucket, sanitizeParams, sizeBucket } from './index';

describe('analytics privacy', () => {
  it('drops keys that are not allow-listed (e.g. filenames)', () => {
    const clean = sanitizeParams({ tool: 'merge-pdf', filename: 'John_Doe_Tax_Return_2026.pdf', files_count: 3, success: true });
    expect(clean).toEqual({ tool: 'merge-pdf', files_count: 3, success: true });
  });

  it('drops values that look like file names or free text even under allowed keys', () => {
    const clean = sanitizeParams({ tool: 'secret contract.pdf', mode: 'Tax_Return.pdf', output_format: 'jpg' });
    expect(clean).toEqual({ output_format: 'jpg' });
  });

  it('drops raw search terms unless explicitly enabled', () => {
    expect(sanitizeParams({ search_term: 'merge', query_length: 5 }, { allowSearchTerm: false })).toEqual({ query_length: 5 });
  });

  it('buckets sizes and durations instead of sending exact values', () => {
    expect(sizeBucket(500)).toBe('lt_1mb');
    expect(sizeBucket(30 * 1024 * 1024)).toBe('10_50mb');
    expect(durationBucket(2500)).toBe('1_5s');
  });
});
