import type { ReactNode } from 'react';
import { adsConfig } from '@/config/ads';

interface RewardedAdGateProps {
  /** Content unlocked by the gate (e.g. a larger batch). */
  children: ReactNode;
  /** Rendered when the gate would be shown (future). */
  fallback?: ReactNode;
}

/**
 * Extension point for rewarded ads (e.g. "watch a short ad to process a larger batch").
 * Disabled in V1: it always renders its children. It must never wrap the free core flow —
 * only optional extras beyond the free limits.
 */
export function RewardedAdGate({ children, fallback }: RewardedAdGateProps) {
  if (!adsConfig.enabled || !adsConfig.rewarded.enabled) return <>{children}</>;
  // A provider integration would decide here whether the reward has been earned.
  return <>{fallback ?? children}</>;
}
