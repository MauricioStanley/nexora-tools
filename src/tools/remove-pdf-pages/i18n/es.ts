import type { ToolContent } from '../../types';
import type { RemovePdfPagesUi } from './en';

const ui: RemovePdfPagesUi = {
  action: 'Eliminar páginas',
  dropTitle: 'Suelta tu PDF aquí',
  pagesLabel: 'Páginas a eliminar',
  allPagesError: 'No puedes eliminar todas las páginas. Deja al menos una.',
  inspecting: 'Leyendo tu PDF…',
  pageCount: { one: 'Este PDF tiene {count} página', other: 'Este PDF tiene {count} páginas' },
  preview: { one: 'Elimina {count} página · Páginas restantes: {remaining}', other: 'Elimina {count} páginas · Páginas restantes: {remaining}' },
  outputSuffix: 'editado',
  downloadLabel: 'Descargar PDF',
  summary: {
    one: '{count} página eliminada · Páginas restantes: {remaining}',
    other: '{count} páginas eliminadas · Páginas restantes: {remaining}',
  },
};

const content: ToolContent<RemovePdfPagesUi> = {
  name: 'Eliminar páginas de PDF',
  tagline: 'Borra páginas en blanco, duplicadas o que no necesitas de un PDF en segundos.',
  description:
    'Elimina las páginas que sobran de un PDF: escaneos en blanco, duplicados, anuncios o borradores. Escribe los números de página y descarga una copia limpia, procesada en tu navegador.',
  seo: {
    title: 'Eliminar páginas de un PDF – Gratis y online',
    description:
      'Elimina páginas de un PDF gratis. Escribe las páginas o rangos que quieres quitar y descarga una copia limpia en segundos. Privado: tu PDF nunca se sube.',
  },
  keywords: ['eliminar paginas pdf', 'borrar paginas pdf', 'quitar paginas pdf', 'eliminar hojas pdf', 'borrar una pagina de un pdf', 'quitar hojas de un pdf'],
  aliases: ['eliminar paginas en blanco pdf', 'eliminar pagina de pdf', 'suprimir paginas pdf', 'borrar hoja pdf', 'quitar una pagina pdf', 'pdf eliminar pagina'],
  howTo: [
    { title: 'Añade tu PDF', text: 'Suelta el archivo en la página o elígelo desde tu dispositivo. El número de páginas aparece al instante.' },
    { title: 'Escribe las páginas a eliminar', text: 'Indica números de página y rangos, como “2, 5-7, 12”. Verás cuántas páginas quedarán.' },
    { title: 'Descarga', text: 'Descarga el nuevo PDF sin esas páginas. Tu archivo original no cambia.' },
  ],
  about: [
    'Eliminar páginas de PDF borra las páginas que indiques y conserva todo lo demás tal cual: las páginas restantes no se vuelven a generar ni a comprimir, así que el texto sigue nítido y seleccionable.',
    'Es la forma más rápida de quitar páginas en blanco de un escaneo, una portada que no necesitas o páginas duplicadas antes de enviar un documento. Para quedarte solo con algunas páginas, usa el modo “Extraer páginas” de Dividir PDF.',
  ],
  limitations: [
    'Los PDF protegidos con contraseña no se pueden editar. Quita la protección primero.',
    'Debe quedar al menos una página.',
    'Los marcadores que apuntaban a páginas eliminadas pueden dejar de funcionar. Hasta 200 MB por PDF.',
  ],
  faq: [
    {
      question: '¿Se sube mi PDF a algún sitio?',
      answer: 'No. Las páginas se eliminan en tu navegador, en tu propio dispositivo. El archivo nunca sale de él.',
    },
    {
      question: '¿Cómo elimino varias páginas a la vez?',
      answer: 'Sepáralas con comas y usa rangos: “1, 4-6, 10-” elimina la página 1, las páginas 4 a 6 y todo desde la página 10 hasta el final.',
    },
    {
      question: '¿Cambia la calidad de las demás páginas?',
      answer: 'No. Las páginas restantes se conservan tal cual, sin volver a comprimirse.',
    },
    {
      question: '¿Puedo deshacerlo?',
      answer: 'Tu archivo original nunca se modifica. Descargas una copia nueva, así que siempre puedes volver a empezar desde el original.',
    },
  ],
  ui,
};

export default content;
