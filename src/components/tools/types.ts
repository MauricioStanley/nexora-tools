import type { Locale } from '@/config/site';
import type { Dictionary } from '@/i18n/locales/en';
import type { ToolInputSpec, ToolLink } from '@/tools/types';

/** Shared, localized strings every tool island receives. */
export type CommonToolStrings = Dictionary['tool'];

export interface IslandInputSpec extends ToolInputSpec {
  /** Value for <input accept>. */
  acceptAttr: string;
  /** Human labels of accepted formats ("PDF", "JPG"…). */
  formatLabels: string[];
  /** Effective limits after plan multipliers. */
  effectiveMaxFiles: number;
  effectiveMaxFileSizeMB: number;
}

/** Props serialized from Astro into every tool island. Keep them small and JSON-safe. */
export interface ToolIslandProps<UI = Record<string, unknown>> {
  toolId: string;
  toolName: string;
  locale: Locale;
  ui: UI;
  common: CommonToolStrings;
  input: IslandInputSpec;
  related: ToolLink[];
}
