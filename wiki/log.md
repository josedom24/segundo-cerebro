## [2026-04-17] update | Carpeta analyses con index en español

Se creó archivo `wiki/analyses/index.md` con título "# Análisis y Síntesis" para que aparezca en español en el explorador de Obsidian, manteniendo el nombre técnico `analyses/` en la carpeta.

**Cambios:**
- ✏️ wiki/analyses/index.md (creado con título en español)

---

## [2026-04-17] fix | Estandarización de secciones Relaciones

Se estandarizaron **31 archivos** al formato mayoritario: `## Relaciones` → `### Conecta con`

**Cambio realizado:**
```
Antes: ## Relaciones
       - **Categoría:** item

Después: ## Relaciones
         
         ### Conecta con
         - **Categoría:** item
```

**Resultado:** ✅ 100% de archivos (111/111) con formato estandarizado

---

## [2026-04-17] fix | Estandarización de enlaces a cursos en Fuentes

Se estandarizaron **53 archivos** con enlaces a cursos en secciones Fuentes.

**Cambios realizados:**

1. **Agregar "Curso: " al inicio (53 archivos)**
   - Antes: `[OpenShift v4 PaaS (Módulo 1)](url)`
   - Después: `[Curso: OpenShift v4 PaaS](url)`

2. **Remover referencias a módulos específicos (19 archivos)**
   - Antes: `[Curso: Texto (Módulo X)](url)`
   - Después: `[Curso: Texto](url)`

3. **URLs ya ajustadas a nivel de curso** (paso anterior)

**Resultado:** ✅ Todos los enlaces de cursos estandarizados con prefijo "Curso: "

---

## [2026-04-17] fix | URLs de cursos: módulo → nivel de curso

Se corrigieron **27 archivos** que tenían enlaces rotos a módulos específicos.

**Cambio realizado:**
```
Antes: https://plataforma.josedomingo.org/pledin/cursos/[curso]/modulo[X]
Ahora: https://plataforma.josedomingo.org/pledin/cursos/[curso]/
```

**Cursos corregidos:**
- osv4_paas (10 archivos)
- osv4_k8s (3 archivos)
- docker2024 (10 archivos)
- apache24 (4 archivos)

**Resultado:** ✅ 0 enlaces rotos a /modulo[X] restantes

---

## [2026-04-17] fix | Coherencia de tags: conceptos y resúmenes

**Problema:** Incoherencia de tags - conceptos no tenían su propio tag, resúmenes sin tags de plataforma.

**Correcciones implementadas:**

**Conceptos (14 arreglados):**
- ✏️ Agregado tag propio a cada concepto:
  - build, deploymentconfig, helm, job, kvm, openshift, paas, pod, route, service, snapshot, statefulset, template, volume

**Resúmenes (1 arreglado):**
- ✏️ helm-empaquetado.md: Agregado tag `helm`

**Resultado:**
- ✅ 100% de conceptos tienen su propio tag
- ✅ Resúmenes tienen tags de plataforma (docker, kvm, kubernetes, openshift, podman, apache, openstack, proxmox, helm)
- ⚠️ Nota: 45 "subtemas" no tienen tags independientes (estrategia correcta - solo ~30 tags consolidados)

---

## [2026-04-17] fix | Reparación de secciones "Fuentes" con enlaces

Se arreglaron **9 archivos** que no cumplían la norma: secciones "Fuentes" sin enlaces.

**Archivos reparados:**
- ✏️ concepts/kvm.md (sin sección → Agregada con enlaces)
- ✏️ analyses/utilidad-pods-podman.md (enlaces añadidos)
- ✏️ concepts/build.md (enlaces añadidos)
- ✏️ concepts/deploymentconfig.md (enlaces añadidos)
- ✏️ concepts/imagestream.md (enlaces añadidos)
- ✏️ concepts/openshift.md (enlaces añadidos)
- ✏️ concepts/paas.md (enlaces añadidos)
- ✏️ concepts/route.md (enlaces añadidos)
- ✏️ concepts/template.md (enlaces añadidos)

**Resultado:**
- ✅ 110/110 archivos con sección "Fuentes" y enlaces (100% cumplimiento)
- ⚠️ Excepción: log.md (archivo histórico, no requiere)

---

## [2026-04-17] lint | Estandarización de secciones "Conecta con..." y formato de enlaces

**Fase 1: Auditoría**
Se revisaron 114 archivos markdown encontrando:
- ✅ 109 con sección "Relaciones/Conecta con"
- ⚠️ 144 enlaces incompletos sin pipe `|`
- ❌ 1 archivo con formato no estandarizado

**Fase 2: Correcciones implementadas**

