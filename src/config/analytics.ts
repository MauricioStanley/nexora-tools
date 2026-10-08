/**
 * Analytics configuration.
 *
 * Analytics is OFF unless `PUBLIC_GA4_ID` is set at build time AND the build is a
 * production build. Even then, Google Consent Mode starts as "denied" and the GA script
 * only receives events after the visitor grants consent.
 */
const ga4Id = (import.meta.env?.PUBLIC_GA4_ID ?? '').trim();
const isProd = Boolean(import.meta.env?.PROD);

export const analyticsConfig = {
  ga4MeasurementId: ga4Id,
  enabled: isProd && /^G-[A-Z0-9]+$/.test(ga4Id),
  /** Require explicit opt-in before GA may set cookies or send hits. */
  requireConsent: true,
  /**
   * Raw search queries can contain personal data (people paste names, emails…).
   * Off by default: we only send query length and result count.
   */
  sendSearchTerms: false,
  /** Log sanitized events to the console during development. */
  debugInDev: true,
  searchConsoleVerification: (import.meta.env?.PUBLIC_GSC_VERIFICATION ?? '').trim(),
} as const;
