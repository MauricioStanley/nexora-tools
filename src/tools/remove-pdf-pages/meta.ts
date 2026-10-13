import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'remove-pdf-pages',
  category: 'pdf',
  icon: 'file-minus',
  order: 70,
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
  relatedToolIds: ['split-pdf', 'merge-pdf', 'compress-pdf', 'rotate-pdf'],
  premiumFeatures: ['largerFiles'],
  slugs: { en: 'remove-pdf-pages', es: 'eliminar-paginas-pdf' },
  dateModified: '2026-10-13',
  schema: { applicationCategory: 'UtilitiesApplication' },
};

export default meta;
