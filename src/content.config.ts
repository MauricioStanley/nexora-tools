import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Static page copy (About, Privacy, Terms, Contact) lives in Markdown per locale so it can be
 * edited — and legally reviewed — without touching components.
 * Entry ids are `<locale>/<pageId>`, e.g. `es/privacy`.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    updated: z.coerce.date().optional(),
    showUpdated: z.boolean().default(false),
  }),
});

export const collections = { pages };
