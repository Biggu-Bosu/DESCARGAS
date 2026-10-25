/* ==========================================================
   Punto Seguro · Lógica de la aplicación
   - JavaScript sin librerías.
   - Nombres de variables y funciones en ESPAÑOL y en camelCase.
   - Solo el Termómetro (módulo C) usa localStorage, y únicamente
     para guardar conteos totales del grupo (no respuestas individuales).
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   1. CONTENIDOS FIJOS
   ---------------------------------------------------------- */

// Pasos del tutorial para llamar al 911 (se usan en el módulo D y en la ventana)
const pasos911 = [
  { titulo: 'Marca 911.', texto: 'Es gratis y funciona sin saldo. Con el celular bloqueado, toca “Emergencia” en la pantalla.' },
  { titulo: 'Di qué pasa y dónde estás.', texto: 'Nombre de la escuela, calle y algo que esté cerca.' },
  { titulo: 'Responde con calma.', texto: 'No cuelgues hasta que te lo indiquen.' },
  { titulo: 'Avisa a una persona adulta.', texto: 'Busca también a un docente o a alguien de tu familia.' }
];

// Módulo A · Orientación según la situación
const contenidoAyuda = {
  sufro: {
    titulo: 'Si estás sufriendo bullying',
    mensaje: 'No es tu culpa y mereces sentirte bien en tu escuela. Pedir ayuda es un acto de valentía.',
    acciones: [
      'Habla hoy mismo con orientación o con una persona adulta de confianza (docente, tutor o tutora, familiar).',
      'Cuenta qué pasó, cuándo, dónde y quién estaba presente. Puedes escribirlo antes para no olvidar nada.',
      'Si pasa en internet, guarda capturas de pantalla y no respondas a las provocaciones.',
      'Mantente cerca de personas que te apoyan, sobre todo en recreos y salidas.',
      'Si no te escuchan a la primera, insiste con otra persona adulta.'
    ]
  },
  presencie: {
    titulo: 'Si presenciaste una situación de bullying',
    mensaje: 'Lo que viste importa. Quien observa puede marcar la diferencia sin ponerse en riesgo.',
    acciones: [
      'Avisa a un o una docente o al área de orientación lo antes posible.',
      'No grabes ni compartas videos o fotos de la situación.',
      'Después, acércate a la persona afectada y pregúntale cómo está.',
      'Puedes pedir a la persona adulta que no diga que fuiste tú quien avisó.'
    ]
  },
  conflicto: {
    titulo: 'Si tienes un conflicto con alguien',
    mensaje: 'Un desacuerdo no siempre es bullying y muchas veces se puede resolver hablando.',
    acciones: [
      'Tómate un momento para calmarte antes de hablar.',
      'Habla de cómo te sientes con frases como “yo me siento… cuando…”, en lugar de acusar.',
      'Si no logran ponerse de acuerdo, pide a orientación que les ayude a dialogar (mediación).',
      'Evita discutir por redes sociales o frente a mucha gente.'
    ]
  },
  hablar: {
    titulo: 'Si quieres hablar con alguien',
    mensaje: 'Buscar a alguien para hablar es una buena decisión, aunque no sepas cómo explicarlo.',
    acciones: [
      'Puedes acudir a orientación, con tu tutor o tutora, o con cualquier docente de confianza.',
      'Pide un momento a solas: “¿Tiene unos minutos? Quiero platicarle algo”.',
      'Si te cuesta empezar, escribe en una hoja lo que quieres decir y llévala.',
      'También puedes hablar con un familiar u otra persona adulta de confianza.'
    ]
  }
};

// Módulo D · Guía de acción (con frases de ejemplo)
const contenidoGuia = {
  mi: {
    titulo: 'Si te está pasando a ti',
    mensaje: 'No es tu culpa y no tienes que resolverlo sin apoyo.',
    acciones: [
      'Busca a una persona adulta de confianza y cuéntale lo que pasa.',
      'Guarda evidencia: fechas, lugares y capturas si es en internet.',
      'No respondas con violencia ni con insultos; puede ponerte en riesgo.',
      'Procura estar cerca de personas que te apoyan.'
    ],
    frases: [
      '“Necesito contarle algo que me está pasando en la escuela.”',
      '“Ya pasó varias veces y no sé cómo hacer que pare.”'
    ]
  },
  otra: {
    titulo: 'Si le está pasando a otra persona',
    mensaje: 'Tu apoyo puede ayudar mucho a que no se sienta sin salida.',
    acciones: [
      'Acércate y escucha sin juzgar ni presionar.',
      'Dile que lo que pasa no es su culpa.',
      'Ofrece acompañarle a hablar con una persona adulta.',
      'No difundas mensajes, fotos ni videos que le humillen.',
      'Si hay riesgo, avisa a una persona adulta aunque te pida guardar el secreto.'
    ],
    frases: [
      '“Vi lo que pasó. ¿Estás bien?”',
      '“Si quieres, te acompaño a orientación.”'
    ]
  },
  vi: {
    titulo: 'Si lo viste y no sabes cómo intervenir',
    mensaje: 'No necesitas enfrentar a nadie para ayudar.',
    acciones: [
      'No te rías ni animes a quienes molestan: el público da fuerza al bullying.',
      'Busca a una persona adulta cercana y avísale.',
      'Evita enfrentamientos; si actúas, hazlo acompañado o acompañada.',
      'Después, acércate a la persona afectada y pregúntale cómo está.',
      'No grabes para difundir.'
    ],
    frases: [
      '“Ya, déjenle en paz.” (solo si es seguro decirlo)',
      '“Maestra, en el patio están molestando a alguien.”'
    ]
  },
  yo: {
    titulo: 'Si te diste cuenta de que tus acciones lastiman a alguien',
    mensaje: 'Reconocerlo es un paso importante y valiente. Todas las personas podemos cambiar.',
    acciones: [
      'Detente: deja de hacerlo, aunque otras personas sigan.',
      'Piensa cómo se siente la otra persona.',
      'Ofrece una disculpa sincera, sin justificarte.',
      'Elimina lo que hayas publicado o compartido sobre esa persona.',
      'Habla con orientación: pueden ayudarte a reparar el daño.'
    ],
    frases: [
      '“Lo que hice estuvo mal y lo siento. No lo voy a repetir.”',
      '“Ya no usen ese apodo, a la persona le molesta.”'
    ]
  }
};

/* ----------------------------------------------------------
   2. BANCO DEL CUESTIONARIO (módulo B)
   Hay cinco tipos de reto. Cada ronda toma algunos de cada tipo,
   al azar, para que siempre sea distinta.
   ---------------------------------------------------------- */

const tiposReto = {
  clasificar: { nombre: 'Clasifica la situación', porRonda: 3 },
  claves:     { nombre: 'Encuentra la clave que falta', porRonda: 2 },
  chat:       { nombre: 'Lee el chat', porRonda: 2 },
  comparar:   { nombre: 'Detecta la diferencia', porRonda: 2 },
  accion:     { nombre: '¿Qué harías?', porRonda: 1 }
};

// Respuestas que se repiten en varios retos
const opcionesClasificar = [
  { valor: 'bullying', texto: 'Es bullying' },
  { valor: 'atender', texto: 'No es bullying, pero hay que atenderlo' },
  { valor: 'normal', texto: 'No es bullying: es parte normal de la convivencia' }
];

const opcionesClaves = [
  { valor: 'repeticion', texto: 'Falta la repetición' },
  { valor: 'intencion', texto: 'Falta la intención de dañar' },
  { valor: 'poder', texto: 'Falta el desequilibrio de poder' },
  { valor: 'ninguna', texto: 'No falta ninguna: están las tres' }
];

