import type { ReactNode } from 'react';
import { fmt, formatBytes } from '@/i18n/format';
import { MB } from '@/lib/files/types';
import type { Rejection } from '@/lib/files/validate';
import { Icon } from './Icon';
import type { CommonToolStrings, IslandInputSpec } from './types';
import styles from './Feedback.module.css';

interface NoticeProps {
  tone?: 'info' | 'warning' | 'error';
  title?: string;
  children?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export function Notice({ tone = 'info', title, children, onDismiss, dismissLabel }: NoticeProps) {
  return (
    <div className={styles.notice} data-tone={tone} role={tone === 'error' ? 'alert' : undefined}>
      <Icon name={tone === 'info' ? 'info' : 'alert-triangle'} />
      <div className={styles.noticeBody}>
        {title && <p className={styles.noticeTitle}>{title}</p>}
        {children}
      </div>
      {onDismiss ? (
        <button type="button" className="btn btn--ghost btn--icon btn--sm" onClick={onDismiss} aria-label={dismissLabel}>
          <Icon name="close" />
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

interface RejectedNoticeProps {
  rejections: Rejection[];
  strings: CommonToolStrings['rejected'];
  input: IslandInputSpec;
  locale: string;
  onDismiss: () => void;
}

/** Explains, per file, why something was not added. */
export function RejectedNotice({ rejections, strings, input, locale, onDismiss }: RejectedNoticeProps) {
  if (rejections.length === 0) return null;
  const size = formatBytes(input.effectiveMaxFileSizeMB * MB, locale);
  const totalSize = input.maxTotalSizeMB ? formatBytes(input.maxTotalSizeMB * MB, locale) : size;
  const messages = rejections.map((r) => {
    switch (r.reason) {
      case 'type':
        return fmt(strings.type, { name: r.name });
      case 'size':
        return fmt(strings.size, { name: r.name, size });
      case 'empty':
        return fmt(strings.empty, { name: r.name });
      case 'signature':
        return fmt(strings.signature, { name: r.name, format: r.format ?? '' });
      case 'heic':
        return fmt(strings.heic, { name: r.name });
      case 'count':
        return fmt(strings.count, { count: input.effectiveMaxFiles });
      case 'total':
        return fmt(strings.total, { size: totalSize });
    }
  });

  return (
    <Notice tone="warning" title={strings.title} onDismiss={onDismiss} dismissLabel={strings.dismiss}>
      <ul>
        {messages.slice(0, 8).map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </Notice>
  );
}
