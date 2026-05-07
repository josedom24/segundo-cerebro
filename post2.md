# Mi Segundo Cerebro: Una Wiki Extensible con Obsidian y Quartz

Llevo muchos años generando materiales didácticos: en el blog de mi página web, en cursos publicados en la plataforma Pledin, en apuntes de las asignaturas que imparto en el instituto, en repositorios de GitHub, en documentación de proyectos. El problema es que ese contenido no está conectado entre sí. Durante años he sentido la necesidad de unirlo todo en un único lugar donde pueda verse cómo se relacionan los conceptos, dónde se solapan las plataformas y qué patrones emergen cuando juntas Docker, Kubernetes, Proxmox y KVM bajo el mismo grafo. En este artículo vamos a ver cómo lo he hecho.

Antes de empezar, conviene aclarar una cosa: este proyecto nació como un ejercicio para aprender a trabajar con IA en flujos profesionales reales. No estoy seguro de que la wiki en sí aporte un valor único frente a mi blog, ya que los contenidos vienen de ahí. Lo que sí creo que aporta es el *proceso*: cómo se ha diseñado, qué reglas han ido evolucionando, en qué tareas funciona bien la IA y cuáles hay que corregir. Si te interesa más el "cómo" que el "qué", sigue leyendo.

## El concepto: Segundo Cerebro

La idea del "Segundo Cerebro" no es nueva, pero Andrej Karpathy la ha reformulado recientemente en el contexto de los LLMs: un sistema externo donde se acumula conocimiento de forma estructurada, con relaciones entre conceptos, que puede consultarse y ampliarse con ayuda de la IA. No se trata de almacenar información en bruto, sino de **sintetizarla**: extraer lo esencial, relacionarlo con lo que ya se conoce y mantenerlo accesible.

Y aquí hay un punto clave: **la síntesis no pierde la conexión con el original**. Cada resumen mantiene referencias a la fuente (un curso, un artículo, un libro) y cada concepto enlaza con los resúmenes que lo utilizan. Si queremos entender cómo funciona un Deployment en Kubernetes, vamos al concepto abstracto; si queremos ver ejemplos prácticos, saltamos al resumen del curso donde se enseña. La información es redundante en estructura pero no en contenido: el mismo concepto aparece en múltiples plataformas, así que un solo "Deployment" conecta Docker, Kubernetes, OpenShift, etc. a la vez.

La implementación se organiza en dos capas arquitectónicas claras:

**El Núcleo (inmutable, fuente de verdad):**

- **Conceptos:** Abstracciones reutilizables que aparecen en múltiples plataformas (Deployment, Volume, Snapshot, Pod, etc.). Cada uno enlaza a todos los resúmenes que lo mencionan.
- **Resúmenes:** Síntesis de módulos específicos de cursos con las ideas clave. Cada uno referencia la fuente original y enlaza con los conceptos relacionados.

**Los Satélites (flexibles, crecen con el tiempo):**

- **Artículos:** Entradas de blog, casos de troubleshooting, escenarios reales que enlazan al núcleo.
- **Análisis:** Síntesis propias que conectan múltiples conceptos.
- **Entidades:** Personas, empresas y recursos relevantes que contextualizan el contenido.

La distinción es importante: el núcleo es estable, referencial y enlazado bidireccionalmente; los satélites lo enriquecen con contexto del mundo real. Y aquí está la clave arquitectónica: **los artículos pueden modificar y mejorar los resúmenes del núcleo** cuando aportan valor. Si descubrimos un caso de uso no documentado o una solución a un problema común, esa información fluye de vuelta al núcleo.

## El contenido: Estructurado para crecer

