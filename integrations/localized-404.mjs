// @ts-check
import { access, mkdir, rename, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Astro emits dynamic routes in directory format (`/en/404/index.html`).
 * Cloudflare (Pages and Workers static assets) serves the *nearest* `404.html` walking up the
 * directory tree, so each locale needs `/<locale>/404.html`. This integration moves the
 * generated localized 404 documents into place after the build.
 *
 * @param {{ locales?: string[] }} [options]
 * @returns {import('astro').AstroIntegration}
 */
export function localized404(options = {}) {
  const locales = options.locales ?? ['en', 'es'];
  return {
    name: 'nexora:localized-404',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        for (const locale of locales) {
          const from = path.join(outDir, locale, '404', 'index.html');
          const to = path.join(outDir, locale, '404.html');
          try {
            await access(from);
          } catch {
            logger.warn(`No localized 404 found for "${locale}" (expected ${from}).`);
            continue;
          }
          await mkdir(path.dirname(to), { recursive: true });
          await rename(from, to);
          await rm(path.join(outDir, locale, '404'), { recursive: true, force: true });
          logger.info(`Moved localized 404 → /${locale}/404.html`);
        }
      },
    },
  };
}
