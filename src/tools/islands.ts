/**
 * Tool UI loader. Each tool folder provides `Island.astro`, which statically imports its
 * React component with a `client:*` directive (Astro needs a static import to hydrate).
 * The tool page resolves the island by id, so the page template never changes when tools
 * are added. Each island is its own client chunk — pages only load their own tool.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AstroComponent = any;

const islands = import.meta.glob<{ default: AstroComponent }>('./*/Island.astro');

export function hasToolIsland(toolId: string): boolean {
  return `./${toolId}/Island.astro` in islands;
}

export async function loadToolIsland(toolId: string): Promise<AstroComponent> {
  const loader = islands[`./${toolId}/Island.astro`];
  if (!loader) throw new Error(`[tools] "${toolId}" has no Island.astro`);
  return (await loader()).default;
}
