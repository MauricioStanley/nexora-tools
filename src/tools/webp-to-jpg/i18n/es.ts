import type { ToolContent } from '../../types';
import type { WebpToJpgUi } from './en';

const ui: WebpToJpgUi = {
  action: 'Convertir a JPG',
  dropTitle: 'Suelta tus imágenes WebP aquí',
  background: 'Fondo para zonas transparentes',
  backgroundHint: 'JPG no admite transparencia, así que los píxeles transparentes se rellenan con este color.',
  animatedNotice: {
    one: '{count} imagen es animada. Solo se convertirá su primer fotograma.',
    other: '{count} imágenes son animadas. Solo se convertirá su primer fotograma.',
  },
  animated: 'Animada',
  zipName: 'convertidas-jpg.zip',
  downloadLabel: 'Descargar JPG',
  summary: { one: '{count} imagen convertida a JPG', other: '{count} imágenes convertidas a JPG' },
};

const content: ToolContent<WebpToJpgUi> = {
  name: 'WebP a JPG',
  tagline: 'Convierte imágenes WebP en archivos JPG compatibles con todo.',
  description:
    'Convierte imágenes WebP en archivos JPG que se abren en cualquier sitio, desde apps antiguas hasta impresoras y formularios. Elige la calidad, convierte por lotes y conserva tus imágenes en tu dispositivo.',
  seo: {
    title: 'Convertir WebP a JPG – Gratis y privado',
    description:
      'Convierte imágenes WebP a JPG gratis. Conversión por lotes, calidad ajustable y color de fondo para transparencias, con descarga al instante. Todo en tu navegador.',
  },
  keywords: ['webp a jpg', 'webp a jpeg', 'convertir webp', 'convertidor webp', 'pasar webp a jpg', 'abrir webp', 'guardar webp como jpg'],
  aliases: ['cambiar webp a jpg', 'imagen webp a jpg', 'webp a foto', 'webp jpg', 'convertir imagenes webp'],
  howTo: [
    { title: 'Añade imágenes WebP', text: 'Suelta uno o varios archivos WebP o elígelos desde tu dispositivo.' },
    { title: 'Elige la calidad', text: 'Selecciona la calidad JPG y, si hace falta, el color de fondo para las zonas transparentes.' },
    { title: 'Convierte y descarga', text: 'Descarga cada JPG o todos juntos en un ZIP.' },
  ],
  about: [
    'WebP es un formato moderno que usan muchas webs, pero algunas apps, editores y formularios todavía solo aceptan JPG. Esta herramienta decodifica tus imágenes WebP y las guarda como archivos JPG estándar.',
    'Como JPG no admite transparencia, las zonas transparentes se rellenan con el color de fondo que elijas (blanco por defecto). La conversión se hace en tu navegador, así que las imágenes nunca se suben.',
  ],
  limitations: [
    'Las imágenes WebP animadas se convierten como imagen fija usando su primer fotograma.',
    'Convertir un WebP con pérdida a JPG no puede recuperar el detalle perdido en la compresión original.',
    'Hasta 50 imágenes por lote, de 40 MB cada una.',
  ],
  faq: [
    {
      question: '¿Por qué convertir WebP a JPG?',
      answer: 'JPG funciona con prácticamente cualquier app, dispositivo, impresora y formulario web. Convertir evita errores de “formato no compatible” cuando no se acepta WebP.',
    },
    {
      question: '¿Qué pasa con los fondos transparentes?',
      answer: 'JPG no admite transparencia, así que los píxeles transparentes se rellenan con el color de fondo que elijas. El blanco es el predeterminado.',
    },
    {
      question: '¿La conversión es privada?',
      answer: 'Sí. Las imágenes se convierten en tu navegador, en tu dispositivo, y nunca se suben.',
    },
    {
      question: '¿Qué calidad elijo?',
      answer: 'Con el 90 % las imágenes se ven idénticas para la mayoría de usos. Bájala para obtener archivos más ligeros o súbela para máxima fidelidad.',
    },
  ],
  ui,
};

export default content;
