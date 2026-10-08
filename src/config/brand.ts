/**
 * Brand configuration — the single source of truth for product identity.
 *
 * Localized marketing copy (taglines, descriptions) lives in the i18n dictionaries;
 * everything language-neutral lives here. Never hardcode these values in components.
 */
export const brand = {
  /** Official product name. */
  productName: 'Nexora Tools',
  /** Short name used where space is constrained (PWA manifest, tight UI). */
  productShortName: 'Nexora',
  /** Parent company. */
  companyName: 'Codywork',
  /** Legal entity used in copyright and legal pages. Confirm with legal before launch. */
  legalName: 'Codywork',
  /** Brand relationship line. */
  relationship: 'Nexora Tools by Codywork',
  /** Canonical production URL of the product. */
  productUrl: 'https://tools.codywork.com',
  /** Corporate website. */
  companyUrl: 'https://codywork.com',
  /**
   * Public support address shown on the Contact page.
   * ⚠️ Must be confirmed (mailbox must exist) before launch — see ASTRA_HANDOFF.md.
   */
  supportEmail: 'support@codywork.com',
  /** Year the product launched (copyright ranges). */
  launchYear: 2026,
  /** Browser UI color (matches --color-bg in the dark theme). */
  themeColor: {
    dark: '#0a0c0f',
    light: '#f6f7f9',
  },
  assets: {
    logoMark: '/brand/nexora-mark.svg',
    favicon: '/favicon.svg',
    appleTouchIcon: '/apple-touch-icon.png',
    /** Default social preview images per locale (1200×630). */
    ogImage: {
      en: '/og/nexora-en.png',
      es: '/og/nexora-es.png',
    },
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
  social: {
    /** Twitter/X handle without "@". Leave empty until an account exists. */
    twitterHandle: '',
  },
} as const;

export type Brand = typeof brand;
