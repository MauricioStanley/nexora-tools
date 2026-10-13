/**
 * Password generation with the browser's cryptographic random source.
 * Indices are drawn by rejection sampling, so every character is equally likely (no modulo bias).
 */
export interface PasswordOptions {
  length: number;
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
  /** Leave out characters that are easy to confuse: I l 1 O 0 o. */
  avoidAmbiguous: boolean;
}

export type CharacterSet = 'lower' | 'upper' | 'digits' | 'symbols';
export type Strength = 'weak' | 'fair' | 'strong' | 'veryStrong';
/** Fills `array` with random values in place. */
export type RandomFill = (array: Uint32Array<ArrayBuffer>) => unknown;

export const PASSWORD_LENGTH = { min: 6, max: 64 } as const;

const SETS: Record<CharacterSet, string> = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/',
};
const AMBIGUOUS = /[Il1O0o]/g;

const cryptoFill: RandomFill = (array) => crypto.getRandomValues(array);

/** Uniform integer in [0, max). */
export function randomInt(max: number, fill: RandomFill = cryptoFill): number {
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  const buffer = new Uint32Array(1);
  for (;;) {
    fill(buffer);
    if (buffer[0]! < limit) return buffer[0]! % max;
  }
}

export function characterSets(options: PasswordOptions): string[] {
  return (Object.keys(SETS) as CharacterSet[])
    .filter((key) => options[key])
    .map((key) => (options.avoidAmbiguous ? SETS[key].replace(AMBIGUOUS, '') : SETS[key]));
}

/** At least one character from every selected set, the rest from all of them, then shuffled. */
export function generatePassword(options: PasswordOptions, fill: RandomFill = cryptoFill): string {
  const sets = characterSets(options);
  if (sets.length === 0) return '';
  const length = Math.min(PASSWORD_LENGTH.max, Math.max(PASSWORD_LENGTH.min, sets.length, Math.floor(options.length)));
  const pool = sets.join('');
  const chars = sets.map((set) => set[randomInt(set.length, fill)]!);
  while (chars.length < length) chars.push(pool[randomInt(pool.length, fill)]!);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1, fill);
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }
  return chars.join('');
}

export function entropyBits(options: PasswordOptions): number {
  const pool = characterSets(options).join('').length;
  return pool > 1 ? Math.floor(options.length * Math.log2(pool)) : 0;
}

export function strengthOf(bits: number): Strength {
  if (bits < 45) return 'weak';
  if (bits < 65) return 'fair';
  if (bits < 90) return 'strong';
  return 'veryStrong';
}
