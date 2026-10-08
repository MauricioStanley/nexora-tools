import { fmt } from '@/i18n/format';
import type { RunProgress } from './useToolRunner';
import type { CommonToolStrings } from './types';
import styles from './Feedback.module.css';

interface ProgressIndicatorProps {
  progress: RunProgress;
  strings: CommonToolStrings;
  onCancel?: () => void;
}

/** Determinate or indeterminate progress with an optional Cancel action. */
export function ProgressIndicator({ progress, strings, onCancel }: ProgressIndicatorProps) {
  const determinate = typeof progress.value === 'number';
  const percent = determinate ? Math.round(Math.min(1, Math.max(0, progress.value!)) * 100) : null;
  const label = progress.message ?? strings.status.processing;

  return (
    <div className={styles.progress}>
      <div className={styles.progressRow}>
        <span className={styles.progressLabel}>
          <span className={styles.spinner} aria-hidden="true" />
          <span>{label}</span>
        </span>
        {percent !== null && <span className={styles.percent}>{percent}%</span>}
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent ?? undefined}
        aria-valuetext={percent !== null ? fmt(strings.status.percent, { percent }) : label}
      >
        <span
          className={styles.fill}
          data-indeterminate={!determinate}
          style={determinate ? { transform: `scaleX(${(percent ?? 0) / 100})` } : undefined}
        />
      </div>
      {onCancel && (
        <button type="button" className="btn btn--secondary btn--block" onClick={onCancel}>
          {strings.actions.cancel}
        </button>
      )}
    </div>
  );
}
