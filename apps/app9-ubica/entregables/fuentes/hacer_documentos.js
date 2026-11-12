// Ubica · Genera los documentos de Word de los entregables finales:
//   DOCUMENTACION_TECNICA.docx, BITACORA_DESARROLLO.docx y GUION_EXPOSICION.docx
// La Bitácora se arma leyendo docs/prompts.md; el Guion lee fuentes/notas_presentacion.json, que
// escribe hacer_guion.js (córrelo antes). Al agregar prompts, basta con volver a correr esto.
// Uso (desde esta carpeta):  node hacer_documentos.js
// Necesita el paquete "docx" de npm.
'use strict';

const fs = require('fs');
const path = require('path');
const {
  AlignmentType, BorderStyle, TabStopType, Document, Footer, ImageRun, LevelFormat, Packer, PageBreak, Paragraph,
  ShadingType, Table,
  TableCell, TableRow, TextRun, VerticalAlign, WidthType, HeadingLevel, PageNumber
} = require('docx');

const AQUI = __dirname;
const ENTREGABLES = path.join(AQUI, '..');
// Carpeta de la app (repositorio privado APPS): ahí están docs/prompts.md y www/.
// Esta carpeta de entregables vive en el repositorio público DESCARGAS, así que se indica con UBICA_APP.
const APP = process.env.UBICA_APP || '/home/claude/apps/apps/app9-ubica';
const CAPTURAS = path.join(ENTREGABLES, 'capturas', 'etapa-1a');

// ---------- Estilo (mismos colores que la app) ----------
const COLOR = { acento: '3552E0', texto: '1A1D29', suave: '5E6475', borde: 'D9DCE5', fondoSuave: 'EEF0FA', resalte: 'F2A007' };
const LETRA = 'Arial';
const MONO = 'Courier New';
const ANCHO_UTIL = 9360; // 6.5 pulgadas en DXA (carta con márgenes de 1")

function texto(contenido, opciones) {
  return new TextRun(Object.assign({ text: contenido, font: LETRA }, opciones || {}));
}

// Párrafo con partes en **negritas** y `código`
function parrafo(contenido, opciones) {
  const partes = String(contenido).split(/(\*\*[^*]+\*\*|`[^`]+`)/).filter(Boolean).map((parte) => {
    if (parte.startsWith('**')) return texto(parte.slice(2, -2), { bold: true });
    if (parte.startsWith('`')) return texto(parte.slice(1, -1), { font: MONO, size: 20 });
    return texto(parte);
  });
  return new Paragraph(Object.assign({ children: partes, spacing: { after: 120, line: 276 } }, opciones || {}));
}

const vineta = (contenido) => parrafo(contenido, { numbering: { reference: 'vinetas', level: 0 }, spacing: { after: 60, line: 264 } });
const titulo1 = (contenido) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [texto(contenido)] });
const titulo2 = (contenido) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [texto(contenido)] });
const titulo3 = (contenido) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [texto(contenido)] });
const saltoDePagina = () => new Paragraph({ children: [new PageBreak()] });

function imagen(archivo, anchoPx, opciones) {
  const datos = fs.readFileSync(archivo);
  const { ancho, alto } = medidasPNG(datos);
  return new ImageRun(Object.assign({
    type: 'png', data: datos,
    transformation: { width: anchoPx, height: Math.round(anchoPx * alto / ancho) }
  }, opciones || {}));
}

// Lee ancho y alto de un PNG (están en los bytes 16 a 23)
function medidasPNG(datos) {
  return { ancho: datos.readUInt32BE(16), alto: datos.readUInt32BE(20) };
}

const bordeCelda = { style: BorderStyle.SINGLE, size: 4, color: COLOR.borde };
const bordes = { top: bordeCelda, bottom: bordeCelda, left: bordeCelda, right: bordeCelda };

function celda(contenido, ancho, opciones) {
  const ajustes = opciones || {};
  const hijos = Array.isArray(contenido) ? contenido : String(contenido).split('\n').map((linea) =>
    parrafo(linea, { spacing: { after: 40, line: 252 } }));
  return new TableCell({
    children: hijos.length ? hijos : [new Paragraph('')],
    width: { size: ancho, type: WidthType.DXA },
    borders: bordes,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: ajustes.alinear || VerticalAlign.TOP,
    shading: ajustes.fondo ? { fill: ajustes.fondo, type: ShadingType.CLEAR, color: 'auto' } : undefined
  });
}

// filas: lista de listas de textos. encabezado: la primera fila va sombreada y en negritas.
function tabla(anchos, filas, opciones) {
  const ajustes = opciones || {};
  return new Table({
    width: { size: anchos.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: anchos,
    rows: filas.map((fila, numeroFila) => new TableRow({
      tableHeader: ajustes.encabezado && numeroFila === 0,
      cantSplit: true,
      children: fila.map((contenido, columna) => {
        const esEncabezado = (ajustes.encabezado && numeroFila === 0) || (ajustes.primeraColumna && columna === 0);
        const valor = esEncabezado && typeof contenido === 'string' ? '**' + contenido + '**' : contenido;
        return celda(valor, anchos[columna], { fondo: esEncabezado ? COLOR.fondoSuave : null });
      })
    }))
  });
}

const espacio = () => new Paragraph({ children: [], spacing: { after: 120 } });

function pie(nombreDocumento) {
  return new Footer({
    children: [new Paragraph({
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: COLOR.borde, space: 6 } },
      // Tabulador a la derecha del área de texto: el número de página queda pegado al margen
      tabStops: [{ type: TabStopType.RIGHT, position: ANCHO_UTIL }],
      children: [
        texto('Ubica · ' + nombreDocumento, { size: 16, color: COLOR.suave }),
        texto('\tPágina ', { size: 16, color: COLOR.suave }),
        new TextRun({ children: [PageNumber.CURRENT], font: LETRA, size: 16, color: COLOR.suave })
      ]
    })]
  });
}

function documento(nombre, hijos) {
  return new Document({
    creator: 'Ubica',
    title: 'Ubica · ' + nombre,
    styles: {
      default: { document: { run: { font: LETRA, size: 21, color: COLOR.texto } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: LETRA, size: 32, bold: true, color: COLOR.acento },
          paragraph: { spacing: { before: 360, after: 160 }, keepNext: true, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: LETRA, size: 26, bold: true, color: COLOR.texto },
          paragraph: { spacing: { before: 280, after: 120 }, keepNext: true, outlineLevel: 1 } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: LETRA, size: 22, bold: true, color: COLOR.acento },
          paragraph: { spacing: { before: 200, after: 80 }, keepNext: true, outlineLevel: 2 } }
      ]
    },
    numbering: {
      config: [{
        reference: 'vinetas',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 270 } } } }]
      }]
    },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1300, bottom: 1300, left: 1440, right: 1440 } } },
      footers: { default: pie(nombre) },
      children: hijos
    }]
  });
}

