import type { ToolContent } from '../../types';
import type { WordCounterUi } from './en';

const ui: WordCounterUi = {
  inputLabel: 'Tu texto',
  placeholder: 'Escribe o pega tu texto aquí…',
  clear: 'Borrar',
  stats: {
    words: 'Palabras',
    characters: 'Caracteres',
    charactersNoSpaces: 'Caracteres sin espacios',
    sentences: 'Oraciones',
    paragraphs: 'Párrafos',
    reading: 'Tiempo de lectura',
    speaking: 'Tiempo hablando',
  },
  seconds: '{s} s',
  minutes: '{m} min',
  minutesSeconds: '{m} min {s} s',
  privacyNote: 'Tu texto se queda en este dispositivo. No se envía a ningún sitio ni se guarda.',
};

const content: ToolContent<WordCounterUi> = {
  name: 'Contador de palabras',
  tagline: 'Cuenta palabras, caracteres, oraciones y tiempo de lectura mientras escribes.',
  description:
    'Pega o escribe cualquier texto para contar palabras, caracteres con y sin espacios, oraciones y párrafos, además del tiempo de lectura y de exposición. Al instante y en privado.',
  seo: {
    title: 'Contador de palabras y caracteres online – Gratis',
    description:
      'Contador de palabras gratis: cuenta palabras, caracteres con y sin espacios, oraciones y párrafos, y el tiempo de lectura al escribir. Tu texto no sale de tu equipo.',
  },
  keywords: ['contador de palabras', 'contador de caracteres', 'contar palabras', 'contar caracteres', 'cuantas palabras tiene un texto', 'contador de letras'],
  aliases: ['cuantas palabras', 'contar letras', 'contador de palabras online', 'numero de palabras', 'calcular tiempo de lectura', 'contar palabras de un texto'],
  howTo: [
    { title: 'Añade tu texto', text: 'Escribe en el cuadro o pega texto de un documento, un correo o una página web.' },
    { title: 'Consulta los recuentos', text: 'Las palabras, caracteres, oraciones, párrafos y el tiempo de lectura se actualizan al instante mientras escribes.' },
    { title: 'Ajusta tu texto', text: 'Recorta o amplía tu texto hasta que cumpla el límite que necesitas, como un tuit, una meta descripción o un trabajo.' },
  ],
  about: [
    'El contador de palabras muestra la extensión de cualquier texto mientras escribes: palabras, caracteres con y sin espacios, oraciones y párrafos, además de una estimación de cuánto se tarda en leerlo o decirlo en voz alta.',
    'El recuento entiende el idioma, así que las letras con tilde, la ñ, las contracciones y los emojis se cuentan correctamente. El tiempo de lectura supone unas 230 palabras por minuto y el de exposición unas 140.',
  ],
  limitations: [
    'Cada aplicación cuenta de forma ligeramente distinta, por ejemplo con palabras con guion o números. Úsalo como guía aproximada cuando haya un límite estricto.',
    'Se ignora el formato: solo se cuenta el texto plano.',
    'Los tiempos de lectura y exposición son promedios y varían de una persona a otra.',
  ],
  faq: [
    {
      question: '¿Se envía o se guarda mi texto?',
      answer: 'No. Todo se cuenta en tu navegador, en tu propio dispositivo. Tu texto no se sube ni se almacena, y desaparece al cerrar la página.',
    },
    {
      question: '¿Los espacios cuentan como caracteres?',
      answer: 'Se muestran los dos recuentos: “Caracteres” incluye espacios y saltos de línea, y “Caracteres sin espacios” los excluye.',
    },
    {
      question: '¿Cómo se calcula el tiempo de lectura?',
      answer: 'Divide el número de palabras entre una velocidad media de lectura de unas 230 palabras por minuto. El tiempo hablando usa unas 140 palabras por minuto.',
    },
    {
      question: '¿Funciona con textos en español?',
      answer: 'Sí. Las palabras se detectan con las reglas Unicode integradas en tu navegador, que manejan tildes, la ñ y la mayoría de los sistemas de escritura.',
    },
  ],
  ui,
};

export default content;
