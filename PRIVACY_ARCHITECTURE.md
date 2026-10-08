# Privacy architecture

Privacy is a core product differentiator and it is enforced **by architecture, not by promise**. This document states exactly what data exists, where it goes, and how long it lives.

## 1. Summary

| Data | Leaves the device? | Where it lives | Lifetime |
| --- | --- | --- | --- |
| Files selected in any V1 tool | **No** | Browser memory (tab) | Until reset, new run, tab close |
| Processed results | **No** | Browser memory as Blobs + object URLs | Until download/reset/unmount (URLs revoked) |
| Text typed in the QR generator (incl. Wi-Fi passwords) | **No** | React state in the tab | Until the tab closes |
| Preferences (language, theme, dismissed banner, analytics choice) | No | `localStorage` | Until the user clears site data |
| Recently used tool IDs | No | `localStorage` (IDs only, never file names) | Until cleared |
| Page requests (IP, user agent) | Yes, as with any website | Cloudflare (hosting/CDN/security) | Per Cloudflare's policies |
| Product analytics events | Only if GA4 is configured **and** the user consents | Google Analytics | Per GA retention settings |

## 2. Execution modes

Each tool declares `executionMode` in its `meta.ts`:

| Mode | Meaning | Badge |
| --- | --- | --- |
| `client` | All processing in the browser; no file data is transmitted | "On your device: Your files never leave your device." |
| `hybrid` | Some steps use a server | "Mostly on your device" + details |
| `server` | Files are uploaded for processing | "Server processing" + details |
| `external` | A third-party provider is involved | "External service" + details |

**All 10 V1 tools are `client`.** The badge, "Tool details" and copy are generated from this field, so a page cannot display a local-processing claim for a tool that isn't declared `client`. Tests assert every listed V1 tool is `client`.

## 3. Client-side processing lifecycle

1. **Select**: the file comes from `<input type="file">`, drag and drop or paste. It is validated by magic bytes (first 1 KB is read), size and count. Nothing is read beyond the header until processing starts.
2. **Process**: bytes are read into memory (`Blob.arrayBuffer()`) and either transferred zero-copy to a one-shot Web Worker or processed on the main thread (canvas). PDF.js parses in its own worker.
3. **Result**: output Blobs get object URLs for `<a download>` links.
4. **Cleanup**: object URLs are revoked on reset, new run and component unmount. Workers are terminated after each task (memory freed). `ImageBitmap`s are closed and canvases zeroed immediately after use.
5. **Nothing persists**: no IndexedDB, Cache Storage, service worker, or localStorage for file data.

Code-level guarantees: no `fetch`/`XMLHttpRequest`/`sendBeacon` sends file data anywhere (`grep` for them: only same-origin static assets and the search index are fetched). The CSP restricts `connect-src` to `'self'` (plus Google Analytics hosts only when GA is enabled), which technically **blocks** any accidental upload to third parties.

### Libraries executed locally

pdf-lib, PDF.js (Mozilla), fflate, uqr and @jsquash/webp (libwebp compiled to WASM) are bundled and served from our own origin (`/_astro/*`, `/vendor/pdfjs/*`). No CDN or third-party script is involved in processing.

## 4. Metadata handling

- **Images**: re-encoded images are created fresh from pixels via canvas, so EXIF (GPS location, camera, dates) is **not** carried over. When Compress Image keeps an original because it couldn't be improved, that file is unchanged (metadata included), and the UI says "original kept".
- **JPG to PDF**: "Remove photo metadata" (default on) strips EXIF/XMP/IPTC/comments from JPEGs losslessly before embedding. ICC color profiles are kept. PNG text chunks never reach the PDF (pdf-lib re-encodes PNG pixel data).
- **Compress PDF**: "Remove document metadata" (default on) clears the Info dictionary (title, author, creator, producer…) and the XMP metadata stream.
- PDFs created by Nexora set `Producer: Nexora Tools` (no personal data).

## 5. Analytics behavior

- Off by default. It is enabled only when `PUBLIC_GA4_ID` is set **and** the build is production.
- Consent Mode "basic": **no Google request of any kind** happens until the visitor clicks "Allow analytics". Declining is remembered and no script is loaded. `ad_storage`, `ad_user_data`, `ad_personalization` are always denied, and Google signals and ad personalization are disabled.
- Every event passes `sanitizeParams()`:
  - allow-listed keys only (`tool`, `files_count`, `size_bucket`, `error_code`, `output_format`, `mode`, …)
  - string values must look like identifiers (≤ 40 chars, no spaces) and **must not end in a file extension**
  - sizes and durations are bucketed (`1_10mb`, `1_5s`), never exact
  - raw search queries are dropped unless `analyticsConfig.sendSearchTerms` is enabled deliberately (off, because people paste personal data into search boxes)
- Unit tests cover filename, free-text and search-term stripping.

Good: `{ tool: 'merge-pdf', files_count: 3, success: true }`. Never: `{ filename: 'John_Doe_Tax_Return_2026.pdf' }`.

## 6. Storage keys

| Key | Value |
| --- | --- |
| `nexora:locale` | `en` / `es` (explicit choice only) |
| `nexora:theme` | `dark` / `light` |
| `nexora:recent-tools` | JSON array of up to 8 tool IDs |
| `nexora:locale-suggestion-dismissed` | `1` |
| `nexora:analytics-consent` | `granted` / `denied` |

All access goes through `src/lib/storage.ts` (try/catch; it degrades silently when storage is blocked).

## 7. Hosting data

Cloudflare processes standard request data (IP, user agent, timestamps) to serve and protect the site. Keep Cloudflare Web Analytics or other Cloudflare features aligned with the Privacy Policy if they are enabled. They are not required.

## 8. Future server-processing policy

Before any tool with `executionMode` `server`/`hybrid` ships:

1. Update the Privacy Policy (both languages) **before** release: what is uploaded, purpose, processor, location, retention.
2. Upload directly to storage (for example Cloudflare R2) with short-lived presigned URLs over HTTPS; never through analytics or logs.
3. Delete inputs and outputs automatically (target: minutes, enforced by R2 lifecycle rules plus explicit deletion after download).
4. Never log file names or contents; log only request IDs, sizes (bucketed) and outcomes.
5. Show the non-local badge and a clear sentence before the user starts.
6. Add the API origin to CSP `connect-src` explicitly.
7. Consider regional processing and a DPA for EU users.

## 9. Legal review

The Privacy Policy and Terms in `src/content/pages/` are accurate descriptions of this implementation, written for plain-language clarity. **They must be reviewed by legal counsel** (company details, jurisdiction, GDPR/LGPD/CCPA specifics, children's policy) before launch. See ASTRA_HANDOFF.md.
