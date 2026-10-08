# Nexora Tools — by Codywork

**Fast, private tools for everyday files.** Nexora Tools is a collection of free online micro-tools (PDF, image and utility) where each tool is its own landing page and, whenever technically possible, files are processed **entirely in the visitor's browser**. Nothing is uploaded.

- Production URL: `https://tools.codywork.com`
- Owner: [Codywork](https://codywork.com)
- Languages: English (`/en/`) and Spanish (`/es/`)

## V1 tools

| Category | Tool | EN URL | ES URL | Runs |
| --- | --- | --- | --- | --- |
| PDF | Merge PDF | `/en/tools/pdf/merge-pdf/` | `/es/herramientas/pdf/unir-pdf/` | Worker (pdf-lib) |
| PDF | Split PDF | `/en/tools/pdf/split-pdf/` | `/es/herramientas/pdf/dividir-pdf/` | Worker (pdf-lib) |
| PDF | Compress PDF | `/en/tools/pdf/compress-pdf/` | `/es/herramientas/pdf/comprimir-pdf/` | Worker + OffscreenCanvas; optional PDF.js raster mode |
| PDF | JPG to PDF | `/en/tools/pdf/jpg-to-pdf/` | `/es/herramientas/pdf/jpg-a-pdf/` | Main thread prep + worker (pdf-lib) |
| PDF | PDF to JPG | `/en/tools/pdf/pdf-to-jpg/` | `/es/herramientas/pdf/pdf-a-jpg/` | PDF.js (own worker) + canvas |
| Image | Compress Image | `/en/tools/image/compress-image/` | `/es/herramientas/imagen/comprimir-imagen/` | Canvas encoders |
| Image | Resize Image | `/en/tools/image/resize-image/` | `/es/herramientas/imagen/redimensionar-imagen/` | Canvas |
| Image | WebP to JPG | `/en/tools/image/webp-to-jpg/` | `/es/herramientas/imagen/webp-a-jpg/` | Canvas |
| Image | JPG / PNG to WebP | `/en/tools/image/to-webp/` | `/es/herramientas/imagen/a-webp/` | Canvas; WASM encoder fallback on Safari |
| Utility | QR Code Generator | `/en/tools/utility/qr-code-generator/` | `/es/herramientas/utilidades/generador-qr/` | Pure JS (uqr) |

All 10 tools are `executionMode: 'client'`: no file data leaves the device.

## Tech stack

- **Astro 7** (static output) + **TypeScript 6** (strict)
- **React 19** islands only for interactive tool UIs (home, directory and content pages ship no React)
- Plain CSS with design tokens (`src/styles/tokens.css`), scoped Astro styles and CSS Modules
- Processing: `pdf-lib`, `pdfjs-dist` (lazy), `fflate` (ZIP), `uqr` (QR), `@jsquash/webp` (lazy, Safari only), native Canvas/`createImageBitmap`
- **Vitest** for unit tests; a custom post-build SEO/link audit
- Deploys as static files to **Cloudflare Pages** (or Workers static assets)

## Requirements

- Node.js **≥ 22.12** (`.node-version` pins 22.12.0)
- npm ≥ 10

## Getting started

```bash
npm install
npm run dev          # http://localhost:4321
```

The root URL `/` detects the preferred language and redirects to `/en/` or `/es/`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server (copies PDF.js assets first) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve `dist/` locally. **The CSP is only active in builds**, so test security here. |
| `npm run check` | TypeScript + Astro diagnostics |
| `npm test` | Unit tests (registry, routing, SEO, i18n, search, file safety, tool logic) |
| `npm run audit:dist` | Post-build audit: broken links, titles, descriptions, canonicals, hreflang reciprocity, H1s, sitemap coverage |
| `npm run verify` | check → test → build → audit (run before every deploy) |
| `npm run assets:brand` | Regenerate favicons, PWA icons and Open Graph images (uses `sharp`) |
| `npm run qa:fixtures` | Writes sample files to `dist/__qa/` for manual testing against `npm run preview` |

## Environment variables

All optional. See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SITE_URL` | Canonical origin (default `https://tools.codywork.com`). |
| `PUBLIC_GA4_ID` | GA4 measurement ID. Empty = no analytics code is loaded at all. |
| `PUBLIC_GSC_VERIFICATION` | Google Search Console meta verification token (DNS verification preferred). |

## Repository structure

```
astro.config.mjs          Astro config, CSP, worker format
integrations/             Build hook that places localized 404 pages
public/                   Static files (_headers, icons, OG images); vendor/ is generated
scripts/                  Asset generation, PDF.js asset copy, dist audit, QA fixtures
src/
  config/                 brand, site/locales, feature flags, ads, analytics
  i18n/                   dictionaries (en, es), format helpers, language detection
  data/categories.ts      Category registry
  tools/                  Tool Registry + one folder per tool
    registry.ts           Auto-discovers tools, validates integrity
    <tool-id>/            meta.ts · i18n/{en,es}.ts · logic.ts · worker.ts · run.ts · Tool.tsx · Island.astro · tests
  components/
    layout/ ui/ seo/ discovery/ tool-page/ ads/ analytics/   Astro (zero-JS) components
    tools/                Shared React tool framework (runner, dropzone, results, errors, options)
  lib/                    Framework-agnostic logic: routing, seo, search, files, image, pdf, workers, analytics
  views/                  Page bodies rendered by the catch-all route
  pages/                  index (language gateway), [...path] (all pages), 404, sitemap, robots, search index
  content/pages/          About / Privacy / Terms / Contact in Markdown per locale
  scripts/                Small vanilla client scripts (search element, site behaviors)
  styles/                 tokens, base, fonts
tests/                    Cross-cutting tests + fixtures
```

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md): how the system works and why
- [ADDING_A_TOOL.md](ADDING_A_TOOL.md): step-by-step guide for tool #11 through #500
- [SEO_STRATEGY.md](SEO_STRATEGY.md): URLs, hreflang, schema, content rules
- [PRIVACY_ARCHITECTURE.md](PRIVACY_ARCHITECTURE.md): what leaves the browser (nothing, for V1 tools)
- [DEPLOYMENT.md](DEPLOYMENT.md): Cloudflare Pages setup and `tools.codywork.com`
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md): visual language and design rationale
- [ASTRA_HANDOFF.md](ASTRA_HANDOFF.md): audit handoff, known limitations and risks

## Quality gates (current state)

- `npm run check`: 0 errors, 0 warnings
- `npm test`: 113 tests passing
- `npm run build`: 42 pages
- `npm run audit:dist`: 0 errors
