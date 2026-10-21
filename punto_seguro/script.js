/* ==========================================================
   Punto Seguro · Lógica de la aplicación
   - JavaScript sin librerías.
   - Nombres de variables y funciones en ESPAÑOL y en camelCase.
   - Solo el Termómetro (módulo C) usa localStorage, y únicamente
     para guardar conteos totales (no respuestas individuales).
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   1. DATOS DE LA ESCUELA
   Escribe aquí los datos reales. Si un campo queda vacío,
   la app usa un texto genérico que sirve para cualquier escuela.
   ---------------------------------------------------------- */
const datosEscuela = {
  orientador: '',   // Ejemplo: 'Mtra. Laura Gómez (Orientación)'
  telefono: '',     // Ejemplo: '55 1234 5678'
  ubicacion: ''     // Ejemplo: 'Edificio B, planta baja'
};

// Textos genéricos para usar DENTRO de frases ("Habla con ...")
const textosGenericos = {
  orientador: 'la persona de orientación de tu escuela',
  telefono: 'la dirección de tu escuela',
  ubicacion: ''
};

// Textos genéricos para el recuadro "Ayuda real en tu escuela"
const textosPanel = {
  orientador: 'Pregunta en tu escuela quién da orientación',
  telefono: 'Pídelo en la dirección de tu escuela',
  ubicacion: 'Pregunta en la dirección dónde está orientación'
};

function tieneDato(clave) {
  return (datosEscuela[clave] || '').trim() !== '';
}

// Devuelve el dato real o, si está vacío, el texto genérico
function dato(clave) {
  return tieneDato(clave) ? datosEscuela[clave].trim() : textosGenericos[clave];
}

// " en Edificio B" si hay ubicación; nada si no la hay
function enUbicacion() {
  return tieneDato('ubicacion') ? ` en ${dato('ubicacion')}` : '';
}

/* ----------------------------------------------------------
   2. CONTENIDOS
   ---------------------------------------------------------- */

// Módulo A · Orientación según la situación
const contenidoAyuda = {
  sufro: {
    titulo: 'Si estás sufriendo bullying',
    mensaje: 'No es tu culpa y mereces sentirte bien en tu escuela. Pedir ayuda es un acto de valentía.',
    acciones: [
      `Habla hoy mismo con ${dato('orientador')} o con una persona adulta de confianza (docente, tutor o tutora, familiar).`,
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
      `Puedes acudir con ${dato('orientador')}${enUbicacion()}.`,
      'Pide un momento a solas: “¿Tiene unos minutos? Quiero platicarle algo”.',
      'Si te cuesta empezar, escribe en una hoja lo que quieres decir y llévala.',
      'También puedes hablar con un familiar u otra persona adulta de confianza.'
    ]
  }
};

// Módulo B · Cuestionario (situaciones ficticias)
// Todas las preguntas usan las MISMAS tres respuestas. Así no se adivina por
// cómo está escrita la opción: hay que analizar la situación con las tres claves
// (repetición, intención de dañar y desequilibrio de poder).
const opcionesCuestionario = [
  { tipo: 'bullying', texto: 'Es bullying' },
  { tipo: 'atender', texto: 'No es bullying, pero hay que atenderlo' },
  { tipo: 'normal', texto: 'No es bullying: es parte normal de la convivencia' }
];

// Cuántas situaciones de cada tipo salen en cada ronda (10 en total)
const reparticionRonda = { bullying: 5, atender: 2, normal: 3 };

