import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'password-generator',
  category: 'utility',
  icon: 'key',
  order: 220,
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
  relatedToolIds: ['qr-code-generator', 'word-counter'],
  premiumFeatures: ['premiumUtilities'],
  slugs: { en: 'password-generator', es: 'generador-de-contrasenas' },
  dateModified: '2026-10-13',
  schema: { applicationCategory: 'UtilitiesApplication' },
};

export default meta;
