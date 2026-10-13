import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'rotate-pdf',
  category: 'pdf',
  icon: 'rotate',
  order: 60,
  status: 'live',
  featured: false,
  popular: false,
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
  relatedToolIds: ['merge-pdf', 'compress-pdf', 'add-page-numbers', 'remove-pdf-pages'],
  premiumFeatures: ['largerFiles'],
  slugs: { en: 'rotate-pdf', es: 'rotar-pdf' },
  dateModified: '2026-10-13',
  schema: { applicationCategory: 'UtilitiesApplication' },
};

export default meta;
