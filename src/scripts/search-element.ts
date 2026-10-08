/**
 * <nx-search> — accessible tool search (ARIA 1.2 combobox + listbox pattern).
 * Vanilla custom element: zero framework cost on pages that don't need React.
 */
import { plural, type PluralForms } from '@/i18n/format';
import { track } from '@/lib/analytics';
import { search, type SearchDocument } from '@/lib/search/engine';
import type { IconName } from '@/lib/icons';
import { createIcon } from './dom-icon';
import { loadSearchIndex } from './search-index';

interface SearchStrings {
  noResults: string;
  noResultsHint: string;
  results: PluralForms;
  loading: string;
  loadError: string;
  suggestions: string;
}

let instanceCounter = 0;

class NxSearch extends HTMLElement {
  private input!: HTMLInputElement;
  private panel!: HTMLElement;
  private list!: HTMLUListElement;
  private message!: HTMLElement;
  private status!: HTMLElement;
  private strings!: SearchStrings;
  private locale = 'en';
  private indexUrl = '';
  private results: SearchDocument[] = [];
  private active = -1;
  private variant: 'inline' | 'dialog' = 'inline';
  private lastTrackedQuery = '';
  private trackTimer: number | undefined;
  private idPrefix = `nx-search-${++instanceCounter}`;

  connectedCallback(): void {
    if (this.input) return;
    const input = this.querySelector<HTMLInputElement>('[data-search-input]');
    const panel = this.querySelector<HTMLElement>('[data-search-panel]');
    const list = this.querySelector<HTMLUListElement>('[data-search-list]');
    const message = this.querySelector<HTMLElement>('[data-search-message]');
    const status = this.querySelector<HTMLElement>('[data-search-status]');
    if (!input || !panel || !list || !message || !status) return;
    this.input = input;
    this.panel = panel;
    this.list = list;
    this.message = message;
    this.status = status;
    this.locale = this.dataset.locale ?? 'en';
    this.indexUrl = this.dataset.indexUrl ?? '';
    this.variant = this.dataset.variant === 'dialog' ? 'dialog' : 'inline';
    try {
      this.strings = JSON.parse(this.dataset.strings ?? '{}') as SearchStrings;
    } catch {
      return;
    }

    input.addEventListener('focus', this.onFocus);
    input.addEventListener('input', this.onInput);
    input.addEventListener('keydown', this.onKeyDown);
    list.addEventListener('click', this.onResultClick);
    list.addEventListener('mousemove', this.onHover);
    if (this.variant === 'inline') document.addEventListener('pointerdown', this.onOutside);
  }

  disconnectedCallback(): void {
    document.removeEventListener('pointerdown', this.onOutside);
  }

  /** Called by the dialog when it opens. */
  focusInput(): void {
    this.input.focus();
    this.input.select();
    void this.update();
  }

  private onFocus = () => {
    void this.update();
  };

  private onInput = () => {
    void this.update();
  };

  private onOutside = (event: PointerEvent) => {
    if (!this.contains(event.target as Node)) this.close();
  };

  private onHover = (event: MouseEvent) => {
    const option = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (!option) return;
    const index = Number(option.dataset.index);
    if (index !== this.active) this.setActive(index, false);
  };

  private onResultClick = (event: MouseEvent) => {
    const option = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (!option) return;
    const doc = this.results[Number(option.dataset.index)];
    if (doc) this.trackSelection(doc, Number(option.dataset.index));
  };