// Portada: icono, nombre, título del documento y datos para llenar a mano
function portada(tituloDocumento, subtitulo) {
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 200 },
      children: [imagen(path.join(AQUI, 'icono.png'), 120)] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
      children: [texto('UBICA', { bold: true, size: 56, color: COLOR.acento, characterSpacing: 40 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
      children: [texto(tituloDocumento, { bold: true, size: 30 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 },
      children: [texto(subtitulo, { color: COLOR.suave, size: 22 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 },
      children: [imagen(path.join(AQUI, 'plano-claro.png'), 380)] }),
    tabla([2600, 6760], [['Materia', ''], ['Profesor(a)', ''], ['Equipo', ''], ['Fecha de entrega', '']],
      { primeraColumna: true }),
    saltoDePagina()
  ];
}

// Dos capturas lado a lado con su pie (para comparar etapas o antes y después)
function capturasLadoALado(lista, anchoPx) {
  const ancho = Math.floor(ANCHO_UTIL / lista.length);
  return new Table({
    width: { size: ANCHO_UTIL, type: WidthType.DXA }, columnWidths: lista.map(() => ancho),
    rows: [new TableRow({ cantSplit: true, children: lista.map(([archivo, pie]) => celda([
      new Paragraph({ alignment: AlignmentType.CENTER, children: [imagen(archivo, anchoPx)] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 },
        children: [texto(pie, { italics: true, size: 17, color: COLOR.suave })] })
    ], ancho, { alinear: VerticalAlign.TOP })) })]
  });
}

// =========================================================================
// DOCUMENTACIÓN TÉCNICA
// =========================================================================
// Cifras de las pruebas (se actualizan a mano después de ejecutarlas)
const PRUEBAS = { logica: 61, navegador: 276 };
const FINAL = path.join(ENTREGABLES, 'capturas', 'final');
const cap = (nombre) => path.join(FINAL, nombre + '.png');

function figura(archivo, anchoPx, pieTexto) {
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 }, keepNext: true, children: [imagen(archivo, anchoPx)] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
      children: [texto(pieTexto, { italics: true, size: 18, color: COLOR.suave })] })
  ];
}