La estructura inicial parte de los cursos que ya existen en [plataforma.josedomingo.org](https://plataforma.josedomingo.org). Para cada uno se sigue el mismo proceso:

1. Se extrae un resumen por módulo (una página por unidad del curso).
2. Se identifican los conceptos transversales y se enlazan.
3. Se mantienen las referencias cruzadas entre plataformas relacionadas.

Más allá del volumen inicial, lo importante es la arquitectura. El diseño permite:

- **Añadir nuevos cursos:** Ingestar módulos nuevos siguiendo el mismo patrón.
- **Añadir artículos:** Entradas de blog, troubleshooting o investigaciones que enriquecen los resúmenes existentes.
- **Consolidar etiquetas:** Cuando aparece un tema nuevo (por ejemplo, Vagrant o Infrastructure as Code), se crea una etiqueta general consolidable que pueda agrupar varios artículos.
- **Mantener la coherencia:** Sistema de etiquetas consolidado en español, *frontmatter* estandarizado y enlaces bidireccionales validados.

La metáfora funciona: cuanto más contenido hay, más valor cobran las conexiones entre páginas. Un concepto aislado es útil; ese mismo concepto conectado con 10 plataformas diferentes revela patrones que no son evidentes cuando se estudia cada una por separado.

## Las herramientas: Obsidian + Git

[Obsidian](https://obsidian.md) es un editor de notas que funciona sobre archivos locales en Markdown. Sin base de datos y sin *vendor lock-in*: todo son ficheros `.md` versionados en Git. Obsidian llama **vault** a una carpeta de notas, que es el contenedor de todo el conocimiento, donde viven los conceptos, resúmenes, artículos y análisis interconectados.

**Wikilinks bidireccionales.** La notación `[[Docker]]` crea un enlace entre páginas. Obsidian mantiene un grafo de conexiones que visualiza cómo se relacionan los conceptos. Para un segundo cerebro técnico este grafo es muy útil: ver que *Volume* conecta simultáneamente con Kubernetes, Docker, KVM y Proxmox revela patrones transversales que no son evidentes cuando se estudia cada plataforma por separado.

**Estructura estandarizada.** Cada archivo dispone de un *frontmatter* YAML con:

- `title`: Aparece en el explorador de Obsidian en lugar del nombre de fichero.
- `created/updated`: Control de versiones dentro del archivo.
- `tags`: Sistema con más de 30 etiquetas consolidadas en español.
- `sources`: Referencias a las fuentes originales.

**Git como histórico.** El vault vive en `wiki/` dentro del repositorio. Cada ingesta (un nuevo curso, artículo o análisis) genera un commit documentado en `wiki/log.md`.

## La publicación: Quartz

Tener el conocimiento en local está bien, pero publicarlo lo hace consultable desde cualquier sitio y potencialmente útil para otras personas. [Quartz](https://quartz.jzhao.xyz/) es un generador de sitios estáticos diseñado específicamente para vaults de Obsidian: entiende los wikilinks, el *frontmatter* YAML y las etiquetas, y genera un sitio navegable con búsqueda, grafo de conexiones y tabla de contenidos automática.

La integración es directa: Quartz lee la carpeta `wiki/` y genera HTML estático en `public/`. El despliegue se hace con un sencillo `rsync` al servidor:

```bash
./scripts/deploy.sh "mensaje del commit"
```

El script realiza tres tareas en orden: hacer commit y push a GitHub, construir el sitio con Quartz y sincronizar el resultado con el servidor mediante `rsync`.

## El mantenimiento: Claude como asistente

La parte más interesante de este proyecto es el papel de la IA. Claude no decide qué entra en el vault: esa decisión es del autor. Pero se encarga de todo el trabajo de gestión de contenidos:

**Ingesta de fuentes:**

- Leer un curso, artículo o investigación completa.
- Extraer las ideas clave sin perder los detalles importantes.
- Escribir resúmenes en formato estándar.
- Actualizar los conceptos relacionados con nuevas referencias.
- Enlazar el nuevo contenido con lo existente.

**Mantenimiento estructural:**

- Verificar la integridad de los enlaces (`[[archivo|Texto]]`).
- Validar el YAML del *frontmatter* (los títulos con caracteres especiales requieren comillas).
- Detectar contradicciones o páginas huérfanas.
- Limpiar y consolidar etiquetas.
- Generar reportes de *linting*.

**Análisis cruzado:**

- Evaluar si un artículo mejora un resumen existente.
- Identificar patrones transversales entre plataformas.
- Sugerir nuevos análisis comparativos.

Todo está documentado en `CLAUDE.md`, un archivo de configuración que vive en el propio repositorio. Esto hace que el proceso sea reproducible: cualquier conversación nueva con Claude empieza con el mismo contexto y las mismas reglas.

## Lo que se aprende por el camino

Construir esto no ha sido un proceso lineal. Ha habido decisiones acertadas y otras que ha habido que rehacer. Estos son los aprendizajes que probablemente sean más útiles para quien quiera construir algo similar:

- **Etiquetas específicas frente a generales.** Al principio se etiquetaba todo con detalle (`headscale`, `dnsmasq`, `caching`, `tailscale`...). Resultado: más de 140 etiquetas huérfanas que nadie buscaría jamás. La regla evolucionó hacia un criterio claro: *una etiqueta debe tener al menos 3 ocurrencias o convertirse en candidata a consolidación*. Hoy hay unas 30 etiquetas útiles en español, no 140 ruidosas.
- **El nombre del fichero debe coincidir con el H1.** Claude creaba archivos cuyo nombre no reflejaba el título real del documento. Hubo que añadir una norma explícita en `CLAUDE.md`: el campo `title` del *frontmatter* debe coincidir con el H1, y el nombre del fichero debe ser una versión razonable en *kebab-case* de ese título. Es un detalle pequeño con un impacto grande en la navegación.
- **Cuándo no confiar en Claude.** En ocasiones inventaba enlaces a archivos que no existían (las clásicas alucinaciones). Hay que verificar siempre antes de aceptar enlaces generados. Por eso `CLAUDE.md` incluye la regla de que todos los enlaces `[[archivo|Texto]]` deben apuntar a archivos existentes, y el *lint* mensual lo comprueba automáticamente.
- **La memoria persistente es clave.** Cada conversación nueva empezaba reaprendiendo las normas. Configurar memoria persistente (mediante un sistema `MEMORY.md` que Claude lee al inicio de cada sesión) ha evitado que las reglas evolucionadas se pierdan entre sesiones. Sin esto, cada nueva conversación sería empezar desde cero.
- **La división núcleo/satélites ha cambiado tres veces.** Empezó solo con resúmenes y conceptos. Después aparecieron los artículos (entradas de blog que enriquecen los cursos). Finalmente se añadieron los análisis (síntesis propias). La arquitectura de carpetas refleja esa evolución, y eso es positivo: el sistema permite refactorizar sin romper enlaces.
- **La limpieza periódica es obligatoria.** Por mucho que se afinen las reglas, siempre puede haber alguna inconsistencia. Una vez al mes se ejecuta un proceso de *lint* en el que Claude revisa todo el vault: enlaces rotos, archivos huérfanos, etiquetas poco usadas y contradicciones entre documentos. La última limpieza encontró 2 archivos duplicados, 6 con título incorrecto y 2 sin *frontmatter* completo. Sin este proceso, la wiki se degradaría sola.

## El resultado

Para mí: una herramienta de consulta rápida cuando preparo clases, con conexiones que no veía cuando los cursos vivían en silos. Cuando un alumno pregunta "¿esto cómo se hace en OpenShift comparado con Kubernetes?", tengo el grafo delante.

Para el lector: un caso de uso real de IA aplicada a un flujo profesional, con todo el código abierto. Si quieres construir tu propio segundo cerebro técnico, este repositorio te ahorra buena parte del proceso de prueba y error. Las decisiones difíciles (qué meter en el núcleo, cómo estructurar las etiquetas, cuándo confiar en la IA) ya están tomadas y documentadas.

Lo que **no es**: un sustituto del blog. El blog sigue siendo la fuente original de cada contenido. La wiki es la reorganización para uso propio y para quien quiera replicar el patrón.

## ¿Merece la pena hacer esto?

La respuesta depende del objetivo:

- Si lo que se busca es **una wiki técnica al uso**: probablemente Notion, Confluence o incluso una buena estructura de Markdown en GitHub den más resultados con menos trabajo.
- Si lo que se busca es **aprender a colaborar con IA en flujos reales**: este es uno de los mejores ejercicios posibles. Se diseñan reglas, se prueban, se refinan y se observa dónde falla la IA y por qué.
- Si se es **docente y se quiere mostrar IA aplicada al alumnado**: aquí hay un caso completo para enseñar, desde el diseño arquitectónico hasta el debugging de comportamientos no deseados de la IA.

El verdadero resultado no es la wiki en sí. Es la habilidad que se desarrolla diseñando sistemas que persisten conocimiento, detectando errores de la IA antes de que se propaguen y construyendo flujos de trabajo en los que la IA hace el trabajo repetitivo mientras la persona toma las decisiones importantes.

Eso, hoy, vale más que cualquier wiki.

## Próximos pasos

Este proyecto seguirá evolucionando, pero ya no es un destino sino un laboratorio. Los principios que se han aprendido construyéndolo (memoria persistente, normas evolutivas, *lint* sistemático, división núcleo/satélites) los estoy aplicando ya a otros flujos profesionales: documentación interna de proyectos, preparación de unidades didácticas e investigación técnica.

Para explorar el resultado, replicar el patrón o ver cómo está estructurado el código:

- **Wiki publicada:** [wiki.josedomingo.org](https://wiki.josedomingo.org)
- **Código fuente:** [github.com/josedom24/segundo-cerebro](https://github.com/josedom24/segundo-cerebro)
- **Archivo clave:** [`CLAUDE.md`](https://github.com/josedom24/segundo-cerebro/blob/main/CLAUDE.md), donde están todas las reglas que han ido evolucionando durante el proceso.

Si lo adaptas a tu caso, me encantaría conocer qué decisiones cambiaste y por qué.
