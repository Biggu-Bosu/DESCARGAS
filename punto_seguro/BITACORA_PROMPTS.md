# Bitácora de Prompts (Registro de IA) · Punto Seguro

Registro de la interacción del equipo con herramientas de inteligencia artificial durante el desarrollo de **Punto Seguro**, una aplicación web para contribuir a prevenir el bullying escolar.

| Dato | Valor |
|---|---|
| Proyecto | Punto Seguro (HTML + CSS + JavaScript) |
| Herramienta | Claude (app de Anthropic) con herramientas para escribir código, probarlo en un navegador y subirlo a GitHub |
| Modelo utilizado | Claude Opus 5.5 (identificador `claude-opus-5-5`) |
| Repositorio actual | `Biggu-Bosu/DESCARGAS`, carpeta `punto_seguro/` |
| Repositorio anterior | `Biggu-Bosu/APPS`, carpeta `paginas/pagina3-punto_seguro/` (primera versión) |

> **Cómo usar esta bitácora.** Cada entrada tiene cinco partes: prompt enviado, modelo, respuesta/código generado, ajustes manuales del equipo y reflexión. Las secciones marcadas con ✏️ deben completarlas ustedes con sus propias palabras: la IA no puede saber qué cambiaron a mano ni qué aprendieron.

---

## Resumen de entradas

| # | Fecha | Qué se pidió | Resultado |
|---|---|---|---|
| 1 | 20 oct 2026 | Diseñar y programar la primera versión completa (4 módulos) y subirla a GitHub | Versión 1 en el repositorio APPS |
| 2 | 21 oct 2026 | Correcciones en otra conversación (termómetro, formulario, cuestionario) | Versión 1.1 en el repositorio DESCARGAS |
| 3 | 23 oct 2026 | Bitácora + rediseño de varias partes para la exposición | Versión 2 en el repositorio DESCARGAS |

---

## Entrada 1 · Primera versión de la aplicación

**Fecha:** 20 de octubre de 2026
**Modelo:** Claude Opus 5.5
**Tipo de prompt:** prompt largo y estructurado (rol, objetivo, módulos, restricciones, formato de entrega), seguido del comando `/subir-a-github`.

### Prompt enviado (texto completo)

