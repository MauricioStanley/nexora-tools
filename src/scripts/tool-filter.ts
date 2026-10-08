/**
 * Directory filter: progressively enhances the fully rendered tool list.
 * Without JavaScript every tool is visible; with it, typing narrows the list in place.
 */
import { plural, type PluralForms } from '@/i18n/format';
import { track } from '@/lib/analytics';
import { search } from '@/lib/search/engine';
import { loadSearchIndex } from './search-index';

const root = document.querySelector<HTMLElement>('[data-tool-filter]');
const input = root?.querySelector<HTMLInputElement>('input');
const count = document.querySelector<HTMLElement>('[data-filter-count]');
const empty = document.querySelector<HTMLElement>('[data-filter-empty]');
const groups = document.querySelectorAll<HTMLElement>('[data-filter-group]');
const items = document.querySelectorAll<HTMLElement>('[data-tool-item]');

if (root && input && root.dataset.indexUrl) {
  const locale = root.dataset.locale ?? 'en';
  let showing: PluralForms = { other: '{count}' };
  try {
    showing = JSON.parse(root.dataset.showing ?? '') as PluralForms;
  } catch {
    /* keep default */
  }
  let trackTimer: number | undefined;

  const apply = async () => {
    const query = input.value.trim();
    let visible: Set<string> | null = null;
    if (query) {
      try {
        const { prepared } = await loadSearchIndex(root.dataset.indexUrl!);
        if (query !== input.value.trim()) return;
        visible = new Set(search(prepared, query, 500).map((r) => r.doc.id));
      } catch {
        visible = null;
      }
    }
    let shown = 0;
    items.forEach((item) => {
      const match = !visible || visible.has(item.dataset.toolItem ?? '');
      item.hidden = !match;
      if (match) shown += 1;
    });
    groups.forEach((group) => {
      group.hidden = !group.querySelector('[data-tool-item]:not([hidden])');
    });
    if (empty) empty.hidden = shown > 0;
    if (count) count.textContent = plural(showing, shown, locale);
    window.clearTimeout(trackTimer);
    if (query) {
      trackTimer = window.setTimeout(
        () => track('search_used', { source: 'directory', query_length: query.length, results_count: shown }),
        900,
      );
    }
  };

  input.addEventListener('input', () => void apply());
  input.addEventListener('focus', () => void loadSearchIndex(root.dataset.indexUrl!).catch(() => undefined), { once: true });
  if (input.value) void apply();
}
