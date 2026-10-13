/** Label for every page, or null for pages left unnumbered. `{n}` is the number, `{total}` the last number. */
export function planLabels(pageCount: number, template: string, start: number, skipFirst: boolean): (string | null)[] {
  const first = skipFirst ? 1 : 0;
  const last = start + Math.max(0, pageCount - first) - 1;
  return Array.from({ length: pageCount }, (_, i) =>
    i < first ? null : template.replaceAll('{n}', String(start + i - first)).replaceAll('{total}', String(last)),
  );
}
