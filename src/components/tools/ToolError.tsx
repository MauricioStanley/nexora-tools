import { useEffect, useRef } from 'react';
import { fmt } from '@/i18n/format';
import type { FailureCode, ToolFailure } from '@/lib/errors';
import type { ToolLink } from '@/tools/types';
import { Icon } from './Icon';
import type { CommonToolStrings } from './types';
import styles from './Feedback.module.css';

interface ToolErrorProps {
  error: ToolFailure;
  strings: CommonToolStrings;
  /** Name of the file that caused the failure, if known. */
  fileName?: string;
  /** Keep the current files and go back to options. */
  onRetry: () => void;
  /** Clear everything. */
  onReset: () => void;
  alternative?: ToolLink;
}

/** Problems with the input file itself — retrying the same file won't help. */
const FILE_PROBLEMS: FailureCode[] = ['encrypted_pdf', 'corrupt_pdf', 'no_pages', 'image_decode_failed', 'unsupported_type', 'file_too_large'];

/** Error state: human explanation + recovery options. Never shows raw exceptions. */
export function ToolError({ error, strings, fileName, onRetry, onReset, alternative }: ToolErrorProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copy = (strings.errors as Record<string, { title: string; message: string }>)[error.code] ?? strings.errors.unknown;
  const vars = error.details.vars ?? {};
  const fileProblem = FILE_PROBLEMS.includes(error.code);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <div className={styles.error} role="alert">
      <div className={styles.errorHead}>
        <span className={styles.errorIcon} aria-hidden="true">
          <Icon name="alert-circle" />
        </span>
        <div>
          <h2 className={styles.errorTitle} ref={titleRef} tabIndex={-1}>
            {fmt(copy.title, vars)}
          </h2>
          <p className={styles.errorMessage}>{fmt(copy.message, vars)}</p>
          {fileName && <p className={styles.errorFile}>{fileName}</p>}
        </div>
      </div>
      <div className={styles.errorActions}>
        {fileProblem ? (
          <button type="button" className="btn btn--primary" onClick={onReset}>
            <Icon name="file" />
            {strings.actions.tryAnother}
          </button>
        ) : (
          <>
            <button type="button" className="btn btn--primary" onClick={onRetry}>
              <Icon name="refresh" />
              {strings.actions.retry}
            </button>
            <button type="button" className="btn btn--secondary" onClick={onReset}>
              {strings.actions.reset}
            </button>
          </>
        )}
        {alternative && (
          <a className="btn btn--ghost" href={alternative.href} data-related-tool={alternative.id} data-related-source="error">
            {fmt(strings.alternative, { tool: alternative.name })}
            <Icon name="arrow-right" />
          </a>
        )}
      </div>
    </div>
  );
}
