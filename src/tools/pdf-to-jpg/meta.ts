import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'pdf-to-jpg',
  category: 'pdf',
  icon: 'image-down',
  order: 50,
  status: 'live',
  featured: false,
  popular: true,
  executionMode: 'client',
  input: {
    kind: 'files',
    accept: ['pdf'],
    multiple: false,
    minFiles: 1,
    maxFiles: 1,
    maxFileSizeMB: 150,
  },
  output: ['jpeg', 'zip'],
  relatedToolIds: ['compress-image', 'resize-image', 'split-pdf'],
  premiumFeatures: ['largerFiles'],
  slugs: { en: 'pdf-to-jpg', es: 'pdf-a-jpg' },
  dateModified: '2026-09-18',
  schema: { applicationCategory: 'MultimediaApplication' },
};

export default meta;
