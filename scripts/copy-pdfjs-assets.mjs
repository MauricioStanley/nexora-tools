// Copies PDF.js runtime assets (CMaps, standard fonts, ICC profiles, WASM decoders) from
// node_modules into public/vendor/pdfjs so they are served from our own origin (CSP-safe,
// no third-party CDN, versions always match the installed library).
import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'node_modules', 'pdfjs-dist');
const target = path.join(root, 'public', 'vendor', 'pdfjs');
const folders = ['cmaps', 'standard_fonts', 'iccs', 'wasm'];

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

const { version } = JSON.parse(await readFile(path.join(source, 'package.json'), 'utf8'));
const stampFile = path.join(target, '.version');
if ((await exists(stampFile)) && (await readFile(stampFile, 'utf8')).trim() === version) {
  console.log(`[pdfjs-assets] up to date (pdfjs-dist ${version})`);
  process.exit(0);
}

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
for (const folder of folders) {
  const from = path.join(source, folder);
  if (await exists(from)) {
    await cp(from, path.join(target, folder), { recursive: true });
  } else {
    console.warn(`[pdfjs-assets] ${folder} not found in pdfjs-dist ${version} (skipped)`);
  }
}
await writeFile(stampFile, version);
console.log(`[pdfjs-assets] copied ${folders.join(', ')} from pdfjs-dist ${version}`);
