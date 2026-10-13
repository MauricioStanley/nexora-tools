import { PDFDocument, degrees } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { makePdf, toArrayBuffer } from '../../../tests/fixtures';
import { rotatePdf } from './logic';

async function rotations(bytes: Uint8Array): Promise<number[]> {
  return (await PDFDocument.load(bytes)).getPages().map((p) => p.getRotation().angle);
}

describe('rotatePdf', () => {
  it('rotates every page by default', async () => {
    const result = await rotatePdf({ file: toArrayBuffer(await makePdf(3)), angle: 90 });
    expect(result).toMatchObject({ rotatedPages: 3, totalPages: 3 });
    expect(await rotations(result.bytes)).toEqual([90, 90, 90]);
  });

  it('only rotates the selected pages', async () => {
    const result = await rotatePdf({ file: toArrayBuffer(await makePdf(5)), angle: 180, ranges: [{ start: 2, end: 3 }, { start: 5, end: 5 }] });
    expect(result.rotatedPages).toBe(3);
    expect(await rotations(result.bytes)).toEqual([0, 180, 180, 0, 180]);
  });

  it('adds to the existing rotation and wraps around', async () => {
    const source = await PDFDocument.load(await makePdf(2));
    source.getPage(0).setRotation(degrees(270));
    source.getPage(1).setRotation(degrees(90));
    const result = await rotatePdf({ file: toArrayBuffer(await source.save()), angle: 90 });
    expect(await rotations(result.bytes)).toEqual([0, 180]);
  });

  it('counts each page once even if ranges overlap', async () => {
    const result = await rotatePdf({ file: toArrayBuffer(await makePdf(4)), angle: 270, ranges: [{ start: 1, end: 3 }, { start: 2, end: 2 }] });
    expect(result.rotatedPages).toBe(3);
    expect(await rotations(result.bytes)).toEqual([270, 270, 270, 0]);
  });
});
