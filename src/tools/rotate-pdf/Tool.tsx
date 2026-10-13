import { useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { OptionsStack, Segmented, TextField } from '@/components/tools/options';
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
import type { RotatePdfUi } from './i18n/en';
import type { RotateAngle } from './logic';
import { runRotate } from './run';

type Angle = '90' | '180' | '270';
type Scope = 'all' | 'pages';

export default function RotatePdfTool(props: ToolIslandProps<RotatePdfUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const inspect = usePdfInspection(selection);

  const [angle, setAngle] = useState<Angle>('90');
  const [scope, setScope] = useState<Scope>('all');
  const [pagesText, setPagesText] = useState('');

  const current = selection.files[0];
  const pages = current?.info.pages ?? null;
  const problem = current?.info.problem;
  const inspecting = Boolean(current?.info.inspecting);
  const { ranges, error: rangeError } = usePageRanges(pagesText, scope === 'pages' ? pages : null, common.pageRanges);

  const count = scope === 'all' ? (pages ?? 0) : ranges ? new Set(expandRanges(ranges)).size : 0;
  const canRun = Boolean(current) && !problem && !inspecting && pages !== null && count > 0;
  const hint = inspecting ? ui.inspecting : count > 0 ? plural(ui.preview, count, locale) : undefined;

  const onRun = () => {
    if (!current || !pages) return;
    if (scope === 'pages' && !ranges) {
      runner.fail(new ToolFailure('invalid_range'));
      return;
    }
    const { file, name, size } = current;
    void runner.run(
      async ({ signal, progress }) => {
        progress(null, common.status.preparing);
        const result = await runRotate(
          file,
          { angle: Number(angle) as RotateAngle, ranges: scope === 'pages' ? (ranges ?? undefined) : undefined },
          { signal, onProgress: ({ value }) => progress(value) },
        );
        return {
          files: [
            createOutput(bytesToBlob(result.bytes, 'application/pdf'), outputFileName(name, ui.outputSuffix, '.pdf', 'document'), {
              detail: plural(common.fileList.pages, result.totalPages, locale),
            }),
          ],
          summary: plural(ui.summary, result.rotatedPages, locale),
        };
      },
      { filesCount: 1, totalBytes: size, mode: `${scope}-${angle}` },
    );
  };

  const options = (
    <OptionsStack>
      <Segmented<Angle>
        legend={ui.angle}
        value={angle}
        onChange={setAngle}
        options={[
          { value: '90', label: ui.right, sublabel: '90°' },
          { value: '180', label: ui.upsideDown, sublabel: '180°' },
          { value: '270', label: ui.left, sublabel: '90°' },
        ]}
      />
      <Segmented<Scope>
        legend={ui.scope}
        value={scope}
        onChange={setScope}
        options={[
          { value: 'all', label: ui.scopeAll },
          { value: 'pages', label: ui.scopePages },
        ]}
      />
      {scope === 'pages' && (
        <TextField
          label={ui.pagesLabel}
          value={pagesText}
          onChange={setPagesText}
          placeholder={common.pageRanges.placeholder}
          hint={common.pageRanges.hint}
          error={rangeError}
        />
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
      notices={<PdfProblemNotice problem={problem} strings={common} />}
    />
  );
}
