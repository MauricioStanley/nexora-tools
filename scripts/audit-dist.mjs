// Post-build SEO & integrity audit of dist/ (no dependencies). Run: `npm run audit:dist`.
// Fails (exit 1) on: broken internal links/assets, missing or duplicate titles/descriptions,
// missing canonicals, non-reciprocal hreflang, H1 problems, sitemap drift, placeholder links.
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const errors = [];
const warnings = [];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function urlPathOf(file) {
  const rel = path.relative(dist, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

async function resolveInternal(href) {
  const clean = decodeURI(href.split('#')[0].split('?')[0]);
  if (!clean) return true;
  const target = path.join(dist, clean);
  if (clean.endsWith('/')) return exists(path.join(target, 'index.html'));
  return exists(target);
}

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`, 'i'))?.[1];
const decode = (s) => s?.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const files = await walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const pages = new Map();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const urlPath = urlPathOf(file);
  const head = html.split('</head>')[0] ?? '';
  const robots = attr(head.match(/<meta name="robots"[^>]*>/i)?.[0] ?? '', 'content') ?? '';
  const noindex = /noindex/i.test(robots) || urlPath.endsWith('404.html');
  const alternates = [...head.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({
    lang: m[1],
    href: decode(m[2]),
  }));
  pages.set(urlPath, {
    file,
    html,
    noindex,
    title: decode(head.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim()),
    description: decode(attr(head.match(/<meta name="description"[^>]*>/i)?.[0] ?? '', 'content')),
    canonical: attr(head.match(/<link rel="canonical"[^>]*>/i)?.[0] ?? '', 'href'),
    alternates,
    h1: (html.match(/<h1[\s>]/gi) ?? []).length,
    links: [...html.matchAll(/<a\s[^>]*href="([^"]*)"/gi)].map((m) => decode(m[1])),
    assets: [...html.matchAll(/(?:src|href)="(\/[^"]*\.(?:js|css|svg|png|woff2|webmanifest|json))"/gi)].map((m) => m[1]),
  });
}

// ── Per-page checks ───────────────────────────────────────────────
const titles = new Map();
const descriptions = new Map();
let origin = null;

for (const [urlPath, page] of pages) {
  const where = `[${urlPath}]`;
  if (!page.title) errors.push(`${where} missing <title>`);
  if (!page.description) errors.push(`${where} missing meta description`);
  if (page.h1 !== 1) errors.push(`${where} has ${page.h1} <h1> elements (expected 1)`);

  if (!page.noindex) {
    if (!page.canonical) errors.push(`${where} missing canonical`);
    else {
      const canonical = new URL(page.canonical);
      origin ??= canonical.origin;
      if (canonical.pathname !== urlPath) errors.push(`${where} canonical points elsewhere: ${page.canonical}`);
    }
    if (page.title) titles.set(page.title, [...(titles.get(page.title) ?? []), urlPath]);
    if (page.description) descriptions.set(page.description, [...(descriptions.get(page.description) ?? []), urlPath]);
    if (page.alternates.length === 0) warnings.push(`${where} has no hreflang alternates`);
    if (page.alternates.length > 0 && !page.alternates.some((a) => a.lang === 'x-default')) errors.push(`${where} hreflang set lacks x-default`);
  }

  for (const href of page.links) {
    if (!href || href === '#' || href.startsWith('javascript:')) errors.push(`${where} placeholder link "${href}"`);
    else if (href.startsWith('/') && !href.startsWith('//') && !(await resolveInternal(href))) errors.push(`${where} broken link ${href}`);
  }
  for (const asset of page.assets) {
    if (!(await resolveInternal(asset))) errors.push(`${where} missing asset ${asset}`);
  }
}

for (const [title, where] of titles) if (where.length > 1) errors.push(`duplicate title "${title}" on ${where.join(', ')}`);
for (const [desc, where] of descriptions) if (where.length > 1) errors.push(`duplicate description on ${where.join(', ')}: "${desc.slice(0, 60)}…"`);

// ── hreflang reciprocity ──────────────────────────────────────────
for (const [urlPath, page] of pages) {
  if (page.noindex) continue;
  for (const alt of page.alternates) {
    if (alt.lang === 'x-default') continue;
    const altPath = new URL(alt.href).pathname;
    const target = pages.get(altPath);
    if (!target) {
      errors.push(`[${urlPath}] hreflang ${alt.lang} → missing page ${altPath}`);
      continue;
    }
    const selfHref = `${origin}${urlPath}`;
    if (!target.alternates.some((a) => a.href === selfHref)) errors.push(`[${urlPath}] hreflang ${alt.lang} → ${altPath} is not reciprocal`);
  }
}

// ── Sitemap coverage ──────────────────────────────────────────────
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
const sitemapPaths = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
const indexable = [...pages].filter(([p, page]) => !page.noindex && p !== '/').map(([p]) => p);
for (const p of indexable) if (!sitemapPaths.has(p)) errors.push(`sitemap is missing ${p}`);
for (const p of sitemapPaths) if (!pages.has(p) || pages.get(p).noindex) errors.push(`sitemap lists non-indexable or missing page ${p}`);

const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
if (!/Sitemap: https?:\/\/.+\/sitemap\.xml/.test(robots)) errors.push('robots.txt has no absolute Sitemap line');

// ── Report ────────────────────────────────────────────────────────
console.log(`Audited ${pages.size} HTML pages, ${sitemapPaths.size} sitemap URLs.`);
warnings.forEach((w) => console.warn(`  warn  ${w}`));
errors.forEach((e) => console.error(`  error ${e}`));
if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} error(s)`);
  process.exit(1);
}
console.log(`✓ No errors${warnings.length ? ` (${warnings.length} warning(s))` : ''}`);
