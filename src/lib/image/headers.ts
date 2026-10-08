/**
 * Minimal, allocation-free parsers for image headers. They let us check dimensions and
 * orientation *before* decoding (decoding a 400-megapixel image can crash a mobile tab).
 */
import type { InputFileTypeId } from '@/lib/files/types';

export interface JpegInfo {
  width: number;
  height: number;
  /** EXIF orientation 1–8 (1 = upright). */
  orientation: number;
  components: number;
}

const u16be = (b: Uint8Array, o: number) => ((b[o]! << 8) | b[o + 1]!) >>> 0;
const u16le = (b: Uint8Array, o: number) => (b[o]! | (b[o + 1]! << 8)) >>> 0;
const u24le = (b: Uint8Array, o: number) => (b[o]! | (b[o + 1]! << 8) | (b[o + 2]! << 16)) >>> 0;
const u32be = (b: Uint8Array, o: number) => ((b[o]! << 24) | (b[o + 1]! << 16) | (b[o + 2]! << 8) | b[o + 3]!) >>> 0;
const u32le = (b: Uint8Array, o: number) => (b[o]! | (b[o + 1]! << 8) | (b[o + 2]! << 16) | (b[o + 3]! << 24)) >>> 0;

function isSofMarker(marker: number): boolean {
  return marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
}

function readExifOrientation(b: Uint8Array, tiff: number, end: number): number | null {
  if (tiff + 8 > end) return null;
  const little = b[tiff] === 0x49 && b[tiff + 1] === 0x49;
  const big = b[tiff] === 0x4d && b[tiff + 1] === 0x4d;
  if (!little && !big) return null;
  const r16 = (o: number) => (little ? u16le(b, o) : u16be(b, o));
  const r32 = (o: number) => (little ? u32le(b, o) : u32be(b, o));
  if (r16(tiff + 2) !== 42) return null;
  const ifd = tiff + r32(tiff + 4);
  if (ifd + 2 > end) return null;
  const count = r16(ifd);
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12;
    if (entry + 12 > end) break;
    if (r16(entry) === 0x0112) {
      const value = r16(entry + 8);
      return value >= 1 && value <= 8 ? value : null;
    }
  }
  return null;
}

/** Parse SOF dimensions and EXIF orientation from the first bytes of a JPEG. */
export function readJpegInfo(b: Uint8Array): JpegInfo | null {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let offset = 2;
  let orientation = 1;
  while (offset + 4 <= b.length) {
    if (b[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = b[offset + 1]!;
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    offset += 2;
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (marker === 0xd9 || marker === 0xda) break;
    const length = u16be(b, offset);
    if (length < 2) break;
    const start = offset + 2;
    const end = Math.min(b.length, offset + length);
    if (marker === 0xe1 && end - start > 6 && String.fromCharCode(b[start]!, b[start + 1]!, b[start + 2]!, b[start + 3]!) === 'Exif') {
      orientation = readExifOrientation(b, start + 6, end) ?? orientation;
    }
    if (isSofMarker(marker) && start + 6 <= b.length) {
      return {
        height: u16be(b, start + 1),
        width: u16be(b, start + 3),
        components: b[start + 5]!,
        orientation,
      };
    }
    offset += length;
  }
  return null;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

/** Dimensions from PNG IHDR. */
export function readPngDimensions(b: Uint8Array): ImageDimensions | null {
  if (b.length < 24 || b[12] !== 0x49 || b[13] !== 0x48 || b[14] !== 0x44 || b[15] !== 0x52) return null;
  return { width: u32be(b, 16), height: u32be(b, 20) };
}

export interface WebpInfo extends ImageDimensions {
  animated: boolean;
  alpha: boolean;
}

/** Dimensions and flags from a WebP RIFF header (VP8, VP8L and VP8X chunks). */
export function readWebpInfo(b: Uint8Array): WebpInfo | null {
  if (b.length < 30) return null;
  const chunk = String.fromCharCode(b[12]!, b[13]!, b[14]!, b[15]!);
  if (chunk === 'VP8X') {
    const flags = b[20]!;
    return { width: 1 + u24le(b, 24), height: 1 + u24le(b, 27), animated: (flags & 0x02) !== 0, alpha: (flags & 0x10) !== 0 };
  }
  if (chunk === 'VP8L') {
    const b0 = b[21]!;
    const b1 = b[22]!;
    const b2 = b[23]!;
    const b3 = b[24]!;
    return {
      width: 1 + (((b1 & 0x3f) << 8) | b0),
      height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
      animated: false,
      alpha: true,
    };
  }
  if (chunk === 'VP8 ') {
    return { width: u16le(b, 26) & 0x3fff, height: u16le(b, 28) & 0x3fff, animated: false, alpha: false };
  }
  return null;
}

export function readImageDimensions(b: Uint8Array, type: InputFileTypeId): ImageDimensions | null {
  if (type === 'jpeg') return readJpegInfo(b);
  if (type === 'png') return readPngDimensions(b);
  if (type === 'webp') return readWebpInfo(b);
  return null;
}

/**
 * Remove privacy-sensitive metadata from a JPEG *without re-encoding* (lossless):
 * drops EXIF/XMP (APP1, incl. GPS), IPTC/Photoshop (APP13), comments and vendor segments.
 * Keeps JFIF (APP0), ICC color profiles (APP2 "ICC_PROFILE") and Adobe (APP14, needed
 * for correct CMYK/YCCK colors). Returns the input unchanged if the structure is unexpected.
 */
export function stripJpegMetadata(b: Uint8Array): Uint8Array {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return b;
  const parts: Uint8Array[] = [b.subarray(0, 2)];
  let offset = 2;
  let removed = false;
  while (offset < b.length) {
    if (b[offset] !== 0xff || offset + 1 >= b.length) return b;
    const marker = b[offset + 1]!;
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (marker === 0xda || marker === 0xd9) {
      parts.push(b.subarray(offset));
      break;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      parts.push(b.subarray(offset, offset + 2));
      offset += 2;
      continue;
    }
    if (offset + 4 > b.length) return b;
    const segmentEnd = offset + 2 + u16be(b, offset + 2);
    if (segmentEnd > b.length) return b;
    let keep = true;
    if (marker === 0xfe || marker === 0xe1 || marker === 0xed) keep = false;
    else if (marker === 0xe2) {
      const id = String.fromCharCode(...b.subarray(offset + 4, Math.min(offset + 15, segmentEnd)));
      keep = id.startsWith('ICC_PROFILE');
    } else if (marker >= 0xe3 && marker <= 0xef && marker !== 0xee) keep = false;
    if (keep) parts.push(b.subarray(offset, segmentEnd));
    else removed = true;
    offset = segmentEnd;
  }
  if (!removed) return b;
  const total = parts.reduce((sum, p) => sum + p.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const part of parts) {
    out.set(part, pos);
    pos += part.length;
  }
  return out;
}
