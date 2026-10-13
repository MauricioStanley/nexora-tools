import type { ToolContent } from '../../types';

const ui = {
  action: 'Rotate PDF',
  dropTitle: 'Drop your PDF here',
  angle: 'Rotation',
  right: 'Right',
  upsideDown: 'Upside down',
  left: 'Left',
  scope: 'Pages to rotate',
  scopeAll: 'All pages',
  scopePages: 'Only some pages',
  pagesLabel: 'Pages',
  inspecting: 'Reading your PDF…',
  preview: { one: 'Rotates {count} page', other: 'Rotates {count} pages' },
  outputSuffix: 'rotated',
  downloadLabel: 'Download PDF',
  summary: { one: '{count} page rotated', other: '{count} pages rotated' },
};

export type RotatePdfUi = typeof ui;

const content: ToolContent<RotatePdfUi> = {
  name: 'Rotate PDF',
  tagline: 'Turn PDF pages right, left or upside down, all at once or only some.',
  description:
    'Fix sideways and upside-down pages in seconds. Rotate every page or only the ones you choose, with no quality loss, right in your browser.',
  seo: {
    title: 'Rotate PDF Pages Online – Free and Private',
    description:
      'Rotate PDF pages 90° or 180°, every page or only the ones you pick. Free, no sign-up and no quality loss: your PDF is processed in your browser, never uploaded.',
  },
  keywords: ['rotate pdf', 'rotate pdf pages', 'turn pdf', 'flip pdf', 'rotate pdf online', 'pdf rotator', 'rotate pdf and save'],
  aliases: ['turn pdf pages', 'fix sideways pdf', 'rotate scanned pdf', 'pdf upside down', 'change pdf orientation', 'rotate one page in pdf'],
  howTo: [
    { title: 'Add your PDF', text: 'Drop the file onto the page or choose it from your device.' },
    { title: 'Choose the rotation', text: 'Turn pages right, left or upside down, and pick whether to rotate every page or only some, like “2, 5-7”.' },
    { title: 'Download', text: 'Download the rotated PDF. The new orientation is saved in the file and shows the same in every PDF reader.' },
  ],
  about: [
    'Rotate PDF changes the orientation of pages in an existing document, which is the quickest fix for scans and photos that came out sideways or upside down.',
    'Only the page’s orientation setting changes: text, images and links are kept exactly as they were, so there is no quality loss and the file size stays practically the same. Rotate the whole document or just the pages you list.',
  ],
  limitations: [
    'Password-protected PDFs can’t be rotated. Remove the protection first.',
    'Pages turn in 90° steps. To straighten a slightly tilted scan, rescan it or use an editor with deskew.',
    'Up to 200 MB per PDF.',
  ],
  faq: [
    {
      question: 'Is my PDF uploaded anywhere?',
      answer: 'No. The PDF is rotated in your browser on your own device. It never leaves it.',
    },
    {
      question: 'Can I rotate just one page?',
      answer: 'Yes. Choose “Only some pages” and type the page number, or several pages and ranges like “1, 4-6”. The other pages stay as they are.',
    },
    {
      question: 'Does rotating reduce the quality?',
      answer: 'No. Only the orientation of each page changes. Text stays selectable and images are not re-compressed.',
    },
    {
      question: 'Will the rotation stick when I open the file elsewhere?',
      answer: 'Yes. The new orientation is saved inside the PDF, so it looks the same in Acrobat, browsers, phones and printers.',
    },
  ],
  ui,
};

export default content;
