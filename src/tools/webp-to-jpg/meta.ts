import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'webp-to-jpg',
  category: 'image',
  icon: 'convert',
  order: 130,
  status: 'live',
  featured: false,
  popular: true,
  executionMode: 'client',
  input: {
    kind: 'files',
    accept: ['webp'],
    multiple: true,
    minFiles: 1,
    maxFiles: 50,
    maxFileSizeMB: 40,
    maxTotalSizeMB: 300,
    allowPaste: true,
  },
  output: ['jpeg', 'zip'],
  relatedToolIds: ['resize-image', 'compress-image', 'jpg-to-pdf'],
  premiumFeatures: ['batchProcessing'],
  slugs: { en: 'webp-to-jpg', es: 'webp-a-jpg' },
  dateModified: '2026-09-19',
  schema: { applicationCategory: 'MultimediaApplication' },
};

export default meta;