const opcionesComparar = [
  { valor: 'a', texto: 'Solo la A' },
  { valor: 'b', texto: 'Solo la B' },
  { valor: 'ambas', texto: 'Las dos' },
  { valor: 'ninguna', texto: 'Ninguna' }
];

const bancoCuestionario = [
  // ---------- Clasificar ----------
  { tipo: 'clasificar', correcta: 'bullying',
    escenario: 'Cada vez que agregan a Alex al grupo de mensajes del salón, alguien lo saca y escriben “aquí nadie te quiere”. Lleva así casi un mes.',
    explicacion: 'Es exclusión repetida y hecha a propósito, y varias personas actúan contra una. El bullying también ocurre en los chats.' },
  { tipo: 'clasificar', correcta: 'bullying',
    escenario: 'Desde que empezó el curso le dicen “la jirafa” a Vale por su estatura. Ella ya pidió que paren, pero cada vez más gente lo dice.',
    explicacion: 'Un apodo deja de ser broma cuando la persona pide que paren y siguen. Hay repetición, intención de molestar y un grupo contra una persona.' },
  { tipo: 'clasificar', correcta: 'bullying',
    escenario: 'Dos estudiantes de tercero le piden a Leo 20 pesos cada lunes “para que no le pase nada”.',
    explicacion: 'Es extorsión: se repite, busca intimidar y hay desequilibrio de poder (edad y número). Hay que avisar a una persona adulta cuanto antes.' },
  { tipo: 'clasificar', correcta: 'bullying',
    escenario: 'Cuando Ari participa en clase, un grupo hace ruidos y voltea los ojos. Nadie dice nada feo en voz alta, pero pasa casi todos los días.',
    explicacion: 'El bullying puede ser silencioso. Gestos y ruidos repetidos para ridiculizar a alguien también hacen daño, aunque no haya insultos ni golpes.' },
  { tipo: 'clasificar', correcta: 'bullying',
    escenario: 'Toño es parte de un grupo de amigos, pero siempre es a él a quien le esconden las cosas y graban cuando se tropieza. Él se ríe, pero en su casa dice que ya no quiere ir a la escuela.',
    explicacion: 'Entre “amigos” también puede haber bullying: siempre es la misma persona, se repite y le está afectando. Que se ría no significa que esté bien.' },
  { tipo: 'clasificar', correcta: 'bullying',
    escenario: 'Kenia llegó este año de otro estado. Casi a diario imitan su forma de hablar y le dicen que “se regrese a su pueblo”.',
    explicacion: 'Las burlas por el origen, el acento o cualquier diferencia son discriminación. Al repetirse y venir de un grupo, es bullying.' },
  { tipo: 'clasificar', correcta: 'atender',
    escenario: 'En la cancha, Sam y Dani se empujan por una falta y un maestro los separa. Nunca habían tenido problemas y no vuelve a pasar.',
    explicacion: 'Es una pelea puntual entre iguales: no se repite ni hay desequilibrio de poder. No es bullying, pero la agresión física siempre se debe atender.' },
  { tipo: 'clasificar', correcta: 'atender',
    escenario: 'Durante un trabajo en equipo, Mía se enoja y le dice a Bruno “eres un inútil”. Bruno se siente mal y no quiere volver a trabajar con ella.',
    explicacion: 'Es un conflicto: pasó una vez y no hay un grupo contra una persona. No es bullying, pero las palabras lastiman; hablarlo o pedir mediación ayuda.' },
  { tipo: 'clasificar', correcta: 'normal',
    escenario: 'Luis y Pepe eran mejores amigos, pero ya no se llevan igual. Luis ahora se junta con otras personas en el recreo y no le hace nada a Pepe.',
    explicacion: 'Las amistades cambian y cada quien puede elegir con quién juntarse. No hay intención de dañar ni burlas. Puede doler, pero no es bullying.' },
  { tipo: 'clasificar', correcta: 'normal',
    escenario: 'En un grupo de amigos todos se ponen apodos y se ríen. Cuando alguien dice “ya, eso no me gustó”, los demás paran y se disculpan.',
    explicacion: 'Es juego entre iguales: todos participan y se respeta cuando alguien pone un límite. La clave es que se detienen cuando se lo piden.' },
  { tipo: 'clasificar', correcta: 'normal',
    escenario: 'La maestra le pide a Iván frente al grupo que guarde el celular y le baja puntos por no entregar la tarea. Iván dice que “le hace bullying”.',
    explicacion: 'Aplicar las reglas de la clase no es bullying. Si Iván cree que lo tratan injustamente, puede hablarlo con respeto con la maestra o con orientación.' },

  // ---------- Encuentra la clave que falta ----------
  { tipo: 'claves', correcta: 'repeticion',
    escenario: 'Tres estudiantes de tercero rodean a Joel, de primero, y le tiran la mochila al bote de basura entre risas. Nunca había pasado y no vuelve a pasar porque un prefecto lo vio.',
    explicacion: 'Hubo intención de humillar y desequilibrio de poder (tres contra uno, mayores), pero pasó una sola vez. Aun así es grave y había que atenderlo.' },
  { tipo: 'claves', correcta: 'poder',
    escenario: 'Marco y Lalo, del mismo grado, llevan semanas lanzándose indirectas en redes. Se responden igual de fuerte y ninguno parece tener ventaja.',
    explicacion: 'Se repite y buscan molestarse, pero están en igualdad de condiciones. Es un conflicto entre iguales que conviene resolver con mediación.' },
  { tipo: 'claves', correcta: 'intencion',
    escenario: 'Desde hace semanas, un grupo de cinco amigas se sienta en la mesa donde comía Iker, porque es la única con sombra. No saben que Iker ahora come solo en las escaleras.',
    explicacion: 'Se repite y son varias personas, pero no buscan dañar: ni siquiera lo saben. Si alguien se los dice, pueden hacerle espacio.' },
  { tipo: 'claves', correcta: 'ninguna',
    escenario: 'Durante todo el semestre, varias personas del equipo le esconden los tenis a Ximena, la más nueva, antes de cada entrenamiento y se ríen cuando llega tarde.',
    explicacion: 'Están las tres claves: se repite, busca humillarla y es un grupo contra la integrante más nueva. Es bullying.' },

  // ---------- Lee el chat ----------
  { tipo: 'chat', correcta: 'b',
    chat: { nombre: '3°A 🔥', mensajes: [
      { autor: 'Dani', texto: 'jajaja ya vieron la foto de Moni dormida en clase 😂' },
      { autor: 'Beto', texto: 'pásala al grupo de toda la escuela' },
      { autor: 'Caro', texto: '😂😂😂' },
      { aviso: 'Moni salió del grupo' }
    ] },
    pregunta: 'Estás en este grupo. ¿Qué respuesta ayuda más?',
    opciones: [
      { valor: 'a', texto: 'Reaccionar con 😂 para no quedar mal' },
      { valor: 'b', texto: 'Escribir “bórrenla, no está padre” y mandarle un mensaje a Moni' },
      { valor: 'c', texto: 'Reenviarla a otro grupo para ver qué opinan' },
      { valor: 'd', texto: 'No hacer nada: no es tu problema' }
    ],
    explicacion: 'Las risas son el público que hace crecer el bullying. Un mensaje breve que no ataca a nadie y un apoyo en privado ayudan mucho sin ponerte en riesgo.' },
  { tipo: 'chat', correcta: 'b',
    chat: { nombre: 'Equipo de ciencias', mensajes: [
      { autor: 'Sofi', texto: 'oigan, ¿quién lleva la cartulina?' },
      { autor: 'Iván', texto: 'yo no, Hugo nunca hace nada 🙄' },
      { autor: 'Hugo', texto: 'sí hice mi parte, se las mandé ayer' },
      { autor: 'Iván', texto: 'ah, perdón, no lo había visto 😅' }
    ] },
    pregunta: '¿Es bullying?',
    opciones: [
      { valor: 'a', texto: 'Sí: Iván lo acusó frente a todo el equipo' },
      { valor: 'b', texto: 'No: fue un malentendido que se aclaró con respeto' },
      { valor: 'c', texto: 'Sí: cualquier comentario negativo es bullying' }
    ],
    explicacion: 'Pasó una vez, Hugo pudo defenderse y Iván se disculpó. Un comentario injusto no es bullying, aunque siempre es mejor preguntar antes de acusar.' },
  { tipo: 'chat', correcta: 'b',
    chat: { nombre: 'Grupo sin Majo 🤫', mensajes: [
      { autor: 'Ale', texto: 'ya hice el grupo, aquí no está Majo' },
      { autor: 'Rodri', texto: 'jaja perfecto, aquí ya podemos hablar de ella' },
      { autor: 'Ale', texto: 'mañana nadie le hable 😎' },
      { autor: 'Rodri', texto: 'va' }
    ] },
    pregunta: '¿Cuál es la señal de alerta más clara?',
    opciones: [
      { valor: 'a', texto: 'Que el nombre del grupo tenga un emoji' },
      { valor: 'b', texto: 'Que se organicen para excluir a alguien a propósito' },
      { valor: 'c', texto: 'Que hablen por la noche' },
      { valor: 'd', texto: 'Que sean pocas personas' }
    ],
    explicacion: 'Crear un grupo para hablar de alguien y planear ignorarle es exclusión intencional y organizada. Es una forma de bullying aunque nadie diga groserías.' },
  { tipo: 'chat', correcta: 'c',
    chat: { nombre: 'Cuenta desconocida', mensajes: [
      { autor: 'usuario_8392', texto: 'nadie te soporta' },
      { autor: 'usuario_8392', texto: 'mejor ya no vengas a la escuela' },
      { autor: 'usuario_8392', texto: 'todos se ríen de ti' }
    ] },
    pregunta: 'Recibes mensajes así desde hace una semana. ¿Qué es lo más seguro?',
    opciones: [
      { valor: 'a', texto: 'Contestar con insultos para que pare' },
      { valor: 'b', texto: 'Borrar todo y no decirle a nadie' },
      { valor: 'c', texto: 'Guardar capturas, bloquear la cuenta y contárselo a una persona adulta' },
      { valor: 'd', texto: 'Publicar los mensajes para exhibir a la cuenta' }
    ],
    explicacion: 'Es ciberacoso. Las capturas sirven como evidencia, bloquear te protege y una persona adulta puede ayudarte a reportarlo. Contestar o exhibir suele empeorarlo.' },

  // ---------- Detecta la diferencia ----------
  { tipo: 'comparar', correcta: 'b',
    versiones: {
      a: 'Ema y Gabo se pelean por el último lugar en el camión y ese día no se hablan.',
      b: 'Todos los días, un grupo le aparta el lugar a todas las personas menos a Gabo y le dice que “mejor se vaya parado”.'
    },
    explicacion: 'La A es un roce de un día entre iguales. La B se repite, es a propósito y es un grupo contra una persona.' },
  { tipo: 'comparar', correcta: 'ambas',
    versiones: {
      a: 'Durante un mes, a Pau le dejan notas en la mochila que dicen que es “rara”.',
      b: 'Durante un mes, varias cuentas comentan cada foto que sube Pau con “qué rara”.'
    },
    explicacion: 'Las dos son bullying: una pasa en persona y la otra en internet, pero ambas se repiten y buscan dañar a la misma persona.' },
  { tipo: 'comparar', correcta: 'ninguna',
    versiones: {
      a: 'Rocío no invita a Lalo a su cumpleaños porque solo pudo invitar a cinco personas.',
      b: 'En el torneo, el equipo de Lalo pierde y el otro equipo festeja con gritos.'
    },
    explicacion: 'Ninguna busca dañar a Lalo ni se repite contra él. Pueden ser momentos incómodos, pero son parte de la convivencia.' },
  { tipo: 'comparar', correcta: 'a',
    versiones: {
      a: 'Cada recreo, dos estudiantes de tercero les quitan la pelota a los de primero y les dicen que “la cancha es suya”.',
      b: 'Dos estudiantes de tercero les piden a los de primero que les presten la pelota un rato, y se la regresan.'
    },
    explicacion: 'En la A hay repetición, intimidación y diferencia de edad. En la B hay respeto: piden permiso y devuelven la pelota.' },
  { tipo: 'comparar', correcta: 'b',
    versiones: {
      a: 'Toñita se equivoca al leer en voz alta, algunas personas se ríen y la maestra pide respeto. No vuelve a pasar.',
      b: 'Desde que Toñita se equivocó, cada vez que lee alguien repite su error en voz alta y el grupo se ríe.'
    },
    explicacion: 'Un mismo hecho puede volverse bullying cuando se repite para ridiculizar. La diferencia está en la repetición y la intención.' },

  // ---------- ¿Qué harías? ----------
  { tipo: 'accion', correcta: 'a',
    escenario: 'En el baño, dos personas acorralan a otra más pequeña y le gritan. Nadie más se ha dado cuenta.',
    opciones: [
      { valor: 'a', texto: 'Salir y avisar de inmediato a la persona adulta más cercana' },
      { valor: 'b', texto: 'Grabar con el celular para tener pruebas' },
      { valor: 'c', texto: 'Meterte a separarles a empujones' },
      { valor: 'd', texto: 'Esperar a ver si se calman' }
    ],
    explicacion: 'Cuando hay riesgo, lo más seguro y rápido es buscar a una persona adulta. Grabar puede humillar más y meterte a empujones te pone en peligro.' },
  { tipo: 'accion', correcta: 'a',
    escenario: 'Tu mejor amistad te cuenta que le están molestando, pero te pide que no le digas a nadie.',
    opciones: [
      { valor: 'a', texto: 'Escucharle, ofrecer acompañarle con alguien de confianza y, si hay riesgo, avisar aunque se moleste' },
      { valor: 'b', texto: 'Guardar el secreto pase lo que pase' },
      { valor: 'c', texto: 'Ir a enfrentar a quienes le molestan' },
      { valor: 'd', texto: 'Decirle que no exagere' }
    ],
    explicacion: 'Escuchar y acompañar es lo primero. Si su seguridad está en juego, contarlo a una persona adulta es cuidarle, no traicionarle.' },
  { tipo: 'accion', correcta: 'a',
    escenario: 'Te das cuenta de que el apodo que tú inventaste para alguien ya lo usa todo el salón, y a esa persona le molesta.',
    opciones: [
      { valor: 'a', texto: 'Dejar de usarlo, pedir una disculpa y pedir a otras personas que paren' },
      { valor: 'b', texto: 'Seguir, porque ya todos lo usan' },
      { valor: 'c', texto: 'Decir que no fuiste tú' },
      { valor: 'd', texto: 'Inventar otro apodo “más leve”' }
    ],
    explicacion: 'Reconocer el daño y repararlo es valiente. Quien empezó algo también puede ayudar mucho a detenerlo.' },
  { tipo: 'accion', correcta: 'a',
    escenario: 'Alguien de nuevo ingreso come sin compañía todos los días, y escuchas que le dicen “nadie quiere estar contigo”.',
    opciones: [
      { valor: 'a', texto: 'Invitarle a sentarse con tu grupo y, si sigue pasando, avisar a tu tutor o tutora' },
      { valor: 'b', texto: 'Ignorarlo: no es tu amistad' },
      { valor: 'c', texto: 'Contestar a quienes lo dicen con un insulto más fuerte' },
      { valor: 'd', texto: 'Decirle que se cambie de escuela' }
    ],
    explicacion: 'Un gesto de inclusión le quita fuerza a la exclusión. Y si continúa, una persona adulta puede intervenir.' },
  { tipo: 'accion', correcta: 'a',
    escenario: 'Te etiquetan en un meme que se burla de alguien de tu salón y te piden que lo compartas.',
    opciones: [
      { valor: 'a', texto: 'No compartirlo, quitar tu etiqueta y reportar la publicación' },
      { valor: 'b', texto: 'Compartirlo, pero sin comentar nada' },
      { valor: 'c', texto: 'Darle “me gusta” para no quedar mal' },
      { valor: 'd', texto: 'Hacer un meme de respuesta' }
    ],
    explicacion: 'Cada vez que algo así se comparte o recibe “me gusta”, el daño se multiplica. Cortar la cadena es una forma real de ayudar.' }
];

