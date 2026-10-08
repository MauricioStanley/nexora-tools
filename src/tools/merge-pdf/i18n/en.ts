import type { ToolContent } from '../../types';

const ui = {
  action: 'Merge PDF',
  dropTitle: 'Drop your PDFs here',
  minFiles: 'Add at least {count} PDFs to merge them.',
  fixProblems: 'Remove the files marked with a problem to continue.',
  inspecting: 'Reading your files…',
  merging: 'Merging file {current} of {total}…',
  saving: 'Saving your PDF…',
  outputName: 'merged',
  downloadLabel: 'Download merged PDF',
  summary: { one: '{count} PDF merged · {pages} pages', other: '{count} PDFs merged · {pages} pages' },
};

export type MergePdfUi = typeof ui;

const content: ToolContent<MergePdfUi> = {
  name: 'Merge PDF',
  tagline: 'Combine several PDFs into one document, in the order you choose.',
  description:
    'Combine PDF files into a single document in seconds and put them in the order you want. Everything runs in your browser, so your documents stay private.',
  seo: {
    title: 'Merge PDF Files Online – Free and Private',
    description:
      'Combine multiple PDF files into one document for free. Arrange the order and merge instantly in your browser. No uploads, no sign-up, no watermarks.',
  },
  keywords: ['merge pdf', 'combine pdf', 'join pdf', 'pdf merger', 'merge pdf files', 'append pdf', 'bind pdf'],
  aliases: ['join pdf', 'combine pdf', 'combine pdfs', 'pdf joiner', 'put pdfs together', 'merge documents', 'concatenate pdf'],
  howTo: [
    { title: 'Add your PDFs', text: 'Drop the files onto the page or choose them from your device. You can add more at any time.' },
    { title: 'Set the order', text: 'Use the arrows to move files up or down. Files are combined from top to bottom.' },
    { title: 'Merge and download', text: 'Press Merge PDF, then download your combined document.' },
  ],
  about: [
    'Merge PDF joins several PDF documents into one file. Pages are copied exactly as they are: text stays selectable, page sizes are preserved and nothing is re-compressed, so quality does not change.',
    'The merge runs on your device in a background worker, which keeps the page responsive even with large documents. Your files are never uploaded.',
  ],
  limitations: [
    'Bookmarks (the document outline) and interactive form fields from the original files are not carried over.',
    'Password-protected PDFs can’t be merged. They are flagged as soon as you add them.',
    'Up to 50 files, 150 MB each and 400 MB in total. Very large merges depend on your device’s memory.',
  ],
  faq: [
    {
      question: 'Is it safe to merge confidential PDFs here?',
      answer:
        'Yes. Your browser merges the files on your own device and nothing is uploaded to a server. When you close or reset the page, the files are gone from memory.',
    },
    {
      question: 'Will the quality of my PDFs change?',
      answer: 'No. Pages are copied without re-compression, so text, images and vector graphics look exactly the same as in the originals.',
    },
    {
      question: 'Can I change the order of the files?',
      answer: 'Yes. Before merging, use the up and down arrows next to each file. The file at the top becomes the first part of the document.',
    },
    {
      question: 'How many files can I merge at once?',
      answer: 'Up to 50 PDFs per merge, each up to 150 MB, with a combined limit of 400 MB. For bigger jobs, merge in batches and then merge the results.',
    },
    {
      question: 'Can I merge password-protected PDFs?',
      answer:
        'Not yet. Protected files are detected when you add them. Open the file in your PDF reader, save a copy without the password, and add that copy instead.',
    },
  ],
  ui,
};

export default content;
