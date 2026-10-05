#!/bin/bash
# Uso:
#   ./scripts/deploy.sh "mensaje del commit"
#
# La wiki se construye y se publica en GitHub Pages con la GitHub Action
# .github/workflows/deploy.yml en cada push a main.

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}▶ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
err()  { echo -e "${RED}✗ $1${NC}"; exit 1; }

MSG=${1}
[ -z "$MSG" ] && err "Falta el mensaje del commit"

git add -A
if git diff --cached --quiet; then
  warn "Sin cambios que commitear"
  exit 0
fi
log "git commit: $MSG"
git commit -m "$MSG"
log "git push..."
git push
log "✅ Publicando con GitHub Actions: https://github.com/josedom24/segundo-cerebro/actions"
