import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'jpg-to-png',
  category: 'image',
  icon: 'convert',
  order: 136,
  status: 'live',
  featured: false,
  popular: false,
  executionMode: 'client',
  input: {
    kind: 'files',
    accept: ['jpeg'],
    multiple: true,
    minFiles: 1,
    maxFiles: 50,
    maxFileSizeMB: 40,
    maxTotalSizeMB: 300,
    allowPaste: true,
  },
  output: ['png', 'zip'],
  relatedToolIds: ['resize-image', 'png-to-jpg', 'compress-image', 'to-webp'],
  premiumFeatures: ['batchProcessing'],
  slugs: { en: 'jpg-to-png', es: 'jpg-a-png' },
  dateModified: '2026-10-13',
  schema: { applicationCategory: 'MultimediaApplication' },
};

export default meta;
