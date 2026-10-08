import type { SerializedFailure } from '@/lib/errors';

/** Main thread → worker. */
export interface WorkerRequest<P = unknown> {
  type: 'run';
  payload: P;
}

/** Worker → main thread. */
export type WorkerResponse<R = unknown> =
  /** Sent once the worker module has loaded; only then is the payload transferred. */
  | { type: 'ready' }
  | { type: 'progress'; value: number | null; label?: string }
  | { type: 'result'; payload: R }
  | { type: 'error'; error: SerializedFailure };

export interface ProgressUpdate {
  /** 0..1, or null for indeterminate. */
  value: number | null;
  /** Optional machine-readable step key (localized by the UI). */
  label?: string;
}
