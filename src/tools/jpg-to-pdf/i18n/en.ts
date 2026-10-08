import type { ToolContent } from '../../types';

const ui = {
  action: 'Convert to PDF',
  dropTitle: 'Drop your images here',
  pageSize: 'Page size',
  sizeFit: 'Fit image',
  sizeFitHint: 'Page = image',
  sizeA4: 'A4',
  sizeA4Hint: '210 × 297 mm',
  sizeLetter: 'Letter',
  sizeLetterHint: '8.5 × 11 in',
  orientation: 'Orientation',
  orientationAuto: 'Auto',
  orientationPortrait: 'Portrait',
  orientationLandscape: 'Landscape',
  margin: 'Margin',
  marginNone: 'None',
  marginSmall: 'Small',
  marginLarge: 'Large',
  stripMetadata: 'Remove photo metadata',
  stripMetadataHint: 'Removes location (GPS), camera details and other EXIF data from photos.',
  preparing: 'Preparing image {current} of {total}…',
  building: 'Building your PDF…',
  outputName: 'images',
  downloadLabel: 'Download PDF',
  summary: { one: '{count} image converted into a {pages}-page PDF', other: '{count} images converted into a {pages}-page PDF' },
};

export type JpgToPdfUi = typeof ui;

const content: ToolContent<JpgToPdfUi> = {
  name: 'JPG to PDF',
  tagline: 'Turn JPG, PNG or WebP images into a single PDF document.',
  description:
    'Convert photos, scans and screenshots into one PDF. Arrange the order, pick a page size and margins, and download in seconds. Your images never leave your device.',
  seo: {
    title: 'JPG to PDF Converter – Free, No Upload',
    description:
      'Convert JPG, PNG and WebP images to a PDF for free. Reorder pages, choose A4, Letter or image size, and download instantly. Images are processed in your browser.',
  },
  keywords: ['jpg to pdf', 'image to pdf', 'jpeg to pdf', 'png to pdf', 'photo to pdf', 'pictures to pdf', 'convert jpg to pdf', 'webp to pdf'],
  aliases: ['images to pdf', 'photos to pdf', 'scan to pdf', 'make pdf from images', 'combine images into pdf', 'picture to pdf'],
  howTo: [
    { title: 'Add your images', text: 'Drop JPG, PNG or WebP files, choose them from your device, or paste an image.' },
    { title: 'Arrange and set up', text: 'Reorder images with the arrows, then choose page size, orientation and margins.' },
    { title: 'Convert and download', text: 'Press Convert to PDF. Each image becomes one page of your document.' },
  ],
  about: [
    'JPG to PDF places each image on its own page and combines them into a single PDF, which is ideal for sending receipts, scanned documents or photo sets. JPG images are embedded without re-compression, so they keep their original quality.',
    'Photos taken with phones often contain hidden metadata such as GPS location. By default, that information is removed while the image itself is kept intact. Images are also rotated correctly according to how they were taken.',
  ],
  limitations: [
    'WebP images are converted to high-quality JPG before being added, and transparent areas become white.',
    'HEIC photos from iPhones aren’t supported by browsers yet. Share or export them as JPG first.',
    'Up to 100 images, 40 MB each and 400 MB in total.',
  ],
  faq: [
    {
      question: 'Will my images lose quality?',
      answer:
        'JPG and PNG images are embedded as they are, so quality is preserved. Only photos that need rotating, and WebP images, are re-encoded as high-quality JPG.',
    },
    {
      question: 'Can I put several images on one PDF page?',
      answer: 'Not in this version: each image becomes its own page. You can choose the page size and margins so images are laid out neatly.',
    },
    {
      question: 'Are my photos uploaded?',
      answer: 'No. The PDF is created in your browser on your device. Your images are never sent to a server.',
    },
    {
      question: 'Why are my phone photos rotated correctly?',
      answer:
        'Phones record the orientation of a photo separately from the image data. We read that information and rotate the image so it appears in the PDF the same way it does in your gallery.',
    },
    {
      question: 'Which page size should I pick?',
      answer:
        '“Fit image” makes each page exactly the size of the image, which is best for screenshots and photos. Choose A4 or Letter for documents you plan to print or submit.',
    },
  ],
  ui,
};

export default content;
