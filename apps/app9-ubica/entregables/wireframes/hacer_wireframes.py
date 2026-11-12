# Convierte wireframes.html en WIREFRAMES.pdf (para imprimir) y en una imagen PNG
# por página (para pegarlas en la documentación).
# Uso: python3 hacer_wireframes.py   (necesita Playwright con Chromium)
from pathlib import Path
from playwright.sync_api import sync_playwright

CARPETA = Path(__file__).resolve().parent
ENTRADA = CARPETA / "wireframes.html"
PDF = CARPETA.parent / "WIREFRAMES.pdf"

# 11 × 8.5 pulgadas a 96 puntos por pulgada
ANCHO_PAGINA = 1056
ALTO_PAGINA = 816


def abrir_navegador(playwright):
    # Primero el Chromium de Playwright; si no está instalado, el Chrome del sistema.
    try:
        return playwright.chromium.launch()
    except Exception:
        return playwright.chromium.launch(executable_path="/usr/bin/google-chrome")


with sync_playwright() as playwright:
    navegador = abrir_navegador(playwright)
    pagina = navegador.new_page(viewport={"width": ANCHO_PAGINA, "height": ALTO_PAGINA},
                                device_scale_factor=2)
    pagina.goto(ENTRADA.as_uri())
    pagina.pdf(path=str(PDF), width="11in", height="8.5in", print_background=True,
               margin={"top": "0", "right": "0", "bottom": "0", "left": "0"})
    secciones = pagina.locator("section.pagina")
    for indice in range(secciones.count()):
        destino = CARPETA / f"wireframes-{indice + 1}.png"
        secciones.nth(indice).screenshot(path=str(destino))
        print("Imagen:", destino.name)
    navegador.close()

print("PDF creado:", PDF)
