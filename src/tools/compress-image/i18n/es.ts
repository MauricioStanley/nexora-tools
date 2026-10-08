import type { ToolContent } from '../../types';
import type { CompressImageUi } from './en';

const ui: CompressImageUi = {
  action: 'Comprimir imágenes',
  actionSingle: 'Comprimir imagen',
  dropTitle: 'Suelta tus imágenes aquí',
  format: 'Formato de salida',
  formatSame: 'Original',
  formatJpg: 'JPG',
  formatWebp: 'WebP',
  formatHint: 'WebP suele dar los archivos más pequeños. PNG se mantiene sin pérdida si conservas su formato.',
  pngOnlyHint: 'PNG es un formato sin pérdida, así que la calidad no se aplica. Elige JPG o WebP para ahorrar mucho más.',
  maxSize: 'Dimensiones máximas',
  maxSizeOriginal: 'Mantener tamaño original',
  maxSizeOption: 'Lado mayor {size} px',
  zipName: 'imagenes-comprimidas.zip',
  suffix: 'comprimida',
  downloadLabel: 'Descargar imagen',
  summary: { one: '{count} imagen comprimida', other: '{count} imágenes comprimidas' },
};

const content: ToolContent<CompressImageUi> = {
  name: 'Comprimir imagen',
  tagline: 'Reduce el peso de imágenes JPG, PNG y WebP con calidad ajustable.',
  description:
    'Haz tus fotos y gráficos más ligeros para webs, correo y mensajería. Ajusta la calidad, redimensiona si quieres y compara tamaños antes de descargar. Las imágenes no salen de tu dispositivo.',
  seo: {
    title: 'Comprimir imágenes online – JPG, PNG y WebP',
    description:
      'Reduce el peso de tus imágenes gratis. Comprime JPG, PNG y WebP con calidad ajustable, convierte a WebP para ahorrar más y procesa por lotes. Sin subir archivos.',
  },
  keywords: ['comprimir imagen', 'reducir peso imagen', 'compresor de imagenes', 'comprimir jpg', 'comprimir png', 'comprimir foto', 'optimizar imagen', 'reducir tamaño foto'],
  aliases: ['hacer imagen mas ligera', 'bajar peso foto', 'comprimir fotos', 'achicar imagen', 'optimizador de imagenes', 'reducir kb imagen'],
  howTo: [
    { title: 'Añade imágenes', text: 'Suelta uno o varios archivos JPG, PNG o WebP, elígelos desde tu dispositivo o pega una imagen.' },
    { title: 'Ajusta las opciones', text: 'Elige la calidad y el formato de salida. Si quieres, limita las dimensiones máximas para ahorrar más.' },
    { title: 'Comprime y descarga', text: 'Mira cuánto se redujo cada imagen y descárgalas por separado o en un ZIP.' },
  ],
  about: [
    'Comprimir imagen vuelve a codificar tus imágenes con los codificadores modernos del navegador y la calidad que elijas. Menos calidad significa archivos más pequeños; entre el 70 % y el 80 % suele ser indistinguible del original en pantalla.',
    'Para ahorrar más, convierte a WebP, que suele ser entre un 25 % y un 35 % más ligero que JPG con una calidad similar y funciona en todos los navegadores modernos. Limitar las dimensiones máximas también ayuda mucho con fotos grandes de cámara.',
    'Si la versión comprimida pesara más que el original, conservamos el original. Las imágenes comprimidas se crean sin metadatos, así que se eliminan la ubicación (GPS) y los datos de la cámara.',
  ],
  limitations: [
    'Los PNG que se mantienen como PNG se vuelven a codificar sin pérdida, lo que suele ahorrar poco. Convertir a JPG o WebP ahorra mucho más, aunque JPG elimina la transparencia.',
    'Las imágenes WebP animadas se convierten como imagen fija (primer fotograma).',
    'Hasta 30 imágenes por lote, de 40 MB cada una y 300 MB en total.',
  ],
  faq: [
    {
      question: '¿Qué calidad debo usar?',
      answer:
        'El 75 % es un buen valor para fotos: los archivos son mucho más pequeños y apenas se notan diferencias. Súbela para imágenes con texto fino o bordes nítidos y bájala si el tamaño es lo más importante.',
    },
    {
      question: '¿Se suben mis imágenes a un servidor?',
      answer: 'No. La compresión ocurre en tu navegador, en tu propio dispositivo. Tus imágenes no se envían a ningún sitio.',
    },
    {
      question: '¿Por qué mi imagen no se hizo más pequeña?',
      answer:
        'Algunas imágenes ya están muy optimizadas. Si nuestro resultado pesara más que el original, conservamos el original para que nunca descargues un archivo más grande. Prueba con WebP o con menos calidad.',
    },
    {
      question: '¿La compresión elimina los metadatos de las fotos?',
      answer:
        'Sí. Las imágenes comprimidas se crean desde cero sin datos EXIF como la ubicación GPS, el modelo de cámara o la fecha. Los originales que se conservan sin cambios mantienen sus metadatos.',
    },
    {
      question: '¿Puedo comprimir muchas imágenes a la vez?',
      answer: 'Sí. Añade hasta 30 imágenes y descárgalas una a una o todas juntas en un archivo ZIP.',
    },
  ],
  ui,
};

export default content;
