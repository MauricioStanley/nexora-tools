import type { ToolContent } from '../../types';

const ui = {
  action: 'Convert to JPG',
  dropTitle: 'Drop your PDF here',
  pages: 'Pages',
  pagesAll: 'All pages',
  pagesCustom: 'Choose pages',
  pagesLabel: 'Pages to convert',
  pagesPlaceholder: 'e.g. 1-3, 5',
  pagesHint: 'Separate pages and ranges with commas.',
  resolution: 'Resolution',
  resScreen: 'Screen',
  resScreenHint: '72 DPI',
  resStandard: 'Standard',
  resStandardHint: '150 DPI',
  resHigh: 'High',
  resHighHint: '300 DPI',
  quality: 'JPG quality',
  rangeErrors: {
    empty: 'Enter at least one page or range.',
    syntax: '“{token}” isn’t a valid page or range.',
    out_of_bounds: '“{token}” is outside this PDF (1–{pages}).',
    reversed: '“{token}” goes backwards. Write it as a-b with a ≤ b.',
  },
  preview: { one: 'Creates {count} image', other: 'Creates {count} images' },
  tooMany: 'This tool converts up to {count} pages at a time. Choose fewer pages or split the PDF first.',
  loadingEngine: 'Loading the PDF engine…',
  reading: 'Reading your PDF…',
  rendering: 'Converting page {current} of {total}…',
  packaging: 'Packaging images…',
  pageName: 'page',
  downloadLabel: 'Download JPG',
  summary: { one: '{count} page converted to JPG', other: '{count} pages converted to JPG' },
  limitedPages: {
    one: '{count} page was rendered at a lower resolution because of this device’s memory limits.',
    other: '{count} pages were rendered at a lower resolution because of this device’s memory limits.',
  },
};

export type PdfToJpgUi = typeof ui;

const content: ToolContent<PdfToJpgUi> = {
  name: 'PDF to JPG',
  tagline: 'Convert PDF pages into high-quality JPG images.',
  description:
    'Turn every page of a PDF, or just the pages you pick, into JPG images at the resolution you need. Conversion happens in your browser, so your document stays private.',
  seo: {
    title: 'PDF to JPG Converter – Free, High Quality',
    description:
      'Convert PDF pages to JPG images for free. Pick specific pages, choose 72, 150 or 300 DPI and download a single image or a ZIP. Your PDF is never uploaded.',
  },
  keywords: ['pdf to jpg', 'pdf to jpeg', 'pdf to image', 'convert pdf to jpg', 'pdf page to image', 'pdf to picture', 'extract pdf pages as images'],
  aliases: ['pdf to photo', 'save pdf as jpg', 'pdf to jpg converter', 'turn pdf into image', 'pdf screenshot', 'pdf to pictures'],
  howTo: [
    { title: 'Add your PDF', text: 'Drop the file onto the page or choose it from your device. We read the page count first.' },
    { title: 'Choose pages and quality', text: 'Convert all pages or only some, and pick the resolution: screen, standard or high for printing.' },
    { title: 'Download', text: 'Download a single JPG, or all images together in a ZIP file.' },
  ],
  about: [
    'PDF to JPG renders each page exactly as a PDF viewer would, using Mozilla’s PDF.js engine, and saves it as a JPG image. Use it to share pages on social media, insert them into presentations, or preview documents on devices without a PDF reader.',
    'Choose 72 DPI for quick on-screen sharing, 150 DPI for a good balance, or 300 DPI when you need print quality. Higher resolutions produce larger files.',
  ],
  limitations: [
    'Up to 300 pages per conversion and 150 MB per PDF. On phones, very high resolutions may be reduced automatically to fit the device’s memory, and you will be told if that happens.',
    'PDFs that need a password to open can’t be converted yet.',
    'Transparent areas become white, since JPG doesn’t support transparency.',
  ],
  faq: [
    {
      question: 'Which resolution should I choose?',
      answer:
        '72 DPI is enough for viewing on screens and messaging apps. 150 DPI is a good general choice. Use 300 DPI for printing or when you need to zoom into small details.',
    },
    {
      question: 'Can I convert only certain pages?',
      answer: 'Yes. Choose “Choose pages” and type pages or ranges, such as “1-3, 5”. Only those pages are converted.',
    },
    {
      question: 'Is my PDF uploaded?',
      answer: 'No. Pages are rendered in your browser on your device, and the images are created locally.',
    },
    {
      question: 'Will the images look exactly like the PDF?',
      answer:
        'Pages are rendered with the same engine Firefox uses to display PDFs, so they match what you see in a viewer. JPG compression may add slight softness at lower quality settings.',
    },
    {
      question: 'Why do I get a ZIP file?',
      answer: 'When more than one page is converted, all images are packaged in one ZIP so you can download them at once. With a few pages you can also download each image separately.',
    },
  ],
  ui,
};

export default content;
