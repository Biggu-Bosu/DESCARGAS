# Ubica · Entregables

**El inventario que también dice dónde está cada cosa.** Ubica sirve como inventario de listas (artículos, categorías, estados y préstamos) y, para quien lo quiera, organiza lugares (laboratorios, salones, bodegas) que se ven como lista, en 2.5D o en 3D, con muebles que guardan los artículos. Cada persona decide cuánto organiza, lugar por lugar.

Funciona sin internet. Guarda todo en una base de datos **IndexedDB** dentro del celular (o del navegador) y no recopila datos. Está hecha con HTML5, CSS3 y JavaScript, sin frameworks; la única librería es Three.js para la vista 3D, incluida en la app.

- **Versión en línea:** https://app9-ubica.vercel.app
- **APK de Android:** repositorio DESCARGAS → `apps/app9-ubica/` (lo compila GitHub en cada subida).

**Estado:** versión definitiva (11 de noviembre de 2026): inventario, lugares en Lista / 2.5D / 3D e interfaz nueva.

## Los cuatro entregables finales

| Archivo | Qué es |
|---|---|
| `DOCUMENTACION_TECNICA.docx` | Cómo está construida Ubica y cómo funciona: problema, tecnologías, arquitectura, modelo de datos, migraciones, inventario, lugares, 2.5D, 3D, comunicación entre vistas, diseño, respaldos, seguridad, pruebas, limitaciones y evolución. Con diagramas y capturas reales. |
| `BITACORA_DESARROLLO.docx` | Los prompts útiles para crear la app (sin mensajes de trámite), con fecha, modelo, etapa, prompt completo, respuesta (completa o resumen, marcado), cambios y problemas. **El equipo completa** «Ajustes manuales», «¿Cómo verificamos?» y la reflexión. |
| `PRESENTACION.pdf` | **8 diapositivas** para la exposición. Está **congelada**: coincide con el guion. |
| `GUION_EXPOSICION.docx` | Guion para **Expositor 1 y Expositor 2**: 411 palabras habladas (206 y 205), unos 3:30 con el pitch integrado; qué señalar, qué demostrar, términos y preguntas probables. |

## Material de apoyo (no son entregables finales)

| Ruta | Qué es |
|---|---|
| `apoyo/PRESENTACION.pptx` | La presentación editable (de ella sale el PDF). |
| `apoyo/WIREFRAMES.pdf`, `wireframes/` | Bocetos del MVP, hechos antes de programar. |
| `apoyo/Ubica-web.zip` | La app para abrir en la computadora (trae `LEEME.txt`; ahí el 3D necesita servidor). |
| `apoyo/anteriores/` | Versiones anteriores ya reemplazadas (se conservan). |
| `capturas/final/` | Capturas de la versión definitiva tomadas por la prueba automática: celular claro y oscuro, laptop y pantallas grandes. `capturas/etapa-0/` y `etapa-1a/` muestran cómo era antes. |
| `fuentes/` | Scripts que generan todo: `python3 hacer_diagramas.py`, `node hacer_guion.js`, `node hacer_documentos.js` y `soffice --headless --convert-to pdf --outdir . apoyo/PRESENTACION.pptx`. |

La bitácora viva (`docs/prompts.md`) y el código de la app están en el repositorio privado de la app; esta carpeta se movió aquí, al repositorio público de descargas, el 11 de noviembre de 2026. Para regenerar los documentos, indica dónde está la app: `UBICA_APP=/ruta/a/app9-ubica node hacer_documentos.js`.

## Por revisar

