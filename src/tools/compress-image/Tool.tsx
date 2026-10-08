import { useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { runImageBatch, type ImageJob } from '@/components/tools/imageBatch';
import { OptionsStack, RangeField, Segmented, SelectField } from '@/components/tools/options';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { useImageProbe } from '@/components/tools/useImageProbe';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { fmt, plural } from '@/i18n/format';
import { outputFileName } from '@/lib/files/sanitize';
import { OUTPUT_EXTENSION, OUTPUT_MIME } from '@/lib/files/types';
import type { OutputMime } from '@/lib/image/encode';
import type { CompressImageUi } from './i18n/en';

type Format = 'same' | 'jpeg' | 'webp';
const MAX_SIZES = ['0', '3840', '2560', '1920', '1280'] as const;
type MaxSize = (typeof MAX_SIZES)[number];

export default function CompressImageTool(props: ToolIslandProps<CompressImageUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const probe = useImageProbe(selection);

  const [format, setFormat] = useState<Format>('same');
  const [quality, setQuality] = useState(75);
  const [maxSize, setMaxSize] = useState<MaxSize>('0');

  const files = selection.files;
  const allPng = files.length > 0 && files.every((f) => f.type === 'png');
  const qualityApplies = !(format === 'same' && allPng);

  const onRun = () => {
    const jobs: ImageJob[] = files.map((item) => {
      const type = format === 'same' ? item.type : format;
      const mime = OUTPUT_MIME[type] as OutputMime;
      return {
        item,
        options: {
          mime,
          quality: quality / 100,
          resize: maxSize === '0' ? { mode: 'none' } : { mode: 'max', maxDimension: Number(maxSize) },
        },
        outputName: outputFileName(item.name, ui.suffix, OUTPUT_EXTENSION[type], 'image'),
        keepOriginalIfLarger: true,
      };
    });
    void runner.run(
      (ctx) =>
        runImageBatch(jobs, ctx, {
          common,
          locale,
          archiveName: ui.zipName,
          withTotals: true,
          summary: (count) => plural(ui.summary, count, locale),
        }),
      { filesCount: jobs.length, totalBytes: selection.totalBytes, outputFormat: format, mode: `q${quality}` },
    );
  };

  const options = (
    <OptionsStack>
      <Segmented<Format>
        legend={ui.format}
        value={format}
        onChange={setFormat}
        hint={ui.formatHint}
        options={[
          { value: 'same', label: ui.formatSame },
          { value: 'jpeg', label: ui.formatJpg },
          { value: 'webp', label: ui.formatWebp },
        ]}
      />
      <RangeField
        label={common.options.quality}
        value={quality}
        min={10}
        max={95}
        step={1}
        onChange={setQuality}
        format={(v) => `${v}%`}
        minLabel={common.options.qualityLow}
        maxLabel={common.options.qualityHigh}
        disabled={!qualityApplies}
        hint={qualityApplies ? undefined : ui.pngOnlyHint}
      />
      <SelectField<MaxSize>
        label={ui.maxSize}
        value={maxSize}
        onChange={setMaxSize}
        options={MAX_SIZES.map((size) => ({
          value: size,
          label: size === '0' ? ui.maxSizeOriginal : fmt(ui.maxSizeOption, { size }),
        }))}
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
      actionLabel={files.length > 1 ? ui.action : ui.actionSingle}
      onRun={onRun}
      canRun={files.length > 0}
      dropzoneTitle={ui.dropTitle}
      downloadLabel={ui.downloadLabel}
    />
  );
}
