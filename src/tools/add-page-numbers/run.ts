import { runWorkerTask } from '@/lib/workers/client';
import type { ProgressUpdate } from '@/lib/workers/protocol';
import type { PageNumbersPayload, PageNumbersResult } from './logic';

export async function runPageNumbers(
  file: Blob,
  settings: Omit<PageNumbersPayload, 'file'>,
  options: { signal?: AbortSignal; onProgress?: (update: ProgressUpdate) => void } = {},
): Promise<PageNumbersResult> {
  const payload: PageNumbersPayload = { ...settings, file: await file.arrayBuffer() };
  return runWorkerTask<PageNumbersPayload, PageNumbersResult>(
    () => new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
    payload,
    {
      ...options,
      transfer: [payload.file],
      fallback: async () => {
        const { addPageNumbers } = await import('./logic');
        return addPageNumbers(payload, (value) => options.onProgress?.({ value }));
      },
    },
  );
}
