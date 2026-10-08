import type { ToolContent } from '../../types';

const ui = {
  action: 'Compress images',
  actionSingle: 'Compress image',
  dropTitle: 'Drop your images here',
  format: 'Output format',
  formatSame: 'Original',
  formatJpg: 'JPG',
  formatWebp: 'WebP',
  formatHint: 'WebP usually gives the smallest files. PNG stays lossless when kept in its original format.',
  pngOnlyHint: 'PNG is a lossless format, so quality doesn’t apply. Choose JPG or WebP for much bigger savings.',
  maxSize: 'Maximum dimensions',
  maxSizeOriginal: 'Keep original size',
  maxSizeOption: 'Longest side {size} px',
  zipName: 'compressed-images.zip',
  suffix: 'compressed',
  downloadLabel: 'Download image',
  summary: { one: '{count} image compressed', other: '{count} images compressed' },
};

export type CompressImageUi = typeof ui;

const content: ToolContent<CompressImageUi> = {
  name: 'Compress Image',
  tagline: 'Reduce the file size of JPG, PNG and WebP images with adjustable quality.',
  description:
    'Make photos and graphics smaller for websites, email and messaging. Adjust quality, optionally resize, and compare sizes before downloading. Images never leave your device.',
  seo: {
    title: 'Compress Images Online – JPG, PNG, WebP',
    description:
      'Reduce image file size for free. Compress JPG, PNG and WebP with adjustable quality, convert to WebP for bigger savings, and batch process. No uploads, no sign-up.',
  },
  keywords: ['compress image', 'image compressor', 'reduce image size', 'compress jpg', 'compress png', 'compress photo', 'optimize image', 'shrink image'],
  aliases: ['make image smaller', 'reduce photo size', 'compress picture', 'lower image size', 'image optimizer', 'resize image file size'],
  howTo: [
    { title: 'Add images', text: 'Drop one or more JPG, PNG or WebP files, choose them from your device, or paste an image.' },
    { title: 'Adjust settings', text: 'Pick the quality and output format. Optionally limit the maximum dimensions for extra savings.' },
    { title: 'Compress and download', text: 'See how much each image shrank, then download them individually or as a ZIP.' },
  ],
  about: [
    'Compress Image re-encodes your images with modern browser encoders at the quality you choose. Lower quality means smaller files; around 70–80% is usually indistinguishable from the original on screen.',
    'For the biggest savings, convert to WebP, which is typically 25–35% smaller than JPG at similar quality and is supported by all modern browsers. Limiting the maximum dimensions also helps a lot with large camera photos.',
    'If a compressed version would be larger than your original, we keep the original instead. Compressed images are created without metadata, so location (GPS) and camera details are removed.',
  ],
  limitations: [
    'PNG files kept as PNG are re-encoded losslessly, which often saves little. Converting to JPG or WebP saves far more but removes transparency in JPG.',
    'Animated WebP images are converted as a still image (first frame).',
    'Up to 30 images per batch, 40 MB each and 300 MB in total.',
  ],
  faq: [
    {
      question: 'What quality setting should I use?',
      answer:
        '75% is a good default for photos: files are much smaller and differences are hard to see. Go higher for images with fine text or sharp edges, lower if size matters most.',
    },
    {
      question: 'Are my images uploaded to a server?',
      answer: 'No. Compression happens in your browser on your own device. Your images are never sent anywhere.',
    },
    {
      question: 'Why didn’t my image get smaller?',
      answer:
        'Some images are already heavily optimized. When our result would be larger than your original, we keep the original so you never download a bigger file. Try WebP or a lower quality.',
    },
    {
      question: 'Does compression remove photo metadata?',
      answer:
        'Yes. Compressed images are created fresh without EXIF data such as GPS location, camera model or capture date. Originals kept unchanged still contain their metadata.',
    },
    {
      question: 'Can I compress many images at once?',
      answer: 'Yes. Add up to 30 images and download them one by one or all together as a ZIP file.',
    },
  ],
  ui,
};

export default content;
