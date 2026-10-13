import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'add-page-numbers',
  category: 'pdf',
  icon: 'hash',
  order: 80,
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
  relatedToolIds: ['merge-pdf', 'watermark-pdf', 'compress-pdf', 'rotate-pdf'],
  premiumFeatures: ['largerFiles'],
  slugs: { en: 'add-page-numbers', es: 'numerar-paginas-pdf' },
  dateModified: '2026-10-13',
  schema: { applicationCategory: 'BusinessApplication' },
};

export default meta;
