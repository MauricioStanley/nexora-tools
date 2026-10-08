/**
 * Compress PDF — structural optimization + JPEG image recompression (no rasterization).
 *
 * What it does, honestly:
 *  1. Re-encodes embedded JPEG (DCTDecode) images in RGB/Gray at a lower quality, and
 *     downsamples images larger than the level's max dimension. Text/vectors are untouched.
 *  2. Flate-compresses any uncompressed streams.
 *  3. Removes unreachable objects (leftovers of incremental saves) and optionally metadata.
 *  4. Saves with object streams (compressed cross-references).
 * The image codec is injected (`ImageRecoder`) so this module has no DOM dependency and
 * runs in a worker, on the main thread, or in Node tests.
 */
import { zlibSync } from 'fflate';
import { loadPdfDocument } from '@/lib/pdf/load';
import { PDFArray, PDFBool, PDFDict, PDFName, PDFNumber, PDFObject, PDFRawStream, PDFRef, PDFStream, type PDFContext } from '@/lib/pdf/pdf-lib';
import { LEVELS, type CompressLevel } from './levels';

export { LEVELS, type CompressLevel };

export interface RecodedImage {
  bytes: Uint8Array;
  width: number;
  height: number;
}

export interface ImageRecoder {
  /** Re-encode JPEG bytes. Return null if the image can't be decoded (it is then kept as is). */
  recodeJpeg(bytes: Uint8Array, options: { quality: number; maxDimension: number }): Promise<RecodedImage | null>;
}

export interface OptimizeOptions {
  level: CompressLevel;
  removeMetadata: boolean;
}

export interface OptimizePayload extends OptimizeOptions {
  file: ArrayBuffer;
}

export interface OptimizeResult {
  bytes: Uint8Array;
  imagesFound: number;
  imagesOptimized: number;
}

/** Images smaller than this aren't worth re-encoding. */
const MIN_IMAGE_BYTES = 16 * 1024;
/** Only replace an image when the new stream is at least this much smaller. */
const MIN_GAIN = 0.9;

const N = {
  Subtype: PDFName.of('Subtype'),
  Image: PDFName.of('Image'),
  Filter: PDFName.of('Filter'),
  DCTDecode: PDFName.of('DCTDecode'),
  FlateDecode: PDFName.of('FlateDecode'),
  DecodeParms: PDFName.of('DecodeParms'),
  Decode: PDFName.of('Decode'),
  ImageMask: PDFName.of('ImageMask'),
  Mask: PDFName.of('Mask'),
  SMask: PDFName.of('SMask'),
  Matte: PDFName.of('Matte'),
  BitsPerComponent: PDFName.of('BitsPerComponent'),
  ColorSpace: PDFName.of('ColorSpace'),
  DeviceRGB: PDFName.of('DeviceRGB'),
  DeviceGray: PDFName.of('DeviceGray'),
  CalRGB: PDFName.of('CalRGB'),
  CalGray: PDFName.of('CalGray'),
  ICCBased: PDFName.of('ICCBased'),
  N: PDFName.of('N'),
  Width: PDFName.of('Width'),
  Height: PDFName.of('Height'),
  Length: PDFName.of('Length'),
  Type: PDFName.of('Type'),
  XRef: PDFName.of('XRef'),
  ObjStm: PDFName.of('ObjStm'),
  Metadata: PDFName.of('Metadata'),
};

function components(colorSpace: PDFObject | undefined): number | null {
  if (colorSpace === N.DeviceRGB || colorSpace === N.CalRGB) return 3;
  if (colorSpace === N.DeviceGray || colorSpace === N.CalGray) return 1;
  if (colorSpace instanceof PDFArray && colorSpace.size() >= 1) {
    const kind = colorSpace.lookup(0);
    if (kind === N.CalRGB) return 3;
    if (kind === N.CalGray) return 1;
    if (kind === N.ICCBased) {
      const profile = colorSpace.lookup(1);
      const n = profile instanceof PDFStream ? profile.dict.lookup(N.N) : undefined;
      return n instanceof PDFNumber ? n.asNumber() : null;
    }
  }
  return null;
}

function isDct(filter: PDFObject | undefined): boolean {
  if (filter === N.DCTDecode) return true;
  return filter instanceof PDFArray && filter.size() === 1 && filter.lookup(0) === N.DCTDecode;
}

/** A plain JPEG image we can safely re-encode without changing how it renders. */
export function isRecompressibleJpeg(dict: PDFDict): boolean {
  if (dict.lookup(N.Subtype) !== N.Image) return false;
  if (!isDct(dict.lookup(N.Filter))) return false;
  if (dict.has(N.Decode)) return false; // inverted/remapped samples
  if (dict.lookup(N.ImageMask) === PDFBool.True) return false;
  if (dict.lookup(N.Mask) instanceof PDFArray) return false; // color-key masking breaks with lossy data
  const bpc = dict.lookup(N.BitsPerComponent);
  if (bpc instanceof PDFNumber && bpc.asNumber() !== 8) return false;
  const smask = dict.lookup(N.SMask);
  if (smask instanceof PDFStream && smask.dict.has(N.Matte)) return false; // pre-multiplied: dimensions must match
  const n = components(dict.lookup(N.ColorSpace));
  return n === 1 || n === 3;
}

