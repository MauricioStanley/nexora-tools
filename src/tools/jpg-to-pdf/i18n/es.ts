import type { ToolContent } from '../../types';
import type { JpgToPdfUi } from './en';

const ui: JpgToPdfUi = {
  action: 'Convertir a PDF',
  dropTitle: 'Suelta tus imágenes aquí',
  pageSize: 'Tamaño de página',
  sizeFit: 'Ajustar',
  sizeFitHint: 'Página = imagen',
  sizeA4: 'A4',
  sizeA4Hint: '210 × 297 mm',
  sizeLetter: 'Carta',
  sizeLetterHint: '8,5 × 11 in',
  orientation: 'Orientación',
  orientationAuto: 'Auto',
  orientationPortrait: 'Vertical',
  orientationLandscape: 'Horizontal',
  margin: 'Margen',
  marginNone: 'Sin margen',
  marginSmall: 'Pequeño',
  marginLarge: 'Grande',
  stripMetadata: 'Eliminar metadatos de las fotos',
  stripMetadataHint: 'Elimina la ubicación (GPS), los datos de la cámara y otra información EXIF de las fotos.',
  preparing: 'Preparando la imagen {current} de {total}…',
  building: 'Creando tu PDF…',
  outputName: 'imagenes',
  downloadLabel: 'Descargar PDF',
  summary: { one: '{count} imagen convertida en un PDF de {pages} páginas', other: '{count} imágenes convertidas en un PDF de {pages} páginas' },
};

const content: ToolContent<JpgToPdfUi> = {
  name: 'JPG a PDF',
  tagline: 'Convierte imágenes JPG, PNG o WebP en un único documento PDF.',
  description:
    'Convierte fotos, escaneos y capturas en un solo PDF. Ordena las imágenes, elige el tamaño de página y los márgenes y descárgalo en segundos. Tus imágenes no salen de tu dispositivo.',
  seo: {
    title: 'Convertir JPG a PDF – Gratis y sin subir',
    description:
      'Convierte imágenes JPG, PNG y WebP a PDF gratis. Ordena las páginas, elige A4, Carta o tamaño de imagen y descarga al instante. Se procesa en tu navegador.',
  },
  keywords: ['jpg a pdf', 'imagen a pdf', 'jpeg a pdf', 'png a pdf', 'foto a pdf', 'fotos a pdf', 'convertir jpg a pdf', 'webp a pdf'],
  aliases: ['imagenes a pdf', 'convertir fotos a pdf', 'escaneo a pdf', 'crear pdf con imagenes', 'juntar imagenes en pdf', 'pasar foto a pdf'],
  howTo: [
    { title: 'Añade tus imágenes', text: 'Suelta archivos JPG, PNG o WebP, elígelos desde tu dispositivo o pega una imagen.' },
    { title: 'Ordena y configura', text: 'Cambia el orden con las flechas y elige el tamaño de página, la orientación y los márgenes.' },
    { title: 'Convierte y descarga', text: 'Pulsa Convertir a PDF. Cada imagen se convierte en una página del documento.' },
  ],
  about: [
    'JPG a PDF coloca cada imagen en su propia página y las combina en un único PDF, ideal para enviar recibos, documentos escaneados o series de fotos. Las imágenes JPG se incrustan sin volver a comprimirse, así que conservan su calidad original.',
    'Las fotos del móvil suelen incluir metadatos ocultos, como la ubicación GPS. De forma predeterminada, esa información se elimina y la imagen se mantiene intacta. Además, las imágenes se giran correctamente según cómo se tomaron.',
  ],
  limitations: [
    'Las imágenes WebP se convierten a JPG de alta calidad antes de añadirse, y las zonas transparentes quedan en blanco.',
    'Los navegadores todavía no admiten las fotos HEIC del iPhone. Compártelas o expórtalas como JPG primero.',
    'Hasta 100 imágenes, de 40 MB cada una y 400 MB en total.',
  ],
  faq: [
    {
      question: '¿Mis imágenes perderán calidad?',
      answer:
        'Las imágenes JPG y PNG se incrustan tal cual, así que se conserva su calidad. Solo las fotos que hay que girar y las imágenes WebP se vuelven a codificar como JPG de alta calidad.',
    },
    {
      question: '¿Puedo poner varias imágenes en una misma página?',
      answer: 'En esta versión no: cada imagen ocupa su propia página. Puedes elegir el tamaño de página y los márgenes para que queden bien colocadas.',
    },
    {
      question: '¿Se suben mis fotos?',
      answer: 'No. El PDF se crea en tu navegador, en tu dispositivo. Tus imágenes nunca se envían a un servidor.',
    },
    {
      question: '¿Por qué las fotos del móvil salen bien giradas?',
      answer:
        'Los teléfonos guardan la orientación de la foto aparte de la imagen. Leemos esa información y giramos la imagen para que aparezca en el PDF igual que en tu galería.',
    },
    {
      question: '¿Qué tamaño de página elijo?',
      answer:
        '“Ajustar” hace que cada página tenga exactamente el tamaño de la imagen, ideal para capturas y fotos. Elige A4 o Carta para documentos que vayas a imprimir o entregar.',
    },
  ],
  ui,
};

export default content;
