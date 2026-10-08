import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { createOutput } from '@/components/tools/output';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { usePdfInspection } from '@/components/tools/usePdfInspection';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { fmt, plural } from '@/i18n/format';
import { bytesToBlob } from '@/lib/files/read';
import type { MergePdfUi } from './i18n/en';
import { runMerge } from './run';

export default function MergePdfTool(props: ToolIslandProps<MergePdfUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const inspect = usePdfInspection(selection);

  const files = selection.files;
  const hasProblem = files.some((f) => f.info.problem);
  const inspecting = files.some((f) => f.info.inspecting);
  const enough = files.length >= input.minFiles;
  const canRun = enough && !hasProblem && !inspecting;
  const hint = !enough
    ? fmt(ui.minFiles, { count: input.minFiles })
    : hasProblem
      ? ui.fixProblems
      : inspecting
        ? ui.inspecting
        : undefined;

  const onRun = () => {
    const snapshot = [...files];
    const total = snapshot.length;
    void runner.run(
      async ({ signal, progress }) => {
        progress(null, common.status.preparing);
        const result = await runMerge(
          snapshot.map((f) => f.file),
          {
            signal,
            onProgress: ({ value }) => {
              if (value === null) return;
              const message =
                value < 0.9 ? fmt(ui.merging, { current: Math.min(total, Math.floor((value / 0.9) * total) + 1), total }) : ui.saving;
              progress(value, message);
            },
          },
        );
        const blob = bytesToBlob(result.bytes, 'application/pdf');
        return {
          files: [createOutput(blob, `${ui.outputName}.pdf`)],
          summary: plural(ui.summary, total, locale, { pages: result.pageCount }),
        };
      },
      { filesCount: total, totalBytes: selection.totalBytes },
    );
  };

  return (
    <FileToolLayout
      island={props}
      selection={selection}
      runner={runner}
      onFilesAdded={inspect}
      actionLabel={ui.action}
      onRun={onRun}
      canRun={canRun}
      actionHint={hint}
      reorderable
      dropzoneTitle={ui.dropTitle}
      downloadLabel={ui.downloadLabel}
      showComparison={false}
    />
  );
}
