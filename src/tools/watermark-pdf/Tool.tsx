import { useMemo, useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { ColorField, OptionsStack, RangeField, Segmented, TextField } from '@/components/tools/options';
import { createOutput } from '@/components/tools/output';
import { PdfProblemNotice } from '@/components/tools/PdfProblemNotice';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { usePdfInspection } from '@/components/tools/usePdfInspection';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { fmt, plural } from '@/i18n/format';
import { bytesToBlob } from '@/lib/files/read';
import { outputFileName } from '@/lib/files/sanitize';
import { unsupportedChars } from '@/lib/pdf/winansi';
import type { WatermarkPdfUi } from './i18n/en';
import { planStamps, WATERMARK_MAX_LENGTH, type WatermarkLayout } from './layout';
import { runWatermark } from './run';
import styles from './Tool.module.css';

/** A4 in points: the preview page. */
const PAGE = { width: 595, height: 842 };
const FONT = 'Helvetica, Arial, sans-serif';

/** Text width at size 1 in the bold sans font (close to PDF Helvetica-Bold). */
function measureWidthAt1(text: string): number {
  const ctx = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  if (!ctx) return text.length * 0.6;
  ctx.font = `700 100px ${FONT}`;
  return ctx.measureText(text).width / 100;
}

export default function WatermarkPdfTool(props: ToolIslandProps<WatermarkPdfUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const inspect = usePdfInspection(selection);

  const [text, setText] = useState(ui.defaultText);
  const [layout, setLayout] = useState<WatermarkLayout>('diagonal');
  const [size, setSize] = useState(60);
  const [opacity, setOpacity] = useState(25);
  const [color, setColor] = useState('#808080');

  const current = selection.files[0];
  const pages = current?.info.pages ?? null;
  const problem = current?.info.problem;
  const inspecting = Boolean(current?.info.inspecting);

  const trimmed = text.trim();
  const unsupported = unsupportedChars(trimmed);
  const textError = unsupported.length > 0 ? fmt(ui.unsupportedChars, { chars: unsupported.join(' ') }) : undefined;
  const canRun = Boolean(current) && !problem && !inspecting && trimmed !== '' && unsupported.length === 0;
  const hint = inspecting ? ui.inspecting : trimmed === '' ? ui.textRequired : pages ? plural(ui.preview, pages, locale) : undefined;

  const stamps = useMemo(
    () => (trimmed && unsupported.length === 0 ? planStamps(PAGE, layout, measureWidthAt1(trimmed), size) : []),
    [trimmed, unsupported.length, layout, size],
  );

  const onRun = () => {
    if (!current || !canRun) return;
    const { file, name, size: bytes } = current;
    void runner.run(
      async ({ signal, progress }) => {
        progress(null, common.status.preparing);
        const result = await runWatermark(
          file,
          { text: trimmed, layout, fontSize: size, opacity: opacity / 100, color },
          { signal, onProgress: ({ value }) => progress(value) },
        );
        return {
          files: [
            createOutput(bytesToBlob(result.bytes, 'application/pdf'), outputFileName(name, ui.outputSuffix, '.pdf', 'document'), {
              detail: plural(common.fileList.pages, result.pages, locale),
            }),
          ],
          summary: plural(ui.summary, result.pages, locale),
        };
      },
      { filesCount: 1, totalBytes: bytes, mode: layout },
    );
  };

  const options = (
    <OptionsStack>
      <figure className={styles.preview}>
        <svg viewBox={`0 0 ${PAGE.width} ${PAGE.height}`} role="img" aria-label={ui.previewLabel}>
          <rect width={PAGE.width} height={PAGE.height} fill="#ffffff" />
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={64} y={96 + i * 42} width={467 - (i % 4) * 70} height={10} rx={5} fill="#e4e6eb" />
          ))}
          {stamps.map((stamp, i) => {
            const y = PAGE.height - stamp.center.y;
            return (
              <text
                key={i}
                x={stamp.center.x}
                y={y}
                transform={`rotate(${-stamp.angle} ${stamp.center.x} ${y})`}
                fontFamily={FONT}
                fontWeight={700}
                fontSize={stamp.size}
                fill={color}
                fillOpacity={opacity / 100}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {trimmed}
              </text>
            );
          })}
        </svg>
        <figcaption>{ui.previewCaption}</figcaption>
      </figure>
      <TextField label={ui.textLabel} value={text} onChange={setText} maxLength={WATERMARK_MAX_LENGTH} error={textError} />
      <Segmented<WatermarkLayout>
        legend={ui.layout}
        value={layout}
        onChange={setLayout}
        options={[
          { value: 'diagonal', label: ui.layoutDiagonal },
          { value: 'horizontal', label: ui.layoutHorizontal },
          { value: 'tiled', label: ui.layoutTiled },
        ]}
      />
      <RangeField label={ui.size} value={size} min={12} max={120} step={2} onChange={setSize} format={(v) => `${v} pt`} hint={ui.sizeHint} />
      <RangeField label={ui.opacity} value={opacity} min={5} max={90} onChange={setOpacity} format={(v) => `${v}%`} />
      <ColorField label={ui.color} value={color} onChange={setColor} />
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
