# Adding a tool

Adding tool #11, or #500, touches **only the new tool's folder** (plus, rarely, a new category entry). Navigation, search, category pages, the directory, related tools, sitemap, hreflang, metadata and JSON-LD all update automatically from the registry.

This walkthrough adds a hypothetical **Rotate PDF** tool.

## 0. Decide where it runs (honestly)

| Question | If yes |
| --- | --- |
| Can a browser do it reliably with reasonable memory? | `executionMode: 'client'` |
| Only partly (e.g. preview locally, heavy step on a server)? | `hybrid`, and document which step uploads |
| Needs server-side software (OCR, Office conversion, large video)? | `server`, and read "Server tools" below first |

Never label a tool `client` if any file data leaves the device. The privacy badge is derived from this field.

## 1. Create the folder and register metadata

`src/tools/rotate-pdf/meta.ts`

```ts
import type { ToolMeta } from '../types';

const meta: ToolMeta = {
  id: 'rotate-pdf',               // kebab-case, equals the folder name, never changes
  category: 'pdf',                // must exist in src/data/categories.ts
  icon: 'refresh',                // key of src/lib/icons.ts (add a path there if needed)
  order: 60,                      // position within listings
  status: 'live',                 // 'beta' shows a label; 'coming-soon'/'hidden' are never routed
  featured: false,
  popular: false,
  executionMode: 'client',
  input: { kind: 'files', accept: ['pdf'], multiple: false, minFiles: 1, maxFiles: 1, maxFileSizeMB: 200 },
  output: ['pdf'],
  relatedToolIds: ['merge-pdf', 'compress-pdf'], // genuinely useful next steps only
  slugs: { en: 'rotate-pdf', es: 'rotar-pdf' },
  dateModified: '2026-10-01',
  schema: { applicationCategory: 'UtilitiesApplication' },
};

export default meta;
```

That alone makes the registry discover the tool. The build will then fail until the next steps are done, which is intentional.

## 2. Add localized copy

`src/tools/rotate-pdf/i18n/en.ts` defines the UI string shape; `es.ts` must match it (the type enforces this).

```ts
import type { ToolContent } from '../../types';

const ui = {
  action: 'Rotate PDF',
  angle: 'Rotation',
  // …every string the UI shows, including plural forms: { one: '…', other: '…' }
};
export type RotatePdfUi = typeof ui;

const content: ToolContent<RotatePdfUi> = {
  name: 'Rotate PDF',
  tagline: '…',                      // ≤ ~90 chars (cards, search results)
  description: '…',                  // 1–2 sentences under the H1
  seo: { title: '…', description: '…' }, // title ≤ 62 chars (brand suffix added), description 110–165 chars
  keywords: ['rotate pdf', '…'],     // how people search in this language
  aliases: ['turn pdf pages', '…'],  // alternative phrasings (search + intent coverage)
  howTo: [{ title: '…', text: '…' } /* ≥ 3 steps */],
  about: ['…'],                      // what it does, concisely: no filler
  limitations: ['…'],                // honest caveats ("Good to know")
  faq: [{ question: '…', answer: '…' } /* ≥ 3, genuinely useful */],
  ui,
};
export default content;
```

Content rules: write for humans, be specific, never promise results the tool can't guarantee, don't duplicate another tool's intent (one intent = one page), and keep it short.

## 3. Implement the processing module

`src/tools/rotate-pdf/logic.ts` should be pure (no DOM), taking and returning plain data:

```ts
import { loadPdfDocument, stampProducer } from '@/lib/pdf/load';
import { degrees } from '@/lib/pdf/pdf-lib';

export interface RotatePayload { file: ArrayBuffer; angle: 90 | 180 | 270 }
export interface RotateResult { bytes: Uint8Array }

export async function rotatePdf(payload: RotatePayload, onProgress?: (v: number) => void): Promise<RotateResult> {
  const doc = await loadPdfDocument(new Uint8Array(payload.file)); // throws user-facing ToolFailure codes
  doc.getPages().forEach((page) => page.setRotation(degrees((page.getRotation().angle + payload.angle) % 360)));
  stampProducer(doc);
  onProgress?.(0.9);
  return { bytes: await doc.save({ useObjectStreams: true }) };
}
```

Guidelines:

- Throw `ToolFailure(code)` for expected problems (`src/lib/errors.ts`). Never let raw exceptions reach users.
- Check `throwIfAborted(signal)` between expensive steps on the main thread.
- Import pdf-lib only through `@/lib/pdf/pdf-lib`.
- Heavy work belongs in a worker. Add `worker.ts` and `run.ts` by copying `split-pdf/worker.ts` and `split-pdf/run.ts` (about 20 lines each). The worker transfers buffers only after it has started; the fallback runs `logic.ts` on the main thread.
- Image tools usually need no worker: build `ImageJob`s and call `runImageBatch()`.
- **Never import `logic.ts` statically from `Tool.tsx`** if it pulls a large library. Use `run.ts` or a dynamic `import()` so the library stays out of the page's initial JS.

