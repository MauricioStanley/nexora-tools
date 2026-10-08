/**
 * Product analytics facade.
 *
 * Components call `track(event, params)`. Parameters pass through a strict allow-list:
 * anything that could identify a user's document (file names, text, raw sizes) is dropped
 * before it can reach any provider. Providers (GA4 today) are wired in `Analytics.astro`.
 */
import { analyticsConfig } from '@/config/analytics';

export type AnalyticsEvent =
  | 'tool_view'
  | 'file_selected'
  | 'processing_started'
  | 'processing_success'
  | 'processing_error'
  | 'processing_cancelled'
  | 'download_clicked'
  | 'related_tool_clicked'
  | 'search_used'
  | 'search_result_clicked'
  | 'language_changed'
  | 'theme_changed';

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

/** Keys that may ever be sent. Everything else is discarded. */
const ALLOWED_KEYS = new Set([
  'tool',
  'category',
  'locale',
  'files_count',
  'size_bucket',
  'pages_bucket',
  'success',
  'error_code',
  'duration_bucket',
  'output_format',
  'mode',
  'source',
  'target_tool',
  'position',
  'results_count',
  'query_length',
  'search_term',
  'from_locale',
  'to_locale',
  'theme',
]);

/** Values must look like identifiers/enums — never free text. */
const SAFE_STRING = /^[a-z0-9][a-z0-9_\-.]{0,39}$/i;
const FILE_EXTENSION = /\.(pdf|jpe?g|png|webp|gif|heic|docx?|xlsx?|pptx?|txt|zip|svg)$/i;

export function sanitizeParams(params: AnalyticsParams, options = { allowSearchTerm: analyticsConfig.sendSearchTerms }): Record<string, string | number | boolean> {
  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || !ALLOWED_KEYS.has(key)) continue;
    if (key === 'search_term' && !options.allowSearchTerm) continue;
    if (typeof value === 'number') {
      if (Number.isFinite(value)) clean[key] = Math.round(value);
      continue;
    }
    if (typeof value === 'boolean') {
      clean[key] = value;
      continue;
    }
    const str = String(value).trim();
    if (!SAFE_STRING.test(str) || FILE_EXTENSION.test(str)) continue;
    clean[key] = str.toLowerCase();
  }
  return clean;
}

/** Coarse buckets instead of exact values (exact sizes can fingerprint documents). */
export function sizeBucket(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return 'lt_1mb';
  if (mb < 10) return '1_10mb';
  if (mb < 50) return '10_50mb';
  if (mb < 200) return '50_200mb';
  return 'gte_200mb';
}

export function durationBucket(ms: number): string {
  if (ms < 1000) return 'lt_1s';
  if (ms < 5000) return '1_5s';
  if (ms < 20000) return '5_20s';
  if (ms < 60000) return '20_60s';
  return 'gte_60s';
}

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === 'undefined') return;
  const clean = sanitizeParams(params);
  if (import.meta.env?.DEV && analyticsConfig.debugInDev) {
    console.debug('[analytics]', event, clean);
  }
  if (!analyticsConfig.enabled || typeof window.gtag !== 'function') return;
  try {
    window.gtag('event', event, clean);
  } catch {
    /* analytics must never break a tool */
  }
}
