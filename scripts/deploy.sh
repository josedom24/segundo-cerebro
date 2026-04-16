#!/bin/bash
# Uso:
#   ./scripts/deploy.sh
#   ./scripts/deploy.sh "mensaje del commit"

set -e

SSH_HOST="debian@endor.josedomingo.org"
DIST_SRC="quartz/public/"
DIST_DST="/home/debian/www/wiki/html/"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}▶ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
err()  { echo -e "${RED}✗ $1${NC}"; exit 1; }

MSG=${1}

# --- Commit y push ---
commit_and_push() {
  log "git add..."
  git add -A

  if git diff --cached --quiet; then
    warn "Sin cambios que commitear"
  else
    log "git commit: $MSG"
    git commit -m "$MSG"
    log "git push..."
    git push
  fi
}

# --- Build ---
build() {
  log "Construyendo el site..."
  cd quartz
  npx quartz build
  cd ..
  cp scripts/.htaccess quartz/public/.htaccess
  log "Build completado"
}

# --- Deploy ---
deploy() {
  log "Sincronizando con $SSH_HOST..."
  rsync -az --delete $DIST_SRC ${SSH_HOST}:${DIST_DST}
  log "✅ Wiki desplegada correctamente en $DIST_DST"
}

# --- Main ---
[ -n "$MSG" ] && commit_and_push
build
deploy
