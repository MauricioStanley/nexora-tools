/**
 * Split PDF — pure processing logic (worker + Node tests).
 */
import { createZip } from '@/lib/files/zip';
import { loadPdfDocument, stampProducer } from '@/lib/pdf/load';
import { PDFDocument } from '@/lib/pdf/pdf-lib';
import { chunkRanges, expandRanges, formatRange, type PageRange } from '@/lib/pdf/ranges';

export type SplitMode = 'all' | 'ranges' | 'extract' | 'every';

export interface SplitPayload {
  file: ArrayBuffer;
  baseName: string;
  mode: SplitMode;
  /** For `ranges` and `extract`. Already validated against the page count. */
  ranges?: PageRange[];
  /** For `every`. */
  every?: number;
  names: { page: string; pages: string; extracted: string };
  /** Return individual files only when there are at most this many. */
  maxIndividualFiles: number;
}

export interface SplitOutput {
  name: string;
  bytes: Uint8Array;
  pages: number;
}

export interface SplitResult {
  files: SplitOutput[];
  zip: Uint8Array | null;
  totalOutputs: number;
  sourcePages: number;
}

/** Which page groups a mode produces (1-based, inclusive). */
export function planGroups(mode: SplitMode, pageCount: number, ranges: PageRange[] = [], every = 1): PageRange[][] {
  switch (mode) {
    case 'all':
      return Array.from({ length: pageCount }, (_, i) => [{ start: i + 1, end: i + 1 }]);
    case 'ranges':
      return ranges.map((r) => [r]);
    case 'extract':
      return ranges.length > 0 ? [ranges] : [];
    case 'every':
      return chunkRanges(pageCount, every).map((r) => [r]);
  }
}

function groupName(mode: SplitMode, group: PageRange[], payload: SplitPayload, width: number): string {
  if (mode === 'extract') return `${payload.baseName}-${payload.names.extracted}.pdf`;
  const range = group[0]!;
  const pad = (n: number) => String(n).padStart(width, '0');
  return range.start === range.end
    ? `${payload.baseName}-${payload.names.page}-${pad(range.start)}.pdf`
    : `${payload.baseName}-${payload.names.pages}-${pad(range.start)}-${pad(range.end)}.pdf`;
}

export async function splitPdf(payload: SplitPayload, onProgress?: (value: number) => void): Promise<SplitResult> {
  const source = await loadPdfDocument(new Uint8Array(payload.file));
  const pageCount = source.getPageCount();
  const groups = planGroups(payload.mode, pageCount, payload.ranges, payload.every);
  const width = String(pageCount).length;
  const outputs: SplitOutput[] = [];

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]!;
    const indices = expandRanges(group).map((page) => page - 1);
    const doc = await PDFDocument.create();
    stampProducer(doc);
    const pages = await doc.copyPages(source, indices);
    pages.forEach((page) => doc.addPage(page));
    outputs.push({
      name: groupName(payload.mode, group, payload, width),
      bytes: await doc.save({ useObjectStreams: true }),
      pages: indices.length,
    });
    onProgress?.(((i + 1) / groups.length) * 0.9);
  }

  let zip: Uint8Array | null = null;
  if (outputs.length > 1) {
    zip = createZip(outputs.map((o) => ({ name: o.name, data: o.bytes })));
  }
  onProgress?.(1);

  const keepIndividual = outputs.length <= payload.maxIndividualFiles;
  return {
    files: keepIndividual ? outputs : [],
    zip,
    totalOutputs: outputs.length,
    sourcePages: pageCount,
  };
}

export { formatRange };