const bancoCuestionario = [
  // ---------- Sí es bullying ----------
  {
    tipo: 'bullying',
    escenario: 'Cada vez que agregan a Alex al grupo de mensajes del salón, alguien lo saca y escriben “aquí nadie te quiere”. Lleva así casi un mes.',
    explicacion: 'Es exclusión repetida y hecha a propósito, y varias personas actúan contra una. El bullying también ocurre en los chats.'
  },
  {
    tipo: 'bullying',
    escenario: 'Desde que empezó el curso le dicen “la jirafa” a Vale por su estatura. Ella ya pidió que paren, pero cada vez más gente lo dice.',
    explicacion: 'Un apodo deja de ser broma cuando la persona pide que paren y siguen. Hay repetición, intención de molestar y un grupo contra una persona.'
  },
  {
    tipo: 'bullying',
    escenario: 'Dos estudiantes de tercero le piden a Leo 20 pesos cada lunes “para que no le pase nada”.',
    explicacion: 'Es extorsión: se repite, busca intimidar y hay desequilibrio de poder (edad y número). Hay que avisar a una persona adulta cuanto antes.'
  },
  {
    tipo: 'bullying',
    escenario: 'Una cuenta anónima publica fotos editadas de Fer para burlarse de ella. Cada semana sube nuevas y la etiquetan.',
    explicacion: 'Es ciberacoso: se repite, busca humillar y el anonimato hace difícil defenderse. Lo mejor es no compartir, guardar capturas y avisar.'
  },
  {
    tipo: 'bullying',
    escenario: 'Kenia llegó este año de otro estado. Casi a diario imitan su forma de hablar y le dicen que “se regrese a su pueblo”.',
    explicacion: 'Las burlas por el origen, el acento o cualquier diferencia son discriminación. Al repetirse y venir de un grupo, es bullying.'
  },
  {
    tipo: 'bullying',
    escenario: 'Cuando Ari participa en clase, un grupo hace ruidos y voltea los ojos. Nadie dice nada feo en voz alta y el maestro no lo nota, pero pasa casi todos los días.',
    explicacion: 'El bullying puede ser silencioso. Gestos y ruidos repetidos para ridiculizar a alguien también hacen daño, aunque no haya insultos ni golpes.'
  },
  {
    tipo: 'bullying',
    escenario: 'Toño es parte de un grupo de amigos, pero siempre es él al que le esconden las cosas y al que graban cuando se tropieza. Él se ríe, pero en su casa dice que ya no quiere ir a la escuela.',
    explicacion: 'Entre “amigos” también puede haber bullying: siempre es la misma persona, se repite y le está afectando. Que se ría no significa que esté bien.'
  },
  {
    tipo: 'bullying',
    escenario: 'Graban a Nico cuando se le cae la charola en la cafetería. El video pasa por varios grupos de mensajes con comentarios burlones.',
    explicacion: 'Aunque se grabó una sola vez, en internet el daño se repite cada vez que alguien lo comparte o comenta. Por eso puede ser bullying. No reenviarlo ya ayuda.'
  },

  // ---------- No es bullying, pero hay que atenderlo ----------
  {
    tipo: 'atender',
    escenario: 'En la cancha, Sam y Dani se empujan por una falta y un maestro los separa. Nunca habían tenido problemas y no vuelve a pasar.',
    explicacion: 'Es una pelea puntual entre iguales: no se repite ni hay desequilibrio de poder. No es bullying, pero la agresión física siempre se debe atender.'
  },
  {
    tipo: 'atender',
    escenario: 'Durante un trabajo en equipo, Mía se enoja y le dice a Bruno “eres un inútil”. Bruno se siente mal y no quiere volver a trabajar con ella.',
    explicacion: 'Es un conflicto: pasó una vez y no hay un grupo contra una persona. No es bullying, pero las palabras lastiman; hablarlo o pedir mediación ayuda.'
  },
  {
    tipo: 'atender',
    escenario: 'Una noche, dos compañeros se insultan en el grupo del salón por un partido de futbol. Al día siguiente el tutor habla con ellos y no se repite.',
    explicacion: 'Es una discusión puntual entre iguales, aunque fuera en internet. No es bullying, pero conviene evitar discutir en grupos donde todos lo ven.'
  },

  // ---------- Convivencia normal ----------
  {
    tipo: 'normal',
    escenario: 'Luis y Pepe eran mejores amigos, pero ya no se llevan igual. Luis ahora se junta con otras personas en el recreo y no le hace nada a Pepe.',
    explicacion: 'Las amistades cambian y cada quien puede elegir con quién juntarse. No hay intención de dañar, burlas ni grupo en contra. Puede doler, pero no es bullying.'
  },
  {
    tipo: 'normal',
    escenario: 'En clase de cívica, Daniela y Omar debaten muy en serio sobre un tema. Levantan la voz, pero al terminar siguen platicando como siempre.',
    explicacion: 'Estar en desacuerdo y debatir con respeto es sano. No hay intención de dañar ni se repite contra alguien.'
  },
  {
    tipo: 'normal',
    escenario: 'En un grupo de amigos todos se ponen apodos y se ríen. Cuando alguien dice “ya, eso no me gustó”, los demás paran y se disculpan.',
    explicacion: 'Es juego entre iguales: todos participan y se respeta cuando alguien pone un límite. La clave es que se detienen cuando se lo piden.'
  },
  {
    tipo: 'normal',
    escenario: 'La maestra le pide a Iván frente al grupo que guarde el celular y le baja puntos por no entregar la tarea. Iván dice que “le hace bullying”.',
    explicacion: 'Aplicar las reglas de la clase no es bullying. Si Iván cree que lo tratan injustamente, puede hablarlo con respeto con la maestra o con orientación.'
  },
  {
    tipo: 'normal',
    escenario: 'En las pruebas para el equipo de básquetbol eligen a otras personas y Rafa no queda. Le dicen que puede volver a intentarlo el próximo semestre.',
    explicacion: 'No quedar en una selección es frustrante, pero se decidió con reglas claras y no busca dañar a Rafa. Es parte normal de la convivencia.'
  }
];

