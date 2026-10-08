import { useEffect, useRef } from 'react';
import { fmt, formatBytes, formatPercent, plural } from '@/i18n/format';
import type { ToolLink } from '@/tools/types';
import { DownloadButton } from './DownloadButton';
import { Icon } from './Icon';
import { Notice } from './Notice';
import type { ToolResult } from './output';
import type { CommonToolStrings } from './types';
import styles from './Feedback.module.css';

interface ResultPanelProps {
  result: ToolResult;
  toolId: string;
  strings: CommonToolStrings;
  locale: string;
  related: ToolLink[];
  onReset: () => void;
  /** Label for the single-file download button (e.g. "Download PDF"). */
  downloadLabel?: string;
  /** Hide the before/after comparison (e.g. merge, where sizes aren't comparable). */
  showComparison?: boolean;
}

function Delta({ before, after, strings, locale }: { before: number; after: number; strings: CommonToolStrings['result']; locale: string }) {
  if (before <= 0) return null;
  const ratio = (after - before) / before;
  const direction = Math.abs(ratio) < 0.005 ? 'same' : ratio < 0 ? 'down' : 'up';
  const text =
    direction === 'same'
      ? strings.unchanged
      : fmt(direction === 'down' ? strings.smaller : strings.larger, { percent: formatPercent(Math.abs(ratio), locale) });
  return (
    <span className={styles.delta} data-direction={direction}>
      {text}
    </span>
  );
}

/** Success state: strong confirmation, prominent download, honest comparison, next steps. */
export function ResultPanel({
  result,
  toolId,
  strings,
  locale,
  related,
  onReset,
  downloadLabel,
  showComparison = true,
}: ResultPanelProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const single = result.files.length === 1 && !result.archiveOnly;
  const r = strings.result;

  useEffect(() => {
    // Move focus to the result so keyboard and screen-reader users land on the download.
    titleRef.current?.focus();
  }, []);

  return (
    <div className={styles.result}>
      <div className={styles.resultHead}>
        <span className={styles.successIcon} aria-hidden="true">
          <Icon name="check" />
        </span>
        <div>
          <h2 className={styles.resultTitle} ref={titleRef} tabIndex={-1}>
            {single ? r.title : r.titleMultiple}
          </h2>
          {result.summary && <p className={styles.summary}>{result.summary}</p>}
        </div>
      </div>

      {showComparison && result.totals && (
        <dl className={styles.compare}>
          <div>
            <dt>{r.before}</dt>
            <dd>{formatBytes(result.totals.before, locale)}</dd>
          </div>
          <span className={styles.compareArrow} aria-hidden="true">
            <Icon name="arrow-right" />
          </span>
          <div>
            <dt>{r.after}</dt>
            <dd>{formatBytes(result.totals.after, locale)}</dd>
          </div>
          <Delta before={result.totals.before} after={result.totals.after} strings={r} locale={locale} />
        </dl>
      )}

      <div className={styles.downloads}>
        {single ? (
          <DownloadButton
            file={result.files[0]!}
            toolId={toolId}
            label={downloadLabel ?? strings.actions.download}
            className={styles.primaryDownload}
          />
        ) : (
          <>
            {result.archive && (
              <DownloadButton file={result.archive} toolId={toolId} label={strings.actions.downloadAll} className={styles.primaryDownload} />
            )}
            {result.archiveOnly ? (
              <Notice tone="info">
                <p>{r.bulkNote}</p>
              </Notice>
            ) : (
              <ul className={styles.outputs} aria-label={plural(r.files, result.files.length, locale)}>
                {result.files.map((file) => {
                  const gain =
                    file.inputSize && file.inputSize > 0 ? (file.size - file.inputSize) / file.inputSize : null;
                  return (
                    <li key={file.id} className={styles.output}>
                      <span className={styles.outputInfo}>
                        <span className={styles.outputName} title={file.name}>
                          {file.name}
                        </span>
                        <span className={styles.outputMeta}>
                          <span>{formatBytes(file.size, locale)}</span>
                          {file.detail && <span>{file.detail}</span>}
                          {file.keptOriginal ? (
                            <span>{r.keptOriginal}</span>
                          ) : (
                            gain !== null &&
                            Math.abs(gain) >= 0.005 && (
                              <span className={gain < 0 ? styles.gain : styles.loss}>
                                {fmt(gain < 0 ? r.smaller : r.larger, { percent: formatPercent(Math.abs(gain), locale) })}
                              </span>
                            )
                          )}
                        </span>
                      </span>
                      <DownloadButton
                        file={file}
                        toolId={toolId}
                        label={strings.actions.download}
                        namedLabel={strings.actions.downloadNamed}
                        variant="compact"
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>

      {result.notes && result.notes.length > 0 && (
        <ul className={styles.notes}>
          {result.notes.map((note, i) => (
            <li key={i}>
              <Notice tone="info">
                <p>{note}</p>
              </Notice>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.resultActions}>
        <button type="button" className="btn btn--secondary" onClick={onReset}>
          <Icon name="refresh" />
          {strings.actions.newTask}
        </button>
      </div>

      {related.length > 0 && (
        <nav className={styles.next} aria-label={r.continueWith}>
          <p className={styles.nextTitle}>{r.continueWith}</p>
          <ul className={styles.nextList}>
            {related.map((tool) => (
              <li key={tool.id}>
                <a className={styles.nextLink} href={tool.href} data-related-tool={tool.id} data-related-source="result">
                  <Icon name={tool.icon} />
                  {tool.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <p className={styles.localNote}>
        <Icon name="shield" />
        {r.localNote}
      </p>
    </div>
  );
}
