import { useEffect, useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { runImageBatch, type ImageJob } from '@/components/tools/imageBatch';
import { Notice } from '@/components/tools/Notice';
import { OptionsStack, RangeField } from '@/components/tools/options';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { useImageProbe } from '@/components/tools/useImageProbe';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { plural } from '@/i18n/format';
import { outputFileName } from '@/lib/files/sanitize';
import { supportsNativeEncoding } from '@/lib/image/encode';
import type { ToWebpUi } from './i18n/en';

export default function ToWebpTool(props: ToolIslandProps<ToWebpUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const probe = useImageProbe(selection);

  const [quality, setQuality] = useState(80);
  const [nativeWebp, setNativeWebp] = useState<boolean | null>(null);
  const files = selection.files;

  // Detect (once files are present) whether the WASM encoder will be needed, and say so.
  useEffect(() => {
    if (files.length > 0 && nativeWebp === null) {
      supportsNativeEncoding('image/webp').then(setNativeWebp, () => setNativeWebp(false));
    }
  }, [files.length, nativeWebp]);

  const onRun = () => {
    const jobs: ImageJob[] = files.map((item) => ({
      item,
      options: { mime: 'image/webp', quality: quality / 100 },
      outputName: outputFileName(item.name, '', '.webp', 'image'),
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
      { filesCount: jobs.length, totalBytes: selection.totalBytes, outputFormat: 'webp', mode: nativeWebp === false ? 'wasm' : 'native' },
    );
  };

  const options = (
    <OptionsStack>
      <RangeField
        label={common.options.quality}
        value={quality}
        min={10}
        max={100}
        onChange={setQuality}
        format={(v) => `${v}%`}
        minLabel={common.options.qualityLow}
        maxLabel={common.options.qualityHigh}
        hint={ui.qualityHint}
      />
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
      notices={
        nativeWebp === false ? (
          <Notice tone="info">
            <p>{ui.encoderNote}</p>
          </Notice>
        ) : undefined
      }
    />
  );
}