1️⃣ **Estandarización de `concepts/openshift.md`**
   - Cambio: "Conceptos Relacionados" → "## Relaciones" → "### Conecta con"
   - Actualización de enlaces: 7 con pipe añadido

2️⃣ **Batch-fix de 144 enlaces incompletos en 60 archivos**
   - Primera pasada: 73 enlaces (conceptos principales)
   - Pasada global: 144 enlaces totales
   - Archivos afectados:
     * Conceptos: 18 archivos (33 enlaces)
     * Resúmenes: 41 archivos (110 enlaces)
     * Análisis: 1 archivo (1 enlace)
     * Log: 2 archivos (6 enlaces)

**Ejemplos de reemplazos:**
```
[[docker]] → [[docker|Docker]]
[[kubernetes]] → [[kubernetes|Kubernetes]]
[[docker-compose]] → [[docker-compose|Docker Compose]]
[[introduccion-podman]] → [[introduccion-podman|Introducción a Podman]]
```

**Resultado final:**
✅ 100% de enlaces en formato `[[archivo|Texto]]`
✅ Todos archivos con sección estandarizada
✅ 0 enlaces rotos (archivos inexistentes)

**Archivos modificados:**
- ✏️ concepts/openshift.md (estandarización sección)
- ✏️ 59 archivos más (batch-fix enlaces)

**Ideas clave:**
- Formato consistente: `[[archivo-minusculas|Título Mostrado]]`
- Todos los enlaces apuntan a archivos existentes
- Secciones "Relaciones" unificadas en todo el vault

---

## [2026-04-17] query | ¿Qué utilidad tiene la ejecución de pods en podman?

Se respondió pregunta sobre utilidad de pods en Podman mediante síntesis de:
- `wiki/summaries/pods-podman.md` — Gestión y operaciones
- `wiki/summaries/introduccion-podman.md` — Contexto arquitectura Podman
- `wiki/concepts/pod.md` — Definición conceptual

Se creó análisis con 3 utilidades principales:
1. Orquestación local multicontenedor (IP/almacenamiento/ciclo de vida compartido)
2. Generación automática de YAML Kubernetes (diferenciador único)
3. Alternativa nativa a Docker Swarm

**Cambios:**
- ✏️ wiki/analyses/utilidad-pods-podman.md (creado)
- ✏️ wiki/index.md (añadida sección "📊 Análisis y Síntesis")

**Ideas clave:**
- Pods permiten simular multicontenedor localmente sin docker-compose
- `podman generate kube` exporta a YAML K8s directamente
- Más simple que Docker Swarm, alineado con ecosistema Kubernetes

---

**Conceptos (9 archivos):** Removidos enlaces rotos, normalizados a minúsculas
- ✏️ contenedores.md
- ✏️ docker.md
- ✏️ [[dockerfile-y-construccion|dockerfile-y-construccion.md]]
- ✏️ docker-compose.md
- ✏️ kubernetes.md
- ✏️ podman.md
- ✏️ kvm.md
- ✏️ proxmox.md
- ✏️ helm.md

**Summaries (14 archivos):** Agregadas referencias a conceptos, normalizados nombres
- ✏️ introduccion-kubernetes.md (agregada [[kubernetes|Kubernetes]])
- ✏️ introduccion-podman.md (agregada [[podman|Podman]])
- ✏️ introduccion-kvm.md (agregada [[kvm|KVM]])
- ✏️ introduccion-proxmox.md (agregada [[proxmox|Proxmox]])
- ✏️ dockerfile-y-construccion.md (agregada [[dockerfile-y-construccion|dockerfile]])
- ✏️ docker-compose.md (agregada [[docker-compose|Docker Compose]])
- ✏️ helm-empaquetado.md (agregada [[helm|Helm]])
- ✏️ 7 archivos más con reemplazos masivos

**Log & Index:**
- ✏️ wiki/log.md (esta entrada)

### Cambios principales (Fase 1-3)

**Fase 1: Normalización de enlaces (45 min)**
- Removidos/reemplazados 8 tipos de enlaces con espacios
- Corregidos 2 enlaces con mayúsculas incorrectas
- Normalizados 8 nombres de conceptos a minúsculas

**Fase 2: Conectar conceptos aislados (1 hora)**
- Agregadas referencias a [[kubernetes|Kubernetes]], [[podman|Podman]], [[kvm|KVM]], [[proxmox|Proxmox]], [[helm|Helm]], [[dockerfile-y-construccion|dockerfile]], [[docker-compose|Docker Compose]]
- Resultado: 0 conceptos aislados (antes 5)

**Fase 3: Limpeza y validación (30 min)**
- Actualizados 9 archivos de conceptos
- Actualizados 14 archivos de summaries
- Validación final: todos los 9 conceptos tienen referencias

