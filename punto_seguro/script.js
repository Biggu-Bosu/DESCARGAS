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
   la app muestra el marcador {{...}} para que se note.
   ---------------------------------------------------------- */
const datosEscuela = {
  orientador: '',   // Ejemplo: 'Mtra. Laura Gómez (Orientación)'
  telefono: '',     // Ejemplo: '55 1234 5678'
  ubicacion: ''     // Ejemplo: 'Edificio B, planta baja'
};

const marcadores = {
  orientador: '{{nombre del orientador/a}}',
  telefono: '{{teléfono de dirección}}',
  ubicacion: '{{ubicación de orientación}}'
};

// Devuelve el dato real o, si está vacío, su marcador
function dato(clave) {
  const valor = (datosEscuela[clave] || '').trim();
  return valor || marcadores[clave];
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
      `Puedes acudir con ${dato('orientador')} en ${dato('ubicacion')}.`,
      'Pide un momento a solas: “¿Tiene unos minutos? Quiero platicarle algo”.',
      'Si te cuesta empezar, escribe en una hoja lo que quieres decir y llévala.',
      'También puedes hablar con un familiar u otra persona adulta de confianza.'
    ]
  }
};

// Módulo B · Cuestionario (situaciones ficticias)
const preguntasCuestionario = [
  {
    escenario: 'Desde hace varias semanas, un grupo no deja que Alex se siente con ellos en el recreo y le dicen que “no tiene lugar ahí”.',
    pregunta: '¿Cómo describirías esta situación?',
    opciones: [
      'Es normal: no tienen por qué juntarse con todo el mundo.',
      'Puede ser bullying: es una exclusión repetida y hecha a propósito.',
      'No pasa nada mientras no haya golpes.'
    ],
    correcta: 1,
    explicacion: 'La exclusión social es una forma de bullying cuando se repite y busca dejar a alguien fuera para lastimar. No hace falta violencia física para que haga daño.'
  },
  {
    escenario: 'Sam y Dani discuten una vez por quién usa la cancha. Se dicen cosas feas, pero al día siguiente hablan y lo arreglan.',
    pregunta: '¿Qué tipo de situación parece?',
    opciones: [
      'Un caso grave de bullying.',
      'Algo que hay que ignorar siempre.',
      'Un conflicto puntual: no se repite y ninguna de las dos personas tiene más poder.'
    ],
    correcta: 2,
    explicacion: 'Los conflictos aislados entre iguales son parte de la convivencia. No son bullying, aunque si se complican también se puede pedir ayuda.'
  },
  {
    escenario: 'En cada clase, varias personas imitan la forma de hablar de Ari y se ríen. Ari ya no quiere participar.',
    pregunta: '¿Qué elementos ves aquí?',
    opciones: [
      'Repetición, intención de burlarse y varias personas contra una: puede ser bullying.',
      'Son bromas; Ari debería aprender a reírse.',
      'Solo es un problema si Ari se queja con la dirección.'
    ],
    correcta: 0,
    explicacion: 'Las burlas constantes, en grupo y que afectan a la persona cumplen con repetición, intención y desequilibrio de poder. Que alguien deje de participar es una señal de daño.'
  },
  {
    escenario: 'Alguien inventa un rumor sobre Cris y cada día más gente del salón lo repite.',
    pregunta: '¿Qué es lo más adecuado pensar?',
    opciones: [
      'Si no lo inventaste, no tiene nada que ver contigo.',
      'Son solo chismes, no afectan a nadie.',
      'Puede ser bullying, y repetir el rumor también contribuye al daño.'
    ],
    correcta: 2,
    explicacion: 'Los rumores dañan la reputación y aíslan. Cada persona que lo repite lo hace más grande; no repetirlo ya es una forma de ayudar.'
  },
  {
    escenario: 'Crean una cuenta en redes para publicar memes sobre Fer y la comparten en el grupo de mensajes del salón.',
    pregunta: '¿Qué conviene hacer si lo ves?',
    opciones: [
      'Puede ser ciberacoso: no compartirlo, guardar evidencia y avisar a una persona adulta.',
      'Es humor de internet, no es para tanto.',
      'Responder con otro meme para defender a Fer.'
    ],
    correcta: 0,
    explicacion: 'El acoso digital puede llegar a muchas personas y repetirse cada vez que alguien comparte. Lo más seguro es no difundir, guardar capturas y avisar.'
  },
  {
    escenario: 'Una persona de un grado mayor empuja a Leo todos los días en la entrada y le quita su almuerzo.',
    pregunta: '¿Cómo deberían actuar?',
    opciones: [
      'Leo debería defenderse a golpes.',
      'Es una situación de riesgo: hay agresión repetida y más poder; hay que avisar pronto a una persona adulta.',
      'Es parte de crecer; se le pasará.'
    ],
    correcta: 1,
    explicacion: 'La agresión física repetida y la diferencia de edad muestran desequilibrio de poder. Responder con violencia puede empeorar las cosas; lo seguro es buscar apoyo adulto.'
  },
  {
    escenario: 'Ves que, por tercera vez esta semana, a alguien de otro salón le esconden la mochila entre risas.',
    pregunta: '¿Qué es lo más seguro que puedes hacer?',
    opciones: [
      'Grabarlo para tener pruebas y subirlo a redes.',
      'Enfrentarte solo o sola a quienes lo hacen.',
      'Acompañar a la persona afectada y avisar a un o una docente.'
    ],
    correcta: 2,
    explicacion: 'No necesitas enfrentar a nadie. Acompañar y avisar a una persona adulta protege a quien lo vive y también a ti. Difundir videos puede humillar más.'
  }
];

