# Mi Segundo Cerebro: Una Wiki Extensible con Obsidian y Quartz

Llevo muchos años generando materiales didácticos: en el blog de mi página web, en cursos publicados en la plataforma Pledin, en apuntes de las asignaturas que imparto en el instituto, en repositorios de GitHub, en documentación de proyectos. El contenido no está conectado entre sí. Durante años sentí la necesidad de conectarlas todas — reunir ese conocimiento acumulado en un único lugar donde pueda verse cómo se relacionan los conceptos, dónde se solapan las plataformas, qué patrones emergen cuando juntas Docker, Kubernetes, Proxmox y KVM bajo el mismo grafo. Este artículo explica cómo lo hice.

**Aviso desde el principio:** Esto empezó como una práctica para aprender a trabajar con IA en flujos profesionales reales. No estoy seguro de que la wiki en sí aporte valor único frente a mi blog — los contenidos vienen de ahí. Lo que sí creo que aporta es el *proceso*: cómo se diseñó, qué reglas evolucionaron, qué cosas hizo bien Claude y cuáles tuve que corregir. Si te interesa más el "cómo" que el "qué", sigue leyendo.

## El concepto: Segundo Cerebro

La idea del "Segundo Cerebro" no es nueva, pero Andrej Karpathy la reformuló recientemente en el contexto de los LLMs: un sistema externo donde acumular conocimiento de forma estructurada, con relaciones entre conceptos, que puedes consultar y ampliar con ayuda de la IA. No se trata de almacenar información en bruto, sino de *sintetizarla* — extraer lo esencial, relacionarlo con lo que ya sabes, y mantenerlo accesible.

Pero esto es clave: **la síntesis no pierde la conexión con el original**. Cada resumen mantiene referencias a la fuente (un curso, un artículo, un libro), y cada concepto enlaza con los resúmenes que lo usan. Si quiero entender cómo funciona un Deployment en Kubernetes, voy al concepto abstracto; si quiero ver ejemplos prácticos, salto al resumen del curso donde se enseña. La información es redundante en estructura pero no en contenido: el mismo concepto aparece en múltiples plataformas, así que un solo "Deployment" conecta Docker, Kubernetes, OpenShift, etc. a la vez.

Mi implementación tiene dos capas arquitectónicas claras:

**El Núcleo (inmutable, fuente de verdad):**
- **Conceptos:** Abstracciones reutilizables que aparecen en múltiples plataformas (Deployment, Volume, Snapshot, Pod, etc.) — cada uno enlaza a todos los resúmenes que lo mencionan
- **Resúmenes:** Síntesis de módulos específicos de cursos con las ideas clave — cada uno referencia la fuente original y enlaza con conceptos relacionados

**Los Satélites (flexibles, crecen con el tiempo):**
- **Artículos:** Blog posts, troubleshooting, casos reales que enlazan al núcleo
- **Análisis:** Síntesis propias que conectan múltiples conceptos
- **Entidades:** Personas, empresas, recursos relevantes que contextualizan el contenido

La distinción es importante: el núcleo es estable, referencial y enlazado bidireccionalmente; los satélites lo enriquecen con contexto del mundo real. Y aquí está la clave arquitectónica: **los artículos pueden modificar y mejorar los resúmenes del núcleo** cuando aportan valor. Si descubro un caso de uso no documentado o una solución a un problema común, fluye de vuelta al núcleo.

## El contenido: Estructurado para crecer

