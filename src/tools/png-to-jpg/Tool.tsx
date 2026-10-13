import { useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { runImageBatch, type ImageJob } from '@/components/tools/imageBatch';
import { ColorField, OptionsStack, RangeField } from '@/components/tools/options';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { useImageProbe } from '@/components/tools/useImageProbe';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { plural } from '@/i18n/format';
import { outputFileName } from '@/lib/files/sanitize';
import type { PngToJpgUi } from './i18n/en';

export default function PngToJpgTool(props: ToolIslandProps<PngToJpgUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const probe = useImageProbe(selection);

  const [quality, setQuality] = useState(90);
  const [background, setBackground] = useState('#ffffff');
  const files = selection.files;

  const onRun = () => {
    const jobs: ImageJob[] = files.map((item) => ({
      item,
      options: { mime: 'image/jpeg', quality: quality / 100, background },
      outputName: outputFileName(item.name, '', '.jpg', 'image'),
    }));
    void runner.run(
      (ctx) =>
        runImageBatch(jobs, ctx, {
          common,
          locale,
          archiveName: ui.zipName,
          withTotals: true,
          summary: (count) => plural(ui.summary, count, locale),
        }),
      { filesCount: jobs.length, totalBytes: selection.totalBytes, outputFormat: 'jpg' },
    );
  };

  const options = (
    <OptionsStack>
      <RangeField
        label={common.options.quality}
        value={quality}
        min={50}
        max={100}
        onChange={setQuality}
        format={(v) => `${v}%`}
        minLabel={common.options.qualityLow}
        maxLabel={common.options.qualityHigh}
      />
      <ColorField label={ui.background} value={background} onChange={setBackground} />
      <p className="field__hint">{ui.backgroundHint}</p>
    </OptionsStack>
  );

  return (
    <FileToolLayout
      island={props}
      selection={selection}
      runner={runner}
      onFilesAdded={probe}
      options={options}
      actionLabel={ui.action}
      onRun={onRun}
      canRun={files.length > 0}
      dropzoneTitle={ui.dropTitle}
      downloadLabel={ui.downloadLabel}
    />
  );
}
