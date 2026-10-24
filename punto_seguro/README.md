# Punto Seguro

Aplicación web escolar para **contribuir a prevenir el bullying** y orientar a estudiantes de secundaria o preparatoria sobre cómo y con quién pedir ayuda. No elimina el bullying ni diagnostica situaciones: es una herramienta educativa y de orientación, hecha como **prototipo de demostración** para una exposición.

## Módulos

| Módulo | Qué hace | ¿Guarda datos? |
|---|---|---|
| **A · Necesito ayuda** | Orientación según 4 situaciones + formulario breve (tipo, lugar opcional, descripción, ¿hay peligro?) con envío simulado y folio | **No.** No envía ni guarda nada |
| **B · Aprende a reconocerlo** | Rondas de 10 retos de 5 tipos (clasificar, clave que falta, chat, comparar, ¿qué harías?) tomados al azar de un banco de 29 | **No.** Solo en memoria |
| **C · Termómetro de convivencia** | Encuesta de 5 preguntas: resultado personal (termómetro 0–100) y resultados del grupo (barras apiladas hechas con HTML/CSS) | Solo **conteos del grupo** en `localStorage` |
| **D · ¿Cómo puedo ayudar?** | Recomendaciones seguras y frases de ejemplo según 4 casos, más el tutorial desplegable para llamar al 911 | **No** |

En el pie de las vistas hay un bloque fijo de ayuda urgente con un botón que abre el tutorial del 911 en una ventana con el diseño de la app. En el módulo D ese bloque está dentro de la página, así que el pie no lo repite.

La app no necesita configurar nada: no hay datos de la escuela que llenar ni procesos fuera de la página.

## Estructura

```
punto_seguro/
├── index.html            estructura y textos de todas las vistas y ventanas
├── styles.css            diseño (colores, tipografía, adaptación a pantallas)
├── script.js             navegación, módulos, ventanas y validaciones
├── README.md             este archivo
└── BITACORA_PROMPTS.md   registro de uso de IA del proyecto
```

## Cómo abrirla

1. Descarga la carpeta `punto_seguro` completa.
2. Haz doble clic en `index.html` (o clic derecho → Abrir con → tu navegador).
3. Funciona sin internet y sin instalar nada.

## Decisiones técnicas

- **HTML + CSS + JavaScript sin librerías**, sin CDN ni fuentes externas (se usa la fuente del sistema).
- **Una sola página** con cinco vistas; se cambia de vista con el `#` de la dirección (`#ayuda`, `#aprende`, `#termometro`, `#guia`), así funciona el botón Atrás del navegador.
- **Nombres de variables y funciones en español**, en `camelCase` (por ejemplo `mostrarVista`, `crearGrupoOpciones`).
- **Sin datos de una escuela específica**: en lugar de una base de datos con nombres y teléfonos, la app explica a qué *personas* acudir (orientación, docentes, dirección, familia).
- **Ventanas propias**: se usa el elemento `<dialog>` de HTML en lugar de `alert()` o `confirm()`, así las ventanas tienen el diseño de la app, atrapan el foco y se cierran con Escape.
- **Opciones accesibles**: las respuestas usan `role="radiogroup"` y `role="radio"` con `aria-checked`. Cada opción se alcanza con **Tab** y se elige con **Enter** (también con Espacio o con las flechas).
- **Termómetro con dos resultados separados**: el personal (solo quien acaba de responder) y el del grupo (todas las respuestas del dispositivo). Antes se mezclaban y confundía.
- **Errores controlados**: cada módulo arranca por separado; si `localStorage` está bloqueado o tiene datos dañados, el Termómetro sigue funcionando.

## Limitaciones

- Es un prototipo: el reporte no llega a ninguna escuela (se indica con una insignia discreta “Versión de demostración”).
- Los resultados del grupo son de un solo dispositivo y no representan a toda la escuela.
- No sustituye la ayuda de personas capacitadas ni los protocolos de la escuela.
