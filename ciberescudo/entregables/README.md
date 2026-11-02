# CiberEscudo

App educativa y gamificada de **seguridad digital y convivencia** (prevención del bullying y el ciberacoso) para la Escuela Preparatoria «Lázaro Cárdenas» (estudiantes de 15 a 18 años). Tiene estética pixel art / cyberpunk y una mascota que canta y te acompaña: una flor rosa pixelada con lentes oscuros y una mariposa azul. Fuera de Inicio se vuelve una florecita que puedes arrastrar, que habla con balbuceos y reacciona a lo que pasa.

Contenido:
- 40 retos en 4 mundos.
- 30 escenarios en 5 paquetes: 2 de seguridad digital y 3 de convivencia.
- 14 lecciones.
- 20 misiones de seguridad y tareas personales.
- 10 objetivos de convivencia.
- Guía de incidentes con 12 procedimientos.
- 4 canciones.
- Un final: el Certificado CiberEscudo.

Funciona sin internet y no recopila datos.

Hecha con HTML5, CSS3 y JavaScript sin frameworks, librerías, CDN ni imágenes externas. La música y los sonidos se generan con código (Web Audio). Tres canciones son originales; la cuarta es el Jarabe Tapatío, una melodía tradicional de dominio público.

Versión en línea: https://app5-ciberescudo.vercel.app

## Estructura

```
ciberescudo/
├── index.html
├── README.md
├── BITACORA_IA.docx
├── DOCUMENTACION_TECNICA.docx
├── GUION.pptx
├── PITCH.docx
├── assets/
│   ├── css/styles.css
│   └── js/  mascot.js · password.js · simulator.js · quiz.js · tasks.js · app.js
└── sw.js, manifest.webmanifest, icon-*.png   (para instalarla y usarla sin internet)
```

## Cómo ejecutarla

**Opción 1, la más rápida:** abre `index.html` con doble clic en el navegador. Funciona sin servidor (los scripts son clásicos con `defer`).

**Opción 2, con servidor local** (necesario para probar el modo sin internet del service worker):

```bash
cd ciberescudo
python3 -m http.server 8000
# abre http://localhost:8000 y usa el modo celular de las herramientas del navegador (390 × 844)
```

**Publicarla en internet:** sube esta carpeta a GitHub Pages, Netlify o Vercel.

## Manual de pruebas

**Pruebas a mano (para demostrar en clase):**

1. **XP y racha.**
   - En Inicio anota el XP (de un máximo de 1000) y la racha.
   - Ve a Retos, elige un mundo y contesta bien una pregunta: aparece «+15 XP», el marcador de arriba da un brinco y la racha pasa a 1.
   - Repite ese mundo: la pregunta dice «Repaso · ya la dominas» y no suma XP.
   - Cierra y vuelve a abrir la app: el XP sigue ahí.
2. **Misiones y tareas en localStorage.**
   - En Plan de acción marca una misión de seguridad: da +5 XP. Desmárcala y vuelve a marcarla: ya no suma.
   - Crea una tarea personal, edítala con el lápiz, márcala (no da XP) y borra otra con el bote de basura.
   - Intenta escribir como tarea personal el texto de una misión: la app no te deja.
   - Cierra y abre la app: todo sigue.
   - En la computadora puedes verlo en las herramientas del navegador → Aplicación → Almacenamiento local → `ciberescudo.misiones.v1` y `ciberescudo.tareas.v1`.
3. **Verificador sin guardar nada.**
   - Escribe `teamo123` (muy débil) y luego `tortuga-Cometa-faro-elote-42` (muy fuerte). Al tocar el campo, la florecita se tapa los ojos.
   - Revisa el Almacenamiento local: solo existen `ciberescudo.progreso.v1`, `ciberescudo.misiones.v1`, `ciberescudo.tareas.v1` y `ciberescudo.ajustes.v1`. Nunca está la contraseña.
   - Cambia de sección y regresa: el campo está vacío.
