import { useEffect, useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { runImageBatch, type ImageJob } from '@/components/tools/imageBatch';
import { CheckboxField, FieldPair, NumberField, OptionsStack, RangeField, Segmented } from '@/components/tools/options';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { useImageProbe } from '@/components/tools/useImageProbe';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { fmt, plural } from '@/i18n/format';
import { outputFileName } from '@/lib/files/sanitize';
import { OUTPUT_EXTENSION, OUTPUT_MIME } from '@/lib/files/types';
import type { OutputMime } from '@/lib/image/encode';
import { computeTargetSize, MAX_OUTPUT_SIDE, proportionalSide, type ResizeSpec } from '@/lib/image/resize';
import type { ResizeImageUi } from './i18n/en';

type Mode = 'pixels' | 'percent';
type Format = 'same' | 'jpeg' | 'png' | 'webp';

const valid = (value: number | '') => typeof value === 'number' && value >= 1 && value <= MAX_OUTPUT_SIDE;

export default function ResizeImageTool(props: ToolIslandProps<ResizeImageUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const probe = useImageProbe(selection);

  const [mode, setMode] = useState<Mode>('pixels');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [keepAspect, setKeepAspect] = useState(true);
  const [percent, setPercent] = useState(50);
  const [format, setFormat] = useState<Format>('same');
  const [quality, setQuality] = useState(90);

  const files = selection.files;
  const first = files[0];
  const firstSize = first?.info.width && first.info.height ? { width: first.info.width, height: first.info.height } : null;

  // Prefill with the first image's dimensions so users edit from a real starting point.
  useEffect(() => {
    if (firstSize && width === '' && height === '') {
      setWidth(firstSize.width);
      setHeight(firstSize.height);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstSize?.width, firstSize?.height]);

  const onWidth = (value: number | '') => {
    setWidth(value);
    if (keepAspect && firstSize && files.length === 1 && valid(value)) setHeight(proportionalSide(firstSize, 'width', value as number));
  };
  const onHeight = (value: number | '') => {
    setHeight(value);
    if (keepAspect && firstSize && files.length === 1 && valid(value)) setWidth(proportionalSide(firstSize, 'height', value as number));
  };

  let spec: ResizeSpec | null = null;
  let problem: string | undefined;
  if (mode === 'percent') {
    spec = { mode: 'percent', percent };
  } else if (keepAspect) {
    if (width === '' && height === '') problem = ui.needSize;
    else if ((width !== '' && !valid(width)) || (height !== '' && !valid(height))) problem = fmt(ui.invalidSize, { max: MAX_OUTPUT_SIDE });
    else spec = { mode: 'fit', width: width || undefined, height: height || undefined };
  } else if (width === '' || height === '') {
    problem = ui.needBoth;
  } else if (!valid(width) || !valid(height)) {
    problem = fmt(ui.invalidSize, { max: MAX_OUTPUT_SIDE });
  } else {
    spec = { mode: 'exact', width, height };
  }

  const preview = spec && firstSize && files.length === 1 ? computeTargetSize(firstSize, spec) : null;
  const hint = problem ?? (preview ? fmt(ui.resultSize, { width: preview.width, height: preview.height }) : undefined);

  const onRun = () => {
    if (!spec) return;
    const resize = spec;
    const jobs: ImageJob[] = files.map((item) => {
      const type = format === 'same' ? item.type : format;
      return {
        item,
        options: { mime: OUTPUT_MIME[type] as OutputMime, quality: quality / 100, resize },
        outputName: outputFileName(item.name, ui.suffix, OUTPUT_EXTENSION[type], 'image'),
      };
    });
    void runner.run(
      (ctx) =>
        runImageBatch(jobs, ctx, {
          common,
          locale,
          archiveName: ui.zipName,
          withTotals: false,
          summary: (count) => plural(ui.summary, count, locale),
        }),
      { filesCount: jobs.length, totalBytes: selection.totalBytes, mode: resize.mode, outputFormat: format },
    );
  };

  const lossy = format === 'jpeg' || format === 'webp' || (format === 'same' && files.some((f) => f.type !== 'png'));

  const options = (
    <OptionsStack>
      <Segmented<Mode>
        legend={ui.mode}
        value={mode}
        onChange={setMode}
        options={[
          { value: 'pixels', label: ui.modePixels },
          { value: 'percent', label: ui.modePercent },
        ]}
      />
      {mode === 'pixels' ? (
        <>
          <FieldPair>
            <NumberField label={ui.width} value={width} onChange={onWidth} min={1} max={MAX_OUTPUT_SIDE} suffix={ui.px} invalid={width !== '' && !valid(width)} />
            <NumberField label={ui.height} value={height} onChange={onHeight} min={1} max={MAX_OUTPUT_SIDE} suffix={ui.px} invalid={height !== '' && !valid(height)} />
          </FieldPair>
          <CheckboxField label={ui.keepAspect} hint={ui.keepAspectHint} checked={keepAspect} onChange={setKeepAspect} />
        </>
      ) : (
        <RangeField label={ui.percent} value={percent} min={5} max={200} step={5} onChange={setPercent} format={(v) => `${v}%`} minLabel="5%" maxLabel="200%" />
      )}
      <Segmented<Format>
        legend={ui.format}
        value={format}
        onChange={setFormat}
        options={[
          { value: 'same', label: ui.formatSame },
          { value: 'jpeg', label: ui.formatJpg },
          { value: 'png', label: ui.formatPng },
          { value: 'webp', label: ui.formatWebp },
        ]}
        wrap={false}
      />
      {lossy && (
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
      )}
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
      canRun={files.length > 0 && spec !== null}
      actionHint={hint}
      dropzoneTitle={ui.dropTitle}
      downloadLabel={ui.downloadLabel}
    />
  );
}
