import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'watermark-pdf',
  category: 'pdf',
  icon: 'droplet',
  order: 90,
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
  relatedToolIds: ['add-page-numbers', 'compress-pdf', 'merge-pdf', 'pdf-to-jpg'],
  premiumFeatures: ['largerFiles'],
  slugs: { en: 'watermark-pdf', es: 'marca-de-agua-pdf' },
  dateModified: '2026-10-13',
  schema: { applicationCategory: 'BusinessApplication' },
};

export default meta;