// Módulo C · Encuesta. "positiva" indica qué respuesta refleja buena convivencia
const preguntasEncuesta = [
  {
    texto: '¿Sientes que en tu escuela te tratan con respeto?',
    corta: 'Me tratan con respeto',
    positiva: 'si',
    sugerencia: 'Vale la pena hablar en grupo sobre cómo nos tratamos y qué acuerdos de respeto queremos.'
  },
  {
    texto: '¿Has presenciado burlas constantes hacia alguien?',
    corta: 'No he visto burlas constantes',
    positiva: 'no',
    sugerencia: 'Cuando las burlas se repiten, quienes observan pueden ayudar: no reír, acompañar y avisar a una persona adulta.'
  },
  {
    texto: '¿Sabes a quién acudir si tienes un problema en la escuela?',
    corta: 'Sé a quién acudir',
    positiva: 'si',
    sugerencia: 'Conviene dar a conocer quién es la persona de orientación y dónde encontrarla.'
  },
  {
    texto: '¿Sientes confianza para pedir ayuda a una persona adulta de la escuela?',
    corta: 'Tengo confianza para pedir ayuda',
    positiva: 'si',
    sugerencia: 'Generar confianza toma tiempo: espacios de escucha y respuestas respetuosas ayudan mucho.'
  },
  {
    texto: '¿Sientes que en tu grupo se apoyan cuando alguien tiene un problema?',
    corta: 'En mi grupo nos apoyamos',
    positiva: 'si',
    sugerencia: 'Pequeños gestos, como preguntar “¿estás bien?”, fortalecen el apoyo entre compañeros y compañeras.'
  }
];

