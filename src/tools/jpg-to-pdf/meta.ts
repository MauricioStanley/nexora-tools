import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'jpg-to-pdf',
  category: 'pdf',
  icon: 'file-image',
  order: 40,
  status: 'live',
  featured: false,
  popular: true,
  executionMode: 'client',
  input: {
    kind: 'files',
    accept: ['jpeg', 'png', 'webp'],
    multiple: true,
    minFiles: 1,
    maxFiles: 100,
    maxFileSizeMB: 40,
    maxTotalSizeMB: 400,
    allowPaste: true,
  },
  output: ['pdf'],
  relatedToolIds: ['compress-pdf', 'merge-pdf', 'compress-image'],
  premiumFeatures: ['largerFiles', 'batchProcessing'],
  slugs: { en: 'jpg-to-pdf', es: 'jpg-a-pdf' },
  dateModified: '2026-09-18',
  schema: { applicationCategory: 'UtilitiesApplication' },
};

export default meta;
