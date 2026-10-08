import { runWorkerTask } from '@/lib/workers/client';
import type { ProgressUpdate } from '@/lib/workers/protocol';
import type { SplitPayload, SplitResult } from './logic';

export async function runSplit(
  file: Blob,
  settings: Omit<SplitPayload, 'file'>,
  options: { signal?: AbortSignal; onProgress?: (update: ProgressUpdate) => void } = {},
): Promise<SplitResult> {
  const payload: SplitPayload = { ...settings, file: await file.arrayBuffer() };
  return runWorkerTask<SplitPayload, SplitResult>(
    () => new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
    payload,
    {
      ...options,
      transfer: [payload.file],
      // Only used if the worker never started, so the payload was never transferred.
      fallback: async () => {
        const { splitPdf } = await import('./logic');
        return splitPdf(payload, (value) => options.onProgress?.({ value }));
      },
    },
  );
}
