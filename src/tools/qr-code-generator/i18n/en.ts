import type { ToolContent } from '../../types';

const ui = {
  typeLabel: 'What should the QR code open?',
  types: { url: 'Link', text: 'Text', wifi: 'Wi-Fi', email: 'Email', phone: 'Phone' },
  urlLabel: 'Website address',
  urlPlaceholder: 'example.com',
  textLabel: 'Text',
  textPlaceholder: 'Type any text…',
  ssidLabel: 'Network name (SSID)',
  passwordLabel: 'Password',
  securityLabel: 'Security',
  securityWpa: 'WPA/WPA2/WPA3',
  securityWep: 'WEP',
  securityNone: 'None',
  hiddenLabel: 'Hidden network',
  wifiNote: 'The password is encoded on your device and is never sent anywhere.',
  emailLabel: 'Email address',
  emailPlaceholder: 'name@example.com',
  subjectLabel: 'Subject (optional)',
  bodyLabel: 'Message (optional)',
  phoneLabel: 'Phone number',
  phonePlaceholder: '+1 555 123 4567',
  design: 'Design',
  eccLabel: 'Error correction',
  ecc: { L: 'Low', M: 'Medium', Q: 'High', H: 'Max' },
  eccHint: 'Higher levels still scan when partly damaged or covered, but make the code denser.',
  sizeLabel: 'PNG size',
  marginLabel: 'Quiet zone',
  marginHint: 'Scanners need a clear border around the code. 4 modules is the standard.',
  modules: '{count} modules',
  foreground: 'Code color',
  background: 'Background color',
  previewLabel: 'QR code preview',
  previewEmpty: 'Your QR code will appear here as you type.',
  downloadPng: 'Download PNG',
  downloadSvg: 'Download SVG',
  errors: {
    empty: '',
    invalid_url: 'Enter a valid web address, like example.com.',
    unsafe_url: 'This kind of link can’t be used in a QR code.',
    invalid_email: 'Enter a valid email address.',
    invalid_phone: 'Enter a valid phone number, using digits and an optional +.',
    too_long: 'There’s too much content for a QR code. Shorten it or lower the error correction.',
  },
  warnContrast: 'Low contrast between the colors may make the code hard to scan.',
  warnInverted: 'Light codes on dark backgrounds can’t be read by some scanner apps.',
  testTip: 'Tip: scan the code with your phone before printing or sharing it.',
  fileName: 'qr-code',
};

export type QrUi = typeof ui;

const content: ToolContent<QrUi> = {
  name: 'QR Code Generator',
  tagline: 'Create QR codes for links, text, Wi-Fi, email and phone numbers.',
  description:
    'Create a QR code for a website, text, Wi-Fi network, email or phone number. Customize colors and size, then download it as PNG or SVG. Free, with no expiry or tracking.',
  seo: {
    title: 'Free QR Code Generator – PNG and SVG',
    description:
      'Create QR codes for links, text, Wi-Fi, email and phone numbers. Choose colors and size, download PNG or SVG. Free forever, no sign-up, no tracking or expiry.',
  },
  keywords: ['qr code generator', 'qr code', 'create qr code', 'qr code maker', 'free qr code', 'wifi qr code', 'url to qr code', 'qr generator'],
  aliases: ['make a qr code', 'qr code creator', 'link to qr', 'qr for wifi', 'generate qr', 'qr code svg'],
  howTo: [
    { title: 'Choose the content', text: 'Pick a link, text, Wi-Fi network, email or phone number and fill in the details.' },
    { title: 'Adjust the design', text: 'Optionally change colors, size, quiet zone and error correction. The preview updates instantly.' },
    { title: 'Download', text: 'Download a PNG for everyday use or an SVG for print and design work.' },
  ],
  about: [
    'QR Code Generator creates standard QR codes that any phone camera can scan. The content is encoded directly in the code, so it works forever: there’s no redirect service, no expiry date and no scan tracking.',
    'Everything happens in your browser, which matters for sensitive content such as Wi-Fi passwords. Download a high-resolution PNG, or an SVG that stays perfectly sharp at any print size.',
  ],
  limitations: [
    'Codes are static: to change the content later, generate and share a new code.',
    'Custom logos in the center of the code are not supported yet.',
    'Very long text produces dense codes that are harder to scan; keep content short where possible.',
  ],
  faq: [
    {
      question: 'Do these QR codes expire?',
      answer: 'No. The content is stored inside the code itself, not behind a redirect link, so it keeps working as long as the destination exists.',
    },
    {
      question: 'Are scans tracked?',
      answer: 'No. We don’t use redirect links, so we never see when or where a code is scanned.',
    },
    {
      question: 'How does the Wi-Fi QR code work?',
      answer:
        'Most phone cameras recognize Wi-Fi codes and offer to join the network automatically. The network name and password are encoded on your device and never uploaded.',
    },
    {
      question: 'Should I download PNG or SVG?',
      answer: 'PNG works everywhere: chats, documents and websites. SVG is a vector format that stays sharp at any size, ideal for printing and design tools.',
    },
    {
      question: 'Which error correction level should I use?',
      answer: 'Medium works for most uses. Choose High or Max if the code will be printed on surfaces that may get scratched or partly covered.',
    },
  ],
  ui,
};

export default content;