function documentacionTecnica() {
  const hijos = portada('Documentación técnica', 'Inventario con lugares en Lista, 2.5D y 3D · Versión definitiva');

  // ---------- 1 ----------
  hijos.push(
    titulo1('1. Descripción general'),
    parrafo('**Ubica es un inventario que también dice dónde está cada cosa.** Funciona como un inventario normal (artículos, categorías, estados, préstamos e historial) y, para quien lo quiera, organiza **lugares** con **muebles** que se pueden ver de tres formas: como lista, en un plano isométrico **2.5D** o en un modelo **3D** que se puede recorrer.'),
    titulo2('Problema que resuelve'),
    parrafo('En la mayoría de las escuelas el inventario es una lista en papel o en Excel que dice **qué** hay y cuánto, pero no **dónde** está ni en qué estado. Cuando alguien busca los microscopios o el proyector termina abriendo gabinetes, y los préstamos se anotan en una libreta que nadie revisa.'),
    titulo2('Objetivo'),
    parrafo('Digitalizar el control del equipo de una institución con una aplicación web sencilla que: registre artículos y su estado, controle préstamos, guarde un historial, y permita **localizar** cada artículo en el lugar y el mueble donde está. Todo sin internet y sin servidor.'),
    titulo2('Alcance'),
    tabla([2400, 6960], [
      ['Incluye', 'Inventario completo sin necesidad de lugares; categorías; estados; préstamos con devolución parcial; historial; búsqueda, filtros y orden; lugares con plano opcional; muebles; vistas Lista, 2.5D y 3D con los mismos datos; respaldos y copias automáticas; exportación a Excel (.csv); uso en celular, laptop y pantalla grande.'],
      ['No incluye', 'Cuentas de usuario, sincronización entre dispositivos, seguimiento de cada pieza por separado (solo se registran números de serie), códigos QR ni reportes. Ver «Limitaciones reales».']
    ], { primeraColumna: true }),
    titulo2('Usuarios'),
    parrafo('Personal que cuida equipo: encargados de laboratorio, docentes, bodega y servicios. En el celular se usa de pie y con una mano (botones de al menos 48 px); en una laptop se administra el inventario con tabla, teclado y ratón; en un proyector se presenta el lugar.'),
    saltoDePagina()
  );

  // ---------- 2 ----------
  hijos.push(
    titulo1('2. Tecnologías utilizadas'),
    tabla([3200, 6160], [
      ['Tecnología', 'Para qué se usa'],
      ['HTML5, CSS3 y JavaScript (sin frameworks)', 'Toda la aplicación.'],
      ['IndexedDB', 'La base de datos dentro del dispositivo (versión 3, 6 tablas + copias).'],
      ['Canvas 2D', 'La vista 2.5D isométrica, dibujada con fórmulas propias.'],
      ['Three.js r170 (licencia MIT)', 'La vista 3D: escena, cámara, luces, sombras y selección. Es la **única librería** de la app; va incluida en ella (692 KB) y se descarga solo al abrir el 3D.'],
      ['Inter (licencia OFL)', 'La tipografía, incluida en la app para verse igual sin internet.'],
      ['Capacitor', 'Empaqueta la web como app de Android.'],
      ['Git, GitHub y GitHub Actions', 'Guardan el código, compilan y firman el APK y buscan secretos en cada subida.'],
      ['Vercel', 'Publica la versión web (https://app9-ubica.vercel.app).'],
      ['Node.js, Playwright y Pillow', 'Pruebas automáticas de la lógica y del uso en el navegador, y capturas.'],
      ['Claude (Anthropic)', 'Asistente de IA para planear, programar, probar y redactar (ver la Bitácora de desarrollo).']
    ], { encabezado: true }),
    titulo2('¿Por qué Three.js?'),
    parrafo('Se compararon tres caminos para el 3D:'),
    tabla([2600, 3380, 3380], [
      ['Opción', 'Ventajas', 'Desventajas'],
      ['WebGL «a mano»', 'Sin dependencias.', 'Habría que escribir y mantener matrices, luces, sombras y selección: mucho código difícil de probar.'],
      ['3D simulado con CSS', 'Ligero.', 'Sin cámara libre real, sin sombras, se rompe con muchos muebles.'],
      ['**Three.js (elegida)**', 'Estándar, estable, hace bien justo lo difícil (cámara, luz, sombras, tocar objetos).', 'Añade 692 KB. Se resolvió cargándola **solo cuando se abre el 3D**.']
    ], { encabezado: true }),
    saltoDePagina()
  );

  // ---------- 3 ----------
  hijos.push(
    titulo1('3. Arquitectura'),
    parrafo('La idea central: **las reglas del inventario viven en un solo lugar** (`nucleo.js`) y no saben nada de pantallas. Las tres vistas solo muestran datos y piden operaciones. Por eso es imposible que el 2.5D y el 3D «digan cosas distintas»: no guardan nada por su cuenta.'),
    ...figura(path.join(AQUI, 'diagrama-arquitectura.png'), 600, 'Cómo viaja un cambio: de cualquier vista a las reglas, a la base de datos, y de vuelta a todas las vistas.'),
    titulo2('Estructura del proyecto y responsabilidad de cada módulo'),
    tabla([2500, 6860], [
      ['Archivo (`www/`)', 'Responsabilidad'],
      ['`nucleo.js`', 'Lógica pura: validación, operaciones (lugares, muebles, artículos, estados, préstamos, categorías), consultas con filtros y orden, historial, respaldo, revisión de reglas, plan de migración, geometría isométrica y **catálogo de piezas** de cada mueble. Se prueba con node, sin navegador.'],
      ['`basedatos.js`', 'IndexedDB: abrir, inspeccionar sin cambiar, migrar en una transacción, leer, escribir y exportar de emergencia.'],
      ['`escena.js`', 'Vista 2.5D: dibuja en `<canvas>`, entiende toques, zoom, selección y arrastre.'],
      ['`escena3d.js`', 'Vista 3D con Three.js. Módulo aparte que se carga bajo demanda. Construye los modelos, mueve la cámara y avisa qué se tocó. **No contiene reglas del inventario.**'],
      ['`ui.js`', 'Base de la interfaz: estado, `ejecutar()` (guardar + historial + deshacer), candado de escritura, paneles y avisos.'],
      ['`vistas.js`', 'Secciones Inventario, Lugares, espacio de trabajo (Lista / 2.5D / 3D), Préstamos y Más.'],
      ['`fichas.js`', 'Paneles de artículo, mueble, lugar, categorías, préstamo y devolución.'],
      ['`datos.js`', 'Respaldo, restaurar, copias, CSV, ejemplo, vaciar, revisión al abrir, pantalla de migración y arranque.'],
      ['`app.js`', 'Coordinación: navegación, botón Atrás, atajos de teclado, modo sin conexión.'],
      ['`compartir.js`', 'Compartir archivos en Android.'],
      ['`styles.css`, `index.html`', 'Sistema de diseño y estructura.'],
      ['`Pruebas/`', 'Pruebas de lógica, recorrido en navegador y rendimiento.']
    ], { encabezado: true }),
    titulo2('Cómo se guarda un cambio'),
    vineta('La vista llama a una operación de `nucleo.js` (por ejemplo `moverMueble`). La operación **valida** y devuelve una lista de cambios; no toca nada.'),
    vineta('`ejecutar()` añade un **movimiento de historial** por cada registro y guarda todo en **una sola transacción**: o se guarda todo o nada.'),
    vineta('Solo si se guardó, se aplica a la memoria y se vuelven a dibujar las vistas abiertas. **Deshacer** es la misma lista invertida.'),
    vineta('Un **candado** evita que dos toques casi simultáneos guarden dos veces.'),
    saltoDePagina()
  );

  // ---------- 4 ----------
  hijos.push(
    titulo1('4. Modelo de datos y base de datos'),
    parrafo('IndexedDB es una base de datos que ya trae el navegador y el WebView de Android. Guarda tablas («almacenes») con una llave (`id`) e índices. No necesita servidor ni internet; por eso se eligió en lugar de MySQL.'),
    ...figura(path.join(AQUI, 'diagrama-datos.png'), 600, 'Las seis tablas y cómo se relacionan.'),
    tabla([1700, 4700, 2960], [
      ['Tabla', 'Campos', 'Relación'],
      ['lugares', 'id, nombre, tipo, plano {ancho, fondo} o vacío, planoAnterior, vista', '—'],
      ['muebles', 'id, lugarId, tipo, nombre, x, y (vacías = sin colocar), ancho, fondo, giro', 'lugares'],
      ['articulos', 'id, nombre, categoriaId, codigo, notas, series, muebleId | lugarId | ninguno, estados {bueno, reparacion, danado}', 'muebles, lugares, categorias'],
      ['prestamos', 'id, articuloId, persona, grupo, cantidad, fechaSalida, fechaLimite, devuelto, devueltasDanadas, nota', 'articulos'],
      ['categorias', 'id, nombre, color, orden, fija', '—'],
      ['movimientos', 'id, momento, operacionId, tipo, entidad, entidadId, antes, despues, detalle', 'cualquier tabla']
    ], { encabezado: true }),
    titulo2('Reglas del modelo'),
    vineta('**Ubicación única:** un artículo está dentro de un mueble, **o** directo en un lugar, **o** «Sin ubicación». La ubicación es opcional: nunca se inventa una.'),
    vineta('**Cantidades:** total = buen estado + en reparación + dañadas. Disponibles = buen estado − prestadas. Lo prestado no se puede dar de baja ni cambiar de estado.'),
    vineta('**Un mueble, una posición:** `x`, `y`, `ancho`, `fondo` y `giro` son los mismos para 2.5D y 3D. Dos muebles no pueden ocupar la misma casilla.'),
    vineta('**Plano opcional:** quitarlo no borra muebles ni artículos; al recrearlo todo vuelve a su casilla.'),
    vineta('**Borrados seguros:** borrar un mueble pasa sus artículos al lugar; borrar un lugar muestra antes qué se afecta. Todo con «Deshacer».'),
    titulo2('Migraciones'),
    parrafo('Quien ya tenía datos de versiones anteriores (bases 1 y 2, con «espacios» y «equipo») no debe perder nada:'),
    vineta('**1. Revisar sin cambiar:** al abrir, la app lee la base vieja y calcula el plan de conversión con todos los ajustes necesarios.'),
    vineta('**2. Preguntar si hay algo que corregir:** si todo está sano se actualiza sola; si no, muestra qué encontró y espera la aprobación (y ofrece descargar un respaldo).'),
    vineta('**3. Todo o nada:** la conversión corre dentro de la transacción de actualización: guarda una copia de lo anterior y escribe lo nuevo. Si falla a la mitad, la base queda como estaba (probado cortándola a propósito).'),
    vineta('**4. Nunca se borra un registro para que las reglas pasen.**'),
    parrafo('Los campos de esta versión (`vista`, `series`) son opcionales: no hizo falta otra migración y los respaldos anteriores siguen sirviendo.'),
    capturasLadoALado([
      [cap('claro-29-revision-migracion'), 'Revisión antes de actualizar'],
      [cap('claro-30-migracion-interrumpida'), 'Actualización interrumpida: nada se pierde'],
      [cap('claro-21-base-de-datos'), 'Visor de la base de datos']
    ], 150),
    saltoDePagina()
  );

  // ---------- 5 ----------
  hijos.push(
    titulo1('5. Sistema de inventario'),
    parrafo('El inventario funciona **sin crear ningún lugar**. Es la sección principal de la app.'),
    capturasLadoALado([
      [cap('claro-02-inventario'), 'Inventario en el celular'],
      [cap('claro-03-filtros'), 'Filtros combinables'],
      [cap('claro-05-ficha-articulo'), 'Ficha del artículo']
    ], 150),
    titulo2('Artículos'),
    vineta('Nombre, categoría, número de inventario, notas y números de serie opcionales.'),
    vineta('Acciones: prestar, localizar, entrada de piezas, cambiar estado, dar de baja con motivo, mover, editar, ver historial y borrar (con confirmación).'),
    vineta('Búsqueda por nombre, número, serie o notas (sin importar acentos); filtros por estado, categoría y lugar que se combinan; orden por cualquier columna.'),
    titulo2('Categorías'),
    parrafo('Doce iniciales (Laboratorio, Cómputo, Herramientas, Limpieza, Seguridad…) y las que el usuario cree. Se pueden renombrar, cambiar de color y borrar: los artículos de una categoría borrada pasan a otra. «Otros» es fija.'),
    titulo2('Estados'),
    parrafo('Cada artículo cuenta sus piezas en **buen estado**, **en reparación** y **dañadas**. Solo se prestan las de buen estado. Cambiar de estado, dar entrada o dar de baja siempre deja registro.'),
    titulo2('Préstamos'),
    vineta('Quién, grupo, cantidad, fecha de regreso y nota. Solo deja prestar lo disponible.'),
    vineta('**Devolución parcial:** se pueden regresar solo algunas piezas e indicar cuántas llegaron dañadas; el préstamo sigue abierto por el resto.'),
    vineta('Los vencidos aparecen primero y se marcan con texto, no solo con color.'),
    titulo2('Historial'),
    parrafo('Cada cambio guarda un movimiento con fecha, tipo, y los datos de antes y después, en la misma transacción que el cambio. Se consulta por artículo o completo en «Más → Historial».'),
    capturasLadoALado([
      [cap('claro-08-prestamos'), 'Préstamos'],
      [cap('claro-09-devolver'), 'Devolución parcial'],
      [cap('claro-07-historial'), 'Historial del artículo']
    ], 150),
    saltoDePagina()
  );

  // ---------- 6 ----------
  hijos.push(
    titulo1('6. Lugares y muebles'),
    parrafo('Un **lugar** es un salón, laboratorio, bodega u oficina. Cada lugar decide su nivel de detalle y lo puede cambiar cuando quiera: solo lista, plano 2.5D o modelo 3D. En el mismo inventario conviven lugares de los tres tipos.'),
    parrafo('Hay ocho tipos de **mueble**: mesa, escritorio, estante, gabinete, vitrina, casillero, caja y banco. Se pueden colocar, mover, girar, cambiar de medidas (1 a 6 casillas), renombrar y borrar sin perder lo que guardan.'),
    capturasLadoALado([
      [cap('claro-10-lugares'), 'Lugares'],
      [cap('claro-17-lugar-lista'), 'Un lugar como lista'],
      [cap('claro-18-borrar-lugar'), 'Borrar un lugar dice qué se afecta']
    ], 150),
    titulo2('Editor 2.5D'),
    parrafo('Es un plano isométrico dibujado en un `<canvas>` con dos fórmulas: `pantallaX = origenX + (x − y) × medioAncho` y `pantallaY = origenY + (x + y) × medioAlto`. Cada mueble es una caja de tres caras; se dibujan de atrás hacia adelante.'),
    vineta('**Seleccionar** un mueble marca su huella y muestra una barra con «Abrir», «Mover», «Girar».'),
    vineta('**Arrastrar** el mueble seleccionado muestra una vista previa: verde si cabe, rojo si no. Al soltar se guarda.'),
    vineta('Un dedo mueve la vista, dos dedos hacen zoom; ninguno coloca muebles por accidente. La vista se puede girar en cuatro direcciones.'),
    capturasLadoALado([
      [cap('claro-11-plano-25d'), 'Laboratorio en 2.5D'],
      [cap('claro-12-seleccion'), 'Mueble seleccionado'],
      [cap('claro-14-arrastrando'), 'Arrastrando con vista previa']
    ], 150),
    saltoDePagina(),
    titulo2('Motor y arquitectura 3D'),
    parrafo('La vista 3D usa los **mismos registros** de la tabla `muebles`. No hay «archivo 3D» ni datos duplicados.'),
    vineta('**Carga bajo demanda:** `escena3d.js` y Three.js se descargan con `import()` la primera vez que se abre la vista 3D. Quien usa solo el inventario no gasta ni datos ni memoria.'),
    vineta('**Modelos por piezas:** `nucleo.js` describe cada mueble como una lista de cajas (repisas, puertas, patas, vidrio) con medidas y material. `escena3d.js` convierte esas cajas en geometría. Así los modelos respetan las medidas reales, no pesan y el catálogo se prueba con node.'),
    vineta('**Cámara libre que no se pierde:** orbitar (un dedo o arrastrar), acercar (pellizco o rueda), desplazar (dos dedos o clic derecho). Tiene límites: no pasa bajo el piso, no se aleja sin fin, y «Ver todo» siempre regresa.'),
    vineta('**Selección:** al tocar se lanza un rayo desde la cámara (raycasting) para saber qué mueble se tocó. La escena solo avisa «tocaron este mueble»; la interfaz decide qué hacer.'),
    vineta('**Luz y sombras:** luz ambiental más una direccional con sombras. Si el dispositivo va lento, las sombras se apagan solas.'),
    vineta('**Liberación de recursos:** al salir del lugar se destruyen geometrías, materiales y el contexto gráfico (probado: abrir tres veces usa la misma memoria).'),
    vineta('**Sin WebGL:** se muestra un aviso y se ofrece la vista 2.5D; nada más deja de funcionar.'),
    ...figura(cap('escritorio-02-seleccion-3d'), 600, 'Almacén en 3D en una laptop: el mueble seleccionado y su contenido al lado.'),
    titulo2('Comunicación entre vistas'),
    parrafo('Las tres vistas comparten un **estado** (lugar abierto, mueble seleccionado, artículo resaltado) y un mismo **contrato**: reciben los datos y dos avisos, «tocaron esto» y «arrastraron este mueble aquí». Cinco casos que se probaron automáticamente:'),
    tabla([3200, 6160], [
      ['Caso', 'Qué pasa'],
      ['1. De la lista al 3D', '«Localizar» en un artículo abre su lugar, selecciona el mueble y la cámara lo enfoca.'],
      ['2. Del 3D al inventario', 'Tocar un mueble en 3D muestra sus artículos; desde ahí se abre, presta o agrega.'],
      ['3. Mover en una vista', 'Arrastrar un mueble en 3D lo guarda; al cambiar a 2.5D aparece en la casilla nueva (y al revés).'],
      ['4. Artículo sin ubicación', 'No ofrece «Localizar» ni se le inventa una posición.'],
      ['5. Niveles mezclados', 'Un lugar en 3D, otro en 2.5D y otro solo con lista funcionan juntos.']
    ], { encabezado: true }),
    capturasLadoALado([
      [cap('escritorio-03-movido-3d'), 'Se mueve un mueble en 3D…'],
      [cap('escritorio-04-mismo-lugar-25d'), '…y en 2.5D ya está en su sitio nuevo']
    ], 290),
    saltoDePagina()
  );

  // ---------- 7 ----------
  hijos.push(
    titulo1('7. Diseño de interfaz'),
    titulo2('Wireframes del MVP'),
    parrafo('Antes de programar el primer MVP se hicieron wireframes (bocetos en gris que deciden qué hay en cada pantalla). Están completos en `apoyo/WIREFRAMES.pdf`. La interfaz definitiva conserva sus ideas (lo más usado abajo, paneles que suben, «Deshacer» en lugar de preguntar todo) y reorganiza la navegación.'),
    ...figura(path.join(ENTREGABLES, 'wireframes', 'wireframes-1.png'), 480, 'Wireframes originales: mapa de navegación y gestos.'),
    titulo2('Sistema de diseño'),
    parrafo('Todos los colores, tamaños de letra, espacios, radios y sombras son **variables de CSS**. Cambiar una variable cambia toda la app; el modo oscuro y las pantallas grandes solo redefinen variables.'),
    tabla([4680, 2340, 2340], [
      ['Color', 'Modo claro', 'Modo oscuro'],
      ['Acento (acciones principales)', '#3552E0', '#7D93FF'],
      ['Fondo', '#F3F4F8', '#12141B'],
      ['Peligro y vencidos', '#C62F3B', '#FF6B74']
    ], { encabezado: true }),
    vineta('**Jerarquía:** una sola acción principal (azul) por pantalla; lo destructivo en rojo y separado.'),
    vineta('**Navegación:** cuatro secciones fijas (Inventario, Lugares, Préstamos, Más).'),
    vineta('**Paneles contextuales:** fichas y formularios aparecen sin sacar al usuario de donde estaba.'),
    vineta('**Estados vacíos y errores** que explican qué hacer; animaciones cortas que se apagan con «reducir movimiento».'),
    vineta('**Accesibilidad:** botones de 48 px, vista Lista en texto para lector de pantalla, foco visible, estados con texto y no solo color.'),
    capturasLadoALado([
      [cap('claro-01-primer-uso'), 'Primer uso'],
      [cap('oscuro-02-inventario'), 'Modo oscuro'],
      [cap('claro-19-mas'), 'Sección «Más»']
    ], 150),
    titulo2('Adaptación a dispositivos'),
    tabla([2400, 6960], [
      ['Entorno', 'Cómo se adapta'],
      ['Celular (desde 360 px)', 'Navegación abajo, paneles que suben desde abajo, tabla resumida, gestos táctiles.'],
      ['Laptop y escritorio (≥ 900 px)', 'Navegación a la izquierda, tabla completa con columnas ordenables, panel a la derecha que **no tapa** el contenido, atajos de teclado y ratón.'],
      ['Pantalla grande (≥ 1700 y ≥ 2300 px)', 'Letra y espacios crecen para leerse de lejos. **Modo presentación:** solo la escena, sin herramientas; en 3D la cámara gira despacio.']
    ], { encabezado: true }),
    ...figura(cap('escritorio-07-panel-lateral'), 600, 'Laptop (1366 × 768): la tabla y el panel del artículo a la vez.'),
    ...figura(cap('grande-1920-03-presentacion'), 600, 'Modo presentación en 1920 × 1080.'),
    saltoDePagina()
  );

  // ---------- 8 ----------
  hijos.push(
    titulo1('8. Respaldos y seguridad'),
    titulo2('Respaldos'),
    vineta('**Respaldo en archivo (.json):** se guarda o comparte; al restaurarlo se revisa registro por registro y antes se guarda una copia de lo actual.'),
    vineta('**Copias automáticas:** hasta 6 en el dispositivo (una al día si hubo cambios, y antes de restaurar, reparar, vaciar o actualizar).'),
    vineta('**Revisión al abrir:** si hay datos que no cumplen las reglas, avisa y ofrece «Reparar» sin borrar nada.'),
    vineta('**Excel (.csv)** del inventario.'),
    titulo2('Seguridad y privacidad'),
    vineta('**Todo texto del usuario se escapa** antes de mostrarse (`<img onerror=…>` se ve como texto). Se prueba en cada recorrido.'),
    vineta('**Validación** de todos los formularios en `nucleo.js`; los respaldos importados se validan igual.'),
    vineta('**CSV protegido** contra fórmulas maliciosas.'),
    vineta('**Privacidad:** sin cuentas, servidores ni analíticas. Nada sale del dispositivo salvo que el usuario comparta un respaldo. Los préstamos guardan el nombre de quien se lleva algo: conviene avisarlo.'),
    vineta('**Sin secretos en el código;** GitHub los busca en cada subida. Three.js e Inter se incluyen como archivos locales: la app no pide nada a terceros.'),
    capturasLadoALado([
      [cap('claro-23-copias'), 'Copias automáticas'],
      [cap('claro-22-restaurar'), 'Restaurar con copia previa'],
      [cap('claro-31-reparar'), 'Revisión al abrir']
    ], 150),
    saltoDePagina()
  );

  // ---------- 9 ----------
  hijos.push(
    titulo1('9. Pruebas'),
    parrafo('**Todas se ejecutaron en una computadora.** El navegador fue Chromium controlado por Playwright y el 3D se dibujó por software. Ninguna sustituye la prueba en un dispositivo real (ver «Limitaciones reales»).'),
    titulo2('Lógica: ' + PRUEBAS.logica + ' pruebas con node (todas bien)'),
    vineta('Geometría isométrica, gestos, choques y orden de dibujo.'),
    vineta('Operaciones: plano opcional, borrados seguros con «Deshacer» exacto, estados, préstamos, **devolución parcial**, categorías, historial, **series**, **medidas de muebles**.'),
    vineta('Consultas: búsqueda, filtros combinados y orden. Catálogo de piezas 3D (todas las piezas caben dentro del mueble).'),
    vineta('Respaldo y migración contra resultados esperados congelados.'),
    titulo2('Navegador: ' + PRUEBAS.navegador + ' comprobaciones con Playwright (todas bien)'),
    tabla([2900, 6460], [
      ['Grupo', 'Qué comprueba'],
      ['Celular 390 × 844, claro y oscuro', 'Primer uso, altas, validación, texto con HTML, doble toque, filtros, préstamos, devolución parcial, lugares, 2.5D (colocar, arrastrar, pellizcar), borrados y deshacer, respaldo, copias, sin desbordes.'],
      ['Tres vistas', 'Los cinco casos de comunicación; el 3D crea un modelo por mueble en la casilla y giro correctos; cámara con límites; mover, girar y colocar desde 3D; gestos táctiles en 3D; el motor no se carga hasta abrirlo; memoria estable.'],
      ['Laptop 1366 × 768', 'Navegación lateral, tabla ordenable, panel que no tapa, atajos de teclado.'],
      ['Pantallas 1920 y 2560', 'La interfaz crece; modo presentación.'],
      ['Solo listas', 'Inventario sin ningún lugar.'],
      ['Migraciones', 'Bases 1 y 2, inconsistencias, interrupción a la mitad, base de versión más nueva.'],
      ['Solidez', 'Datos dañados, navegador antiguo, base que no abre, dispositivo sin WebGL.']
    ], { encabezado: true }),
    titulo2('Rendimiento (simulación, procesador 4× más lento)'),
    tabla([3400, 1500, 1300, 1700, 1460], [
      ['Inventario', 'Dibujo 2.5D', 'Buscar', 'Pintar tabla', 'Revisar al abrir'],
      ['300 muebles, 3 300 artículos', '6 ms', '6 ms', '61 ms', '49 ms'],
      ['1 000 muebles, 10 400 artículos', '6 ms', '8 ms', '154 ms', '152 ms'],
      ['4 000 muebles, 32 600 artículos', '10 ms', '33 ms', '889 ms', '539 ms']
    ], { encabezado: true }),
    parrafo('3D con 200 muebles en un solo lugar: se construye completo (unos 1 300 dibujos por cuadro, ~150 ms por cuadro **dibujando por software**; en un celular con procesador gráfico será distinto y **no se ha medido**).'),
    titulo2('Errores que encontraron las pruebas'),
    vineta('**MVP y Etapa 0:** «clic fantasma», dos toques que duplicaban registros, plano en blanco en WebViews antiguos, Atrás que sacaba de la app.'),
    vineta('**Etapa 1A:** el historial no mostraba préstamos; un «Deshacer» viejo seguía disponible.'),
    vineta('**Versión definitiva:** el título quedaba cortado por los botones en el celular; el encuadre del 3D dejaba fuera parte del lugar en pantallas angostas; las etiquetas 3D eran demasiado grandes.'),
    saltoDePagina()
  );

  // ---------- 10 ----------
  const C0 = path.join(ENTREGABLES, 'capturas', 'etapa-0');
  const C1 = path.join(ENTREGABLES, 'capturas', 'etapa-1a');
  hijos.push(
    titulo1('10. Limitaciones reales'),
    vineta('**No se ha probado en ningún dispositivo real** (Android, iPhone, laptop o proyector físicos). La fluidez del 3D en un celular es la mayor incógnita.'),
    vineta('**Piezas individuales:** solo se registran números de serie por artículo; no hay estado ni préstamo por pieza.'),
    vineta('**Edición en 3D:** mover, girar, cambiar medidas y colocar muebles. No hay asas para estirar con el dedo ni edición de colores.'),
    vineta('**Deshacer** solo del último cambio; no hay «Rehacer».'),
    vineta('**Un dispositivo, un inventario:** sin usuarios ni sincronización; los datos se pasan con el respaldo.'),
    vineta('**Desinstalar la app o borrar los datos del navegador borra el inventario** si no hay respaldo en archivo.'),
    vineta('El 3D necesita WebGL; sin él se usa el 2.5D. Abierta con doble clic desde una carpeta (`file://`), el 3D no carga.'),
    vineta('Con inventarios de decenas de miles de artículos, pintar la tabla filtrada se acerca a un segundo en un equipo lento.'),
    titulo1('11. Evolución del proyecto'),
    tabla([2300, 1700, 5360], [
      ['Etapa', 'Fecha', 'Qué se hizo'],
      ['Prototipo', '9 nov 2026', 'Un solo archivo HTML con espacios, muebles y búsqueda.'],
      ['MVP', '9 nov 2026', 'Wireframes, IndexedDB, préstamos, lista accesible, respaldo, APK y web.'],
      ['Auditoría', '9–10 nov', 'Revisión sin cambiar archivos: 4 errores que las pruebas no veían y una hoja de ruta.'],
      ['Etapa 0', '10 nov 2026', 'Solidez: candado, rendimiento, copias automáticas, revisión al abrir.'],
      ['Etapa 1A', '10 nov 2026', 'Cimientos de datos: lugares con plano opcional, ubicación única, estados, categorías, historial, migración segura.'],
      ['Versión definitiva', '10–11 nov 2026', 'Interfaz nueva, inventario profesional, editor 2.5D con arrastre, vista 3D, tres entornos.']
    ], { encabezado: true }),
    capturasLadoALado([
      [path.join(C0, 'claro-03-plano.png'), 'Etapa 0'],
      [path.join(C1, 'claro-03-plano.png'), 'Etapa 1A'],
      [cap('claro-24-almacen-3d'), 'Versión definitiva']
    ], 150),
    titulo1('12. Conclusiones'),
    parrafo('Ubica demuestra que un inventario es más útil si responde «¿dónde está?». También aprendimos que no todos quieren dibujar sus salones: por eso el inventario funciona solo y cada lugar elige su nivel de detalle.'),
    parrafo('La decisión técnica más importante fue **separar las reglas de las pantallas**. Gracias a eso se pudo añadir una vista 3D completa sin tocar una sola regla del inventario, y probar con node lo que de otro modo solo se vería a ojo.'),
    parrafo('Lo más delicado no fue programar funciones, sino **cambiar la forma de los datos sin perder los que ya existían**. Guiar a la IA exigió pedir diagnóstico y plan, tomar decisiones, y exigir pruebas reales distinguiendo siempre lo probado de lo supuesto.')
  );

  return documento('Documentación técnica', hijos);
}

