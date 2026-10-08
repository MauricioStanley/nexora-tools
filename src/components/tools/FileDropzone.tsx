import { useCallback, useEffect, useId, useRef, useState, type DragEvent } from 'react';
import { fmt, formatBytes } from '@/i18n/format';
import { MB } from '@/lib/files/types';
import { Icon } from './Icon';
import type { CommonToolStrings } from './types';
import styles from './FileDropzone.module.css';

interface FileDropzoneProps {
  strings: CommonToolStrings['dropzone'];
  locale: string;
  multiple: boolean;
  acceptAttr: string;
  formatLabels: string[];
  maxFileSizeMB: number;
  maxFiles: number;
  onFiles: (files: File[]) => void;
  /** "Add more files" row instead of the large zone. */
  compact?: boolean;
  disabled?: boolean;
  /** Accept images pasted from the clipboard. */
  allowPaste?: boolean;
  /** Override the large title (e.g. "Drop your images here"). */
  title?: string;
}

function hasFiles(event: DragEvent | globalThis.DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files');
}

/**
 * Drag-and-drop + file picker. The visible button is the accessible control; the zone is a
 * larger pointer target. Also prevents the browser from navigating away when a file is
 * dropped slightly outside the zone (which would lose the user's work).
 */
export function FileDropzone({
  strings,
  locale,
  multiple,
  acceptAttr,
  formatLabels,
  maxFileSizeMB,
  maxFiles,
  onFiles,
  compact = false,
  disabled = false,
  allowPaste = false,
  title,
}: FileDropzoneProps) {
  const inputId = useId();
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(false);
  const depth = useRef(0);

  const openPicker = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const deliver = useCallback(
    (list: FileList | null | undefined) => {
      if (disabled || !list || list.length === 0) return;
      onFiles(Array.from(list));
    },
    [disabled, onFiles],
  );

  // Guard against accidental drops outside the zone replacing the page.
  useEffect(() => {
    const prevent = (event: globalThis.DragEvent) => {
      if (hasFiles(event)) event.preventDefault();
    };
    window.addEventListener('dragover', prevent);
    window.addEventListener('drop', prevent);
    return () => {
      window.removeEventListener('dragover', prevent);
      window.removeEventListener('drop', prevent);
    };
  }, []);

  useEffect(() => {
    if (!allowPaste || disabled) return;
    const onPaste = (event: ClipboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA)$/.test(target.tagName))) return;
      const pasted = Array.from(event.clipboardData?.files ?? []);
      if (pasted.length > 0) {
        event.preventDefault();
        onFiles(pasted);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [allowPaste, disabled, onFiles]);

  const dragHandlers = {
    onDragEnter: (event: DragEvent) => {
      if (!hasFiles(event) || disabled) return;
      event.preventDefault();
      depth.current += 1;
      setActive(true);
    },
    onDragOver: (event: DragEvent) => {
      if (!hasFiles(event) || disabled) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    },
    onDragLeave: () => {
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setActive(false);
    },
    onDrop: (event: DragEvent) => {
      event.preventDefault();
      depth.current = 0;
      setActive(false);
      deliver(event.dataTransfer.files);
    },
  };

  const size = formatBytes(maxFileSizeMB * MB, locale);
  const limit = multiple ? fmt(strings.limitMultiple, { count: maxFiles, size }) : fmt(strings.limitSingle, { size });

  const input = (
    <input
      ref={inputRef}
      id={inputId}
      className={styles.input}
      type="file"
      accept={acceptAttr}
      multiple={multiple}
      disabled={disabled}
      onChange={(event) => {
        deliver(event.currentTarget.files);
        event.currentTarget.value = ''; // allow re-selecting the same file
      }}
      tabIndex={-1}
      aria-hidden="true"
    />
  );

  if (compact) {
    return (
      <>
        {input}
        <button
          type="button"
          className={styles.compact}
          data-active={active}
          onClick={openPicker}
          disabled={disabled}
          aria-describedby={hintId}
          {...dragHandlers}
        >
          <Icon name="plus" />
          {active ? strings.dragActive : multiple ? strings.addMore : strings.replace}
        </button>
        <span id={hintId} className="visually-hidden">
          {fmt(strings.formats, { formats: formatLabels.join(', ') })}. {limit}.
        </span>
      </>
    );
  }

  return (
    <div
      className={styles.zone}
      data-active={active}
      data-disabled={disabled}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('button')) return;
        openPicker();
      }}
      {...dragHandlers}
    >
      {input}
      <span className={styles.glyph} aria-hidden="true">
        <Icon name="upload" />
      </span>
      <p className={styles.title}>{active ? strings.dragActive : (title ?? (multiple ? strings.titleMultiple : strings.titleSingle))}</p>
      <p className={styles.or} aria-hidden="true">
        {strings.or}
      </p>
      <button type="button" className="btn btn--primary btn--lg" onClick={openPicker} disabled={disabled} aria-describedby={hintId}>
        <Icon name="file" />
        {multiple ? strings.chooseMultiple : strings.chooseSingle}
      </button>
      <p className={styles.hint} id={hintId}>
        <span>{fmt(strings.formats, { formats: formatLabels.join(', ') })}</span>
        <span>{limit}</span>
      </p>
      {allowPaste && <p className={styles.paste}>{strings.pasteHint}</p>}
    </div>
  );
}
