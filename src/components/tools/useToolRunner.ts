import { useCallback, useEffect, useRef, useState } from 'react';
import { durationBucket, sizeBucket, track } from '@/lib/analytics';
import { ToolFailure, toFailure } from '@/lib/errors';
import { releaseResult, type ToolResult } from './output';

export type RunStatus = 'idle' | 'processing' | 'success' | 'error' | 'cancelled';

export interface RunProgress {
  /** 0..1, or null for indeterminate. */
  value: number | null;
  /** Localized status line. */
  message?: string;
}

export interface RunContext {
  signal: AbortSignal;
  progress: (value: number | null, message?: string) => void;
}

export interface RunMeta {
  filesCount?: number;
  totalBytes?: number;
  mode?: string;
  outputFormat?: string;
}

/**
 * Tool state machine: idle → processing → success | error | cancelled.
 * Owns cancellation (AbortController) and the lifecycle of result object URLs.
 */
export function useToolRunner(toolId: string) {
  const [status, setStatus] = useState<RunStatus>('idle');
  const [progress, setProgress] = useState<RunProgress>({ value: null });
  const [result, setResult] = useState<ToolResult | null>(null);
  const [error, setError] = useState<ToolFailure | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const resultRef = useRef<ToolResult | null>(null);

  const release = useCallback(() => {
    releaseResult(resultRef.current);
    resultRef.current = null;
  }, []);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
      releaseResult(resultRef.current);
    },
    [],
  );

  const run = useCallback(
    async (task: (ctx: RunContext) => Promise<ToolResult>, meta: RunMeta = {}) => {
      controllerRef.current?.abort();
      release();
      setResult(null);
      setError(null);
      const controller = new AbortController();
      controllerRef.current = controller;
      setStatus('processing');
      setProgress({ value: null });

      const common = {
        tool: toolId,
        files_count: meta.filesCount,
        size_bucket: meta.totalBytes !== undefined ? sizeBucket(meta.totalBytes) : undefined,
        mode: meta.mode,
        output_format: meta.outputFormat,
      };
      track('processing_started', common);
      const started = performance.now();

      try {
        const output = await task({
          signal: controller.signal,
          progress: (value, message) => {
            if (!controller.signal.aborted) setProgress({ value, message });
          },
        });
        if (controller.signal.aborted) {
          releaseResult(output);
          return;
        }
        resultRef.current = output;
        setResult(output);
        setStatus('success');
        track('processing_success', { ...common, success: true, duration_bucket: durationBucket(performance.now() - started) });
      } catch (caught) {
        const failure = toFailure(caught);
        if (failure.code === 'cancelled' || controller.signal.aborted) {
          setStatus('cancelled');
          track('processing_cancelled', { tool: toolId });
        } else {
          if (import.meta.env.DEV) console.error('[tool]', toolId, caught);
          setError(failure);
          setStatus('error');
          track('processing_error', { tool: toolId, error_code: failure.code, success: false });
        }
      } finally {
        if (controllerRef.current === controller) controllerRef.current = null;
      }
    },
    [release, toolId],
  );

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  /** Back to idle; results are released. */
  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    release();
    setResult(null);
    setError(null);
    setProgress({ value: null });
    setStatus('idle');
  }, [release]);

  /** Report a validation failure without running a task (e.g. invalid page range). */
  const fail = useCallback((failure: ToolFailure) => {
    setError(failure);
    setStatus('error');
    track('processing_error', { tool: toolId, error_code: failure.code, success: false });
  }, [toolId]);

  return { status, progress, result, error, run, cancel, reset, fail };
}

export type ToolRunner = ReturnType<typeof useToolRunner>;
