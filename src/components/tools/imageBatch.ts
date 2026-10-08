/**
 * Shared batch runner for image tools (compress, resize, convert).
 * Processes images one at a time (bounded memory), reports progress, never fails the whole
 * batch because of one bad file, optionally keeps originals that can't be improved, and
 * packages multiple results into a ZIP.
 */
import { fmt, plural } from '@/i18n/format';
import { ToolFailure, throwIfAborted, toFailure } from '@/lib/errors';
import { readBytes, yieldToMain } from '@/lib/files/read';
import { createZip } from '@/lib/files/zip';
import { processImage, type ImageProcessOptions } from '@/lib/image/pipeline';
import { createOutput, type OutputFile, type ToolResult } from './output';
import type { CommonToolStrings } from './types';
import type { SelectedFile } from './useFileSelection';
import type { RunContext } from './useToolRunner';

export interface ImageJob {
  item: SelectedFile;
  options: Omit<ImageProcessOptions, 'signal'>;
  /** Output filename (already including extension). */
  outputName: string;
  /** Compress-style tools: if the result isn't smaller, return the original file instead. */
  keepOriginalIfLarger?: boolean;
}

export interface ImageBatchOptions {
  common: CommonToolStrings;
  locale: string;
  /** ZIP filename when there are several outputs. */
  archiveName: string;
  /** Show the before/after size comparison. */
  withTotals?: boolean;
  summary?: (count: number) => string;
  /** Above this many outputs only the ZIP is offered. */
  maxIndividual?: number;
}

export async function runImageBatch(jobs: ImageJob[], ctx: RunContext, options: ImageBatchOptions): Promise<ToolResult> {
  const { common, locale } = options;
  const outputs: OutputFile[] = [];
  const failed: { name: string; error: ToolFailure }[] = [];
  let before = 0;
  let after = 0;
  let limited = 0;

  for (let i = 0; i < jobs.length; i++) {
    throwIfAborted(ctx.signal);
    const job = jobs[i]!;
    ctx.progress(i / jobs.length, fmt(common.status.itemProgress, { current: i + 1, total: jobs.length }));
    try {
      const result = await processImage(job.item.file, job.item.type, { ...job.options, signal: ctx.signal });
      if (result.limitedByDevice) limited += 1;
      const detail = fmt(common.fileList.dimensions, { width: result.width, height: result.height });
      before += job.item.size;
      if (job.keepOriginalIfLarger && result.blob.size >= job.item.size) {
        outputs.push(createOutput(job.item.file, job.item.name, { inputSize: job.item.size, keptOriginal: true, detail }));
        after += job.item.size;
      } else {
        outputs.push(createOutput(result.blob, job.outputName, { inputSize: job.item.size, detail }));
        after += result.blob.size;
      }
    } catch (error) {
      const failure = toFailure(error);
      if (failure.code === 'cancelled') throw failure;
      failed.push({ name: job.item.name, error: failure });
    }
    await yieldToMain();
  }

  if (outputs.length === 0) {
    // Nothing succeeded: surface the first real error.
    throw failed[0]?.error ?? new ToolFailure('unknown');
  }

  const notes: string[] = [];
  if (failed.length > 0) {
    notes.push(plural(common.result.skipped, failed.length, locale, { names: failed.map((f) => f.name).join(', ') }));
  }
  if (limited > 0) notes.push(plural(common.result.limitedByDevice, limited, locale));

  let archive: OutputFile | undefined;
  if (outputs.length > 1) {
    ctx.progress(0.97, common.status.processing);
    const entries = await Promise.all(outputs.map(async (o) => ({ name: o.name, data: await readBytes(o.blob) })));
    archive = createOutput(new Blob([createZip(entries) as Uint8Array<ArrayBuffer>], { type: 'application/zip' }), options.archiveName);
  }

  const maxIndividual = options.maxIndividual ?? 30;
  const archiveOnly = Boolean(archive) && outputs.length > maxIndividual;
  if (archiveOnly) outputs.forEach((o) => URL.revokeObjectURL(o.url));

  return {
    files: archiveOnly && archive ? [archive] : outputs,
    archive,
    archiveOnly,
    totals: options.withTotals ? { before, after } : undefined,
    summary: options.summary?.(outputs.length),
    notes,
  };
}
