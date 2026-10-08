import type { ToolContent } from '../../types';
import type { CompressPdfUi } from './en';

const ui: CompressPdfUi = {
  action: 'Comprimir PDF',
  dropTitle: 'Suelta tu PDF aquí',
  level: 'Nivel de compresión',
  levelLight: 'Ligera',
  levelLightHint: 'Máxima calidad',
  levelRecommended: 'Recomendada',
  levelRecommendedHint: 'Equilibrada',
  levelStrong: 'Fuerte',
  levelStrongHint: 'Más pequeño',
  removeMetadata: 'Eliminar metadatos del documento',
  removeMetadataHint: 'Título, autor, programa y otras propiedades ocultas del documento.',
  rasterize: 'Convertir páginas en imágenes',
  rasterizeHint: 'Compresión máxima para escaneos. El texto dejará de poder seleccionarse, buscarse o pulsarse.',
  inspecting: 'Leyendo tu PDF…',
  protectedHint: 'Este PDF está protegido con contraseña y no se puede comprimir.',
  loadingEngine: 'Cargando el motor PDF…',
  optimizingImages: 'Optimizando la imagen {current} de {total}…',
  optimizingStructure: 'Optimizando la estructura del documento…',
  renderingPage: 'Renderizando la página {current} de {total}…',
  saving: 'Guardando tu PDF…',
  outputSuffix: 'comprimido',
  downloadLabel: 'Descargar PDF comprimido',
  summaryImages: '{optimized} de {found} imágenes recomprimidas',
  summaryNoImages: 'Estructura del documento optimizada',
  summaryRaster: { one: '{count} página convertida en imagen', other: '{count} páginas convertidas en imágenes' },
  noGain:
    'Este PDF ya está bien optimizado, así que conservamos el archivo original. Un nivel más fuerte o convertir las páginas en imágenes podría reducirlo más.',
  limitedPages: {
    one: '{count} página se renderizó con menor resolución por los límites de memoria de este dispositivo.',
    other: '{count} páginas se renderizaron con menor resolución por los límites de memoria de este dispositivo.',
  },
};

const content: ToolContent<CompressPdfUi> = {
  name: 'Comprimir PDF',
  tagline: 'Reduce el tamaño de un PDF optimizando sus imágenes y su estructura.',
  description:
    'Haz tus PDF más ligeros para enviarlos por correo o subirlos a formularios: recomprime sus imágenes y limpia su estructura. El texto se mantiene nítido y tu archivo no sale de tu dispositivo.',
  seo: {
    title: 'Comprimir PDF online – Reducir tamaño gratis',
    description:
      'Reduce el tamaño de un PDF gratis recomprimiendo sus imágenes y optimizando su estructura. Elige el nivel; tu PDF se procesa en tu navegador, sin subirlo.',
  },
  keywords: ['comprimir pdf', 'reducir pdf', 'reducir tamaño pdf', 'bajar peso pdf', 'compresor pdf', 'optimizar pdf', 'pdf mas pequeño'],
  aliases: ['achicar pdf', 'aligerar pdf', 'pdf pesa mucho', 'disminuir tamaño pdf', 'hacer pdf mas liviano', 'comprimir archivo pdf'],
  howTo: [
    { title: 'Añade tu PDF', text: 'Suelta el archivo en la página o elígelo desde tu dispositivo.' },
    { title: 'Elige un nivel', text: 'La recomendada sirve para la mayoría de documentos. La fuerte reduce más las imágenes. Para escaneos, también puedes convertir las páginas en imágenes.' },
    { title: 'Comprime y descarga', text: 'Compara el tamaño antes y después y descarga tu PDF más ligero.' },
  ],
  about: [
    'La mayor parte del peso de un PDF grande suele venir de fotos y escaneos incrustados. Comprimir PDF vuelve a comprimir esas imágenes JPEG con menor calidad y, cuando son más grandes de lo necesario, reduce su resolución. El texto, las fuentes y los gráficos vectoriales no se tocan, así que siguen nítidos y seleccionables.',
    'Además, la estructura del documento se reescribe de forma más eficiente: se eliminan restos de ediciones anteriores y los objetos se agrupan en flujos comprimidos. Para documentos escaneados, el modo opcional “convertir páginas en imágenes” renderiza cada página como JPEG y consigue la mayor reducción.',
    'Los resultados dependen del archivo. Un PDF con casi solo texto, o ya optimizado, puede reducirse muy poco. Cuando no es posible obtener un archivo más pequeño, te lo decimos y conservamos el original en lugar de darte uno más grande.',
  ],
  limitations: [
    'Solo se recomprimen imágenes JPEG en RGB o escala de grises. Los demás tipos (CMYK, JPEG 2000, máscaras) se mantienen tal cual.',
    'Convertir páginas en imágenes elimina el texto seleccionable, los enlaces y los formularios; úsalo solo para escaneos o cuando el tamaño sea lo más importante.',
    'Los PDF protegidos con contraseña no se pueden comprimir y no se conserva la conformidad PDF/A de archivo.',
    'Hasta 200 MB por PDF. La conversión a imágenes admite hasta 300 páginas.',
  ],
  faq: [
    {
      question: '¿Cuánto se reducirá mi PDF?',
      answer:
        'Depende del contenido. Los PDF con muchas fotos o escaneos suelen reducirse entre un 40 % y un 80 %. Los PDF de solo texto ya suelen ser ligeros y pueden cambiar muy poco. Siempre verás el tamaño exacto antes y después.',
    },
    {
      question: '¿El texto seguirá siendo legible y seleccionable?',
      answer:
        'Sí, con el modo predeterminado. Solo se recomprimen las imágenes; el texto y los gráficos vectoriales no se tocan. La excepción es el modo opcional “convertir páginas en imágenes”, que está claramente indicado.',
    },
    {
      question: '¿Se sube mi PDF a un servidor?',
      answer: 'No. La compresión se ejecuta por completo en tu navegador, en tu dispositivo. El archivo no se envía a ningún sitio.',
    },
    {
      question: '¿Qué nivel de compresión elijo?',
      answer:
        'La recomendada equilibra tamaño y calidad para enviar por correo o subir a formularios. La ligera mantiene las imágenes más cerca del original. La fuerte es la mejor cuando necesitas el archivo más pequeño posible.',
    },
    {
      question: '¿Por qué mi archivo no se hizo más pequeño?',
      answer:
        'Algunos PDF ya están bien optimizados o contienen sobre todo texto y gráficos vectoriales que no se benefician de la recompresión. En ese caso conservamos tu original en lugar de hacerlo más grande.',
    },
  ],
  ui,
};

export default content;
