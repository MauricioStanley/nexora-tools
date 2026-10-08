import { useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { CheckboxField, OptionsStack, Segmented } from '@/components/tools/options';
import { createOutput } from '@/components/tools/output';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { useImageProbe } from '@/components/tools/useImageProbe';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { fmt, plural } from '@/i18n/format';
import { throwIfAborted } from '@/lib/errors';
import { bytesToBlob, yieldToMain } from '@/lib/files/read';
import type { JpgToPdfUi } from './i18n/en';
import type { MarginOption, OrientationOption, PageSizeOption } from './layout';
import type { PreparedImage } from './logic';
import { prepareImage } from './prepare';
import { runImagesToPdf } from './run';

export default function JpgToPdfTool(props: ToolIslandProps<JpgToPdfUi>) {
  const { ui, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const probe = useImageProbe(selection);

  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [orientation, setOrientation] = useState<OrientationOption>('auto');
  const [margin, setMargin] = useState<MarginOption>('small');
  const [stripMetadata, setStripMetadata] = useState(true);
  const [failedIndex, setFailedIndex] = useState<number | null>(null);

  const files = selection.files;

  const onRun = () => {
    const snapshot = [...files];
    const total = snapshot.length;
    setFailedIndex(null);
    void runner.run(
      async ({ signal, progress }) => {
        const prepared: PreparedImage[] = [];
        for (let i = 0; i < total; i++) {
          throwIfAborted(signal);
          progress((i / total) * 0.6, fmt(ui.preparing, { current: i + 1, total }));
          try {
            prepared.push(await prepareImage(snapshot[i]!.file, snapshot[i]!.type, { stripMetadata, signal, index: i }));
          } catch (error) {
            setFailedIndex(i);
            throw error;
          }
          await yieldToMain();
        }
        progress(0.6, ui.building);
        const result = await runImagesToPdf(
          { images: prepared, pageSize, orientation, margin },
          { signal, onProgress: ({ value }) => value !== null && progress(0.6 + value * 0.4, ui.building) },
        );
        return {
          files: [createOutput(bytesToBlob(result.bytes, 'application/pdf'), `${ui.outputName}.pdf`)],
          summary: plural(ui.summary, total, locale, { pages: result.pageCount }),
        };
      },
      { filesCount: total, totalBytes: selection.totalBytes, mode: pageSize },
    );
  };

  const options = (
    <OptionsStack>
      <Segmented<PageSizeOption>
        legend={ui.pageSize}
        value={pageSize}
        onChange={setPageSize}
        options={[
          { value: 'fit', label: ui.sizeFit, sublabel: ui.sizeFitHint },
          { value: 'a4', label: ui.sizeA4, sublabel: ui.sizeA4Hint },
          { value: 'letter', label: ui.sizeLetter, sublabel: ui.sizeLetterHint },
        ]}
      />
      {pageSize !== 'fit' && (
        <Segmented<OrientationOption>
          legend={ui.orientation}
          value={orientation}
          onChange={setOrientation}
          options={[
            { value: 'auto', label: ui.orientationAuto },
            { value: 'portrait', label: ui.orientationPortrait },
            { value: 'landscape', label: ui.orientationLandscape },
          ]}
        />
      )}
      <Segmented<MarginOption>
        legend={ui.margin}
        value={margin}
        onChange={setMargin}
        options={[
          { value: 'none', label: ui.marginNone },
          { value: 'small', label: ui.marginSmall },
          { value: 'large', label: ui.marginLarge },
        ]}
      />
      <CheckboxField label={ui.stripMetadata} hint={ui.stripMetadataHint} checked={stripMetadata} onChange={setStripMetadata} />
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
      reorderable
      dropzoneTitle={ui.dropTitle}
      downloadLabel={ui.downloadLabel}
      showComparison={false}
      errorFileName={failedIndex !== null ? files[failedIndex]?.name : undefined}
    />
  );
}