### Métricas POST-REPARACIÓN

```
Conceptos y referencias entrantes:
  ✅ kubernetes: 4 referencias
  ✅ docker: 15 referencias
  ✅ kvm: 14 referencias
  ✅ contenedores: 9 referencias
  ✅ podman: 2 referencias
  ✅ proxmox: 2 referencias
  ✅ dockerfile-y-construccion: 2 referencias
  🟡 helm: 1 referencia
  🟡 docker-compose: 1 referencia

Mejoras:
  ✅ Conceptos aislados: 5 → 0 (-100%)
  ✅ Enlaces con espacios/mayúsculas: 40+ → ~18 (-55%)
  ✅ Referencia media por concepto: 2.5 → 5.4 (+116%)
```

### Recomendaciones futuro

1. **Mantener:** Strict naming convention (minúsculas-con-guiones)
2. **CI/CD:** Agregar validación de links en commits
3. **Mejora:** Expand referencias a helm y docker-compose
4. **Auditoría:** Trimestral (próxima: 2026-07-16)

---

## [2026-04-15] ingest | Curso Proxmox VE (8 módulos)

### Fuente procesada
- ✨ Curso Proxmox VE - 8 Módulos (GitHub: iesgn/curso_proxmox_cep)

### Archivos creados/actualizados

**Resúmenes (wiki/summaries/):** 8 archivos
- ✏️ introduccion-proxmox.md (creado) — Virtualización, hipervisores (KVM, LXC), arquitectura Proxmox
- ✏️ instalacion-proxmox.md (creado) — Escenarios, requisitos, instalación, GUI, cluster, storage/red
- ✏️ creacion-maquinas-virtuales-proxmox.md (creado) — ISO, VirtIO, VM Linux/Windows, Qemu-agent, SSH/RDP
- ✏️ almacenamiento-proxmox.md (creado) — Storage types, Directory, LVM thin, discos, resize/move, snapshots
- ✏️ clonacion-snapshots-backups-proxmox.md (creado) — Full/linked clone, plantillas, snapshots, backups 3 modos
- ✏️ linux-containers-lxc-proxmox.md (creado) — LXC vs VMs, plantillas, contenedores, mount points
- ✏️ redes-proxmox.md (creado) — Linux Bridge, vmbr0, redes internas, firewall 3 niveles
- ✏️ usuarios-permisos-proxmox.md (creado) — Autenticación, usuarios/grupos, roles, privilegios, pools RBAC

**Conceptos (wiki/concepts/):** 1 archivo
- ✏️ proxmox.md (creado) — Plataforma virtualización: KVM + LXC, gestión centralizada, casos uso

**Índice & Log:**
- ✏️ wiki/index.md (actualizado) — Cursos 5→6, páginas 58→66, nuevas 8 referencias Proxmox
- ✏️ wiki/log.md (esta entrada)

### Conceptos clave identificados

**Virtualización Dual:**
- KVM: VMs completas (SO completo, mayor aislamiento, más overhead)
- LXC: Contenedores ligeros (kernel compartido, bajo overhead, solo Linux)

**Almacenamiento:**
- Tipos: Filesystem (Directory) vs Block Device (LVM, iSCSI)
- Thin provisioning: Ocupan según uso real
- Snapshots: Captura estado para rollback
- Backups 3 modos: stop (consistencia), suspend (término medio), snapshot (mínimo downtime)

**Redes:**
- Linux Bridge: vmbr0 por defecto (pública), vmbr1+ (internas)
- Aislamiento: VMs conectadas a bridges públicos/privados
- Firewall: 3 niveles (Datacenter, Nodo, VM/CT) con políticas input/output

**Control de Acceso (RBAC):**
- Realms: Linux PAM, Proxmox VE, LDAP, AD
- Roles: Conjuntos de privilegios predefinidos
- Pools: Agrupación de recursos para permisos
- Limitación actual: Bridges sin control de permisos

### Relaciones identificadas
- Proxmox ← combina → KVM (VMs) + LXC (contenedores)
- Storage thin ← ahorro → Múltiples VMs en menos espacio
- Snapshots + Backups ← recuperación → Baja downtime
- Pools ← aislamiento educativo → Laboratorios por estudiante
- Linux Bridge ← limitación → Sin RBAC en redes (futuro)

---

## [2026-04-15] init | Estructura creada

- ✨ Vault inicializado
- 📁 Carpetas creadas
- 📝 Memory.md, CLAUDE.md configurados

---
---
## [2026-04-16] rollback | Reversión al commit bcfe4ae9

Se ha revertido el vault al estado del commit bcfe4ae9 para simplificar la estructura del índice y eliminar la ingesta de Apache 2.4 y las páginas maestras de cursos.

