import type { ToolContent } from '../../types';

const ui = {
  inputLabel: 'Your text',
  placeholder: 'Type or paste your text here…',
  clear: 'Clear',
  stats: {
    words: 'Words',
    characters: 'Characters',
    charactersNoSpaces: 'Characters without spaces',
    sentences: 'Sentences',
    paragraphs: 'Paragraphs',
    reading: 'Reading time',
    speaking: 'Speaking time',
  },
  seconds: '{s} s',
  minutes: '{m} min',
  minutesSeconds: '{m} min {s} s',
  privacyNote: 'Your text stays on this device. It isn’t sent anywhere or saved.',
};

export type WordCounterUi = typeof ui;

const content: ToolContent<WordCounterUi> = {
  name: 'Word Counter',
  tagline: 'Count words, characters, sentences and reading time as you type.',
  description:
    'Paste or type any text to count words, characters with and without spaces, sentences and paragraphs, plus reading and speaking time. Instant and private.',
  seo: {
    title: 'Word Counter – Count Words and Characters Online',
    description:
      'Free word counter: count words, characters with and without spaces, sentences and paragraphs, and see reading time as you type. Your text never leaves your device.',
  },
  keywords: ['word counter', 'character counter', 'count words', 'word count', 'letter counter', 'character count'],
  aliases: ['how many words', 'count characters', 'words counter online', 'essay word counter', 'reading time calculator', 'count letters'],
  howTo: [
    { title: 'Add your text', text: 'Type in the box or paste text from a document, email or web page.' },
    { title: 'Read the counts', text: 'Words, characters, sentences, paragraphs and reading time update instantly as you write.' },
    { title: 'Edit to fit', text: 'Trim or expand your text until it fits the limit you need, like a tweet, a meta description or an essay.' },
  ],
  about: [
    'Word Counter shows the length of any text as you type: words, characters with and without spaces, sentences and paragraphs, plus an estimate of how long it takes to read or say aloud.',
    'Counting is language-aware, so accented letters, contractions and emoji are handled correctly. Reading time assumes about 230 words per minute and speaking time about 140.',
  ],
  limitations: [
    'Different apps count slightly differently, for example with hyphenated words or numbers. Use this as a close guide when a strict limit applies.',
    'Formatting is ignored: only the plain text is counted.',
    'Reading and speaking times are averages and vary from person to person.',
  ],
  faq: [
    {
      question: 'Is my text sent or saved anywhere?',
      answer: 'No. Everything is counted in your browser on your own device. Your text isn’t uploaded or stored, and it disappears when you close the page.',
    },
    {
      question: 'Do spaces count as characters?',
      answer: 'Both counts are shown: “Characters” includes spaces and line breaks, “Characters without spaces” leaves them out.',
    },
    {
      question: 'How is reading time calculated?',
      answer: 'It divides the word count by an average reading speed of about 230 words per minute. Speaking time uses about 140 words per minute.',
    },
    {
      question: 'Does it work with Spanish and other languages?',
      answer: 'Yes. Words are detected using the Unicode rules built into your browser, which handle accents and most writing systems.',
    },
  ],
  ui,
};

export default content;
