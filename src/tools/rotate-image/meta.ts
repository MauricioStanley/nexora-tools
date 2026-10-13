import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'rotate-image',
  category: 'image',
  icon: 'rotate',
  order: 150,
  status: 'live',
  featured: false,
  popular: false,
  executionMode: 'client',
  input: {
    kind: 'files',
    accept: ['jpeg', 'png', 'webp'],
    multiple: true,
    minFiles: 1,
    maxFiles: 50,
    maxFileSizeMB: 40,
    maxTotalSizeMB: 300,
    allowPaste: true,
  },
  output: ['jpeg', 'png', 'webp', 'zip'],
  relatedToolIds: ['resize-image', 'compress-image', 'jpg-to-pdf', 'rotate-pdf'],
  premiumFeatures: ['batchProcessing'],
  slugs: { en: 'rotate-image', es: 'rotar-imagen' },
  dateModified: '2026-10-13',
  schema: { applicationCategory: 'MultimediaApplication' },
};

export default meta;
