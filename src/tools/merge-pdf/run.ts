/** Client entry: runs the merge in a worker, with a lazy main-thread fallback. */
import { runWorkerTask } from '@/lib/workers/client';
import type { ProgressUpdate } from '@/lib/workers/protocol';
import type { MergePayload, MergeResult } from './logic';

export async function runMerge(
  files: readonly Blob[],
  options: { signal?: AbortSignal; onProgress?: (update: ProgressUpdate) => void } = {},
): Promise<MergeResult> {
  const payload: MergePayload = { files: await Promise.all(files.map((f) => f.arrayBuffer())) };
  return runWorkerTask<MergePayload, MergeResult>(
    () => new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
    payload,
    {
      ...options,
      transfer: payload.files,
      // Only used if the worker never started, so the payload was never transferred.
      fallback: async () => {
        const { mergePdfs } = await import('./logic');
        return mergePdfs(payload, (value) => options.onProgress?.({ value }));
      },
    },
  );
}
