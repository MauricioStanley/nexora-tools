# Architecture

This document explains how Nexora Tools is built and why. The goal is a product that scales from 10 to 500+ tools **without rewrites**, stays fast and private, and costs almost nothing to run.

## 1. Guiding decisions

| Decision | Why |
| --- | --- |
| **Astro, static output** | Every page is prerendered HTML: best-possible SEO, instant first paint, trivially cacheable on a CDN, near-zero hosting cost. |
| **React islands only for tool UIs** | Tools are genuinely interactive apps; everything else (home, directory, categories, legal pages, FAQ, header, search) is static HTML plus small vanilla scripts. Home and directory pages ship **no React**. |
| **Cloudflare (Pages or Workers static assets)** | Global CDN, free tier fits V1, `_headers` support for security headers, and a clean path to Workers when a server tool appears. |
| **Local processing first** | Privacy is a product feature and a cost advantage: no uploads means no storage, no bandwidth bills, no data liability. |
| **No database, auth or CMS in V1** | Nothing in V1 needs persistent server state. Integration boundaries exist (see §10) so they can be added later. |

## 2. High-level structure

```
Request ─► Cloudflare CDN ─► static HTML (dist/)
                                 │
                                 ├─ CSS (tokens + scoped)      no JS needed to read content
                                 ├─ site.js  (~1.5 KB gz)       theme, language pref, menus, search dialog
                                 ├─ search element (~2 KB gz)  loads /search-index/<locale>.json on demand
                                 └─ tool island (tool pages)   React + tool chunk
                                        └─ on user action ─► Web Worker (pdf-lib) / PDF.js / Canvas / WASM
```

## 3. The Tool Registry (the core of scalability)

**Every tool is a folder.** `src/tools/registry.ts` discovers tools with `import.meta.glob('./*/meta.ts')` and `'./*/i18n/*.ts'`. Nothing else has to be edited to add a tool.

```
src/tools/<id>/
  meta.ts          language-neutral definition (category, icon, execution mode, formats, limits,
                   related tools, localized slugs, status, schema type, dateModified)
  i18n/en.ts       localized copy: name, tagline, description, SEO title/description, keywords,
  i18n/es.ts       aliases, how-to steps, about, limitations, FAQ, and tool UI strings
  logic.ts         pure processing (no DOM): runs in a worker, on the main thread, or in Node tests
  worker.ts        exposes logic in a Web Worker (optional)
  run.ts           client entry: starts the worker, lazy main-thread fallback
  Tool.tsx         React UI built from the shared tool framework
  Island.astro     hydration boundary (`<Tool client:load />`)
  *.test.ts        tests for logic
```

The registry powers navigation (header, mobile menu, footer), search (index generation), category pages, the directory, related tools, tool metadata/JSON-LD, the sitemap and hreflang. `validateRegistry()` runs **at build time** (in `getStaticPaths`) and in tests. It fails the build on duplicate ids or slugs, unknown categories, broken related links, missing translations, SEO titles/descriptions outside length bounds, too few FAQ/how-to items, and missing islands.

Statuses: `live`, `beta` (routed, labeled), `coming-soon` and `hidden` (never routed, so there are no fake tools).

## 4. Routing and localization

- `src/lib/routing/index.ts` is the **only** place URLs are built: `pathFor(key, locale)`.
- One catch-all page `src/pages/[...path].astro` generates every localized page from `getAllRoutes()` and renders a view (`src/views/*`) by route kind. Adding a tool or category never adds page files.
- Localized first-level segments (`tools`/`herramientas`, `categories`/`categorias`, `about`/`acerca-de`…) and per-tool/category localized slugs.
- **Trailing slashes everywhere** (`build.format: 'directory'`, `trailingSlash: 'always'`). Cloudflare serves directory indexes natively, so there are no redirect chains.
- UI strings live in `src/i18n/locales/{en,es}.ts`; `es` is typed as `Dictionary` (the shape of `en`), so a missing key is a compile error. Tool copy lives next to each tool.
- **Language behavior:**
  - `/` is a tiny gateway: stored explicit choice → first supported browser language → English, via `location.replace` (no history entry, no loop). Without JS it shows two links.
  - Localized pages **never auto-redirect** (bad for SEO and for users who chose a language). If the browser prefers another supported language and no choice is stored, a dismissible banner written in that language offers the equivalent page.
  - Clicking any language link stores the choice (`nexora:locale`).