// =========================================================================
// BITÁCORA DE DESARROLLO (lee docs/prompts.md)
// =========================================================================

// Objetivo de cada prompt, escrito por nosotros (el .md guarda el prompt literal y la respuesta)
const OBJETIVOS = {
  1: 'Elegir qué app hacer para el reto y ver si se puede reutilizar una app nuestra.',
  2: 'Quitar la restricción de 3 horas para pensar en una app más completa.',
  3: 'Pedir un inventario distinto: crear los espacios en un modelo 3D sencillo, tipo Los Sims.',
  4: 'Elegir la opción A (isométrica 2.5D) y dejar la B (3D real) como plan de respaldo.',
  5: 'Obtener un prompt bien hecho para continuar en otro chat y empezar la bitácora de prompts.',
  6: 'Prompt completo para construir la app: material existente, mejoras, decisiones y forma de trabajar.',
  7: 'Empezar la app con el prompt 6 y pedir una carpeta de entregables como la de CiberEscudo.',
  8: 'Contestar las preguntas de la IA: nombre, tipos, préstamos, escuela y base de datos.',
  9: 'Pedir que cada avance se compile en GitHub y se publique en Vercel.',
  10: 'Obtener un resumen de todo el contexto para que otra IA proponga un prompt de mejoras.',
  11: 'Pedir una auditoría profunda del proyecto y un plan de evolución, sin modificar archivos.',
  12: 'Ampliar el objetivo: evolución visual del 2.5D, modo 3D real y más funciones; solo análisis.',
  13: 'Aprobar la hoja de ruta, pedir diseño para móvil, escritorio y pantalla grande, y empezar la Etapa 0.',
  14: 'Pedir que Ubica funcione en tres modos (lista, 2.5D y 3D) sobre los mismos datos; solo análisis.',
  15: 'Definir la filosofía de tres niveles de uso, aceptar lugares y ubicación única, y pedir el plan de migración de la 1A.',
  16: 'Aclarar que los entregables finales son cuatro y se actualizan por avances.',
  17: 'Indicar dónde están los ejemplos de entregables (CiberEscudo).',
  18: 'Aprobar la Etapa 1A con condiciones: borrados seguros, plano opcional, revisar datos antes de migrar y pruebas del plano.',
  19: 'Misión final: construir y terminar Ubica completa (inventario, 2.5D, 3D, interfaz nueva, pruebas y los cuatro entregables).',
  20: 'Diferenciar el 3D (objetos dentro de los muebles, animaciones), inventario por ubicación, simplificaciones y base de datos en crudo.',
  21: 'Organizar con menos pasos: alta limitada al lugar, mueble nuevo en el alta, acomodo automático, mover varios y encaje de objetos 3D.',
  22: 'Que los objetos 3D se vean siempre y que el mueble no se transparente al seleccionarlo.'
};