/* ----------------------------------------------------------
   3. ENCUESTA DEL TERMÓMETRO (módulo C)
   En TODAS las preguntas, "Sí" refleja buena convivencia.
   ---------------------------------------------------------- */

const preguntasEncuesta = [
  {
    texto: '¿Sientes que en tu escuela te tratan con respeto?',
    corta: 'Me tratan con respeto',
    sugerencia: 'Hablar en grupo sobre cómo nos tratamos y qué acuerdos de respeto queremos.'
  },
  {
    texto: '¿Sientes que en tu grupo nadie es blanco de burlas constantes?',
    corta: 'Nadie es blanco de burlas constantes',
    sugerencia: 'Cuando las burlas se repiten, quienes observan pueden ayudar: no reír, acompañar y avisar.'
  },
  {
    texto: '¿Sabes a quién acudir si tienes un problema en la escuela?',
    corta: 'Sé a quién acudir',
    sugerencia: 'Pregunta quién da orientación en tu escuela y dónde encontrarle.'
  },
  {
    texto: '¿Sientes confianza para pedir ayuda a una persona adulta de la escuela?',
    corta: 'Tengo confianza para pedir ayuda',
    sugerencia: 'Empieza con alguien con quien te sientas cómodo o cómoda, aunque sea un tema pequeño.'
  },
  {
    texto: '¿Sientes que en tu grupo se apoyan cuando alguien tiene un problema?',
    corta: 'En mi grupo nos apoyamos',
    sugerencia: 'Pequeños gestos, como preguntar “¿estás bien?”, fortalecen el apoyo en el grupo.'
  }
];