Esta estructura comienza con cursos que ya existen en [plataforma.josedomingo.org](https://plataforma.josedomingo.org). Cada uno se sintetiza:

1. Se extrae un resumen por módulo (una página por unidad de curso)
2. Se identifican conceptos transversales y se enlazan
3. Se mantienen referencias cruzadas entre plataformas relacionadas

Pero el volumen inicial no importa tanto como la arquitectura. El diseño permite:

- **Agregar nuevos cursos:** Ingestar módulos nuevos siguiendo el mismo patrón
- **Agregar artículos:** Blog posts, troubleshooting, investigaciones que enriquecen los resúmenes existentes
- **Consolidar tags:** Cuando un tema nuevo aparece (como Vagrant, Infrastructure as Code), crear un tag general consolidable que agrupe múltiples artículos
- **Mantener coherencia:** Sistema de etiquetas consolidado en español, frontmatter estandarizado, enlaces bidireccionales validados

La metáfora funciona: cuanto más contenido hay, más valiosas se vuelven las conexiones entre páginas. Un concepto aislado es útil; ese mismo concepto conectado con 10 diferentes plataformas revela patrones que no veías cuando estudiabas cada una por separado.

## Las herramientas: Obsidian + Git

[Obsidian](https://obsidian.md) es un editor de notas que funciona sobre archivos locales en Markdown. Sin base de datos, sin vendor lock-in — todo son ficheros `.md` versionados en Git. Obsidian llama **"vault"** a una carpeta de notas: es el contenedor de todo tu conocimiento, donde viven los conceptos, resúmenes, artículos y análisis interconectados.

**Wikilinks bidireccionales:** `[[Docker]]` crea un enlace entre páginas. Obsidian mantiene un grafo de conexiones que visualiza cómo se relacionan los conceptos. Para un segundo cerebro técnico, este grafo es invaluable: ver que *Volume* conecta simultáneamente con Kubernetes, Docker, KVM y Proxmox revela patrones transversales que no son evidentes estudiando cada plataforma en silos.

**Estructura estandarizada:** Cada archivo tiene frontmatter YAML con:
- `title:` — Aparece en el explorador de Obsidian en lugar del nombre de fichero
- `created/updated:` — Control de versiones dentro del archivo
- `tags:` — Sistema de 30+ etiquetas consolidadas en español
- `sources:` — Referencias a las fuentes originales

**Git como histórico:** Este vault vive en `wiki/` dentro del repositorio. Cada ingesta (nuevo curso, artículo, análisis) genera un commit documentado en `wiki/log.md`.

## La publicación: Quartz

Tener el conocimiento en local está bien, pero publicarlo lo hace consultable desde cualquier sitio y potencialmente útil para otros. [Quartz](https://quartz.jzhao.xyz/) es un generador de sitios estáticos diseñado específicamente para vaults de Obsidian: entiende los wikilinks, el frontmatter YAML, las etiquetas y genera un sitio navegable con búsqueda, grafo de conexiones y tabla de contenidos automática.

La integración es directa: Quartz lee la carpeta `wiki/` y genera HTML estático en `public/`. El deploy es un simple rsync al servidor:

```bash
./scripts/deploy.sh "mensaje del commit"
```

El script hace tres cosas en orden: commit y push a GitHub, build con Quartz, y sincronización con el servidor vía rsync.

## El mantenimiento: Claude como asistente

La parte más interesante es el rol de la IA. Claude no decide qué entra en el vault — eso lo decido yo. Pero se encarga de todo el trabajo de *gestión del contenido*:

**Ingestión de fuentes:**
- Leer un curso, artículo o investigación completa
- Extraer las ideas clave (sin resumir = sin perder profundidad)
- Escribir resúmenes en formato estándar
- Actualizar conceptos relacionados con nuevas referencias
- Enlazar el nuevo contenido con lo existente

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

## Lo que aprendí por el camino (y lo que no funcionó)

Construir esto no fue lineal. Hubo decisiones que pensé bien y otras que tuve que rehacer. Esta es la parte que probablemente sea más útil si vas a construir algo similar:

* **Tags específicos vs generales.** Al principio etiquetaba todo con detalle (`headscale`, `dnsmasq`, `caching`, `tailscale`...). Resultado: 140+ tags huérfanos que nadie buscaría jamás. La regla evolucionó a: *un tag debe tener al menos 3 ocurrencias o convertirse en candidato a consolidación*. Hoy tengo ~30 tags útiles en español, no 170 ruidosos.
* **Nombres de archivos ≠ H1.** Claude creaba archivos cuyo nombre no reflejaba el título real del documento. Tuve que añadir una norma explícita en `CLAUDE.md`: el campo `title` del frontmatter debe coincidir con el H1, y el nombre del fichero debe ser una versión kebab-case razonable de ese título. Detalle pequeño, impacto grande en navegación.
* **Cuándo NO confiar en Claude.** Inventaba enlaces a archivos que no existían (alucinaciones clásicas). Aprendí a verificar siempre antes de aceptar enlaces generados. Ahora `CLAUDE.md` incluye la regla "todos los enlaces `[[archivo|Texto]]` deben apuntar a archivos existentes" y el lint mensual lo comprueba automáticamente.
* **La memoria persistente fue clave.** Cada conversación nueva empezaba reaprendiendo las normas. Configurar memoria persistente (vía un sistema `MEMORY.md` que Claude lee al inicio de cada sesión) hizo que las reglas evolucionadas no se perdieran. Sin esto, cada nueva conversación era empezar de cero.
* **El núcleo vs satélites cambió 3 veces.** Empezó solo con "resúmenes y conceptos". Después aparecieron los artículos (blog posts que enriquecen los cursos). Después los análisis (síntesis propias). La arquitectura de carpetas refleja esa evolución — y eso está bien, porque el sistema permite refactorizar sin romper enlaces.
* **Limpieza mensual obligatoria.** Por mucho que afines las reglas, siempre puede haber alguna inconsistencia. Una vez al mes ejecuto un workflow de lint donde Claude revisa todo el vault: enlaces rotos, archivos huérfanos, tags poco usados, contradicciones entre documentos. La última limpieza encontró 2 archivos duplicados, 6 con título mal y 2 sin frontmatter completo. Sin este proceso, la wiki se degradaría sola.

## El resultado: Útil para mí, experimento documentado para ti

Para mí: una herramienta de consulta rápida cuando preparo clases, con conexiones que no veía cuando los cursos vivían en silos. Cuando un alumno pregunta "¿esto cómo se hace en OpenShift comparado con Kubernetes?", tengo el grafo delante.

Para ti (lector): un caso de uso real de IA aplicada a un flujo profesional, con todo el código abierto. Si quieres construir tu propio segundo cerebro técnico, este repo te ahorra meses de prueba y error. Las decisiones difíciles — qué meter en el núcleo, cómo estructurar tags, cuándo confiar en la IA — ya están tomadas y documentadas.

Lo que **no es**: un sustituto de mi blog. Mi blog sigue siendo la fuente original de cada contenido. La wiki es la reorganización para mí mismo y para quien quiera replicar el patrón.

## ¿Merece la pena hacer esto?

Honestamente, depende de tu objetivo:

- Si quieres **una wiki técnica al uso**: probablemente Notion, Confluence o incluso una buena estructura de Markdown en GitHub te dan más por menos trabajo.
- Si quieres **aprender a colaborar con IA en flujos reales**: esto es uno de los mejores ejercicios que he hecho en años. Diseñas reglas, las pruebas, las refinas, observas dónde la IA falla y por qué.
- Si eres **docente y quieres mostrar IA aplicada a tus alumnos**: tienes un caso completo para enseñar — desde el diseño arquitectónico hasta el debugging de comportamientos no deseados de la IA.

El verdadero output no es la wiki. Es la habilidad que desarrollas diseñando sistemas que persisten conocimiento, detectando errores de la IA antes de que se propaguen, y construyendo workflows donde la IA hace el trabajo repetitivo mientras tú tomas las decisiones importantes.

Eso, hoy, vale más que cualquier wiki.

## Próximos pasos

Este proyecto seguirá evolucionando, pero ya no es un destino sino un laboratorio. Los principios que aprendí construyéndolo —memoria persistente, normas evolutivas, lint sistemático, división núcleo/satélites— los estoy aplicando ahora a otros flujos profesionales: documentación interna de proyectos, preparación de unidades didácticas e investigación técnica.

Si quieres explorar el resultado, replicar el patrón o ver cómo está estructurado el código:

- **Wiki publicada:** [wiki.josedomingo.org](https://wiki.josedomingo.org)
- **Código fuente:** [github.com/josedom24/segundo-cerebro](https://github.com/josedom24/segundo-cerebro)
- **Archivo clave:** [`CLAUDE.md`](https://github.com/josedom24/segundo-cerebro/blob/main/CLAUDE.md) — todas las reglas que han evolucionado durante el proceso

Si lo adaptas a tu caso, me encantaría saber qué decisiones cambiaste y por qué.
