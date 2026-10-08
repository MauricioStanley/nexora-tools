/**
 * Advertising configuration. **Everything is disabled in V1.**
 *
 * Placement rules (enforced by where <AdSlot> is allowed to be rendered, see ARCHITECTURE.md):
 * - Never adjacent to download buttons, file pickers or primary actions.
 * - Never inside the tool card.
 * - Never above the H1 / tool on mobile.
 * - Must reserve its own height to avoid layout shift when enabled.
 */
export type AdProviderId = 'none' | 'adsense';

export type AdSlotId = 'tool-below-content' | 'directory-footer' | 'home-footer';

export interface AdSlotConfig {
  enabled: boolean;
  /** Reserved height in px (prevents CLS when an ad loads). */
  minHeight: number;
}

export const adsConfig: {
  enabled: boolean;
  provider: AdProviderId;
  slots: Record<AdSlotId, AdSlotConfig>;
  rewarded: { enabled: boolean };
} = {
  enabled: false,
  provider: 'none',
  slots: {
    'tool-below-content': { enabled: false, minHeight: 280 },
    'directory-footer': { enabled: false, minHeight: 250 },
    'home-footer': { enabled: false, minHeight: 250 },
  },
  rewarded: { enabled: false },
};

export function isAdSlotEnabled(id: AdSlotId): boolean {
  return adsConfig.enabled && adsConfig.provider !== 'none' && adsConfig.slots[id].enabled;
}
