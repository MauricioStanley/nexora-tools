import type { ToolContent } from '../../types';
import type { PasswordGeneratorUi } from './en';

const ui: PasswordGeneratorUi = {
  passwordLabel: 'Contraseña generada',
  copy: 'Copiar contraseña',
  copied: 'Copiada',
  copyFailed: 'Tu navegador bloqueó la copia. Selecciona la contraseña y cópiala a mano.',
  regenerate: 'Nueva contraseña',
  options: 'Opciones',
  length: 'Longitud',
  characters: '{count} caracteres',
  sets: {
    upper: 'Mayúsculas (A–Z)',
    lower: 'Minúsculas (a–z)',
    digits: 'Números (0–9)',
    symbols: 'Símbolos (!@#$…)',
  },
  avoidAmbiguous: 'Evitar caracteres parecidos',
  avoidAmbiguousHint: 'Excluye I, l, 1, O, 0 y o, que se confunden fácilmente al escribir.',
  strength: { weak: 'Débil', fair: 'Aceptable', strong: 'Fuerte', veryStrong: 'Muy fuerte' },
  entropy: 'unos {bits} bits de entropía',
  privacyNote: 'Las contraseñas se crean en tu dispositivo y nunca se envían, guardan ni registran.',
};

const content: ToolContent<PasswordGeneratorUi> = {
  name: 'Generador de contraseñas',
  tagline: 'Crea contraseñas seguras y aleatorias en tu dispositivo, sin enviarlas a ningún sitio.',
  description:
    'Genera contraseñas seguras y aleatorias con la longitud y los caracteres que necesites. Se crean con el generador aleatorio seguro de tu navegador y nunca salen de tu dispositivo.',
  seo: {
    title: 'Generador de contraseñas seguras – Gratis y privado',
    description:
      'Genera contraseñas aleatorias y seguras gratis. Elige longitud, letras, números y símbolos y cópialas con un clic. Se crean en tu dispositivo y nunca se envían.',
  },
  keywords: ['generador de contraseñas', 'generador de contraseñas seguras', 'contraseña aleatoria', 'crear contraseña', 'generar contraseña', 'contraseña segura'],
  aliases: ['generador de claves', 'crear clave segura', 'generador de passwords', 'contraseña fuerte', 'generar clave aleatoria', 'creador de contraseñas'],
  howTo: [
    { title: 'Elige la longitud', text: 'Usa el control deslizante para elegir cuántos caracteres necesitas. 16 o más es una buena opción.' },
    { title: 'Elige los caracteres', text: 'Incluye mayúsculas, minúsculas, números y símbolos, y evita los caracteres parecidos si la vas a escribir a mano.' },
    { title: 'Cópiala', text: 'Copia la contraseña y guárdala en tu gestor de contraseñas. Pulsa “Nueva contraseña” para obtener otra.' },
  ],
  about: [
    'El generador de contraseñas crea claves aleatorias con el generador criptográfico de números aleatorios de tu navegador, el mismo tipo de fuente que se usa para las claves de cifrado.',
    'Cada tipo de carácter elegido aparece al menos una vez y cada carácter se elige con la misma probabilidad. El indicador de seguridad estima la entropía: cuanto más alta, más tardaría alguien en adivinarla.',
  ],
  limitations: [
    'Una contraseña fuerte no sirve si la reutilizas. Usa una distinta para cada cuenta y guárdalas en un gestor de contraseñas.',
    'Algunos sitios limitan los símbolos permitidos. Si rechazan uno, desactiva los símbolos y aumenta la longitud.',
    'Longitudes de 6 a 64 caracteres.',
  ],
  faq: [
    {
      question: '¿Es seguro generar una contraseña online?',
      answer: 'Aquí sí: la contraseña se crea en tu navegador, en tu dispositivo, y nunca se envía por internet, se guarda ni se registra.',
    },
    {
      question: '¿Qué longitud debe tener mi contraseña?',
      answer: 'Al menos 12 caracteres, y 16 o más para cuentas importantes como el correo o el banco. La longitud aporta más seguridad que los símbolos.',
    },
    {
      question: '¿Qué significa “entropía”?',
      answer: 'Mide lo impredecible que es una contraseña, en bits. Cada bit extra duplica los intentos que necesitaría un atacante. Por encima de 80 bits es muy fuerte.',
    },
    {
      question: '¿Por qué evitar caracteres parecidos?',
      answer: 'Caracteres como l, 1 e I, u O y 0, se confunden fácilmente al leer o escribir una contraseña a mano. Excluirlos facilita escribirla.',
    },
  ],
  ui,
};

export default content;
