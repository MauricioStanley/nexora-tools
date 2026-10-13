import type { ToolContent } from '../../types';

const ui = {
  passwordLabel: 'Generated password',
  copy: 'Copy password',
  copied: 'Copied',
  copyFailed: 'Your browser blocked copying. Select the password and copy it manually.',
  regenerate: 'New password',
  options: 'Options',
  length: 'Length',
  characters: '{count} characters',
  sets: {
    upper: 'Uppercase letters (A–Z)',
    lower: 'Lowercase letters (a–z)',
    digits: 'Numbers (0–9)',
    symbols: 'Symbols (!@#$…)',
  },
  avoidAmbiguous: 'Avoid look-alike characters',
  avoidAmbiguousHint: 'Leaves out I, l, 1, O, 0 and o, which are easy to confuse when typing.',
  strength: { weak: 'Weak', fair: 'Fair', strong: 'Strong', veryStrong: 'Very strong' },
  entropy: 'about {bits} bits of entropy',
  privacyNote: 'Passwords are created on your device and are never sent, stored or logged.',
};

export type PasswordGeneratorUi = typeof ui;

const content: ToolContent<PasswordGeneratorUi> = {
  name: 'Password Generator',
  tagline: 'Create strong, random passwords on your device, never sent anywhere.',
  description:
    'Generate strong, random passwords with the length and characters you need. They are created with your browser’s secure random generator and never leave your device.',
  seo: {
    title: 'Password Generator – Strong, Random and Private',
    description:
      'Generate strong random passwords for free. Choose length, letters, numbers and symbols, and copy in one click. Created on your device, never sent or stored.',
  },
  keywords: ['password generator', 'random password generator', 'strong password generator', 'generate password', 'secure password', 'create password'],
  aliases: ['random password', 'password maker', 'password creator', 'safe password generator', 'make a strong password', 'generate secure password'],
  howTo: [
    { title: 'Choose the length', text: 'Use the slider to pick how many characters you need. 16 or more is a good default.' },
    { title: 'Pick the characters', text: 'Include uppercase and lowercase letters, numbers and symbols, and avoid look-alike characters if you’ll type it by hand.' },
    { title: 'Copy it', text: 'Copy the password and save it in your password manager. Press “New password” for another one.' },
  ],
  about: [
    'Password Generator creates random passwords using the cryptographic random number generator built into your browser, the same kind of source used for encryption keys.',
    'Every selected type of character appears at least once, and each character is drawn with equal probability. The strength meter estimates entropy: the higher it is, the longer a password would take to guess.',
  ],
  limitations: [
    'A strong password doesn’t help if it’s reused. Use a different one for every account and keep them in a password manager.',
    'Some sites restrict which symbols you can use. If one is rejected, turn symbols off and increase the length.',
    'Lengths from 6 to 64 characters.',
  ],
  faq: [
    {
      question: 'Is it safe to generate a password online?',
      answer: 'Here, yes: the password is created in your browser on your device and is never sent over the internet, stored or logged.',
    },
    {
      question: 'How long should my password be?',
      answer: 'At least 12 characters, and 16 or more for important accounts like email and banking. Length adds more strength than symbols do.',
    },
    {
      question: 'What does “entropy” mean?',
      answer: 'It measures how unpredictable a password is, in bits. Each extra bit doubles the number of guesses an attacker would need. Above 80 bits is very strong.',
    },
    {
      question: 'Why avoid look-alike characters?',
      answer: 'Characters like l, 1 and I, or O and 0, are easy to mix up when reading or typing a password by hand. Leaving them out makes typing easier.',
    },
  ],
  ui,
};

export default content;
