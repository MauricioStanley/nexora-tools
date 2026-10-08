/**
 * Typed, user-presentable failures.
 *
 * Processing code throws `ToolFailure` with a code; the UI maps codes to localized,
 * human messages. Raw exceptions ("Unhandled DOMException") are never shown to users.
 */
export type FailureCode =
  | 'encrypted_pdf'
  | 'corrupt_pdf'
  | 'no_pages'
  | 'too_many_pages'
  | 'invalid_range'
  | 'unsupported_type'
  | 'file_too_large'
  | 'too_few_files'
  | 'image_decode_failed'
  | 'image_too_large'
  | 'encode_unsupported'
  | 'out_of_memory'
  | 'worker_failed'
  | 'input_required'
  | 'cancelled'
  | 'unknown';

export interface FailureDetails {
  /** Index of the offending input file, when relevant. */
  fileIndex?: number;
  /** Values interpolated into the localized message (e.g. `{count}`). */
  vars?: Record<string, string | number>;
}

export class ToolFailure extends Error {
  readonly code: FailureCode;
  readonly details: FailureDetails;

  constructor(code: FailureCode, details: FailureDetails = {}, cause?: unknown) {
    super(code, cause === undefined ? undefined : { cause });
    this.name = 'ToolFailure';
    this.code = code;
    this.details = details;
  }
}

/** Serializable form used across the worker boundary. */
export interface SerializedFailure {
  code: FailureCode;
  details: FailureDetails;
  debug?: string;
}

export function isToolFailure(error: unknown): error is ToolFailure {
  return error instanceof ToolFailure || (typeof error === 'object' && error !== null && (error as { name?: string }).name === 'ToolFailure');
}

/** Best-effort classification of unknown errors into user-facing codes. */
export function toFailure(error: unknown): ToolFailure {
  if (error instanceof ToolFailure) return error;
  if (typeof error === 'object' && error !== null && 'code' in error && (error as { name?: string }).name === 'ToolFailure') {
    const e = error as unknown as SerializedFailure;
    return new ToolFailure(e.code, e.details ?? {});
  }
  const name = (error as { name?: string } | null)?.name ?? '';
  const message = String((error as { message?: string } | null)?.message ?? error ?? '');

  if (name === 'AbortError') return new ToolFailure('cancelled', {}, error);
  if (name === 'EncryptedPDFError' || name === 'PasswordException' || /encrypt/i.test(message)) {
    return new ToolFailure('encrypted_pdf', {}, error);
  }
  if (name === 'InvalidPDFException' || /failed to parse|invalid pdf|no pdf header/i.test(message)) {
    return new ToolFailure('corrupt_pdf', {}, error);
  }
  if (
    error instanceof RangeError ||
    /out of memory|allocation failed|array buffer allocation|cannot allocate/i.test(message)
  ) {
    return new ToolFailure('out_of_memory', {}, error);
  }
  return new ToolFailure('unknown', {}, error);
}

export function serializeFailure(error: unknown): SerializedFailure {
  const failure = toFailure(error);
  const cause = failure.cause as { message?: string } | undefined;
  return { code: failure.code, details: failure.details, debug: cause?.message };
}

/** Throw a `cancelled` failure if the signal was aborted. Call between expensive steps. */
export function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new ToolFailure('cancelled');
}
