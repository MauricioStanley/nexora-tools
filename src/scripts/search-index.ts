/** Lazy, shared loader for the per-locale search index (one request per page, cached). */
import { prepareIndex, type SearchDocument } from '@/lib/search/engine';

export type PreparedIndex = ReturnType<typeof prepareIndex>;

interface LoadedIndex {
  docs: SearchDocument[];
  prepared: PreparedIndex;
}

const cache = new Map<string, Promise<LoadedIndex>>();

export function loadSearchIndex(url: string): Promise<LoadedIndex> {
  let pending = cache.get(url);
  if (!pending) {
    pending = fetch(url, { credentials: 'omit' })
      .then((response) => {
        if (!response.ok) throw new Error(`Search index HTTP ${response.status}`);
        return response.json() as Promise<SearchDocument[]>;
      })
      .then((docs) => ({ docs, prepared: prepareIndex(docs) }))
      .catch((error) => {
        cache.delete(url);
        throw error;
      });
    cache.set(url, pending);
  }
  return pending;
}