```text
Actúa como desarrollador web full-stack, diseñador UI/UX y asesor de proyectos escolares. Vas a diseñar y desarrollar una aplicación web funcional llamada provisionalmente **Punto Seguro**, orientada a la prevención del bullying y a facilitar que estudiantes de secundaria o preparatoria encuentren ayuda dentro de su escuela.

Antes de responder, lee completo este mensaje. Trabaja por etapas y respeta todas las restricciones.

═══════════════════════════════════════════
1. OBJETIVO
═══════════════════════════════════════════

Construir una primera versión funcional (realizable, probable y presentable en menos de una semana) con cuatro módulos sencillos:

A) "Necesito ayuda" — orientación según la situación del estudiante.
B) "Aprende a reconocerlo" — cuestionario educativo.
C) "Termómetro de convivencia" — encuesta breve con resultados locales.
D) "¿Cómo puedo ayudar?" — guía interactiva de acción.

La aplicación debe ser práctica, intuitiva y visualmente atractiva para adolescentes. No es un sistema empresarial.

═══════════════════════════════════════════
2. MÓDULOS
═══════════════════════════════════════════

### Módulo A — Necesito ayuda
- Cuatro opciones de entrada:
  · Estoy sufriendo bullying.
  · He presenciado una situación de bullying.
  · Tengo un problema con otro estudiante y no sé cómo resolverlo.
  · Quiero hablar con alguien sobre una situación escolar.
- Cada opción muestra orientación breve y acciones concretas (acudir a docente, orientador/a, adulto de confianza).
- Incluye un **formulario de demostración** con campos mínimos (tipo de situación, descripción breve, ¿hay peligro inmediato? sí/no) SIN pedir nombre completo, teléfono, contraseñas ni datos personales innecesarios.
- El formulario **no finge enviar un reporte real**. Debe mostrar un mensaje explícito: "Esta es una demostración local. No se envía nada a tu escuela. Para pedir ayuda real, acude con {{nombre del orientador/a}} o llama a {{teléfono de dirección}}."
- **No guardes el contenido del formulario en localStorage ni en ningún almacenamiento persistente.**

### Módulo B — Aprende a reconocerlo
- Cuestionario interactivo de 5 a 8 preguntas basadas en situaciones ficticias (exclusión repetida, burlas constantes, rumores, agresiones físicas, conflicto aislado, acoso digital).
- Cada pregunta: varias opciones + explicación breve de por qué una respuesta es más adecuada (considerando repetición, intención de dañar, desequilibrio de poder, sin convertirlo en diagnóstico).
- Al final: resultado, recomendación educativa y botón para reiniciar.
- **No uses localStorage en este módulo**; el progreso vive solo en memoria.

### Módulo C — Termómetro de convivencia
- Encuesta de ~5 preguntas (¿te sientes respetado/a?, ¿has presenciado burlas constantes?, ¿sabes a quién acudir?, ¿puedes pedir ayuda con confianza?, y una más que consideres útil).
- Al terminar: **gráfica de barras por pregunta** construida con **HTML/CSS puro** (sin librerías externas, sin CDN, sin Chart.js). Una barra por pregunta mostrando porcentaje de respuestas positivas, junto con interpretación educativa.
- Usa **localStorage solo para guardar las respuestas agregadas de este navegador** y permitir ver resultados. Indica claramente en pantalla: "Los resultados son locales, no representan a toda la escuela y no se envían a nadie."
- No generes gráficas que aparenten datos reales si solo existen los de la sesión actual: muestra siempre cuántas respuestas locales respaldan la gráfica.

### Módulo D — ¿Cómo puedo ayudar?
- Selección entre:
  · Me está pasando a mí.
  · Le está pasando a otra persona.
  · Lo he visto, pero no sé cómo intervenir.
  · Me he dado cuenta de que mis acciones están lastimando a alguien.
- Recomendaciones cortas y realistas priorizando acciones seguras: buscar apoyo adulto, escuchar sin juzgar, no difundir contenido humillante, acompañar a la persona afectada, evitar enfrentamientos.
- Incluye un aviso visible: "Esta aplicación no sustituye la ayuda de personas capacitadas ni los protocolos de tu escuela."

═══════════════════════════════════════════
3. BLOQUE FIJO DE AYUDA URGENTE (OBLIGATORIO)
═══════════════════════════════════════════

Incluye un bloque destacado en el **footer de todas las vistas** y dentro del **Módulo D**:

"Si hay peligro inmediato, contacta a un adulto de confianza o llama al número de emergencias de tu país (911 en México)."

Debe ser legible, con contraste alto, y no ocultable.

═══════════════════════════════════════════
4. DISEÑO Y EXPERIENCIA
═══════════════════════════════════════════

- Paleta: azul, blanco y neutros.
- Tarjetas con iconos para los cuatro módulos.
- Menú de navegación simple y consistente.
- Botones visibles y claros.
- Tipografía legible, buen espaciado.
- Diseño adaptable (móvil, tableta, escritorio).
- **Lenguaje inclusivo y neutral al género** en todo el texto visible (ej. "quien estudia", "el estudiante o la estudiante", o formas neutras).
- Contenido totalmente en **español**.
- Evita interfaces recargadas, animaciones innecesarias, exceso de colores.
- La pantalla de inicio debe incluir nombre, frase breve de propósito, acceso a los 4 módulos y sección visible de ayuda real (con marcadores {{...}}).

═══════════════════════════════════════════
5. ACCESIBILIDAD VERIFICABLE
═══════════════════════════════════════════

- `aria-label` en botones que solo muestran icono.
- `role="radiogroup"`, `aria-checked` y navegación por teclado en el cuestionario.
- Foco visible en todos los elementos interactivos.
- Etiquetas `<label for>` en todos los campos del formulario.
- Mensajes de error comprensibles asociados a sus campos (`aria-describedby`).
- Contraste mínimo AA (4.5:1 texto normal, 3:1 texto grande).
- Toda la app navegable solo con Tab + Enter.

═══════════════════════════════════════════
6. TECNOLOGÍAS Y RESTRICCIONES
═══════════════════════════════════════════

Usa **HTML5 + CSS3 + JavaScript vanilla**. **NO uses Flask** salvo justificación técnica explícita (no la hay aquí).

Prohibido:
- Bases de datos externas.
- APIs de pago, CDNs, librerías externas (incluido Chart.js, jQuery, Bootstrap, Google Fonts).
- Cuentas, login, recolección de datos personales innecesarios.
- Fingir envíos de reportes, correos o notificaciones.
- Guardar datos sensibles en localStorage.
- Funciones complejas no esenciales.

Requerido:
- Funciona 100% local abriendo `index.html` en el navegador.
- Los cuatro módulos funcionan sin conexión a internet.

═══════════════════════════════════════════
7. ESTRUCTURA DEL PROYECTO
═══════════════════════════════════════════

PuntoSeguro/
├── index.html
├── styles.css
├── script.js
└── README.md

Mantén la estructura lo más simple posible. Comentarios del código **en español**; nombres de variables y funciones en `camelCase` (elige español o inglés, sé consistente y avísalo).

═══════════════════════════════════════════
8. REQUISITOS DE FUNCIONAMIENTO
═══════════════════════════════════════════

- Navegación entre los cuatro módulos funciona.
- Cuestionario calcula el resultado correctamente.
- Guía interactiva cambia según la selección.
- Encuesta permite responder y visualizar resultados coherentes.
- Formulario de demostración valida campos y aclara sus limitaciones.
- No se guardan datos sensibles en el navegador.
- Todos los botones hacen algo útil.
- Interfaz adaptable a pantallas pequeñas.
- Mensajes claros para estudiantes.
- Los errores no dejan la app en estado inutilizable.

═══════════════════════════════════════════
9. FORMA DE ENTREGA (DOS MENSAJES)
═══════════════════════════════════════════

### PRIMER MENSAJE — Etapas 1 a 3:
1. **Planificación**: arquitectura elegida, función de cada módulo, decisiones técnicas (sin preguntarme detalles menores).
2. **Desarrollo**: código completo de `index.html`, `styles.css`, `script.js` y `README.md`, cada uno con su nombre bien identificado. Sin pseudocódigo, sin TODOs, sin botones sin implementar.
3. **Ejecución**: cómo crear la carpeta, guardar los archivos y abrir la app en la computadora.

Si el código completo excede el límite del mensaje, entrega primero `index.html` + `styles.css` y luego `script.js` + `README.md`, sin omitir nada.

### SEGUNDO MENSAJE — Etapas 4 y 5 (lo pediré yo después con la palabra "continúa"):
4. **Pruebas**: lista de pruebas manuales por módulo + corrección de cualquier problema detectado.
5. **Presentación escolar**: problema, objetivo general, objetivos específicos, justificación, tecnologías, alcance, limitaciones, y guion sugerido para la demo.

Al final del primer mensaje, incluye una **tabla de auto-chequeo** contra la sección 8 (requisitos de funcionamiento) indicando qué cumple y qué queda pendiente de prueba manual.

═══════════════════════════════════════════
10. CRITERIO DE ÉXITO Y ÉTICA
═══════════════════════════════════════════

- El proyecto se ejecuta localmente, recorre los cuatro módulos y sus interacciones funcionan.
- No afirmes que la app elimina o reduce el bullying; solo que puede contribuir a prevenirlo y orientar. La evaluación real queda fuera del alcance.
- No diagnostiques bullying: el cuestionario es educativo, no clínico.

═══════════════════════════════════════════
11. INSTRUCCIÓN FINAL
═══════════════════════════════════════════

Comienza directamente con la **Etapa 1 (Planificación)** y luego continúa con las Etapas 2 y 3 en el mismo mensaje. No me hagas preguntas de detalles menores: decide con criterio y explicita las decisiones. Entrega código real, completo y funcional.
```

