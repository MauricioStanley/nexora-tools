import type { ToolContent } from '../../types';

const ui = {
  action: 'Add page numbers',
  dropTitle: 'Drop your PDF here',
  position: 'Position',
  bottom: 'Bottom',
  top: 'Top',
  alignment: 'Alignment',
  left: 'Left',
  center: 'Center',
  right: 'Right',
  format: 'Format',
  templatePage: 'Page {n}',
  templatePageOf: 'Page {n} of {total}',
  size: 'Text size',
  sizeSmall: 'Small',
  sizeMedium: 'Medium',
  sizeLarge: 'Large',
  startLabel: 'Start numbering at',
  skipFirst: 'Skip the first page',
  skipFirstHint: 'Leaves a cover page unnumbered. Numbering starts on page 2.',
  nothingToNumber: 'There are no pages left to number.',
  inspecting: 'Reading your PDF…',
  preview: { one: 'Numbers {count} page', other: 'Numbers {count} pages' },
  outputSuffix: 'numbered',
  downloadLabel: 'Download PDF',
  summary: { one: '{count} page numbered', other: '{count} pages numbered' },
};

export type AddPageNumbersUi = typeof ui;

const content: ToolContent<AddPageNumbersUi> = {
  name: 'Add Page Numbers',
  tagline: 'Number the pages of a PDF, with the position, format and size you choose.',
  description:
    'Add page numbers to any PDF in seconds. Choose where they go, the format (1, Page 1, 1 / 10…) and where numbering starts, all processed in your browser.',
  seo: {
    title: 'Add Page Numbers to PDF – Free Online',
    description:
      'Number PDF pages online for free. Choose position, format and starting number, skip the cover, and download instantly. Your PDF is processed in your browser.',
  },
  keywords: ['add page numbers to pdf', 'number pdf pages', 'pdf page numbers', 'insert page numbers pdf', 'paginate pdf', 'page numbering pdf'],
  aliases: ['put page numbers on pdf', 'pdf pagination', 'add numbers to pdf pages', 'number pages in pdf', 'pdf page counter', 'add page x of y to pdf'],
  howTo: [
    { title: 'Add your PDF', text: 'Drop the file onto the page or choose it from your device.' },
    { title: 'Choose the style', text: 'Pick the position, the format (like “Page 1 of 10”), the size and the first number. You can leave the cover unnumbered.' },
    { title: 'Download', text: 'Download the numbered PDF. Your original file is not changed.' },
  ],
  about: [
    'Add Page Numbers stamps a number on every page of a PDF: at the top or bottom, aligned left, centered or right, as a plain number or as “Page 1 of 10”.',
    'Numbers are placed relative to how each page is displayed, so rotated or landscape pages are numbered in the right corner too. The rest of the content is not touched or re-compressed.',
  ],
  limitations: [
    'Password-protected PDFs can’t be edited. Remove the protection first.',
    'Numbers are drawn on top of the page. If the page already has content at that spot, choose another position.',
    'Numbers use a standard font in dark gray. Up to 200 MB per PDF.',
  ],
  faq: [
    {
      question: 'Is my PDF uploaded anywhere?',
      answer: 'No. Page numbers are added in your browser on your own device. The file never leaves it.',
    },
    {
      question: 'Can I start numbering from a number other than 1?',
      answer: 'Yes. Set “Start numbering at”, for example to 5 if the document continues another one.',
    },
    {
      question: 'How do I leave the cover without a number?',
      answer: 'Turn on “Skip the first page”. The cover stays clean and numbering starts on the second page.',
    },
    {
      question: 'Do landscape or rotated pages work?',
      answer: 'Yes. The position is calculated from how each page is shown, so the number appears in the same place on every page.',
    },
  ],
  ui,
};

export default content;
