/**
 * Feature flags and plan limits.
 *
 * V1 ships a single free plan. The structures below exist so premium capabilities can be
 * introduced later by flipping configuration and adding an entitlement source (e.g. a
 * session from an auth provider) — not by rewriting tools.
 */

/** Product-level UI features. Safe to toggle at build time. */
export const featureFlags = {
  themeSwitcher: true,
  /** Non-intrusive "this page is available in your language" banner. */
  localeSuggestion: true,
  /** Remember recently used tools in localStorage and show them on the homepage. */
  recentTools: true,
  /** Header search dialog (Ctrl/⌘ + K). */
  searchDialog: true,
} as const;

/** Capabilities a future paid plan could unlock. */
export type PremiumFeature =
  | 'largerFiles'
  | 'batchProcessing'
  | 'noAds'
  | 'advancedCompression'
  | 'premiumUtilities'
  | 'apiAccess';

export type PlanId = 'free' | 'premium';

export interface PlanDefinition {
  id: PlanId;
  /** Multiplier applied to each tool's declared file-size limit. */
  fileSizeMultiplier: number;
  /** Multiplier applied to each tool's declared max file count. */
  fileCountMultiplier: number;
  features: Record<PremiumFeature, boolean>;
}

export const plans: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    fileSizeMultiplier: 1,
    fileCountMultiplier: 1,
    features: {
      largerFiles: false,
      batchProcessing: true, // Basic batches are free in V1.
      noAds: true, // No ads exist in V1.
      advancedCompression: false,
      premiumUtilities: false,
      apiAccess: false,
    },
  },
  premium: {
    id: 'premium',
    fileSizeMultiplier: 4,
    fileCountMultiplier: 4,
    features: {
      largerFiles: true,
      batchProcessing: true,
      noAds: true,
      advancedCompression: true,
      premiumUtilities: true,
      apiAccess: true,
    },
  },
};

/** Premium is not sold in V1. When false, every visitor resolves to the free plan. */
export const premiumConfig = {
  enabled: false,
} as const;

/**
 * Resolve the active plan. V1 always returns `free`; later this reads an entitlement
 * (auth session, signed cookie, license key) — the call sites stay unchanged.
 */
export function getActivePlan(): PlanDefinition {
  return plans.free;
}

export function hasFeature(feature: PremiumFeature, plan: PlanDefinition = getActivePlan()): boolean {
  return plan.features[feature];
}
