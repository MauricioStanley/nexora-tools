import type { ToolContent } from '../../types';
import type { PngToJpgUi } from './en';

const ui: PngToJpgUi = {
  action: 'Convertir a JPG',
  dropTitle: 'Suelta tus imágenes PNG aquí',
  background: 'Fondo para zonas transparentes',
  backgroundHint: 'JPG no admite transparencia, así que los píxeles transparentes se rellenan con este color.',
  zipName: 'convertidas-jpg.zip',
  downloadLabel: 'Descargar JPG',
  summary: { one: '{count} imagen convertida a JPG', other: '{count} imágenes convertidas a JPG' },
};

const content: ToolContent<PngToJpgUi> = {
  name: 'PNG a JPG',
  tagline: 'Convierte imágenes PNG en archivos JPG más ligeros y compatibles con todo.',
  description:
    'Convierte imágenes PNG en archivos JPG más ligeros y aceptados en todas partes: correo, formularios, redes sociales e impresoras. Convierte por lotes sin subir nada.',
  seo: {
    title: 'Convertir PNG a JPG – Gratis, rápido y privado',
    description:
      'Convierte PNG a JPG gratis. Conversión por lotes, calidad ajustable y color de fondo para transparencias, con descarga al instante. No se sube nada.',
  },
  keywords: ['png a jpg', 'png a jpeg', 'convertir png a jpg', 'convertidor png a jpg', 'pasar png a jpg', 'cambiar png a jpg'],
  aliases: ['png jpg', 'imagen png a jpg', 'transformar png a jpg', 'png a jpg online', 'convertir imagenes png', 'png a jpg sin perder calidad'],
  howTo: [
    { title: 'Añade imágenes PNG', text: 'Suelta uno o varios archivos PNG, pega una captura de pantalla o elige imágenes desde tu dispositivo.' },
    { title: 'Elige la calidad', text: 'Selecciona la calidad JPG y el color para las zonas transparentes.' },
    { title: 'Convierte y descarga', text: 'Descarga cada JPG o todos juntos en un ZIP.' },
  ],
  about: [
    'PNG es ideal para capturas y gráficos, pero sus archivos pueden ser pesados y algunos sitios solo aceptan JPG. Esta herramienta vuelve a codificar tus PNG como archivos JPG estándar, normalmente mucho más ligeros.',
    'JPG no tiene transparencia, así que las zonas transparentes se rellenan con el color de fondo que elijas (blanco por defecto). Todo ocurre en tu navegador, así que tus imágenes nunca salen de tu dispositivo.',
  ],
  limitations: [
    'La transparencia se sustituye por un color de fondo sólido.',
    'JPG es un formato con pérdida: el texto nítido y los gráficos planos pueden mostrar pequeños artefactos con calidad baja.',
    'Hasta 50 imágenes por lote, de 40 MB cada una.',
  ],
  faq: [
    {
      question: '¿Por qué convertir PNG a JPG?',
      answer: 'Los archivos JPG suelen pesar mucho menos que los PNG en fotos y los aceptan prácticamente todas las webs, apps e impresoras.',
    },
    {
      question: '¿Qué pasa con los fondos transparentes?',
      answer: 'JPG no puede guardar transparencia, así que los píxeles transparentes se rellenan con el color de fondo que elijas. El blanco es el predeterminado.',
    },
    {
      question: '¿Perderé calidad?',
      answer: 'Con el 90 % la diferencia es prácticamente invisible en fotos. Para capturas con texto pequeño, usa 95–100 % para mantener los bordes nítidos.',
    },
    {
      question: '¿Se suben mis imágenes?',
      answer: 'No. La conversión se hace en tu navegador, en tu dispositivo. Tus imágenes nunca se envían a ningún sitio.',
    },
  ],
  ui,
};

export default content;