## 4. Connect the UI

`src/tools/rotate-pdf/Tool.tsx`, a complete file tool in about 50 lines:

```tsx
import { useState } from 'react';
import { FileToolLayout } from '@/components/tools/FileToolLayout';
import { OptionsStack, Segmented } from '@/components/tools/options';
import { createOutput } from '@/components/tools/output';
import type { ToolIslandProps } from '@/components/tools/types';
import { useFileSelection } from '@/components/tools/useFileSelection';
import { usePdfInspection } from '@/components/tools/usePdfInspection';
import { useToolRunner } from '@/components/tools/useToolRunner';
import { bytesToBlob } from '@/lib/files/read';
import { outputFileName } from '@/lib/files/sanitize';
import type { RotatePdfUi } from './i18n/en';
import { runRotate } from './run';

export default function RotatePdfTool(props: ToolIslandProps<RotatePdfUi>) {
  const { ui, input, toolId } = props;
  const selection = useFileSelection(input, toolId);
  const runner = useToolRunner(toolId);
  const inspect = usePdfInspection(selection);
  const [angle, setAngle] = useState<'90' | '180' | '270'>('90');
  const file = selection.files[0];

  const onRun = () =>
    void runner.run(async ({ signal, progress }) => {
      const result = await runRotate(file!.file, { angle: Number(angle) as 90 }, { signal, onProgress: ({ value }) => progress(value) });
      return { files: [createOutput(bytesToBlob(result.bytes, 'application/pdf'), outputFileName(file!.name, 'rotated', '.pdf'))] };
    }, { filesCount: 1, totalBytes: file?.size });

  return (
    <FileToolLayout
      island={props}
      selection={selection}
      runner={runner}
      onFilesAdded={inspect}
      options={<OptionsStack><Segmented legend={ui.angle} value={angle} onChange={setAngle} options={[/* … */]} /></OptionsStack>}
      actionLabel={ui.action}
      onRun={onRun}
      canRun={Boolean(file) && !file?.info.problem && !file?.info.inspecting}
    />
  );
}
```

`src/tools/rotate-pdf/Island.astro` is identical for every tool (copy it):

```astro
---
import type { ComponentProps } from 'react';
import Tool from './Tool';
type Props = ComponentProps<typeof Tool>;
const props = Astro.props;
---
<Tool client:load {...props} />
```

Tools without files (generators, calculators) use `ToolShell` and `ToolPanel` directly. See `qr-code-generator/Tool.tsx`.

## 5. Define related tools

In `meta.ts`, `relatedToolIds` drives the "Related tools" section, the "Continue with" chips after success, and structured internal linking. Choose tools a user would **actually** use next (Rotate → Merge, Compress), in order of usefulness. Consider adding the new tool to the `relatedToolIds` of tools that naturally lead to it. Error alternatives are explicit per failure code (`errorAlternatives` prop), never generic.

## 6. Add tests

`src/tools/rotate-pdf/logic.test.ts`: generate inputs with `tests/fixtures.ts` (`makePdf`, `noisyJpeg`, `solidPng`) and assert on outputs. The registry, routing, SEO, i18n and search suites automatically cover the new tool. For example, the search test should find it for its main keyword, so consider adding a case there.

## 7. Verify

```bash
npm run verify      # typecheck, unit tests, build (registry validation), dist audit
npm run preview     # then open /en/tools/pdf/rotate-pdf/ and /es/herramientas/pdf/rotar-pdf/
npm run qa:fixtures # optional sample files under /__qa/ for manual testing
```

Checklist before shipping:

- [ ] Works on a real phone (iOS Safari and Android Chrome), including large files near the limit
- [ ] Error states tested (damaged file, protected file, cancelled run)
- [ ] Both locales read naturally and have unique SEO title/description
- [ ] No large library in the initial page JS (check `dist/_astro` chunk sizes)
- [ ] The privacy claim is true

## New category?

Add an entry to `src/data/categories.ts` (id, icon, order, hue, localized name/slug/description/SEO/keywords). The category page, nav, footer, directory group and sitemap entries appear automatically. If you use a new hue, add its `data-hue` CSS mapping where hues are used (ToolCard, CategoryCard, CategoryView, MobileNav, search results). There are only four places, all with `data-hue` selectors.

## Server tools (future)

1. `executionMode: 'server'` (or `hybrid`) in meta. The badge and facts update automatically; add the specifics to `limitations`.
2. **Update the Privacy Policy before launch** (`src/content/pages/*/privacy.md`): what is uploaded, where, retention, deletion.
3. Implement `run.ts` with `fetch` to a Worker endpoint. Upload to R2 via presigned URL, process, and delete with an R2 lifecycle rule. Never log file names.
4. Add `connect-src` for the API origin in `astro.config.mjs` (CSP).
