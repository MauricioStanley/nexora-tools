import type { Locale } from '@/config/site';
import type { PremiumFeature } from '@/config/features';
import type { CategoryId } from '@/data/categories';
import type { FileTypeId, InputFileTypeId } from '@/lib/files/types';
import type { IconName } from '@/lib/icons';

/**
 * Where a tool's processing happens. Drives the privacy badge, copy and future routing
 * to backend services. Never mark a tool `client` unless NO file data leaves the browser.
 */
export type ExecutionMode = 'client' | 'server' | 'hybrid' | 'external';

/**
 * - `live`: listed, routed, in sitemap.
 * - `beta`: listed and routed with a Beta label.
 * - `coming-soon`: registry only — no page is generated (we never ship fake tools).
 * - `hidden`: registry only, excluded everywhere (e.g. kill-switched).
 */
export type ToolStatus = 'live' | 'beta' | 'coming-soon' | 'hidden';

export interface ToolInputSpec {
  kind: 'files' | 'none';
  accept: InputFileTypeId[];
  multiple: boolean;
  minFiles: number;
  maxFiles: number;
  /** Per-file limit for reliable in-browser processing (free plan). */
  maxFileSizeMB: number;
  /** Optional combined limit for multi-file tools. */
  maxTotalSizeMB?: number;
  /** Accept images pasted from the clipboard. */
  allowPaste?: boolean;
}

/** Language-neutral tool definition (`src/tools/<id>/meta.ts`). */
export interface ToolMeta {
  /** Stable kebab-case id. Equals the folder name. Never localized, never changed. */
  id: string;
  category: CategoryId;
  icon: IconName;
  /** Sort order within listings (lower first). */
  order: number;
  status: ToolStatus;
  /** Highlight in featured placements. */
  featured: boolean;
  /** Show in "Popular tools". */
  popular: boolean;
  executionMode: ExecutionMode;
  input: ToolInputSpec;
  output: FileTypeId[];
  /** Genuinely useful next steps. Order matters (first = strongest suggestion). */
  relatedToolIds: string[];
  /** Capabilities a premium plan could extend for this tool (documentation + future gating). */
  premiumFeatures?: PremiumFeature[];
  /** Localized URL slug (last path segment). */
  slugs: Record<Locale, string>;
  /** ISO date of the last meaningful change (sitemap `lastmod`). */
  dateModified: string;
  schema: {
    applicationCategory: 'UtilitiesApplication' | 'MultimediaApplication' | 'DesignApplication' | 'BusinessApplication';
  };
}

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolHowToStep {
  title: string;
  text: string;
}

/** Localized tool copy (`src/tools/<id>/i18n/<locale>.ts`). */
export interface ToolContent<UI extends object = Record<string, unknown>> {
  /** Tool name / H1, e.g. "Merge PDF". */
  name: string;
  /** Card description, ≤ ~90 characters. */
  tagline: string;
  /** Hero value proposition, 1–2 sentences. */
  description: string;
  seo: {
    /** ≤ ~60 characters, without the brand suffix (added automatically). */
    title: string;
    /** 120–160 characters. */
    description: string;
  };
  /** Search terms in this locale. */
  keywords: string[];
  /** Alternative phrasings people use ("join pdf", "combine pdf"). */
  aliases: string[];
  howTo: ToolHowToStep[];
  /** "What this tool does" paragraphs. */
  about: string[];
  /** Honest limitations shown under "Good to know". */
  limitations: string[];
  faq: ToolFaqItem[];
  /** Tool-specific UI strings, serialized into the island props. */
  ui: UI;
}

export interface Tool extends ToolMeta {
  content: Record<Locale, ToolContent>;
}

/** Link to another tool, as passed into islands. */
export interface ToolLink {
  id: string;
  name: string;
  href: string;
  icon: IconName;
}
