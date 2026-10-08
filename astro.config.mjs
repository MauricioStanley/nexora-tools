// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { loadEnv } from 'vite';
import { localized404 } from './integrations/localized-404.mjs';

/**
 * Build-time environment.
 * Only PUBLIC_* variables are read here; see .env.example for documentation.
 */
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

/** Canonical production origin. Override only for staging builds that must self-reference. */
const SITE = (env.PUBLIC_SITE_URL || 'https://nexora-tools.stanleycedillos1.workers.dev').replace(/\/+$/, '');
const GA4_ID = (env.PUBLIC_GA4_ID || '').trim();

/**
 * Content Security Policy.
 * Astro hashes every script/style it emits and writes a <meta http-equiv="content-security-policy">
 * per page. `frame-ancestors` cannot be delivered by <meta>, so it lives in public/_headers.
 */
const scriptResources = ["'self'", "'wasm-unsafe-eval'"];
const connectSources = ["'self'"];
if (GA4_ID) {
  scriptResources.push('https://www.googletagmanager.com');
  connectSources.push(
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://*.googletagmanager.com',
  );
}

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  markdown: {
    // No code blocks in content; Shiki's inline styles would conflict with the CSP.
    syntaxHighlight: false,
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [react(), localized404()],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        `connect-src ${connectSources.join(' ')}`,
        "worker-src 'self' blob:",
        "media-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "manifest-src 'self'",
      ],
      scriptDirective: {
        resources: scriptResources,
      },
    },
  },
  vite: {
    worker: {
      // Module workers allow code-splitting inside workers (pdf-lib is only loaded by PDF workers).
      format: 'es',
    },
    optimizeDeps: {
      // The jsquash codec resolves its .wasm through `new URL(..., import.meta.url)`;
      // pre-bundling would break that path in dev.
      exclude: ['@jsquash/webp'],
    },
  },
});