function leerPrompts() {
  const lineas = fs.readFileSync(path.join(APP, 'docs', 'prompts.md'), 'utf8').split('\n');
  const entradas = [];
  let fecha = '';
  let actual = null;
  let bloque = null; // 'codigo' (prompt) o 'respuesta' (~~~~)
  let campo = null;  // campo de varias líneas que se está leyendo
  lineas.forEach((linea) => {
    if (bloque === 'codigo') {
      if (linea.startsWith('```')) bloque = null;
      else actual.prompt.push(linea);
      return;
    }
    if (bloque === 'respuesta') {
      if (linea.startsWith('~~~~')) bloque = null;
      else actual.respuestaCompleta.push(linea);
      return;
    }
    const sesion = /^## Sesión \d+ · ([^·]+)/.exec(linea);
    if (sesion) {
      fecha = sesion[1].trim();
      actual = null;
      return;
    }
    const encabezado = /^### Prompt (\d+)/.exec(linea);
    if (encabezado) {
      actual = { numero: Number(encabezado[1]), fecha: fecha, prompt: [], respuesta: '', respuestaCompleta: [],
        adjuntos: '', modelo: '', etapa: '', tipoRespuesta: 'resumen', cambios: '', problemas: '', textoPerdido: '' };
      entradas.push(actual);
      campo = null;
      return;
    }
    if (!actual) return;
    if (/^## /.test(linea)) {
      actual = null;
      return;
    }
    if (linea.startsWith('```')) {
      bloque = 'codigo';
      return;
    }
    if (linea.startsWith('~~~~')) {
      bloque = 'respuesta';
      return;
    }
    const meta = /^\*\*Modelo:\*\* (.*?) · \*\*Etapa:\*\* (.*?) · \*\*Respuesta:\*\* (.*)$/.exec(linea);
    if (meta) {
      actual.modelo = meta[1];
      actual.etapa = meta[2];
      actual.tipoRespuesta = meta[3];
      return;
    }
    if (linea.startsWith('>')) actual.prompt.push(linea.replace(/^> ?/, ''));
    else if (/^Adjunt/.test(linea)) actual.adjuntos = linea.trim();
    else if (/^Enviado /.test(linea)) actual.nota = linea.trim();
    else if (/^\*Texto no conservado/.test(linea)) actual.textoPerdido = linea.replace(/^\*[^*]*\*\s*/, '').trim();
    else if (/^\*\*Qué hizo la IA/.test(linea)) {
      actual.respuesta = linea.replace(/^\*\*Qué hizo la IA[^*]*:\*\*\s*/, '');
      campo = 'respuesta';
    } else if (/^\*\*Cambios y resultados:\*\*/.test(linea)) {
      actual.cambios = linea.replace(/^\*\*[^*]*\*\*\s*/, '');
      campo = 'cambios';
    } else if (/^\*\*Problemas y soluciones:\*\*/.test(linea)) {
      actual.problemas = linea.replace(/^\*\*[^*]*\*\*\s*/, '');
      campo = 'problemas';
    } else if (/^\*\*Respuesta completa:\*\*/.test(linea)) campo = null;
    else if (campo && /^- /.test(linea)) actual[campo] += '\n' + linea;
    else if (!linea.trim()) campo = campo === 'problemas' || campo === 'cambios' ? campo : null;
  });
  // Si un prompt no tiene respuesta propia es porque se contestó junto con el siguiente
  entradas.forEach((entrada, i) => {
    if (!entrada.respuesta && !entrada.respuestaCompleta.length && entradas[i + 1]) {
      entrada.respuesta = 'Se respondió junto con la entrada ' + entradas[i + 1].numero + '.';
    }
  });
  return entradas;
}

