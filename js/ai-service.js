/**
 * Puente Digital 2.0 - Mi Compañero Digital (AIService)
 * Motor de Inteligencia Pedagógica y Acompañamiento Empático para Personas Mayores.
 * Diseñado con respuestas por pasos numerados, lenguaje sin tecnicismos y acciones directas.
 */

const AIService = (() => {
  // Base de Conocimiento Educativa Integrada con PUENTE_DATA
  const KNOWLEDGE_BASE = [
    {
      keywords: ['foto', 'fotografía', 'imagen', 'mandar foto', 'enviar foto', 'galeria', 'adjuntar'],
      title: 'Cómo enviar una fotografía por WhatsApp',
      answer: '¡Es muy lindo compartir fotos con la familia! Vamos paso a paso sin apurarnos:',
      steps: [
        'Abrí WhatsApp y tocá el chat de la persona a quien querés mandarle la foto.',
        'Al lado de donde escribís los mensajes, buscá el dibujito de un ganchito de papel (📎) o una camarita (📷).',
        'Tocá la opción "Galería" para ver todas tus fotos guardadas.',
        'Elegí la foto que te guste tocándola una vez.',
        'Presioná el botón circular verde con la flechita para enviarla.'
      ],
      tip: '💡 Podés practicar esto ahora mismo en nuestro Simulador de WhatsApp sin ningún peligro.',
      action: {
        type: 'OPEN_SIMULATOR',
        target: 'whatsapp-modal',
        label: '📲 Practicar en Simulador de WhatsApp'
      }
    },
    {
      keywords: ['tilde', 'tildes', 'palomita', 'palomitas', 'visto', 'doble tilde', 'azul', 'gris'],
      title: 'El significado de los tildes en WhatsApp',
      answer: 'Los tildes al costado de tus mensajes te indican qué pasó con lo que escribiste:',
      steps: [
        'Un tilde gris (✓): Tu mensaje ya salió de tu teléfono correctamente.',
        'Dos tildes grises (✓✓): El mensaje ya llegó al teléfono de tu familiar.',
        'Dos tildes azules (✓✓): Tu familiar ya abrió la conversación y vio el mensaje.'
      ],
      tip: '🧘 Consejo de tranquilidad: Si no te responden enseguida, no te preocupes. Quizás están ocupados o manejando y te contestarán más tarde.',
      action: {
        type: 'OPEN_LESSON',
        target: 'c2-1',
        label: '📖 Ver lección completa de WhatsApp'
      }
    },
    {
      keywords: ['audio', 'grabar voz', 'microfono', 'mandar audio', 'grabar mensaje'],
      title: 'Cómo mandar un mensaje de voz o audio',
      answer: 'Mandar audios es ideal para no cansar los dedos escribiendo. Es muy fácil:',
      steps: [
        'Entrá al chat de tu familiar en WhatsApp.',
        'Abajo a la derecha verás un botón verde con el dibujo de un micrófono (🎤).',
        'Mantenelo apretado con la yema del dedo mientras hablás despacio y claro.',
        'Cuando termines de hablar, soltá el botón y el audio se enviará solito.'
      ],
      tip: '💡 Si te cansás de mantener apretado, deslizá el dedo hacia arriba hasta el candadito para hablar sin sostener.',
      action: {
        type: 'OPEN_SIMULATOR',
        target: 'whatsapp-modal',
        label: '📲 Probar envío de audios en WhatsApp'
      }
    },
    {
      keywords: ['videollamada', 'camara', 'llamar con video', 'ver la cara', 'llamada con video'],
      title: 'Cómo hacer una videollamada para verte cara a cara',
      answer: 'Las videollamadas te permiten ver las sonrisas de tus seres queridos a la distancia:',
      steps: [
        'Abrí WhatsApp y tocá el nombre de tu familiar.',
        'Arriba a la derecha buscá el ícono con forma de camarita de video (📹).',
        'Tocá la camarita y confirmá tocando "Llamar".',
        'Esperá a que la otra persona atienda. Asegurate de tener buena luz de frente.',
        'Para cortar cuando terminen de charlar, tocá el botón circular rojo grande.'
      ],
      tip: '💡 Siempre es mejor hacer videollamadas conectados al Wi-Fi de casa para no consumir datos móviles.',
      action: {
        type: 'OPEN_LESSON',
        target: 'c2-2',
        label: '📖 Ver lección de Videollamadas'
      }
    },
    {
      keywords: ['descargar', 'instalar', 'bajar app', 'play store', 'aplicacion', 'pami movil', 'tienda'],
      title: 'Cómo descargar una aplicación de forma segura',
      answer: 'Descargar aplicaciones en tu celular es totalmente seguro si seguís esta regla de oro:',
      steps: [
        'Buscá en tu celular el ícono con forma de triángulo de colores llamado "Play Store".',
        'Arriba en la barra de búsqueda escribí el nombre de la app (por ejemplo: "PAMI Móvil").',
        'Fijate bien que diga el creador oficial y no tenga la palabra "Anuncio" o "Patrocinado".',
        'Tocá el botón verde "Instalar" una sola vez.',
        'Esperá unos minutos sin tocar la pantalla hasta que el botón diga "Abrir".'
      ],
      tip: '🛡️ Regla de oro: Jamás descargues aplicaciones de enlaces que te manden por mensaje o WhatsApp.',
      action: {
        type: 'OPEN_SIMULATOR',
        target: 'playstore-modal',
        label: '📲 Probar Simulador de Play Store'
      }
    },
    {
      keywords: ['estafa', 'trampa', 'banco', 'mensaje raro', 'sorteo', 'plata', 'sospechoso', 'cuento del tio', 'seguridad', 'premios'],
      title: 'Cómo reconocer un mensaje falso o estafa',
      answer: 'Tu tranquilidad y seguridad son lo más valioso. Prestá atención a estas 3 señales:',
      steps: [
        '1. La urgencia: Si te dicen "Tu cuenta se bloqueará en 5 minutos", respirá hondo. El banco nunca te apura.',
        '2. Las claves: Jamás des tu contraseña, usuario ni código de seguridad por mensaje ni por llamada.',
        '3. El familiar con número nuevo: Si te escribe alguien diciendo que es tu hijo o nieto y pide plata urgente, llamalo a su número de siempre para escuchar su voz real.'
      ],
      tip: '💡 Podés entrenar tu ojo con nuestro Detector de Estafas interactivo.',
      action: {
        type: 'OPEN_SIMULATOR',
        target: 'scam-modal',
        label: '🛡️ Practicar en el Detector de Estafas'
      }
    },
    {
      keywords: ['turno', 'medico', 'pami', 'anses', 'doctor', 'clinica', 'sacar turno', 'hospital'],
      title: 'Cómo sacar un turno médico por Internet sin hacer filas',
      answer: 'Sacar turnos por Internet te ahorra madrugar y hacer colas en la calle. Es muy sencillo:',
      steps: [
        'Tené a mano tu DNI físico y tu carnet de PAMI o credencial médica sobre la mesa.',
        'Entrá únicamente a la página web oficial (ejemplo: pami.org.ar o anses.gob.ar).',
        'Buscá el botón grande que dice "Solicitar Turno" o "Turnos Online".',
        'Elegí el día y la hora que te queden más cómodos.',
        'Sacale una foto a la pantalla con otro celular o anotá el número de turno en tu libreta.'
      ],
      tip: '💡 Las páginas oficiales del Estado terminan siempre en ".gob.ar".',
      action: {
        type: 'OPEN_LESSON',
        target: 'c2-4',
        label: '📖 Ver lección de Turnos Médicos'
      }
    },
    {
      keywords: ['wifi', 'wi-fi', 'internet', 'conectar', 'red', 'modem', 'abanico', 'ondas'],
      title: 'Cómo conectarse a la red Wi-Fi de tu casa',
      answer: 'El Wi-Fi es la conexión invisible de tu casa que te permite navegar gratis:',
      steps: [
        'Fijate arriba a la derecha de la pantalla: el símbolo de Wi-Fi parece un abanico con ondas.',
        'Entrá en "Ajustes" o "Configuración" de tu celular.',
        'Tocá donde dice "Wi-Fi" o "Conexiones".',
        'Elegí el nombre de la red de tu casa.',
        'Escribí la contraseña que está anotada en la etiqueta debajo del módem.'
      ],
      tip: '💡 Respetá las mayúsculas y minúsculas tal cual están en la etiqueta del módem.',
      action: {
        type: 'OPEN_LESSON',
        target: 'c1-3',
        label: '📖 Ver lección de Conexión Wi-Fi'
      }
    },
    {
      keywords: ['teclado', 'escribir', 'borrar', 'dictar', 'microfono teclado', 'letras', 'numeros'],
      title: 'Escribir con el teclado y dictar con la voz',
      answer: 'Escribir en la pantalla táctil no tiene por qué ser molesto:',
      steps: [
        'La tecla con una cruz (⌫) borra la última letra si te equivocaste.',
        'La barra larga de abajo sirve para dejar espacio entre palabras.',
        'El gran truco: en el teclado hay un pequeño micrófono (🎤). Si lo tocás, podés hablarle y el celular escribirá solito lo que decís.',
        'Para poner números, tocá la tecla "?123" en la esquina.'
      ],
      tip: '💡 Dictarle al celular es la forma más cómoda para descansar los dedos.',
      action: {
        type: 'OPEN_LESSON',
        target: 'c1-4',
        label: '📖 Ver lección del Teclado y Dictado'
      }
    },
    {
      keywords: ['clave', 'contraseña', 'password', 'olvidar', 'segura', 'proteger'],
      title: 'Cómo crear contraseñas fáciles de recordar y difíciles de adivinar',
      answer: 'El truco de la frase conocida es la mejor forma de no olvidarte tus claves:',
      steps: [
        'Pensá en una frase que te guste mucho (ej: "Mi nieto Mateo nació en el 2018!").',
        'Tomá la primera letra de cada palabra: MnMne2018!',
        'Queda una clave súper fuerte que ningún programa puede adivinar.',
        'Anotala en un cuaderno exclusivo en un cajón seguro de tu casa.'
      ],
      tip: '🚫 Nunca uses 123456, tu fecha de nacimiento ni tu nombre de pila.',
      action: {
        type: 'OPEN_LESSON',
        target: 'c3-1',
        label: '📖 Ver lección de Contraseñas Seguras'
      }
    },
    {
      keywords: ['romper', 'miedo', 'desconfigurar', 'toque', 'pantalla tactil', 'gestos'],
      title: 'La regla más importante: ¡Tocar la pantalla no rompe nada!',
      answer: 'Queremos que recuerdes siempre esto con total tranquilidad:',
      steps: [
        'Tocar un botón por error no puede romper el celular ni la computadora.',
        'Siempre hay una flechita de marcha atrás (←) para volver a donde estabas.',
        'El toque debe ser suave con la yema del dedo, como acariciando una burbuja.',
        'Para agrandar fotos o letras, separá dos dedos sobre la pantalla despacio.'
      ],
      tip: '✨ En Puente Digital podés equivocarte tantas veces como quieras. Estamos para acompañarte.',
      action: {
        type: 'OPEN_LESSON',
        target: 'c1-1',
        label: '📖 Conociendo tu celular desde cero'
      }
    }
  ];

  // Proveedor de API externo opcional (ej: Gemini API en backend)
  let externalApiProvider = null;

  // Analizador de intención en lenguaje natural
  function queryLocalKnowledge(userText) {
    if (!userText || typeof userText !== 'string') return null;
    const cleanText = userText
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar tildes para matching tolerante
      .trim();

    // 1. Buscar coincidencia por palabras clave
    let bestMatch = null;
    let highestScore = 0;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        const cleanKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (cleanText.includes(cleanKw)) {
          score += cleanKw.length; // Priorizar palabras clave más específicas
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && highestScore > 0) {
      return bestMatch;
    }

    // 2. Respuesta general empática por defecto
    return {
      title: 'Estoy aquí para acompañarte',
      answer: '¡Qué buena pregunta! En Puente Digital vamos paso a paso para que aprendas sin presiones.',
      steps: [
        'Podés elegir cualquiera de nuestros 3 niveles de aprendizaje desde la sección "Aprender".',
        'O podés practicar en nuestros simuladores de teléfono sin miedo a equivocarte.',
        'Si tenés dudas con una lección específica, podés tocar el botón "🔊 Escuchar" para oírla explicada con calma.'
      ],
      tip: '💡 Podés preguntarme cosas como: "¿Cómo mando una foto?", "¿Qué significan los tildes?", o "¿Cómo saber si un mensaje es una estafa?".',
      action: {
        type: 'NAVIGATE',
        target: '#cursos-section',
        label: '📚 Ver todos los cursos'
      }
    };
  }

  // Método principal para responder
  async function ask(query) {
    // Si hay un proveedor externo configurado, intentar utilizarlo
    if (externalApiProvider && typeof externalApiProvider === 'function') {
      try {
        const externalResponse = await externalApiProvider(query);
        if (externalResponse) return externalResponse;
      } catch (err) {
        console.warn('AIService: Proveedor externo falló, recurriendo al conocimiento local', err);
      }
    }

    // Respuesta inmediata con base de conocimiento local
    const result = queryLocalKnowledge(query);
    return result;
  }

  // --- Soporte para Reconocimiento de Voz (Speech to Text) ---
  let recognitionInstance = null;

  function isSpeechRecognitionSupported() {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
  }

  function startSpeechRecognition(onResult, onError, onEnd) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError('Tu navegador no soporta dictado por voz.');
      return null;
    }

    if (recognitionInstance) {
      try { recognitionInstance.abort(); } catch (e) {}
    }

    recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'es-ES';
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    recognitionInstance.onerror = (event) => {
      if (onError) onError(event.error);
    };

    recognitionInstance.onend = () => {
      if (onEnd) onEnd();
    };

    try {
      recognitionInstance.start();
    } catch (err) {
      if (onError) onError(err);
    }

    return recognitionInstance;
  }

  function stopSpeechRecognition() {
    if (recognitionInstance) {
      try { recognitionInstance.stop(); } catch (e) {}
      recognitionInstance = null;
    }
  }

  function setApiProvider(providerFn) {
    externalApiProvider = providerFn;
  }

  return {
    ask,
    queryLocalKnowledge,
    isSpeechRecognitionSupported,
    startSpeechRecognition,
    stopSpeechRecognition,
    setApiProvider,
    KNOWLEDGE_BASE
  };
})();

// Exportar globalmente
window.AIService = AIService;