Después se envió el comando:

```text
/subir-a-github
```

### Respuesta / código generado

- **Planificación:** una sola página (`index.html`) con 5 vistas que cambian con el `#` de la dirección; un componente reutilizable de opciones accesibles (`crearGrupoOpciones`) para el cuestionario, la encuesta y el formulario.
- **Código:** `index.html`, `styles.css`, `script.js` y `README.md` completos, sin librerías externas.
  - Módulo A: 4 orientaciones + formulario de demostración que valida campos y no guarda nada.
  - Módulo B: cuestionario de 7 situaciones con explicación y resultado.
  - Módulo C: encuesta de 5 preguntas con gráfica de barras en HTML/CSS y `localStorage` solo para conteos.
  - Módulo D: guía de 4 casos y bloque de ayuda urgente.
- **Pruebas automáticas de la IA:** se abrió la app en un navegador Chromium con tamaño de celular (390 px) y de escritorio, y se probaron todos los botones. Se encontraron y corrigieron 2 fallas: el contador de caracteres no se reiniciaba al enviar, y los datos dañados del termómetro mostraban un aviso equivocado.
- **Entrega:** se subió a `Biggu-Bosu/APPS` en `paginas/pagina3-punto_seguro/` (commit `8563b1e`).

### ✏️ Ajustes manuales realizados por el equipo

