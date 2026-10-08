import { useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { Notice } from '@/components/tools/Notice';
import { CheckboxField, OptionsStack, Segmented } from '@/components/tools/options';
import { createOutput } from '@/components/tools/output';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { usePdfInspection } from '@/components/tools/usePdfInspection';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { fmt, plural } from '@/i18n/format';
import { bytesToBlob } from '@/lib/files/read';
import { outputFileName } from '@/lib/files/sanitize';
import type { CompressPdfUi } from './i18n/en';
import { LEVELS, type CompressLevel } from './levels';
import { runOptimize } from './run';

export default function CompressPdfTool(props: ToolIslandProps<CompressPdfUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const inspect = usePdfInspection(selection);

  const [level, setLevel] = useState<CompressLevel>('recommended');
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [rasterize, setRasterize] = useState(false);

  const current = selection.files[0];
  const problem = current?.info.problem;
  const inspecting = Boolean(current?.info.inspecting);
  const canRun = Boolean(current) && !problem && !inspecting;

  const onRun = () => {
    if (!current) return;
    const original = current.file;
    const originalName = current.name;
    void runner.run(
      async ({ signal, progress }) => {
        let bytes: Uint8Array;
        let summary: string;
        const notes: string[] = [];

        if (rasterize) {
          progress(null, ui.loadingEngine);
          const { rasterizePdf } = await import('./rasterize');
          const preset = LEVELS[level];
          const result = await rasterizePdf(
            original,
            { dpi: preset.dpi, quality: preset.quality },
            { signal, onProgress: (value, page, total) => progress(value, fmt(ui.renderingPage, { current: page, total })) },
          );
          bytes = result.bytes;
          summary = plural(ui.summaryRaster, result.pageCount, locale);
          if (result.limitedPages > 0) notes.push(plural(ui.limitedPages, result.limitedPages, locale));
        } else {
          progress(null, common.status.preparing);
          const result = await runOptimize(
            original,
            { level, removeMetadata },
            {
              signal,
              onProgress: ({ value, label }) => {
                if (label?.startsWith('images:')) {
                  const [, currentImage, totalImages] = label.split(':');
                  progress(value, fmt(ui.optimizingImages, { current: currentImage ?? '', total: totalImages ?? '' }));
                } else {
                  progress(value, value !== null && value >= 1 ? ui.saving : ui.optimizingStructure);
                }
              },
            },
          );
          bytes = result.bytes;
          summary =
            result.imagesFound > 0
              ? fmt(ui.summaryImages, { optimized: result.imagesOptimized, found: result.imagesFound })
              : ui.summaryNoImages;
        }

        if (bytes.length >= original.size) {
          // Never hand back a bigger file: keep the original and say so.
          return {
            files: [createOutput(original, originalName, { inputSize: original.size, keptOriginal: true })],
            totals: { before: original.size, after: original.size },
            summary,
            notes: [ui.noGain, ...notes],
          };
        }
        return {
          files: [
            createOutput(bytesToBlob(bytes, 'application/pdf'), outputFileName(originalName, ui.outputSuffix, '.pdf', 'document'), {
              inputSize: original.size,
            }),
          ],
          totals: { before: original.size, after: bytes.length },
          summary,
          notes,
        };
      },
      { filesCount: 1, totalBytes: current.size, mode: rasterize ? `raster_${level}` : level },
    );
  };

  const options = (
    <OptionsStack>
      <Segmented<CompressLevel>
        legend={ui.level}
        value={level}
        onChange={setLevel}
        options={[
          { value: 'light', label: ui.levelLight, sublabel: ui.levelLightHint },
          { value: 'recommended', label: ui.levelRecommended, sublabel: ui.levelRecommendedHint },
          { value: 'strong', label: ui.levelStrong, sublabel: ui.levelStrongHint },
        ]}
      />
      <CheckboxField label={ui.removeMetadata} hint={ui.removeMetadataHint} checked={removeMetadata || rasterize} disabled={rasterize} onChange={setRemoveMetadata} />
      <CheckboxField label={ui.rasterize} checked={rasterize} onChange={setRasterize} />
      {rasterize && (
        <Notice tone="warning">
          <p>{ui.rasterizeHint}</p>
        </Notice>
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
      actionHint={inspecting ? ui.inspecting : problem === 'encrypted_pdf' ? ui.protectedHint : undefined}
      dropzoneTitle={ui.dropTitle}
      errorAlternatives={{ too_many_pages: 'split-pdf' }}
      downloadLabel={ui.downloadLabel}
      notices={
        problem ? (
          <Notice tone="error" title={common.errors[problem === 'encrypted_pdf' ? 'encrypted_pdf' : 'corrupt_pdf'].title}>
            <p>{common.errors[problem === 'encrypted_pdf' ? 'encrypted_pdf' : 'corrupt_pdf'].message}</p>
          </Notice>
        ) : undefined
      }
    />
  );
}
