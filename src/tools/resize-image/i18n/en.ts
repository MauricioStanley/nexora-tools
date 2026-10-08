import type { ToolContent } from '../../types';

const ui = {
  action: 'Resize images',
  actionSingle: 'Resize image',
  dropTitle: 'Drop your images here',
  mode: 'Resize by',
  modePixels: 'Pixels',
  modePercent: 'Percentage',
  width: 'Width',
  height: 'Height',
  px: 'px',
  keepAspect: 'Keep aspect ratio',
  keepAspectHint: 'Prevents stretching. Each image fits inside the width and height you set.',
  percent: 'Scale',
  format: 'Output format',
  formatSame: 'Original',
  formatJpg: 'JPG',
  formatPng: 'PNG',
  formatWebp: 'WebP',
  resultSize: 'Result: {width} × {height} px',
  needSize: 'Enter a width or a height.',
  needBoth: 'Enter both width and height, or keep the aspect ratio.',
  invalidSize: 'Use values between 1 and {max} pixels.',
  zipName: 'resized-images.zip',
  suffix: 'resized',
  downloadLabel: 'Download image',
  summary: { one: '{count} image resized', other: '{count} images resized' },
};

export type ResizeImageUi = typeof ui;

const content: ToolContent<ResizeImageUi> = {
  name: 'Resize Image',
  tagline: 'Change image dimensions by pixels or percentage, one image or many.',
  description:
    'Resize JPG, PNG and WebP images to exact pixel dimensions or by percentage, with the aspect ratio locked or free. High-quality resampling, done entirely in your browser.',
  seo: {
    title: 'Resize Image Online – Change Size in Pixels',
    description:
      'Resize images to exact pixel dimensions or by percentage for free. Keep the aspect ratio, batch resize JPG, PNG and WebP, and download instantly. No uploads needed.',
  },
  keywords: ['resize image', 'image resizer', 'resize photo', 'change image size', 'resize picture', 'scale image', 'resize jpg', 'resize png'],
  aliases: ['make image smaller', 'change photo dimensions', 'reduce image dimensions', 'enlarge image', 'photo resizer', 'resize pixels'],
  howTo: [
    { title: 'Add images', text: 'Drop one or more JPG, PNG or WebP images, choose them from your device, or paste one.' },
    { title: 'Set the new size', text: 'Enter a width and/or height in pixels, or choose a percentage. Keep the aspect ratio locked to avoid stretching.' },
    { title: 'Resize and download', text: 'Download each resized image, or all of them together as a ZIP.' },
  ],
  about: [
    'Resize Image changes the pixel dimensions of your images using high-quality resampling, so downscaled photos stay sharp. It’s ideal for profile pictures, website images, marketplace listings and email attachments that must fit a size limit.',
    'With the aspect ratio locked, each image fits inside the box you define without being stretched. Unlock it to force exact dimensions. Resizing by percentage scales every image proportionally.',
  ],
  limitations: [
    'Enlarging images can’t add detail that isn’t there; upscaled images may look soft.',
    'Very large outputs may be limited by your device’s memory, especially on phones. You’ll be told if an image was scaled down to fit.',
    'Up to 30 images per batch, 40 MB each and 300 MB in total.',
  ],
  faq: [
    {
      question: 'Will resizing reduce the quality?',
      answer:
        'Making an image smaller keeps it sharp thanks to high-quality resampling. Making it larger can’t create new detail, so enlarged images may look softer.',
    },
    {
      question: 'How do I avoid stretched images?',
      answer:
        'Keep “Keep aspect ratio” enabled. The image is then scaled to fit inside the width and height you set, keeping its original proportions.',
    },
    {
      question: 'Can I resize several images at once?',
      answer: 'Yes. Add up to 30 images; the same size settings are applied to each, and you can download them together as a ZIP.',
    },
    {
      question: 'Are my images uploaded?',
      answer: 'No. Resizing happens in your browser on your own device. Nothing is sent to a server.',
    },
    {
      question: 'Does resizing also reduce the file size?',
      answer: 'Usually, yes: fewer pixels means a smaller file. For even smaller files, run the result through Compress Image.',
    },
  ],
  ui,
};

export default content;
