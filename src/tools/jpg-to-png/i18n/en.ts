import type { ToolContent } from '../../types';

const ui = {
  action: 'Convert to PNG',
  dropTitle: 'Drop your JPG images here',
  sizeNote: 'PNG files are lossless, so they are usually larger than the JPG.',
  zipName: 'converted-png.zip',
  downloadLabel: 'Download PNG',
  summary: { one: '{count} image converted to PNG', other: '{count} images converted to PNG' },
};

export type JpgToPngUi = typeof ui;

const content: ToolContent<JpgToPngUi> = {
  name: 'JPG to PNG',
  tagline: 'Convert JPG photos to PNG for editing, design tools and lossless saving.',
  description:
    'Convert JPG images to PNG, the lossless format that design tools, editors and many upload forms prefer. Convert in batches, right in your browser.',
  seo: {
    title: 'JPG to PNG Converter – Free and Private',
    description:
      'Convert JPG to PNG online for free. Batch convert photos to lossless PNG files and download them one by one or as a ZIP. Processed in your browser, never uploaded.',
  },
  keywords: ['jpg to png', 'jpeg to png', 'convert jpg to png', 'jpg to png converter', 'change jpg to png', 'save jpg as png'],
  aliases: ['jpg png', 'photo to png', 'turn jpg into png', 'jpg to png online', 'convert jpeg images to png', 'jpg to png high quality'],
  howTo: [
    { title: 'Add JPG images', text: 'Drop one or more JPG files, paste an image, or choose photos from your device.' },
    { title: 'Convert', text: 'Press “Convert to PNG”. Each image is saved as a lossless PNG at its original size.' },
    { title: 'Download', text: 'Download each PNG, or all of them together as a ZIP.' },
  ],
  about: [
    'JPG to PNG re-saves your photos in the PNG format. PNG is lossless, so further edits and re-saves won’t add new compression artifacts, which makes it a good working format for design and editing.',
    'Images keep their dimensions and are rotated according to their camera orientation. The conversion runs in your browser, so your photos never leave your device.',
  ],
  limitations: [
    'Converting doesn’t restore detail already lost in the JPG compression.',
    'JPG has no transparency, so the PNG has a solid background. To remove a background you need a dedicated editor.',
    'PNG files are usually larger than the original JPG. Up to 50 images per batch, 40 MB each.',
  ],
  faq: [
    {
      question: 'Why convert JPG to PNG?',
      answer: 'Some editors, design tools and forms require PNG, and PNG doesn’t lose quality when you edit and save it again.',
    },
    {
      question: 'Will the PNG have a transparent background?',
      answer: 'No. A JPG has no transparency information, so the converted PNG keeps the same solid background as the photo.',
    },
    {
      question: 'Why is the PNG bigger than my JPG?',
      answer: 'PNG stores every pixel without lossy compression. That keeps the quality intact but usually produces a larger file, especially for photos.',
    },
    {
      question: 'Are my photos uploaded?',
      answer: 'No. The conversion happens in your browser on your device. Your photos are never sent anywhere.',
    },
  ],
  ui,
};

export default content;
