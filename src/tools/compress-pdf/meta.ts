import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'compress-pdf',
  category: 'pdf',
  icon: 'compress',
  order: 30,
  status: 'live',
  featured: true,
  popular: true,
  executionMode: 'client',
  input: {
    kind: 'files',
    accept: ['pdf'],
    multiple: false,
    minFiles: 1,
    maxFiles: 1,
    maxFileSizeMB: 200,
  },
  output: ['pdf'],
  relatedToolIds: ['merge-pdf', 'split-pdf', 'compress-image'],
  premiumFeatures: ['largerFiles', 'advancedCompression', 'batchProcessing'],
  slugs: { en: 'compress-pdf', es: 'comprimir-pdf' },
  dateModified: '2026-09-18',
  schema: { applicationCategory: 'UtilitiesApplication' },
};

export default meta;
