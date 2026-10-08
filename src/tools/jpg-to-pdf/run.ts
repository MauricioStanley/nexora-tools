import { runWorkerTask } from '@/lib/workers/client';
import type { ProgressUpdate } from '@/lib/workers/protocol';
import type { ImagesToPdfPayload, ImagesToPdfResult } from './logic';

export function runImagesToPdf(
  payload: ImagesToPdfPayload,
  options: { signal?: AbortSignal; onProgress?: (update: ProgressUpdate) => void } = {},
): Promise<ImagesToPdfResult> {
  return runWorkerTask<ImagesToPdfPayload, ImagesToPdfResult>(
    () => new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
    payload,
    {
      ...options,
      transfer: payload.images.map((image) => image.bytes),
      // Only used if the worker never started, so the payload was never transferred.
      fallback: async () => {
        const { imagesToPdf } = await import('./logic');
        return imagesToPdf(payload, (value) => options.onProgress?.({ value }));
      },
    },
  );
}
