import type { ToolContent } from '../../types';

const ui = {
  action: 'Convert to JPG',
  dropTitle: 'Drop your PNG images here',
  background: 'Background for transparent areas',
  backgroundHint: 'JPG doesn’t support transparency, so transparent pixels are filled with this color.',
  zipName: 'converted-jpg.zip',
  downloadLabel: 'Download JPG',
  summary: { one: '{count} image converted to JPG', other: '{count} images converted to JPG' },
};

export type PngToJpgUi = typeof ui;

const content: ToolContent<PngToJpgUi> = {
  name: 'PNG to JPG',
  tagline: 'Convert PNG images to smaller, universally compatible JPG files.',
  description:
    'Turn PNG images into JPG files that are smaller and accepted everywhere: email, forms, social networks and printers. Convert in batches without uploading anything.',
  seo: {
    title: 'PNG to JPG Converter – Free, Fast and Private',
    description:
      'Convert PNG to JPG online for free. Batch convert, choose the quality and a background color for transparency, and download instantly. Nothing is uploaded.',
  },
  keywords: ['png to jpg', 'png to jpeg', 'convert png to jpg', 'png to jpg converter', 'change png to jpg', 'save png as jpg'],
  aliases: ['png jpg', 'png image to jpg', 'turn png into jpg', 'png to jpg online', 'convert png images', 'png to jpg without losing quality'],
  howTo: [
    { title: 'Add PNG images', text: 'Drop one or more PNG files, paste a screenshot, or choose images from your device.' },
    { title: 'Choose quality', text: 'Pick the JPG quality and the color used for transparent areas.' },
    { title: 'Convert and download', text: 'Download each JPG, or all of them together as a ZIP.' },
  ],
  about: [
    'PNG is great for screenshots and graphics, but its files can be large and some sites only accept JPG. This tool re-encodes your PNG images as standard JPG files, usually much smaller.',
    'JPG has no transparency, so transparent areas are filled with the background color you choose (white by default). Everything happens in your browser, so your images never leave your device.',
  ],
  limitations: [
    'Transparency is replaced by a solid background color.',
    'JPG is a lossy format: sharp text and flat graphics can show slight artifacts at lower quality.',
    'Up to 50 images per batch, 40 MB each.',
  ],
  faq: [
    {
      question: 'Why convert PNG to JPG?',
      answer: 'JPG files are usually much smaller than PNG for photos and are accepted by virtually every website, app and printer.',
    },
    {
      question: 'What happens to transparent backgrounds?',
      answer: 'JPG can’t store transparency, so transparent pixels are filled with the background color you choose. White is the default.',
    },
    {
      question: 'Will I lose quality?',
      answer: 'At 90% the difference is practically invisible for photos. For screenshots with small text, use 95–100% to keep edges crisp.',
    },
    {
      question: 'Are my images uploaded?',
      answer: 'No. The conversion runs in your browser on your device. Your images are never sent anywhere.',
    },
  ],
  ui,
};

export default content;
