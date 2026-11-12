// Ubica · Genera la presentación de la exposición: apoyo/PRESENTACION.pptx (editable) y, aparte,
// fuentes/notas_presentacion.json con el título y las notas de cada diapositiva (de ahí sale el
// Guion de exposición). El PDF final (PRESENTACION.pdf) se convierte con LibreOffice:
//   soffice --headless --convert-to pdf --outdir .. ../apoyo/PRESENTACION.pptx
// Usa las capturas de ../capturas, los wireframes y la ilustración del plano.
// Uso (desde esta carpeta):  node hacer_guion.js   (necesita pptxgenjs, react-icons, react-dom y sharp)
'use strict';

const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const iconos = require('react-icons/md');

const AQUI = __dirname;
const ENTREGABLES = path.join(AQUI, '..');
const CAPTURAS = path.join(ENTREGABLES, 'capturas', 'final');
const DESTINO = path.join(ENTREGABLES, 'apoyo', 'PRESENTACION.pptx');
const NOTAS = path.join(AQUI, 'notas_presentacion.json');
const APLICAR_TEMA = process.env.APLICAR_TEMA; // ruta a apply_theme.js de la skill pptx (opcional)

// Paleta de la app en modo oscuro
const TEMA = {
  name: 'Ubica',
  headFontFace: 'Arial',
  bodyFontFace: 'Arial',
  colors: {
    dk1: '12141B', lt1: 'FFFFFF', dk2: '1E2230', lt2: 'ECEEF4',
    accent1: '7D93FF', accent2: 'FFC24A', accent3: '4CC98E', accent4: 'FF6B74', accent5: '9BA1B3', accent6: '3552E0',
    hlink: '7D93FF', folHlink: 'B9C4FF'
  }
};

function medidasPNG(archivo) {
  const datos = fs.readFileSync(archivo);
  return { ancho: datos.readUInt32BE(16), alto: datos.readUInt32BE(20) };
}

