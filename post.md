# Mi Segundo Cerebro: Una Wiki Extensible con Obsidian y Quartz

Llevo muchos años generando materiales didácticos: en el blog de mi página web, en cursos publicados en plataformas de e-learning, en apuntes de las asignaturas que imparto en el instituto, en repositorios de GitHub, en documentación de proyectos. El contenido no está conectado entre sí. Durante años sentí la necesidad de conectarlas todas — reunir ese conocimiento acumulado en un único lugar donde pueda verse cómo se relacionan los conceptos, dónde se solapan las plataformas, qué patrones emergen cuando juntas Docker, Kubernetes, Proxmox y KVM bajo el mismo grafo. Este artículo explica cómo lo hice.

## El concepto: Segundo Cerebro

La idea del "Segundo Cerebro" en la era de los LLMs es simple: un sistema externo donde acumulas conocimiento de forma estructurada, con relaciones entre conceptos, que puedes consultar y ampliar con ayuda de la IA. No se trata de almacenar información en bruto, sino de *sintetizarla* — extraer lo esencial, relacionarlo con lo que ya sabes, y mantenerlo accesible.

Pero esto es clave: **la síntesis no pierde la conexión con el original**. Cada resumen mantiene referencias a la fuente (un curso, un artículo, un libro), y cada concepto enlaza con los resúmenes que lo usan. Si quiero entender cómo funciona un Deployment en Kubernetes, voy al concepto abstracto; si quiero ver ejemplos prácticos, salto al resumen del curso donde se enseña. La información es redundante en estructura pero no en contenido: el mismo concepto aparece en múltiples plataformas, así que un solo "Deployment" conecta Docker, Kubernetes, OpenShift, etc. a la vez.

Mi implementación tiene dos capas arquitectónicas claras:

**🔗 El Núcleo (inmutable, fuente de verdad):**
- **Conceptos:** Abstracciones reutilizables que aparecen en múltiples plataformas (Deployment, Volume, Snapshot, Pod, etc.) — cada uno enlaza a todos los resúmenes que lo mencionan
- **Resúmenes:** Síntesis de módulos específicos de cursos con las ideas clave — cada uno referencia la fuente original y enlaza con conceptos relacionados

**📡 Los Satélites (flexibles, crecen con el tiempo):**
- **Artículos:** Blog posts, troubleshooting, casos reales que enlazan al núcleo
- **Análisis:** Síntesis propias que conectan múltiples conceptos
- **Entidades:** Personas, empresas, recursos relevantes que contextualizan el contenido

La distinción es importante: el núcleo es estable, referencial y enlazado bidireccionalemente; los satélites lo enriquecen con contexto del mundo real. Y aquí está la clave arquitectónica: **los artículos pueden modificar y mejorar los resúmenes del núcleo** cuando aportan valor. Si descubro un caso de uso no documentado o una solución a un problema común, fluye de vuelta al núcleo.

## El contenido: Estructurado para crecer

