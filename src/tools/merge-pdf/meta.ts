import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'merge-pdf',
  category: 'pdf',
  icon: 'merge',
  order: 10,
  status: 'live',
  featured: true,
  popular: true,
  executionMode: 'client',
  input: {
    kind: 'files',
    accept: ['pdf'],
    multiple: true,
    minFiles: 2,
    maxFiles: 50,
    maxFileSizeMB: 150,
    maxTotalSizeMB: 400,
  },
  output: ['pdf'],
  relatedToolIds: ['compress-pdf', 'split-pdf', 'jpg-to-pdf'],
  premiumFeatures: ['largerFiles', 'batchProcessing'],
  slugs: { en: 'merge-pdf', es: 'unir-pdf' },
  dateModified: '2026-09-18',
  schema: { applicationCategory: 'UtilitiesApplication' },
};

export default meta;