async function iconoPNG(nombre) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(iconos[nombre], { color: '#FFFFFF', size: 256 }));
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + png.toString('base64');
}

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // 10 × 5.625 pulgadas
  pres.title = 'Ubica · Presentación';
  pres.theme = { headFontFace: TEMA.headFontFace, bodyFontFace: TEMA.bodyFontFace };
  const C = pres.SchemeColor;

  // ---------- Diseños (layouts) ----------
  pres.defineSlideMaster({ title: 'PORTADA', background: { color: C.text1 }, objects: [] });
  pres.defineSlideMaster({
    title: 'CONTENIDO',
    background: { color: C.text1 },
    margin: [0.4, 0.5, 0.5, 0.5],
    objects: [
      { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.28, w: 9, h: 0.7, fontSize: 28, bold: true,
        color: C.background2, valign: 'middle', margin: 0 }, text: '' } },
      { text: { text: 'Ubica · Inventario por lugares', options: { x: 0.5, y: 5.2, w: 5, h: 0.25, fontSize: 9,
        color: C.accent5, margin: 0, isTextBox: true } } }
    ],
    slideNumber: { x: 9.1, y: 5.2, w: 0.4, h: 0.25, fontSize: 9, color: C.accent5, align: 'right' }
  });

  // ---------- Piezas que se repiten ----------
  const iconosCache = {};
  async function icono(slide, nombre, x, y, tam, colorFondo) {
    if (!iconosCache[nombre]) iconosCache[nombre] = await iconoPNG(nombre);
    slide.addShape(pres.shapes.OVAL, { x: x, y: y, w: tam, h: tam, fill: { color: colorFondo || C.accent6 }, line: { type: 'none' },
      objectName: 'círculo ' + nombre });
    const margen = tam * 0.22;
    slide.addImage({ data: iconosCache[nombre], x: x + margen, y: y + margen, w: tam - 2 * margen, h: tam - 2 * margen,
      altText: '', objectName: 'icono ' + nombre });
  }

  function tarjeta(slide, x, y, w, h, nombre) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: h, rectRadius: 0.12,
      fill: { color: C.text2 }, line: { color: '2E3240', width: 0.75 }, objectName: nombre });
  }

  function textoCaja(slide, contenido, opciones) {
    slide.addText(contenido, Object.assign({ isTextBox: true, margin: 0, color: C.background2, fontSize: 14, valign: 'top' }, opciones));
  }

  // Captura del celular con un marco redondeado detrás
  function celular(slide, archivo, x, y, alto, pie) {
    const medidas = medidasPNG(archivo);
    const ancho = alto * medidas.ancho / medidas.alto;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - 0.06, y: y - 0.06, w: ancho + 0.12, h: alto + 0.12, rectRadius: 0.16,
      fill: { color: '2E3240' }, line: { type: 'none' }, objectName: 'marco ' + path.basename(archivo) });
    slide.addImage({ path: archivo, x: x, y: y, w: ancho, h: alto, rounding: false, altText: pie, objectName: path.basename(archivo) });
    if (pie) textoCaja(slide, pie, { x: x - 0.4, y: y + alto + 0.12, w: ancho + 0.8, h: 0.3, fontSize: 11, align: 'center', color: C.accent5 });
    return ancho;
  }

  // Lo que se dice en cada diapositiva queda registrado para el Guion de exposición
  const guion = [];
  let tituloActual = 'Portada';
  function titular(slide, titulo) {
    tituloActual = titulo;
    slide.addText(titulo, { placeholder: 'title' });
  }
  function notar(slide, notas) {
    slide.addNotes(notas);
    guion.push({ titulo: tituloActual, notas: notas });
  }

  function nueva(seccion) {
    return pres.addSlide({ masterName: 'CONTENIDO', sectionTitle: seccion });
  }

  // Captura ancha (laptop o pantalla grande) con marco
  function pantalla(slide, archivo, x, y, ancho, pie) {
    const medidas = medidasPNG(archivo);
    const alto = ancho * medidas.alto / medidas.ancho;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - 0.05, y: y - 0.05, w: ancho + 0.1, h: alto + 0.1, rectRadius: 0.08,
      fill: { color: '2E3240' }, line: { type: 'none' }, objectName: 'marco ' + path.basename(archivo) });
    slide.addImage({ path: archivo, x: x, y: y, w: ancho, h: alto, altText: pie || '', objectName: path.basename(archivo) });
    if (pie) textoCaja(slide, pie, { x: x, y: y + alto + 0.12, w: ancho, h: 0.3, fontSize: 12, align: 'center', color: C.accent5 });
    return alto;
  }
  const cap = (nombre) => path.join(CAPTURAS, nombre + '.png');

  // El guion: quién habla, qué dice y qué hace (las indicaciones no se dicen)
  // { quien: 1 | 2, dice: '...', hace: '...' }
  function guionDe(slide, partes, extra) {
    slide.addNotes(partes.map((p) => 'Expositor ' + p.quien + ': ' + (p.hace ? '[' + p.hace + '] ' : '') + p.dice).join('\n\n'));
    guion.push(Object.assign({ titulo: tituloActual, partes: partes }, extra));
  }

  // 1. Portada ---------------------------------------------------------
  pres.addSection({ title: 'Ubica' });
  {
    const s = pres.addSlide({ masterName: 'PORTADA', sectionTitle: 'Ubica' });
    pantalla(s, cap('grande-1920-03-presentacion'), 4.3, 1.1, 5.3);
    s.addImage({ path: path.join(AQUI, 'icono.png'), x: 0.6, y: 0.9, w: 0.85, h: 0.85, altText: 'Icono de Ubica', objectName: 'icono app' });
    textoCaja(s, 'UBICA', { x: 0.6, y: 1.95, w: 3.5, h: 0.8, fontSize: 48, bold: true, color: C.accent1, charSpacing: 6 });
    textoCaja(s, 'El inventario que dice dónde está cada cosa', { x: 0.6, y: 2.8, w: 3.5, h: 0.9, fontSize: 20, bold: true });
    textoCaja(s, 'Equipo: ______________________', { x: 0.6, y: 4.6, w: 3.6, h: 0.35, fontSize: 13, color: C.accent5 });
    tituloActual = 'Portada';
    guionDe(s, [
      { quien: 1, hace: 'De pie, mirando al grupo', dice: 'Buenos días. Somos el equipo ___ y les presentamos Ubica: el inventario que también dice dónde está cada cosa.' }
    ], { senalar: 'El almacén en 3D de la portada: es la app real, no un dibujo.', enlace: 'Pasa a la siguiente con la pregunta «¿les ha pasado que…?».' });
  }

  // 2. Problema --------------------------------------------------------
  {
    const s = nueva('Ubica');
    titular(s, 'El problema');
    textoCaja(s, '¿Dónde está?', { x: 0.5, y: 1.5, w: 4.2, h: 0.9, fontSize: 44, bold: true, color: C.accent2 });
    textoCaja(s, 'Las listas dicen qué hay y cuánto. No dicen dónde.', { x: 0.5, y: 2.6, w: 3.8, h: 1.0, fontSize: 18 });
    const problemas = [
      ['MdMenuBook', 'Listas sin lugar', 'Papel o Excel'],
      ['MdSearch', 'Equipo «perdido»', 'Gabinete por gabinete'],
      ['MdEditNote', 'Préstamos en libreta', 'Nadie ve los vencidos']
    ];
    for (let i = 0; i < problemas.length; i++) {
      const y = 1.3 + i * 1.22;
      tarjeta(s, 5.0, y, 4.5, 1.02, 'tarjeta problema ' + (i + 1));
      await icono(s, problemas[i][0], 5.2, y + 0.21, 0.6, i === 2 ? 'C62F3B' : C.accent6);
      textoCaja(s, problemas[i][1], { x: 6.0, y: y + 0.16, w: 3.3, h: 0.36, fontSize: 16, bold: true });
      textoCaja(s, problemas[i][2], { x: 6.0, y: y + 0.54, w: 3.3, h: 0.3, fontSize: 12, color: C.accent5 });
    }
    guionDe(s, [
      { quien: 1, dice: 'En una escuela, el inventario suele ser una lista en Excel. Dice qué hay y cuánto, pero no dónde. Por eso, cuando alguien necesita el proyector, termina abriendo gabinete por gabinete. Y los préstamos se anotan en una libreta que nadie revisa.' },
      { quien: 1, hace: 'Señala la pregunta en amarillo', dice: 'Nosotros quisimos resolver esa pregunta: ¿dónde está?' }
    ], { senalar: 'La pregunta «¿Dónde está?» y las tres tarjetas, de arriba abajo.', enlace: 'Cede la palabra: «Mi compañero les cuenta nuestra propuesta».' });
  }

  // 3. Propuesta -------------------------------------------------------
  {
    const s = nueva('Ubica');
    titular(s, 'Un inventario, tres formas de ver cada lugar');
    const vistas = [['claro-17-lugar-lista', 'Lista'], ['claro-11-plano-25d', '2.5D'], ['claro-24-almacen-3d', '3D']];
    vistas.forEach(([archivo, nombre], i) => {
      const x = 0.9 + i * 2.05;
      celular(s, cap(archivo), x, 1.25, 3.1);
      textoCaja(s, nombre, { x: x - 0.2, y: 4.5, w: 1.85, h: 0.4, fontSize: 18, bold: true, align: 'center', color: C.accent1 });
    });
    const puntos = [['MdWifiOff', 'Funciona sin internet'], ['MdDevices', 'Celular, laptop y proyector'], ['MdLock', 'Los datos no salen del dispositivo']];
    for (let i = 0; i < puntos.length; i++) {
      await icono(s, puntos[i][0], 7.0, 1.55 + i * 1.0, 0.55, C.accent6);
      textoCaja(s, puntos[i][1], { x: 7.7, y: 1.55 + i * 1.0, w: 1.9, h: 0.55, fontSize: 13, valign: 'middle' });
    }
    guionDe(s, [
      { quien: 2, dice: 'Nuestra propuesta es una aplicación web que funciona sin internet, en celular y en computadora. Es un inventario completo y, además, cada lugar se puede ver de tres formas: como lista, en un plano 2.5D o en un modelo 3D. Tú eliges cuánto detalle quieres, lugar por lugar. Y todo se guarda en el propio dispositivo, sin cuentas ni servidores.' }
    ], { senalar: 'Los tres celulares, de izquierda a derecha, al decir «lista, 2.5D, 3D».', enlace: '«Empecemos por lo básico: el inventario.»' });
  }

  // 4. Inventario ------------------------------------------------------
  {
    const s = nueva('Ubica');
    titular(s, 'El inventario');
    pantalla(s, cap('escritorio-07-panel-lateral'), 0.5, 1.2, 6.3);
    const puntos = [['MdCategory', 'Categorías y estados'], ['MdFilterList', 'Buscar, filtrar, ordenar'], ['MdSwapHoriz', 'Préstamos y vencidos'], ['MdHistory', 'Historial de cada cambio']];
    for (let i = 0; i < puntos.length; i++) {
      await icono(s, puntos[i][0], 7.15, 1.25 + i * 0.9, 0.55, i === 2 ? 'C62F3B' : C.accent6);
      textoCaja(s, puntos[i][1], { x: 7.85, y: 1.25 + i * 0.9, w: 1.75, h: 0.55, fontSize: 13, valign: 'middle' });
    }
    guionDe(s, [
      { quien: 1, dice: 'Empecemos por el inventario. Cada artículo tiene categoría, número de inventario y piezas por estado: buenas, en reparación o dañadas. Podemos buscar, filtrar y ordenar. Los préstamos registran quién se lo llevó y cuándo regresa; los vencidos aparecen primero. Y cada cambio queda guardado en un historial.' }
    ], { senalar: 'La tabla (columnas Disponibles y Estado) y el panel de la derecha con las piezas por estado.', enlace: '«Hasta aquí es un buen inventario. Lo distinto viene ahora.»' });
  }

  // 5. Espacio: 2.5D y 3D ----------------------------------------------
  {
    const s = nueva('Ubica');
    titular(s, 'El espacio: plano 2.5D y modelo 3D');
    pantalla(s, cap('escritorio-08-editor-25d'), 0.5, 1.35, 4.4, '2.5D · arrastra los muebles a su sitio');
    pantalla(s, cap('escritorio-02-seleccion-3d'), 5.1, 1.35, 4.4, '3D · recorre el lugar y toca un mueble');
    guionDe(s, [
      { quien: 2, dice: 'Ahora, el espacio. En 2.5D dibujamos el lugar como un plano tipo videojuego y arrastramos los muebles a su sitio. En 3D, el mismo lugar se puede recorrer: giramos la cámara, nos acercamos y tocamos un mueble para ver qué guarda. Los modelos se generan por código, con sus medidas reales.' }
    ], { senalar: 'Primero la imagen izquierda (2.5D), luego la derecha (3D) y el panel con el contenido del gabinete.', enlace: '«Y lo mejor es cómo se conectan.»' });
  }

  // 6. Las vistas se conectan (demostración) ---------------------------
  {
    const s = nueva('Ubica');
    titular(s, 'Los mismos datos en todas las vistas');
    pantalla(s, cap('escritorio-03-movido-3d'), 0.5, 1.3, 4.1, 'Muevo un mueble en 3D…');
    pantalla(s, cap('escritorio-04-mismo-lugar-25d'), 5.4, 1.3, 4.1, '…y en 2.5D ya está en su lugar');
    s.addShape(pres.shapes.RIGHT_ARROW, { x: 4.72, y: 2.2, w: 0.56, h: 0.42, fill: { color: C.accent2 }, line: { type: 'none' }, objectName: 'flecha' });
    tarjeta(s, 2.3, 4.2, 5.4, 0.7, 'tarjeta localizar');
    await icono(s, 'MdMyLocation', 2.45, 4.28, 0.54, '2E7D5B');
    textoCaja(s, '«Localizar»: del artículo a su mueble, en un toque', { x: 3.15, y: 4.2, w: 4.4, h: 0.7, fontSize: 14, bold: true, valign: 'middle' });
    guionDe(s, [
      { quien: 1, hace: 'Demostración en vivo en la app; si no hay proyector con la app, usa las dos imágenes',
        dice: 'Lo más importante: las tres vistas usan los mismos datos. Busco «micrófono», toco «Localizar» y la app me lleva al almacén en 3D, con su vitrina resaltada. Si muevo un mueble aquí y cambio a 2.5D, ya está en su nuevo lugar. Nada se captura dos veces.' }
    ], { senalar: 'La flecha amarilla entre las dos imágenes.', enlace: '«¿Y cómo logramos que nunca se contradigan?»',
      demo: 'Inventario → buscar «micrófono» → abrir → «Localizar». Luego arrastrar el Banco y pulsar «2.5D».' });
  }

  // 7. Cómo está hecho -------------------------------------------------
  {
    const s = nueva('Ubica');
    titular(s, 'Cómo está hecho');
    const diagrama = path.join(AQUI, 'diagrama-arquitectura.png');
    const m = medidasPNG(diagrama);
    const ancho = 5.4, alto = ancho * m.alto / m.ancho;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.45, y: 1.15, w: ancho + 0.1, h: alto + 0.1, rectRadius: 0.08, fill: { color: 'FFFFFF' }, line: { type: 'none' }, objectName: 'fondo diagrama' });
    s.addImage({ path: diagrama, x: 0.5, y: 1.2, w: ancho, h: alto, altText: 'Diagrama: las tres vistas piden cambios a las reglas, que guardan en la base de datos', objectName: 'diagrama' });
    textoCaja(s, 'HTML · CSS · JavaScript\nIndexedDB · Three.js · Capacitor', { x: 6.25, y: 1.25, w: 3.3, h: 0.7, fontSize: 13, color: C.accent5 });
    const cifras = [['61', 'pruebas de la lógica'], ['276', 'comprobaciones en navegador']];
    cifras.forEach(([numero, etiqueta], i) => {
      tarjeta(s, 6.25, 2.2 + i * 1.3, 3.25, 1.1, 'tarjeta cifra ' + (i + 1));
      textoCaja(s, numero, { x: 6.4, y: 2.25 + i * 1.3, w: 1.3, h: 1.0, fontSize: 36, bold: true, color: C.accent3, valign: 'middle' });
      textoCaja(s, etiqueta, { x: 7.7, y: 2.25 + i * 1.3, w: 1.7, h: 1.0, fontSize: 13, valign: 'middle' });
    });
    guionDe(s, [
      { quien: 2, hace: 'Recorre el diagrama de arriba abajo', dice: '¿Cómo lo hicimos? Con HTML, CSS y JavaScript, una base de datos IndexedDB dentro del dispositivo y Three.js para el 3D. La clave fue separar las reglas del inventario de las pantallas: cualquier vista pide un cambio, las reglas lo validan y todas se actualizan. Lo comprobamos con más de trescientas pruebas automáticas.' }
    ], { senalar: 'Las tres cajas de arriba (vistas), la caja azul del centro y las dos cifras verdes.', enlace: '«Para cerrar…»' });
  }

  // 8. Conclusión ------------------------------------------------------
  {
    const s = nueva('Ubica');
    titular(s, 'Conclusión');
    const ideas = [['MdPlace', 'Un inventario que responde «¿dónde está?»'], ['MdViewInAr', 'Lista, 2.5D y 3D con los mismos datos'], ['MdVerified', 'App real: web y Android, sin internet']];
    for (let i = 0; i < ideas.length; i++) {
      await icono(s, ideas[i][0], 0.5, 1.35 + i * 1.0, 0.6, i === 2 ? '2E7D5B' : C.accent6);
      textoCaja(s, ideas[i][1], { x: 1.3, y: 1.35 + i * 1.0, w: 4.3, h: 0.6, fontSize: 16, valign: 'middle' });
    }
    textoCaja(s, 'Lo que sigue: probar en más dispositivos y seguir cada pieza por separado.', { x: 0.5, y: 4.4, w: 5.2, h: 0.5, fontSize: 12, color: C.accent5 });
    s.addImage({ path: path.join(AQUI, 'icono.png'), x: 7.15, y: 1.3, w: 1.2, h: 1.2, altText: 'Icono de Ubica', objectName: 'icono final' });
    textoCaja(s, 'Ubica: tu inventario, en su lugar.', { x: 5.8, y: 2.7, w: 3.9, h: 0.5, fontSize: 15, bold: true, color: C.accent1, align: 'center' });
    textoCaja(s, 'app9-ubica.vercel.app', { x: 6.0, y: 3.25, w: 3.5, h: 0.4, fontSize: 14, color: C.accent5, align: 'center' });
    textoCaja(s, '¿Preguntas?', { x: 6.0, y: 3.85, w: 3.5, h: 0.6, fontSize: 28, bold: true, color: C.accent2, align: 'center' });
    guionDe(s, [
      { quien: 2, dice: 'En resumen: Ubica es una aplicación real, publicada en la web y preparada como app de Android. Funciona sin internet y protege los datos con respaldos y copias automáticas. Nos falta probarla en más dispositivos y seguir cada pieza por separado.' },
      { quien: 1, hace: 'Da un paso al frente; este es el cierre del pitch', dice: 'Usamos la inteligencia artificial como asistente, pero las decisiones fueron nuestras: qué construir, qué no borrar nunca y qué probar. Con Ubica, la escuela deja de preguntar «¿dónde está?» y empieza a encontrarlo. Ubica: tu inventario, en su lugar. Gracias; con gusto respondemos sus preguntas.' }
    ], { senalar: 'El lema y la dirección web.', enlace: 'Fin. Los dos expositores quedan al frente para las preguntas.' });
  }

  await pres.writeFile({ fileName: DESTINO });
  if (APLICAR_TEMA) await require(APLICAR_TEMA).applyTheme(DESTINO, TEMA);
  fs.writeFileSync(NOTAS, JSON.stringify(guion, null, 2) + '\n');
  console.log('Creado: apoyo/PRESENTACION.pptx y fuentes/notas_presentacion.json');
})();
