import type { FailureCode } from '@/lib/errors';
import { Notice } from './Notice';
import type { CommonToolStrings } from './types';

/** Explains why a selected PDF can't be processed (found during inspection, before running). */
export function PdfProblemNotice({ problem, strings }: { problem?: FailureCode | null; strings: CommonToolStrings }) {
  if (!problem) return null;
  const key = problem === 'encrypted_pdf' || problem === 'no_pages' ? problem : 'corrupt_pdf';
  const { title, message } = strings.errors[key];
  return (
    <Notice tone="error" title={title}>
      <p>{message}</p>
    </Notice>
  );
}
