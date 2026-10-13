import { useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { OptionsStack, TextField } from '@/components/tools/options';
import { createOutput } from '@/components/tools/output';
import { PdfProblemNotice } from '@/components/tools/PdfProblemNotice';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { usePageRanges } from '@/components/tools/usePageRanges';
import { usePdfInspection } from '@/components/tools/usePdfInspection';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { plural } from '@/i18n/format';
import { ToolFailure } from '@/lib/errors';
import { bytesToBlob } from '@/lib/files/read';
import { outputFileName } from '@/lib/files/sanitize';
import { expandRanges } from '@/lib/pdf/ranges';
import type { RemovePdfPagesUi } from './i18n/en';
import { runRemovePages } from './run';

export default function RemovePdfPagesTool(props: ToolIslandProps<RemovePdfPagesUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const inspect = usePdfInspection(selection);
  const [pagesText, setPagesText] = useState('');

  const current = selection.files[0];
  const pages = current?.info.pages ?? null;
  const problem = current?.info.problem;
  const inspecting = Boolean(current?.info.inspecting);
  const { ranges, error } = usePageRanges(pagesText, pages, common.pageRanges);

  const removing = ranges ? new Set(expandRanges(ranges)).size : 0;
  const removesAll = pages !== null && removing >= pages;
  const remaining = pages !== null ? pages - removing : 0;
  const canRun = Boolean(current) && !problem && !inspecting && removing > 0 && !removesAll;

  const hint = inspecting
    ? ui.inspecting
    : removing > 0 && !removesAll
      ? plural(ui.preview, removing, locale, { remaining })
      : pages
        ? plural(ui.pageCount, pages, locale)
        : undefined;

  const onRun = () => {
    if (!current || !ranges || removesAll) {
      runner.fail(new ToolFailure('invalid_range'));
      return;
    }
    const { file, name, size } = current;
    void runner.run(
      async ({ signal, progress }) => {
        progress(null, common.status.preparing);
        const result = await runRemovePages(file, { ranges }, { signal, onProgress: ({ value }) => progress(value) });
        return {
          files: [
            createOutput(bytesToBlob(result.bytes, 'application/pdf'), outputFileName(name, ui.outputSuffix, '.pdf', 'document'), {
              inputSize: size,
              detail: plural(common.fileList.pages, result.remainingPages, locale),
            }),
          ],
          summary: plural(ui.summary, result.removedPages, locale, { remaining: result.remainingPages }),
        };
      },
      { filesCount: 1, totalBytes: size },
    );
  };

  const options = (
    <OptionsStack>
      <TextField
        label={ui.pagesLabel}
        value={pagesText}
        onChange={setPagesText}
        placeholder={common.pageRanges.placeholder}
        hint={common.pageRanges.hint}
        error={removesAll ? ui.allPagesError : error}
      />
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
      notices={<PdfProblemNotice problem={problem} strings={common} />}
    />
  );
}
