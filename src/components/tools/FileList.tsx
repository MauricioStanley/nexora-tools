import type { ReactNode } from 'react';
import { fmt, formatBytes, plural } from '@/i18n/format';
import { FilePreview } from './FilePreview';
import { Icon } from './Icon';
import type { SelectedFile } from './useFileSelection';
import type { CommonToolStrings } from './types';
import styles from './FileList.module.css';

interface FileListProps {
  files: SelectedFile[];
  strings: CommonToolStrings['fileList'];
  locale: string;
  onRemove: (id: string) => void;
  onMove?: (id: string, delta: -1 | 1) => void;
  onClear?: () => void;
  disabled?: boolean;
  /** Show order numbers and reorder controls. */
  reorderable?: boolean;
  /** Extra detail per file (e.g. dimensions). */
  renderDetail?: (file: SelectedFile) => ReactNode;
  footer?: ReactNode;
}

export function FileList({
  files,
  strings,
  locale,
  onRemove,
  onMove,
  onClear,
  disabled = false,
  reorderable = false,
  renderDetail,
  footer,
}: FileListProps) {
  const total = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h2 className={styles.heading}>
          {plural(strings.count, files.length, locale)}
          <span className={styles.total}>{fmt(strings.total, { size: formatBytes(total, locale) })}</span>
        </h2>
        {onClear && files.length > 1 && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClear} disabled={disabled}>
            {strings.removeAll}
          </button>
        )}
      </div>

      <ol className={styles.list}>
        {files.map((item, index) => {
          const problem = item.info.problem;
          return (
            <li key={item.id} className={styles.item} data-problem={Boolean(problem)} data-ordered={reorderable}>
              {reorderable && (
                <span className={styles.index} aria-hidden="true">
                  {index + 1}
                </span>
              )}
              <span className={styles.thumb} data-kind={item.type === 'pdf' ? 'pdf' : 'image'}>
                <FilePreview file={item.file} type={item.type} />
              </span>
              <div className={styles.info}>
                <span className={styles.name} title={item.name}>
                  {item.name}
                </span>
                <span className={styles.meta}>
                  <span>{formatBytes(item.size, locale)}</span>
                  {item.info.inspecting && <span>{strings.inspecting}</span>}
                  {typeof item.info.pages === 'number' && <span>{plural(strings.pages, item.info.pages, locale)}</span>}
                  {item.info.width && item.info.height && (
                    <span>{fmt(strings.dimensions, { width: item.info.width, height: item.info.height })}</span>
                  )}
                  {renderDetail?.(item)}
                  {problem && (
                    <span className={styles.problem}>
                      <Icon name={problem === 'encrypted_pdf' ? 'lock' : 'alert-circle'} />
                      {problem === 'encrypted_pdf' ? strings.protected : strings.damaged}
                    </span>
                  )}
                </span>
              </div>
              <div className={styles.actions}>
                {reorderable && onMove && files.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="btn btn--ghost btn--icon btn--sm"
                      onClick={() => onMove(item.id, -1)}
                      disabled={disabled || index === 0}
                      aria-label={fmt(strings.moveUp, { name: item.name })}
                    >
                      <Icon name="arrow-up" />
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--icon btn--sm"
                      onClick={() => onMove(item.id, 1)}
                      disabled={disabled || index === files.length - 1}
                      aria-label={fmt(strings.moveDown, { name: item.name })}
                    >
                      <Icon name="arrow-down" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn--ghost btn--icon btn--sm btn--danger"
                  onClick={() => onRemove(item.id)}
                  disabled={disabled}
                  aria-label={fmt(strings.remove, { name: item.name })}
                >
                  <Icon name="trash" />
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      {reorderable && files.length > 1 && <p className={styles.hint}>{strings.orderHint}</p>}
      {footer}
    </div>
  );
}
