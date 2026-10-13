import type { ToolContent } from '../../types';
import type { RotateImageUi } from './en';

const ui: RotateImageUi = {
  action: 'Rotar imágenes',
  dropTitle: 'Suelta tus imágenes aquí',
  rotation: 'Rotación',
  none: 'Ninguna',
  right: 'Derecha',
  upsideDown: 'Al revés',
  left: 'Izquierda',
  flipH: 'Voltear horizontalmente',
  flipV: 'Voltear verticalmente',
  previewCaption: 'Vista previa',
  previewFirst: 'Vista previa de la primera imagen',
  chooseTransform: 'Elige una rotación o un volteo.',
  suffix: 'rotada',
  zipName: 'imagenes-rotadas.zip',
  downloadLabel: 'Descargar imagen',
  summary: { one: '{count} imagen rotada', other: '{count} imágenes rotadas' },
};

const content: ToolContent<RotateImageUi> = {
  name: 'Rotar imagen',
  tagline: 'Rota o voltea imágenes JPG, PNG y WebP, una o muchas a la vez.',
  description:
    'Pon las fotos derechas o voltéalas en horizontal o en vertical. Rota muchas imágenes a la vez, conserva su formato y mira el resultado en vivo.',
  seo: {
    title: 'Rotar imagen online – Gira y voltea fotos gratis',
    description:
      'Rota imágenes 90° o 180° y voltéalas en horizontal o vertical. Rota JPG, PNG y WebP por lotes con vista previa en vivo. Gratis y procesado en tu dispositivo.',
  },
  keywords: ['rotar imagen', 'girar imagen', 'rotar foto', 'girar foto', 'voltear imagen', 'imagen en espejo', 'rotar jpg'],
  aliases: ['dar vuelta a una imagen', 'rotar imagen online', 'voltear foto horizontalmente', 'reflejar imagen', 'rotar imagen 90 grados', 'enderezar foto de lado'],
  howTo: [
    { title: 'Añade imágenes', text: 'Suelta una o varias imágenes JPG, PNG o WebP, pega una o elígelas desde tu dispositivo.' },
    { title: 'Elige la rotación', text: 'Gira a la derecha, a la izquierda o al revés, y voltea en horizontal o vertical si hace falta. La vista previa muestra el resultado.' },
    { title: 'Descarga', text: 'Descarga cada imagen o todas juntas en un ZIP.' },
  ],
  about: [
    'Rotar imagen gira fotos y gráficos en pasos de 90° y los voltea en horizontal o vertical. El mismo cambio se aplica a todas las imágenes del lote.',
    'Cada imagen conserva su formato: un JPG sigue siendo JPG y un PNG mantiene su transparencia. Las fotos se muestran primero como las tomó la cámara, así que el resultado coincide con lo que ves.',
  ],
  limitations: [
    'La rotación es en pasos de 90°. No admite ángulos pequeños para enderezar un horizonte.',
    'Las imágenes JPG y WebP se vuelven a guardar en alta calidad, lo que puede cambiar ligeramente el tamaño del archivo.',
    'Hasta 50 imágenes por lote, de 40 MB cada una.',
  ],
  faq: [
    {
      question: '¿Se suben mis imágenes?',
      answer: 'No. Las imágenes se rotan en tu navegador, en tu propio dispositivo, y nunca se envían a ningún sitio.',
    },
    {
      question: '¿Puedo rotar varias fotos a la vez?',
      answer: 'Sí. Añade hasta 50 imágenes y todas se rotarán igual. Descárgalas una a una o en un ZIP.',
    },
    {
      question: '¿Qué diferencia hay entre rotar y voltear?',
      answer: 'Rotar gira la imagen como un volante. Voltear la refleja como un espejo: en horizontal intercambia izquierda y derecha, en vertical intercambia arriba y abajo.',
    },
    {
      question: '¿Mi PNG mantendrá el fondo transparente?',
      answer: 'Sí. Las imágenes PNG y WebP conservan su transparencia después de rotarlas.',
    },
  ],
  ui,
};

export default content;
