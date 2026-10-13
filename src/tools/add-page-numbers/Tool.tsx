import { useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { CheckboxField, NumberField, OptionsStack, Segmented } from '@/components/tools/options';
import { createOutput } from '@/components/tools/output';
import { PdfProblemNotice } from '@/components/tools/PdfProblemNotice';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { usePdfInspection } from '@/components/tools/usePdfInspection';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { plural } from '@/i18n/format';
import { bytesToBlob } from '@/lib/files/read';
import { outputFileName } from '@/lib/files/sanitize';
import type { Anchor } from '@/lib/pdf/geometry';
import type { AddPageNumbersUi } from './i18n/en';
import { planLabels } from './labels';
import type { NumberSize } from './logic';
import { runPageNumbers } from './run';

type Vertical = 'bottom' | 'top';
type Horizontal = 'left' | 'center' | 'right';
type Format = 'n' | 'page' | 'of' | 'pageOf';

export default function AddPageNumbersTool(props: ToolIslandProps<AddPageNumbersUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const inspect = usePdfInspection(selection);

  const [vertical, setVertical] = useState<Vertical>('bottom');
  const [horizontal, setHorizontal] = useState<Horizontal>('center');
  const [format, setFormat] = useState<Format>('n');
  const [start, setStart] = useState<number | ''>(1);
  const [skipFirst, setSkipFirst] = useState(false);
  const [size, setSize] = useState<NumberSize>('medium');

  const current = selection.files[0];
  const pages = current?.info.pages ?? null;
  const problem = current?.info.problem;
  const inspecting = Boolean(current?.info.inspecting);

  const templates: Record<Format, string> = { n: '{n}', page: ui.templatePage, of: '{n} / {total}', pageOf: ui.templatePageOf };
  const startValue = typeof start === 'number' && Number.isInteger(start) && start >= 0 && start <= 99_999 ? start : null;
  const numbered = pages ? pages - (skipFirst ? 1 : 0) : 0;
  const example = (f: Format) => planLabels(Math.max(numbered, 1), templates[f], startValue ?? 1, false)[0]!;

  const canRun = Boolean(current) && !problem && !inspecting && numbered > 0 && startValue !== null;
  const hint = inspecting ? ui.inspecting : pages && numbered === 0 ? ui.nothingToNumber : numbered > 0 ? plural(ui.preview, numbered, locale) : undefined;

  const onRun = () => {
    if (!current || startValue === null) return;
    const { file, name, size: bytes } = current;
    void runner.run(
      async ({ signal, progress }) => {
        progress(null, common.status.preparing);
        const result = await runPageNumbers(
          file,
          { position: `${vertical}-${horizontal}` as Anchor, template: templates[format], start: startValue, skipFirst, size },
          { signal, onProgress: ({ value }) => progress(value) },
        );
        return {
          files: [
            createOutput(bytesToBlob(result.bytes, 'application/pdf'), outputFileName(name, ui.outputSuffix, '.pdf', 'document'), {
              detail: plural(common.fileList.pages, result.totalPages, locale),
            }),
          ],
          summary: plural(ui.summary, result.numberedPages, locale),
        };
      },
      { filesCount: 1, totalBytes: bytes, mode: `${vertical}-${horizontal}-${format}` },
    );
  };

  const options = (
    <OptionsStack>
      <Segmented<Vertical>
        legend={ui.position}
        value={vertical}
        onChange={setVertical}
        options={[
          { value: 'bottom', label: ui.bottom },
          { value: 'top', label: ui.top },
        ]}
      />
      <Segmented<Horizontal>
        legend={ui.alignment}
        value={horizontal}
        onChange={setHorizontal}
        options={[
          { value: 'left', label: ui.left },
          { value: 'center', label: ui.center },
          { value: 'right', label: ui.right },
        ]}
      />
      <Segmented<Format>
        legend={ui.format}
        value={format}
        onChange={setFormat}
        wrap
        options={(['n', 'page', 'of', 'pageOf'] as Format[]).map((value) => ({ value, label: example(value) }))}
      />
      <Segmented<NumberSize>
        legend={ui.size}
        value={size}
        onChange={setSize}
        options={[
          { value: 'small', label: ui.sizeSmall },
          { value: 'medium', label: ui.sizeMedium },
          { value: 'large', label: ui.sizeLarge },
        ]}
      />
      <NumberField label={ui.startLabel} value={start} onChange={setStart} min={0} max={99_999} invalid={startValue === null} />
      <CheckboxField label={ui.skipFirst} hint={ui.skipFirstHint} checked={skipFirst} onChange={setSkipFirst} />
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