  private onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (this.panel.hidden) void this.update();
        this.setActive(this.results.length ? (this.active + 1) % this.results.length : -1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.setActive(this.results.length ? (this.active - 1 + this.results.length) % this.results.length : -1);
        break;
      case 'Home':
      case 'End':
        if (!this.results.length || this.panel.hidden) return;
        event.preventDefault();
        this.setActive(event.key === 'Home' ? 0 : this.results.length - 1);
        break;
      case 'Enter': {
        const index = this.active >= 0 ? this.active : 0;
        const doc = this.results[index];
        if (doc) {
          event.preventDefault();
          this.trackSelection(doc, index);
          window.location.assign(doc.href);
        }
        break;
      }
      case 'Escape':
        if (this.variant === 'inline' && !this.panel.hidden) {
          event.preventDefault();
          this.close();
        } else if (this.input.value && this.variant === 'dialog') {
          // Clear first; a second Escape closes the dialog natively.
          event.preventDefault();
          this.input.value = '';
          void this.update();
        }
        break;
      default:
        break;
    }
  };

  private async update(): Promise<void> {
    const query = this.input.value.trim();
    this.open();
    let index;
    try {
      if (!this.results.length && !this.list.childElementCount) this.showMessage(this.strings.loading);
      index = await loadSearchIndex(this.indexUrl);
    } catch {
      this.results = [];
      this.renderResults([]);
      this.showMessage(this.strings.loadError);
      return;
    }
    if (query !== this.input.value.trim()) return; // stale

    if (!query) {
      const popular = index.docs.filter((d) => d.popular).slice(0, 6);
      this.results = popular;
      this.renderResults(popular, this.strings.suggestions);
      this.showMessage('');
      return;
    }

    const found = search(index.prepared, query, 8).map((r) => r.doc);
    this.results = found;
    this.renderResults(found);
    if (found.length === 0) {
      this.showMessage(`${this.strings.noResults.replace('{query}', query)} ${this.strings.noResultsHint}`);
    } else {
      this.showMessage('');
    }
    this.status.textContent = plural(this.strings.results, found.length, this.locale);
    this.scheduleTrack(query, found.length);
  }

  private renderResults(docs: SearchDocument[], heading?: string): void {
    this.active = -1;
    this.input.removeAttribute('aria-activedescendant');
    this.list.replaceChildren();
    if (heading && docs.length) {
      const label = document.createElement('li');
      label.setAttribute('role', 'presentation');
      label.className = 'nx-search__heading';
      label.textContent = heading;
      this.list.appendChild(label);
    }
    docs.forEach((doc, index) => {
      const li = document.createElement('li');
      li.id = `${this.idPrefix}-opt-${index}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      li.dataset.index = String(index);
      li.className = 'nx-search__option';

      const link = document.createElement('a');
      link.href = doc.href;
      link.tabIndex = -1;
      link.className = 'nx-search__link';

      const icon = document.createElement('span');
      icon.className = 'nx-search__icon';
      icon.dataset.hue = doc.hue;
      icon.appendChild(createIcon(doc.icon as IconName));

      const text = document.createElement('span');
      text.className = 'nx-search__text';
      const name = document.createElement('span');
      name.className = 'nx-search__name';
      name.textContent = doc.name;
      const desc = document.createElement('span');
      desc.className = 'nx-search__desc';
      desc.textContent = doc.tagline;
      text.append(name, desc);

      const category = document.createElement('span');
      category.className = 'nx-search__cat';
      category.textContent = doc.categoryName;

      link.append(icon, text, category);
      li.appendChild(link);
      this.list.appendChild(li);
    });
    this.input.setAttribute('aria-expanded', String(docs.length > 0));
  }

  private setActive(index: number, scroll = true): void {
    const options = this.list.querySelectorAll<HTMLElement>('[role="option"]');
    options.forEach((el) => el.setAttribute('aria-selected', 'false'));
    this.active = index;
    const current = index >= 0 ? options[index] : undefined;
    if (current) {
      current.setAttribute('aria-selected', 'true');
      this.input.setAttribute('aria-activedescendant', current.id);
      if (scroll) current.scrollIntoView({ block: 'nearest' });
    } else {
      this.input.removeAttribute('aria-activedescendant');
    }
  }

  private showMessage(text: string): void {
    this.message.textContent = text;
    this.message.hidden = !text;
    if (text) this.status.textContent = text;
  }

  private open(): void {
    this.panel.hidden = false;
    this.toggleAttribute('data-open', true);
  }

  private close(): void {
    if (this.variant === 'dialog') return;
    this.panel.hidden = true;
    this.toggleAttribute('data-open', false);
    this.input.setAttribute('aria-expanded', 'false');
    this.input.removeAttribute('aria-activedescendant');
    this.active = -1;
  }

  private scheduleTrack(query: string, count: number): void {
    window.clearTimeout(this.trackTimer);
    this.trackTimer = window.setTimeout(() => {
      if (query === this.lastTrackedQuery) return;
      this.lastTrackedQuery = query;
      track('search_used', {
        source: this.variant,
        query_length: query.length,
        results_count: count,
        locale: this.locale,
        search_term: query.toLowerCase().slice(0, 40),
      });
    }, 900);
  }

  private trackSelection(doc: SearchDocument, position: number): void {
    track('search_result_clicked', { source: this.variant, target_tool: doc.id, position: position + 1 });
  }
}

if (!customElements.get('nx-search')) customElements.define('nx-search', NxSearch);

export type { NxSearch };
