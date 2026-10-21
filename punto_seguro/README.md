# Punto Seguro

Aplicación web escolar para **contribuir a prevenir el bullying** y orientar a estudiantes de secundaria o preparatoria sobre cómo y con quién pedir ayuda dentro de su escuela. No elimina el bullying ni diagnostica situaciones: es una herramienta educativa y de orientación.

## Módulos

| Módulo | Qué hace | ¿Guarda datos? |
|---|---|---|
| **A · Necesito ayuda** | Orientación según 4 situaciones + formulario de práctica que valida campos | **No.** No envía ni guarda nada |
| **B · Aprende a reconocerlo** | Cuestionario de 7 situaciones ficticias con explicación y resultado | **No.** Solo en memoria |
| **C · Termómetro de convivencia** | Encuesta de 5 preguntas y gráfica de barras hecha con HTML/CSS | Sí, solo **conteos totales** en `localStorage` de este navegador |
| **D · ¿Cómo puedo ayudar?** | Recomendaciones seguras según 4 casos | **No** |

En el pie de todas las vistas y en el módulo D hay un bloque fijo de ayuda urgente (911 en México).

## Estructura

```
punto_seguro/
├── index.html   estructura y textos de todas las vistas
├── styles.css   diseño (colores, tipografía, adaptación a pantallas)
├── script.js    navegación, módulos y validaciones
└── README.md    este archivo
```

## Cómo abrirla

1. Descarga o copia los cuatro archivos en una misma carpeta.
2. Haz doble clic en `index.html` (o clic derecho → Abrir con → tu navegador).
3. Funciona sin internet y sin instalar nada.

## Poner los datos reales de la escuela

Abre `script.js` y llena el objeto del inicio:

```js
const datosEscuela = {
  orientador: 'Mtra. Laura Gómez (Orientación)',
  telefono: '55 1234 5678',
  ubicacion: 'Edificio B, planta baja'
};
```

Si algún dato queda vacío, la app muestra su marcador (`{{nombre del orientador/a}}`, `{{teléfono de dirección}}`, `{{ubicación de orientación}}`) resaltado, para que se note que falta.

## Decisiones técnicas

- **HTML + CSS + JavaScript sin librerías**, sin CDN ni fuentes externas (se usa la fuente del sistema).
- **Una sola página** con cuatro vistas; se cambia de vista con el `#` de la dirección (`#ayuda`, `#aprende`, `#termometro`, `#guia`), así funciona el botón Atrás del navegador.
- **Nombres de variables y funciones en español**, en `camelCase` (por ejemplo `mostrarVista`, `crearGrupoOpciones`).
- **Opciones accesibles**: las respuestas usan `role="radiogroup"` y `role="radio"` con `aria-checked`. Cada opción se alcanza con **Tab** y se elige con **Enter** (también con Espacio o con las flechas).
- **Privacidad**: el Termómetro guarda solo cuántas personas respondieron cada opción, nunca respuestas individuales. Hay un botón para borrar esos datos.
- **Errores controlados**: cada módulo arranca por separado; si `localStorage` está bloqueado, el Termómetro funciona en memoria y lo avisa.

## Limitaciones

- No envía reportes reales a la escuela.
- Los resultados del Termómetro son de un solo navegador y no representan a toda la escuela.
- No sustituye la ayuda de personas capacitadas ni los protocolos de la escuela.
