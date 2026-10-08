import { useCallback } from 'react';
import { inspectPdfFiles } from '@/lib/pdf/inspect';
import type { FileSelection, SelectedFile } from './useFileSelection';

/**
 * Reads page count and protection status of newly added PDFs in a worker, so problems
 * (e.g. password protection) are flagged before the user presses the action button.
 */
export function usePdfInspection(selection: FileSelection) {
  const { updateInfo } = selection;
  return useCallback(
    async (added: SelectedFile[]) => {
      const pdfs = added.filter((f) => f.type === 'pdf');
      if (pdfs.length === 0) return;
      pdfs.forEach((f) => updateInfo(f.id, { inspecting: true }));
      try {
        const results = await inspectPdfFiles(pdfs.map((f) => f.file));
        results.forEach((r, i) => updateInfo(pdfs[i]!.id, { inspecting: false, pages: r.pageCount, problem: r.problem }));
      } catch {
        // Inspection is best-effort; processing will surface real errors.
        pdfs.forEach((f) => updateInfo(f.id, { inspecting: false }));
      }
    },
    [updateInfo],
  );
}