// Cada respuesta suma puntos al termómetro personal (de 0 a 100)
const opcionesEncuesta = [
  { valor: 'si', texto: 'Sí', puntos: 100, estado: 'Fortaleza' },
  { valor: 'aveces', texto: 'A veces', puntos: 50, estado: 'Para mejorar' },
  { valor: 'no', texto: 'No', puntos: 0, estado: 'Necesita atención' }
];

/* ----------------------------------------------------------
   4. UTILIDADES
   ---------------------------------------------------------- */

const $ = (selector) => document.querySelector(selector);

// Crea un elemento con clase y texto (textContent evita inyectar HTML)
function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

// Mezcla un arreglo (algoritmo de Fisher-Yates) sin modificar el original
function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Muestra un panel con título, mensaje, acciones y (si hay) frases de ejemplo
function pintarOrientacion(panel, contenido) {
  panel.textContent = '';
  const titulo = crearElemento('h3', '', contenido.titulo);
  titulo.tabIndex = -1;
  const lista = crearElemento('ul', 'lista');
  contenido.acciones.forEach((accion) => lista.appendChild(crearElemento('li', '', accion)));
  panel.append(titulo, crearElemento('p', '', contenido.mensaje), lista);

  if (contenido.frases) {
    const caja = crearElemento('div', 'frases');
    caja.appendChild(crearElemento('p', 'frases__titulo', 'Frases que puedes usar'));
    contenido.frases.forEach((frase) => caja.appendChild(crearElemento('p', 'frases__frase', frase)));
    panel.appendChild(caja);
  }
  return titulo;
}

// Conecta un conjunto de botones (data-clave) con un panel de contenido
function iniciarSelector(contenedor, panel, contenidos) {
  const botones = contenedor.querySelectorAll('[data-clave]');
  botones.forEach((boton) => {
    boton.addEventListener('click', () => {
      const contenido = contenidos[boton.dataset.clave];
      if (!contenido) return;
      botones.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
      const titulo = pintarOrientacion(panel, contenido);
      // Llevamos el foco al resultado: lo lee el lector de pantalla y se ve en celular
      titulo.focus();
    });
  });
}

/* Errores de campo asociados con aria-describedby.
   El id del error se agrega solo mientras el error está visible. */