- Localized 404s: the route table emits `/<locale>/404/`, and a build integration moves them to `/<locale>/404.html`, where Cloudflare serves the nearest `404.html`. A bilingual root `404.html` covers everything else.

## 5. Component model

**Astro (zero-JS) components**: `layout/` (Header, MobileNav, Footer, LanguageSwitcher, ThemeToggle, LocaleSuggestion), `ui/` (Icon, Logo), `seo/` (Seo, Breadcrumbs), `discovery/` (SearchBox, SearchDialog, ToolCard, ToolGrid, CategoryCard), `tool-page/` (PrivacyBadge, ToolInstructions, ToolFAQ, ToolFacts), `ads/AdSlot`.

**React tool framework** (`src/components/tools/`):

| Piece | Role |
| --- | --- |
| `useToolRunner` | State machine `idle → processing → success / error / cancelled`, AbortController cancellation, object-URL lifecycle, analytics events |
| `useFileSelection` | Validation (signature sniffing, size, count, total), add/remove/reorder |
| `FileToolLayout` | The standard flow for every file tool (dropzone → list + options → progress → result/error) |
| `FileDropzone`, `FileList`, `FilePreview` | Drag & drop, picker, paste, thumbnails, reorder |
| `ProgressIndicator`, `ResultPanel`, `DownloadButton`, `ToolError`, `Notice` | Feedback states |
| `options/` | Native-element controls: Segmented (radios), Range, Select, Checkbox, Number, Text, Color |
| `imageBatch` | Shared batch runner for image tools (bounded memory, per-file failures, ZIP) |
| `usePdfInspection`, `useImageProbe` | Early feedback after file selection (page counts, protection, dimensions) |

A typical tool is about 100–200 lines: state for its options, a task function, and `<FileToolLayout …/>`.

Islands receive **serialized props** built on the server: only the current locale's strings, the input spec with plan-adjusted limits, and related tool links. No dictionary or registry is ever bundled into client JS.

## 6. Client-side processing architecture

- **Execution modes**: every tool declares `executionMode: 'client' | 'server' | 'hybrid' | 'external'`. The privacy badge, tool facts and copy derive from it, so a tool **cannot** claim local processing unless the registry says so.
- **Workers**: pdf-lib work (merge, split, JPG→PDF assembly, PDF inspection, PDF compression) runs in one-shot module workers (`src/lib/workers`). Protocol: the worker posts `ready`, **then** the payload is transferred (zero-copy). If a worker can't start (old browser, policy), the untouched payload runs through the same `logic.ts` on the main thread (lazy import). Cancel = `worker.terminate()`.
- **PDF.js** (Mozilla) is loaded only when rendering is needed (PDF→JPG, compress "convert pages to images"). It parses in its own worker; pages render to canvas one at a time and each canvas is released immediately. CMaps, standard fonts, ICC and WASM decoders are copied to `/vendor/pdfjs/` at build (same origin, CSP-safe).
- **Images**: `createImageBitmap` (off-main-thread decode, EXIF orientation applied) → canvas with multi-step downscaling → native encoders. Header parsers check dimensions **before** decoding (decode ceilings: 200 MP desktop, 60 MP iOS). Canvas limits (iOS 16.7 MP) are respected by scaling down and telling the user.
- **WebP on Safari**: Safari can't encode WebP via canvas. `encodeCanvas()` detects this and lazy-loads `@jsquash/webp` (Squoosh's libwebp, WASM, ~300 KB) only in that case.
- **Memory hygiene**: sequential processing, `bitmap.close()`, canvas `width=height=0`, object URLs revoked on reset/new run/unmount, one-shot workers terminated.

## 7. SEO system

See [SEO_STRATEGY.md](SEO_STRATEGY.md). In short: unique titles and descriptions from the registry and dictionaries, absolute canonicals, reciprocal hreflang + `x-default`, a sitemap with `xhtml:link` alternates generated from the route table, JSON-LD (`WebApplication`, `BreadcrumbList`, `FAQPage`, `CollectionPage`, `WebSite`/`Organization`) and a post-build audit (`npm run audit:dist`).

## 8. Search

`src/lib/search/engine.ts` is a small, dependency-free engine: accent/case normalization, light stemming, weighted fields (name > aliases > keywords > category ≈ other-locale terms > description), prefix matching, Damerau–Levenshtein typo tolerance, strict-AND with OR fallback, and a phrase-order bonus. The index is generated at build (`/search-index/<locale>.json`, about 1 KB per tool) and fetched on first interaction. The `<nx-search>` custom element implements the ARIA 1.2 combobox pattern with no framework. The directory filter reuses the same engine to filter server-rendered cards in place.