/** Delete indirect objects that can't be reached from the trailer (dead weight). */
export function removeUnreachableObjects(context: PDFContext): number {
  const reachable = new Set<string>();
  const stack: PDFObject[] = [];
  const { Root, Info, Encrypt } = context.trailerInfo;
  for (const entry of [Root, Info, Encrypt]) if (entry) stack.push(entry);

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current instanceof PDFRef) {
      if (reachable.has(current.tag)) continue;
      reachable.add(current.tag);
      const target = context.lookup(current);
      if (target) stack.push(target);
    } else if (current instanceof PDFDict) {
      stack.push(...current.values());
    } else if (current instanceof PDFArray) {
      stack.push(...current.asArray());
    } else if (current instanceof PDFStream) {
      stack.push(current.dict);
    }
  }

  let removed = 0;
  for (const [ref] of context.enumerateIndirectObjects()) {
    if (!reachable.has(ref.tag)) {
      context.delete(ref);
      removed += 1;
    }
  }
  return removed;
}

function stripMetadata(context: PDFContext): void {
  const info = context.trailerInfo.Info;
  const infoDict = info instanceof PDFRef ? context.lookup(info) : info;
  if (infoDict instanceof PDFDict) {
    for (const key of infoDict.keys()) infoDict.delete(key);
  }
  const root = context.trailerInfo.Root;
  const catalog = root instanceof PDFRef ? context.lookup(root) : root;
  if (catalog instanceof PDFDict && catalog.has(N.Metadata)) {
    const metadata = catalog.get(N.Metadata);
    catalog.delete(N.Metadata);
    if (metadata instanceof PDFRef) context.delete(metadata);
  }
}

/** Compress streams that were stored without any filter (e.g. raw content streams). */
function deflateRawStreams(context: PDFContext): void {
  for (const [ref, object] of context.enumerateIndirectObjects()) {
    if (!(object instanceof PDFRawStream)) continue;
    const dict = object.dict;
    if (dict.has(N.Filter) || object.contents.length < 1024) continue;
    const type = dict.lookup(N.Type);
    if (type === N.XRef || type === N.ObjStm) continue;
    const compressed = zlibSync(object.contents, { level: 6 });
    if (compressed.length >= object.contents.length * MIN_GAIN) continue;
    const next = dict.clone(context);
    next.set(N.Filter, N.FlateDecode);
    next.set(N.Length, PDFNumber.of(compressed.length));
    context.assign(ref, PDFRawStream.of(next, compressed));
  }
}

export async function optimizePdf(
  payload: OptimizePayload,
  recoder: ImageRecoder,
  onProgress?: (value: number, stage: 'images' | 'structure', current?: number, total?: number) => void,
): Promise<OptimizeResult> {
  const doc = await loadPdfDocument(new Uint8Array(payload.file));
  const context = doc.context;
  const settings = LEVELS[payload.level];

  // Drop dead objects first so we never spend time re-encoding unused images.
  removeUnreachableObjects(context);

  const candidates = context
    .enumerateIndirectObjects()
    .filter(
      (entry): entry is [PDFRef, PDFRawStream] =>
        entry[1] instanceof PDFRawStream && entry[1].dict.lookup(N.Subtype) === N.Image,
    );
  const jpegs = candidates.filter(([, stream]) => isRecompressibleJpeg(stream.dict) && stream.contents.length >= MIN_IMAGE_BYTES);

  let optimized = 0;
  for (let i = 0; i < jpegs.length; i++) {
    const [ref, stream] = jpegs[i]!;
    onProgress?.(0.05 + (i / Math.max(1, jpegs.length)) * 0.8, 'images', i + 1, jpegs.length);
    const recoded = await recoder.recodeJpeg(stream.contents, settings);
    if (!recoded || recoded.bytes.length >= stream.contents.length * MIN_GAIN) continue;

    const dict = stream.dict.clone(context);
    dict.set(N.Width, PDFNumber.of(recoded.width));
    dict.set(N.Height, PDFNumber.of(recoded.height));
    dict.set(N.BitsPerComponent, PDFNumber.of(8));
    dict.set(N.Filter, N.DCTDecode);
    dict.delete(N.DecodeParms);
    // Canvas encoders always produce 3-channel JPEGs.
    if (components(dict.lookup(N.ColorSpace)) !== 3) dict.set(N.ColorSpace, N.DeviceRGB);
    dict.set(N.Length, PDFNumber.of(recoded.bytes.length));
    context.assign(ref, PDFRawStream.of(dict, recoded.bytes));
    optimized += 1;
  }

  onProgress?.(0.88, 'structure');
  deflateRawStreams(context);
  if (payload.removeMetadata) stripMetadata(context);
  removeUnreachableObjects(context);

  const bytes = await doc.save({ useObjectStreams: true, addDefaultPage: false, updateFieldAppearances: false });
  onProgress?.(1, 'structure');
  return { bytes, imagesFound: candidates.length, imagesOptimized: optimized };
}
