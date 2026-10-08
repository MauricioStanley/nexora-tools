import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'to-webp',
  category: 'image',
  icon: 'convert',
  order: 140,
  status: 'live',
  featured: false,
  popular: false,
  executionMode: 'client',
  input: {
    kind: 'files',
    accept: ['jpeg', 'png'],
    multiple: true,
    minFiles: 1,
    maxFiles: 50,
    maxFileSizeMB: 40,
    maxTotalSizeMB: 300,
    allowPaste: true,
  },
  output: ['webp', 'zip'],
  relatedToolIds: ['compress-image', 'resize-image', 'webp-to-jpg'],
  premiumFeatures: ['batchProcessing'],
  slugs: { en: 'to-webp', es: 'a-webp' },
  dateModified: '2026-09-19',
  schema: { applicationCategory: 'MultimediaApplication' },
};

export default meta;
