#!/usr/bin/env bash
# =====================================================================
#  Arma la carpeta que se publica (_sitio/) sin las carpetas internas.
#  En Cloudflare Pages: comando de compilación  "bash construir.sh"
#                       carpeta de salida       "_sitio"
#  No publica nada por sí solo: solo copia archivos.
# =====================================================================
set -euo pipefail
cd "$(dirname "$0")"

rm -rf _sitio
mkdir _sitio

tar \
  --exclude=./_sitio \
  --exclude=./.git \
  --exclude=./.gitignore \
  --exclude=./.htaccess \
  --exclude=./.nojekyll \
  --exclude=./.claude \
  --exclude=./.impeccable \
  --exclude=./assets-originales \
  --exclude=./lanzamiento \
  --exclude=./construir.sh \
  -cf - . | tar -xf - -C _sitio

echo "Sitio listo en _sitio/ ($(find _sitio -type f | wc -l) archivos)"