El vault comienza con cursos que ya existen en [plataforma.josedomingo.org](https://plataforma.josedomingo.org). Cada uno se sintetiza:

1. Se extrae un resumen por módulo (una página por unidad de curso)
2. Se identifican conceptos transversales y se enlazan
3. Se mantienen referencias cruzadas entre plataformas relacionadas

Pero el volumen inicial no importa tanto como la arquitectura. El diseño permite:

- **Agregar nuevos cursos:** Ingestar módulos nuevos siguiendo el mismo patrón
- **Agregar artículos:** Blog posts, troubleshooting, investigaciones que enriquecen los resúmenes existentes
- **Consolidar tags:** Cuando un tema nuevo aparece (como Vagrant, Infrastructure as Code), crear un tag general consolidable que agrupe múltiples artículos
- **Mantener coherencia:** Sistema de etiquetas consolidado en español, frontmatter estandarizado, enlaces bidireccionales validados

La metáfora funciona: cuanto más crece el vault, más valor tiene el grafo de conexiones.

## Las herramientas: Obsidian + Git

[Obsidian](https://obsidian.md) es un editor de notas que funciona sobre archivos locales en Markdown. Sin base de datos, sin vendor lock-in — todo son ficheros `.md` versionados en Git.

**Wikilinks bidireccionales:** `[[Docker]]` crea un enlace entre páginas. Obsidian mantiene un grafo de conexiones que visualiza cómo se relacionan los conceptos. Para un segundo cerebro técnico, este grafo es invaluable: ver que *Volume* conecta simultáneamente con Kubernetes, Docker, KVM y Proxmox revela patrones transversales que no son evidentes estudiando cada plataforma en silos.

**Estructura estandarizada:** Cada archivo tiene frontmatter YAML con:
- `title:` — Aparece en el explorador de Obsidian en lugar del nombre de fichero
- `created/updated:` — Control de versiones dentro del archivo
- `tags:` — Sistema de 30+ etiquetas consolidadas en español
- `sources:` — Referencias a las fuentes originales

**Git como histórico:** El vault vive en `wiki/` dentro del repositorio. Cada ingesta (nuevo curso, artículo, análisis) genera un commit documentado en `wiki/log.md`.

## La publicación: Quartz

Tener el conocimiento en local está bien, pero publicarlo lo hace consultable desde cualquier sitio y potencialmente útil para otros. [Quartz](https://quartz.jzhao.xyz/) es un generador de sitios estáticos diseñado específicamente para vaults de Obsidian: entiende los wikilinks, el frontmatter YAML, las etiquetas y genera un sitio navegable con búsqueda, grafo de conexiones y tabla de contenidos automática.

La integración es directa: Quartz lee la carpeta `wiki/` y genera HTML estático en `public/`. El deploy es un simple rsync al servidor:

```bash
./scripts/deploy.sh "mensaje del commit"
```

El script hace tres cosas en orden: commit y push a GitHub, build con Quartz, y sincronización con el servidor vía rsync.

## El mantenimiento: Claude como asistente de curatoría

La parte más interesante es el rol de la IA. Claude no decide qué entra en el vault — eso lo decido yo. Pero se encarga de todo el trabajo de *curatoría técnica*:

**Ingestión de fuentes:**
- Leer un curso, artículo o investigación completa
- Extraer las ideas clave (sin resumir = sin perder profundidad)
- Escribir resúmenes en formato estándar
- Actualizar conceptos relacionados con nuevas referencias
- Enrazar el nuevo contenido con lo existente

**Mantenimiento estructural:**
- Verificar integridad de enlaces (`[[archivo|Texto]]`)
- Validar YAML en frontmatter (títulos con caracteres especiales requieren comillas)
- Detectar contradicciones o páginas huérfanas
- Limpiar y consolidar tags
- Generar reportes de linting

**Análisis cruzado:**
- Evaluar si un artículo mejora un resumen existente
- Identificar patrones transversales entre plataformas
- Sugerir nuevos análisis comparativos

Todo está documentado en `CLAUDE.md`, un archivo de configuración que vive en el repo. Esto hace el proceso reproducible: cualquier conversación nueva con Claude empieza con el mismo contexto y las mismas reglas.

## El resultado: Una base de conocimiento viva

Una wiki técnica con búsqueda full-text, grafo de conexiones interactivo, modo oscuro y navegación por carpetas. Versionada en GitHub, editable en Obsidian, desplegada en servidor y diseñada para crecer sin límite.

El conocimiento acumulado en años — cursos, artículos, investigaciones — ahora en un único lugar consultable, donde cada página se relaciona con otras, revelando patrones que no eran evidentes en silos.

Y lo más importante: el sistema está preparado para que los nuevos materiales fluyan hacia el núcleo. Un artículo de troubleshooting descubierto hoy puede mejorar un resumen de curso mañana. Una investigación en un tema nuevo puede convertirse en un análisis que enriquece el grafo. El crecimiento es el punto.

---

**Cómo funciona:**
- Carpeta `wiki/` con estructura: concepts/, summaries/, articles/, analyses/, entities/
- Archivo `CLAUDE.md` con instrucciones reproducibles para mantenimiento
- `wiki/log.md` documentando cada cambio (append-only)
- Git como histórico y fuente de verdad
- Quartz para publicación automática
- Una norma simple: cada nuevo documento = `title` en frontmatter igual al H1

*El código fuente del vault está disponible en [github.com/josedom24/segundo-cerebro](https://github.com/josedom24/segundo-cerebro).*
