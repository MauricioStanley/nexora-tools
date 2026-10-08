import { describe, expect, it } from 'vitest';
import { chunkRanges, expandRanges, formatRange, parsePageRanges } from './ranges';

describe('page ranges', () => {
  it('parses single pages, ranges and open ranges', () => {
    expect(parsePageRanges('1-3, 5, 8-', 10)).toEqual({
      ok: true,
      ranges: [
        { start: 1, end: 3 },
        { start: 5, end: 5 },
        { start: 8, end: 10 },
      ],
    });
    expect(parsePageRanges('-2; 4 – 6', 10)).toEqual({
      ok: true,
      ranges: [
        { start: 1, end: 2 },
        { start: 4, end: 6 },
      ],
    });
  });

  it('reports precise errors', () => {
    expect(parsePageRanges('  ', 5)).toEqual({ ok: false, error: 'empty' });
    expect(parsePageRanges('1-2, abc', 5)).toEqual({ ok: false, error: 'syntax', token: 'abc' });
    expect(parsePageRanges('4-2', 5)).toEqual({ ok: false, error: 'reversed', token: '4-2' });
    expect(parsePageRanges('3-9', 5)).toEqual({ ok: false, error: 'out_of_bounds', token: '3-9' });
    expect(parsePageRanges('0', 5)).toEqual({ ok: false, error: 'out_of_bounds', token: '0' });
  });

  it('expands, formats and chunks', () => {
    expect(expandRanges([{ start: 2, end: 4 }, { start: 1, end: 1 }])).toEqual([2, 3, 4, 1]);
    expect(formatRange({ start: 3, end: 3 })).toBe('3');
    expect(formatRange({ start: 1, end: 4 })).toBe('1-4');
    expect(chunkRanges(7, 3)).toEqual([
      { start: 1, end: 3 },
      { start: 4, end: 6 },
      { start: 7, end: 7 },
    ]);
  });
});