_(Completen: ¿qué revisaron o cambiaron ustedes a mano? Ejemplo: “Revisamos los textos del cuestionario y cambiamos dos nombres”.)_

-

### ✏️ Reflexión de uso

_(Completen con sus palabras. Preguntas guía: ¿qué tan útil fue escribir un prompt tan detallado? ¿Qué decidió la IA que ustedes no habían pensado? ¿Qué no les convenció?)_

-

---

## Entrada 2 · Correcciones de la versión 1.1

**Fecha:** 21 de octubre de 2026
**Modelo:** Claude (en otra conversación; confirmen el modelo que aparecía en esa conversación)

### Prompt enviado

_(Este prompt se escribió en otra conversación y no quedó registrado aquí. ✏️ Cópienlo de esa conversación.)_

```text

```

### Respuesta / código generado

Según el historial de GitHub, el resultado fue el commit `703c8a8` en `Biggu-Bosu/DESCARGAS` con el mensaje *“punto_seguro: corrige termometro y formulario, y amplia el cuestionario”*. Los cambios principales que se ven en el código:

- El cuestionario pasó a un banco de 16 situaciones con las mismas 3 respuestas para todas (“Es bullying”, “No es bullying, pero hay que atenderlo”, “Es parte normal de la convivencia”), con rondas de 10 al azar.
- La pregunta 2 del termómetro se reescribió para que “Sí” siempre fuera la respuesta positiva, y se cambió el cálculo a puntos (Sí = 100, A veces = 50, No = 0).
- Los marcadores `{{...}}` de los datos de la escuela se cambiaron por textos genéricos.

### ✏️ Ajustes manuales realizados por el equipo

-

### ✏️ Reflexión de uso

-

---

## Entrada 3 · Bitácora y rediseño para la exposición

**Fecha:** 23 de octubre de 2026
**Modelo:** Claude Opus 5.5

### Prompt enviado (texto completo, tal como se escribió)

```text
debes guardar todos los promts incluyendo el anterior(Bitácora de Prompts (Registro de IA):
o Documento (PDF o Markdown) estructurado donde se registre la interacción 
con las herramientas de IA.
o Debe incluir: Prompt enviado, modelo utilizado, respuesta/código generado, 
ajustes manuales realizados por el equipo y reflexión de uso) ademas corrige cosas de la pagina, primero lo de encuentra ayuda en tu escuela podria ser demasiado complicado hacer la base de datos que incluya todo los numeros nombres y direcciones, luego lo de formulario de practica eso donde dice que no se envio nada a la escuela pues necesitamops resolverlo de manera que se sienta confiable pero no tiene porque ser real de todas formas es una exposicion de demostracion entonces solo tiene que verse presentable, luego en lo de apredne a reconocerlo tiene que haber mas preguntas o mas variadas, algo creativo que realmente haga pensar al usuario para poder reconocer al bulling, luego el cuestionario de la parte de termometro, tiene problemas la logica detras de sacar todas correctas no esta bien, ademas se acumula de manera rara si respondes una y otra vez , de 4 de 5 bien luego pasaba a 5 de 6, arregla esas cosas y que si hay ventanas emergentes sean con el diseño de la aplicaicon, tambien lo de llama a 911 quitalo y pon un pequeño tutorial de como llamar a 911, analiza la app y arregla todo este tipo de cosas para que se ves presentable pero pues al final no es completamente funcional la aplicacion solo tiene que ser lo suficientemente bien para que convenza a alquien, tambien, ya no la subiras a el repositorio apps si no lo subiras al repositorio descargas
```

### Respuesta / código generado

La IA partió de la versión 1.1 que ya estaba en DESCARGAS (no de la versión 1), para no perder los cambios de la entrada 2. Cambios por cada punto del prompt:

