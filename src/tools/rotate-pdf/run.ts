import { runWorkerTask } from '@/lib/workers/client';
import type { ProgressUpdate } from '@/lib/workers/protocol';
import type { RotatePayload, RotateResult } from './logic';

export async function runRotate(
  file: Blob,
  settings: Omit<RotatePayload, 'file'>,
  options: { signal?: AbortSignal; onProgress?: (update: ProgressUpdate) => void } = {},
): Promise<RotateResult> {
  const payload: RotatePayload = { ...settings, file: await file.arrayBuffer() };
  return runWorkerTask<RotatePayload, RotateResult>(
    () => new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
    payload,
    {
      ...options,
      transfer: [payload.file],
      fallback: async () => {
        const { rotatePdf } = await import('./logic');
        return rotatePdf(payload, (value) => options.onProgress?.({ value }));
      },
    },
  );
}