// Mezcla un arreglo (algoritmo de Fisher-Yates) sin modificar el original
function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Arma una ronda: toma al azar cierta cantidad de cada tipo y las revuelve
function crearRonda() {
  const elegidas = Object.entries(reparticionRonda).flatMap(([tipo, cantidad]) =>
    mezclar(bancoCuestionario.filter((pregunta) => pregunta.tipo === tipo)).slice(0, cantidad)
  );
  return mezclar(elegidas);
}

// Módulo C · Encuesta. En TODAS las preguntas, "Sí" es la respuesta que
// refleja buena convivencia (así la gráfica se lee igual en todas).
const preguntasEncuesta = [
  {
    texto: '¿Sientes que en tu escuela te tratan con respeto?',
    corta: 'Me tratan con respeto',
    sugerencia: 'Vale la pena hablar en grupo sobre cómo nos tratamos y qué acuerdos de respeto queremos.'
  },
  {
    texto: '¿Sientes que en tu grupo nadie es blanco de burlas constantes?',
    corta: 'Nadie es blanco de burlas constantes',
    sugerencia: 'Cuando las burlas se repiten, quienes observan pueden ayudar: no reír, acompañar y avisar a una persona adulta.'
  },
  {
    texto: '¿Sabes a quién acudir si tienes un problema en la escuela?',
    corta: 'Sé a quién acudir',
    sugerencia: 'Conviene dar a conocer quién es la persona de orientación y dónde encontrarla.'
  },
  {
    texto: '¿Sientes confianza para pedir ayuda a una persona adulta de la escuela?',
    corta: 'Tengo confianza para pedir ayuda',
    sugerencia: 'Generar confianza toma tiempo: espacios de escucha y respuestas respetuosas ayudan mucho.'
  },
  {
    texto: '¿Sientes que en tu grupo se apoyan cuando alguien tiene un problema?',
    corta: 'En mi grupo nos apoyamos',
    sugerencia: 'Pequeños gestos, como preguntar “¿estás bien?”, fortalecen el apoyo entre compañeros y compañeras.'
  }
];

// "puntos": cuánto suma cada respuesta al puntaje (de 0 a 100).
// "A veces" vale la mitad: no es tan bueno como "Sí", pero tampoco es "No".
const opcionesEncuesta = [
  { valor: 'si', texto: 'Sí', puntos: 100 },
  { valor: 'aveces', texto: 'A veces', puntos: 50 },
  { valor: 'no', texto: 'No', puntos: 0 }
];

// Módulo D · Guía de acción
const contenidoGuia = {
  mi: {
    titulo: 'Si te está pasando a ti',
    mensaje: 'No es tu culpa y no tienes que resolverlo sin apoyo.',
    acciones: [
      'Busca a una persona adulta de confianza y cuéntale lo que pasa.',
      'Guarda evidencia: fechas, lugares y capturas si es en internet.',
      'No respondas con violencia ni con insultos; puede ponerte en riesgo.',
      'Procura estar cerca de personas que te apoyan.',
      `Recuerda: orientación está en ${dato('ubicacion')}.`
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
    ]
  }
};

/* ----------------------------------------------------------
   3. UTILIDADES
   ---------------------------------------------------------- */

const $ = (selector) => document.querySelector(selector);

// Crea un elemento con clase y texto (textContent evita inyectar HTML)
function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