// Texto de varias líneas (con viñetas "- ") convertido en párrafos chicos para una celda
function parrafosChicos(contenido, opciones) {
  const ajustes = opciones || {};
  return String(contenido || '—').split('\n').map((linea) => {
    const vinetaMd = /^\s*- /.test(linea);
    const limpia = linea.replace(/^\s*- /, '• ');
    return new Paragraph({ spacing: { after: 20, line: 240 }, indent: vinetaMd ? { left: 200 } : undefined,
      children: conNegritas(limpia || ' ', Object.assign({ size: 18 }, ajustes)) });
  });
}

// Respeta **negritas** y `código` del markdown dentro de una línea
function conNegritas(linea, opciones) {
  return linea.split(/(\*\*[^*]+\*\*|`[^`]+`)/).filter(Boolean).map((trozo) => {
    if (trozo.startsWith('**')) return texto(trozo.slice(2, -2), Object.assign({}, opciones, { bold: true }));
    if (trozo.startsWith('`')) return texto(trozo.slice(1, -1), Object.assign({}, opciones, { font: MONO }));
    return texto(trozo, opciones);
  });
}

function bitacora() {
  const entradas = leerPrompts();
  const completas = entradas.filter((e) => e.respuestaCompleta.length).map((e) => e.numero);
  const hijos = portada('Bitácora de desarrollo', 'Prompts, respuestas, cambios y problemas de cada etapa');
  hijos.push(
    titulo1('Cómo leer y completar esta bitácora'),
    parrafo('Aquí queda registrado cada uso de inteligencia artificial en el proyecto, en orden. Cada entrada tiene:'),
    vineta('**Fecha, modelo y etapa** del proyecto.'),
    vineta('**Prompt enviado:** el texto exacto que escribimos, aunque tenga errores de dedo.'),
    vineta('**Respuesta:** completa cuando se conserva el texto original; si no, un **resumen** escrito en su momento (se indica cuál es cuál).'),
    vineta('**Cambios y resultados** y **Problemas y soluciones** (desde la Etapa 1A).'),
    vineta('**Ajustes manuales** y **¿Cómo verificamos?**: los completa el equipo.'),
    titulo2('Respuestas completas y resúmenes'),
    parrafo('Las respuestas de la sesión 1 (otro chat) y de las entradas 1 a 17 **no se pueden recuperar textuales**: la conversación se compactó y no quedaron transcripciones. **No se reconstruyeron ni se inventaron**; se conserva el resumen escrito en su momento. La entrada 16 tampoco conserva el prompt completo (el mensaje se envió interrumpido): se registra su contenido en resumen y así se indica.', { spacing: { after: 80 } }),
    parrafo('Entradas con **respuesta completa:** ' + (completas.length ? completas.join(', ') : 'ninguna todavía') + '.', { spacing: { after: 120 } }),
    titulo2('Herramienta utilizada'),
    tabla([2600, 6760], [
      ['Dato', 'Valor'],
      ['Herramienta', 'Claude, de Anthropic (app de Claude, proyecto «Apps»)'],
      ['Modelos', 'Sesión 1: no quedó registrado. Entradas 7 a 10: Claude Opus 5.5. Entradas 11 a 13: Claude Fable 5.2. Desde la 14: Claude Opus 5.5.'],
      ['Plan', ''],
      ['Uso principal', 'Elegir la idea, hacer el prototipo, planear por etapas, programar, probar y redactar los entregables']
    ], { encabezado: true }),
    saltoDePagina(),
    titulo1('Registro de prompts')
  );

  entradas.forEach((entrada) => {
    const prompt = entrada.prompt.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    const parrafosPrompt = prompt
      ? prompt.split('\n').map((linea) => new Paragraph({ spacing: { after: 20, line: 240 },
        children: [texto(linea || ' ', { size: 18, font: entrada.numero === 6 ? MONO : LETRA })] }))
      : [new Paragraph({ children: [texto('Texto no conservado completo (ver nota).', { italics: true, size: 18, color: COLOR.suave })] })];
    if (entrada.textoPerdido) {
      parrafosPrompt.push(new Paragraph({ spacing: { before: 60 },
        children: conNegritas('Resumen del contenido (no es el texto original): ' + entrada.textoPerdido, { size: 18, italics: true }) }));
    }
    if (entrada.nota) parrafosPrompt.unshift(new Paragraph({ spacing: { after: 80 }, children: [texto(entrada.nota, { italics: true, size: 18, color: COLOR.suave })] }));
    if (entrada.adjuntos) {
      parrafosPrompt.push(new Paragraph({ spacing: { before: 80 }, children: [texto(entrada.adjuntos, { italics: true, size: 18, color: COLOR.suave })] }));
    }
    const completa = entrada.respuestaCompleta.length > 0;
    const respuesta = completa
      ? parrafosChicos(entrada.respuestaCompleta.join('\n').replace(/\n{3,}/g, '\n\n').trim())
      : parrafosChicos(entrada.respuesta);
    const filas = [
      ['Entrada', String(entrada.numero)],
      ['Fecha', entrada.fecha],
      ['Herramienta y modelo', 'Claude (Anthropic) · modelo: ' + (entrada.modelo || '____________')],
      ['Etapa', entrada.etapa || '—'],
      ['Objetivo del prompt', OBJETIVOS[entrada.numero] || ''],
      ['Prompt enviado', parrafosPrompt],
      [completa ? 'Respuesta (completa)' : 'Respuesta (resumen; el texto completo no se conserva)', respuesta]
    ];
    if (entrada.cambios) filas.push(['Cambios y resultados', parrafosChicos(entrada.cambios)]);
    if (entrada.problemas) filas.push(['Problemas y soluciones', parrafosChicos(entrada.problemas)]);
    filas.push(['Ajustes manuales del equipo', '\n\n'], ['¿Cómo verificamos que funcionaba?', '\n\n']);
    hijos.push(tabla([2400, 6960], filas, { primeraColumna: true }), espacio());
  });

  hijos.push(
    saltoDePagina(),
    titulo1('Reflexión sobre el uso de IA'),
    parrafo('Contesten en equipo, con sus palabras:'),
    titulo3('1. ¿Qué aprendimos del tema (inventarios, bases de datos, geometría) y de programación gracias a la IA?'),
    espacio(), espacio(),
    titulo3('2. ¿Qué hizo bien la IA y en qué se equivocó o se quedó corta?'),
    parrafo('Pista: varios errores (el «clic fantasma», los duplicados por doble toque, el historial que no mostraba préstamos) los encontraron las pruebas, no la vista.', { spacing: { after: 60 } }),
    espacio(),
    titulo3('3. ¿Qué decisiones tomamos nosotros y no la IA?'),
    parrafo('Pista: la idea tipo Los Sims, el nombre, los tres niveles de uso, que nunca se borren artículos en silencio y avanzar por etapas aprobadas.', { spacing: { after: 60 } }),
    espacio(),
    titulo3('4. ¿Cómo comprobamos que lo que generó era correcto y seguro?'),
    espacio(), espacio(),
    titulo3('5. ¿Fue un uso ético? ¿Qué parte del trabajo es realmente nuestra?'),
    espacio(), espacio()
  );
  return documento('Bitácora de desarrollo', hijos);
}

