# 📚 Cómo Usar tu "Segundo Cerebro"

Tu wiki funciona en **3 workflows principales**. Aquí están con ejemplos reales:

---

## 1️⃣ **INGESTAR una nueva fuente** 
### (Procesar un artículo/documento y guardar sus ideas)

### Cuándo usar
Cuando encuentras un artículo, blog, PDF, video-resumen, etc. que quieres incorporar a tu conocimiento.

### Cómo hacerlo
1. **Guardar el contenido** en `raw-sources/` con nombre descriptivo
2. **Usar este comando en terminal:**
```bash
cd /home/jose/github/segundo-cerebro
claude -p "He añadido raw-sources/[nombre-archivo]. 
Lee el archivo, extrae 3-5 ideas clave, crea un resumen en wiki/summaries/, 
actualiza wiki/index.md y los conceptos relacionados. 
Muéstrame todos los archivos que modificaste."
```

### Ejemplo real
```bash
claude -p "He añadido raw-sources/09-postgres-replication.md. 
Lee, extrae ideas clave, resume en wiki/summaries/, 
actualiza index.md y conceptos (Database, Replication, PostgreSQL). 
Muéstrame los cambios."
```

### Qué pasa
- ✅ Se crea `wiki/summaries/09-postgres-replication.md`
- ✅ Se actualizan conceptos existentes o se crean nuevos
- ✅ Se añade entrada a `wiki/index.md`
- ✅ Se registra en `wiki/log.md`

---

## 📥 **Cómo añadir artículos de una web a `raw-sources/`**

Cuando encuentres un artículo interesante en internet, hay varias formas de guardarlo:

### ✅ Opción 1: Copiar y guardar manualmente (MÁS FÁCIL)

Si el artículo es corto o prefieres hacerlo manual:

1. **Abre el artículo en el navegador**
2. **Selecciona y copia el contenido** (Ctrl+A → Ctrl+C)
3. **Crea el archivo:**
```bash
cat > /home/jose/github/segundo-cerebro/raw-sources/09-nombre-articulo.md << 'EOF'
# Título del Artículo

URL: https://ejemplo.com/articulo

[Pega aquí todo el contenido del artículo]

EOF
```

### Ejemplo real
```bash
cat > /home/jose/github/segundo-cerebro/raw-sources/09-postgres-optimization.md << 'EOF'
# PostgreSQL: Tips de Optimización

URL: https://www.josedomingo.org/blog/postgres-optimization

## Introducción
Lorem ipsum...

## Índices
Contenido...
EOF
```

---

### 🔧 Opción 2: Descargar automáticamente con curl (RÁPIDO)

Si tienes `pandoc` instalado (convierte HTML a Markdown):

```bash
# Descargar y convertir automáticamente
curl -s "https://ejemplo.com/articulo" | pandoc -f html -t markdown \
  > /home/jose/github/segundo-cerebro/raw-sources/09-nombre.md
```

**Instalar pandoc** (si no lo tienes):
```bash
sudo apt-get install pandoc
```

**Ejemplos prácticos:**
```bash
# Artículo de tu blog
curl -s "https://www.josedomingo.org/blog/mi-articulo" | pandoc -f html -t markdown \
  > /home/jose/github/segundo-cerebro/raw-sources/09-mi-articulo.md

# Artículo de Medium
curl -s "https://medium.com/@usuario/articulo" | pandoc -f html -t markdown \
  > /home/jose/github/segundo-cerebro/raw-sources/09-medium-articulo.md

# Documentación oficial
curl -s "https://docs.ejemplo.com/guia" | pandoc -f html -t markdown \
  > /home/jose/github/segundo-cerebro/raw-sources/09-documentacion.md
```

---

### 🤖 Opción 3: Script automatizado (PRO)

Crea un script reutilizable:

