import type { ToolContent } from '../../types';
import type { PdfToJpgUi } from './en';

const ui: PdfToJpgUi = {
  action: 'Convertir a JPG',
  dropTitle: 'Suelta tu PDF aquí',
  pages: 'Páginas',
  pagesAll: 'Todas',
  pagesCustom: 'Elegir páginas',
  pagesLabel: 'Páginas que quieres convertir',
  pagesPlaceholder: 'p. ej. 1-3, 5',
  pagesHint: 'Separa páginas y rangos con comas.',
  resolution: 'Resolución',
  resScreen: 'Pantalla',
  resScreenHint: '72 DPI',
  resStandard: 'Estándar',
  resStandardHint: '150 DPI',
  resHigh: 'Alta',
  resHighHint: '300 DPI',
  quality: 'Calidad JPG',
  rangeErrors: {
    empty: 'Escribe al menos una página o un rango.',
    syntax: '“{token}” no es una página ni un rango válido.',
    out_of_bounds: '“{token}” está fuera de este PDF (1–{pages}).',
    reversed: '“{token}” va hacia atrás. Escríbelo como a-b con a ≤ b.',
  },
  preview: { one: 'Genera {count} imagen', other: 'Genera {count} imágenes' },
  tooMany: 'Esta herramienta convierte hasta {count} páginas a la vez. Elige menos páginas o divide el PDF primero.',
  loadingEngine: 'Cargando el motor PDF…',
  reading: 'Leyendo tu PDF…',
  rendering: 'Convirtiendo la página {current} de {total}…',
  packaging: 'Empaquetando imágenes…',
  pageName: 'pagina',
  downloadLabel: 'Descargar JPG',
  summary: { one: '{count} página convertida a JPG', other: '{count} páginas convertidas a JPG' },
  limitedPages: {
    one: '{count} página se renderizó con menor resolución por los límites de memoria de este dispositivo.',
    other: '{count} páginas se renderizaron con menor resolución por los límites de memoria de este dispositivo.',
  },
};

const content: ToolContent<PdfToJpgUi> = {
  name: 'PDF a JPG',
  tagline: 'Convierte las páginas de un PDF en imágenes JPG de alta calidad.',
  description:
    'Convierte todas las páginas de un PDF, o solo las que elijas, en imágenes JPG con la resolución que necesites. La conversión ocurre en tu navegador, así que tu documento sigue siendo privado.',
  seo: {
    title: 'Convertir PDF a JPG – Gratis y en alta calidad',
    description:
      'Convierte páginas PDF a imágenes JPG gratis. Elige páginas concretas y 72, 150 o 300 DPI, y descarga una imagen o un ZIP. Tu PDF nunca se sube a un servidor.',
  },
  keywords: ['pdf a jpg', 'pdf a jpeg', 'pdf a imagen', 'convertir pdf a jpg', 'pagina pdf a imagen', 'pdf a foto', 'pasar pdf a jpg'],
  aliases: ['guardar pdf como jpg', 'pdf a imagenes', 'convertir pdf en imagen', 'captura de pdf', 'sacar imagen de pdf'],
  howTo: [
    { title: 'Añade tu PDF', text: 'Suelta el archivo en la página o elígelo desde tu dispositivo. Primero leemos el número de páginas.' },
    { title: 'Elige páginas y calidad', text: 'Convierte todas las páginas o solo algunas y elige la resolución: pantalla, estándar o alta para imprimir.' },
    { title: 'Descarga', text: 'Descarga un solo JPG o todas las imágenes juntas en un archivo ZIP.' },
  ],
  about: [
    'PDF a JPG renderiza cada página tal como lo haría un visor de PDF, usando el motor PDF.js de Mozilla, y la guarda como imagen JPG. Úsalo para compartir páginas en redes sociales, insertarlas en presentaciones o mostrar documentos en dispositivos sin lector de PDF.',
    'Elige 72 DPI para compartir rápido en pantalla, 150 DPI para un buen equilibrio o 300 DPI cuando necesites calidad de impresión. Las resoluciones más altas generan archivos más grandes.',
  ],
  limitations: [
    'Hasta 300 páginas por conversión y 150 MB por PDF. En teléfonos, las resoluciones muy altas pueden reducirse automáticamente para ajustarse a la memoria del dispositivo, y te avisaremos si ocurre.',
    'Todavía no se pueden convertir los PDF que piden contraseña para abrirse.',
    'Las zonas transparentes quedan en blanco, ya que el formato JPG no admite transparencia.',
  ],
  faq: [
    {
      question: '¿Qué resolución elijo?',
      answer:
        '72 DPI es suficiente para ver en pantalla y en apps de mensajería. 150 DPI es una buena opción general. Usa 300 DPI para imprimir o cuando necesites ampliar detalles pequeños.',
    },
    {
      question: '¿Puedo convertir solo algunas páginas?',
      answer: 'Sí. Elige “Elegir páginas” y escribe páginas o rangos, como “1-3, 5”. Solo se convierten esas páginas.',
    },
    {
      question: '¿Se sube mi PDF?',
      answer: 'No. Las páginas se renderizan en tu navegador, en tu dispositivo, y las imágenes se crean localmente.',
    },
    {
      question: '¿Las imágenes se verán igual que el PDF?',
      answer:
        'Las páginas se renderizan con el mismo motor que usa Firefox para mostrar PDF, así que coinciden con lo que ves en un visor. La compresión JPG puede suavizar un poco la imagen con calidades bajas.',
    },
    {
      question: '¿Por qué recibo un archivo ZIP?',
      answer: 'Cuando se convierte más de una página, todas las imágenes se empaquetan en un ZIP para descargarlas de una vez. Si son pocas, también puedes descargar cada imagen por separado.',
    },
  ],
  ui,
};

export default content;
