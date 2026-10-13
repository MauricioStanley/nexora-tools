import type { ToolContent } from '../../types';

const ui = {
  action: 'Add watermark',
  dropTitle: 'Drop your PDF here',
  defaultText: 'CONFIDENTIAL',
  textLabel: 'Watermark text',
  textRequired: 'Type the watermark text.',
  unsupportedChars: 'These characters can’t be used in the watermark: {chars}',
  layout: 'Layout',
  layoutDiagonal: 'Diagonal',
  layoutHorizontal: 'Horizontal',
  layoutTiled: 'Repeated',
  size: 'Text size',
  sizeHint: 'Large text shrinks automatically to fit the page.',
  opacity: 'Opacity',
  color: 'Color',
  previewLabel: 'Preview of the watermark on a page',
  previewCaption: 'Preview on an A4 page',
  inspecting: 'Reading your PDF…',
  preview: { one: 'Adds the watermark to {count} page', other: 'Adds the watermark to {count} pages' },
  outputSuffix: 'watermarked',
  downloadLabel: 'Download PDF',
  summary: { one: 'Watermark added to {count} page', other: 'Watermark added to {count} pages' },
};

export type WatermarkPdfUi = typeof ui;

const content: ToolContent<WatermarkPdfUi> = {
  name: 'Watermark PDF',
  tagline: 'Stamp text like “Confidential” or “Draft” across every page of a PDF.',
  description:
    'Add a text watermark to every page of a PDF: diagonal, horizontal or repeated, in the color and opacity you choose. See a live preview and download in seconds.',
  seo: {
    title: 'Add a Watermark to PDF – Free and Private',
    description:
      'Add a text watermark to a PDF online for free: “Confidential”, “Draft” or your name, diagonal or repeated, with custom color and opacity. Never uploaded.',
  },
  keywords: ['watermark pdf', 'add watermark to pdf', 'pdf watermark', 'stamp pdf', 'confidential watermark pdf', 'draft watermark pdf'],
  aliases: ['put watermark on pdf', 'insert watermark pdf', 'add text to all pdf pages', 'pdf stamp text', 'mark pdf as confidential', 'protect pdf with watermark'],
  howTo: [
    { title: 'Add your PDF', text: 'Drop the file onto the page or choose it from your device.' },
    { title: 'Design the watermark', text: 'Type the text and choose the layout, size, opacity and color. The preview updates as you go.' },
    { title: 'Download', text: 'Download the watermarked PDF. Your original file is not changed.' },
  ],
  about: [
    'Watermark PDF stamps your text on every page of a document: one large diagonal mark, a horizontal line across the middle, or a repeated pattern that covers the whole page.',
    'Use it to label drafts, mark documents as confidential, or add your name before sharing. The watermark is semi-transparent, so the content underneath stays readable, and it is placed correctly on rotated and landscape pages.',
  ],
  limitations: [
    'Password-protected PDFs can’t be edited. Remove the protection first.',
    'The text uses a standard font that supports Latin letters and accents. Emoji and non-Latin scripts can’t be used yet.',
    'A watermark discourages reuse but doesn’t lock the document: someone with a PDF editor could remove it. Up to 200 MB per PDF.',
  ],
  faq: [
    {
      question: 'Is my PDF uploaded anywhere?',
      answer: 'No. The watermark is added in your browser on your own device. The file never leaves it.',
    },
    {
      question: 'Can people still read the document?',
      answer: 'Yes. The watermark is semi-transparent. Lower the opacity if it competes with the text, or raise it for a stronger mark.',
    },
    {
      question: 'Can I add an image or logo as a watermark?',
      answer: 'Not yet. This tool adds text watermarks, which work well for labels like “Confidential”, “Draft” or a company name.',
    },
    {
      question: 'Can the watermark be removed?',
      answer: 'It is drawn into each page, so it stays when the file is shared, printed or converted. A determined person with a PDF editor could still remove it.',
    },
  ],
  ui,
};

export default content;
