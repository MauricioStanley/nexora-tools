import { describe, expect, it } from 'vitest';
import { absoluteUrl, alternatesFor, getAllRoutes, pathFor } from '@/lib/routing';

describe('localized routing', () => {
  it('builds the documented tool URLs', () => {
    expect(pathFor({ kind: 'tool', toolId: 'merge-pdf' }, 'en')).toBe('/en/tools/pdf/merge-pdf/');
    expect(pathFor({ kind: 'tool', toolId: 'merge-pdf' }, 'es')).toBe('/es/herramientas/pdf/unir-pdf/');
    expect(pathFor({ kind: 'tool', toolId: 'resize-image' }, 'es')).toBe('/es/herramientas/imagen/redimensionar-imagen/');
    expect(pathFor({ kind: 'tool', toolId: 'qr-code-generator' }, 'en')).toBe('/en/tools/utility/qr-code-generator/');
    expect(pathFor({ kind: 'tool', toolId: 'qr-code-generator' }, 'es')).toBe('/es/herramientas/utilidades/generador-qr/');
  });

  it('builds localized category, directory and static page URLs', () => {
    expect(pathFor({ kind: 'category', categoryId: 'image' }, 'en')).toBe('/en/categories/image/');
    expect(pathFor({ kind: 'category', categoryId: 'image' }, 'es')).toBe('/es/categorias/imagen/');
    expect(pathFor({ kind: 'tools' }, 'es')).toBe('/es/herramientas/');
    expect(pathFor({ kind: 'page', pageId: 'privacy' }, 'es')).toBe('/es/privacidad/');
    expect(pathFor({ kind: 'home' }, 'en')).toBe('/en/');
  });

  it('returns an alternate for every locale', () => {
    expect(alternatesFor({ kind: 'tool', toolId: 'split-pdf' })).toEqual({
      en: '/en/tools/pdf/split-pdf/',
      es: '/es/herramientas/pdf/dividir-pdf/',
    });
  });

  it('produces unique, well-formed paths for every route', () => {
    const routes = getAllRoutes();
    const paths = routes.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of paths) {
      expect(p).toMatch(/^\/(en|es)\/([a-z0-9-]+\/)*$/);
    }
    // home, directory, 3 categories, 10 tools, 4 pages, 404 — in 2 locales
    expect(routes).toHaveLength((1 + 1 + 3 + 10 + 4 + 1) * 2);
    expect(routes.filter((r) => !r.indexable).every((r) => r.key.kind === 'not-found')).toBe(true);
  });

  it('builds absolute URLs on the canonical origin', () => {
    expect(absoluteUrl('/en/')).toMatch(/^https:\/\/[^/]+\/en\/$/);
  });
});
