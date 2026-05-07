# Segundo Cerebro Educativo

Vault de [Obsidian](https://obsidian.md) sobre **infraestructura, virtualización, contenedores y servicios en Linux**, construido a partir de los cursos publicados en [plataforma.josedomingo.org](https://plataforma.josedomingo.org) y de los artículos del blog [josedomingo.org](https://www.josedomingo.org/pledin/blog/). Publicado como sitio web estático con [Quartz](https://quartz.jzhao.xyz/).

🌐 **Wiki publicada:** [wiki.josedomingo.org](https://wiki.josedomingo.org)

📖 **Sobre el proyecto:** lee [el artículo del blog](https://www.josedomingo.org/pledin/) donde se explica el porqué, la arquitectura y los aprendizajes del proceso.

## Arquitectura

El vault se organiza en dos capas:

**Núcleo (inmutable, fuente de verdad):**

- `concepts/` — Abstracciones reutilizables que aparecen en múltiples plataformas (Deployment, Volume, Snapshot, Pod, etc.).
- `summaries/` — Síntesis de módulos específicos de cursos, con referencias a la fuente original.

**Satélites (flexibles, crecen con el tiempo):**

- `articles/` — Entradas de blog, casos prácticos, profundizaciones.
- `analyses/` — Síntesis propias y comparativas entre tecnologías.
- `entities/` — Personas, empresas y recursos relevantes.

El núcleo es estable y referencial; los satélites lo enriquecen con contexto del mundo real y pueden retroalimentarlo.

## Estructura del repositorio

```
segundo-cerebro/
├── wiki/                  # Vault de Obsidian
│   ├── index.md           # Tabla de contenidos (catálogo navegable)
│   ├── concepts/          # Conceptos reutilizables
│   ├── summaries/         # Resúmenes de módulos de cursos
│   ├── articles/          # Artículos y profundizaciones
│   ├── analyses/          # Análisis y comparativas propias
│   ├── entities/          # Personas, empresas, recursos
│   ├── log.md             # Historial append-only de operaciones
│   └── lint-report.md     # Auditoría periódica del vault
├── quartz/                # Generador de sitio estático (Quartz v4)
│   ├── quartz.config.ts   # Configuración del sitio
│   └── quartz.layout.ts   # Layout y componentes
├── scripts/
│   └── deploy.sh          # Build + rsync al servidor
├── CLAUDE.md              # Reglas del vault e instrucciones para Claude
└── README.md              # Este archivo
```

## Uso

### Ver el vault en Obsidian

```bash
git clone git@github.com:josedom24/segundo-cerebro.git
# Abrir Obsidian → "Open vault as folder" → seleccionar wiki/
```

### Construir y servir el sitio en local

```bash
cd quartz
npm install                                    # solo la primera vez
npm run quartz build -- --serve --watch       # http://localhost:8080
```

### Desplegar al servidor

```bash
# Solo build + deploy
./scripts/deploy.sh

# Commit + build + deploy
./scripts/deploy.sh "mensaje del commit"
```

## Convenciones

- **Nombres de archivos:** `kebab-case` en minúsculas (`introduccion-docker.md`).
- **Wikilinks:** `[[nombre-archivo|Texto mostrado]]`.
- **Frontmatter mínimo:**

  ```yaml
  ---
  title: "Título del documento (igual al H1)"
  created: YYYY-MM-DD
  updated: YYYY-MM-DD
  sources: [referencia-fuente]
  tags: [etiqueta1, etiqueta2]
  ---
  ```

- **Etiquetas:** consolidadas en español. Cada etiqueta debe tener al menos 3 ocurrencias para mantenerse; en caso contrario se consolida con una más general.

## Mantenimiento

Las reglas completas, los workflows de ingesta de fuentes y las normas de mantenimiento están documentadas en [`CLAUDE.md`](CLAUDE.md). Ese archivo permite que cualquier conversación con Claude empiece con el mismo contexto y pueda seguir manteniendo el vault de forma consistente.

Periódicamente se ejecuta un proceso de *lint* sobre el vault (enlaces rotos, archivos huérfanos, coherencia entre `title` y H1, etiquetas poco usadas). Los resultados se registran en `wiki/lint-report.md`.

## Licencia

Contenido basado en los cursos de [josedomingo.org](https://josedomingo.org) e [IESGN](https://github.com/iesgn). Respeta las licencias de las fuentes originales.
