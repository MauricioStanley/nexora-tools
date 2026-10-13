import type { ToolContent } from '../../types';

const ui = {
  action: 'Rotate images',
  dropTitle: 'Drop your images here',
  rotation: 'Rotation',
  none: 'None',
  right: 'Right',
  upsideDown: 'Upside down',
  left: 'Left',
  flipH: 'Mirror horizontally',
  flipV: 'Flip vertically',
  previewCaption: 'Preview',
  previewFirst: 'Preview of the first image',
  chooseTransform: 'Choose a rotation or a flip.',
  suffix: 'rotated',
  zipName: 'rotated-images.zip',
  downloadLabel: 'Download image',
  summary: { one: '{count} image rotated', other: '{count} images rotated' },
};

export type RotateImageUi = typeof ui;

const content: ToolContent<RotateImageUi> = {
  name: 'Rotate Image',
  tagline: 'Rotate or flip JPG, PNG and WebP images, one or many at once.',
  description:
    'Turn photos the right way up, or mirror them horizontally or vertically. Rotate many images at once, keep their format, and see a live preview.',
  seo: {
    title: 'Rotate Image Online – Rotate and Flip Photos Free',
    description:
      'Rotate images 90° or 180° and flip them horizontally or vertically. Batch rotate JPG, PNG and WebP with a live preview. Free and processed on your device.',
  },
  keywords: ['rotate image', 'rotate photo', 'flip image', 'rotate picture', 'rotate jpg', 'mirror image', 'rotate png'],
  aliases: ['turn image', 'rotate image online', 'flip photo horizontally', 'mirror photo', 'rotate image 90 degrees', 'fix sideways photo'],
  howTo: [
    { title: 'Add images', text: 'Drop one or more JPG, PNG or WebP images, paste one, or choose them from your device.' },
    { title: 'Choose the rotation', text: 'Rotate right, left or upside down, and mirror horizontally or vertically if needed. The preview shows the result.' },
    { title: 'Download', text: 'Download each image, or all of them together as a ZIP.' },
  ],
  about: [
    'Rotate Image turns photos and graphics in 90° steps and mirrors them horizontally or vertically. The same change is applied to every image in the batch.',
    'Each image keeps its format: a JPG stays a JPG and a PNG keeps its transparency. Photos are first shown the way the camera intended, so the result matches what you see.',
  ],
  limitations: [
    'Rotation is in 90° steps. Small angles to straighten a horizon are not supported.',
    'JPG and WebP images are re-saved at high quality, which can change the file size slightly.',
    'Up to 50 images per batch, 40 MB each.',
  ],
  faq: [
    {
      question: 'Are my images uploaded?',
      answer: 'No. Images are rotated in your browser on your own device and never sent anywhere.',
    },
    {
      question: 'Can I rotate several photos at once?',
      answer: 'Yes. Add up to 50 images and they are all rotated the same way. Download them one by one or as a ZIP.',
    },
    {
      question: 'What’s the difference between rotating and flipping?',
      answer: 'Rotating turns the image like a steering wheel. Flipping mirrors it, like a reflection: horizontally swaps left and right, vertically swaps top and bottom.',
    },
    {
      question: 'Will my PNG keep its transparent background?',
      answer: 'Yes. PNG and WebP images keep their transparency after rotating.',
    },
  ],
  ui,
};

export default content;
