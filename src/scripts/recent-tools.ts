/** Homepage "Recently used" strip, built from tool ids stored in localStorage. */
import { STORAGE_KEYS } from '@/config/site';
import type { IconName } from '@/lib/icons';
import { readJson } from '@/lib/storage';
import { createIcon } from './dom-icon';
import { loadSearchIndex } from './search-index';

const section = document.querySelector<HTMLElement>('[data-recent]');
const list = section?.querySelector<HTMLUListElement>('[data-recent-list]');
const ids = readJson<string[]>(STORAGE_KEYS.recentTools, []).filter((id) => typeof id === 'string').slice(0, 6);

if (section && list && ids.length > 0 && section.dataset.indexUrl) {
  loadSearchIndex(section.dataset.indexUrl)
    .then(({ docs }) => {
      const byId = new Map(docs.map((d) => [d.id, d]));
      const items = ids.map((id) => byId.get(id)).filter((d): d is NonNullable<typeof d> => Boolean(d));
      if (items.length === 0) return;
      list.replaceChildren(
        ...items.map((doc) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = doc.href;
          a.dataset.relatedTool = doc.id;
          a.dataset.relatedSource = 'recent';
          a.append(createIcon(doc.icon as IconName), document.createTextNode(doc.name));
          li.appendChild(a);
          return li;
        }),
      );
      section.hidden = false;
    })
    .catch(() => {
      /* recent tools are optional */
    });
}
