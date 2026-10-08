import type { ToolContent } from '../../types';
import type { QrUi } from './en';

const ui: QrUi = {
  typeLabel: '¿Qué debe abrir el código QR?',
  types: { url: 'Enlace', text: 'Texto', wifi: 'Wi-Fi', email: 'Correo', phone: 'Teléfono' },
  urlLabel: 'Dirección web',
  urlPlaceholder: 'ejemplo.com',
  textLabel: 'Texto',
  textPlaceholder: 'Escribe cualquier texto…',
  ssidLabel: 'Nombre de la red (SSID)',
  passwordLabel: 'Contraseña',
  securityLabel: 'Seguridad',
  securityWpa: 'WPA/WPA2/WPA3',
  securityWep: 'WEP',
  securityNone: 'Ninguna',
  hiddenLabel: 'Red oculta',
  wifiNote: 'La contraseña se codifica en tu dispositivo y nunca se envía a ningún sitio.',
  emailLabel: 'Correo electrónico',
  emailPlaceholder: 'nombre@ejemplo.com',
  subjectLabel: 'Asunto (opcional)',
  bodyLabel: 'Mensaje (opcional)',
  phoneLabel: 'Número de teléfono',
  phonePlaceholder: '+34 600 123 456',
  design: 'Diseño',
  eccLabel: 'Corrección de errores',
  ecc: { L: 'Baja', M: 'Media', Q: 'Alta', H: 'Máxima' },
  eccHint: 'Los niveles altos se leen aunque el código esté dañado o tapado en parte, pero lo hacen más denso.',
  sizeLabel: 'Tamaño PNG',
  marginLabel: 'Zona de silencio',
  marginHint: 'Los lectores necesitan un borde libre alrededor del código. Lo estándar son 4 módulos.',
  modules: '{count} módulos',
  foreground: 'Color del código',
  background: 'Color de fondo',
  previewLabel: 'Vista previa del código QR',
  previewEmpty: 'Tu código QR aparecerá aquí mientras escribes.',
  downloadPng: 'Descargar PNG',
  downloadSvg: 'Descargar SVG',
  errors: {
    empty: '',
    invalid_url: 'Escribe una dirección web válida, como ejemplo.com.',
    unsafe_url: 'Este tipo de enlace no se puede usar en un código QR.',
    invalid_email: 'Escribe un correo electrónico válido.',
    invalid_phone: 'Escribe un número de teléfono válido, con dígitos y un + opcional.',
    too_long: 'Hay demasiado contenido para un código QR. Acórtalo o baja la corrección de errores.',
  },
  warnContrast: 'El poco contraste entre los colores puede dificultar la lectura del código.',
  warnInverted: 'Algunas apps de lectura no reconocen códigos claros sobre fondos oscuros.',
  testTip: 'Consejo: escanea el código con tu teléfono antes de imprimirlo o compartirlo.',
  fileName: 'codigo-qr',
};

const content: ToolContent<QrUi> = {
  name: 'Generador de códigos QR',
  tagline: 'Crea códigos QR para enlaces, texto, Wi-Fi, correo y teléfonos.',
  description:
    'Crea un código QR para una web, un texto, una red Wi-Fi, un correo o un teléfono. Personaliza colores y tamaño y descárgalo en PNG o SVG. Gratis, sin caducidad ni seguimiento.',
  seo: {
    title: 'Generador de códigos QR gratis – PNG y SVG',
    description:
      'Crea códigos QR para enlaces, texto, Wi-Fi, correo y teléfonos. Elige colores y tamaño y descarga PNG o SVG. Gratis, sin registro ni caducidad.',
  },
  keywords: ['generador qr', 'codigo qr', 'crear codigo qr', 'generador de codigos qr', 'qr gratis', 'qr wifi', 'enlace a qr', 'hacer qr'],
  aliases: ['crear qr', 'generar codigo qr', 'qr de un link', 'qr para wifi', 'codigo qr svg', 'creador de qr'],
  howTo: [
    { title: 'Elige el contenido', text: 'Selecciona enlace, texto, red Wi-Fi, correo o teléfono y completa los datos.' },
    { title: 'Ajusta el diseño', text: 'Si quieres, cambia colores, tamaño, zona de silencio y corrección de errores. La vista previa se actualiza al instante.' },
    { title: 'Descarga', text: 'Descarga un PNG para el uso diario o un SVG para imprenta y diseño.' },
  ],
  about: [
    'El generador crea códigos QR estándar que cualquier cámara de móvil puede leer. El contenido va dentro del propio código, así que funciona para siempre: sin servicios de redirección, sin fecha de caducidad y sin seguimiento de escaneos.',
    'Todo ocurre en tu navegador, algo importante para contenido sensible como las contraseñas Wi-Fi. Descarga un PNG de alta resolución o un SVG que se mantiene perfectamente nítido a cualquier tamaño de impresión.',
  ],
  limitations: [
    'Los códigos son estáticos: para cambiar el contenido más adelante, genera y comparte un código nuevo.',
    'Todavía no se admiten logotipos en el centro del código.',
    'Los textos muy largos generan códigos densos que cuestan más de leer; mantén el contenido breve cuando puedas.',
  ],
  faq: [
    {
      question: '¿Estos códigos QR caducan?',
      answer: 'No. El contenido está guardado dentro del propio código, no detrás de un enlace de redirección, así que funciona mientras exista el destino.',
    },
    {
      question: '¿Se registran los escaneos?',
      answer: 'No. No usamos enlaces de redirección, así que nunca vemos cuándo ni dónde se escanea un código.',
    },
    {
      question: '¿Cómo funciona el código QR de Wi-Fi?',
      answer:
        'La mayoría de las cámaras de móvil reconocen los códigos Wi-Fi y ofrecen conectarse a la red automáticamente. El nombre de la red y la contraseña se codifican en tu dispositivo y nunca se suben.',
    },
    {
      question: '¿Descargo PNG o SVG?',
      answer: 'PNG funciona en todas partes: chats, documentos y webs. SVG es un formato vectorial que se mantiene nítido a cualquier tamaño, ideal para imprimir y para programas de diseño.',
    },
    {
      question: '¿Qué nivel de corrección de errores uso?',
      answer: 'El nivel medio sirve para la mayoría de usos. Elige Alta o Máxima si el código se va a imprimir en superficies que puedan rayarse o taparse en parte.',
    },
  ],
  ui,
};

export default content;
