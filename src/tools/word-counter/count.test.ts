import { describe, expect, it } from 'vitest';
import { textStats } from './count';

describe('textStats', () => {
  it('returns zeros for empty text', () => {
    expect(textStats('', 'en')).toEqual({
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingSeconds: 0,
      speakingSeconds: 0,
    });
    expect(textStats('   \n\n  ', 'en')).toMatchObject({ words: 0, sentences: 0, paragraphs: 0 });
  });

  it('counts words, sentences and paragraphs', () => {
    const text = 'Hello world. This is Nexora!\n\nA second paragraph? Yes.';
    expect(textStats(text, 'en')).toMatchObject({ words: 9, sentences: 4, paragraphs: 2 });
  });

  it('handles accents, contractions and numbers as single words', () => {
    expect(textStats('El niño comió pingüinos', 'es').words).toBe(4);
    expect(textStats("It's 3.5 o'clock", 'en').words).toBe(3);
  });

  it('counts an emoji or accented letter as one character', () => {
    expect(textStats('añ 👍🏽', 'es')).toMatchObject({ characters: 4, charactersNoSpaces: 3 });
  });

  it('estimates reading and speaking time', () => {
    const text = Array.from({ length: 460 }, () => 'word').join(' ');
    expect(textStats(text, 'en')).toMatchObject({ words: 460, readingSeconds: 120, speakingSeconds: 197 });
  });
});