```bash
#!/bin/bash
# Guardar como: ~/ingest-from-url.sh

URL=$1
TITLE=$2
NUM=${3:-09}

if [ -z "$URL" ] || [ -z "$TITLE" ]; then
  echo "Uso: ./ingest-from-url.sh <URL> <titulo> [numero]"
  exit 1
fi

FILE="/home/jose/github/segundo-cerebro/raw-sources/${NUM}-${TITLE}.md"

echo "Descargando $URL..."
curl -s "$URL" | pandoc -f html -t markdown -o "$FILE"

echo "✅ Guardado en: $FILE"
echo ""
echo "Ahora ejecuta:"
echo "  claude -p \"He añadido raw-sources/${NUM}-${TITLE}.md. Procésalo...\""
```

**Usar el script:**
```bash
chmod +x ~/ingest-from-url.sh
~/ingest-from-url.sh "https://www.ejemplo.com/articulo" "postgres-optimization" "09"
```

---

### 📋 **Nomenclatura recomendada**

Sigue el patrón de los archivos existentes:

```
raw-sources/
├── 01-migracion-pledin-astro.md
├── 02-vpn-headscale-seguridad-acls.md
├── ...
└── 09-nombre-del-tema.md
       ↑  ↑
    número  descripción breve
```

**Reglas:**
- [[|Números secuenciales (01, 02, 03, ... 09, 10...)
- [[|Nombre descriptivo en minúsculas con guiones
- [[|Extensión `.md` (markdown)

---

### ⚠️ **Cuándo usar cada opción**

| Situación | Mejor opción |
|-----------|---|
| Artículo corto (< 5min lectura) | Manual (Opción 1) |
| Artículo mediano | Curl + Pandoc (Opción 2) |
| Muchos artículos | Script (Opción 3) |
| PDF con imágenes | Manual (Opción 1) |
| Contenido con tablas/código | Curl + Pandoc (Opción 2) |

---

### 🎯 **Workflow completo: De URL a Wiki**

```bash
# Paso 1: Descargar (elige una opción)
curl -s "https://ejemplo.com/articulo" | pandoc -f html -t markdown \
  > /home/jose/github/segundo-cerebro/raw-sources/09-tema.md

# Paso 2: Procesar con Claude
claude -p "He añadido raw-sources/09-tema.md. 
Lee, extrae ideas clave, resume en wiki/summaries/, 
actualiza conceptos y index.md. Muéstrame los cambios."
```

---

## 2️⃣ **CONSULTAR el vault**
### (Hacer una pregunta y guardar la respuesta)

### Cuándo usar
Cuando necesitas información que ya ingestionaste, o hacer una síntesis de múltiples temas.

### Cómo hacerlo
```bash
claude -p "[Tu pregunta]. 
Lee wiki/index.md, encuentra páginas relevantes, 
sintetiza respuesta. Si vale la pena, guarda en wiki/analyses/. 
Actualiza index.md y log.md."
```

### Ejemplos reales

**Pregunta 1: Comparar herramientas**
```bash
claude -p "¿Cuál es la diferencia entre Astro y Jekyll? 
Busca en el vault, compara pros/contras de cada uno, 
analiza cuándo usarías uno u otro. Si es útil, guarda como análisis."
```

**Pregunta 2: Entender un flujo**
```bash
claude -p "¿Cómo se configura una VPN con Headscale? 
Busca en summaries y conceptos, crea un flujo paso a paso. 
Guarda como wiki/analyses/headscale-setup-guide.md"
```

**Pregunta 3: Encontrar patrones**
```bash
claude -p "¿Qué aparece repetidamente en mis estudios? 
Lee todo el vault, busca temas transversales, 
crea un análisis de patrones principales."
```

### Qué pasa
- ✅ Lee las páginas relevantes
- ✅ Sintetiza una respuesta basada en tu vault
- ✅ Crea nueva página en `wiki/analyses/` si es valiosa
- ✅ Actualiza `index.md`
- ✅ Registra en `log.md`

---

## 3️⃣ **LIMPIAR el vault**
### (Mantenimiento semanal: buscar problemas)

### Cuándo usar
Una vez por semana, para detectar:
- ❌ Contradicciones (ideas opuestas en diferentes páginas)
- ❌ Páginas "huérfanas" (sin backlinks, sin referencias)
- ❌ Conceptos mencionados pero sin página dedicada
- ❌ Información obsoleta (contradecida por fuentes nuevas)

### Cómo hacerlo
```bash
claude -p "Lee todo el vault (wiki/). 
Busca contradicciones, huérfanas, conceptos sin página, información obsoleta. 
Escribe un reporte en wiki/lint-report.md con fixes específicas."
```

### Qué pasa
- ✅ Se genera `wiki/lint-report.md` con problemas encontrados
- ✅ Cada problema tiene una acción propuesta
- ✅ Puedes revisar y aplicar los fixes manualmente o pedirle que los haga

---

## 🎯 **Flujo típico semanal**

### Lunes-Viernes
```bash
# Cuando encuentras algo interesante
claude -p "He añadido raw-sources/[archivo]. Procésalo..."

# Cuando necesitas info
claude -p "[Tu pregunta]. Busca en el vault..."
```

### Viernes/Sábado (limpieza)
```bash
# Revisar todo
claude -p "Lee todo wiki/. Busca problemas. Escribe lint-report.md"
```

---

## 📋 **Formato de archivos**

Todos los archivos que Claude crea siguen este patrón:

```markdown
---
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [archivo-1, archivo-2]
tags: [tag1, tag2]
---

# Título

## Resumen de una línea
Qué es esto en una sola frase

## Definición
Explicación clara

## Ideas clave
- [[|Idea 1
- [[|Idea 2
- [[|Idea 3

## Relaciones
- [[|[[|Conecta con: [[Concepto A]], [[Concepto B]]
- [[|[[|Contrasta con: [[Concepto C]]

## Fuentes
- [Fuente 1](../summaries/fuente-1.md)
```

---

## 🔗 **Enlaces internos**

[[|Usa `[[Nombre del Concepto]]` para crear links. Ejemplos:
- `[[[[|Headscale]]` → apunta a `wiki/concepts/headscale.md`
- `[[[[|Astro]]` → apunta a `wiki/concepts/astro.md`
- `[[[[|Patrones en VPN]]` → crea página si no existe

---

## 💡 **Pro tips**

| Situación | Comando |
|-----------|---------|
| Artículo importante | `claude -p "Ingestar raw-sources/[archivo]..."` |
| Pregunta de síntesis | `claude -p "[Pregunta]. Busca en vault..."` |
| [[|Comparación entre temas | `claude -p "Compara [[Tema A]] vs [[Tema B]]..."` |
| Encontrar nuevos patrones | `claude -p "¿Qué temas aparecen juntos?"` |
| Limpiar semanalmente | `claude -p "Lee todo wiki/. Lint report."` |

---

## 🚀 **Empezar ahora**

### Opción 1: Procesar una nueva fuente
¿Tienes un artículo nuevo? Guárdalo en `raw-sources/` y usa:
```bash
claude -p "He añadido raw-sources/[archivo]. Procésalo..."
```

### Opción 2: Hacer una pregunta
```bash
claude -p "¿Cuál es la diferencia entre Tailscale y Headscale? 
Busca en el vault y sintetiza..."
```

### Opción 3: Limpiar el vault
```bash
claude -p "Lee todo wiki/. Busca problemas. Lint report."
```

---

## 📚 **Archivos de referencia**

- **CLAUDE.md** — Reglas del sistema (configuración técnica)
- **INSTRUCCIONES.md** — Este archivo (cómo usar la herramienta)
- **Memory.md** — Índice de memoria para Claude
- **wiki/index.md** — Catálogo maestro del vault
- **wiki/log.md** — Historial append-only de todas las operaciones

---

**Última actualización:** 2026-04-15
