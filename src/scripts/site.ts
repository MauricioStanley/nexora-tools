/**
 * Site-wide progressive enhancements (loaded once per page as a deferred module).
 * Everything here is optional polish: pages remain usable if this script fails.
 */
import { brand } from '@/config/brand';
import { STORAGE_KEYS, isLocale, type Theme } from '@/config/site';
import { matchSupportedLocale } from '@/i18n/detect';
import { track } from '@/lib/analytics';
import { readJson, readStorage, writeStorage } from '@/lib/storage';

const root = document.documentElement;
const currentLocale = root.lang;

/* ── Theme ─────────────────────────────────────────────────────── */
function currentTheme(): Theme {
  return root.dataset.theme === 'light' ? 'light' : 'dark';
}

function syncTheme(): void {
  const theme = currentTheme();
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    const label = theme === 'dark' ? button.dataset.labelLight : button.dataset.labelDark;
    if (label) button.setAttribute('aria-label', label);
  });
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', brand.themeColor[theme]);
}

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    writeStorage(STORAGE_KEYS.theme, next);
    syncTheme();
    track('theme_changed', { theme: next });
  });
});
syncTheme();

/* ── Language preference ───────────────────────────────────────── */
document.addEventListener('click', (event) => {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('[data-locale-switch]');
  const target = link?.dataset.localeSwitch;
  if (!link || !isLocale(target)) return;
  writeStorage(STORAGE_KEYS.locale, target);
  if (target !== currentLocale) track('language_changed', { from_locale: currentLocale, to_locale: target });
});

(function suggestLocale() {
  if (readStorage(STORAGE_KEYS.locale) || readStorage(STORAGE_KEYS.localeSuggestionDismissed)) return;
  const preferred = matchSupportedLocale(navigator.languages ?? [navigator.language]);
  if (!preferred || preferred === currentLocale) return;
  const banner = document.querySelector<HTMLElement>(`[data-locale-suggest="${preferred}"]`);
  if (!banner) return;
  banner.hidden = false;
  banner.querySelector('[data-locale-dismiss]')?.addEventListener('click', () => {
    banner.hidden = true;
    writeStorage(STORAGE_KEYS.localeSuggestionDismissed, '1');
    if (isLocale(currentLocale)) writeStorage(STORAGE_KEYS.locale, currentLocale);
  });
})();

/* ── Dialogs (mobile menu, search) ─────────────────────────────── */
function openDialog(dialog: HTMLDialogElement | null): void {
  if (!dialog || dialog.open) return;
  document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((d) => d.close());
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  root.classList.add('has-dialog');
}

function openSearch(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-search-dialog]');
  if (!dialog) return;
  openDialog(dialog);
  const search = dialog.querySelector('nx-search') as (HTMLElement & { focusInput?: () => void }) | null;
  search?.focusInput?.();
}

document.querySelectorAll<HTMLDialogElement>('dialog[data-dialog]').forEach((dialog) => {
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) root.classList.remove('has-dialog');
  });
  // Clicking the backdrop (the dialog element itself) closes it.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', () => dialog.close()));
});

document.querySelectorAll('[data-menu-open]').forEach((button) =>
  button.addEventListener('click', () => openDialog(document.querySelector<HTMLDialogElement>('#mobile-nav'))),
);
document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', openSearch));

const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
document.querySelectorAll('[data-shortcut-label]').forEach((el) => {
  el.textContent = isMac ? '⌘ K' : 'Ctrl K';
});

document.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement | null;
  const typing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
  if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    openSearch();
  } else if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    openSearch();
  }
});

/* ── Disclosure dropdowns (<details data-dropdown>) ────────────── */
const dropdowns = document.querySelectorAll<HTMLDetailsElement>('details[data-dropdown]');
document.addEventListener('click', (event) => {
  dropdowns.forEach((d) => {
    if (d.open && !d.contains(event.target as Node)) d.open = false;
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  dropdowns.forEach((d) => {
    if (d.open) {
      d.open = false;
      d.querySelector('summary')?.focus();
    }
  });
});

/* ── Header border on scroll ───────────────────────────────────── */
const header = document.querySelector<HTMLElement>('[data-site-header]');
if (header) {
  const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 4);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Tool pages: recent tools + analytics ──────────────────────── */
const toolId = document.body.dataset.toolId;
if (toolId) {
  const recent = readJson<string[]>(STORAGE_KEYS.recentTools, []).filter((id) => typeof id === 'string' && id !== toolId);
  writeStorage(STORAGE_KEYS.recentTools, JSON.stringify([toolId, ...recent].slice(0, 8)));
  track('tool_view', { tool: toolId, category: document.body.dataset.toolCategory, locale: currentLocale });
}

document.addEventListener('click', (event) => {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('[data-related-tool]');
  if (!link) return;
  track('related_tool_clicked', {
    tool: toolId,
    target_tool: link.dataset.relatedTool,
    source: link.dataset.relatedSource ?? 'related',
  });
});
