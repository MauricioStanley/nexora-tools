import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'resize-image',
  category: 'image',
  icon: 'resize',
  order: 120,
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
  relatedToolIds: ['compress-image', 'to-webp', 'jpg-to-pdf'],
  premiumFeatures: ['largerFiles', 'batchProcessing'],
  slugs: { en: 'resize-image', es: 'redimensionar-imagen' },
  dateModified: '2026-09-19',
  schema: { applicationCategory: 'MultimediaApplication' },
};

export default meta;
