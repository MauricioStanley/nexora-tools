import type { ToolContent } from '../../types';

const ui = {
  action: 'Remove pages',
  dropTitle: 'Drop your PDF here',
  pagesLabel: 'Pages to remove',
  allPagesError: 'You can’t remove every page. Leave at least one.',
  inspecting: 'Reading your PDF…',
  pageCount: { one: 'This PDF has {count} page', other: 'This PDF has {count} pages' },
  preview: { one: 'Removes {count} page · Pages left: {remaining}', other: 'Removes {count} pages · Pages left: {remaining}' },
  outputSuffix: 'edited',
  downloadLabel: 'Download PDF',
  summary: { one: '{count} page removed · Pages left: {remaining}', other: '{count} pages removed · Pages left: {remaining}' },
};

export type RemovePdfPagesUi = typeof ui;

const content: ToolContent<RemovePdfPagesUi> = {
  name: 'Remove PDF Pages',
  tagline: 'Delete blank, duplicate or unwanted pages from a PDF in seconds.',
  description:
    'Delete the pages you don’t need from a PDF: blank scans, duplicates, ads or drafts. Type the page numbers and download a clean copy, processed in your browser.',
  seo: {
    title: 'Remove Pages from PDF – Free Online Tool',
    description:
      'Delete pages from a PDF online for free. Type the pages or ranges to remove and download a clean copy in seconds. Private: your PDF is never uploaded.',
  },
  keywords: ['remove pages from pdf', 'delete pdf pages', 'remove pdf pages', 'delete pages from pdf', 'pdf page remover', 'delete page in pdf'],
  aliases: ['remove blank pages pdf', 'take out pages from pdf', 'cut pages from pdf', 'erase pdf page', 'remove a page from a pdf', 'pdf delete page'],
  howTo: [
    { title: 'Add your PDF', text: 'Drop the file onto the page or choose it from your device. The page count appears right away.' },
    { title: 'Type the pages to remove', text: 'Enter page numbers and ranges, like “2, 5-7, 12”. You’ll see how many pages will be left.' },
    { title: 'Download', text: 'Download the new PDF without those pages. Your original file is not changed.' },
  ],
  about: [
    'Remove PDF Pages deletes the pages you list and keeps everything else exactly as it was: the remaining pages are not re-rendered or re-compressed, so text stays sharp and selectable.',
    'It is the fastest way to drop blank pages from a scan, a cover you don’t need or duplicated pages before sending a document. To keep only a few pages instead, use the “Extract pages” mode of Split PDF.',
  ],
  limitations: [
    'Password-protected PDFs can’t be edited. Remove the protection first.',
    'At least one page has to remain.',
    'Bookmarks that pointed to removed pages may stop working. Up to 200 MB per PDF.',
  ],
  faq: [
    {
      question: 'Is my PDF uploaded anywhere?',
      answer: 'No. Pages are removed in your browser on your own device. The file never leaves it.',
    },
    {
      question: 'How do I remove several pages at once?',
      answer: 'Separate them with commas and use ranges: “1, 4-6, 10-” removes page 1, pages 4 to 6 and everything from page 10 to the end.',
    },
    {
      question: 'Does it change the quality of the other pages?',
      answer: 'No. The remaining pages are kept as they are, without re-compression.',
    },
    {
      question: 'Can I undo it?',
      answer: 'Your original file is never modified. You download a new copy, so you can always start again from the original.',
    },
  ],
  ui,
};

export default content;
