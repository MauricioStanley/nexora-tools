import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'split-pdf',
  category: 'pdf',
  icon: 'scissors',
  order: 20,
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
  output: ['pdf', 'zip'],
  relatedToolIds: ['merge-pdf', 'compress-pdf', 'pdf-to-jpg'],
  premiumFeatures: ['largerFiles'],
  slugs: { en: 'split-pdf', es: 'dividir-pdf' },
  dateModified: '2026-09-18',
  schema: { applicationCategory: 'UtilitiesApplication' },
};

export default meta;
