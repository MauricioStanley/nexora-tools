import { useMemo, useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { Notice } from '@/components/tools/Notice';
import { NumberField, OptionsStack, Segmented, TextField } from '@/components/tools/options';
import { createOutput, type OutputFile } from '@/components/tools/output';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { usePdfInspection } from '@/components/tools/usePdfInspection';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { fmt, plural } from '@/i18n/format';
import { ToolFailure } from '@/lib/errors';
import { bytesToBlob } from '@/lib/files/read';
import { baseName } from '@/lib/files/sanitize';
import { parsePageRanges, type RangeParseResult } from '@/lib/pdf/ranges';
import type { SplitPdfUi } from './i18n/en';
import type { SplitMode } from './logic';
import { runSplit } from './run';

/** Above this many parts, only the ZIP is offered (a list of 300 downloads is not useful). */
const MAX_INDIVIDUAL_FILES = 12;

function countOutputs(mode: SplitMode, pages: number, parsed: RangeParseResult | null, every: number): number {
  if (mode === 'all') return pages;
  if (mode === 'every') return Math.ceil(pages / Math.max(1, every));
  if (!parsed?.ok) return 0;
  return mode === 'extract' ? 1 : parsed.ranges.length;
}

export default function SplitPdfTool(props: ToolIslandProps<SplitPdfUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const inspect = usePdfInspection(selection);

  const [mode, setMode] = useState<SplitMode>('all');
  const [rangesText, setRangesText] = useState('');
  const [extractText, setExtractText] = useState('');
  const [every, setEvery] = useState<number | ''>(2);

  const current = selection.files[0];
  const pages = current?.info.pages ?? null;
  const text = mode === 'extract' ? extractText : rangesText;
  const needsRanges = mode === 'ranges' || mode === 'extract';

  const parsed = useMemo(() => (needsRanges && pages ? parsePageRanges(text, pages) : null), [needsRanges, pages, text]);
  const everyValue = typeof every === 'number' && every >= 1 ? Math.floor(every) : 0;
  const outputs = pages ? countOutputs(mode, pages, parsed, everyValue) : 0;

  const rangeError =
    parsed && !parsed.ok && text.trim() !== ''
      ? fmt(ui.rangeErrors[parsed.error], { token: parsed.token ?? '', pages: pages ?? 0 })
      : undefined;

  const problem = current?.info.problem;
  const inspecting = Boolean(current?.info.inspecting);
  const canRun =
    Boolean(current) &&
    !problem &&
    !inspecting &&
    pages !== null &&
    (needsRanges ? Boolean(parsed?.ok) : mode === 'every' ? everyValue >= 1 : true) &&
    outputs > 0;

  const hint = inspecting
    ? ui.inspecting
    : problem === 'encrypted_pdf'
      ? ui.protectedHint
      : pages
        ? plural(ui.preview, outputs, locale)
        : undefined;

  const onRun = () => {
    if (!current || !pages) return;
    if (needsRanges && !parsed?.ok) {
      runner.fail(new ToolFailure('invalid_range'));
      return;
    }
    const file = current.file;
    const name = baseName(current.name, 'document');
    const ranges = parsed?.ok ? parsed.ranges : undefined;
    void runner.run(
      async ({ signal, progress }) => {
        progress(null, common.status.preparing);
        const result = await runSplit(
          file,
          {
            baseName: name,
            mode,
            ranges,
            every: everyValue || 1,
            names: { page: ui.pageName, pages: ui.pagesName, extracted: ui.extractName },
            maxIndividualFiles: MAX_INDIVIDUAL_FILES,
          },
          {
            signal,
            onProgress: ({ value }) => {
              if (value === null) return;
              progress(
                value,
                value < 0.9
                  ? fmt(ui.splitting, { current: Math.min(outputs, Math.floor((value / 0.9) * outputs) + 1), total: outputs })
                  : ui.packaging,
              );
            },
          },
        );
        const files: OutputFile[] = result.files.map((f) =>
          createOutput(bytesToBlob(f.bytes, 'application/pdf'), f.name, {
            detail: plural(common.fileList.pages, f.pages, locale),
          }),
        );
        const archive = result.zip ? createOutput(bytesToBlob(result.zip, 'application/zip'), `${name}-split.zip`) : undefined;
        return {
          files: files.length > 0 ? files : archive ? [archive] : [],
          archive,
          archiveOnly: files.length === 0,
          summary: plural(ui.summary, result.totalOutputs, locale, { pages: result.sourcePages }),
        };
      },
      { filesCount: 1, totalBytes: current.size, mode },
    );
  };

  const options = (
    <OptionsStack>
      <Segmented<SplitMode>
        legend={ui.mode}
        value={mode}
        onChange={setMode}
        wrap
        options={[
          { value: 'all', label: ui.modeAll, sublabel: ui.modeAllHint },
          { value: 'ranges', label: ui.modeRanges, sublabel: ui.modeRangesHint },
          { value: 'extract', label: ui.modeExtract, sublabel: ui.modeExtractHint },
          { value: 'every', label: ui.modeEvery, sublabel: ui.modeEveryHint },
        ]}
      />
      {mode === 'ranges' && (
        <TextField
          label={ui.rangesLabel}
          value={rangesText}
          onChange={setRangesText}
          placeholder={ui.rangesPlaceholder}
          hint={ui.rangesHint}
          error={rangeError}
          inputMode="text"
        />
      )}
      {mode === 'extract' && (
        <TextField
          label={ui.extractLabel}
          value={extractText}
          onChange={setExtractText}
          placeholder={ui.extractPlaceholder}
          hint={ui.extractHint}
          error={rangeError}
        />
      )}
      {mode === 'every' && (
        <NumberField label={ui.everyLabel} value={every} onChange={setEvery} min={1} max={pages ?? undefined} invalid={everyValue < 1} />
      )}
    </OptionsStack>
  );

  return (
    <FileToolLayout
      island={props}
      selection={selection}
      runner={runner}
      onFilesAdded={inspect}
      options={options}
      actionLabel={ui.action}
      onRun={onRun}
      canRun={canRun}
      actionHint={hint}
      dropzoneTitle={ui.dropTitle}
      downloadLabel={ui.downloadLabel}
      showComparison={false}
      notices={
        problem === 'encrypted_pdf' ? (
          <Notice tone="error" title={common.errors.encrypted_pdf.title}>
            <p>{common.errors.encrypted_pdf.message}</p>
          </Notice>
        ) : problem ? (
          <Notice tone="error" title={common.errors.corrupt_pdf.title}>
            <p>{common.errors.corrupt_pdf.message}</p>
          </Notice>
        ) : undefined
      }
    />
  );
}
