import type { ToolContent } from '../../types';
import type { AddPageNumbersUi } from './en';

const ui: AddPageNumbersUi = {
  action: 'Numerar páginas',
  dropTitle: 'Suelta tu PDF aquí',
  position: 'Posición',
  bottom: 'Abajo',
  top: 'Arriba',
  alignment: 'Alineación',
  left: 'Izquierda',
  center: 'Centro',
  right: 'Derecha',
  format: 'Formato',
  templatePage: 'Página {n}',
  templatePageOf: 'Página {n} de {total}',
  size: 'Tamaño del texto',
  sizeSmall: 'Pequeño',
  sizeMedium: 'Mediano',
  sizeLarge: 'Grande',
  startLabel: 'Empezar a numerar en',
  skipFirst: 'Omitir la primera página',
  skipFirstHint: 'Deja la portada sin número. La numeración empieza en la página 2.',
  nothingToNumber: 'No quedan páginas por numerar.',
  inspecting: 'Leyendo tu PDF…',
  preview: { one: 'Numera {count} página', other: 'Numera {count} páginas' },
  outputSuffix: 'numerado',
  downloadLabel: 'Descargar PDF',
  summary: { one: '{count} página numerada', other: '{count} páginas numeradas' },
};

const content: ToolContent<AddPageNumbersUi> = {
  name: 'Numerar páginas PDF',
  tagline: 'Numera las páginas de un PDF con la posición, el formato y el tamaño que elijas.',
  description:
    'Añade números de página a cualquier PDF en segundos. Elige dónde van, el formato (1, Página 1, 1 / 10…) y desde qué número empezar, todo procesado en tu navegador.',
  seo: {
    title: 'Numerar páginas PDF online – Gratis',
    description:
      'Numera las páginas de un PDF gratis. Elige posición, formato y número inicial, omite la portada y descarga al instante. Tu PDF se procesa en tu navegador.',
  },
  keywords: ['numerar paginas pdf', 'numerar pdf', 'agregar numero de pagina pdf', 'poner numeros de pagina pdf', 'paginar pdf', 'numeracion de paginas pdf'],
  aliases: ['añadir numeros de pagina pdf', 'insertar numero de pagina pdf', 'enumerar paginas pdf', 'foliar pdf', 'pagina x de y pdf', 'numerar hojas pdf'],
  howTo: [
    { title: 'Añade tu PDF', text: 'Suelta el archivo en la página o elígelo desde tu dispositivo.' },
    { title: 'Elige el estilo', text: 'Selecciona la posición, el formato (como “Página 1 de 10”), el tamaño y el número inicial. Puedes dejar la portada sin número.' },
    { title: 'Descarga', text: 'Descarga el PDF numerado. Tu archivo original no cambia.' },
  ],
  about: [
    'Numerar páginas PDF añade un número en cada página: arriba o abajo, a la izquierda, centrado o a la derecha, como número simple o como “Página 1 de 10”.',
    'Los números se colocan según cómo se ve cada página, así que las páginas giradas o en horizontal también se numeran en la esquina correcta. El resto del contenido no se toca ni se vuelve a comprimir.',
  ],
  limitations: [
    'Los PDF protegidos con contraseña no se pueden editar. Quita la protección primero.',
    'Los números se dibujan sobre la página. Si ya hay contenido en ese lugar, elige otra posición.',
    'Los números usan una fuente estándar en gris oscuro. Hasta 200 MB por PDF.',
  ],
  faq: [
    {
      question: '¿Se sube mi PDF a algún sitio?',
      answer: 'No. Los números se añaden en tu navegador, en tu propio dispositivo. El archivo nunca sale de él.',
    },
    {
      question: '¿Puedo empezar a numerar desde otro número que no sea 1?',
      answer: 'Sí. Cambia “Empezar a numerar en”, por ejemplo a 5 si el documento continúa otro.',
    },
    {
      question: '¿Cómo dejo la portada sin número?',
      answer: 'Activa “Omitir la primera página”. La portada queda limpia y la numeración empieza en la segunda página.',
    },
    {
      question: '¿Funciona con páginas horizontales o giradas?',
      answer: 'Sí. La posición se calcula según cómo se muestra cada página, así que el número aparece en el mismo lugar en todas.',
    },
  ],
  ui,
};

export default content;
