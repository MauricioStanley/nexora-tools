import type { ToolContent } from '../../types';

const ui = {
  action: 'Convert to JPG',
  dropTitle: 'Drop your WebP images here',
  background: 'Background for transparent areas',
  backgroundHint: 'JPG doesn’t support transparency, so transparent pixels are filled with this color.',
  animatedNotice: { one: '{count} image is animated. Only its first frame will be converted.', other: '{count} images are animated. Only their first frame will be converted.' },
  animated: 'Animated',
  zipName: 'converted-jpg.zip',
  downloadLabel: 'Download JPG',
  summary: { one: '{count} image converted to JPG', other: '{count} images converted to JPG' },
};

export type WebpToJpgUi = typeof ui;

const content: ToolContent<WebpToJpgUi> = {
  name: 'WebP to JPG',
  tagline: 'Convert WebP images to widely compatible JPG files.',
  description:
    'Convert WebP images into JPG files that open everywhere, from older apps to printers and upload forms. Choose the quality, convert in batches, and keep your images on your device.',
  seo: {
    title: 'WebP to JPG Converter – Free and Private',
    description:
      'Convert WebP images to JPG for free. Batch convert, choose quality and background color for transparency, and download instantly. Processed in your browser.',
  },
  keywords: ['webp to jpg', 'webp to jpeg', 'convert webp', 'webp converter', 'webp to jpg converter', 'open webp', 'save webp as jpg'],
  aliases: ['change webp to jpg', 'webp image to jpg', 'webp to photo', 'webp jpg', 'convert webp images'],
  howTo: [
    { title: 'Add WebP images', text: 'Drop one or more WebP files or choose them from your device.' },
    { title: 'Choose quality', text: 'Pick the JPG quality and, if needed, the background color for transparent areas.' },
    { title: 'Convert and download', text: 'Download each JPG, or all of them together as a ZIP.' },
  ],
  about: [
    'WebP is a modern image format used by many websites, but some apps, editors and upload forms still only accept JPG. This tool decodes your WebP images and saves them as standard JPG files.',
    'Because JPG has no transparency, transparent areas are filled with a background color you choose (white by default). The conversion runs in your browser, so images are never uploaded.',
  ],
  limitations: [
    'Animated WebP images are converted as a still image using their first frame.',
    'Converting a lossy WebP to JPG can’t restore detail lost in the original compression.',
    'Up to 50 images per batch, 40 MB each.',
  ],
  faq: [
    {
      question: 'Why convert WebP to JPG?',
      answer: 'JPG works with virtually every app, device, printer and website form. Converting avoids “unsupported format” errors when WebP isn’t accepted.',
    },
    {
      question: 'What happens to transparent backgrounds?',
      answer: 'JPG doesn’t support transparency, so transparent pixels are filled with the background color you choose. White is the default.',
    },
    {
      question: 'Is the conversion private?',
      answer: 'Yes. Images are converted in your browser on your device and are never uploaded.',
    },
    {
      question: 'Which quality should I choose?',
      answer: '90% keeps images visually identical for most uses. Lower it for smaller files, or raise it for maximum fidelity.',
    },
  ],
  ui,
};

export default content;
