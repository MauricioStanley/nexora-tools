import type { ToolContent } from '../../types';
import type { WatermarkPdfUi } from './en';

const ui: WatermarkPdfUi = {
  action: 'Añadir marca de agua',
  dropTitle: 'Suelta tu PDF aquí',
  defaultText: 'CONFIDENCIAL',
  textLabel: 'Texto de la marca de agua',
  textRequired: 'Escribe el texto de la marca de agua.',
  unsupportedChars: 'Estos caracteres no se pueden usar en la marca de agua: {chars}',
  layout: 'Disposición',
  layoutDiagonal: 'Diagonal',
  layoutHorizontal: 'Horizontal',
  layoutTiled: 'Repetida',
  size: 'Tamaño del texto',
  sizeHint: 'El texto grande se reduce automáticamente para caber en la página.',
  opacity: 'Opacidad',
  color: 'Color',
  previewLabel: 'Vista previa de la marca de agua en una página',
  previewCaption: 'Vista previa en una página A4',
  inspecting: 'Leyendo tu PDF…',
  preview: { one: 'Añade la marca de agua a {count} página', other: 'Añade la marca de agua a {count} páginas' },
  outputSuffix: 'marca-de-agua',
  downloadLabel: 'Descargar PDF',
  summary: { one: 'Marca de agua añadida a {count} página', other: 'Marca de agua añadida a {count} páginas' },
};

const content: ToolContent<WatermarkPdfUi> = {
  name: 'Marca de agua en PDF',
  tagline: 'Estampa un texto como “Confidencial” o “Borrador” en todas las páginas de un PDF.',
  description:
    'Añade una marca de agua de texto a todas las páginas de un PDF: diagonal, horizontal o repetida, con el color y la opacidad que elijas. Mira la vista previa y descarga en segundos.',
  seo: {
    title: 'Poner marca de agua a un PDF – Gratis y privado',
    description:
      'Añade una marca de agua de texto a un PDF gratis: “Confidencial”, “Borrador” o tu nombre, en diagonal o repetida, con color y opacidad a tu gusto. Sin subidas.',
  },
  keywords: ['marca de agua pdf', 'poner marca de agua pdf', 'agregar marca de agua pdf', 'añadir marca de agua pdf', 'sello pdf', 'marca de agua confidencial pdf'],
  aliases: ['insertar marca de agua pdf', 'marca de agua en pdf online', 'texto en todas las paginas pdf', 'sellar pdf', 'marcar pdf como confidencial', 'proteger pdf con marca de agua'],
  howTo: [
    { title: 'Añade tu PDF', text: 'Suelta el archivo en la página o elígelo desde tu dispositivo.' },
    { title: 'Diseña la marca de agua', text: 'Escribe el texto y elige la disposición, el tamaño, la opacidad y el color. La vista previa se actualiza al momento.' },
    { title: 'Descarga', text: 'Descarga el PDF con marca de agua. Tu archivo original no cambia.' },
  ],
  about: [
    'Marca de agua en PDF estampa tu texto en todas las páginas de un documento: una gran marca diagonal, una línea horizontal en el centro o un patrón repetido que cubre toda la página.',
    'Úsala para identificar borradores, marcar documentos como confidenciales o añadir tu nombre antes de compartirlos. La marca es semitransparente, así que el contenido sigue legible, y se coloca correctamente en páginas giradas u horizontales.',
  ],
  limitations: [
    'Los PDF protegidos con contraseña no se pueden editar. Quita la protección primero.',
    'El texto usa una fuente estándar compatible con letras latinas y acentos. Por ahora no admite emojis ni alfabetos no latinos.',
    'Una marca de agua desalienta el reúso pero no bloquea el documento: alguien con un editor de PDF podría quitarla. Hasta 200 MB por PDF.',
  ],
  faq: [
    {
      question: '¿Se sube mi PDF a algún sitio?',
      answer: 'No. La marca de agua se añade en tu navegador, en tu propio dispositivo. El archivo nunca sale de él.',
    },
    {
      question: '¿Se podrá seguir leyendo el documento?',
      answer: 'Sí. La marca es semitransparente. Baja la opacidad si compite con el texto o súbela para una marca más visible.',
    },
    {
      question: '¿Puedo usar una imagen o un logo como marca de agua?',
      answer: 'Todavía no. Esta herramienta añade marcas de agua de texto, ideales para etiquetas como “Confidencial”, “Borrador” o el nombre de una empresa.',
    },
    {
      question: '¿Se puede quitar la marca de agua?',
      answer: 'Se dibuja dentro de cada página, así que se mantiene al compartir, imprimir o convertir el archivo. Aun así, alguien decidido con un editor de PDF podría quitarla.',
    },
  ],
  ui,
};

export default content;