function mostrarErrorCampo(campo, error, mensaje) {
  error.textContent = mensaje;
  error.hidden = false;
  campo.setAttribute('aria-invalid', 'true');
  const ids = (campo.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
  if (!ids.includes(error.id)) ids.push(error.id);
  campo.setAttribute('aria-describedby', ids.join(' '));
}

function limpiarErrorCampo(campo, error) {
  error.hidden = true;
  error.textContent = '';
  campo.removeAttribute('aria-invalid');
  const ids = (campo.getAttribute('aria-describedby') || '').split(' ').filter((id) => id && id !== error.id);
  if (ids.length) campo.setAttribute('aria-describedby', ids.join(' '));
  else campo.removeAttribute('aria-describedby');
}

/* Grupo de opciones accesible (se usa en los módulos A, B y C).
   - role="radiogroup" y role="radio" con aria-checked.
   - Cada opción se alcanza con Tab y se elige con Enter o Espacio.
   - También funcionan las flechas del teclado. */
function crearGrupoOpciones({ contenedor, opciones, etiquetaId, enFila, alCambiar }) {
  let valorActual = null;
  let bloqueado = false;

  contenedor.textContent = '';
  contenedor.className = 'grupo-opciones' + (enFila ? ' grupo-opciones--fila' : '');
  contenedor.setAttribute('role', 'radiogroup');
  contenedor.removeAttribute('aria-invalid');
  contenedor.removeAttribute('aria-disabled');
  contenedor.removeAttribute('aria-describedby');
  if (etiquetaId) contenedor.setAttribute('aria-labelledby', etiquetaId);

  const botones = opciones.map((opcion, indice) => {
    const boton = crearElemento('button', 'opcion');
    boton.type = 'button';
    boton.setAttribute('role', 'radio');
    boton.setAttribute('aria-checked', 'false');
    boton.dataset.valor = opcion.valor;

    const marca = crearElemento('span', 'opcion__marca');
    marca.setAttribute('aria-hidden', 'true');
    boton.append(marca, crearElemento('span', 'opcion__texto', opcion.texto));

    // El evento click de un <button> también se dispara con Enter y Espacio
    boton.addEventListener('click', () => seleccionar(indice));
    boton.addEventListener('keydown', (evento) => moverConFlechas(evento, indice));
    contenedor.appendChild(boton);
    return boton;
  });

  function seleccionar(indice) {
    if (bloqueado) return;
    valorActual = opciones[indice].valor;
    botones.forEach((boton, i) => boton.setAttribute('aria-checked', String(i === indice)));
    if (alCambiar) alCambiar(valorActual);
  }

  function moverConFlechas(evento, indice) {
    const pasos = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    const paso = pasos[evento.key];
    if (!paso || bloqueado) return;
    evento.preventDefault();
    const nuevo = (indice + paso + botones.length) % botones.length;
    botones[nuevo].focus();
    seleccionar(nuevo);
  }

  return {
    elemento: contenedor,
    obtenerValor: () => valorActual,
    bloquear() {
      bloqueado = true;
      contenedor.setAttribute('aria-disabled', 'true');
      botones.forEach((boton) => boton.setAttribute('aria-disabled', 'true'));
    },
    // Marca una opción como correcta o incorrecta, con texto visible
    marcar(valor, estado, texto) {
      const boton = botones.find((b) => b.dataset.valor === valor);
      if (!boton) return;
      boton.dataset.estado = estado;
      boton.appendChild(crearElemento('span', 'opcion__estado', texto));
    },
    reiniciar() {
      valorActual = null;
      botones.forEach((boton) => boton.setAttribute('aria-checked', 'false'));
    },
    enfocar() {
      const elegido = botones.find((b) => b.getAttribute('aria-checked') === 'true');
      (elegido || botones[0]).focus();
    }
  };
}

/* ----------------------------------------------------------
   5. VENTANAS EMERGENTES Y MENSAJES (con el diseño de la app)
   Usamos <dialog>: el navegador atrapa el foco dentro de la
   ventana y la cierra con Escape. Así no usamos alert() ni confirm().
   ---------------------------------------------------------- */

let elementoAntesDeVentana = null;

function abrirVentana(ventana) {
  elementoAntesDeVentana = document.activeElement;
  if (typeof ventana.showModal === 'function') ventana.showModal();
  else ventana.setAttribute('open', ''); // navegadores muy viejos
}

function cerrarVentana(ventana) {
  if (typeof ventana.close === 'function') ventana.close();
  else ventana.removeAttribute('open');
}

function prepararVentana(ventana) {
  // Botones con data-cerrar
  ventana.querySelectorAll('[data-cerrar]').forEach((boton) => {
    boton.addEventListener('click', () => cerrarVentana(ventana));
  });
  // Clic en el fondo oscuro (fuera de la caja) también cierra
  ventana.addEventListener('click', (evento) => {
    if (evento.target === ventana) cerrarVentana(ventana);
  });
  // Al cerrar, el foco vuelve a donde estaba
  ventana.addEventListener('close', () => {
    if (elementoAntesDeVentana && elementoAntesDeVentana.focus) elementoAntesDeVentana.focus();
  });
}

/* Ventana de confirmación. Devuelve una promesa:
   true si la persona acepta, false si cancela o cierra. */
function confirmar({ titulo, texto, aceptar }) {
  const ventana = $('#ventanaConfirmar');
  $('#tituloConfirmar').textContent = titulo;
  $('#textoConfirmar').textContent = texto;
  $('#botonAceptarConfirmar').textContent = aceptar || 'Aceptar';

  return new Promise((resolver) => {
    let respuesta = false;
    const alAceptar = () => { respuesta = true; cerrarVentana(ventana); };
    const alCancelar = () => cerrarVentana(ventana);
    const alCerrar = () => {
      $('#botonAceptarConfirmar').removeEventListener('click', alAceptar);
      $('#botonCancelarConfirmar').removeEventListener('click', alCancelar);
      ventana.removeEventListener('close', alCerrar);
      resolver(respuesta);
    };
    $('#botonAceptarConfirmar').addEventListener('click', alAceptar);
    $('#botonCancelarConfirmar').addEventListener('click', alCancelar);
    ventana.addEventListener('close', alCerrar);
    abrirVentana(ventana);
    $('#botonCancelarConfirmar').focus(); // la opción segura queda enfocada
  });
}

// Mensaje breve que aparece abajo y se va solo
let temporizadorToast = null;
function mostrarToast(texto) {
  const toast = $('#toast');
  toast.textContent = texto;
  toast.hidden = false;
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => { toast.hidden = true; }, 3500);
}

// Llena las listas del tutorial del 911 y conecta los botones que lo abren
function iniciarTutorial911() {
  document.querySelectorAll('[data-tutorial-911]').forEach((lista) => {
    lista.textContent = '';
    pasos911.forEach((paso) => {
      const elemento = crearElemento('li');
      elemento.append(crearElemento('strong', '', paso.titulo + ' '), document.createTextNode(paso.texto));
      lista.appendChild(elemento);
    });
  });

  const ventana = $('#ventana911');
  prepararVentana(ventana);
  prepararVentana($('#ventanaConfirmar'));

  // Delegación: cualquier botón con data-abrir-911, aunque se cree después
  document.addEventListener('click', (evento) => {
    if (evento.target.closest('[data-abrir-911]')) abrirVentana(ventana);
  });
}

/* ----------------------------------------------------------
   6. NAVEGACIÓN ENTRE VISTAS (usa el # de la dirección)
   ---------------------------------------------------------- */

const titulosVistas = {
  inicio: 'Inicio',
  ayuda: 'Necesito ayuda',
  aprende: 'Aprende a reconocerlo',
  termometro: 'Termómetro de convivencia',
  guia: '¿Cómo puedo ayudar?'
};

function obtenerVistaDesdeHash() {
  const nombre = window.location.hash.slice(1);
  return Object.prototype.hasOwnProperty.call(titulosVistas, nombre) ? nombre : null;
}

function mostrarVista(nombre, moverFoco) {
  document.querySelectorAll('.vista').forEach((vista) => {
    vista.hidden = vista.dataset.vista !== nombre;
  });
  document.querySelectorAll('[data-enlace]').forEach((enlace) => {
    if (enlace.dataset.enlace === nombre) enlace.setAttribute('aria-current', 'page');
    else enlace.removeAttribute('aria-current');
  });
  document.title = `${titulosVistas[nombre]} · Punto Seguro`;
  document.body.dataset.vista = nombre; // el CSS lo usa para no repetir el bloque urgente

  if (moverFoco) {
    window.scrollTo(0, 0);
    const titulo = document.querySelector(`#vista-${nombre} h1`);
    if (titulo) titulo.focus({ preventScroll: true });
  }
}

function iniciarNavegacion() {
  const botonMenu = $('#botonMenu');
  const menu = $('#menuPrincipal');

  function cambiarMenu(abrir) {
    botonMenu.setAttribute('aria-expanded', String(abrir));
    botonMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('menu--abierto', abrir);
  }

  botonMenu.addEventListener('click', () => {
    cambiarMenu(botonMenu.getAttribute('aria-expanded') !== 'true');
  });

  // Al elegir una sección, el menú del celular se cierra
  menu.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) cambiarMenu(false);
  });

  // Escape cierra el menú y regresa el foco al botón
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && botonMenu.getAttribute('aria-expanded') === 'true') {
      cambiarMenu(false);
      botonMenu.focus();
    }
  });

  // Hashes que no son vistas (como #contenido del enlace "Saltar") se ignoran
  window.addEventListener('hashchange', () => {
    const vista = obtenerVistaDesdeHash();
    if (vista) mostrarVista(vista, true);
  });

  mostrarVista(obtenerVistaDesdeHash() || 'inicio', false);
}

