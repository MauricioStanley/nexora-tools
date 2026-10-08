import type { ReactNode } from 'react';
import type { FailureCode } from '@/lib/errors';
import { plural } from '@/i18n/format';
import { FileDropzone } from './FileDropzone';
import { FileList } from './FileList';
import { Icon } from './Icon';
import { Notice, RejectedNotice } from './Notice';
import { ProgressIndicator } from './ProgressIndicator';
import { ResultPanel } from './ResultPanel';
import { ToolError } from './ToolError';
import { ActionBar, ToolPanel, ToolShell, ToolWorkspace } from './ToolShell';
import type { FileSelection, SelectedFile } from './useFileSelection';
import type { ToolRunner } from './useToolRunner';
import type { ToolIslandProps } from './types';

interface FileToolLayoutProps {
  island: ToolIslandProps<unknown>;
  selection: FileSelection;
  runner: ToolRunner;
  onFilesAdded?: (files: SelectedFile[]) => void;
  /** Options panel content (omit for tools without options). */
  options?: ReactNode;
  optionsTitle?: string;
  actionLabel: string;
  onRun: () => void;
  canRun: boolean;
  /** Short explanation shown under the action button (e.g. why it's disabled). */
  actionHint?: string;
  /** Extra notices above the file list (warnings, limitations). */
  notices?: ReactNode;
  reorderable?: boolean;
  renderDetail?: (file: SelectedFile) => ReactNode;
  downloadLabel?: string;
  showComparison?: boolean;
  dropzoneTitle?: string;
  errorFileName?: string;
  /**
   * Tool to suggest when a specific failure happens (e.g. too_many_pages → split-pdf).
   * Only genuinely helpful alternatives — never a generic "try another tool".
   */
  errorAlternatives?: Partial<Record<FailureCode, string>>;
}

/**
 * Standard file-tool flow shared by every file-based tool:
 * empty → files selected (+ options) → processing → success | error | cancelled.
 * Tools provide options and the processing task; this component provides the UX.
 */
export function FileToolLayout({
  island,
  selection,
  runner,
  onFilesAdded,
  options,
  optionsTitle,
  actionLabel,
  onRun,
  canRun,
  actionHint,
  notices,
  reorderable = false,
  renderDetail,
  downloadLabel,
  showComparison = true,
  dropzoneTitle,
  errorFileName,
  errorAlternatives,
}: FileToolLayoutProps) {
  const { common, locale, input, related, toolId } = island;
  const { status, progress, result, error } = runner;
  const processing = status === 'processing';

  const addFiles = async (files: File[]) => {
    if (processing) return;
    if (status === 'cancelled') runner.reset();
    const added = await selection.add(files);
    if (added.length > 0) onFilesAdded?.(added);
  };

  const resetAll = () => {
    runner.reset();
    selection.clear();
  };

  const announcement =
    status === 'processing'
      ? (progress.message ?? common.status.processing)
      : status === 'success'
        ? common.status.success
        : status === 'cancelled'
          ? common.status.cancelled
          : status === 'error'
            ? common.status.error
            : selection.files.length > 0
              ? plural(common.status.ready, selection.files.length, locale)
              : '';

  let content: ReactNode;

  if (status === 'success' && result) {
    content = (
      <ResultPanel
        result={result}
        toolId={toolId}
        strings={common}
        locale={locale}
        related={related}
        onReset={resetAll}
        downloadLabel={downloadLabel}
        showComparison={showComparison}
      />
    );
  } else if (status === 'error' && error) {
    content = (
      <ToolError
        error={error}
        strings={common}
        fileName={errorFileName}
        onRetry={() => runner.reset()}
        onReset={resetAll}
        alternative={(() => {
          const id = error ? errorAlternatives?.[error.code] : undefined;
          return id ? related.find((r) => r.id === id) : undefined;
        })()}
      />
    );
  } else if (selection.files.length === 0) {
    content = (
      <div className="tool-empty">
        <FileDropzone
          strings={common.dropzone}
          locale={locale}
          multiple={input.multiple}
          acceptAttr={input.acceptAttr}
          formatLabels={input.formatLabels}
          maxFileSizeMB={input.effectiveMaxFileSizeMB}
          maxFiles={input.effectiveMaxFiles}
          allowPaste={input.allowPaste}
          onFiles={addFiles}
          disabled={selection.validating}
          title={dropzoneTitle}
        />
        {selection.rejections.length > 0 && (
          <div className="tool-empty__notice">
            <RejectedNotice
              rejections={selection.rejections}
              strings={common.rejected}
              input={input}
              locale={locale}
              onDismiss={selection.dismissRejections}
            />
          </div>
        )}
      </div>
    );
  } else {
    content = (
      <ToolWorkspace
        main={
          <>
            {status === 'cancelled' && (
              <Notice tone="info">
                <p>{common.status.cancelled}</p>
              </Notice>
            )}
            {selection.rejections.length > 0 && (
              <RejectedNotice
                rejections={selection.rejections}
                strings={common.rejected}
                input={input}
                locale={locale}
                onDismiss={selection.dismissRejections}
              />
            )}
            {notices}
            <FileList
              files={selection.files}
              strings={common.fileList}
              locale={locale}
              onRemove={selection.remove}
              onMove={selection.move}
              onClear={selection.clear}
              disabled={processing}
              reorderable={reorderable}
              renderDetail={renderDetail}
              footer={
                <FileDropzone
                  strings={common.dropzone}
                  locale={locale}
                  multiple={input.multiple}
                  acceptAttr={input.acceptAttr}
                  formatLabels={input.formatLabels}
                  maxFileSizeMB={input.effectiveMaxFileSizeMB}
                  maxFiles={input.effectiveMaxFiles}
                  allowPaste={input.allowPaste}
                  onFiles={addFiles}
                  disabled={processing || selection.validating || (input.multiple && selection.files.length >= input.effectiveMaxFiles)}
                  compact
                />
              }
            />
          </>
        }
        side={
          <>
            {options && (
              <ToolPanel title={optionsTitle ?? common.options.title} titleId={`${toolId}-options`}>
                <fieldset disabled={processing} className="tool-options-fieldset">
                  {options}
                </fieldset>
              </ToolPanel>
            )}
            <ActionBar hint={processing ? undefined : actionHint}>
              {processing ? (
                <ProgressIndicator progress={progress} strings={common} onCancel={runner.cancel} />
              ) : (
                <button type="button" className="btn btn--primary btn--lg btn--block" onClick={onRun} disabled={!canRun}>
                  {actionLabel}
                  <Icon name="arrow-right" />
                </button>
              )}
            </ActionBar>
          </>
        }
      />
    );
  }

  return (
    <ToolShell announcement={announcement} busy={processing}>
      {content}
    </ToolShell>
  );
}
