import type { ToolContent } from '../../types';

const ui = {
  action: 'Split PDF',
  dropTitle: 'Drop your PDF here',
  mode: 'How do you want to split?',
  modeAll: 'Every page',
  modeAllHint: 'One PDF per page',
  modeRanges: 'Custom ranges',
  modeRangesHint: 'One PDF per range',
  modeExtract: 'Extract pages',
  modeExtractHint: 'Selected pages into one PDF',
  modeEvery: 'Fixed size',
  modeEveryHint: 'One PDF every N pages',
  rangesLabel: 'Page ranges',
  rangesPlaceholder: 'e.g. 1-3, 5, 8-10',
  rangesHint: 'Separate ranges with commas. “7-” means page 7 to the end.',
  extractLabel: 'Pages to extract',
  extractPlaceholder: 'e.g. 1, 3, 5-7',
  extractHint: 'Pages are added in the order you type them.',
  everyLabel: 'Pages per file',
  preview: { one: 'Creates {count} PDF', other: 'Creates {count} PDFs' },
  rangeErrors: {
    empty: 'Enter at least one page or range.',
    syntax: '“{token}” isn’t a valid page or range.',
    out_of_bounds: '“{token}” is outside this PDF (1–{pages}).',
    reversed: '“{token}” goes backwards. Write it as a-b with a ≤ b.',
  },
  inspecting: 'Reading your PDF…',
  protectedHint: 'This PDF is password-protected and can’t be split.',
  splitting: 'Creating file {current} of {total}…',
  packaging: 'Packaging files…',
  pageName: 'page',
  pagesName: 'pages',
  extractName: 'extracted',
  downloadLabel: 'Download PDF',
  summary: { one: '{count} PDF created from {pages} pages', other: '{count} PDFs created from {pages} pages' },
};

export type SplitPdfUi = typeof ui;

const content: ToolContent<SplitPdfUi> = {
  name: 'Split PDF',
  tagline: 'Separate a PDF into single pages, custom ranges or extracted pages.',
  description:
    'Split a PDF into separate files: every page on its own, custom page ranges, or just the pages you need. Fast, free and processed entirely in your browser.',
  seo: {
    title: 'Split PDF Online – Extract Pages for Free',
    description:
      'Split a PDF into single pages or custom ranges, or extract only the pages you need. Free and private: your PDF is processed in your browser, never uploaded.',
  },
  keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'pdf splitter', 'split pdf pages', 'cut pdf', 'divide pdf'],
  aliases: ['separate pdf pages', 'extract pages from pdf', 'pdf page extractor', 'break pdf apart', 'split pdf into pages', 'remove pages pdf'],
  howTo: [
    { title: 'Add your PDF', text: 'Drop the file onto the page or choose it from your device. The page count appears right away.' },
    { title: 'Choose how to split', text: 'Split every page, define ranges like 1-3, 5, 8-10, extract selected pages, or cut every N pages.' },
    { title: 'Download', text: 'Download a single PDF, or all the parts together in one ZIP file.' },
  ],
  about: [
    'Split PDF creates new PDF files from the pages of an existing document. Pages are copied without re-compression, so text stays sharp and selectable and the quality does not change.',
    'Choose the mode that fits the task: one file per page, one file per custom range, a single file with only the pages you pick (in any order), or equal-sized parts. When several files are created, you can download them together as a ZIP.',
  ],
  limitations: [
    'Password-protected PDFs can’t be split. Remove the protection first.',
    'Bookmarks and interactive form fields are not carried into the new files.',
    'Up to 200 MB per PDF. Very large documents depend on your device’s memory.',
  ],
  faq: [
    {
      question: 'Is my PDF uploaded anywhere?',
      answer: 'No. The split happens entirely in your browser on your own device. The file never leaves it.',
    },
    {
      question: 'How do I write page ranges?',
      answer:
        'Use commas between parts: “1-3, 5, 8-10” creates three files. “7-” means from page 7 to the end, and “-4” means pages 1 to 4. Spaces are optional.',
    },
    {
      question: 'Can I pull out just a few pages into a new PDF?',
      answer:
        'Yes. Choose “Extract pages” and type the pages you want, like “2, 4, 9-12”. They are combined into one new PDF in the order you typed them.',
    },
    {
      question: 'Does splitting reduce the quality?',
      answer: 'No. Pages are copied as they are, without re-compression. If you also need smaller files, run the parts through Compress PDF.',
    },
    {
      question: 'What happens if I create many files?',
      answer: 'All parts are packaged into a single ZIP file so you can download them at once. When there are only a few, you can also download each one separately.',
    },
  ],
  ui,
};

export default content;
