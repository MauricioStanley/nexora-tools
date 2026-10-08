import type { ToolContent } from '../../types';

const ui = {
  action: 'Compress PDF',
  dropTitle: 'Drop your PDF here',
  level: 'Compression level',
  levelLight: 'Light',
  levelLightHint: 'Best quality',
  levelRecommended: 'Recommended',
  levelRecommendedHint: 'Balanced',
  levelStrong: 'Strong',
  levelStrongHint: 'Smallest',
  removeMetadata: 'Remove document metadata',
  removeMetadataHint: 'Title, author, software and other hidden document properties.',
  rasterize: 'Convert pages to images',
  rasterizeHint: 'Maximum compression for scans. Text will no longer be selectable, searchable or clickable.',
  inspecting: 'Reading your PDF…',
  protectedHint: 'This PDF is password-protected and can’t be compressed.',
  loadingEngine: 'Loading the PDF engine…',
  optimizingImages: 'Optimizing image {current} of {total}…',
  optimizingStructure: 'Optimizing document structure…',
  renderingPage: 'Rendering page {current} of {total}…',
  saving: 'Saving your PDF…',
  outputSuffix: 'compressed',
  downloadLabel: 'Download compressed PDF',
  summaryImages: '{optimized} of {found} images recompressed',
  summaryNoImages: 'Document structure optimized',
  summaryRaster: { one: '{count} page converted to an image', other: '{count} pages converted to images' },
  noGain:
    'This PDF is already well optimized, so we kept the original file. Stronger settings or converting pages to images may still reduce it.',
  limitedPages: { one: '{count} page was rendered at a lower resolution because of this device’s memory limits.', other: '{count} pages were rendered at a lower resolution because of this device’s memory limits.' },
};

export type CompressPdfUi = typeof ui;

const content: ToolContent<CompressPdfUi> = {
  name: 'Compress PDF',
  tagline: 'Reduce PDF file size by optimizing images and document structure.',
  description:
    'Make PDFs smaller for email and uploads by recompressing images and cleaning up the document structure. Text stays sharp, and your file never leaves your device.',
  seo: {
    title: 'Compress PDF Online – Reduce PDF Size Free',
    description:
      'Reduce PDF file size for free by recompressing images and optimizing the document structure. Choose the level; your PDF is processed in your browser, not uploaded.',
  },
  keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf compressor', 'make pdf smaller', 'optimize pdf', 'pdf size reducer'],
  aliases: ['reduce pdf', 'minimize pdf', 'pdf smaller', 'lower pdf size', 'compress pdf file', 'pdf too big'],
  howTo: [
    { title: 'Add your PDF', text: 'Drop the file onto the page or choose it from your device.' },
    { title: 'Pick a level', text: 'Recommended works for most documents. Strong shrinks images further. For scans, you can also convert pages to images.' },
    { title: 'Compress and download', text: 'Compare the before and after size, then download your smaller PDF.' },
  ],
  about: [
    'Most of a large PDF’s size usually comes from embedded photos and scans. Compress PDF recompresses those JPEG images at a lower quality and, when they are larger than needed, reduces their resolution. Text, fonts and vector graphics are left untouched, so they stay sharp and selectable.',
    'The document structure is also rewritten more efficiently: unused leftovers from earlier edits are removed and objects are packed into compressed streams. For scanned documents, the optional “convert pages to images” mode renders every page as a JPEG, which gives the strongest reduction.',
    'Results depend on the file. A PDF that is mostly text, or already optimized, may barely shrink. When a smaller file isn’t possible, we tell you and keep your original instead of handing you a bigger file.',
  ],
  limitations: [
    'Only JPEG images in RGB or grayscale are recompressed. Other image types (CMYK, JPEG 2000, masks) are kept as they are.',
    'Converting pages to images removes selectable text, links and form fields, so use it only for scans or when size matters most.',
    'Password-protected PDFs can’t be compressed, and PDF/A archival compliance is not preserved.',
    'Up to 200 MB per PDF. Conversion to images handles up to 300 pages.',
  ],
  faq: [
    {
      question: 'How much smaller will my PDF get?',
      answer:
        'It depends on the content. PDFs with many photos or scans often shrink by 40–80%. Text-only PDFs are usually small already and may change very little. You’ll always see the exact before and after size.',
    },
    {
      question: 'Will the text still be readable and selectable?',
      answer:
        'Yes, with the default mode. Only images are recompressed; text and vector graphics are not touched. The optional “convert pages to images” mode is the exception, and it is clearly marked.',
    },
    {
      question: 'Is my PDF uploaded to a server?',
      answer: 'No. Compression runs entirely in your browser on your device. The file is never sent anywhere.',
    },
    {
      question: 'Which compression level should I choose?',
      answer:
        'Recommended balances size and quality for sharing by email or uploading to forms. Light keeps images closer to the original. Strong is best when you need the smallest possible file.',
    },
    {
      question: 'Why did my file not get smaller?',
      answer:
        'Some PDFs are already well optimized, or contain mostly text and vector graphics that don’t benefit from recompression. In that case we keep your original rather than making it bigger.',
    },
  ],
  ui,
};

export default content;
