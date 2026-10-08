import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'qr-code-generator',
  category: 'utility',
  icon: 'qr',
  order: 210,
  status: 'live',
  featured: true,
  popular: true,
  executionMode: 'client',
  input: {
    kind: 'none',
    accept: [],
    multiple: false,
    minFiles: 0,
    maxFiles: 0,
    maxFileSizeMB: 0,
  },
  output: ['png', 'svg'],
  // QR images are often printed or resized for a specific layout.
  relatedToolIds: ['jpg-to-pdf', 'resize-image'],
  premiumFeatures: ['premiumUtilities'],
  slugs: { en: 'qr-code-generator', es: 'generador-qr' },
  dateModified: '2026-09-19',
  schema: { applicationCategory: 'DesignApplication' },
};

export default meta;
