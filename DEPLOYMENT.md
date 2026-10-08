# Deployment (Cloudflare)

Nexora Tools is a fully static site. Any static host works, but it is designed for **Cloudflare Pages** (primary) or **Cloudflare Workers with static assets** (alternative). It deploys independently from the Codywork corporate site.

## 1. Build settings

| Setting | Value |
| --- | --- |
| Framework preset | Astro (or "None") |
| Build command | `npm run build` |
| Output directory | `dist` |
| Root directory | `/` (repository root) |
| Node.js version | `22.12.0` or newer (read from `.node-version`; or set `NODE_VERSION=22.12.0`) |
| Install command | `npm ci` (default: `npm install`) |

`npm run build` runs `prebuild` first, which copies PDF.js runtime assets into `public/vendor/pdfjs/` (a git-ignored, generated folder).

Recommended CI gate (for example a GitHub Action before merging to `main`):

```bash
npm ci
npm run verify   # astro check → vitest → build → dist audit
```

## 2. Environment variables

Set these in **Pages → Settings → Environment variables** (Production and, if wanted, Preview). All are build-time and public.

| Variable | Production | Preview | Notes |
| --- | --- | --- | --- |
| `PUBLIC_SITE_URL` | *(unset)* → `https://tools.codywork.com` | *(unset)* | Canonicals always point to production; previews are `noindex` via `_headers`. |
| `PUBLIC_GA4_ID` | `G-XXXXXXX` when analytics is approved | *(unset)* | Empty = no analytics code at all. The CSP whitelists Google hosts only when this is set. |
| `PUBLIC_GSC_VERIFICATION` | optional | *(unset)* | Prefer DNS verification. |
| `NODE_VERSION` | `22.12.0` | `22.12.0` | Only if `.node-version` isn't picked up. |

No secrets exist in V1.

## 3. GitHub → Cloudflare Pages flow

1. Push the repository to GitHub (a dedicated repo, for example `codywork/nexora-tools`).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → select the repo.
3. Production branch: `main`. Apply the build settings above.
4. Every push to `main` deploys production; every other branch or PR gets a preview URL (`<hash>.<project>.pages.dev`), marked `noindex` by `public/_headers`.
5. Protect `main` with required checks (`npm run verify`).

Rollback: Pages → Deployments → pick a previous deployment → **Rollback**.

## 4. Custom domain: `tools.codywork.com`

Assuming `codywork.com` DNS is on Cloudflare:

1. Pages project → **Custom domains → Set up a domain** → `tools.codywork.com`.
2. Cloudflare creates the proxied `CNAME tools → <project>.pages.dev` automatically (if DNS is elsewhere, add that CNAME manually at the DNS provider).
3. Wait for the certificate (usually minutes). SSL/TLS mode: **Full (strict)**. Enable "Always Use HTTPS".
4. Optionally redirect `<project>.pages.dev` to the custom domain with a Bulk Redirect, so the preview hostname never competes.

The subdomain is independent from the main `codywork.com` site: separate project, repo and deploys.

## 5. Headers, caching and redirects

`public/_headers` (copied to `dist/`) sets:

- Security: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`, `Content-Security-Policy: frame-ancestors 'none'`, `COOP`, `HSTS`. The main CSP (script/style hashes) is emitted per page by Astro as a `<meta>` tag.
- Caching: `/_astro/*` immutable for 1 year (fingerprinted), `/vendor/*` 30 days, `/search-index/*` 10 minutes with SWR, `/og/*` 7 days. HTML uses Cloudflare defaults (revalidated on deploy).
- Previews: `X-Robots-Tag: noindex` for `*.pages.dev`.

Trailing slashes: Cloudflare Pages serves `dist/en/tools/index.html` at `/en/tools/` and redirects `/en/tools` → `/en/tools/`. All internal links already include the slash.

404s: Pages serves the nearest `404.html`, so `/en/…` → `/en/404.html`, `/es/…` → `/es/404.html`, anything else → `/404.html`.

If a slug ever changes, add `public/_redirects` (for example `/en/tools/pdf/old-slug/ /en/tools/pdf/new-slug/ 301`).

## 6. Alternative: Cloudflare Workers (static assets)

`wrangler.jsonc` is included (`not_found_handling: 404-page`, `html_handling: force-trailing-slash`):

```bash
npm run build
npx wrangler deploy     # requires wrangler login / CLOUDFLARE_API_TOKEN
```

Then attach `tools.codywork.com` under the Worker's **Settings → Domains & Routes**. This path is useful once server tools need a Worker (API routes can live alongside the assets). `_headers` is supported by Workers static assets as well.

## 7. Post-deploy checklist

- [ ] `https://tools.codywork.com/` redirects to `/en/` or `/es/` by browser language
- [ ] `https://tools.codywork.com/sitemap.xml` and `/robots.txt` load, with absolute production URLs
- [ ] A tool page's source shows canonical, hreflang (en, es, x-default) and JSON-LD
- [ ] DevTools Console shows no CSP violations while running a PDF tool and an image tool
- [ ] `/vendor/pdfjs/cmaps/` and `/_astro/*.wasm` are served (PDF to JPG and WebP on Safari work)
- [ ] Response headers include HSTS, `X-Frame-Options`, `Referrer-Policy`
- [ ] Unknown URLs return the localized 404 with status 404
- [ ] Search Console: add the domain property (DNS TXT via Cloudflare), submit the sitemap
- [ ] Bing Webmaster Tools: import from Search Console
- [ ] Lighthouse or PageSpeed on home and one tool page (mobile)

## 8. Costs

The static site fits the Cloudflare free plan (unlimited static requests on Pages; bandwidth isn't billed). Processing costs nothing server-side because it runs in users' browsers.
