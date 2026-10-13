import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { runImageBatch, type ImageJob } from '@/components/tools/imageBatch';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { useImageProbe } from '@/components/tools/useImageProbe';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { plural } from '@/i18n/format';
import { outputFileName } from '@/lib/files/sanitize';
import type { JpgToPngUi } from './i18n/en';

export default function JpgToPngTool(props: ToolIslandProps<JpgToPngUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const probe = useImageProbe(selection);
  const files = selection.files;

  const onRun = () => {
    const jobs: ImageJob[] = files.map((item) => ({
      item,
      options: { mime: 'image/png', quality: 1 },
      outputName: outputFileName(item.name, '', '.png', 'image'),
    }));
    void runner.run(
      (ctx) =>
        runImageBatch(jobs, ctx, {
          common,
          locale,
          archiveName: ui.zipName,
          summary: (count) => plural(ui.summary, count, locale),
        }),
      { filesCount: jobs.length, totalBytes: selection.totalBytes, outputFormat: 'png' },
    );
  };

  return (
    <FileToolLayout
      island={props}
      selection={selection}
      runner={runner}
      onFilesAdded={probe}
      actionLabel={ui.action}
      actionHint={ui.sizeNote}
      onRun={onRun}
      canRun={files.length > 0}
      dropzoneTitle={ui.dropTitle}
      downloadLabel={ui.downloadLabel}
      showComparison={false}
    />
  );
}
