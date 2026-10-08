import { FILE_TYPES, MB, type InputFileTypeId } from './types';
import { looksLikeHeicName, sniffFileType } from './sniff';
import { sanitizeFileName, splitExtension } from './sanitize';

export type RejectionReason = 'type' | 'size' | 'empty' | 'signature' | 'heic' | 'count' | 'total';

export interface Rejection {
  name: string;
  reason: RejectionReason;
  /** Label of the expected format for `signature` rejections. */
  format?: string;
}

export interface ValidationRules {
  accept: readonly InputFileTypeId[];
  maxFileSizeMB: number;
  maxFiles: number;
  maxTotalSizeMB?: number;
}

export interface AcceptedFile {
  file: File;
  type: InputFileTypeId;
  /** Sanitized display name. */
  name: string;
}

export interface ValidationResult {
  accepted: AcceptedFile[];
  rejected: Rejection[];
}

/** Quick check based on MIME type and extension (before reading any bytes). */
export function declaredType(file: Pick<File, 'name' | 'type'>, accept: readonly InputFileTypeId[]): InputFileTypeId | null {
  const mime = (file.type || '').toLowerCase();
  const { ext } = splitExtension(file.name);
  for (const id of accept) {
    const def = FILE_TYPES[id];
    if ((def.mimeTypes as readonly string[]).includes(mime)) return id;
    if (ext && (def.extensions as readonly string[]).includes(ext)) return id;
  }
  return null;
}

async function readHead(file: Blob, bytes = 1024): Promise<Uint8Array> {
  return new Uint8Array(await file.slice(0, bytes).arrayBuffer());
}

/**
 * Validate a single file against the rules. Content is verified by its signature; the
 * declared type is only a first filter (a renamed .exe won't pass as a PDF).
 */
export async function validateFile(file: File, rules: ValidationRules): Promise<AcceptedFile | Rejection> {
  const name = sanitizeFileName(file.name);
  if (file.size === 0) return { name, reason: 'empty' };

  const declared = declaredType(file, rules.accept);
  const head = await readHead(file);
  const sniffed = sniffFileType(head);

  if (sniffed === 'heic' || (!declared && looksLikeHeicName(file.name))) return { name, reason: 'heic' };

  const type = (rules.accept as readonly string[]).includes(sniffed) ? (sniffed as InputFileTypeId) : null;
  if (!type) {
    if (declared) return { name, reason: 'signature', format: FILE_TYPES[declared].label };
    return { name, reason: 'type' };
  }
  if (file.size > rules.maxFileSizeMB * MB) return { name, reason: 'size' };
  return { file, type, name };
}

function isRejection(value: AcceptedFile | Rejection): value is Rejection {
  return 'reason' in value;
}

/**
 * Validate a batch, respecting how many files / bytes are already selected.
 */
export async function validateFiles(
  files: readonly File[],
  rules: ValidationRules,
  existing: { count: number; totalBytes: number } = { count: 0, totalBytes: 0 },
): Promise<ValidationResult> {
  const accepted: AcceptedFile[] = [];
  const rejected: Rejection[] = [];
  let count = existing.count;
  let total = existing.totalBytes;
  const maxTotal = rules.maxTotalSizeMB ? rules.maxTotalSizeMB * MB : Infinity;
  let countExceeded = false;
  let totalExceeded = false;

  for (const file of files) {
    const outcome = await validateFile(file, rules);
    if (isRejection(outcome)) {
      rejected.push(outcome);
      continue;
    }
    if (count >= rules.maxFiles) {
      countExceeded = true;
      continue;
    }
    if (total + file.size > maxTotal) {
      totalExceeded = true;
      continue;
    }
    accepted.push(outcome);
    count += 1;
    total += file.size;
  }
  if (countExceeded) rejected.push({ name: '', reason: 'count' });
  if (totalExceeded) rejected.push({ name: '', reason: 'total' });
  return { accepted, rejected };
}
