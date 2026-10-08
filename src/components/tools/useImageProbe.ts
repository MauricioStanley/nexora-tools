import { useCallback } from 'react';
import { probeImage } from '@/lib/image/pipeline';
import type { FileSelection, SelectedFile } from './useFileSelection';

/** Reads image dimensions (and WebP animation) from headers only — no pixel decoding. */
export function useImageProbe(selection: FileSelection) {
  const { updateInfo } = selection;
  return useCallback(
    async (added: SelectedFile[]) => {
      for (const item of added) {
        if (item.type === 'pdf') continue;
        try {
          const probe = await probeImage(item.file, item.type);
          if (probe) updateInfo(item.id, { width: probe.width, height: probe.height, animated: probe.animated });
        } catch {
          /* best-effort */
        }
      }
    },
    [updateInfo],
  );
}
