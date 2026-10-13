/**
 * The 14 standard PDF fonts (no embedding, tiny output) only cover the WinAnsi character set:
 * Latin letters with accents, digits and common punctuation. Text stamped with them must be
 * checked first, because pdf-lib throws on anything else (emoji, Cyrillic, CJK…).
 */
const EXTRA_CODE_POINTS = new Set([
  0x20ac, 0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021, 0x02c6, 0x2030, 0x0160, 0x2039, 0x0152, 0x017d, 0x2018,
  0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014, 0x02dc, 0x2122, 0x0161, 0x203a, 0x0153, 0x017e, 0x0178,
]);

export function isWinAnsiChar(char: string): boolean {
  const code = char.codePointAt(0) ?? 0;
  return (code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff) || EXTRA_CODE_POINTS.has(code);
}

/** Characters in `text` that the standard fonts can't draw, without duplicates. */
export function unsupportedChars(text: string): string[] {
  return [...new Set([...text].filter((char) => !isWinAnsiChar(char)))];
}