4. **Convivencia.**
   - Toca «Convive» en la barra de abajo. Verás los 3 pasos (Identificar, Prevenir y Actuar), cada uno «En línea» y «En persona».
   - Abre la lección «Ciberacoso»: aparece «Leído» y en «Tus objetivos de convivencia» se marca solo «Identificar señales de ciberacoso».
   - En el Simulador abre el paquete 5 «En la escuela». La situación se cuenta como escena y arriba de la pregunta dice el paso. Al responder se ven la opción más segura, por qué las otras no ayudan, una recomendación y cuándo pedir ayuda.
   - En «Más → Incidentes» abre «Me amenazan o me extorsionan»: tiene 7 puntos numerados y marca lo que depende de la app.
5. **Final del juego.**
   - Abre «Más → Certificado»: muestra los 4 requisitos con su avance (40 retos, 30 escenarios, 14 lecciones y 5 misiones).
   - Cada requisito lleva a donde se completa.
   - Al completarlo todo aparecen el aviso y el confeti, y el certificado se desbloquea.
6. **La flor y la compañera.**
   - En Inicio, toca la flor: suena una canción y canta al ritmo. Tócala otra vez para callarla. Cada vez suena la siguiente de las 4 canciones.
   - En otra sección aparece la florecita. Cae y se para sobre tarjetas y botones, salta sola, viaja con el scroll y, al tocarla, dice algo de lo que pisa.
   - Contesta un reto: festeja con chispas si aciertas o llora una lágrima si fallas.
   - Zarandéala con el dedo y suéltala: se marea.
   - Déjala 40 segundos sin tocar nada: se duerme.
   - En «Más → Ajustes» apaga el sonido o escóndela.
7. **Navegación.**
   - La barra de abajo tiene Inicio, Convive, Simulador, Retos, Tareas y «Más».
   - «Más» sube una hoja con Verificador, Privacidad, Incidentes y Certificado. Se cierra tocando fuera, con la X o con el botón Atrás de Android.
   - En una computadora (pantalla ancha), la barra se vuelve un riel a la izquierda con todas las secciones.
8. **Accesibilidad.**
   - Navega solo con el teclado (Tab y Enter): todo se puede usar y el foco se ve en amarillo.
   - Activa «Reducir movimiento» en el sistema: se apagan las animaciones, las notas y el confeti.
   - Prueba con el lector de pantalla del celular (TalkBack o VoiceOver): los botones de íconos dicen qué hacen.
9. **Sin internet.** Activa el modo avión y abre la app: todo funciona.
10. **Reiniciar para la demo.** En Inicio, «Reiniciar progreso» deja en cero el XP, la racha, la maestría y el certificado. Las misiones marcadas y las tareas no se borran: desmárcalas a mano si quieres empezar de cero.

## Seguridad y privacidad

- **localStorage** se usa para cuatro cosas, y ninguna guarda datos personales:
  - el progreso (`ciberescudo.progreso.v1`: XP, racha, lo dominado, lecciones leídas y fecha del certificado);
  - las misiones completadas (`ciberescudo.misiones.v1`);
  - las tareas personales (`ciberescudo.tareas.v1`);
  - los ajustes de la app (`ciberescudo.ajustes.v1`: sonido, florecita y su posición).
- **El verificador de contraseñas** trabaja solo en memoria: no usa localStorage, cookies ni red, y se borra al salir de la sección.
- **El nombre del certificado** tampoco se guarda.
- **No hay** cuentas, servidores, analíticas ni enlaces reales en el simulador.
- **Escenarios de convivencia:** son ficticios, con nombres inventados. Ninguna respuesta correcta pide enfrentar a alguien a solas, investigar, exhibir, grabar o reenviar contenido. La app no tiene herramientas para crear stickers ni editar fotos.
- **Teléfonos de ayuda:** se verificaron en octubre de 2026 (911, 089, 088, Línea de la Vida y Policía Cibernética de Jalisco). Los protocolos propios de la escuela deben confirmarse con orientación.
