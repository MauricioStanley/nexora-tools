import { useDeferredValue, useId, useMemo, useState } from 'react';
import { Icon } from '@/components/tools/Icon';
import { ToolShell } from '@/components/tools/ToolShell';
import type { ToolIslandProps } from '@/components/tools/types';
import { fmt, formatNumber } from '@/i18n/format';
import { textStats, type TextStats } from './count';
import type { WordCounterUi } from './i18n/en';
import styles from './Tool.module.css';

type CountKey = 'words' | 'characters' | 'charactersNoSpaces' | 'sentences' | 'paragraphs';
const COUNTS: CountKey[] = ['words', 'characters', 'charactersNoSpaces', 'sentences', 'paragraphs'];

export default function WordCounterTool(props: ToolIslandProps<WordCounterUi>) {
  const { ui, locale } = props;
  const id = useId();
  const [text, setText] = useState('');
  // Keeps typing responsive while long texts are being counted.
  const deferred = useDeferredValue(text);
  const stats: TextStats = useMemo(() => textStats(deferred, locale), [deferred, locale]);

  const duration = (seconds: number) => {
    if (seconds < 60) return fmt(ui.seconds, { s: seconds });
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s ? fmt(ui.minutesSeconds, { m, s }) : fmt(ui.minutes, { m });
  };

  return (
    <ToolShell>
      <div className={styles.layout}>
        <div className={styles.editor}>
          <label htmlFor={id} className="field__label">
            {ui.inputLabel}
          </label>
          <textarea id={id} className={`input ${styles.textarea}`} value={text} placeholder={ui.placeholder} onChange={(e) => setText(e.currentTarget.value)} />
          <div className={styles.toolbar}>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setText('')} disabled={!text}>
              <Icon name="trash" />
              {ui.clear}
            </button>
          </div>
        </div>

        <dl className={styles.stats}>
          {COUNTS.map((key) => (
            <div key={key} className={styles.stat} data-primary={key === 'words' || undefined}>
              <dt>{ui.stats[key]}</dt>
              <dd className="tabular">{formatNumber(stats[key], locale)}</dd>
            </div>
          ))}
          <div className={styles.stat}>
            <dt>{ui.stats.reading}</dt>
            <dd className="tabular">{duration(stats.readingSeconds)}</dd>
          </div>
          <div className={styles.stat}>
            <dt>{ui.stats.speaking}</dt>
            <dd className="tabular">{duration(stats.speakingSeconds)}</dd>
          </div>
        </dl>
      </div>
      <p className={styles.note}>
        <Icon name="shield" />
        {ui.privacyNote}
      </p>
    </ToolShell>
  );
}