// =========================================================================
// GUION DE EXPOSICIÓN (con el pitch)
// =========================================================================
const PALABRAS_POR_MINUTO = 130; // ritmo pausado y claro
const contarPalabras = (frase) => frase.split(/\s+/).filter((p) => /[\p{L}\p{N}]/u.test(p)).length;

function guionExposicion() {
  const diapositivas = JSON.parse(fs.readFileSync(path.join(AQUI, 'notas_presentacion.json'), 'utf8'));
  const cuenta = { 1: 0, 2: 0 };
  diapositivas.forEach((d) => d.partes.forEach((p) => { cuenta[p.quien] += contarPalabras(p.dice); }));
  const total = cuenta[1] + cuenta[2];
  const segundosHabla = Math.round(total / PALABRAS_POR_MINUTO * 60);
  const segundosExtra = 20; // cambios de diapositiva y la demostración
  const mmss = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  console.log('Guion: ' + total + ' palabras (E1 ' + cuenta[1] + ', E2 ' + cuenta[2] + '), ' + mmss(segundosHabla + segundosExtra));

  const hijos = portada('Guion de exposición', 'Dos expositores · ' + diapositivas.length + ' diapositivas · menos de 4 minutos, con el pitch integrado');
  hijos.push(
    titulo1('Cómo usar este guion'),
    vineta('Sigue exactamente el orden de `PRESENTACION.pdf` (' + diapositivas.length + ' diapositivas).'),
    vineta('Lo que está entre comillas se **dice**. Lo que está [entre corchetes] es una indicación: **no se lee**.'),
    vineta('El **pitch** no va aparte: es la apertura (diapositivas 1 y 2) y el cierre (diapositiva 8).'),
    vineta('Antes de empezar: abran https://app9-ubica.vercel.app con el ejemplo cargado (primera pantalla → «Ver un ejemplo») para la demostración de la diapositiva 6.'),
    vineta('Ensáyenlo dos veces con cronómetro. Si se pasan, hablen igual de despacio y acorten la demostración.'),
    titulo1('Guion')
  );
  let acumulado = 0;
  diapositivas.forEach((d, i) => {
    const palabras = d.partes.reduce((s, p) => s + contarPalabras(p.dice), 0);
    const segundos = Math.round(palabras / PALABRAS_POR_MINUTO * 60);
    acumulado += segundos;
    hijos.push(titulo2('Diapositiva ' + (i + 1) + ' · ' + d.titulo + '  (≈ ' + segundos + ' s)'));
    d.partes.forEach((p) => {
      hijos.push(new Paragraph({ spacing: { after: 120, line: 300 }, keepLines: true, children: [
        texto('Expositor ' + p.quien + ': ', { bold: true, color: p.quien === 1 ? COLOR.acento : '2E7D5B' }),
        ...(p.hace ? [texto('[' + p.hace + '] ', { italics: true, color: COLOR.suave, size: 19 })] : []),
        texto('«' + p.dice + '»', { size: 22 })
      ] }));
    });
    const filas = [['Qué señalar', d.senalar], ['Enlace', d.enlace]];
    if (d.demo) filas.splice(1, 0, ['Qué demostrar', d.demo]);
    hijos.push(tabla([2000, 7360], filas, { primeraColumna: true }), espacio());
  });
  hijos.push(
    titulo1('Tiempo y palabras'),
    tabla([4680, 2340, 2340], [
      ['', 'Palabras habladas', 'Tiempo aproximado'],
      ['Expositor 1', String(cuenta[1]), mmss(Math.round(cuenta[1] / PALABRAS_POR_MINUTO * 60))],
      ['Expositor 2', String(cuenta[2]), mmss(Math.round(cuenta[2] / PALABRAS_POR_MINUTO * 60))],
      ['Cambios de diapositiva y demostración', '—', mmss(segundosExtra)],
      ['**Total**', '**' + total + '**', '**' + mmss(segundosHabla + segundosExtra) + '**']
    ], { encabezado: true }),
    parrafo('Calculado a ' + PALABRAS_POR_MINUTO + ' palabras por minuto (ritmo pausado). El límite es de 4:00. Es una estimación: el tiempo real se mide ensayando.', { spacing: { before: 120, after: 120 } }),
    saltoDePagina(),
    titulo1('Términos que deben entender'),
    tabla([2400, 6960], [
      ['Término', 'Explicación sencilla'],
      ['Aplicación web', 'Una página que se comporta como app. La misma sirve en el celular y en la computadora.'],
      ['IndexedDB', 'Una base de datos que ya trae el navegador. Guarda la información dentro del dispositivo, sin servidor.'],
      ['2.5D (isométrico)', 'Un dibujo plano que parece tener profundidad, como los videojuegos de construcción. No se puede girar libremente.'],
      ['3D', 'Un modelo con profundidad real: la cámara se mueve alrededor.'],
      ['Three.js', 'Una librería (código ya hecho por otros, de uso libre) que dibuja 3D en el navegador. Es la única que usa Ubica.'],
      ['Separar reglas y pantallas', 'Las reglas («no prestes más de lo que hay») están en un solo archivo. Las pantallas solo muestran y piden. Así ninguna vista puede contradecir a otra.'],
      ['Prueba automática', 'Un programa que usa la app solo (toca, escribe, arrastra) y revisa que el resultado sea el correcto.'],
      ['Migración', 'Convertir los datos de una versión anterior a la nueva sin perder nada.'],
      ['Capacitor / APK', 'Capacitor envuelve la app web para instalarla en Android; el APK es el archivo que se instala.']
    ], { encabezado: true }),
    titulo1('Posibles preguntas y respuestas sugeridas'),
    tabla([3400, 5960], [
      ['Pregunta', 'Respuesta'],
      ['¿Dónde se guardan los datos?', 'En el propio dispositivo, con IndexedDB. No hay servidor ni cuentas. Para pasarlos a otro equipo se usa el respaldo en archivo.'],
      ['¿Qué pasa si se borra la app?', 'Se pierde el inventario si no hay respaldo. Por eso la app hace copias automáticas, recuerda guardar un respaldo y permite restaurarlo.'],
      ['¿Por qué no usaron MySQL?', 'Porque necesitaría un servidor e internet. Queríamos que funcionara sin conexión dentro de la escuela.'],
      ['¿El 3D es de verdad?', 'Sí: usa Three.js, con cámara libre, luz y sombras. Los muebles se construyen por código con las medidas reales de cada uno.'],
      ['¿Cómo saben que 2.5D y 3D no se contradicen?', 'Porque ninguna vista guarda datos propios: las dos leen la misma tabla de muebles y piden los cambios a las mismas reglas. Además hay pruebas automáticas que mueven un mueble en una vista y lo comprueban en la otra.'],
      ['¿Qué hizo la IA y qué hicieron ustedes?', 'La IA propuso, programó y probó. Nosotros decidimos qué construir, aprobamos cada etapa, pedimos pruebas y corregimos el rumbo. Todo está en la bitácora.'],
      ['¿La probaron en celulares?', 'Las pruebas automáticas se hicieron en computadora simulando un celular. La prueba en dispositivos reales es el siguiente paso; lo decimos con honestidad.'],
      ['¿Qué le falta?', 'Seguir cada pieza por separado (hoy solo se anotan números de serie), usuarios y sincronización entre dispositivos.'],
      ['¿Es segura?', 'No envía datos a ningún lado, valida todo lo que se escribe y los respaldos que se importan, y el código no contiene contraseñas.']
    ], { encabezado: true })
  );
  return documento('Guion de exposición', hijos);
}

async function guardar(doc, nombre) {
  const destino = path.join(ENTREGABLES, nombre);
  fs.writeFileSync(destino, await Packer.toBuffer(doc));
  console.log('Creado:', nombre);
}

(async () => {
  await guardar(documentacionTecnica(), 'DOCUMENTACION_TECNICA.docx');
  await guardar(bitacora(), 'BITACORA_DESARROLLO.docx');
  await guardar(guionExposicion(), 'GUION_EXPOSICION.docx');
})();
