import type { ToolContent } from '../../types';

const ui = {
  action: 'Convert to WebP',
  dropTitle: 'Drop your JPG or PNG images here',
  qualityHint: 'Around 80% gives a great balance for photos. Use higher values for graphics with text.',
  encoderNote: 'Your browser can’t create WebP images natively, so a WebP encoder (about 300 KB) will be downloaded the first time you convert.',
  zipName: 'converted-webp.zip',
  downloadLabel: 'Download WebP',
  summary: { one: '{count} image converted to WebP', other: '{count} images converted to WebP' },
};

export type ToWebpUi = typeof ui;

const content: ToolContent<ToWebpUi> = {
  name: 'JPG / PNG to WebP',
  tagline: 'Convert JPG and PNG images to lightweight WebP for faster websites.',
  description:
    'Convert JPG and PNG images to WebP, the modern format that keeps quality while cutting file size. Great for websites and apps. Conversion happens right in your browser.',
  seo: {
    title: 'Convert JPG and PNG to WebP – Free Online',
    description:
      'Convert JPG and PNG images to WebP for free. Smaller files for faster websites, with adjustable quality and transparency preserved. Batch convert in your browser.',
  },
  keywords: ['jpg to webp', 'png to webp', 'convert to webp', 'webp converter', 'image to webp', 'jpeg to webp', 'convert image to webp'],
  aliases: ['make webp', 'webp for website', 'optimize images for web', 'photo to webp', 'save as webp'],
  howTo: [
    { title: 'Add images', text: 'Drop JPG or PNG files, choose them from your device, or paste an image.' },
    { title: 'Choose quality', text: 'Set the WebP quality. 80% is a great starting point for photos.' },
    { title: 'Convert and download', text: 'Compare sizes and download each WebP, or all of them as a ZIP.' },
  ],
  about: [
    'WebP is an image format designed for the web. At similar visual quality, WebP files are usually 25–35% smaller than JPG and often much smaller than PNG, which makes pages load faster and saves bandwidth.',
    'PNG transparency is preserved. The conversion uses your browser’s built-in encoder when available; where it isn’t (Safari), a WebP encoder built from Google’s open-source codec is downloaded once and runs locally. Images are never uploaded.',
  ],
  limitations: [
    'For some PNG graphics that are already tiny, WebP may not be smaller. Sizes are shown so you can decide.',
    'On Safari, the first conversion downloads a WebP encoder (about 300 KB) and can be slower than on other browsers.',
    'Up to 50 images per batch, 40 MB each.',
  ],
  faq: [
    {
      question: 'Is WebP supported everywhere?',
      answer: 'All modern browsers support WebP, including Chrome, Edge, Firefox and Safari. Some older apps and editors may not, so keep your originals.',
    },
    {
      question: 'Does converting to WebP keep transparency?',
      answer: 'Yes. Transparent areas in PNG images stay transparent in the WebP result.',
    },
    {
      question: 'Are my images uploaded?',
      answer: 'No. Images are converted in your browser on your device. Even the Safari encoder runs locally after it’s downloaded.',
    },
    {
      question: 'What quality should I use?',
      answer: '75–85% works well for photos. For logos, screenshots or images with text, try 90% or higher to keep edges crisp.',
    },
  ],
  ui,
};

export default content;
