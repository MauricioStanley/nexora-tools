/**
 * Text statistics. Uses Intl.Segmenter (Unicode-aware words, sentences and graphemes, so
 * emoji and accented letters count once) with regex fallbacks for older browsers.
 */
export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingSeconds: number;
  speakingSeconds: number;
}

/** Average adult silent reading and presentation speaking rates. */
const READING_WPM = 230;
const SPEAKING_WPM = 140;
const HAS_CONTENT = /[\p{L}\p{N}]/u;

type Granularity = 'grapheme' | 'word' | 'sentence';

const cache = new Map<string, Intl.Segmenter>();

function segmenter(locale: string, granularity: Granularity): Intl.Segmenter | null {
  if (typeof Intl === 'undefined' || typeof Intl.Segmenter !== 'function') return null;
  const key = `${locale}:${granularity}`;
  let instance = cache.get(key);
  if (!instance) {
    instance = new Intl.Segmenter(locale, { granularity });
    cache.set(key, instance);
  }
  return instance;
}

function countWords(text: string, locale: string): number {
  const seg = segmenter(locale, 'word');
  if (!seg) return text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  let count = 0;
  for (const s of seg.segment(text)) if (s.isWordLike) count += 1;
  return count;
}

function countGraphemes(text: string, locale: string): { all: number; visible: number } {
  const seg = segmenter(locale, 'grapheme');
  const parts = seg ? Array.from(seg.segment(text), (s) => s.segment) : Array.from(text);
  return { all: parts.length, visible: parts.filter((p) => !/^\s+$/u.test(p)).length };
}

function countSentences(text: string, locale: string): number {
  const seg = segmenter(locale, 'sentence');
  if (!seg) return text.split(/[.!?…]+/u).filter((s) => HAS_CONTENT.test(s)).length;
  let count = 0;
  for (const s of seg.segment(text)) if (HAS_CONTENT.test(s.segment)) count += 1;
  return count;
}

export function textStats(text: string, locale: string): TextStats {
  const words = countWords(text, locale);
  const { all, visible } = countGraphemes(text, locale);
  return {
    words,
    characters: all,
    charactersNoSpaces: visible,
    sentences: countSentences(text, locale),
    paragraphs: text.split(/\n+/).filter((line) => HAS_CONTENT.test(line)).length,
    readingSeconds: Math.round((words / READING_WPM) * 60),
    speakingSeconds: Math.round((words / SPEAKING_WPM) * 60),
  };
}
