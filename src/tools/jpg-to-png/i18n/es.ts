import type { ToolContent } from '../../types';
import type { JpgToPngUi } from './en';

const ui: JpgToPngUi = {
  action: 'Convertir a PNG',
  dropTitle: 'Suelta tus imágenes JPG aquí',
  sizeNote: 'PNG no tiene pérdida, así que suele pesar más que el JPG.',
  zipName: 'convertidas-png.zip',
  downloadLabel: 'Descargar PNG',
  summary: { one: '{count} imagen convertida a PNG', other: '{count} imágenes convertidas a PNG' },
};

const content: ToolContent<JpgToPngUi> = {
  name: 'JPG a PNG',
  tagline: 'Convierte fotos JPG a PNG para editar, diseñar y guardar sin pérdida.',
  description:
    'Convierte imágenes JPG a PNG, el formato sin pérdida que prefieren las herramientas de diseño, los editores y muchos formularios. Convierte por lotes directamente en tu navegador.',
  seo: {
    title: 'Convertir JPG a PNG – Gratis y privado',
    description:
      'Convierte JPG a PNG gratis. Pasa fotos por lotes a PNG sin pérdida y descárgalas una a una o en un ZIP. Todo se procesa en tu navegador y nunca se sube.',
  },
  keywords: ['jpg a png', 'jpeg a png', 'convertir jpg a png', 'convertidor jpg a png', 'pasar jpg a png', 'cambiar jpg a png'],
  aliases: ['jpg png', 'foto a png', 'transformar jpg a png', 'jpg a png online', 'convertir imagenes jpeg a png', 'jpg a png alta calidad'],
  howTo: [
    { title: 'Añade imágenes JPG', text: 'Suelta uno o varios archivos JPG, pega una imagen o elige fotos desde tu dispositivo.' },
    { title: 'Convierte', text: 'Pulsa “Convertir a PNG”. Cada imagen se guarda como PNG sin pérdida y en su tamaño original.' },
    { title: 'Descarga', text: 'Descarga cada PNG o todos juntos en un ZIP.' },
  ],
  about: [
    'JPG a PNG vuelve a guardar tus fotos en formato PNG. PNG no tiene pérdida, así que las ediciones y guardados posteriores no añaden nuevos artefactos de compresión, lo que lo convierte en un buen formato de trabajo para diseño y edición.',
    'Las imágenes conservan sus dimensiones y se giran según la orientación de la cámara. La conversión se hace en tu navegador, así que tus fotos nunca salen de tu dispositivo.',
  ],
  limitations: [
    'Convertir no recupera el detalle que ya se perdió en la compresión JPG.',
    'JPG no tiene transparencia, así que el PNG tendrá un fondo sólido. Para quitar un fondo necesitas un editor específico.',
    'Los PNG suelen pesar más que el JPG original. Hasta 50 imágenes por lote, de 40 MB cada una.',
  ],
  faq: [
    {
      question: '¿Por qué convertir JPG a PNG?',
      answer: 'Algunos editores, herramientas de diseño y formularios exigen PNG, y PNG no pierde calidad cuando editas y vuelves a guardar.',
    },
    {
      question: '¿El PNG tendrá fondo transparente?',
      answer: 'No. Un JPG no tiene información de transparencia, así que el PNG convertido mantiene el mismo fondo sólido de la foto.',
    },
    {
      question: '¿Por qué el PNG pesa más que mi JPG?',
      answer: 'PNG guarda cada píxel sin compresión con pérdida. Eso mantiene la calidad intacta, pero normalmente genera un archivo más grande, sobre todo en fotos.',
    },
    {
      question: '¿Se suben mis fotos?',
      answer: 'No. La conversión ocurre en tu navegador, en tu dispositivo. Tus fotos nunca se envían a ningún sitio.',
    },
  ],
  ui,
};

export default content;
