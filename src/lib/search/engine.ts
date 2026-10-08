/**
 * Client-side tool search.
 *
 * Small, dependency-free and deterministic. Tolerates typos (Damerau–Levenshtein),
 * accents ("imágenes" = "imagenes"), plurals and cross-language queries ("unir pdf" on the
 * English site). The index is a static JSON file per locale, fetched lazily on first use.
 */
import type { IconName } from '@/lib/icons';

export interface SearchDocument {
  id: string;
  name: string;
  tagline: string;
  href: string;
  icon: IconName;
  categoryId: string;
  categoryName: string;
  /** Category accent hue (visual only). */
  hue: string;
  popular: boolean;
  /** Registry order — used as a stable tie-breaker. */
  order: number;
  fields: {
    name: string;
    aliases: string[];
    keywords: string[];
    category: string[];
    description: string;
    /** Names, aliases and keywords from other locales (lower weight). */
    foreign: string[];
  };
}

export interface SearchResult {
  doc: SearchDocument;
  score: number;
}

interface PreparedDocument {
  doc: SearchDocument;
  tokens: Map<string, number>;
  nameNorm: string;
  nameTokens: string[];
  phrases: string[];
}

const WEIGHTS = {
  name: 10,
  aliases: 8,
  keywords: 5,
  category: 3,
  foreign: 3,
  description: 1.5,
} as const;

const STOPWORDS = new Set([
  // en
  'a', 'an', 'the', 'to', 'of', 'for', 'my', 'in', 'on', 'and', 'with', 'online', 'free', 'tool', 'tools', 'how', 'into', 'file', 'files',
  // es
  'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'en', 'para', 'mi', 'mis', 'y', 'con', 'gratis', 'herramienta', 'herramientas', 'al', 'como', 'archivo', 'archivos',
]);

/** Lowercase, strip accents and punctuation, collapse whitespace. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Very light stemming: drop a trailing plural "s" (pdfs → pdf, fotos → foto). */
function stem(token: string): string {
  if (token.length > 3 && token.endsWith('s') && !token.endsWith('ss')) return token.slice(0, -1);
  return token;
}

export function tokenize(text: string): string[] {
  const norm = normalize(text);
  return norm ? norm.split(' ').map(stem) : [];
}

/** Optimal string alignment distance (Damerau–Levenshtein with adjacent transpositions). */
export function editDistance(a: string, b: string, max = Infinity): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d: number[][] = Array.from({ length: rows }, (_, i) => {
    const row = new Array<number>(cols).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j < cols; j++) d[0]![j] = j;
  for (let i = 1; i < rows; i++) {
    let rowMin = Infinity;
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, d[i - 2]![j - 2]! + 1);
      }
      d[i]![j] = value;
      if (value < rowMin) rowMin = value;
    }
    if (rowMin > max) return max + 1;
  }
  return d[a.length]![b.length]!;
}

/** Similarity between a query token and a document token, 0..1. */
export function tokenSimilarity(q: string, t: string): number {
  if (q === t) return 1;
  if (t.startsWith(q)) return q.length === 1 ? 0.35 : q.length === 2 ? 0.7 : 0.85;
  if (t.length >= 3 && q.startsWith(t)) return 0.7;
  if (q.length >= 3 && t.includes(q)) return 0.5;
  const maxDistance = q.length >= 8 ? 2 : q.length >= 4 ? 1 : 0;
  if (maxDistance > 0) {
    if (Math.abs(q.length - t.length) <= maxDistance && editDistance(q, t, maxDistance) <= maxDistance) return 0.6;
    // Typo inside a partially typed word: compare with the same-length prefix.
    if (t.length > q.length && editDistance(q, t.slice(0, q.length), 1) <= 1) return 0.45;
  }
  return 0;
}

function addTokens(target: Map<string, number>, text: string, weight: number): void {
  for (const token of tokenize(text)) {
    if ((target.get(token) ?? 0) < weight) target.set(token, weight);
  }
}

export function prepareIndex(docs: readonly SearchDocument[]): PreparedDocument[] {
  return docs.map((doc) => {
    const tokens = new Map<string, number>();
    addTokens(tokens, doc.fields.name, WEIGHTS.name);
    doc.fields.aliases.forEach((a) => addTokens(tokens, a, WEIGHTS.aliases));
    doc.fields.keywords.forEach((k) => addTokens(tokens, k, WEIGHTS.keywords));
    doc.fields.category.forEach((c) => addTokens(tokens, c, WEIGHTS.category));
    doc.fields.foreign.forEach((f) => addTokens(tokens, f, WEIGHTS.foreign));
    addTokens(tokens, doc.fields.description, WEIGHTS.description);
    return {
      doc,
      tokens,
      nameNorm: normalize(doc.fields.name),
      nameTokens: tokenize(doc.fields.name),
      phrases: [...doc.fields.aliases, ...doc.fields.foreign].map(normalize),
    };
  });
}

function orderBonus(queryTokens: string[], nameTokens: string[]): number {
  if (queryTokens.length < 2) return 0;
  let last = -1;
  for (const q of queryTokens) {
    const index = nameTokens.findIndex((t, i) => i > last && tokenSimilarity(q, t) >= 0.6);
    if (index === -1) return 0;
    last = index;
  }
  return 2;
}

export function search(index: readonly PreparedDocument[], query: string, limit = 8): SearchResult[] {
  const normQuery = normalize(query);
  if (!normQuery) return [];
  const allTokens = tokenize(normQuery);
  const significant = allTokens.filter((t) => !STOPWORDS.has(t));
  const queryTokens = significant.length > 0 ? significant : allTokens;

  const scored = index.map((prepared) => {
    let total = 0;
    let matched = 0;
    for (const q of queryTokens) {
      let best = 0;
      for (const [token, weight] of prepared.tokens) {
        const s = tokenSimilarity(q, token);
        if (s > 0 && s * weight > best) best = s * weight;
      }
      if (best > 0) matched += 1;
      total += best;
    }
    let bonus = 0;
    if (prepared.nameNorm === normQuery) bonus += 20;
    else if (prepared.nameNorm.startsWith(normQuery)) bonus += 10;
    if (prepared.phrases.some((p) => p === normQuery)) bonus += 8;
    else if (normQuery.length >= 4 && prepared.phrases.some((p) => p.includes(normQuery))) bonus += 3;
    bonus += orderBonus(queryTokens, prepared.nameTokens);
    return { doc: prepared.doc, score: total + bonus, matched };
  });

  const strict = scored.filter((r) => r.matched === queryTokens.length && r.score > 0);
  const pool = strict.length > 0 ? strict : scored.filter((r) => r.matched > 0 && r.score >= 3);

  return pool
    .sort((a, b) => b.score - a.score || a.doc.order - b.doc.order)
    .slice(0, limit)
    .map(({ doc, score }) => ({ doc, score }));
}
