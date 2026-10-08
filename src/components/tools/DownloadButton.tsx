import { fmt } from '@/i18n/format';
import { track } from '@/lib/analytics';
import { Icon } from './Icon';
import type { OutputFile } from './output';

interface DownloadButtonProps {
  file: OutputFile;
  toolId: string;
  label: string;
  variant?: 'primary' | 'compact';
  className?: string;
  /** Accessible name for compact (icon-only) buttons, e.g. "Download {name}". */
  namedLabel?: string;
}

/** A real link with `download` — works with middle-click, keyboard and assistive tech. */
export function DownloadButton({ file, toolId, label, variant = 'primary', className, namedLabel }: DownloadButtonProps) {
  const format = file.name.split('.').pop()?.toLowerCase();
  const onClick = () => track('download_clicked', { tool: toolId, output_format: format });

  if (variant === 'compact') {
    return (
      <a
        className="btn btn--secondary btn--icon btn--sm"
        href={file.url}
        download={file.name}
        onClick={onClick}
        aria-label={namedLabel ? fmt(namedLabel, { name: file.name }) : label}
      >
        <Icon name="download" />
      </a>
    );
  }

  return (
    <a className={`btn btn--primary btn--lg ${className ?? ''}`} href={file.url} download={file.name} onClick={onClick}>
      <Icon name="download" />
      {label}
    </a>
  );
}
