import type { ToolContent } from '../../types';
import type { SplitPdfUi } from './en';

const ui: SplitPdfUi = {
  action: 'Dividir PDF',
  dropTitle: 'Suelta tu PDF aquí',
  mode: '¿Cómo quieres dividirlo?',
  modeAll: 'Cada página',
  modeAllHint: 'Un PDF por página',
  modeRanges: 'Rangos',
  modeRangesHint: 'Un PDF por rango',
  modeExtract: 'Extraer páginas',
  modeExtractHint: 'Páginas elegidas en un PDF',
  modeEvery: 'Tamaño fijo',
  modeEveryHint: 'Un PDF cada N páginas',
  rangesLabel: 'Rangos de páginas',
  rangesPlaceholder: 'p. ej. 1-3, 5, 8-10',
  rangesHint: 'Separa los rangos con comas. “7-” significa de la página 7 al final.',
  extractLabel: 'Páginas que quieres extraer',
  extractPlaceholder: 'p. ej. 1, 3, 5-7',
  extractHint: 'Las páginas se añaden en el orden en que las escribes.',
  everyLabel: 'Páginas por archivo',
  preview: { one: 'Genera {count} PDF', other: 'Genera {count} PDF' },
  rangeErrors: {
    empty: 'Escribe al menos una página o un rango.',
    syntax: '“{token}” no es una página ni un rango válido.',
    out_of_bounds: '“{token}” está fuera de este PDF (1–{pages}).',
    reversed: '“{token}” va hacia atrás. Escríbelo como a-b con a ≤ b.',
  },
  inspecting: 'Leyendo tu PDF…',
  protectedHint: 'Este PDF está protegido con contraseña y no se puede dividir.',
  splitting: 'Creando el archivo {current} de {total}…',
  packaging: 'Empaquetando archivos…',
  pageName: 'pagina',
  pagesName: 'paginas',
  extractName: 'extraido',
  downloadLabel: 'Descargar PDF',
  summary: { one: '{count} PDF creado a partir de {pages} páginas', other: '{count} PDF creados a partir de {pages} páginas' },
};

const content: ToolContent<SplitPdfUi> = {
  name: 'Dividir PDF',
  tagline: 'Separa un PDF en páginas sueltas, rangos o solo las páginas que elijas.',
  description:
    'Divide un PDF en varios archivos: cada página por separado, rangos personalizados o solo las páginas que necesitas. Rápido, gratis y procesado por completo en tu navegador.',
  seo: {
    title: 'Dividir PDF online – Extraer páginas gratis',
    description:
      'Divide un PDF en páginas sueltas o rangos personalizados, o extrae solo las páginas que necesitas. Gratis y privado: tu PDF se procesa en tu navegador, sin subirlo.',
  },
  keywords: ['dividir pdf', 'separar pdf', 'extraer paginas pdf', 'cortar pdf', 'partir pdf', 'separar paginas pdf', 'dividir paginas pdf'],
  aliases: ['separar hojas pdf', 'sacar paginas de un pdf', 'extraer hojas pdf', 'dividir pdf en paginas', 'quitar paginas pdf'],
  howTo: [
    { title: 'Añade tu PDF', text: 'Suelta el archivo en la página o elígelo desde tu dispositivo. Verás el número de páginas al instante.' },
    { title: 'Elige cómo dividirlo', text: 'Separa cada página, define rangos como 1-3, 5, 8-10, extrae páginas concretas o corta cada N páginas.' },
    { title: 'Descarga', text: 'Descarga un solo PDF o todas las partes juntas en un archivo ZIP.' },
  ],
  about: [
    'Dividir PDF crea nuevos archivos PDF a partir de las páginas de un documento existente. Las páginas se copian sin volver a comprimirse, así que el texto sigue nítido y seleccionable y la calidad no cambia.',
    'Elige el modo que necesites: un archivo por página, un archivo por cada rango, un único archivo con solo las páginas que elijas (en cualquier orden) o partes del mismo tamaño. Cuando se crean varios archivos, puedes descargarlos juntos en un ZIP.',
  ],
  limitations: [
    'Los PDF protegidos con contraseña no se pueden dividir. Quita primero la protección.',
    'Los marcadores y los campos de formulario interactivos no se trasladan a los nuevos archivos.',
    'Hasta 200 MB por PDF. Los documentos muy grandes dependen de la memoria de tu dispositivo.',
  ],
  faq: [
    {
      question: '¿Se sube mi PDF a algún sitio?',
      answer: 'No. La división se hace por completo en tu navegador, en tu propio dispositivo. El archivo nunca sale de él.',
    },
    {
      question: '¿Cómo escribo los rangos de páginas?',
      answer:
        'Usa comas entre las partes: “1-3, 5, 8-10” crea tres archivos. “7-” significa de la página 7 al final y “-4” las páginas 1 a 4. Los espacios son opcionales.',
    },
    {
      question: '¿Puedo sacar solo algunas páginas a un PDF nuevo?',
      answer:
        'Sí. Elige “Extraer páginas” y escribe las que quieres, por ejemplo “2, 4, 9-12”. Se combinan en un único PDF nuevo en el orden en que las escribiste.',
    },
    {
      question: '¿Dividir reduce la calidad?',
      answer: 'No. Las páginas se copian tal cual, sin volver a comprimirse. Si además necesitas archivos más ligeros, pasa las partes por Comprimir PDF.',
    },
    {
      question: '¿Qué pasa si se crean muchos archivos?',
      answer: 'Todas las partes se empaquetan en un único ZIP para que las descargues de una vez. Si son pocas, también puedes descargar cada una por separado.',
    },
  ],
  ui,
};

export default content;
