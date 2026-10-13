import { runWorkerTask } from '@/lib/workers/client';
import type { ProgressUpdate } from '@/lib/workers/protocol';
import type { RemovePagesPayload, RemovePagesResult } from './logic';

export async function runRemovePages(
  file: Blob,
  settings: Omit<RemovePagesPayload, 'file'>,
  options: { signal?: AbortSignal; onProgress?: (update: ProgressUpdate) => void } = {},
): Promise<RemovePagesResult> {
  const payload: RemovePagesPayload = { ...settings, file: await file.arrayBuffer() };
  return runWorkerTask<RemovePagesPayload, RemovePagesResult>(
    () => new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
    payload,
    {
      ...options,
      transfer: [payload.file],
      fallback: async () => {
        const { removePdfPages } = await import('./logic');
        return removePdfPages(payload, (value) => options.onProgress?.({ value }));
      },
    },
  );
}
