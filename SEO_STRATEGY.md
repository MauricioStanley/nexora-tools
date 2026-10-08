# SEO strategy

Organic search is Nexora Tools' main acquisition channel. Every tool page is a landing page for one search intent. The strategy is simple: **one intent → one excellent page**, fast, honest, well-structured and correctly localized. No doorway pages, keyword variants or filler articles.

## 1. URL strategy

| Page | English | Spanish |
| --- | --- | --- |
| Home | `/en/` | `/es/` |
| Directory | `/en/tools/` | `/es/herramientas/` |
| Category | `/en/categories/pdf/` | `/es/categorias/pdf/` |
| Tool | `/en/tools/pdf/merge-pdf/` | `/es/herramientas/pdf/unir-pdf/` |
| Static | `/en/about/` · `/en/privacy/` · `/en/terms/` · `/en/contact/` | `/es/acerca-de/` · `/es/privacidad/` · `/es/terminos/` · `/es/contacto/` |
| Gateway | `/` (language detection, x-default for home) | |

- Lowercase, hyphenated, human-readable, **localized slugs** (`unir-pdf`, not `merge-pdf`, in Spanish).
- **Trailing slash on every URL.** Canonicals, internal links, hreflang and the sitemap all use it. Cloudflare serves `/path/` directly and 308-redirects `/path` → `/path/`. This was chosen over `.html`/no-slash because it matches Cloudflare's native directory-index behavior (no redirect chains for our own links).
- URLs come from one function (`pathFor`), so they can't drift between links, canonicals and sitemap.
- Slugs are permanent. If one must change, add a 301 in `public/_redirects` and keep the tool `id` unchanged.

## 2. Canonicals and hreflang

- Every indexable page has an absolute self-canonical on `https://tools.codywork.com` (override with `PUBLIC_SITE_URL` only for self-referencing staging).
- Every page lists alternates for **all locales plus `x-default`**. `x-default` points to the English version, except the home page, where it points to the language-detecting root `/`.
- Alternates are reciprocal by construction (both come from the route table). `npm run audit:dist` verifies reciprocity.
- 404 pages are `noindex` and have no canonical or alternates.
- Preview deployments (`*.pages.dev`) send `X-Robots-Tag: noindex` (`public/_headers`).

## 3. Language handling and crawlers

- No automatic redirects on localized URLs (Google's recommendation; also better UX). Googlebot crawls both languages through links and hreflang.
- The root gateway uses a JS `location.replace`. Crawlers usually render it and follow to `/en/`. The page also contains plain links to both homes, and its hreflang cluster points to them.
- Language suggestion banners are hidden by default and only shown client-side, so they are never part of indexed content.

## 4. Metadata

- **Titles**: `<tool SEO title> | Nexora Tools`. The tool part is ≤ 62 characters (validated at build). Home uses a custom full title.
- **Descriptions**: 110–165 characters, unique per page and locale (validated at build and by the dist audit).
- **Open Graph / Twitter**: title, description, canonical URL, locale + alternate locale, a 1200×630 image per locale (`/og/nexora-<locale>.png`), `summary_large_image`.
- `robots`: `index, follow, max-image-preview:large` on indexable pages.

## 5. Structured data (JSON-LD)

| Page | Types | Notes |
| --- | --- | --- |
| Home | `WebSite` + `Organization` (Codywork as publisher) | No `SearchAction` (the sitelinks search box was retired by Google in 2024). |
| Tool | `WebApplication` (free `Offer`, `isAccessibleForFree`, `applicationCategory`, `browserRequirements`), `BreadcrumbList`, `FAQPage` | **No ratings**: we have no genuine reviews, and fabricated `aggregateRating` would be spam. FAQPage mirrors the visible FAQ exactly; Google shows FAQ rich results only for some sites, but the markup is valid and useful for AI and answer engines. |
| Directory / Category | `CollectionPage` with `ItemList`, `BreadcrumbList` | |
| Static pages | `BreadcrumbList` | |

JSON-LD is serialized with `<`, `>` and `&` escaped (`serializeJsonLd`).

## 6. Sitemap and robots

- `/sitemap.xml` is generated from the route table, contains every indexable localized URL, and includes `xhtml:link` alternates (hreflang) for each URL. Tool URLs include `lastmod` from `meta.dateModified`. Update that date when a tool meaningfully changes.
- `/robots.txt` allows everything except `/search-index/` and `/vendor/` (machine files), and declares the absolute sitemap URL.
- After launch, submit the sitemap in Google Search Console and Bing Webmaster Tools (domain property for `tools.codywork.com`, verified via DNS on Cloudflare).

## 7. On-page structure

- Exactly one `<h1>` per page (tool name, category heading, page title), enforced by the dist audit.
- Tool page order: breadcrumbs → H1 + one-sentence value proposition + privacy badge → **the working tool** → How it works (H2, ordered steps) → About this tool (H2) + Good to know → Tool details (supported formats, limits, processing, price) → FAQ (H2, `<details>`) → Related tools (H2) → category / all-tools links.
- The tool itself stays the focus. Supporting content is roughly 250–450 words: enough to answer real questions (formats, privacy, limits, quality), not filler.
- All content is server-rendered HTML, so crawlers see it without executing JS.

## 8. Internal linking

- Header: category pages + directory. Footer: every tool grouped by category, plus company/legal pages. Mobile menu: every tool.
- Tool pages: breadcrumbs (Home → Tools → Category → Tool), "Related tools" cards (from `relatedToolIds`), "More <category> tools" and "Explore all tools" CTAs.
- After a successful task, "Continue with" links offer the related next step (for example JPG to PDF → Compress PDF). This is a real workflow, not link padding.
- Category pages link to every tool in the category and to the other categories.
- All links are real `<a href>` elements (crawlable); the dist audit fails on broken or placeholder links.

## 9. Content rules (anti-spam)

- One meaningful intent = one page. No "merge PDF free", "merge PDF online" and "combine PDF" variants as separate pages; those phrases are **keywords/aliases** of one page (and power search).
- Never claim capabilities the tool doesn't have (for example "compress PDF 90%"). Results depend on the file, and we say so.
- Limitations are published on the page ("Good to know").
- Translations are written natively for each language, not auto-generated keyword lists.

## 10. Performance as SEO

Static HTML, a small JS budget, one preloaded font, no layout-shifting ads (disabled; reserved height when enabled), and immutable caching. Targets: LCP < 2.5 s, CLS < 0.1, INP < 200 ms. Measure with PageSpeed Insights and Search Console's CWV report after launch.

## 11. Future expansion

- **New tools**: each gets localized slugs, SEO copy, FAQ, related links and a sitemap entry automatically. Pick slugs from real search language in each market (Spanish: "unir", "juntar", "comprimir", "pasar a").
- **New locales**: add to `LOCALES`, add a dictionary and `SEGMENTS`, then translate tool and category content. hreflang, sitemap and routing follow.
- **Per-tool OG images** (tool name + icon) would improve social CTR; generate them at build with the existing `sharp` script pattern.
- **Guides and comparisons** (for example "How to reduce a PDF for email") only if they add genuine value, and linked to the tools.
- Monitor queries per page in Search Console. Adjust titles and descriptions to match real intent; don't create new pages for variants.
