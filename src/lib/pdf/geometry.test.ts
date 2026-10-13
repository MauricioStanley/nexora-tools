import { PDFDocument, StandardFonts } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import {
  anchoredTextOrigin,
  centeredTextOrigin,
  displaySize,
  normalizeRotation,
  toUserAngle,
  toUserSpace,
} from './geometry';
import { unsupportedChars } from './winansi';

const box = { x: 10, y: 20, width: 600, height: 800 };

describe('page geometry', () => {
  it('normalizes rotation to quarter turns', () => {
    expect([0, 90, 180, 270, 360, -90, 450].map(normalizeRotation)).toEqual([0, 90, 180, 270, 0, 270, 90]);
  });

  it('swaps the visible size for quarter-turned pages', () => {
    expect(displaySize(box, 0)).toEqual({ width: 600, height: 800 });
    expect(displaySize(box, 90)).toEqual({ width: 800, height: 600 });
  });

  it('maps the visual bottom-left corner to the right user-space corner', () => {
    const origin = { x: 0, y: 0 };
    expect(toUserSpace(box, 0, origin)).toEqual({ x: 10, y: 20 });
    // A page shown rotated 90° clockwise displays its user-space bottom-right corner at the visual bottom-left.
    expect(toUserSpace(box, 90, origin)).toEqual({ x: 610, y: 20 });
    expect(toUserSpace(box, 180, origin)).toEqual({ x: 610, y: 820 });
    expect(toUserSpace(box, 270, origin)).toEqual({ x: 10, y: 820 });
  });

  it('keeps the page center fixed for every rotation', () => {
    for (const r of [0, 90, 180, 270] as const) {
      const size = displaySize(box, r);
      expect(toUserSpace(box, r, { x: size.width / 2, y: size.height / 2 })).toEqual({ x: 310, y: 420 });
    }
  });

  it('turns display angles into user-space angles', () => {
    expect(toUserAngle(0, 45)).toBe(45);
    expect(toUserAngle(90, 0)).toBe(90);
    expect(toUserAngle(270, 180)).toBe(90);
  });

  it('centers text boxes around a point', () => {
    expect(centeredTextOrigin({ x: 100, y: 100 }, 40, 10, 0)).toEqual({ x: 80, y: 95 });
    const rotated = centeredTextOrigin({ x: 100, y: 100 }, 40, 10, 90);
    expect(rotated.x).toBeCloseTo(105);
    expect(rotated.y).toBeCloseTo(80);
  });

  it('anchors labels to edges and corners', () => {
    const page = { width: 600, height: 800 };
    expect(anchoredTextOrigin(page, 'bottom-center', 100, 10, 30)).toEqual({ x: 250, y: 30 });
    expect(anchoredTextOrigin(page, 'top-right', 100, 10, 30)).toEqual({ x: 470, y: 760 });
    expect(anchoredTextOrigin(page, 'bottom-left', 100, 10, 30)).toEqual({ x: 30, y: 30 });
  });
});

describe('WinAnsi check', () => {
  it('accepts Spanish and Western European text and rejects the rest', () => {
    expect(unsupportedChars('Confidencial · Página ñ € “ok” — ¿sí?')).toEqual([]);
    expect(unsupportedChars('Draft 😀 草稿 😀')).toEqual(['😀', '草', '稿']);
  });

  it('agrees with what pdf-lib can actually encode', async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const sample = 'ÁÉÍÓÚáéíóúÑñÜü¿¡€…–—“”‘’•™ŒœŠšŽžŸ';
    expect(unsupportedChars(sample)).toEqual([]);
    expect(() => font.encodeText(sample)).not.toThrow();
    expect(() => font.encodeText('Ж')).toThrow();
    expect(unsupportedChars('Ж')).toEqual(['Ж']);
  });
});
