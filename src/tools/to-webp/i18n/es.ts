import type { ToolContent } from '../../types';
import type { ToWebpUi } from './en';

const ui: ToWebpUi = {
  action: 'Convertir a WebP',
  dropTitle: 'Suelta tus imágenes JPG o PNG aquí',
  qualityHint: 'Alrededor del 80 % da un gran equilibrio para fotos. Usa valores más altos para gráficos con texto.',
  encoderNote: 'Tu navegador no puede crear imágenes WebP de forma nativa, así que la primera vez que conviertas se descargará un codificador WebP (unos 300 KB).',
  zipName: 'convertidas-webp.zip',
  downloadLabel: 'Descargar WebP',
  summary: { one: '{count} imagen convertida a WebP', other: '{count} imágenes convertidas a WebP' },
};

const content: ToolContent<ToWebpUi> = {
  name: 'JPG / PNG a WebP',
  tagline: 'Convierte imágenes JPG y PNG al ligero formato WebP para webs más rápidas.',
  description:
    'Convierte imágenes JPG y PNG a WebP, el formato moderno que mantiene la calidad y reduce el peso. Ideal para sitios web y apps. La conversión ocurre directamente en tu navegador.',
  seo: {
    title: 'Convertir JPG y PNG a WebP – Gratis online',
    description:
      'Convierte imágenes JPG y PNG a WebP gratis. Archivos más ligeros para webs más rápidas, con calidad ajustable y transparencia conservada. Todo en tu navegador.',
  },
  keywords: ['jpg a webp', 'png a webp', 'convertir a webp', 'convertidor webp', 'imagen a webp', 'jpeg a webp', 'pasar imagen a webp'],
  aliases: ['crear webp', 'webp para web', 'optimizar imagenes para web', 'foto a webp', 'guardar como webp'],
  howTo: [
    { title: 'Añade imágenes', text: 'Suelta archivos JPG o PNG, elígelos desde tu dispositivo o pega una imagen.' },
    { title: 'Elige la calidad', text: 'Ajusta la calidad WebP. El 80 % es un gran punto de partida para fotos.' },
    { title: 'Convierte y descarga', text: 'Compara los tamaños y descarga cada WebP o todos en un ZIP.' },
  ],
  about: [
    'WebP es un formato de imagen diseñado para la web. Con una calidad visual similar, los archivos WebP suelen ser entre un 25 % y un 35 % más ligeros que JPG y a menudo mucho más que PNG, lo que acelera la carga de las páginas y ahorra datos.',
    'Se conserva la transparencia de los PNG. La conversión usa el codificador integrado del navegador cuando existe; donde no (Safari), se descarga una sola vez un codificador WebP basado en el códec de código abierto de Google, que se ejecuta localmente. Las imágenes nunca se suben.',
  ],
  limitations: [
    'En algunos gráficos PNG que ya son muy ligeros, WebP puede no ser más pequeño. Mostramos los tamaños para que decidas.',
    'En Safari, la primera conversión descarga un codificador WebP (unos 300 KB) y puede ser más lenta que en otros navegadores.',
    'Hasta 50 imágenes por lote, de 40 MB cada una.',
  ],
  faq: [
    {
      question: '¿WebP funciona en todas partes?',
      answer: 'Todos los navegadores modernos admiten WebP, incluidos Chrome, Edge, Firefox y Safari. Algunas apps y editores antiguos quizá no, así que conserva tus originales.',
    },
    {
      question: '¿Convertir a WebP mantiene la transparencia?',
      answer: 'Sí. Las zonas transparentes de las imágenes PNG siguen siendo transparentes en el WebP.',
    },
    {
      question: '¿Se suben mis imágenes?',
      answer: 'No. Las imágenes se convierten en tu navegador, en tu dispositivo. Incluso el codificador de Safari se ejecuta localmente una vez descargado.',
    },
    {
      question: '¿Qué calidad uso?',
      answer: 'Entre el 75 % y el 85 % funciona bien para fotos. Para logotipos, capturas o imágenes con texto, prueba con el 90 % o más para mantener bordes nítidos.',
    },
  ],
  ui,
};

export default content;