## 9. Analytics

`src/lib/analytics` is a facade: `track(event, params)`. Parameters pass a strict **allow-list** of keys and "identifier-like" values; filenames, free text and exact sizes are dropped (sizes and durations are bucketed). GA4 loads **only** if `PUBLIC_GA4_ID` is set in a production build, and only after the visitor accepts the consent banner (Consent Mode "basic"). Events: `tool_view`, `file_selected`, `processing_started/success/error/cancelled`, `download_clicked`, `related_tool_clicked`, `search_used`, `search_result_clicked`, `language_changed`, `theme_changed`.

## 10. Future backend integration (prepared, not built)

- **Server tools** (OCR, PDF→DOCX, heavy AI): set `executionMode: 'server' | 'hybrid'` so the UI copy and badge change automatically. Implement `run.ts` with `fetch` to a Worker endpoint (`/api/<tool>` via Pages Functions, or a separate Worker such as `api.tools.codywork.com`). Upload to R2 with short-lived presigned URLs, process, then delete with lifecycle rules. Keep `logic.ts` portable, since the same code can run in a Worker for API access.
- **Auth and accounts** (Supabase or similar): `getActivePlan()` in `src/config/features.ts` is the single entitlement seam; tools already read plan-adjusted limits (`effectiveMaxFiles`, `effectiveMaxFileSizeMB`).
- **Payments** (Paddle): plan definitions and `PremiumFeature` flags exist; per-tool `premiumFeatures` document where premium would extend a tool.
- **Ads**: `AdSlot` (renders nothing while disabled, reserves height when enabled, placement rules below) and `RewardedAdGate` (passes through while disabled).
- **API access**: logic modules are DOM-free where possible (all PDF logic), so they can be exposed behind an authenticated Worker.

**Ad placement rules**: never inside the tool card, never adjacent to download buttons, file pickers or primary actions, never above the H1 or tool on mobile, and height always reserved (no CLS). Only the `tool-below-content`, `directory-footer` and `home-footer` slots exist.

## 11. Performance model

- Static HTML, CSS inlined when small, one self-hosted variable font (Geist latin, preloaded, `font-display: swap`).
- JS budget: home ~5 KB gz of vanilla scripts. Tool pages load React (~66 KB gz) plus a 1–8 KB gz tool chunk; heavy libraries load on use (pdf-lib ~175 KB gz inside workers, PDF.js ~147 KB gz plus its worker).
- `client:load` on tool islands (the tool is the page's purpose; the dropzone is SSR-rendered so there is no layout shift).
- Hover prefetch on key links (`data-astro-prefetch`).
- Security headers and long-lived immutable caching of `/_astro/*` via `public/_headers`.

## 12. Security

- CSP via Astro (`security.csp`): hashes for every inline script and style, `script-src 'self' 'wasm-unsafe-eval'` (+ GA host only when GA is enabled), `object-src 'none'`, `base-uri 'self'`, `connect-src 'self'`. `frame-ancestors 'none'`, HSTS, nosniff, Referrer-Policy and Permissions-Policy are in `_headers`.
- No `innerHTML` with dynamic data anywhere (icons are path data; search results are built with DOM APIs; JSON-LD is escaped).
- Untrusted filenames are sanitized (bidi overrides, control characters, reserved names) and rendered as text.
- Files are validated by **magic bytes**, not just extension/MIME. Header parsers bail out on malformed input.
- QR payloads block `javascript:`, `data:`, `vbscript:`, `file:` and `blob:` URLs; colors are validated before entering SVG output.

## 13. Scaling to hundreds of tools

- Adding a tool touches only its folder (see [ADDING_A_TOOL.md](ADDING_A_TOOL.md)).
- Header nav lists categories, not tools. The mobile menu, footer and directory list tools grouped by category. At roughly 100+ tools the mobile menu and footer should list categories plus popular tools only (`getPopularTools`), which is a one-line change per component.
- The search index is lazy and about 1 KB per tool: fine to 500+ tools (~500 KB uncompressed, ~60 KB gz). Beyond that, split the index per category or move to a Worker endpoint.
- New categories are data entries in `src/data/categories.ts`. The `CategoryId` type widens automatically.
- Build time is linear in pages (currently ~3 s for 42 pages).