/* ----------------------------------------------------------
   7. MÓDULO A · NECESITO AYUDA
   Solo muestra orientación según la situación elegida.
   No hay formulario: la app no recibe ni guarda nada de lo
   que vive el estudiante.
   ---------------------------------------------------------- */

function iniciarModuloAyuda() {
  iniciarSelector($('#selectorAyuda'), $('#orientacionAyuda'), contenidoAyuda);
}

/* ----------------------------------------------------------
   8. MÓDULO B · CUESTIONARIO
   El progreso vive solo en estas variables (en memoria).
   ---------------------------------------------------------- */

// Arma una ronda: toma al azar cierta cantidad de cada tipo de reto
function crearRonda() {
  const elegidas = Object.entries(tiposReto).flatMap(([tipo, datos]) =>
    mezclar(bancoCuestionario.filter((reto) => reto.tipo === tipo)).slice(0, datos.porRonda)
  );
  return mezclar(elegidas);
}

// Pregunta y opciones de cada reto según su tipo
function obtenerPreguntaYOpciones(reto) {
  switch (reto.tipo) {
    case 'clasificar':
      return { pregunta: '¿Cómo clasificarías esta situación?', opciones: opcionesClasificar };
    case 'claves':
      return { pregunta: '¿Cuál de las tres claves del bullying falta aquí?', opciones: opcionesClaves };
    case 'comparar':
      return { pregunta: '¿Cuál de las dos situaciones es bullying?', opciones: opcionesComparar };
    default:
      // chat y acción traen sus propias opciones; se revuelven para no memorizar el orden
      return { pregunta: reto.pregunta || '¿Qué es lo mejor que puedes hacer?', opciones: mezclar(reto.opciones) };
  }
}

// Dibuja la situación: texto, chat simulado o dos versiones lado a lado
function pintarEscenario(contenedor, reto) {
  contenedor.textContent = '';

  if (reto.tipo === 'chat') {
    const chat = crearElemento('div', 'chat');
    chat.setAttribute('role', 'group');
    chat.setAttribute('aria-label', `Conversación del chat ${reto.chat.nombre}`);
    chat.appendChild(crearElemento('p', 'chat__nombre', reto.chat.nombre));
    reto.chat.mensajes.forEach((mensaje) => {
      if (mensaje.aviso) {
        chat.appendChild(crearElemento('p', 'chat__aviso', mensaje.aviso));
        return;
      }
      const burbuja = crearElemento('div', 'chat__burbuja');
      burbuja.append(crearElemento('span', 'chat__autor', mensaje.autor), crearElemento('span', '', mensaje.texto));
      chat.appendChild(burbuja);
    });
    contenedor.appendChild(chat);
    return;
  }

  if (reto.tipo === 'comparar') {
    const rejilla = crearElemento('div', 'comparar');
    ['a', 'b'].forEach((letra) => {
      const tarjeta = crearElemento('div', 'comparar__tarjeta');
      tarjeta.append(
        crearElemento('span', 'comparar__letra', `Situación ${letra.toUpperCase()}`),
        crearElemento('p', '', reto.versiones[letra])
      );
      rejilla.appendChild(tarjeta);
    });
    contenedor.appendChild(rejilla);
    return;
  }

  contenedor.appendChild(crearElemento('p', 'escenario', reto.escenario));
}

// Perfil final según los aciertos
function obtenerPerfil(aciertos, total) {
  const proporcion = aciertos / total;
  if (proporcion >= 0.9) return {
    nombre: 'Detective de la convivencia',
    mensaje: 'Distingues muy bien el bullying de un conflicto y sabes qué hacer. Lo que sabes puede ayudar a tu grupo.'
  };
  if (proporcion >= 0.7) return {
    nombre: 'Mirada atenta',
    mensaje: 'Reconoces la mayoría de las señales. Repasa los retos donde dudaste y estarás en el siguiente nivel.'
  };
  if (proporcion >= 0.4) return {
    nombre: 'En entrenamiento',
    mensaje: 'Vas por buen camino. Fíjate siempre en las tres claves: repetición, intención y desequilibrio de poder.'
  };
  return {
    nombre: 'Primeros pasos',
    mensaje: 'Reconocer el bullying no siempre es fácil. Lee las claves de abajo y juega otra ronda: cada vez salen retos distintos.'
  };
}

function iniciarCuestionario() {
  const contenedorCuestionario = $('#cuestionario');
  const progresoTexto = $('#progresoTexto');
  const progresoBarra = $('#progresoBarra');
  const categoria = $('#categoriaPregunta');
  const escenario = $('#escenarioPregunta');
  const textoPregunta = $('#textoPregunta');
  const errorCuestionario = $('#errorCuestionario');
  const retro = $('#retroCuestionario');
  const botonComprobar = $('#botonComprobar');
  const botonSiguiente = $('#botonSiguiente');
  const resultado = $('#resultadoCuestionario');

  let ronda = [];
  let indicePregunta = 0;
  let aciertos = 0;
  let aciertosPorTipo = {};
  let grupo = null;
  let opcionesActuales = [];

  function nuevaRonda() {
    ronda = crearRonda();
    indicePregunta = 0;
    aciertos = 0;
    aciertosPorTipo = {};
    Object.keys(tiposReto).forEach((tipo) => { aciertosPorTipo[tipo] = { bien: 0, total: 0 }; });
  }

  function mostrarPregunta(moverFoco) {
    const reto = ronda[indicePregunta];
    const total = ronda.length;
    const { pregunta, opciones } = obtenerPreguntaYOpciones(reto);
    opcionesActuales = opciones;

    progresoTexto.textContent = `Reto ${indicePregunta + 1} de ${total}`;
    progresoBarra.style.width = `${(indicePregunta / total) * 100}%`;
    categoria.textContent = tiposReto[reto.tipo].nombre;
    pintarEscenario(escenario, reto);
    textoPregunta.textContent = pregunta;

    grupo = crearGrupoOpciones({
      contenedor: $('#opcionesCuestionario'),
      opciones,
      etiquetaId: 'textoPregunta',
      alCambiar: () => limpiarErrorCampo(grupo.elemento, errorCuestionario)
    });

    errorCuestionario.hidden = true;
    retro.hidden = true;
    botonComprobar.hidden = false;
    botonSiguiente.hidden = true;
    botonSiguiente.textContent = indicePregunta === total - 1 ? 'Ver mi resultado' : 'Siguiente reto';

    if (moverFoco) textoPregunta.focus();
  }

  function comprobar() {
    const reto = ronda[indicePregunta];
    const elegida = grupo.obtenerValor();

    if (elegida === null) {
      mostrarErrorCampo(grupo.elemento, errorCuestionario, 'Elige una opción antes de comprobar.');
      grupo.enfocar();
      return;
    }

    const esCorrecta = elegida === reto.correcta;
    aciertosPorTipo[reto.tipo].total += 1;
    if (esCorrecta) {
      aciertos += 1;
      aciertosPorTipo[reto.tipo].bien += 1;
    }

    grupo.bloquear();
    grupo.marcar(reto.correcta, 'correcta', '✓ Más adecuada');
    if (!esCorrecta) grupo.marcar(elegida, 'incorrecta', 'Tu elección');

    retro.className = 'retro ' + (esCorrecta ? 'retro--bien' : 'retro--revisa');
    retro.textContent = '';
    const encabezado = crearElemento('p');
    encabezado.appendChild(crearElemento('strong', '', esCorrecta ? '¡Bien pensado!' : 'Hay una opción más adecuada.'));
    retro.append(encabezado, crearElemento('p', '', reto.explicacion));
    retro.hidden = false;

    botonComprobar.hidden = true;
    botonSiguiente.hidden = false;
    progresoBarra.style.width = `${((indicePregunta + 1) / ronda.length) * 100}%`;
    retro.focus(); // el lector de pantalla lee la explicación; con Tab se llega a "Siguiente"
  }

  function siguiente() {
    indicePregunta += 1;
    if (indicePregunta < ronda.length) mostrarPregunta(true);
    else mostrarResultado();
  }

  function mostrarResultado() {
    const total = ronda.length;
    const perfil = obtenerPerfil(aciertos, total);

    contenedorCuestionario.hidden = true;
    resultado.hidden = false;

    $('#tituloResultado').textContent = perfil.nombre;
    $('#puntajeCuestionario').textContent = `${aciertos} de ${total} retos resueltos`;
    $('#mensajeCuestionario').textContent = perfil.mensaje + ' Recuerda: este cuestionario es educativo y no sirve para diagnosticar ninguna situación real.';

    // Desglose por tipo de reto
    const desglose = $('#desgloseCuestionario');
    desglose.textContent = '';
    Object.entries(tiposReto).forEach(([tipo, datos]) => {
      const { bien, total: totalTipo } = aciertosPorTipo[tipo];
      if (!totalTipo) return;
      const fila = crearElemento('li', 'desglose__fila');
      const estado = bien === totalTipo ? 'desglose__valor--bien' : '';
      fila.append(
        crearElemento('span', '', datos.nombre),
        crearElemento('span', `desglose__valor ${estado}`, `${bien} de ${totalTipo}`)
      );
      desglose.appendChild(fila);
    });

    $('#tituloResultado').focus();
  }

  botonComprobar.addEventListener('click', comprobar);
  botonSiguiente.addEventListener('click', siguiente);
  $('#botonReiniciar').addEventListener('click', () => {
    nuevaRonda();
    resultado.hidden = true;
    contenedorCuestionario.hidden = false;
    mostrarPregunta(true);
  });

  nuevaRonda();
  mostrarPregunta(false);
}

