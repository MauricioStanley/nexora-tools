import type { ReactNode } from 'react';
import styles from './ToolShell.module.css';

interface ToolShellProps {
  children: ReactNode;
  /** Polite screen-reader announcement for status changes. */
  announcement?: string;
  busy?: boolean;
}

/** Card that hosts every tool UI and owns the live region for status announcements. */
export function ToolShell({ children, announcement, busy }: ToolShellProps) {
  return (
    <div className={styles.shell} aria-busy={busy || undefined}>
      <div className={styles.body}>{children}</div>
      <p className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}

interface WorkspaceProps {
  main: ReactNode;
  side?: ReactNode;
  layout?: 'split' | 'stack';
}

/** Two columns on desktop (files | options + action), a single column on mobile. */
export function ToolWorkspace({ main, side, layout = 'split' }: WorkspaceProps) {
  return (
    <div className={styles.workspace} data-layout={side ? layout : 'stack'}>
      <div className={styles.main}>{main}</div>
      {side && <div className={styles.side}>{side}</div>}
    </div>
  );
}

export function ToolPanel({ title, children, titleId }: { title?: string; children: ReactNode; titleId?: string }) {
  return (
    <section className={styles.panel} aria-labelledby={title ? titleId : undefined}>
      {title && (
        <h2 className={styles.panelTitle} id={titleId}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function ActionBar({ children, hint, sticky = true }: { children: ReactNode; hint?: string; sticky?: boolean }) {
  return (
    <div className={styles.actionBar} data-sticky={sticky}>
      {children}
      {hint && <p className={styles.actionHint}>{hint}</p>}
    </div>
  );
}
