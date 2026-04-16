# Reglas para el Segundo Cerebro

Este archivo configura cómo Claude mantiene y evoluciona tu wiki.

## 📁 Estructura del Vault

```
wiki/
├── index.md              # Catálogo de todas las páginas
├── log.md                # Historial de operaciones (append-only)
├── summaries/            # Un resumen por fuente importante
├── concepts/             # Conceptos clave
├── entities/             # Personas, empresas, proyectos
└── analyses/             # Síntesis propias, comparaciones
```

## 🔄 Workflow: Ingestar una Fuente

Cuando se añade algo a `raw-sources/`:

1. **Lee** el archivo completo
2. **Extrae** 3-5 puntos clave
3. **Escribe** un resumen en `wiki/summaries/[nombre-fuente].md`
4. **Actualiza** `wiki/index.md` con un link de una línea
5. **Actualiza** páginas conceptuales relacionadas en `wiki/concepts/`
6. **Anota** en `wiki/log.md` qué archivos tocaste y por qué
7. **Muestra** al usuario: "He modificado X archivos: [lista]"

### Formato de la anotación en log.md:
```markdown
## [2026-04-15] ingest | Nombre de la Fuente

- ✏️ wiki/summaries/fuente-nombre.md (creado)
- ✏️ wiki/concepts/concepto-relacionado.md (actualizado)
- ✏️ wiki/index.md (link añadido)

**Ideas clave:** [3-5 bullets]
```

## 🔍 Workflow: Responder una Pregunta

1. **Lee** `wiki/index.md` para encontrar páginas relevantes
2. **Lee** esas páginas específicas
3. **Sintetiza** una respuesta basada en lo que encontraste
4. **Guarda** la respuesta como nueva página en `wiki/analyses/` si es valiosa
5. **Actualiza** `wiki/index.md` con el nuevo análisis
6. **Anota** en `wiki/log.md`

## 🧹 Workflow: Limpieza (1x por semana)

Lee TODA la carpeta `wiki/` y busca:

- ❌ **Contradicciones**: Ideas opuestas en páginas diferentes
- ❌ **Huérfanas**: Páginas sin enlaces entrada (sin backlinks)
- ❌ **Conceptos sin página**: Mencionados repetidamente pero sin archivo
- ❌ **Obsoleto**: Información contradecida por fuentes más nuevas

Escribe un reporte en `wiki/lint-report.md` con fixes específicas.

## ✍️ Reglas de Formato

### Todos los archivos de wiki tienen frontmatter:
```yaml
---
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [artículo-1, artículo-2]
tags: [tag1, tag2]
---
```

### Convención de Nombres para Archivos

**Para archivos de resúmenes de fuentes (cursos, artículos):**
- Formato: `nombre-descriptivo.md` (todo minúsculas, guiones)
- Ejemplos: `introduccion-docker.md`, `docker-run-y-ciclo-vida.md`, `pods-contenedores.md`
- **NO usar** prefijos numéricos (01-, 02-, etc.)
- El **orden** viene determinado por `wiki/index.md`, no por el nombre del archivo
- Esto permite que los nombres sean legibles y que las renamings de archivos no rompan referencias

### Enlaces internos:
- Usa `[[Nombre del Concepto]]` para links
- O `[[nombre-del-archivo|Texto Mostrado]]` para referencias a otros módulos del wiki
- Crea la página si no existe

### Estructura de un archivo:
```markdown
---
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: []
tags: []
---

# Título

## Resumen de una línea
[Qué es esto en una frase]

## Definición
[Explicación clara]

## Ideas clave
- Idea 1
- Idea 2
- Idea 3

## Relaciones
- Conecta con: [[Concepto A]], [[Concepto B]]
- Contrasta con: [[Concepto C]]

## Fuentes
- [Fuente 1](../summaries/fuente-1.md)
```

## 📋 index.md: Tu Tabla de Contenidos Viva

Estructura:
```markdown
# Índice del Vault

**Última actualización:** YYYY-MM-DD
**Total de páginas:** X

## Conceptos
- [[Concepto 1]] — descripción de una línea
- [[Concepto 2]] — descripción de una línea

## Entidades
- [[Persona/Empresa 1]] — descripción
- [[Persona/Empresa 2]] — descripción

## Análisis
- [[Análisis 1]] — descripción
- [[Análisis 2]] — descripción

## Resúmenes de Fuentes
- [[Fuente 1]] — descripción
- [[Fuente 2]] — descripción
```

## 📝 log.md: Tu "Git Log" Viva

Formato de entrada:
```
## [YYYY-MM-DD] [operación] | Detalles

Descripción de qué pasó
```

Operaciones permitidas:
- `ingest` — Se añadió una nueva fuente
- `query` — Se respondió una pregunta y se guardó
- `lint` — Se hizo limpieza del vault
- `update` — Se actualizaron páginas existentes

## 🎯 Principios

1. **Tú curadas fuentes, Claude organiza**
   - Tú decides qué lees/qué entra
   - Claude mantiene las referencias cruzadas

2. **El wiki crece de forma acumulativa**
   - Cada fuente toca 10-15 páginas
   - Las conexiones se fortalecen con el tiempo

3. **Las buenas preguntas → nuevas páginas**
   - Si la respuesta tiene valor, guardala
   - No desaparece en el chat

4. **Mantenimiento automático**
   - Una vez por semana: lint report
   - Claude hace todo el trabajo de bookkeeping

## 🚀 Comandos Rápidos

### Ingestar una fuente:
```bash
claude -p "He añadido /raw-sources/[archivo]. Lee, extrae ideas, 
resume en wiki/summaries/, actualiza index.md y conceptos relacionados.
Muéstrame todos los archivos que tocaste."
```

### Consultar el wiki:
```bash
claude -p "[Tu pregunta]. Lee index.md, encuentra páginas relevantes,
sintetiza una respuesta. Si vale la pena, guarda como nueva página
en wiki/analyses/. Actualiza index.md y log.md."
```

### Limpiar (1x por semana):
```bash
claude -p "Lee todo wiki/. Busca contradicciones, huérfanas, 
conceptos sin página, información obsoleta. 
Escribe lint-report.md con fixes."
```

---

## 📌 Decisiones de Diseño (Actualizables)

### Estrategia de Conceptos (2026-04-15)

**Decisión actual:** Conceptos = nivel alto (herramientas/plataformas principales)

```
KVM, Docker, Kubernetes, Podman, Helm, etc.
(~9-15 conceptos máximo)
```

**Razón:** Vault enfocado actualmente en cursos completos. Los módulos **son** los conceptos detallados.

**¿Por qué es flexible?** Cuando el vault crezca con más fuentes (artículos, investigaciones, análisis), podemos evolucionar a:
- Conceptos granulares (Deployments, Pods, Services, Quadlet, etc.)
- Conceptos temáticos (Cloud-Native, IaC, DevOps)
- Multi-nivel (alta nivel + detallados)

**Para cambiar en futuro:** Revisar `wiki/concepts/` y expandir según necesidad. El log.md y esta nota orientarán la evolución.

---

**Creado:** 2026-04-15
**Versión:** 1.0
**Última actualización:** 2026-04-15