| Lo que se pidió | Qué se hizo |
|---|---|
| “Encuentra ayuda en tu escuela” necesitaría una base de datos de nombres y teléfonos | Se quitó por completo. Ahora hay una sección **“¿A quién puedes acudir?”** con 4 tarjetas por *rol* (orientación, docente o tutor/a, dirección o prefectura, familia) y una frase para empezar la conversación. Funciona en cualquier escuela sin datos. |
| El formulario debe sentirse confiable aunque no sea real | Se rediseñó como **“Reporta una situación”**: botón con “Enviando de forma segura…”, pantalla de **Reporte recibido** con folio (por ejemplo `PS-2026-4821`), resumen y “¿Qué sigue?” en 3 pasos. Se agregaron campos opcionales (lugar, frecuencia y si se prefiere anónimo). Se dejó una insignia pequeña “Versión de demostración” y una nota al final, para que nadie crea que su reporte llegó a la escuela. La descripción sigue sin guardarse. |
| “Aprende a reconocerlo” necesita preguntas más variadas y creativas | El banco subió a **29 retos de 5 tipos**: *Clasifica la situación*, *Encuentra la clave que falta* (repetición, intención o poder), *Lee el chat* (conversaciones simuladas con burbujas), *Detecta la diferencia* (situación A contra B) y *¿Qué harías?*. Cada ronda trae 10 retos al azar y termina con un **perfil** (por ejemplo “Detective de la convivencia”) y los aciertos por tipo de reto. |
| La lógica del termómetro estaba mal y se acumulaba raro (“4 de 5”, luego “5 de 6”) | Se separaron **dos resultados**: (1) **Tu termómetro**, solo con las respuestas de quien acaba de contestar (todo “Sí” = 100 de 100, “Clima de confianza”), y (2) **Resultados del grupo**, que suma a todas las personas que respondieron en el dispositivo y lo dice claramente (“4 personas han respondido”), con barras apiladas Sí / A veces / No. |
| Ventanas emergentes con el diseño de la app | Se quitó `confirm()` del navegador. Ahora las ventanas usan `<dialog>` con el diseño de la app (para confirmar el borrado de resultados y para el tutorial del 911), además de un mensaje flotante breve. |
| Quitar “Llamar al 911” y poner un tutorial | Se quitó el enlace `tel:911`. En el pie hay un botón **“¿Cómo llamar al 911?”** que abre el tutorial de 5 pasos, y en el módulo D el tutorial aparece completo. |
| Analizar la app y mejorar lo demás | Portada con ilustración, sección **“Las 3 claves”** en el inicio, **frases de ejemplo** en el módulo D y textos revisados con lenguaje neutral. |
| Subir a DESCARGAS en lugar de APPS | Se subió a `Biggu-Bosu/DESCARGAS/punto_seguro/`. La copia vieja en APPS no se tocó. |

**Pruebas automáticas de la IA:** se probó en Chromium a 390 px y 1280 px: navegación, envío simulado del formulario, 3 rondas del cuestionario (aparecieron los 5 tipos de reto), 4 respuestas del termómetro (100, 70, 0 y 100, y el grupo marcó “4 personas”), las ventanas (se abren, se cierran con Escape y el foco vuelve a su lugar) y que no quedara nada guardado del formulario. No hubo errores de JavaScript ni ventanas nativas del navegador.

**Fragmento representativo:** así se calcula ahora el termómetro personal.

```js
// Termómetro personal: promedio de puntos (Sí = 100, A veces = 50, No = 0)
// Ejemplo: Sí, Sí, Sí, A veces, No -> (100+100+100+50+0) / 5 = 70
function calcularTemperatura(respuestas) {
  const suma = respuestas.reduce((acumulado, valor) =>
    acumulado + opcionesEncuesta.find((opcion) => opcion.valor === valor).puntos, 0);
  return Math.round(suma / respuestas.length);
}
```

### ✏️ Ajustes manuales realizados por el equipo

-

### ✏️ Reflexión de uso

_Borrador sugerido por la IA. Cámbienlo con sus propias palabras o reemplácenlo:_

- Describir **qué estaba mal desde el punto de vista de quien usa la app** (“se acumula raro”, “no se siente confiable”) funcionó mejor que pedir cambios técnicos: la IA tuvo que encontrar la causa por su cuenta.
- La IA no siempre hace exactamente lo pedido: en el formulario dejó una insignia de demostración porque un reporte falso que parece real podría confundir a alguien que de verdad necesite ayuda. Es una decisión de diseño que vale la pena discutir en la exposición.
- Hay que **revisar lo que entrega la IA**: los retos del cuestionario, por ejemplo, conviene leerlos en equipo para confirmar que las respuestas “correctas” les parecen justas.

---

## Plantilla para nuevas entradas

```markdown
## Entrada N · Título corto

**Fecha:**
**Modelo:**

### Prompt enviado

### Respuesta / código generado

### Ajustes manuales realizados por el equipo

### Reflexión de uso
```
