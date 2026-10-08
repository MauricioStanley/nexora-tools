import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { LOCALES } from '@/config/site';
import { categories } from '@/data/categories';
import { allTools, getRelatedTools, listedTools, validateRegistry } from '@/tools/registry';

const toolsDir = path.resolve(__dirname, '../src/tools');

describe('tool registry', () => {
  it('registers the 10 V1 tools', () => {
    expect(listedTools.map((t) => t.id).sort()).toEqual(
      [
        'compress-image',
        'compress-pdf',
        'jpg-to-pdf',
        'merge-pdf',
        'pdf-to-jpg',
        'qr-code-generator',
        'resize-image',
        'split-pdf',
        'to-webp',
        'webp-to-jpg',
      ].sort(),
    );
  });

  it('passes integrity validation', () => {
    expect(validateRegistry()).toEqual([]);
  });

  it('every tool has an island and a UI component', () => {
    for (const tool of allTools) {
      expect(existsSync(path.join(toolsDir, tool.id, 'Island.astro')), `${tool.id}/Island.astro`).toBe(true);
      expect(existsSync(path.join(toolsDir, tool.id, 'Tool.tsx')), `${tool.id}/Tool.tsx`).toBe(true);
    }
  });

  it('every tool has content for every locale, with UI strings of the same shape', () => {
    for (const tool of allTools) {
      const reference = Object.keys(tool.content.en.ui).sort();
      for (const locale of LOCALES) {
        expect(tool.content[locale], `${tool.id}:${locale}`).toBeDefined();
        expect(Object.keys(tool.content[locale].ui).sort(), `${tool.id}:${locale} ui keys`).toEqual(reference);
      }
    }
  });

  it('only declares categories that exist', () => {
    const ids = new Set<string>(categories.map((c) => c.id));
    for (const tool of allTools) expect(ids.has(tool.category)).toBe(true);
  });

  it('related tools resolve and never include the tool itself', () => {
    for (const tool of listedTools) {
      const related = getRelatedTools(tool);
      expect(related.length).toBeGreaterThan(0);
      expect(related.some((r) => r.id === tool.id)).toBe(false);
    }
  });

  it('client tools never declare server-only formats or impossible limits', () => {
    for (const tool of listedTools) {
      expect(tool.executionMode).toBe('client');
      if (tool.input.kind === 'files') {
        expect(tool.input.maxFileSizeMB).toBeGreaterThan(0);
        expect(tool.input.maxFileSizeMB).toBeLessThanOrEqual(200);
      }
    }
  });

  it('detects registry problems', () => {
    const broken = { ...listedTools[0]!, id: 'Bad_ID', relatedToolIds: ['does-not-exist'] };
    const messages = validateRegistry([broken]).map((i) => i.message);
    expect(messages).toContain('id must be kebab-case');
    expect(messages).toContain('related tool "does-not-exist" does not exist');
  });
});
