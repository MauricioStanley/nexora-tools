import type { Dictionary } from './en';

/** Diccionario de interfaz en español. Debe tener exactamente la misma forma que `en`. */
const es: Dictionary = {
  meta: {
    homeTitle: '{product}: herramientas online rápidas y privadas para PDF e imágenes',
    homeDescription:
      'Une, divide y comprime PDF, convierte y redimensiona imágenes y crea códigos QR. Gratis, sin registro y procesado en tu navegador.',
    titleTemplate: '{title} | {product}',
  },

  common: {
    byCompany: 'por {company}',
    free: 'Gratis',
    beta: 'Beta',
    comingSoon: 'Próximamente',
    viewAll: 'Ver todo',
    openTool: 'Abrir herramienta',
    toolsCount: { one: '{count} herramienta', other: '{count} herramientas' },
    close: 'Cerrar',
    or: 'o',
  },

  a11y: {
    skipToContent: 'Saltar al contenido principal',
    mainNav: 'Navegación principal',
    mobileNav: 'Menú del sitio',
    breadcrumb: 'Ruta de navegación',
    footerNav: 'Navegación del pie de página',
    opensInNewTab: '(se abre en una pestaña nueva)',
    logoHome: 'Inicio de {product}',
  },

  nav: {
    home: 'Inicio',
    tools: 'Herramientas',
    allTools: 'Todas las herramientas',
    categories: 'Categorías',
    about: 'Acerca de',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    menu: 'Menú',
  },

  search: {
    label: 'Buscar herramientas',
    placeholder: '¿Qué necesitas hacer?',
    placeholderShort: 'Buscar herramientas…',
    open: 'Buscar herramientas',
    close: 'Cerrar búsqueda',
    hint: 'Prueba con “unir pdf”, “comprimir imagen” o “código qr”.',
    noResults: 'Ninguna herramienta coincide con “{query}”.',
    noResultsHint: 'Prueba con otra palabra o explora todas las herramientas.',
    results: { one: '{count} resultado', other: '{count} resultados' },
    loading: 'Cargando…',
    loadError: 'La búsqueda no está disponible ahora. Puedes explorar todas las herramientas.',
    shortcutHint: 'para buscar',
    navigateHint: 'para moverte',
    selectHint: 'para abrir',
    suggestions: 'Populares',
    browseAll: 'Ver todas las herramientas',
  },

  language: {
    label: 'Idioma',
    current: 'Idioma actual: {language}',
    suggestion: 'Esta página también está disponible en español.',
    suggestionAction: 'Ver en español',
    dismiss: 'Descartar',
  },

  theme: {
    label: 'Tema',
    toDark: 'Cambiar a tema oscuro',
    toLight: 'Cambiar a tema claro',
  },

  home: {
    title: 'Herramientas rápidas y privadas para tus archivos de cada día.',
    subtitle:
      'Une PDF, comprime imágenes, convierte formatos y crea códigos QR en segundos. La mayoría de las herramientas funcionan por completo en tu navegador: tus archivos nunca salen de tu dispositivo.',
    ctaExplore: 'Ver todas las herramientas',
    trust: ['Gratis', 'Sin registro', 'Procesado en tu dispositivo'],
    popularTitle: 'Herramientas populares',
    popularLead: 'Las que más se usan.',
    recentTitle: 'Usadas recientemente',
    categoriesTitle: 'Explora por categoría',
    categoriesLead: 'Cada herramienta hace una sola cosa y la hace bien.',
    privacyEyebrow: 'Privacidad por diseño',
    privacyTitle: 'Tus archivos se quedan en tu dispositivo',
    privacyLead:
      'Las herramientas marcadas como “En tu dispositivo” procesan los archivos con el propio motor de tu navegador. No se sube nada, así que no hay ningún servidor que pueda guardar, leer o filtrar tus documentos.',
    privacyFlowDevice: 'Tu dispositivo',
    privacyFlowBrowser: 'Motor del navegador',
    privacyFlowResult: 'Tu resultado',
    privacyFlowNoUpload: 'Sin subidas',
    demoFiles: ['contrato.pdf', 'anexo-a.pdf', 'firmas.pdf'],
    demoResult: 'unido.pdf',
    privacyPoints: [
      {
        title: 'Sin subidas',
        text: 'Los archivos se leen y procesan en memoria, dentro de la pestaña del navegador que estás usando.',
      },
      {
        title: 'Nada se guarda',
        text: 'Los resultados solo existen en esta pestaña hasta que los descargas, empiezas de nuevo o cierras la página.',
      },
      {
        title: 'Etiquetas honestas',
        text: 'Cada herramienta indica dónde se ejecuta. Si una futura herramienta necesita un servidor, lo dirá claramente.',
      },
    ],
    whyTitle: 'Por qué {product}',
    why: [
      {
        title: 'Rápido',
        text: 'Sin colas de subida ni esperas a un servidor. La mayoría de las tareas terminan en segundos.',
      },
      {
        title: 'Privado por diseño',
        text: 'El procesamiento local hace que tus documentos se queden contigo y no en el disco de otro.',
      },
      {
        title: 'Sin registro ni fricción',
        text: 'Abre una herramienta, suelta un archivo y descarga el resultado. Sin cuentas, correos ni marcas de agua.',
      },
      {
        title: 'Pensado para móviles',
        text: 'Cada herramienta se diseña primero para el teléfono y luego se adapta a pantallas grandes.',
      },
    ],
    exploreTitle: 'Un solo lugar para tus tareas con archivos',
    exploreText: 'Herramientas para PDF, imágenes y utilidades, con más categorías en camino.',
    builtByEyebrow: 'Creado por {company}',
    builtByTitle: 'Desarrollado por un equipo que crea software profesionalmente',
    builtByText:
      '{product} es diseñado, desarrollado y operado por {company}, una empresa tecnológica que crea sitios web, aplicaciones web, productos SaaS y software a medida.',
    builtByCta: 'Visitar {company}',
  },

  directory: {
    title: 'Todas las herramientas',
    seoTitle: 'Todas las herramientas online: PDF, imágenes y códigos QR',
    seoDescription:
      'Explora todas las herramientas de {product}: une, divide y comprime PDF, convierte y redimensiona imágenes y crea códigos QR. Gratis y privado.',
    lead: 'Herramientas gratuitas para PDF, imágenes y tareas cotidianas. Elige una y empieza. Sin cuenta.',
    filterLabel: 'Filtrar herramientas',
    filterPlaceholder: 'Filtra por nombre o tarea…',
    empty: 'Ninguna herramienta coincide con el filtro.',
    showing: { one: 'Mostrando {count} herramienta', other: 'Mostrando {count} herramientas' },
  },

  category: {
    toolsIn: 'Herramientas de {category}',
    otherCategories: 'Otras categorías',
    allTools: 'Todas las herramientas',
  },

  toolPage: {
    howItWorks: 'Cómo funciona',
    about: 'Sobre esta herramienta',
    goodToKnow: 'Conviene saber',
    faq: 'Preguntas frecuentes',
    related: 'Herramientas relacionadas',
    relatedLead: 'Pasos siguientes útiles para tus archivos.',
    facts: 'Detalles',
    factsInput: 'Acepta',
    factsOutput: 'Genera',
    factsMaxSize: 'Tamaño máximo',
    factsMaxFiles: 'Archivos por tarea',
    factsProcessing: 'Procesamiento',
    factsPrice: 'Precio',
    factsPriceValue: 'Gratis, sin registro',
    perFile: '{size} por archivo',
    upToFiles: { one: '1 archivo', other: 'Hasta {count} archivos' },
    noFiles: 'No necesita archivos',
    moreInCategory: 'Más herramientas de {category}',
    exploreTitle: '¿Necesitas otra cosa?',
    exploreText: 'Explora la colección completa de herramientas gratuitas y privadas.',
    exploreAll: 'Ver todas las herramientas',
    appLabel: 'Herramienta {tool}',
  },

  privacy: {
    client: {
      label: 'En tu dispositivo',
      detail: 'Tus archivos nunca salen de tu dispositivo.',
      detailNoFiles: 'Todo lo que escribes se queda en tu dispositivo.',
    },
    hybrid: {
      label: 'Principalmente en tu dispositivo',
      detail: 'Algunos pasos usan un servidor. Los detalles están más abajo.',
    },
    server: {
      label: 'Procesado en servidor',
      detail: 'Los archivos se envían a nuestro servidor para procesarlos. Los detalles están más abajo.',
    },
    external: {
      label: 'Servicio externo',
      detail: 'Esta herramienta depende de un servicio de terceros. Los detalles están más abajo.',
    },
  },

  tool: {
    dropzone: {
      titleSingle: 'Suelta tu archivo aquí',
      titleMultiple: 'Suelta tus archivos aquí',
      or: 'o',
      chooseSingle: 'Elegir archivo',
      chooseMultiple: 'Elegir archivos',
      addMore: 'Añadir más archivos',
      replace: 'Cambiar archivo',
      dragActive: 'Suelta para añadir',
      formats: 'Formatos: {formats}',
      limitSingle: 'Hasta {size}',
      limitMultiple: 'Hasta {count} archivos de {size} cada uno',
      pasteHint: 'Consejo: también puedes pegar una imagen con Ctrl+V / ⌘+V.',
    },
    fileList: {
      title: 'Archivos seleccionados',
      count: { one: '{count} archivo', other: '{count} archivos' },
      total: '{size} en total',
      remove: 'Quitar {name}',
      removeAll: 'Quitar todos',
      moveUp: 'Subir {name}',
      moveDown: 'Bajar {name}',
      pages: { one: '{count} página', other: '{count} páginas' },
      protected: 'Protegido con contraseña',
      damaged: 'No se puede leer',
      inspecting: 'Leyendo…',
      dimensions: '{width} × {height} px',
      orderHint: 'Los archivos se combinan de arriba hacia abajo.',
    },
    rejected: {
      title: 'Algunos archivos no se añadieron',
      type: '“{name}” no es un tipo de archivo compatible.',
      size: '“{name}” supera el límite de {size}.',
      empty: '“{name}” está vacío.',
      count: 'Puedes añadir hasta {count} archivos. Los demás se omitieron.',
      total: 'Se alcanzó el límite total de {size}. Algunos archivos se omitieron.',
      signature: '“{name}” no parece un archivo {format} válido.',
      heic: '“{name}” es una foto HEIC, que los navegadores todavía no pueden convertir. En iPhone, ve a Ajustes → Cámara → Formatos → Más compatible, o comparte la foto como JPG.',
      dismiss: 'Descartar',
    },
    actions: {
      cancel: 'Cancelar',
      reset: 'Empezar de nuevo',
      download: 'Descargar',
      downloadAll: 'Descargar todo (ZIP)',
      downloadNamed: 'Descargar {name}',
      tryAnother: 'Probar con otro archivo',
      retry: 'Reintentar',
      newTask: 'Procesar más archivos',
    },
    status: {
      idle: 'Esperando archivos.',
      ready: { one: '{count} archivo listo.', other: '{count} archivos listos.' },
      preparing: 'Preparando…',
      loadingEngine: 'Cargando el motor de procesamiento…',
      processing: 'Procesando…',
      itemProgress: 'Procesando {current} de {total}…',
      percent: '{percent} % completado',
      success: '¡Listo! Tu resultado está preparado para descargar.',
      cancelled: 'Cancelado. No se guardó nada.',
      error: 'No se pudo completar la tarea.',
    },
    result: {
      title: 'Tu archivo está listo',
      titleMultiple: 'Tus archivos están listos',
      before: 'Antes',
      after: 'Después',
      smaller: '{percent} más pequeño',
      larger: '{percent} más grande',
      unchanged: 'Mismo tamaño',
      keptOriginal: 'Ya estaba optimizado; se conserva el original',
      continueWith: 'Continuar con',
      localNote:
        'Procesado en tu dispositivo. Los resultados permanecen en esta pestaña solo hasta que los descargas, empiezas de nuevo o sales de la página.',
      files: { one: '{count} archivo', other: '{count} archivos' },
      bulkNote: 'Se crearon muchos archivos, así que se agrupan en una sola descarga ZIP.',
      skipped: {
        one: '{count} archivo no se pudo procesar y se omitió: {names}',
        other: '{count} archivos no se pudieron procesar y se omitieron: {names}',
      },
      limitedByDevice: {
        one: '{count} imagen se redujo para ajustarse a los límites de memoria de este dispositivo.',
        other: '{count} imágenes se redujeron para ajustarse a los límites de memoria de este dispositivo.',
      },
    },
    options: {
      title: 'Opciones',
      quality: 'Calidad',
      qualityLow: 'Archivo más ligero',
      qualityHigh: 'Mejor calidad',
      outputFormat: 'Formato de salida',
      sameFormat: 'Igual que el original',
    },
    errors: {
      encrypted_pdf: {
        title: 'Este PDF está protegido con contraseña',
        message:
          'Todavía no podemos procesar PDF protegidos. Ábrelo en tu lector de PDF, guarda o imprime una copia sin protección y vuelve a intentarlo.',
      },
      corrupt_pdf: {
        title: 'No pudimos leer este PDF',
        message: 'Puede que el archivo esté dañado o que no sea un PDF real. Ábrelo y guarda una copia nueva en un lector de PDF.',
      },
      no_pages: {
        title: 'Este PDF no tiene páginas',
        message: 'No hay nada que procesar en este archivo. Prueba con otro PDF.',
      },
      too_many_pages: {
        title: 'Este PDF tiene demasiadas páginas',
        message: 'Esta herramienta procesa hasta {count} páginas a la vez en el navegador. Divide el PDF primero y procesa cada parte.',
      },
      invalid_range: {
        title: 'Revisa los números de página',
        message: 'Usa números y rangos como “1-3, 5, 8-10”, dentro de las páginas que tiene este PDF.',
      },
      unsupported_type: {
        title: 'Este tipo de archivo no es compatible',
        message: 'Elige un archivo en uno de los formatos indicados arriba.',
      },
      file_too_large: {
        title: 'Este archivo es demasiado grande',
        message: 'Los archivos de este tamaño no se pueden procesar de forma fiable en un navegador. Prueba con uno más pequeño.',
      },
      too_few_files: {
        title: 'Añade al menos {count} archivos',
        message: 'Esta herramienta necesita al menos {count} archivos para funcionar.',
      },
      image_decode_failed: {
        title: 'No pudimos abrir esta imagen',
        message: 'Puede que el archivo esté dañado o que use un formato que tu navegador no puede leer.',
      },
      image_too_large: {
        title: 'Esta imagen es demasiado grande para este dispositivo',
        message: 'Tu navegador no puede reservar memoria suficiente para una imagen tan grande. Prueba con una más pequeña o con un navegador de escritorio.',
      },
      encode_unsupported: {
        title: 'Tu navegador no puede crear este formato',
        message: 'Actualiza tu navegador o prueba la última versión de Chrome, Edge, Firefox o Safari.',
      },
      out_of_memory: {
        title: 'Tu dispositivo se quedó sin memoria',
        message: 'Prueba con menos archivos o más pequeños, cierra otras pestañas o usa un ordenador.',
      },
      worker_failed: {
        title: 'El motor de procesamiento no pudo iniciarse',
        message: 'Recarga la página y vuelve a intentarlo. Si sigue ocurriendo, prueba con otro navegador.',
      },
      input_required: {
        title: 'Falta información',
        message: 'Completa los campos obligatorios y vuelve a intentarlo.',
      },
      unknown: {
        title: 'Algo salió mal',
        message: 'Ocurrió un error inesperado. Vuelve a intentarlo. Si sigue ocurriendo, prueba con otro navegador.',
      },
    },
    alternative: 'Probar {tool}',
  },

  footer: {
    tagline: 'Herramientas rápidas y privadas para tus archivos de cada día.',
    productOf: '{product} es un producto de {company}.',
    visitCompany: 'Visitar {company}',
    company: 'Producto',
    legal: 'Legal',
    about: 'Acerca de',
    privacy: 'Política de privacidad',
    terms: 'Términos del servicio',
    contact: 'Contacto y soporte',
    rights: '© {year} {company}. Todos los derechos reservados.',
    localNote: 'Las herramientas marcadas como “En tu dispositivo” nunca suben tus archivos.',
  },

  pages: {
    about: {
      title: 'Acerca de {product}',
      seoTitle: 'Acerca de {product}',
      seoDescription:
        '{product} es una colección de herramientas rápidas, privadas y basadas en el navegador para tus archivos, creada y operada por {company}.',
    },
    privacy: {
      title: 'Política de privacidad',
      seoTitle: 'Política de privacidad',
      seoDescription:
        'Cómo trata {product} tus archivos y datos: procesamiento local, sin subidas en las herramientas locales y analítica mínima.',
    },
    terms: {
      title: 'Términos del servicio',
      seoTitle: 'Términos del servicio',
      seoDescription: 'Las condiciones que se aplican cuando usas {product}, las herramientas online gratuitas de {company}.',
    },
    contact: {
      title: 'Contacto y soporte',
      seoTitle: 'Contacto y soporte',
      seoDescription: 'Obtén ayuda con {product}, informa de un problema o sugiere una nueva herramienta.',
      emailLabel: 'Correo electrónico',
      companyLabel: 'Sitio web de la empresa',
    },
    notFound: {
      title: 'Página no encontrada',
      seoTitle: 'Página no encontrada',
      text: 'La página que buscas no existe o se ha movido.',
      home: 'Ir al inicio',
      tools: 'Ver todas las herramientas',
    },
    updated: 'Última actualización: {date}',
  },

  consent: {
    title: 'Ayúdanos a mejorar {product}',
    text: 'Nos gustaría usar Google Analytics para medir qué herramientas se usan. Nunca enviamos nombres ni contenidos de archivos.',
    accept: 'Permitir analítica',
    decline: 'Rechazar',
    policy: 'Política de privacidad',
  },

  root: {
    title: 'Elige tu idioma',
    continue: 'Continuar en español',
  },
};

export default es;
