import type { ToolContent } from '../../types';
import type { ResizeImageUi } from './en';

const ui: ResizeImageUi = {
  action: 'Redimensionar imágenes',
  actionSingle: 'Redimensionar imagen',
  dropTitle: 'Suelta tus imágenes aquí',
  mode: 'Redimensionar por',
  modePixels: 'Píxeles',
  modePercent: 'Porcentaje',
  width: 'Ancho',
  height: 'Alto',
  px: 'px',
  keepAspect: 'Mantener proporción',
  keepAspectHint: 'Evita que se deformen. Cada imagen se ajusta dentro del ancho y alto que indiques.',
  percent: 'Escala',
  format: 'Formato de salida',
  formatSame: 'Original',
  formatJpg: 'JPG',
  formatPng: 'PNG',
  formatWebp: 'WebP',
  resultSize: 'Resultado: {width} × {height} px',
  needSize: 'Escribe un ancho o un alto.',
  needBoth: 'Escribe el ancho y el alto, o mantén la proporción.',
  invalidSize: 'Usa valores entre 1 y {max} píxeles.',
  zipName: 'imagenes-redimensionadas.zip',
  suffix: 'redimensionada',
  downloadLabel: 'Descargar imagen',
  summary: { one: '{count} imagen redimensionada', other: '{count} imágenes redimensionadas' },
};

const content: ToolContent<ResizeImageUi> = {
  name: 'Redimensionar imagen',
  tagline: 'Cambia las dimensiones de imágenes en píxeles o porcentaje, una o varias.',
  description:
    'Redimensiona imágenes JPG, PNG y WebP a dimensiones exactas en píxeles o por porcentaje, con la proporción bloqueada o libre. Remuestreo de alta calidad, todo en tu navegador.',
  seo: {
    title: 'Redimensionar imagen online – Cambiar tamaño en píxeles',
    description:
      'Cambia el tamaño de tus imágenes en píxeles o por porcentaje. Mantén la proporción, redimensiona JPG, PNG y WebP por lotes y descarga al instante. Sin subidas.',
  },
  keywords: ['redimensionar imagen', 'cambiar tamaño imagen', 'redimensionar foto', 'cambiar tamaño foto', 'escalar imagen', 'ajustar tamaño imagen', 'redimensionar jpg'],
  aliases: ['hacer imagen mas pequeña', 'cambiar dimensiones foto', 'reducir dimensiones imagen', 'agrandar imagen', 'cambiar pixeles imagen', 'achicar foto'],
  howTo: [
    { title: 'Añade imágenes', text: 'Suelta una o varias imágenes JPG, PNG o WebP, elígelas desde tu dispositivo o pega una.' },
    { title: 'Define el nuevo tamaño', text: 'Escribe un ancho y/o alto en píxeles o elige un porcentaje. Mantén la proporción bloqueada para no deformarlas.' },
    { title: 'Redimensiona y descarga', text: 'Descarga cada imagen redimensionada o todas juntas en un ZIP.' },
  ],
  about: [
    'Redimensionar imagen cambia las dimensiones en píxeles de tus imágenes con un remuestreo de alta calidad, así que las fotos reducidas se mantienen nítidas. Es ideal para fotos de perfil, imágenes web, anuncios y adjuntos que deben cumplir un tamaño.',
    'Con la proporción bloqueada, cada imagen se ajusta dentro del recuadro que definas sin deformarse. Desbloquéala para forzar dimensiones exactas. Al redimensionar por porcentaje, todas las imágenes se escalan proporcionalmente.',
  ],
  limitations: [
    'Ampliar una imagen no puede añadir detalle que no existe; las imágenes ampliadas pueden verse suaves.',
    'Las salidas muy grandes pueden verse limitadas por la memoria del dispositivo, sobre todo en teléfonos. Te avisaremos si una imagen se redujo para caber.',
    'Hasta 30 imágenes por lote, de 40 MB cada una y 300 MB en total.',
  ],
  faq: [
    {
      question: '¿Redimensionar reduce la calidad?',
      answer:
        'Al reducir una imagen se mantiene nítida gracias al remuestreo de alta calidad. Al ampliarla no se puede crear detalle nuevo, así que puede verse más suave.',
    },
    {
      question: '¿Cómo evito que las imágenes se deformen?',
      answer:
        'Mantén activada la opción “Mantener proporción”. La imagen se escala para caber dentro del ancho y alto indicados, conservando sus proporciones originales.',
    },
    {
      question: '¿Puedo redimensionar varias imágenes a la vez?',
      answer: 'Sí. Añade hasta 30 imágenes; se aplica la misma configuración a cada una y puedes descargarlas juntas en un ZIP.',
    },
    {
      question: '¿Se suben mis imágenes?',
      answer: 'No. El redimensionado se hace en tu navegador, en tu propio dispositivo. No se envía nada a ningún servidor.',
    },
    {
      question: '¿Redimensionar también reduce el peso del archivo?',
      answer: 'Normalmente sí: menos píxeles significa un archivo más ligero. Para reducirlo aún más, pasa el resultado por Comprimir imagen.',
    },
  ],
  ui,
};

export default content;
