import { useEffect, useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { runImageBatch, type ImageJob } from '@/components/tools/imageBatch';
import { CheckboxField, OptionsStack, Segmented } from '@/components/tools/options';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { useImageProbe } from '@/components/tools/useImageProbe';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { plural } from '@/i18n/format';
import { outputFileName } from '@/lib/files/sanitize';
import { OUTPUT_EXTENSION, OUTPUT_MIME } from '@/lib/files/types';
import type { OutputMime } from '@/lib/image/encode';
import { cssTransform, isIdentityTransform, type ImageTransform, type QuarterTurn } from '@/lib/image/transform';
import type { RotateImageUi } from './i18n/en';
import styles from './Tool.module.css';

type Turn = '0' | '90' | '180' | '270';

function TransformPreview({ file, transform, caption }: { file: File | undefined; transform: ImageTransform; caption: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) return setUrl(null);
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  if (!url) return null;
  return (
    <figure className={styles.preview}>
      <div className={styles.frame}>
        <img src={url} alt="" style={{ transform: cssTransform(transform) }} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export default function RotateImageTool(props: ToolIslandProps<RotateImageUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const probe = useImageProbe(selection);

  const [turn, setTurn] = useState<Turn>('90');
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const files = selection.files;
  const transform: ImageTransform = { rotate: Number(turn) as QuarterTurn, flipH, flipV };
  const unchanged = isIdentityTransform(transform);

  const onRun = () => {
    const jobs: ImageJob[] = files.map((item) => ({
      item,
      options: { mime: OUTPUT_MIME[item.type] as OutputMime, quality: item.type === 'png' ? 1 : 0.92, transform },
      outputName: outputFileName(item.name, ui.suffix, OUTPUT_EXTENSION[item.type], 'image'),
    }));
    void runner.run(
      (ctx) =>
        runImageBatch(jobs, ctx, {
          common,
          locale,
          archiveName: ui.zipName,
          summary: (count) => plural(ui.summary, count, locale),
        }),
      { filesCount: jobs.length, totalBytes: selection.totalBytes, mode: `${turn}${flipH ? '-h' : ''}${flipV ? '-v' : ''}` },
    );
  };

  const options = (
    <OptionsStack>
      <TransformPreview file={files[0]?.file} transform={transform} caption={files.length > 1 ? ui.previewFirst : ui.previewCaption} />
      <Segmented<Turn>
        legend={ui.rotation}
        value={turn}
        onChange={setTurn}
        wrap
        options={[
          { value: '0', label: ui.none },
          { value: '90', label: ui.right, sublabel: '90°' },
          { value: '180', label: ui.upsideDown, sublabel: '180°' },
          { value: '270', label: ui.left, sublabel: '90°' },
        ]}
      />
      <CheckboxField label={ui.flipH} checked={flipH} onChange={setFlipH} />
      <CheckboxField label={ui.flipV} checked={flipV} onChange={setFlipV} />
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
      canRun={files.length > 0 && !unchanged}
      actionHint={unchanged ? ui.chooseTransform : undefined}
      dropzoneTitle={ui.dropTitle}
      downloadLabel={ui.downloadLabel}
      showComparison={false}
    />
  );
}
