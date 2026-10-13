import { describe, expect, it } from 'vitest';
import { characterSets, entropyBits, generatePassword, randomInt, strengthOf, type PasswordOptions } from './generate';

const all: PasswordOptions = { length: 16, lower: true, upper: true, digits: true, symbols: true, avoidAmbiguous: false };

describe('password generator', () => {
  it('creates passwords of the requested length with every selected kind of character', () => {
    for (let i = 0; i < 200; i++) {
      const password = generatePassword(all);
      expect(password).toHaveLength(16);
      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/\d/);
      expect(password).toMatch(/[^a-zA-Z\d]/);
    }
  });

  it('only uses the selected sets', () => {
    expect(generatePassword({ ...all, upper: false, symbols: false, length: 40 })).toMatch(/^[a-z\d]{40}$/);
    expect(generatePassword({ ...all, lower: false, upper: false, symbols: false, length: 12 })).toMatch(/^\d{12}$/);
  });

  it('can leave out look-alike characters', () => {
    const sets = characterSets({ ...all, avoidAmbiguous: true }).join('');
    for (const c of 'Il1O0o') expect(sets).not.toContain(c);
    expect(generatePassword({ ...all, avoidAmbiguous: true, length: 64 })).not.toMatch(/[Il1O0o]/);
  });

  it('returns nothing when no set is selected and clamps the length', () => {
    expect(generatePassword({ ...all, lower: false, upper: false, digits: false, symbols: false })).toBe('');
    expect(generatePassword({ ...all, length: 2 })).toHaveLength(6);
    expect(generatePassword({ ...all, length: 500 })).toHaveLength(64);
  });

  it('draws indices without modulo bias', () => {
    // The first value lands in the biased tail for max = 3 and must be rejected.
    const values = [0xffffffff, 7];
    const fill = (a: Uint32Array) => {
      a[0] = values.shift()!;
      return a;
    };
    expect(randomInt(3, fill)).toBe(1);
  });

  it('rates strength from entropy', () => {
    expect(entropyBits({ ...all, upper: false, digits: false, symbols: false, length: 8 })).toBe(37);
    expect(strengthOf(entropyBits({ ...all, upper: false, digits: false, symbols: false, length: 8 }))).toBe('weak');
    expect(strengthOf(entropyBits(all))).toBe('veryStrong');
    expect(strengthOf(entropyBits({ ...all, symbols: false, length: 12 }))).toBe('strong');
  });
});
