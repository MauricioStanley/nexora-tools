import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'compress-image',
  category: 'image',
  icon: 'compress',
  order: 110,
  status: 'live',
  featured: true,
  popular: true,
  executionMode: 'client',
  input: {
    kind: 'files',
    accept: ['jpeg', 'png', 'webp'],
    multiple: true,
    minFiles: 1,
    maxFiles: 30,
    maxFileSizeMB: 40,
    maxTotalSizeMB: 300,
    allowPaste: true,
  },
  output: ['jpeg', 'png', 'webp', 'zip'],
  relatedToolIds: ['resize-image', 'to-webp', 'jpg-to-pdf'],
  premiumFeatures: ['largerFiles', 'batchProcessing', 'advancedCompression'],
  slugs: { en: 'compress-image', es: 'comprimir-imagen' },
  dateModified: '2026-09-19',
  schema: { applicationCategory: 'MultimediaApplication' },
};

export default meta;
