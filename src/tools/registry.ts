/**
 * Tool Registry — the single source of truth for every tool.
 *
 * Tools are discovered automatically: any folder `src/tools/<id>/` containing `meta.ts` and
 * `i18n/<locale>.ts` for every locale is registered. Navigation, search, category pages,
 * related tools, metadata and the sitemap are all derived from this registry.
 *
 * Server/build-time module. Do not import from client islands (it contains all copy).
 */
import { LOCALES, type Locale } from '@/config/site';
import { categories, type CategoryId } from '@/data/categories';
import type { Tool, ToolContent, ToolMeta } from './types';

const metaModules = import.meta.glob<ToolMeta>('./*/meta.ts', { eager: true, import: 'default' });
const contentModules = import.meta.glob<ToolContent>('./*/i18n/*.ts', { eager: true, import: 'default' });

function folderOf(path: string): string {
  // './merge-pdf/meta.ts' → 'merge-pdf'
  return path.split('/')[1] ?? '';
}

function buildRegistry(): Tool[] {
  const result: Tool[] = [];
  for (const [path, meta] of Object.entries(metaModules)) {
    const folder = folderOf(path);
    if (meta.id !== folder) {
      throw new Error(`[registry] Tool id "${meta.id}" must match its folder name "${folder}".`);
    }
    const content = {} as Record<Locale, ToolContent>;
    for (const locale of LOCALES) {
      const localized = contentModules[`./${folder}/i18n/${locale}.ts`];
      if (!localized) {
        throw new Error(`[registry] Tool "${meta.id}" is missing its "${locale}" content (i18n/${locale}.ts).`);
      }
      content[locale] = localized;
    }
    result.push({ ...meta, content });
  }
  return result.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

/** Every registered tool, including hidden and coming-soon entries. */
export const allTools: readonly Tool[] = buildRegistry();

/** Tools that get pages, appear in navigation, search and the sitemap. */
export const listedTools: readonly Tool[] = allTools.filter((t) => t.status === 'live' || t.status === 'beta');

const toolsById = new Map(allTools.map((t) => [t.id, t]));

export function getTool(id: string): Tool {
  const tool = toolsById.get(id);
  if (!tool) throw new Error(`[registry] Unknown tool "${id}"`);
  return tool;
}

export function findTool(id: string): Tool | undefined {
  return toolsById.get(id);
}

export function isListed(tool: Tool): boolean {
  return tool.status === 'live' || tool.status === 'beta';
}

export function getToolsByCategory(categoryId: CategoryId | string): Tool[] {
  return listedTools.filter((t) => t.category === categoryId);
}

export function getPopularTools(limit = 6): Tool[] {
  return listedTools.filter((t) => t.popular).slice(0, limit);
}

export function getFeaturedTools(limit = 4): Tool[] {
  return listedTools.filter((t) => t.featured).slice(0, limit);
}

/** Related tools in declared order, skipping anything not listed. */
export function getRelatedTools(tool: Tool, limit = 4): Tool[] {
  return tool.relatedToolIds
    .map((id) => toolsById.get(id))
    .filter((t): t is Tool => Boolean(t && isListed(t)))
    .slice(0, limit);
}

export function toolContent(tool: Tool, locale: Locale): ToolContent {
  return tool.content[locale];
}

export interface RegistryIssue {
  toolId: string;
  message: string;
}

/**
 * Integrity checks, run by tests and at build time (see `src/pages/[...path].astro`).
 * Catching these at build time is what keeps 500 tools maintainable.
 */
export function validateRegistry(tools: readonly Tool[] = allTools): RegistryIssue[] {
  const issues: RegistryIssue[] = [];
  const categoryIds = new Set<string>(categories.map((c) => c.id));
  const ids = new Set<string>();
  const slugKeys = new Set<string>();

  for (const tool of tools) {
    const add = (message: string) => issues.push({ toolId: tool.id, message });

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(tool.id)) add('id must be kebab-case');
    if (ids.has(tool.id)) add('duplicate id');
    ids.add(tool.id);

    if (!categoryIds.has(tool.category)) add(`unknown category "${tool.category}"`);

    for (const locale of LOCALES) {
      const slug = tool.slugs[locale];
      if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) add(`invalid ${locale} slug "${slug}"`);
      const key = `${locale}:${tool.category}:${slug}`;
      if (slugKeys.has(key)) add(`duplicate ${locale} slug "${slug}" in category "${tool.category}"`);
      slugKeys.add(key);

      const c = tool.content[locale];
      if (!c.name.trim()) add(`${locale}: missing name`);
      if (c.seo.title.length > 62) add(`${locale}: SEO title is ${c.seo.title.length} chars (max 62)`);
      if (c.seo.description.length < 110 || c.seo.description.length > 165) {
        add(`${locale}: SEO description is ${c.seo.description.length} chars (expected 110–165)`);
      }
      if (c.howTo.length < 3) add(`${locale}: needs at least 3 how-to steps`);
      if (c.faq.length < 3) add(`${locale}: needs at least 3 FAQ items`);
      if (c.about.length < 1) add(`${locale}: needs an "about" paragraph`);
    }

    for (const relatedId of tool.relatedToolIds) {
      if (relatedId === tool.id) add('lists itself as related');
      const related = toolsById.get(relatedId);
      if (!related) add(`related tool "${relatedId}" does not exist`);
    }

    if (tool.input.kind === 'files') {
      if (tool.input.accept.length === 0) add('file tool must accept at least one type');
      if (tool.input.minFiles < 1 || tool.input.maxFiles < tool.input.minFiles) add('invalid min/max files');
      if (!tool.input.multiple && tool.input.maxFiles !== 1) add('single-file tool must have maxFiles = 1');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tool.dateModified)) add('dateModified must be YYYY-MM-DD');
  }
  return issues;
}
