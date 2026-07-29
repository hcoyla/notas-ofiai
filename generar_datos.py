# ============================================================
# OFIAI - Generador de Datos para GitHub Pages
# ------------------------------------------------------------
# Autor      : Ing. Humberto Coyla
# Proyecto   : OFIAI
# Versión    : 2.0
# Descripción:
# Lee uno o varios archivos Excel y genera el archivo
# data/estudiantes.json utilizado por el Dashboard.
# ============================================================

import json
from pathlib import Path

import pandas as pd


# ------------------------------------------------------------
# CONFIGURACIÓN
# ------------------------------------------------------------

CARPETA_EXCEL = Path("excel")
CARPETA_DATA = Path("data")
ARCHIVO_JSON = CARPETA_DATA / "estudiantes.json"


# ------------------------------------------------------------
# PROGRAMA PRINCIPAL
# ------------------------------------------------------------

def main():

    print("=" * 60)
    print(" OFIAI - Generador de Datos")
    print("=" * 60)
    print()

    print("Buscando archivos Excel...")

    archivos = list(CARPETA_EXCEL.glob("*.xlsx"))

    if len(archivos) == 0:
        print("No se encontraron archivos Excel.")
        return

    print()

    print(f"Se encontraron {len(archivos)} archivo(s):")

    for archivo in archivos:
        print(f"   ✓ {archivo.name}")

    print()
    print("Proceso finalizado.")


if __name__ == "__main__":
    main()
