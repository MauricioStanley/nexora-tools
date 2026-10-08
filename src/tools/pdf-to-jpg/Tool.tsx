import { useMemo, useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { Notice } from '@/components/tools/Notice';
import { OptionsStack, RangeField, Segmented, TextField } from '@/components/tools/options';
import { createOutput, type OutputFile } from '@/components/tools/output';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection, type SelectedFile } from '@/components/tools/useFileSelection';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { fmt, plural } from '@/i18n/format';
import { toFailure } from '@/lib/errors';
import { baseName } from '@/lib/files/sanitize';
import { parsePageRanges, expandRanges } from '@/lib/pdf/ranges';
import type { PdfToJpgUi } from './i18n/en';
import { MAX_INDIVIDUAL_FILES, MAX_RENDER_PAGES } from './limits';

type PageMode = 'all' | 'custom';
type Dpi = '72' | '150' | '300';


export default function PdfToJpgTool(props: ToolIslandProps<PdfToJpgUi>) {
  const { ui, common, locale, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);

  const [pageMode, setPageMode] = useState<PageMode>('all');
  const [pagesText, setPagesText] = useState('');
  const [dpi, setDpi] = useState<Dpi>('150');
  const [quality, setQuality] = useState(85);

  const current = selection.files[0];
  const pageCount = current?.info.pages ?? null;
  const problem = current?.info.problem;

  // PDF.js (not pdf-lib) reads the page count: it can open owner-password PDFs that
  // pdf-lib refuses, so users aren't blocked from rendering those.
  const inspect = async (added: SelectedFile[]) => {
    const item = added[0];
    if (!item) return;
    selection.updateInfo(item.id, { inspecting: true });
    try {
      const { countPdfPages } = await import('./render');
      const pages = await countPdfPages(item.file);
      selection.updateInfo(item.id, { inspecting: false, pages, problem: null });
    } catch (error) {
      const code = toFailure(error).code;
      selection.updateInfo(item.id, { inspecting: false, problem: code === 'encrypted_pdf' ? 'encrypted_pdf' : 'corrupt_pdf' });
    }
  };

  const parsed = useMemo(
    () => (pageMode === 'custom' && pageCount ? parsePageRanges(pagesText, pageCount) : null),
    [pageMode, pageCount, pagesText],
  );
  const selectedPages = useMemo(() => {
    if (!pageCount) return [];
    if (pageMode === 'all') return Array.from({ length: pageCount }, (_, i) => i + 1);
    return parsed?.ok ? [...new Set(expandRanges(parsed.ranges))] : [];
  }, [pageCount, pageMode, parsed]);

  const tooMany = selectedPages.length > MAX_RENDER_PAGES;
  const rangeError =
    parsed && !parsed.ok && pagesText.trim() !== ''
      ? fmt(ui.rangeErrors[parsed.error], { token: parsed.token ?? '', pages: pageCount ?? 0 })
      : undefined;
  const inspecting = Boolean(current?.info.inspecting);
  const canRun = Boolean(current) && !problem && !inspecting && selectedPages.length > 0 && !tooMany;
  const hint = inspecting
    ? ui.reading
    : tooMany
      ? fmt(ui.tooMany, { count: MAX_RENDER_PAGES })
      : selectedPages.length > 0
        ? plural(ui.preview, selectedPages.length, locale)
        : undefined;

  const onRun = () => {
    if (!current) return;
    const file = current.file;
    const name = baseName(current.name, 'document');
    const pages = [...selectedPages];
    const width = String(pageCount ?? pages.length).length;
    void runner.run(
      async ({ signal, progress }) => {
        progress(null, ui.loadingEngine);
        const [{ renderPdfPages }, { createZip }] = await Promise.all([import('./render'), import('@/lib/files/zip')]);
        const rendered = await renderPdfPages(
          file,
          pages,
          { dpi: Number(dpi), quality: quality / 100 },
          { signal, onPage: (index, total) => progress((index / total) * 0.92, fmt(ui.rendering, { current: index + 1, total })) },
        );
        const named = rendered.pages.map((p) => ({ ...p, name: `${name}-${ui.pageName}-${String(p.page).padStart(width, '0')}.jpg` }));
        const outputs: OutputFile[] = named.map((p) =>
          createOutput(p.blob, p.name, { detail: fmt(common.fileList.dimensions, { width: p.width, height: p.height }) }),
        );
        const notes = rendered.limitedPages > 0 ? [plural(ui.limitedPages, rendered.limitedPages, locale)] : [];

        if (outputs.length === 1) {
          return { files: outputs, summary: plural(ui.summary, 1, locale), notes };
        }
        progress(0.95, ui.packaging);
        const zip = createZip(await Promise.all(named.map(async (p) => ({ name: p.name, data: new Uint8Array(await p.blob.arrayBuffer()) }))));
        const archive = createOutput(new Blob([zip as Uint8Array<ArrayBuffer>], { type: 'application/zip' }), `${name}-jpg.zip`);
        const individual = outputs.length <= MAX_INDIVIDUAL_FILES;
        if (!individual) outputs.forEach((o) => URL.revokeObjectURL(o.url));
        return {
          files: individual ? outputs : [archive],
          archive,
          archiveOnly: !individual,
          summary: plural(ui.summary, outputs.length, locale),
          notes,
        };
      },
      { filesCount: 1, totalBytes: current.size, mode: `dpi_${dpi}` },
    );
  };

  const options = (
    <OptionsStack>
      <Segmented<PageMode>
        legend={ui.pages}
        value={pageMode}
        onChange={setPageMode}
        options={[
          { value: 'all', label: ui.pagesAll, sublabel: pageCount ? plural(common.fileList.pages, pageCount, locale) : undefined },
          { value: 'custom', label: ui.pagesCustom },
        ]}
      />
      {pageMode === 'custom' && (
        <TextField
          label={ui.pagesLabel}
          value={pagesText}
          onChange={setPagesText}
          placeholder={ui.pagesPlaceholder}
          hint={ui.pagesHint}
          error={rangeError}
        />
      )}
      <Segmented<Dpi>
        legend={ui.resolution}
        value={dpi}
        onChange={setDpi}
        options={[
          { value: '72', label: ui.resScreen, sublabel: ui.resScreenHint },
          { value: '150', label: ui.resStandard, sublabel: ui.resStandardHint },
          { value: '300', label: ui.resHigh, sublabel: ui.resHighHint },
        ]}
      />
      <RangeField
        label={ui.quality}
        value={quality}
        min={50}
        max={100}
        step={1}
        onChange={setQuality}
        format={(v) => `${v}%`}
        minLabel={common.options.qualityLow}
        maxLabel={common.options.qualityHigh}
      />
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
      errorAlternatives={{ too_many_pages: 'split-pdf' }}
      downloadLabel={ui.downloadLabel}
      showComparison={false}
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
