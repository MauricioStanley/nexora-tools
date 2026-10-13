import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'word-counter',
  category: 'utility',
  icon: 'type',
  order: 230,
  status: 'live',
  featured: false,
  popular: false,
  executionMode: 'client',
  input: {
    kind: 'none',
    accept: [],
    multiple: false,
    minFiles: 0,
    maxFiles: 0,
    maxFileSizeMB: 0,
  },
  output: [],
  relatedToolIds: ['password-generator', 'qr-code-generator'],
  premiumFeatures: ['premiumUtilities'],
  slugs: { en: 'word-counter', es: 'contador-de-palabras' },
  dateModified: '2026-10-13',
  schema: { applicationCategory: 'UtilitiesApplication' },
};

export default meta;