| Documento | Qué le falta |
|---|---|
| `DOCUMENTACION_TECNICA.docx` | Datos de la portada (materia, profesor, equipo). Resultados de pruebas en dispositivos reales cuando se hagan. |
| `BITACORA_DESARROLLO.docx` | Que el equipo llene sus campos. Las respuestas 1 a 17 y la 20 son resúmenes (el texto completo no se conserva y no se inventó). Del prompt 19 se conserva completo el archivo adjunto; dos apartados escritos en el mensaje quedaron como resumen. |
| `PRESENTACION.pdf` | Nombre del equipo en la portada (se edita en `apoyo/PRESENTACION.pptx`). Algunas capturas muestran el aviso «Ejemplo cargado». |
| `GUION_EXPOSICION.docx` | Poner el nombre del equipo en la primera frase y **ensayar con cronómetro**: el tiempo es una estimación a 130 palabras por minuto. |
| APK de Android | Confirmar que la compilación salió bien e instalarlo en un Android real. |

## Cómo ejecutarla

- **En línea (recomendado):** https://app9-ubica.vercel.app. En iPhone: Compartir → «Añadir a pantalla de inicio».
- **Con servidor local:** desde la carpeta `www/` de la app, `python3 -m http.server 8000` y abre http://localhost:8000.
- **Sin servidor:** descomprime `apoyo/Ubica-web.zip` y abre `index.html` (todo menos el 3D).

## Manual de pruebas (para demostrar en clase)

1. **Inventario sin lugares.** En una app vacía, «Agregar mi primer artículo»: queda «Sin ubicación» y se puede prestar.
2. **Ejemplo.** «Ver un ejemplo»: Almacén (3D), Laboratorio (2.5D), Bodega y Dirección (solo lista), con préstamos vencidos.
3. **Buscar y filtrar.** Escribe «cable»; toca «Prestados»; elige una categoría; ordena por «Total».
4. **Artículo.** Abre «Microscopio»: piezas por estado, prestar, cambiar estado, baja, historial.
5. **Devolución parcial.** Préstamos → «Devolver»: regresa solo una parte y marca una dañada. «Deshacer».
6. **Localizar.** Busca «micrófono» → «Localizar»: abre el Almacén en 3D con la vitrina resaltada.
7. **3D.** Gira con un dedo (o arrastrando), acerca con dos (o la rueda), toca un mueble y «Abrir».
8. **Mover y comprobar.** Arrastra el mueble seleccionado; cambia a «2.5D»: está en el mismo sitio nuevo. Cambia a «Lista».
9. **2.5D.** En el Laboratorio: elige un mueble de la paleta y toca el piso; selecciona otro y usa «Girar» y «Medidas».
10. **Borrar con seguridad.** Borra un mueble: sus artículos quedan en el lugar. «Deshacer».
11. **Computadora.** `/` busca, `N` crea, `1` `2` `3` cambian de vista, flechas mueven, `Ctrl+Z` deshace.
12. **Presentación.** En un lugar, botón de pantalla: solo la escena. `Esc` para salir.
13. **Datos.** Más → respaldo, copias, base de datos (6 tablas), «Vaciar todo».
14. **Sin internet.** Modo avión y recarga: todo sigue ahí.

**Pruebas automáticas** (desde la carpeta de la app): `npm test` (61), `python3 Pruebas/recorrido_navegador.py` (276 comprobaciones) y `python3 Pruebas/rendimiento.py`.

## Seguridad y privacidad

- **IndexedDB guarda solo el inventario:** lugares, muebles, artículos, préstamos, categorías e historial. Los préstamos guardan el nombre de quien se lleva el artículo y su grupo. Avisen a la escuela que ese dato queda en el dispositivo.
- **`localStorage`** solo recuerda qué lugar estaba abierto y la fecha del último respaldo.
- **No hay** cuentas, servidores ni analíticas. Nada sale del dispositivo, salvo que tú compartas un respaldo o el CSV.
- **Todo texto se escapa** antes de mostrarse. **Todos los formularios** y **los respaldos importados** se validan.
- **El CSV para Excel** está protegido contra fórmulas.
- **Desinstalar la app o borrar los datos del navegador borra el inventario.** Guarden un respaldo de vez en cuando.
