import { runWorkerTask } from '@/lib/workers/client';
import type { ProgressUpdate } from '@/lib/workers/protocol';
import type { WatermarkPayload, WatermarkResult } from './logic';

export async function runWatermark(
  file: Blob,
  settings: Omit<WatermarkPayload, 'file'>,
  options: { signal?: AbortSignal; onProgress?: (update: ProgressUpdate) => void } = {},
): Promise<WatermarkResult> {
  const payload: WatermarkPayload = { ...settings, file: await file.arrayBuffer() };
  return runWorkerTask<WatermarkPayload, WatermarkResult>(
    () => new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
    payload,
    {
      ...options,
      transfer: [payload.file],
      fallback: async () => {
        const { watermarkPdf } = await import('./logic');
        return watermarkPdf(payload, (value) => options.onProgress?.({ value }));
      },
    },
  );
}
