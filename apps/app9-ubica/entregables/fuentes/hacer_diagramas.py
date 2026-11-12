# Ubica · Dibuja los diagramas de la documentación (Pillow). Uso: python3 hacer_diagramas.py
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).resolve().parent
LETRA = "/usr/share/fonts/opentype/inter/Inter-{}.otf"
ACENTO, TEXTO, SUAVE, BORDE, FONDO = "#3552E0", "#1A1D29", "#5E6475", "#C9CEDC", "#EEF0FA"


def letra(tamano, peso="Regular"):
    return ImageFont.truetype(LETRA.format(peso), tamano)


def caja(d, x, y, ancho, alto, titulo, lineas, relleno="white", borde=BORDE, color_titulo=TEXTO):
    d.rounded_rectangle([x, y, x + ancho, y + alto], 18, fill=relleno, outline=borde, width=3)
    d.text((x + ancho / 2, y + 34), titulo, font=letra(30, "SemiBold"), fill=color_titulo, anchor="mm")
    for i, linea in enumerate(lineas):
        d.text((x + ancho / 2, y + 76 + i * 32), linea, font=letra(22), fill=SUAVE, anchor="mm")


def flecha(d, x1, y1, x2, y2, color=ACENTO, texto=None, lado=1):
    d.line([x1, y1, x2, y2], fill=color, width=5)
    import math
    angulo = math.atan2(y2 - y1, x2 - x1)
    for giro in (2.6, -2.6):
        d.line([x2, y2, x2 + 18 * math.cos(angulo + giro), y2 + 18 * math.sin(angulo + giro)], fill=color, width=5)
    if texto:
        d.text(((x1 + x2) / 2 + 14 * lado, (y1 + y2) / 2), texto, font=letra(20, "Medium"), fill=color, anchor="lm" if lado > 0 else "rm")


def arquitectura():
    img = Image.new("RGB", (1800, 1190), "white")
    d = ImageDraw.Draw(img)
    d.text((900, 40), "Tres vistas, una sola fuente de verdad", font=letra(36, "Bold"), fill=TEXTO, anchor="mm")
    vistas = [(60, "Lista", ["vistas.js", "tabla y tarjetas (HTML)"]), (650, "2.5D", ["escena.js", "canvas isométrico"]),
              (1240, "3D", ["escena3d.js + Three.js", "se carga solo al abrirla"])]
    for x, titulo, lineas in vistas:
        caja(d, x, 100, 500, 150, titulo, lineas, relleno=FONDO)
    caja(d, 400, 380, 1000, 150, "ui.js · ejecutar()", ["agrega el historial, guarda en UNA transacción,", "aplica a memoria y permite «Deshacer»"], borde=ACENTO, color_titulo=ACENTO)
    caja(d, 400, 650, 1000, 150, "nucleo.js · reglas del inventario", ["valida y devuelve la lista de cambios (sin pantalla)", "también define las piezas de cada mueble"])
    caja(d, 400, 920, 1000, 150, "basedatos.js · IndexedDB «ubica» v3", ["lugares · muebles · articulos · prestamos", "categorias · movimientos · copias"])
    for x, _, _ in vistas:
        flecha(d, x + 200, 250, min(max(x + 200, 520), 1280), 380)
        flecha(d, min(max(x + 300, 620), 1180) + 100, 380, x + 300, 250, color="#2E9E6B")
    d.text((400, 1100), "Azul: «el usuario quiere mover / prestar / editar»", font=letra(21, "Medium"), fill=ACENTO)
    d.text((400, 1136), "Verde: «los datos cambiaron: vuelve a dibujar»", font=letra(21, "Medium"), fill="#2E9E6B")
    flecha(d, 900, 530, 900, 650, texto="¿es válido? ¿qué cambia?")
    flecha(d, 900, 800, 900, 920, texto="guardar todo o nada")
    img.save(AQUI / "diagrama-arquitectura.png")


def modelo():
    img = Image.new("RGB", (1800, 760), "white")
    d = ImageDraw.Draw(img)
    d.text((900, 40), "Modelo de datos", font=letra(36, "Bold"), fill=TEXTO, anchor="mm")
    caja(d, 60, 110, 480, 190, "lugares", ["nombre, tipo", "plano (opcional)", "vista: lista / 2.5d / 3d"], relleno=FONDO)
    caja(d, 660, 110, 480, 190, "muebles", ["tipo, nombre", "x, y, ancho, fondo, giro", "(sin x, y = sin colocar)"], relleno=FONDO)
    caja(d, 1260, 110, 480, 190, "articulos", ["nombre, código, series", "estados: bueno, reparación,", "dañado"], relleno=FONDO)
    caja(d, 60, 480, 480, 190, "categorias", ["nombre, color", "«Otros» es fija", ""])
    caja(d, 660, 480, 480, 190, "movimientos", ["historial: antes y después", "de cada cambio", ""])
    caja(d, 1260, 480, 480, 190, "prestamos", ["persona, cantidad, fechas", "devuelto, dañadas", ""])
    flecha(d, 660, 205, 540, 205)
    d.text((600, 175), "está en", font=letra(20, "Medium"), fill=ACENTO, anchor="mm")
    flecha(d, 1260, 205, 1140, 205)
    d.text((1200, 160), "dentro de", font=letra(20, "Medium"), fill=ACENTO, anchor="mm")
    d.text((1200, 240), "(o directo en un", font=letra(18), fill=SUAVE, anchor="mm")
    d.text((1200, 262), "lugar, o ninguno)", font=letra(18), fill=SUAVE, anchor="mm")
    flecha(d, 1500, 480, 1500, 300, texto="de un artículo")
    flecha(d, 1300, 300, 500, 480, texto="  tiene categoría", lado=-1)
    img.save(AQUI / "diagrama-datos.png")


arquitectura()
modelo()
print("diagramas listos")
