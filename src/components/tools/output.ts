/**
 * Output files produced by tools. Each holds an object URL for downloading; the runner
 * revokes every URL on reset, on a new run and on unmount, so blobs don't leak.
 */
export interface OutputFile {
  id: string;
  name: string;
  blob: Blob;
  url: string;
  size: number;
  type: string;
  /** Optional details shown in the result list (dimensions, pages…). */
  detail?: string;
  /** Size of the corresponding input, for before/after comparisons. */
  inputSize?: number;
  /** True when processing could not improve the file and the original was kept. */
  keptOriginal?: boolean;
}

export interface ToolResult {
  files: OutputFile[];
  /** ZIP of all files, when there is more than one. */
  archive?: OutputFile;
  /** One-line summary under the success title. */
  summary?: string;
  /** Totals for the before/after comparison. */
  totals?: { before: number; after: number };
  /** Honest notes (e.g. "2 pages were rendered at lower resolution on this device"). */
  notes?: string[];
  /** Only show the archive download (large batches). */
  archiveOnly?: boolean;
}

let counter = 0;

function uid(): string {
  counter += 1;
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `out-${Date.now().toString(36)}-${counter}`;
}

export function createOutput(blob: Blob, name: string, extra: Partial<Omit<OutputFile, 'id' | 'blob' | 'url' | 'name' | 'size' | 'type'>> = {}): OutputFile {
  return {
    id: uid(),
    name,
    blob,
    url: URL.createObjectURL(blob),
    size: blob.size,
    type: blob.type,
    ...extra,
  };
}

export function releaseResult(result: ToolResult | null | undefined): void {
  if (!result) return;
  for (const file of result.files) URL.revokeObjectURL(file.url);
  if (result.archive) URL.revokeObjectURL(result.archive.url);
}
