import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'png-to-jpg',
  category: 'image',
  icon: 'convert',
  order: 133,
  status: 'live',
  featured: false,
  popular: false,
  executionMode: 'client',
  input: {
    kind: 'files',
    accept: ['png'],
    multiple: true,
    minFiles: 1,
    maxFiles: 50,
    maxFileSizeMB: 40,
    maxTotalSizeMB: 300,
    allowPaste: true,
  },
  output: ['jpeg', 'zip'],
  relatedToolIds: ['compress-image', 'resize-image', 'jpg-to-pdf', 'jpg-to-png'],
  premiumFeatures: ['batchProcessing'],
  slugs: { en: 'png-to-jpg', es: 'png-a-jpg' },
  dateModified: '2026-10-13',
  schema: { applicationCategory: 'MultimediaApplication' },
};

export default meta;
