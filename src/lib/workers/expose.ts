/**
 * Worker-side helper. A worker module calls `exposeTask(handler)` once.
 * Each worker instance runs exactly one task and is then terminated by the client,
 * which guarantees memory is released and makes cancellation trivial.
 */
import { serializeFailure } from '@/lib/errors';
import type { ProgressUpdate, WorkerRequest, WorkerResponse } from './protocol';

export interface TaskContext {
  progress: (value: number | null, label?: string) => void;
}

export interface TaskOutput<R> {
  result: R;
  /** Buffers to transfer (zero-copy) back to the main thread. */
  transfer?: Transferable[];
}

interface WorkerScope {
  postMessage(message: unknown, transfer?: Transferable[]): void;
  addEventListener(type: 'message', listener: (event: MessageEvent) => void): void;
}

export function exposeTask<P, R>(handler: (payload: P, ctx: TaskContext) => Promise<TaskOutput<R>>): void {
  const scope = self as unknown as WorkerScope;
  let lastProgressAt = 0;

  const post = (message: WorkerResponse<R>, transfer: Transferable[] = []) => scope.postMessage(message, transfer);

  scope.addEventListener('message', async (event: MessageEvent<WorkerRequest<P>>) => {
    if (event.data?.type !== 'run') return;
    const ctx: TaskContext = {
      progress(value, label) {
        // Throttle to ~20 updates/second; always send labeled steps and completion.
        const now = Date.now();
        if (value !== null && value < 1 && !label && now - lastProgressAt < 50) return;
        lastProgressAt = now;
        const update: ProgressUpdate = { value, label };
        post({ type: 'progress', ...update });
      },
    };
    try {
      const output = await handler(event.data.payload, ctx);
      post({ type: 'result', payload: output.result }, output.transfer ?? []);
    } catch (error) {
      post({ type: 'error', error: serializeFailure(error) });
    }
  });

  // Handshake: the client transfers the payload only after this arrives.
  post({ type: 'ready' });
}
