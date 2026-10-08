/**
 * Main-thread helper to run a one-shot task in a module Web Worker.
 *
 * - The payload is transferred only after the worker reports `ready`, so if the worker
 *   can't start (old browser, blocked by policy) the payload is still intact and
 *   `fallback` can run the same logic on the main thread.
 * - Progress is streamed back through `onProgress`.
 * - Aborting the signal terminates the worker immediately (true cancellation).
 */
import { ToolFailure, toFailure } from '@/lib/errors';
import type { ProgressUpdate, WorkerRequest, WorkerResponse } from './protocol';

export interface RunWorkerOptions<R> {
  signal?: AbortSignal;
  onProgress?: (update: ProgressUpdate) => void;
  transfer?: Transferable[];
  /** Main-thread implementation used when the worker fails to start. */
  fallback?: () => Promise<R>;
}

/** Time allowed for a worker module to load before we fall back to the main thread. */
const STARTUP_TIMEOUT_MS = 15_000;

export function runWorkerTask<P, R>(
  createWorker: () => Worker,
  payload: P,
  options: RunWorkerOptions<R> = {},
): Promise<R> {
  const { signal, onProgress, transfer = [], fallback } = options;

  return new Promise<R>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new ToolFailure('cancelled'));
      return;
    }

    const runFallback = (cause: unknown) => {
      if (fallback) fallback().then(resolve, reject);
      else reject(new ToolFailure('worker_failed', {}, cause));
    };

    let worker: Worker;
    try {
      worker = createWorker();
    } catch (error) {
      runFallback(error);
      return;
    }

    let started = false;
    let settled = false;

    const cleanup = () => {
      settled = true;
      window.clearTimeout(startupTimer);
      signal?.removeEventListener('abort', onAbort);
      worker.terminate();
    };

    const startupTimer = window.setTimeout(() => {
      if (started || settled) return;
      cleanup();
      runFallback(new Error('worker startup timeout'));
    }, STARTUP_TIMEOUT_MS);

    const onAbort = () => {
      if (settled) return;
      cleanup();
      reject(new ToolFailure('cancelled'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });

    worker.addEventListener('message', (event: MessageEvent<WorkerResponse<R>>) => {
      if (settled) return;
      const message = event.data;
      switch (message.type) {
        case 'ready': {
          if (started) return;
          started = true;
          window.clearTimeout(startupTimer);
          const request: WorkerRequest<P> = { type: 'run', payload };
          worker.postMessage(request, transfer);
          break;
        }
        case 'progress':
          onProgress?.({ value: message.value, label: message.label });
          break;
        case 'result':
          cleanup();
          resolve(message.payload);
          break;
        case 'error':
          cleanup();
          reject(toFailure({ name: 'ToolFailure', ...message.error }));
          break;
      }
    });

    // `error` fires for script load failures and uncaught exceptions inside the worker.
    worker.addEventListener('error', (event) => {
      if (settled) return;
      event.preventDefault();
      cleanup();
      if (!started) runFallback(event.message);
      else reject(new ToolFailure('unknown', {}, event.message));
    });

    worker.addEventListener('messageerror', () => {
      if (settled) return;
      cleanup();
      reject(new ToolFailure('unknown'));
    });
  });
}