const opcionesEncuesta = [
  { valor: 'si', texto: 'Sí' },
  { valor: 'aveces', texto: 'A veces' },
  { valor: 'no', texto: 'No' }
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

// Coloca los datos de la escuela (o sus marcadores) en el HTML
function aplicarDatosEscuela() {
  document.querySelectorAll('[data-dato]').forEach((elemento) => {
    const clave = elemento.dataset.dato;
    elemento.textContent = dato(clave);
    elemento.classList.toggle('marcador', !(datosEscuela[clave] || '').trim());
  });
}

/* ----------------------------------------------------------
   5. MÓDULO A · NECESITO AYUDA
   Importante: el formulario NO guarda nada (ni localStorage
   ni ningún otro almacenamiento) y NO envía nada.
   ---------------------------------------------------------- */

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

    // Mostramos el resultado de la demostración
    resultado.textContent = '';
    resultado.append(
      crearElemento('h3', '', 'Formulario completo (demostración)'),
      crearElemento('p', '', `Esta es una demostración local. No se envía nada a tu escuela. Para pedir ayuda real, acude con ${dato('orientador')} o llama a ${dato('telefono')}.`)
    );
    if (hayPeligro) {
      resultado.appendChild(crearElemento('p', 'aviso aviso--error',
        'Indicaste que hay peligro inmediato: no esperes. Busca ahora a una persona adulta de confianza o llama al 911.'));
    }
    resultado.appendChild(crearElemento('p', 'texto-suave',
      'Lo que escribiste no se guardó y ya se borró del formulario. Puedes usar estas mismas ideas para contárselo a una persona adulta.'));

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

  const total = preguntasCuestionario.length;
  let indicePregunta = 0;
  let aciertos = 0;
  let grupo = null;

  function mostrarPregunta(moverFoco) {
    const actual = preguntasCuestionario[indicePregunta];

    progresoTexto.textContent = `Pregunta ${indicePregunta + 1} de ${total}`;
    progresoBarra.style.width = `${(indicePregunta / total) * 100}%`;
    textoEscenario.textContent = actual.escenario;
    textoPregunta.textContent = actual.pregunta;

    grupo = crearGrupoOpciones({
      contenedor: $('#opcionesCuestionario'),
      opciones: actual.opciones.map((texto, i) => ({ valor: String(i), texto })),
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
    const actual = preguntasCuestionario[indicePregunta];
    const elegida = grupo.obtenerValor();

    if (elegida === null) {
      mostrarErrorCampo(grupo.elemento, errorCuestionario, 'Elige una opción antes de comprobar.');
      grupo.enfocar();
      return;
    }

    const esCorrecta = Number(elegida) === actual.correcta;
    if (esCorrecta) aciertos += 1;

    grupo.bloquear();
    grupo.marcar(String(actual.correcta), 'correcta', '✓ Más adecuada');
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

const claveAlmacen = 'puntoSeguro.termometro.v1';
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

// Clasifica un porcentaje en tres niveles
function obtenerNivel(porcentaje) {
  if (porcentaje >= 70) return { clase: '', nombre: 'Fortaleza' };
  if (porcentaje >= 40) return { clase: 'grafica__barra--media', nombre: 'Se puede mejorar' };
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

    // Gráfica de barras con HTML y CSS: el ancho de cada barra es el porcentaje
    const grafica = $('#grafica');
    grafica.textContent = '';
    preguntasEncuesta.forEach((pregunta, indice) => {
      const conteo = datos.conteos[indice];
      const positivas = conteo[pregunta.positiva];
      const porcentaje = Math.round((positivas / n) * 100);
      const nivel = obtenerNivel(porcentaje);

      const fila = crearElemento('li');
      const titulo = crearElemento('p', 'grafica__titulo', pregunta.corta);
      titulo.appendChild(crearElemento('span', 'etiqueta-nivel', nivel.nombre));

      const fondo = crearElemento('div', 'grafica__fondo');
      fondo.setAttribute('aria-hidden', 'true');
      const barra = crearElemento('div', 'grafica__barra ' + nivel.clase);
      barra.style.width = `${porcentaje}%`;
      fondo.appendChild(barra);

      const valor = crearElemento('p', 'grafica__valor',
        `${porcentaje} % de respuestas positivas (${positivas} de ${n})`);
      const nota = crearElemento('p', 'grafica__nota',
        porcentaje >= 70 ? 'Buena señal. Vale la pena cuidarla.' : pregunta.sugerencia);

      fila.append(titulo, fondo, valor, nota);
      grafica.appendChild(fila);
    });

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
