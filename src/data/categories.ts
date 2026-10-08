import type { Locale } from '@/config/site';
import type { IconName } from '@/lib/icons';

/**
 * Category registry. Adding a category = add an entry here (and translate it).
 * Categories are pages (`/en/categories/<slug>/`), navigation groups and search facets.
 */
export interface CategoryContent {
  name: string;
  /** Short label for chips/nav. */
  shortName: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  /** Terms that help search match the whole category (e.g. "photo", "foto"). */
  keywords: string[];
}

export interface CategoryDefinition {
  id: string;
  icon: IconName;
  order: number;
  /** Visual accent hue (used as a subtle tint on icon tiles only). */
  hue: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
  content: Record<Locale, CategoryContent>;
}

export const categories = [
  {
    id: 'pdf',
    icon: 'file-pdf',
    order: 10,
    hue: 'rose',
    content: {
      en: {
        name: 'PDF',
        shortName: 'PDF',
        slug: 'pdf',
        description: 'Merge, split, compress and convert PDF files in your browser.',
        seoTitle: 'Free PDF tools: merge, split, compress and convert',
        seoDescription:
          'Free online PDF tools that run in your browser: merge, split and compress PDFs, and convert between PDF and JPG. No uploads, no sign-up.',
        keywords: ['pdf', 'document', 'documents', 'acrobat'],
      },
      es: {
        name: 'PDF',
        shortName: 'PDF',
        slug: 'pdf',
        description: 'Une, divide, comprime y convierte archivos PDF en tu navegador.',
        seoTitle: 'Herramientas PDF gratis: unir, dividir, comprimir y convertir',
        seoDescription:
          'Herramientas PDF online y gratuitas que funcionan en tu navegador: une, divide y comprime PDF y convierte entre PDF y JPG. Sin subidas ni registro.',
        keywords: ['pdf', 'documento', 'documentos', 'acrobat'],
      },
    },
  },
  {
    id: 'image',
    icon: 'image',
    order: 20,
    hue: 'violet',
    content: {
      en: {
        name: 'Image',
        shortName: 'Images',
        slug: 'image',
        description: 'Compress, resize and convert JPG, PNG and WebP images.',
        seoTitle: 'Free image tools: compress, resize and convert images',
        seoDescription:
          'Free online image tools: compress and resize photos, convert WebP to JPG and JPG or PNG to WebP. Processed on your device, no sign-up.',
        keywords: ['image', 'images', 'photo', 'photos', 'picture', 'pictures', 'jpg', 'png', 'webp'],
      },
      es: {
        name: 'Imagen',
        shortName: 'Imágenes',
        slug: 'imagen',
        description: 'Comprime, redimensiona y convierte imágenes JPG, PNG y WebP.',
        seoTitle: 'Herramientas de imagen gratis: comprimir, redimensionar y convertir',
        seoDescription:
          'Herramientas de imagen online y gratuitas: comprime y redimensiona fotos, convierte WebP a JPG y JPG o PNG a WebP. Procesado en tu dispositivo.',
        keywords: ['imagen', 'imagenes', 'foto', 'fotos', 'fotografia', 'jpg', 'png', 'webp'],
      },
    },
  },
  {
    id: 'utility',
    icon: 'grid',
    order: 30,
    hue: 'emerald',
    content: {
      en: {
        name: 'Utility',
        shortName: 'Utilities',
        slug: 'utility',
        description: 'Handy everyday generators and helpers, starting with QR codes.',
        seoTitle: 'Free online utilities: QR code generator and more',
        seoDescription:
          'Free everyday online utilities from {product}, starting with a private QR code generator for links, text, Wi-Fi, email and phone numbers.',
        keywords: ['utility', 'utilities', 'generator', 'tools'],
      },
      es: {
        name: 'Utilidades',
        shortName: 'Utilidades',
        slug: 'utilidades',
        description: 'Generadores y ayudantes útiles para el día a día, empezando por los códigos QR.',
        seoTitle: 'Utilidades online gratis: generador de códigos QR y más',
        seoDescription:
          'Utilidades online gratuitas de {product}, empezando por un generador de códigos QR privado para enlaces, texto, Wi-Fi, correo y teléfono.',
        keywords: ['utilidad', 'utilidades', 'generador', 'herramientas'],
      },
    },
  },
] as const satisfies readonly CategoryDefinition[];

export type CategoryId = (typeof categories)[number]['id'];

const byId = new Map<string, CategoryDefinition>(categories.map((c) => [c.id, c]));

export function getCategory(id: string): CategoryDefinition {
  const category = byId.get(id);
  if (!category) throw new Error(`Unknown category "${id}"`);
  return category;
}

export function getCategories(): CategoryDefinition[] {
  return [...categories].sort((a, b) => a.order - b.order);
}
