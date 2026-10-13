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
        description: 'Merge, split, compress, rotate, number and watermark PDF files in your browser.',
        seoTitle: 'Free PDF tools: merge, split, compress, rotate and more',
        seoDescription:
          'Free online PDF tools that run in your browser: merge, split, compress and rotate PDFs, remove pages, add page numbers and watermarks. No uploads, no sign-up.',
        keywords: ['pdf', 'document', 'documents', 'acrobat'],
      },
      es: {
        name: 'PDF',
        shortName: 'PDF',
        slug: 'pdf',
        description: 'Une, divide, comprime, rota, numera y pon marcas de agua a tus PDF en el navegador.',
        seoTitle: 'Herramientas PDF gratis: unir, dividir, comprimir, rotar y más',
        seoDescription:
          'Herramientas PDF online y gratuitas en tu navegador: une, divide, comprime y rota PDF, elimina páginas, numéralas y añade marcas de agua. Sin subidas ni registro.',
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
        description: 'Compress, resize, rotate and convert JPG, PNG and WebP images.',
        seoTitle: 'Free image tools: compress, resize, rotate and convert',
        seoDescription:
          'Free online image tools: compress, resize and rotate photos, and convert between JPG, PNG and WebP. Processed on your device, no sign-up.',
        keywords: ['image', 'images', 'photo', 'photos', 'picture', 'pictures', 'jpg', 'png', 'webp'],
      },
      es: {
        name: 'Imagen',
        shortName: 'Imágenes',
        slug: 'imagen',
        description: 'Comprime, redimensiona, rota y convierte imágenes JPG, PNG y WebP.',
        seoTitle: 'Herramientas de imagen gratis: comprimir, rotar y convertir',
        seoDescription:
          'Herramientas de imagen online y gratuitas: comprime, redimensiona y rota fotos, y convierte entre JPG, PNG y WebP. Procesado en tu dispositivo.',
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
        description: 'Handy everyday helpers: QR codes, strong passwords and word counts.',
        seoTitle: 'Free online utilities: QR codes, passwords and word counter',
        seoDescription:
          'Free everyday online utilities from {product}: a QR code generator, a strong password generator and a word counter. Private: nothing leaves your device.',
        keywords: ['utility', 'utilities', 'generator', 'tools', 'text'],
      },
      es: {
        name: 'Utilidades',
        shortName: 'Utilidades',
        slug: 'utilidades',
        description: 'Ayudantes útiles para el día a día: códigos QR, contraseñas seguras y recuento de palabras.',
        seoTitle: 'Utilidades online gratis: códigos QR, contraseñas y palabras',
        seoDescription:
          'Utilidades online gratuitas de {product}: generador de códigos QR, generador de contraseñas seguras y contador de palabras. Privadas: nada sale de tu equipo.',
        keywords: ['utilidad', 'utilidades', 'generador', 'herramientas', 'texto'],
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