// Muestra un panel con título, mensaje y lista de acciones
function pintarOrientacion(panel, contenido) {
  panel.textContent = '';
  const titulo = crearElemento('h3', '', contenido.titulo);
  titulo.tabIndex = -1;
  const lista = crearElemento('ul', 'lista');
  contenido.acciones.forEach((accion) => lista.appendChild(crearElemento('li', '', accion)));
  panel.append(titulo, crearElemento('p', '', contenido.mensaje), lista);
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
   4. NAVEGACIÓN ENTRE VISTAS (usa el # de la dirección)
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

// Coloca los datos de la escuela (o un texto genérico) en el recuadro de ayuda
function aplicarDatosEscuela() {
  document.querySelectorAll('[data-dato]').forEach((elemento) => {
    const clave = elemento.dataset.dato;
    elemento.textContent = tieneDato(clave) ? dato(clave) : textosPanel[clave];
    elemento.classList.toggle('marcador', !tieneDato(clave));
  });
}

/* ----------------------------------------------------------
   5. MÓDULO A · NECESITO AYUDA
   Importante: el formulario NO guarda nada (ni localStorage
   ni ningún otro almacenamiento) y NO envía nada.
   ---------------------------------------------------------- */

// Cada opción del formulario se relaciona con una orientación del módulo A
const tipoAOrientacion = {
  'me-pasa': 'sufro',
  'lo-vi': 'presencie',
  'conflicto': 'conflicto',
  'otra': 'hablar'
};

function iniciarModuloAyuda() {
  iniciarSelector($('#selectorAyuda'), $('#orientacionAyuda'), contenidoAyuda);

  const formulario = $('#formularioDemo');
  const tipo = $('#tipoSituacion');
  const descripcion = $('#descripcion');
  const contador = $('#contadorDescripcion');
  const errorTipo = $('#errorTipo');
  const errorDescripcion = $('#errorDescripcion');
  const errorPeligro = $('#errorPeligro');
  const resultado = $('#resultadoFormulario');

  const grupoPeligro = crearGrupoOpciones({
    contenedor: $('#grupoPeligro'),
    opciones: [{ valor: 'si', texto: 'Sí' }, { valor: 'no', texto: 'No' }],
    etiquetaId: 'etiquetaPeligro',
    enFila: true,
    alCambiar: () => limpiarErrorCampo(grupoPeligro.elemento, errorPeligro)
  });

  function actualizarContador() {
    contador.textContent = `${descripcion.value.length} de 300 caracteres`;
  }

  tipo.addEventListener('change', () => limpiarErrorCampo(tipo, errorTipo));
  descripcion.addEventListener('input', () => {
    actualizarContador();
    limpiarErrorCampo(descripcion, errorDescripcion);
  });

  // Validación: devuelve el primer campo con error (o null si todo está bien)
  function validar() {
    let primerError = null;

    if (!tipo.value) {
      mostrarErrorCampo(tipo, errorTipo, 'Elige el tipo de situación.');
      primerError = primerError || tipo;
    }

    const largo = descripcion.value.trim().length;
    if (largo === 0) {
      mostrarErrorCampo(descripcion, errorDescripcion, 'Escribe una descripción breve de lo que pasa.');
      primerError = primerError || descripcion;
    } else if (largo < 10) {
      mostrarErrorCampo(descripcion, errorDescripcion, `Escribe al menos 10 caracteres (llevas ${largo}).`);
      primerError = primerError || descripcion;
    }

    if (!grupoPeligro.obtenerValor()) {
      mostrarErrorCampo(grupoPeligro.elemento, errorPeligro, 'Indica si hay peligro inmediato: elige “Sí” o “No”.');
      primerError = primerError || grupoPeligro;
    }

    return primerError;
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault(); // nunca se envía a ningún lado
    resultado.hidden = true;

    const primerError = validar();
    if (primerError) {
      if (primerError === grupoPeligro) grupoPeligro.enfocar();
      else primerError.focus();
      return;
    }

    const hayPeligro = grupoPeligro.obtenerValor() === 'si';
    const orientacion = contenidoAyuda[tipoAOrientacion[tipo.value]];

    // Mostramos el resultado de la demostración, según lo que se eligió
    resultado.textContent = '';
    resultado.appendChild(crearElemento('h3', '', 'Formulario completo (demostración)'));

    // Si hay peligro, es lo primero que se lee
    if (hayPeligro) {
      resultado.appendChild(crearElemento('p', 'aviso aviso--error',
        'Indicaste que hay peligro inmediato: no esperes. Busca ahora a una persona adulta de confianza o llama al 911.'));
    }

    if (orientacion) {
      resultado.appendChild(crearElemento('p', '', orientacion.mensaje));
      resultado.appendChild(crearElemento('p', 'etiqueta', 'Lo que puedes hacer ahora:'));
      const lista = crearElemento('ul', 'lista');
      orientacion.acciones.forEach((accion) => lista.appendChild(crearElemento('li', '', accion)));
      resultado.appendChild(lista);
    }

    resultado.appendChild(crearElemento('p', 'texto-suave',
      `Esta es una demostración: no se envía nada a tu escuela. Para pedir ayuda real, acude con ${dato('orientador')}${enUbicacion()} o con cualquier docente de confianza. Lo que escribiste no se guardó y ya se borró del formulario; puedes usar esas mismas ideas para contárselo a una persona adulta.`));

    // Borramos todo lo escrito: no queda nada en la página ni en el navegador
    formulario.reset();
    actualizarContador();
    resultado.hidden = false;
    resultado.focus();
  });

  // El botón "Borrar todo" también reinicia el grupo Sí/No y los errores
  formulario.addEventListener('reset', () => {
    grupoPeligro.reiniciar();
    limpiarErrorCampo(tipo, errorTipo);
    limpiarErrorCampo(descripcion, errorDescripcion);
    limpiarErrorCampo(grupoPeligro.elemento, errorPeligro);
    // reset() vacía los campos después de este evento; esperamos un instante
    setTimeout(actualizarContador, 0);
  });

  actualizarContador();
}

/* ----------------------------------------------------------
   6. MÓDULO B · CUESTIONARIO
   El progreso vive solo en estas variables (en memoria).
   ---------------------------------------------------------- */

function iniciarCuestionario() {
  const contenedorCuestionario = $('#cuestionario');
  const progresoTexto = $('#progresoTexto');
  const progresoBarra = $('#progresoBarra');
  const textoEscenario = $('#textoEscenario');
  const textoPregunta = $('#textoPregunta');
  const errorCuestionario = $('#errorCuestionario');
  const retro = $('#retroCuestionario');
  const botonComprobar = $('#botonComprobar');
  const botonSiguiente = $('#botonSiguiente');
  const resultado = $('#resultadoCuestionario');

  // Cada ronda trae situaciones distintas, elegidas al azar del banco
  let ronda = crearRonda();
  const total = ronda.length;
  let indicePregunta = 0;
  let aciertos = 0;
  let grupo = null;

  function mostrarPregunta(moverFoco) {
    const actual = ronda[indicePregunta];

    progresoTexto.textContent = `Pregunta ${indicePregunta + 1} de ${total}`;
    progresoBarra.style.width = `${(indicePregunta / total) * 100}%`;
    textoEscenario.textContent = actual.escenario;
    textoPregunta.textContent = '¿Cómo clasificarías esta situación?';

    grupo = crearGrupoOpciones({
      contenedor: $('#opcionesCuestionario'),
      opciones: opcionesCuestionario.map((opcion) => ({ valor: opcion.tipo, texto: opcion.texto })),
      etiquetaId: 'textoPregunta',
      alCambiar: () => limpiarErrorCampo(grupo.elemento, errorCuestionario)
    });

    errorCuestionario.hidden = true;
    retro.hidden = true;
    botonComprobar.hidden = false;
    botonSiguiente.hidden = true;
    botonSiguiente.textContent = indicePregunta === total - 1 ? 'Ver mi resultado' : 'Siguiente pregunta';

    if (moverFoco) textoPregunta.focus();
  }

  function comprobar() {
    const actual = ronda[indicePregunta];
    const elegida = grupo.obtenerValor();

    if (elegida === null) {
      mostrarErrorCampo(grupo.elemento, errorCuestionario, 'Elige una opción antes de comprobar.');
      grupo.enfocar();
      return;
    }

    const esCorrecta = elegida === actual.tipo;
    if (esCorrecta) aciertos += 1;

    grupo.bloquear();
    grupo.marcar(actual.tipo, 'correcta', '✓ Más adecuada');
    if (!esCorrecta) grupo.marcar(elegida, 'incorrecta', 'Tu elección');

    retro.className = 'retro ' + (esCorrecta ? 'retro--bien' : 'retro--revisa');
    retro.textContent = '';
    const encabezado = crearElemento('p');
    encabezado.appendChild(crearElemento('strong', '', esCorrecta ? '¡Bien pensado!' : 'Hay una opción más adecuada.'));
    retro.append(encabezado, crearElemento('p', '', actual.explicacion));
    retro.hidden = false;

    botonComprobar.hidden = true;
    botonSiguiente.hidden = false;
    progresoBarra.style.width = `${((indicePregunta + 1) / total) * 100}%`;
    retro.focus(); // el lector de pantalla lee la explicación; con Tab se llega a "Siguiente"
  }

  function siguiente() {
    indicePregunta += 1;
    if (indicePregunta < total) mostrarPregunta(true);
    else mostrarResultado();
  }

  function mostrarResultado() {
    contenedorCuestionario.hidden = true;
    resultado.hidden = false;

    $('#puntajeCuestionario').textContent = `${aciertos} de ${total} respuestas adecuadas`;

    let mensaje;
    if (aciertos >= total - 1) {
      mensaje = 'Reconoces muy bien las señales del bullying y sabes distinguirlo de un conflicto. Compartir lo que sabes puede ayudar a tu grupo.';
    } else if (aciertos >= Math.ceil(total / 2)) {
      mensaje = 'Vas por buen camino. Repasa las tres claves de abajo: te ayudarán a reconocer mejor cada situación.';
    } else {
      mensaje = 'Es un buen momento para repasar. Lee las tres claves de abajo y vuelve a intentarlo; aprender a reconocerlo es el primer paso para actuar.';
    }
    $('#mensajeCuestionario').textContent = mensaje + ' Recuerda: este cuestionario es educativo y no sirve para diagnosticar ninguna situación real.';

    $('#tituloResultado').focus();
  }

  function reiniciar() {
    ronda = crearRonda(); // nueva ronda con otras situaciones
    indicePregunta = 0;
    aciertos = 0;
    resultado.hidden = true;
    contenedorCuestionario.hidden = false;
    mostrarPregunta(true);
  }

  botonComprobar.addEventListener('click', comprobar);
  botonSiguiente.addEventListener('click', siguiente);
  $('#botonReiniciar').addEventListener('click', reiniciar);

  mostrarPregunta(false);
}

/* ----------------------------------------------------------
   7. MÓDULO C · TERMÓMETRO DE CONVIVENCIA
   Se guardan SOLO conteos totales por pregunta, por ejemplo:
   { total: 3, conteos: [ {si:2, aveces:1, no:0}, ... ] }
   No se guarda quién respondió ni cada respuesta por separado.
   ---------------------------------------------------------- */

// v2: la pregunta 2 cambió de sentido, así que no se mezclan con resultados viejos
const claveAlmacen = 'puntoSeguro.termometro.v2';
const claveAlmacenVieja = 'puntoSeguro.termometro.v1';
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

// Puntaje de 0 a 100 de una pregunta: promedio de los puntos de cada respuesta
// Ejemplo: 2 "Sí" y 2 "A veces" -> (100 + 100 + 50 + 50) / 4 = 75
function calcularPuntaje(conteo, total) {
  const suma = opcionesEncuesta.reduce((acumulado, opcion) => acumulado + conteo[opcion.valor] * opcion.puntos, 0);
  return Math.round(suma / total);
}

// Clasifica un puntaje en tres niveles
function obtenerNivel(puntaje) {
  if (puntaje >= 75) return { clase: '', nombre: 'Fortaleza' };
  if (puntaje >= 50) return { clase: 'grafica__barra--media', nombre: 'Se puede mejorar' };
  return { clase: 'grafica__barra--baja', nombre: 'Necesita atención' };
}

function iniciarTermometro() {
  const formulario = $('#formularioEncuesta');
  const contenedorPreguntas = $('#preguntasEncuesta');
  const errorEncuesta = $('#errorEncuesta');
  const infoEncuesta = $('#infoEncuesta');
  const vistaResultados = $('#resultadosEncuesta');

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

  function mostrarFormulario(moverFoco) {
    vistaResultados.hidden = true;
    formulario.hidden = false;
    if (moverFoco) grupos[0].enfocar();
  }

  function mostrarResultados() {
    const datos = leerResultados();
    infoEncuesta.hidden = true;

    if (datos.total === 0) {
      infoEncuesta.textContent = 'Todavía no hay respuestas guardadas en este navegador. Responde la encuesta para ver resultados.';
      infoEncuesta.hidden = false;
      grupos[0].enfocar();
      return;
    }

    const n = datos.total;
    $('#totalRespuestas').textContent =
      `Gráfica basada en ${n} ${n === 1 ? 'respuesta' : 'respuestas'} de este navegador.`;
    $('#notaPocasRespuestas').hidden = n >= 5;

    // Gráfica de barras con HTML y CSS: el ancho de cada barra es el puntaje (0 a 100)
    const grafica = $('#grafica');
    grafica.textContent = '';
    const puntajes = preguntasEncuesta.map((pregunta, indice) => {
      const conteo = datos.conteos[indice];
      const puntaje = calcularPuntaje(conteo, n);
      const nivel = obtenerNivel(puntaje);

      const fila = crearElemento('li');
      const titulo = crearElemento('p', 'grafica__titulo', pregunta.corta);
      titulo.appendChild(crearElemento('span', 'etiqueta-nivel', nivel.nombre));

      const fondo = crearElemento('div', 'grafica__fondo');
      fondo.setAttribute('aria-hidden', 'true');
      const barra = crearElemento('div', 'grafica__barra ' + nivel.clase);
      barra.style.width = `${puntaje}%`;
      fondo.appendChild(barra);

      // Se muestran también los conteos, para que se pueda comprobar el puntaje
      const valor = crearElemento('p', 'grafica__valor',
        `${puntaje} de 100 · Sí: ${conteo.si} · A veces: ${conteo.aveces} · No: ${conteo.no}`);
      const nota = crearElemento('p', 'grafica__nota',
        puntaje >= 75 ? 'Buena señal. Vale la pena cuidarla.' : pregunta.sugerencia);

      fila.append(titulo, fondo, valor, nota);
      grafica.appendChild(fila);
      return puntaje;
    });

    // Puntaje general: promedio de las cinco preguntas
    const general = Math.round(puntajes.reduce((a, b) => a + b, 0) / puntajes.length);
    $('#puntajeGeneral').textContent = `Puntaje general: ${general} de 100 (${obtenerNivel(general).nombre})`;

    formulario.hidden = true;
    vistaResultados.hidden = false;
    $('#tituloResultadosEncuesta').focus();
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    infoEncuesta.hidden = true;

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

    // Sumamos esta respuesta a los conteos totales
    const datos = leerResultados();
    datos.total += 1;
    grupos.forEach((grupo, indice) => {
      datos.conteos[indice][grupo.obtenerValor()] += 1;
    });
    guardarResultados(datos);

    // Limpiamos las respuestas para la siguiente persona
    grupos.forEach((grupo) => grupo.reiniciar());
    mostrarResultados();
  });

  $('#botonVerResultados').addEventListener('click', mostrarResultados);
  $('#botonResponderOtra').addEventListener('click', () => mostrarFormulario(true));
  $('#botonBorrarResultados').addEventListener('click', () => {
    const confirmado = window.confirm('¿Borrar todas las respuestas guardadas en este navegador? Esta acción no se puede deshacer.');
    if (!confirmado) return;
    borrarResultados();
    mostrarFormulario(false);
    infoEncuesta.textContent = 'Se borraron los resultados de este navegador.';
    infoEncuesta.hidden = false;
    grupos[0].enfocar();
  });

  // Los resultados de la versión anterior medían la pregunta 2 al revés: se descartan
  try {
    localStorage.removeItem(claveAlmacenVieja);
  } catch (error) {
    // Si el almacenamiento está bloqueado no hay nada que limpiar
  }

  leerResultados(); // muestra el aviso si el navegador bloquea el almacenamiento
}

/* ----------------------------------------------------------
   8. MÓDULO D · ¿CÓMO PUEDO AYUDAR?
   ---------------------------------------------------------- */

function iniciarGuia() {
  iniciarSelector($('#selectorGuia'), $('#recomendacionesGuia'), contenidoGuia);
}

/* ----------------------------------------------------------
   9. ARRANQUE
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

iniciarSeguro('los datos de la escuela', aplicarDatosEscuela);
iniciarSeguro('la navegación', iniciarNavegacion);
iniciarSeguro('Necesito ayuda', iniciarModuloAyuda);
iniciarSeguro('Aprende a reconocerlo', iniciarCuestionario);
iniciarSeguro('Termómetro de convivencia', iniciarTermometro);
iniciarSeguro('¿Cómo puedo ayudar?', iniciarGuia);
