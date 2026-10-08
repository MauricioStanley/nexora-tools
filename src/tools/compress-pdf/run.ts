import { runWorkerTask } from '@/lib/workers/client';
import type { ProgressUpdate } from '@/lib/workers/protocol';
import type { OptimizeOptions, OptimizePayload, OptimizeResult } from './logic';
import { browserRecoder, canUseOffscreenCanvas } from './recoder';

type Progress = (update: ProgressUpdate) => void;

async function runOnMainThread(payload: OptimizePayload, onProgress?: Progress): Promise<OptimizeResult> {
  const { optimizePdf } = await import('./logic');
  return optimizePdf(payload, browserRecoder, (value, stage, current, total) =>
    onProgress?.({ value, label: stage === 'images' ? `images:${current}:${total}` : 'structure' }),
  );
}

/**
 * Structural + image optimization. Uses a worker when the browser supports OffscreenCanvas
 * in workers (needed to re-encode images there); otherwise runs on the main thread.
 */
export async function runOptimize(
  file: Blob,
  options: OptimizeOptions,
  context: { signal?: AbortSignal; onProgress?: Progress } = {},
): Promise<OptimizeResult> {
  const payload: OptimizePayload = { ...options, file: await file.arrayBuffer() };
  if (!canUseOffscreenCanvas()) return runOnMainThread(payload, context.onProgress);
  return runWorkerTask<OptimizePayload, OptimizeResult>(
    () => new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
    payload,
    {
      ...context,
      transfer: [payload.file],
      // Only used if the worker never started, so the payload was never transferred.
      fallback: () => runOnMainThread(payload, context.onProgress),
    },
  );
}
