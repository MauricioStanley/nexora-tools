import { describe, expect, it } from 'vitest';
import { buildEmail, buildPhone, buildQrPayload, buildWifi, EMPTY_FIELDS, escapeWifi, normalizeUrl } from './payload';
import { contrastRatio, encodeQr, isInverted, qrPath, qrSvgDocument, safeColor } from './render';

describe('QR payloads', () => {
  it('normalizes URLs and adds https when missing', () => {
    expect(normalizeUrl('codywork.com')).toEqual({ ok: true, value: 'https://codywork.com' });
    expect(normalizeUrl(' https://tools.codywork.com/en/ ')).toEqual({ ok: true, value: 'https://tools.codywork.com/en/' });
    expect(normalizeUrl('not a url')).toEqual({ ok: false, error: 'invalid_url' });
    expect(normalizeUrl('localhost:4321')).toMatchObject({ ok: true });
  });

  it('blocks dangerous URL schemes', () => {
    expect(normalizeUrl('javascript:alert(1)')).toEqual({ ok: false, error: 'unsafe_url' });
    expect(normalizeUrl('data:text/html,hi')).toEqual({ ok: false, error: 'unsafe_url' });
  });

  it('builds Wi-Fi payloads with escaping', () => {
    expect(escapeWifi('a;b,c:d"e\\f')).toBe('a\\;b\\,c\\:d\\"e\\\\f');
    expect(buildWifi('Home', 'p@ss;1', 'WPA', false)).toEqual({ ok: true, value: 'WIFI:T:WPA;S:Home;P:p@ss\\;1;;' });
    expect(buildWifi('Cafe', 'ignored', 'nopass', true)).toEqual({ ok: true, value: 'WIFI:T:nopass;S:Cafe;H:true;;' });
    expect(buildWifi('  ', 'x', 'WPA', false)).toEqual({ ok: false, error: 'empty' });
  });

  it('builds mailto and tel payloads', () => {
    expect(buildEmail('hi@codywork.com', 'Hello there', '')).toEqual({ ok: true, value: 'mailto:hi@codywork.com?subject=Hello%20there' });
    expect(buildEmail('nope', '', '')).toEqual({ ok: false, error: 'invalid_email' });
    expect(buildPhone('+1 (555) 123-4567')).toEqual({ ok: true, value: 'tel:+15551234567' });
    expect(buildPhone('call me')).toEqual({ ok: false, error: 'invalid_phone' });
  });

  it('reports empty content per type', () => {
    expect(buildQrPayload('text', EMPTY_FIELDS)).toEqual({ ok: false, error: 'empty' });
    expect(buildQrPayload('text', { ...EMPTY_FIELDS, text: 'Hola, ¿qué tal? ñ' })).toEqual({ ok: true, value: 'Hola, ¿qué tal? ñ' });
  });
});

describe('QR rendering', () => {
  it('encodes text (including UTF-8) into a square matrix', () => {
    const result = encodeQr('https://tools.codywork.com/es/ ñandú', 'M');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.matrix.modules).toHaveLength(result.matrix.size);
    expect(result.matrix.size).toBeGreaterThanOrEqual(21);
  });

  it('reports content that is too long', () => {
    expect(encodeQr('x'.repeat(5000), 'H')).toEqual({ ok: false, error: 'too_long' });
  });

  it('merges horizontal runs into compact paths', () => {
    expect(qrPath([[true, true, false, true]], 1)).toBe('M1 1h2v1h-2zM4 1h1v1h-1z');
  });

  it('produces a valid SVG and never injects unsafe colors', () => {
    const result = encodeQr('hello', 'L');
    if (!result.ok) throw new Error('encode failed');
    const svg = qrSvgDocument(result.matrix, { margin: 4, foreground: '"/><script>', background: '#FFFFFF', size: 512 });
    expect(svg).toContain('fill="#000000"');
    expect(svg).toContain('fill="#ffffff"');
    expect(svg).not.toContain('<script');
    expect(safeColor('#12ab9F', '#000000')).toBe('#12ab9f');
  });

  it('checks contrast and inversion', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21);
    expect(contrastRatio('#777777', '#888888')).toBeLessThan(2);
    expect(isInverted('#ffffff', '#000000')).toBe(true);
    expect(isInverted('#000000', '#ffffff')).toBe(false);
  });
});
