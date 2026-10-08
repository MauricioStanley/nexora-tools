/**
 * Build-time search index generation (server only).
 * Output is served as `/search-index/<locale>.json` and fetched lazily by the search UI.
 */
import { LOCALES, type Locale } from '@/config/site';
import { getCategory } from '@/data/categories';
import { fmt } from '@/i18n/format';
import { pathFor } from '@/lib/routing';
import { listedTools } from '@/tools/registry';
import type { SearchDocument } from './engine';

export function buildSearchDocuments(locale: Locale): SearchDocument[] {
  return listedTools.map((tool) => {
    const content = tool.content[locale];
    const category = getCategory(tool.category);
    const categoryContent = category.content[locale];
    const foreign = LOCALES.filter((l) => l !== locale).flatMap((other) => {
      const c = tool.content[other];
      return [c.name, ...c.aliases, ...c.keywords];
    });
    return {
      id: tool.id,
      name: content.name,
      tagline: content.tagline,
      href: pathFor({ kind: 'tool', toolId: tool.id }, locale),
      icon: tool.icon,
      categoryId: tool.category,
      categoryName: categoryContent.name,
      hue: category.hue,
      popular: tool.popular,
      order: tool.order,
      fields: {
        name: content.name,
        aliases: content.aliases,
        keywords: content.keywords,
        category: [categoryContent.name, categoryContent.shortName, ...categoryContent.keywords],
        description: fmt(content.tagline),
        foreign,
      },
    };
  });
}
