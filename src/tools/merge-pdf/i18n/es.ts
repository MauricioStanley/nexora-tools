import type { ToolContent } from '../../types';
import type { MergePdfUi } from './en';

const ui: MergePdfUi = {
  action: 'Unir PDF',
  dropTitle: 'Suelta tus PDF aquí',
  minFiles: 'Añade al menos {count} PDF para unirlos.',
  fixProblems: 'Quita los archivos marcados con un problema para continuar.',
  inspecting: 'Leyendo tus archivos…',
  merging: 'Uniendo el archivo {current} de {total}…',
  saving: 'Guardando tu PDF…',
  outputName: 'unido',
  downloadLabel: 'Descargar PDF unido',
  summary: { one: '{count} PDF unido · {pages} páginas', other: '{count} PDF unidos · {pages} páginas' },
};

const content: ToolContent<MergePdfUi> = {
  name: 'Unir PDF',
  tagline: 'Combina varios PDF en un solo documento, en el orden que elijas.',
  description:
    'Combina archivos PDF en un único documento en segundos y ordénalos como quieras. Todo ocurre en tu navegador, así que tus documentos siguen siendo privados.',
  seo: {
    title: 'Unir PDF online – Gratis y privado',
    description:
      'Une varios archivos PDF en un solo documento gratis. Ordénalos y combínalos al instante en tu navegador. Sin subir archivos, sin registro y sin marcas de agua.',
  },
  keywords: ['unir pdf', 'juntar pdf', 'combinar pdf', 'fusionar pdf', 'unir archivos pdf', 'unir documentos pdf', 'pegar pdf'],
  aliases: ['juntar pdf', 'combinar pdf', 'fusionar pdf', 'unir varios pdf', 'unir documentos', 'agrupar pdf'],
  howTo: [
    { title: 'Añade tus PDF', text: 'Suelta los archivos en la página o elígelos desde tu dispositivo. Puedes añadir más cuando quieras.' },
    { title: 'Ordénalos', text: 'Usa las flechas para subir o bajar archivos. Se combinan de arriba hacia abajo.' },
    { title: 'Une y descarga', text: 'Pulsa Unir PDF y descarga tu documento combinado.' },
  ],
  about: [
    'Unir PDF junta varios documentos PDF en un solo archivo. Las páginas se copian tal cual: el texto sigue siendo seleccionable, se conservan los tamaños de página y no se vuelve a comprimir nada, así que la calidad no cambia.',
    'La unión se ejecuta en tu dispositivo, en un proceso en segundo plano que mantiene la página fluida incluso con documentos grandes. Tus archivos nunca se suben.',
  ],
  limitations: [
    'Los marcadores (el índice del documento) y los campos de formulario interactivos de los archivos originales no se conservan.',
    'Los PDF protegidos con contraseña no se pueden unir. Se señalan en cuanto los añades.',
    'Hasta 50 archivos, de 150 MB cada uno y 400 MB en total. Las uniones muy grandes dependen de la memoria de tu dispositivo.',
  ],
  faq: [
    {
      question: '¿Es seguro unir PDF confidenciales aquí?',
      answer:
        'Sí. Tu navegador une los archivos en tu propio dispositivo y no se sube nada a ningún servidor. Cuando cierras o reinicias la página, los archivos desaparecen de la memoria.',
    },
    {
      question: '¿Cambiará la calidad de mis PDF?',
      answer: 'No. Las páginas se copian sin volver a comprimirse, así que el texto, las imágenes y los gráficos se ven exactamente igual que en los originales.',
    },
    {
      question: '¿Puedo cambiar el orden de los archivos?',
      answer: 'Sí. Antes de unir, usa las flechas junto a cada archivo. El archivo de arriba será la primera parte del documento.',
    },
    {
      question: '¿Cuántos archivos puedo unir a la vez?',
      answer: 'Hasta 50 PDF por unión, de hasta 150 MB cada uno y con un límite conjunto de 400 MB. Para trabajos más grandes, une por partes y luego une los resultados.',
    },
    {
      question: '¿Puedo unir PDF protegidos con contraseña?',
      answer:
        'Todavía no. Los archivos protegidos se detectan al añadirlos. Abre el archivo en tu lector de PDF, guarda una copia sin contraseña y añade esa copia.',
    },
  ],
  ui,
};

export default content;