/* ----------------------------------------------------------
   9. MÓDULO C · TERMÓMETRO DE CONVIVENCIA
   Hay DOS resultados distintos (antes se mezclaban y confundía):
   - Personal: solo las respuestas de quien acaba de contestar.
     Vive en memoria y no se guarda.
   - Grupo: suma de todas las respuestas en este dispositivo.
     Se guarda en localStorage como conteos, por ejemplo:
     { total: 3, conteos: [ {si:2, aveces:1, no:0}, ... ] }
   ---------------------------------------------------------- */

// v3: cambió la forma de mostrar resultados; se descartan versiones viejas
const claveAlmacen = 'puntoSeguro.termometro.v3';
const clavesViejas = ['puntoSeguro.termometro.v1', 'puntoSeguro.termometro.v2'];
let resultadosEnMemoria = null; // respaldo si el navegador bloquea localStorage

function crearResultadosVacios() {
  return {
    total: 0,
    conteos: preguntasEncuesta.map(() => ({ si: 0, aveces: 0, no: 0 }))
  };
}

// Revisa que los datos guardados tengan la forma esperada
function sonResultadosValidos(datos) {
  if (!datos || !Number.isInteger(datos.total) || datos.total < 0) return false;
  if (!Array.isArray(datos.conteos) || datos.conteos.length !== preguntasEncuesta.length) return false;
  return datos.conteos.every((conteo) => {
    const claves = ['si', 'aveces', 'no'];
    const validos = claves.every((c) => Number.isInteger(conteo[c]) && conteo[c] >= 0);
    return validos && conteo.si + conteo.aveces + conteo.no === datos.total;
  });
}

function leerResultados() {
  let texto;
  try {
    texto = localStorage.getItem(claveAlmacen);
  } catch (error) {
    // El navegador bloquea localStorage: trabajamos en memoria
    $('#avisoAlmacen').hidden = false;
    return resultadosEnMemoria || crearResultadosVacios();
  }
  if (!texto) return resultadosEnMemoria || crearResultadosVacios();

  let datos = null;
  try {
    datos = JSON.parse(texto);
  } catch (error) {
    datos = null;
  }
  if (sonResultadosValidos(datos)) return datos;

  // Datos dañados: los descartamos para que la app siga funcionando
  borrarResultados();
  return crearResultadosVacios();
}

function guardarResultados(datos) {
  resultadosEnMemoria = datos;
  try {
    localStorage.setItem(claveAlmacen, JSON.stringify(datos));
  } catch (error) {
    $('#avisoAlmacen').hidden = false;
  }
}

function borrarResultados() {
  resultadosEnMemoria = null;
  try {
    localStorage.removeItem(claveAlmacen);
  } catch (error) {
    $('#avisoAlmacen').hidden = false;
  }
}

// Termómetro personal: promedio de puntos (Sí = 100, A veces = 50, No = 0)
// Ejemplo: Sí, Sí, Sí, A veces, No -> (100+100+100+50+0) / 5 = 70
function calcularTemperatura(respuestas) {
  const suma = respuestas.reduce((acumulado, valor) =>
    acumulado + opcionesEncuesta.find((opcion) => opcion.valor === valor).puntos, 0);
  return Math.round(suma / respuestas.length);
}

function obtenerClima(puntaje) {
  if (puntaje >= 80) return {
    nombre: 'Clima de confianza',
    mensaje: 'Percibes un ambiente respetuoso y con apoyo. ¡Vale la pena cuidarlo!'
  };
  if (puntaje >= 50) return {
    nombre: 'Clima variable',
    mensaje: 'Hay cosas que funcionan y otras que se pueden mejorar. Revisa las sugerencias de abajo.'
  };
  return {
    nombre: 'Clima en alerta',
    mensaje: 'Parece que la convivencia no se siente segura. Hablar con orientación o con una persona adulta de confianza puede ayudar.'
  };
}

// Porcentaje entero de una parte respecto al total
function porcentaje(parte, total) {
  return total ? Math.round((parte / total) * 100) : 0;
}

