/**
 * Lightweight PDF inspection (page count, protection) that gives feedback right after files
 * are selected — before the user presses the action button. Runs in a worker; pdf-lib is
 * only loaded inside that worker (or lazily on the main thread as a fallback).
 */
import { runWorkerTask } from '@/lib/workers/client';
import type { InspectPayload, PdfInspection } from './inspect-core';

export type { PdfInspection } from './inspect-core';

export async function inspectPdfFiles(files: readonly Blob[], signal?: AbortSignal): Promise<PdfInspection[]> {
  const payload: InspectPayload = { files: await Promise.all(files.map((f) => f.arrayBuffer())) };
  return runWorkerTask<InspectPayload, PdfInspection[]>(
    () => new Worker(new URL('./inspect.worker.ts', import.meta.url), { type: 'module' }),
    payload,
    {
      signal,
      transfer: payload.files,
      fallback: async () => {
        const { inspectBuffers } = await import('./inspect-core');
        return inspectBuffers(payload.files);
      },
    },
  );
}
