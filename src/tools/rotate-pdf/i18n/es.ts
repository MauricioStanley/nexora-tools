import type { ToolContent } from '../../types';
import type { RotatePdfUi } from './en';

const ui: RotatePdfUi = {
  action: 'Rotar PDF',
  dropTitle: 'Suelta tu PDF aquí',
  angle: 'Rotación',
  right: 'Derecha',
  upsideDown: 'Al revés',
  left: 'Izquierda',
  scope: 'Páginas a rotar',
  scopeAll: 'Todas las páginas',
  scopePages: 'Solo algunas páginas',
  pagesLabel: 'Páginas',
  inspecting: 'Leyendo tu PDF…',
  preview: { one: 'Rota {count} página', other: 'Rota {count} páginas' },
  outputSuffix: 'rotado',
  downloadLabel: 'Descargar PDF',
  summary: { one: '{count} página rotada', other: '{count} páginas rotadas' },
};

const content: ToolContent<RotatePdfUi> = {
  name: 'Rotar PDF',
  tagline: 'Gira páginas PDF a la derecha, a la izquierda o al revés, todas o solo algunas.',
  description:
    'Corrige en segundos las páginas de lado o al revés. Rota todas las páginas o solo las que elijas, sin perder calidad y directamente en tu navegador.',
  seo: {
    title: 'Rotar PDF online – Gratis y privado',
    description:
      'Rota páginas PDF 90° o 180°, todas o solo las que elijas. Gratis, sin registro y sin perder calidad: tu PDF se procesa en tu navegador y nunca se sube.',
  },
  keywords: ['rotar pdf', 'girar pdf', 'rotar paginas pdf', 'girar paginas pdf', 'voltear pdf', 'rotar pdf online', 'rotar pdf y guardar'],
  aliases: ['girar hojas pdf', 'pdf de lado', 'pdf al reves', 'cambiar orientacion pdf', 'rotar una pagina de un pdf', 'enderezar pdf'],
  howTo: [
    { title: 'Añade tu PDF', text: 'Suelta el archivo en la página o elígelo desde tu dispositivo.' },
    { title: 'Elige la rotación', text: 'Gira las páginas a la derecha, a la izquierda o al revés, y decide si rotar todas o solo algunas, como “2, 5-7”.' },
    { title: 'Descarga', text: 'Descarga el PDF rotado. La nueva orientación se guarda en el archivo y se ve igual en cualquier lector de PDF.' },
  ],
  about: [
    'Rotar PDF cambia la orientación de las páginas de un documento, la forma más rápida de arreglar escaneos y fotos que quedaron de lado o al revés.',
    'Solo cambia el ajuste de orientación de cada página: textos, imágenes y enlaces se conservan tal cual, así que no se pierde calidad y el tamaño del archivo apenas cambia. Rota el documento completo o solo las páginas que indiques.',
  ],
  limitations: [
    'Los PDF protegidos con contraseña no se pueden rotar. Quita la protección primero.',
    'Las páginas giran en pasos de 90°. Para enderezar un escaneo ligeramente torcido, vuelve a escanearlo o usa un editor con enderezado.',
    'Hasta 200 MB por PDF.',
  ],
  faq: [
    {
      question: '¿Se sube mi PDF a algún sitio?',
      answer: 'No. El PDF se rota en tu navegador, en tu propio dispositivo. Nunca sale de él.',
    },
    {
      question: '¿Puedo rotar solo una página?',
      answer: 'Sí. Elige “Solo algunas páginas” y escribe el número de página, o varias páginas y rangos como “1, 4-6”. Las demás páginas quedan igual.',
    },
    {
      question: '¿Rotar reduce la calidad?',
      answer: 'No. Solo cambia la orientación de cada página. El texto sigue siendo seleccionable y las imágenes no se vuelven a comprimir.',
    },
    {
      question: '¿La rotación se mantiene al abrir el archivo en otro sitio?',
      answer: 'Sí. La nueva orientación se guarda dentro del PDF, así que se ve igual en Acrobat, navegadores, móviles e impresoras.',
    },
  ],
  ui,
};

export default content;