function iniciarTermometro() {
  const formulario = $('#formularioEncuesta');
  const contenedorPreguntas = $('#preguntasEncuesta');
  const errorEncuesta = $('#errorEncuesta');
  const vistaPersonal = $('#resultadoPersonal');
  const vistaGrupo = $('#resultadosGrupo');

  // Construimos las 5 preguntas, cada una con su grupo Sí / A veces / No
  const grupos = preguntasEncuesta.map((pregunta, indice) => {
    const bloque = crearElemento('div', 'pregunta-encuesta');
    const etiqueta = crearElemento('p', 'etiqueta', `${indice + 1}. ${pregunta.texto}`);
    etiqueta.id = `etiquetaEncuesta${indice}`;
    const opciones = crearElemento('div');
    bloque.append(etiqueta, opciones);
    contenedorPreguntas.appendChild(bloque);

    return crearGrupoOpciones({
      contenedor: opciones,
      opciones: opcionesEncuesta,
      etiquetaId: etiqueta.id,
      enFila: true,
      alCambiar: () => opciones.removeAttribute('aria-invalid')
    });
  });

  // Muestra solo una de las tres partes: encuesta, personal o grupo
  function mostrarParte(parte) {
    formulario.hidden = parte !== 'encuesta';
    vistaPersonal.hidden = parte !== 'personal';
    vistaGrupo.hidden = parte !== 'grupo';
  }

  // El botón del grupo solo aparece cuando ya hay respuestas guardadas
  function actualizarBotonGrupo() {
    $('#botonVerGrupo').hidden = leerResultados().total === 0;
  }

  function mostrarEncuesta() {
    grupos.forEach((grupo) => grupo.reiniciar());
    errorEncuesta.hidden = true;
    actualizarBotonGrupo();
    mostrarParte('encuesta');
    window.scrollTo(0, 0);
    grupos[0].enfocar();
  }

  function mostrarResultadoPersonal(respuestas) {
    const temperatura = calcularTemperatura(respuestas);
    const clima = obtenerClima(temperatura);

    $('#medidorRelleno').style.width = `${temperatura}%`;
    $('#puntajePersonal').textContent = `${temperatura} de 100 · ${clima.nombre}`;
    $('#mensajePersonal').textContent = clima.mensaje;

    const lista = $('#listaRespuestas');
    lista.textContent = '';
    preguntasEncuesta.forEach((pregunta, indice) => {
      const opcion = opcionesEncuesta.find((o) => o.valor === respuestas[indice]);
      const fila = crearElemento('li', `respuesta respuesta--${opcion.valor}`);
      const cabecera = crearElemento('div', 'respuesta__cabecera');
      cabecera.append(
        crearElemento('span', 'respuesta__pregunta', pregunta.corta),
        crearElemento('span', 'respuesta__estado', `${opcion.texto} · ${opcion.estado}`)
      );
      fila.appendChild(cabecera);
      if (opcion.valor !== 'si') fila.appendChild(crearElemento('p', 'respuesta__sugerencia', `Idea: ${pregunta.sugerencia}`));
      lista.appendChild(fila);
    });

    mostrarParte('personal');
    window.scrollTo(0, 0);
    $('#tituloResultadoPersonal').focus({ preventScroll: true });
  }

  function mostrarResultadosGrupo() {
    const datos = leerResultados();
    if (datos.total === 0) {
      mostrarToast('Todavía no hay respuestas del grupo. Responde la encuesta primero.');
      return;
    }

    const n = datos.total;
    $('#totalRespuestas').textContent =
      `${n} ${n === 1 ? 'persona ha respondido' : 'personas han respondido'} en este dispositivo.`;
    $('#notaPocasRespuestas').hidden = n >= 5;

    // Barra apilada con HTML y CSS: tres segmentos que suman 100 %
    const grafica = $('#grafica');
    grafica.textContent = '';
    preguntasEncuesta.forEach((pregunta, indice) => {
      const conteo = datos.conteos[indice];
      const pSi = porcentaje(conteo.si, n);
      const pAveces = porcentaje(conteo.aveces, n);
      const pNo = Math.max(0, 100 - pSi - pAveces); // así siempre suman 100 al redondear

      const fila = crearElemento('li');
      fila.appendChild(crearElemento('p', 'grafica__titulo', pregunta.corta));

      const barra = crearElemento('div', 'grafica__barra-apilada');
      barra.setAttribute('aria-hidden', 'true');
      [['si', pSi], ['aveces', pAveces], ['no', pNo]].forEach(([valor, ancho]) => {
        if (!ancho) return;
        const segmento = crearElemento('span', `grafica__segmento grafica__segmento--${valor}`);
        segmento.style.width = `${ancho}%`;
        barra.appendChild(segmento);
      });

      const detalle = `Sí ${pSi} % (${conteo.si}) · A veces ${pAveces} % (${conteo.aveces}) · No ${pNo} % (${conteo.no})`;
      fila.append(barra, crearElemento('p', 'grafica__valor', detalle));
      grafica.appendChild(fila);
    });

    mostrarParte('grupo');
    window.scrollTo(0, 0);
    $('#tituloResultadosGrupo').focus({ preventScroll: true });
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    // Revisamos que todas las preguntas tengan respuesta
    const faltantes = [];
    grupos.forEach((grupo, indice) => {
      if (grupo.obtenerValor() === null) {
        faltantes.push(indice + 1);
        grupo.elemento.setAttribute('aria-invalid', 'true');
        grupo.elemento.setAttribute('aria-describedby', 'errorEncuesta');
      } else {
        grupo.elemento.removeAttribute('aria-invalid');
        grupo.elemento.removeAttribute('aria-describedby');
      }
    });

    if (faltantes.length) {
      errorEncuesta.textContent = faltantes.length === 1
        ? `Falta responder la pregunta ${faltantes[0]}.`
        : `Faltan por responder las preguntas ${faltantes.join(', ')}.`;
      errorEncuesta.hidden = false;
      grupos[faltantes[0] - 1].enfocar();
      return;
    }
    errorEncuesta.hidden = true;

    const respuestas = grupos.map((grupo) => grupo.obtenerValor());

    // Sumamos esta respuesta a los conteos del grupo (una sola vez por envío)
    const datos = leerResultados();
    datos.total += 1;
    respuestas.forEach((valor, indice) => { datos.conteos[indice][valor] += 1; });
    guardarResultados(datos);

    grupos.forEach((grupo) => grupo.reiniciar());
    mostrarResultadoPersonal(respuestas);
  });

  $('#botonVerGrupo').addEventListener('click', mostrarResultadosGrupo);
  $('#botonVerGrupo2').addEventListener('click', mostrarResultadosGrupo);
  $('#botonResponderOtra').addEventListener('click', mostrarEncuesta);
  $('#botonResponderDesdeGrupo').addEventListener('click', mostrarEncuesta);

  $('#botonBorrarResultados').addEventListener('click', async () => {
    const aceptado = await confirmar({
      titulo: '¿Borrar resultados del grupo?',
      texto: 'Se eliminarán todas las respuestas guardadas en este dispositivo. Esta acción no se puede deshacer.',
      aceptar: 'Sí, borrar'
    });
    if (!aceptado) return;
    borrarResultados();
    mostrarEncuesta();
    mostrarToast('Se borraron los resultados del grupo.');
  });

  // Los resultados de versiones anteriores se medían distinto: se descartan
  clavesViejas.forEach((clave) => {
    try { localStorage.removeItem(clave); } catch (error) { /* almacenamiento bloqueado */ }
  });

  actualizarBotonGrupo(); // también muestra el aviso si el navegador bloquea el almacenamiento
}

/* ----------------------------------------------------------
   10. MÓDULO D · ¿CÓMO PUEDO AYUDAR?
   ---------------------------------------------------------- */

function iniciarGuia() {
  iniciarSelector($('#selectorGuia'), $('#recomendacionesGuia'), contenidoGuia);
}

/* ----------------------------------------------------------
   11. ARRANQUE
   Cada módulo arranca por separado: si uno falla,
   los demás siguen funcionando.
   ---------------------------------------------------------- */

function mostrarAvisoError() {
  const aviso = $('#avisoError');
  if (aviso) aviso.hidden = false;
}

function iniciarSeguro(nombre, funcion) {
  try {
    funcion();
  } catch (error) {
    console.error(`Error al iniciar ${nombre}:`, error);
    mostrarAvisoError();
  }
}

document.documentElement.classList.add('js');
window.addEventListener('error', mostrarAvisoError);
$('#botonRecargar').addEventListener('click', () => window.location.reload());

iniciarSeguro('las ventanas y el tutorial del 911', iniciarTutorial911);
iniciarSeguro('la navegación', iniciarNavegacion);
iniciarSeguro('Necesito ayuda', iniciarModuloAyuda);
iniciarSeguro('Aprende a reconocerlo', iniciarCuestionario);
iniciarSeguro('Termómetro de convivencia', iniciarTermometro);
iniciarSeguro('¿Cómo puedo ayudar?', iniciarGuia);
