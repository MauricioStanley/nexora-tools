import { useCallback, useRef, useState } from 'react';
import { sizeBucket, track } from '@/lib/analytics';
import type { FailureCode } from '@/lib/errors';
import type { InputFileTypeId } from '@/lib/files/types';
import { validateFiles, type Rejection } from '@/lib/files/validate';
import type { IslandInputSpec } from './types';

export interface FileInfo {
  pages?: number | null;
  problem?: FailureCode | null;
  width?: number;
  height?: number;
  animated?: boolean;
  /** Inspection state (e.g. reading PDF page count). */
  inspecting?: boolean;
}

export interface SelectedFile {
  id: string;
  file: File;
  /** Sanitized display name. */
  name: string;
  size: number;
  type: InputFileTypeId;
  info: FileInfo;
}

let counter = 0;
const nextId = () => `f${Date.now().toString(36)}${(counter += 1)}`;

/**
 * Selected-file state with validation (type by signature, size, count, total size).
 * Single-file tools replace the current file; multi-file tools append.
 */
export function useFileSelection(spec: IslandInputSpec, toolId: string) {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [rejections, setRejections] = useState<Rejection[]>([]);
  const [validating, setValidating] = useState(false);
  const filesRef = useRef<SelectedFile[]>([]);

  const commit = useCallback((next: SelectedFile[]) => {
    filesRef.current = next;
    setFiles(next);
  }, []);

  const add = useCallback(
    async (incoming: File[]): Promise<SelectedFile[]> => {
      if (incoming.length === 0) return [];
      setValidating(true);
      try {
        const base = spec.multiple ? filesRef.current : [];
        const { accepted, rejected } = await validateFiles(
          spec.multiple ? incoming : incoming.slice(0, 1),
          {
            accept: spec.accept,
            maxFileSizeMB: spec.effectiveMaxFileSizeMB,
            maxFiles: spec.effectiveMaxFiles,
            maxTotalSizeMB: spec.maxTotalSizeMB,
          },
          { count: base.length, totalBytes: base.reduce((sum, f) => sum + f.size, 0) },
        );
        if (!spec.multiple && incoming.length > 1) rejected.push({ name: '', reason: 'count' });
        const items: SelectedFile[] = accepted.map((a) => ({
          id: nextId(),
          file: a.file,
          name: a.name,
          size: a.file.size,
          type: a.type,
          info: {},
        }));
        if (items.length > 0) {
          commit(spec.multiple ? [...filesRef.current, ...items] : items);
          track('file_selected', {
            tool: toolId,
            files_count: items.length,
            size_bucket: sizeBucket(items.reduce((sum, f) => sum + f.size, 0)),
          });
        }
        setRejections(rejected);
        return items;
      } finally {
        setValidating(false);
      }
    },
    [commit, spec, toolId],
  );

  const remove = useCallback((id: string) => commit(filesRef.current.filter((f) => f.id !== id)), [commit]);

  const move = useCallback(
    (id: string, delta: -1 | 1) => {
      const list = [...filesRef.current];
      const index = list.findIndex((f) => f.id === id);
      const target = index + delta;
      if (index < 0 || target < 0 || target >= list.length) return;
      [list[index], list[target]] = [list[target]!, list[index]!];
      commit(list);
    },
    [commit],
  );

  const updateInfo = useCallback(
    (id: string, info: Partial<FileInfo>) => {
      commit(filesRef.current.map((f) => (f.id === id ? { ...f, info: { ...f.info, ...info } } : f)));
    },
    [commit],
  );

  const clear = useCallback(() => {
    commit([]);
    setRejections([]);
  }, [commit]);

  const dismissRejections = useCallback(() => setRejections([]), []);

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  return { files, rejections, validating, totalBytes, add, remove, move, updateInfo, clear, dismissRejections };
}

export type FileSelection = ReturnType<typeof useFileSelection>;
