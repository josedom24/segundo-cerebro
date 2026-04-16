---
created: 2026-04-15
updated: 2026-04-15
---

# Log del Vault

Historial append-only de todas las operaciones en el vault.

---

## [2026-04-16] ingest | OpenShift v4 - Dos Cursos Completos (19 módulos + 5 conceptos)

**Fuentes:**
1. Curso 1: https://github.com/josedom24/curso_openshift_v4/curso1 — Introducción K8s/OpenShift
2. Curso 2: https://plataforma.josedomingo.org/pledin/cursos/osv4_paas/ — OpenShift como PaaS

**Módulos ingestionados:**

**Curso 1 (K8s & OpenShift) - 9 módulos:**
1. Introducción a OpenShift (Distribución K8s, Developer Sandbox)
2. Developer Sandbox (Entorno cloud gratuito)
3. Code Ready Containers (Instalación local, CRC)
4. Recursos Kubernetes 1 (Pods, ReplicaSets, Deployments)
5. Recursos Kubernetes 2 (Services, Routes, acceso)
6. Configuración (ConfigMaps, Secrets, parametrización)
7. Almacenamiento (Volumes, PersistentVolumes, PVC)
8. Recursos Avanzados (StatefulSet, DaemonSet, Jobs, HPA)
9. Aplicación Ejemplo (Citas microservices, multi-componente)

**Curso 2 (OpenShift PaaS) - 10 módulos:**
1. OpenShift como Plataforma (PaaS, abstracciones, flujos)
2. Métodos de Despliegue (Image, S2I, Dockerfile, Templates)
3. ImageStream y Gestión (Abstracción imágenes, triggers)
4. BuildConfig y CI/CD (Construcción automatizada, webhooks)
5. ImagePull y Registros (ImagePullSecrets, privados)
6. DeployConfig y Rolling Updates (Despliegues avanzados, hooks)
7. Services y Routes (Exposición, TLS, balanceo)
8. Extensiones (Operadores, Knative, Tekton)
9. Monitorización (Prometheus, Grafana, alertas)
10. Seguridad (RBAC, Network Policies, Secrets, SecurityContext)

**Archivos creados:**

**Conceptos (5 nuevos):**
- ✏️ wiki/concepts/openshift.md — Distribución K8s empresarial, PaaS, abstracciones
- ✏️ wiki/concepts/imagestream.md — Abstracción OpenShift: referencias, triggers, gestión
- ✏️ wiki/concepts/build.md — BuildConfig: CI/CD nativo, S2I, Docker build
- ✏️ wiki/concepts/route.md — Exposición servicios: TLS, routing, alternativa Ingress
- ✏️ wiki/concepts/template.md — Plantillas parametrizadas: aplicaciones, variables

**Resúmenes Curso 1 (9 archivos):**
- ✏️ osv4_k8s_modulo1.md — Introducción a OpenShift
- ✏️ osv4_k8s_modulo2.md — Developer Sandbox
- ✏️ osv4_k8s_modulo3.md — Code Ready Containers
- ✏️ osv4_k8s_modulo4.md — Pods, ReplicaSets, Deployments
- ✏️ osv4_k8s_modulo5.md — Services, Routes
- ✏️ osv4_k8s_modulo6.md — ConfigMaps, Secrets
- ✏️ osv4_k8s_modulo7.md — Almacenamiento
- ✏️ osv4_k8s_modulo8.md — Recursos avanzados
- ✏️ osv4_k8s_modulo9.md — Aplicación ejemplo

**Resúmenes Curso 2 (10 archivos):**
- ✏️ osv4_paas_modulo1.md — OpenShift como PaaS
- ✏️ osv4_paas_modulo2.md — Métodos de despliegue
- ✏️ osv4_paas_modulo3.md — ImageStream
- ✏️ osv4_paas_modulo4.md — BuildConfig
- ✏️ osv4_paas_modulo5.md — ImagePull registros
- ✏️ osv4_paas_modulo6.md — DeployConfig rolling updates
- ✏️ osv4_paas_modulo7.md — Services y Routes
- ✏️ osv4_paas_modulo8.md — Operadores, Knative, Tekton
- ✏️ osv4_paas_modulo9.md — Monitorización Prometheus
- ✏️ osv4_paas_modulo10.md — Seguridad RBAC/Policies

**Actualización índice y conceptos:**
- ✏️ wiki/index.md — Actualizado: 20→110 páginas, 7→9 cursos, 15→20 conceptos, nuevas 5 secciones OpenShift
- ✏️ wiki/concepts/kubernetes.md — Agregada relación con [[OpenShift]]
- ✏️ wiki/concepts/contenedores.md — Agregada relación con [[OpenShift]]

**Git history:**
- ✏️ Commit 1: 5 conceptos OpenShift (9873f62)
- ✏️ Commit 2: 9 módulos Curso 1 (8aaabf8)
- ✏️ Commit 3: 10 módulos Curso 2 (6a46aa5)

### Conceptos clave identificados

**OpenShift vs Kubernetes puro:**
- **Kubernetes:** Orquestador cloud-native
- **OpenShift:** Kubernetes + PaaS (ImageStream, BuildConfig, Route, DeployConfig, Template)
- **Distinción:** Curso 1 = K8s fundamentals; Curso 2 = Abstracciones PaaS OpenShift

**Abstracciones OpenShift (nuevas respecto K8s):**
- **ImageStream:** Referencia automática a imágenes, triggers en cambios
- **BuildConfig:** CI/CD integrado (S2I, Docker build, webhooks)
- **Route:** Exposición simplificada vs Kubernetes Ingress
- **DeployConfig:** Ciclo de vida con hooks pre/post deploy (vs Deployment básico)
- **Template:** Parametrización de objetos para aplicaciones complejas

**Estrategia de ingesta:**
- Conceptos = Abstracciones OpenShift reutilizables (ImageStream, Build, Route, Template)
- Summaries = Módulos de cursos específicos (Curso 1 enfocado K8s, Curso 2 enfocado PaaS)

### Relaciones identificadas
- OpenShift ← basado en → Kubernetes
- ImageStream ← trigger automático → BuildConfig
- BuildConfig ← CI/CD nativo → DeployConfig
- Route ← exposición → Services (subyacente)
- Template ← parametrización → Aplicaciones complejas

### Total de contenido
- Conceptos nuevos: 5
- Resúmenes nuevos: 19 (9 + 10)
- Relaciones actualizadas: 2 conceptos existentes
- Total vault: 110 páginas, 9 cursos, 20 conceptos, 69 módulos

---

## [2026-04-16] ingest | OpenStack - Cloud Computing IaaS (5 módulos)

**Fuente:** https://github.com/josedom24/curso_openstack_ies

**Módulos ingestionados:**
1. Introducción (Horizon UI + OpenStack Client CLI)
2. Glance (Gestión de imágenes)
3. Nova (Gestión de instancias/VMs)
4. Cinder (Almacenamiento en bloques)
5. Neutron (Redes virtuales y SDN)

**Archivos creados:**
- ✏️ wiki/summaries/introduccion-openstack.md — Plataforma cloud IaaS, autenticación, configuración inicial
- ✏️ wiki/summaries/glance-imagenes-openstack.md — Catálogo de imágenes, formatos, snapshots
- ✏️ wiki/summaries/nova-instancias-openstack.md — Ciclo de vida VMs, sabores, snapshots, cloud-init
- ✏️ wiki/summaries/cinder-almacenamiento-openstack.md — Volúmenes persistentes, tipos storage, snapshots
- ✏️ wiki/summaries/neutron-redes-openstack.md — Redes, routers, Floating IPs, grupos de seguridad
- ✏️ wiki/concepts/openstack.md — Concepto principal (nuevo)
- ✏️ wiki/index.md — Nuevo curso, actualizado contador (66→76 págs, 6→7 cursos)

**Ideas clave:**
- OpenStack = IaaS completo: compute (Nova) + storage (Cinder) + networking (Neutron) + images (Glance)
- Interfaz dual: Horizon web + OpenStack Client CLI (OSC)
- Arquitectura modular: usar solo componentes necesarios
- Concepto central: instancia = VM creada de imagen + flavor (recursos)
- Networking Virtual: redes privadas, routers, Floating IPs, cortafuegos (security groups)
- Persistencia: volúmenes Cinder separados de instancia (no se pierden al eliminar)
- IaaS vs Kubernetes: OpenStack = infraestructura; K8s = aplicaciones

---

## [2026-04-16] cleanup | Eliminación de referencias rotas y normalización completa

**Análisis completado:**
- Escaneados 121 enlaces únicos en wiki/
- Identificados 13 enlaces a conceptos inexistentes (out-of-scope) → Removidos
- Identificadas 4 referencias indirectas a archivos con prefijos numéricos → Reemplazadas
- Identificadas 8 referencias a `raw-sources/11-docker-*.md` → Removidas (contenido ya sintetizado)

**Archivos modificados (enlaces rotos a conceptos):**
- ✏️ wiki/summaries/consola-serie-kvm.md — Removido [[Administración Remota]]
- ✏️ wiki/concepts/contenedores.md — Removidos [[Arquitectura de Microservicios]], [[DevOps Moderno]], [[Instalaciones-directas]]
- ✏️ wiki/concepts/docker.md — Removido [[Instalaciones directas en máquina]]
- ✏️ wiki/summaries/docker-desktop.md — Removido [[Docker Tooling]], referencia a raw-sources
- ✏️ wiki/summaries/imagenes-y-docker-hub.md — Removidos [[Image Management]], [[Storage]], referencia a raw-sources
- ✏️ wiki/summaries/configmaps-y-secrets.md — Removido [[Kubernetes Configuration]]
- ✏️ wiki/summaries/services-acceso.md — Removido [[Kubernetes Networking]]
- ✏️ wiki/summaries/instalacion-kubernetes.md — Removido [[Kubernetes Setup]]
- ✏️ wiki/summaries/redes-docker.md — Removidos [[Networking]] y link malformado, referencia a raw-sources
- ✏️ wiki/summaries/introduccion-docker.md — Removidos [[Virtualización]] y "Parte de" section, referencia a raw-sources
- ✏️ wiki/concepts/podman.md — Removido [[Vagrant]]
- ✏️ wiki/concepts/dockerfile.md — Removida referencia a raw-sources
- ✏️ wiki/concepts/docker-compose.md — Removida referencia a raw-sources
- ✏️ wiki/summaries/docker-run-y-ciclo-vida.md — Removida referencia a raw-sources
- ✏️ wiki/summaries/volumenes-bind-mounts.md — Removida referencia a raw-sources

**Correcciones adicionales:**
- ✏️ Normalizados 7 referencias a archivos Proxmox con mayúsculas inconsistentes
  - `[[Almacenamiento-proxmox]]` → `[[almacenamiento-proxmox]]`
  - `[[Clonacion-proxmox]]` → `[[clonacion-snapshots-backups-proxmox]]` (nombre correcto)
  - `[[Instalacion-proxmox]]` → `[[instalacion-proxmox]]`
  - `[[Redes-proxmox]]` → `[[redes-proxmox]]`
  - `[[Creacion-maquinas-virtuales-proxmox]]` → `[[creacion-maquinas-virtuales-proxmox]]`
  - `[[Usuarios-permisos-proxmox]]` → `[[usuarios-permisos-proxmox]]`
  - `[[Linux-containers-lxc-proxmox]]` → `[[linux-containers-lxc-proxmox]]`

**Resultado:**
- ✅ Cero enlaces a conceptos no-existentes
- ✅ Cero referencias a Vagrant, libvirt, fuera-de-scope
- ✅ Cero referencias a raw-sources/
- ✅ Cero referencias a archivos con números (`11-docker-*`)
- ✅ Wiki coherente con 6 cursos + 9 conceptos + 50 módulos

---

## [2026-04-15] ingest | Artículos de www.josedomingo.org (8 fuentes)

### Fuentes procesadas
1. ✨ Migración de Pledin a Astro (2026-04-01)
2. ✨ Seguridad en VPN Headscale: ACLs y Tags (2026-03-17)
3. ✨ Configuración DNS y Routing en Headscale (2026-02-24)
4. ✨ Construcción de VPN mesh Tailscale/Headscale (2026-02-14)
5. ✨ Cursos de virtualización con KVM/libvirt (2025-12-27)
6. ✨ Cursos de Python PCEP y PCAP (2025-12-26)
7. ✨ Contenedores Docker para Jekyll (2025-10-01)
8. ✨ Creación de box para Vagrant (2025-09-20)

### Archivos creados/actualizados

**Resúmenes (wiki/summaries/):** 8 archivos
- ✏️ 00-curso-docker.md
- ✏️ 01-introduccion-docker.md
- ✏️ 02-docker-run-y-ciclo-vida.md
- ✏️ 03-imagenes-y-docker-hub.md
- ✏️ 04-volumenes-bind-mounts.md (próximo)
- ✏️ 05-redes-docker.md (próximo)
- ✏️ 06-docker-compose.md (próximo)
- ✏️ 07-dockerfile-y-construccion.md (próximo)

**Conceptos (wiki/concepts/):** 9 archivos
- ✏️ tailscale.md
- ✏️ headscale.md
- ✏️ kvm.md
- ✏️ docker.md
- ✏️ vagrant.md
- ✏️ astro.md
- ✏️ jekyll.md
- ✏️ python.md
- ✏️ static-site-generators.md

**Índice:**
- ✏️ index.md (actualizado: 17 páginas, 8 fuentes)

### Conceptos clave identificados
- **VPN & Redes:** Tailscale, Headscale, NAT Traversal, MagicDNS, ACLs, Tags
- **Virtualización:** KVM, libvirt, Vagrant, Box Distribution
- **Contenedores:** Docker, aislamiento de dependencias
- **Web:** Static Site Generators, Astro, Jekyll, migraciones
- **Educación:** Python (PCEP, PCAP), KVM, cursos

### Relaciones cruzadas detectadas
- Astro/Jekyll: Evolución en static site generators
- KVM/Vagrant: Virtualización + distribución reproducible
- Docker/Jekyll: Solución a conflictos de versiones
- Tailscale/Headscale: OSS vs SaaS en VPN mesh

---

## [2026-04-15] query | Análisis de patrones en infraestructura

**Pregunta:** ¿Cuáles son los patrones principales en infraestructura que aparecen en mi vault?

### Archivos creados
- ✏️ wiki/analyses/patrones-infraestructura.md (creado)

### Archivos actualizados
- ✏️ wiki/index.md (añadido análisis a lista)

### Síntesis identificada
- **4 patrones clave:** Reproducibilidad, Aislamiento, Automatización Progresiva, Descentralización
- **Filosofía común:** Sistemas reproducibles, seguros, descentralizados y educables
- **Hilo conductor:** Tu rol como profesor de administración de sistemas

### Relaciones descubiertas
- Vagrant + KVM: Distribución de laboratorios
- Docker + Jekyll: Evitar "works on my machine"
- Headscale (soberanía) + Vagrant/KVM: Stack independiente
- Astro migration: Evolución cuando escalan

**Implicación:** Los patrones sugieren dirección para futuros cursos y material educativo.

---

## [2026-04-15] ingest | Curso Docker 2024 - Índice (fase 1)

### Fuente procesada
- ✨ Curso Docker 2024 - Índice Completo (~/github/curso_docker_ow - 67 lecciones en 8 módulos)

### Archivos creados/actualizados

**Resúmenes (wiki/summaries/):** 1 archivo
- ✏️ 11-curso-docker-indice.md (creado)

**Conceptos (wiki/concepts/):** 3 nuevos + 1 actualizado
- ✏️ docker-compose.md (por crear en próxima fase)
- ✏️ dockerfile.md (por crear en próxima fase)
- ✏️ docker.md (actualizado: amplificado de 38 a 120+ líneas)

**Índice:**
- ✏️ index.md (actualizado: 20 páginas, 9 fuentes)

### Conceptos clave identificados
- **5 pilares:** Contenedores, Imágenes, Almacenamiento, Networking, Compose
- **Pedagogía:** De lo simple a lo complejo (Hola Mundo → Producción)
- **Reproducibilidad:** "Works on my machine" → "Works everywhere"
- **Casos reales:** WordPress, MediaWiki, Guestbook, Temperaturas

### Relaciones cruzadas detectadas
- Contenedores efímeros ↔ Almacenamiento (Volúmenes, Bind mounts)
- Imágenes (Dockerfile) ↔ Contenedores (docker run)
- Docker Compose ↔ Redes (networking)
- Orquestación simple ↔ Docker Compose

## [2026-04-15] refactor | Renombrar módulos a formato Obsidian-compatible

### Cambios realizados
- ✏️ Renombrar archivos de summaries:
  - `11-curso-docker-indice.md` → `00-curso-docker.md`
  - `11-docker-modulo1.md` → `01-introduccion-docker.md`
  - `11-docker-modulo2.md` → `02-docker-run-y-ciclo-vida.md`
  - `11-docker-modulo3.md` → `03-imagenes-y-docker-hub.md`

### Razón
Obsidian no permite caracteres especiales (como `:`) en nombres de archivo. Los nuevos nombres:
- ✅ Sin caracteres especiales
- ✅ Numerados secuencialmente (00, 01, 02, 03...)
- ✅ Descripción clara en el nombre
- ✅ Compatible con Obsidian

### Archivos afectados
- ✏️ wiki/index.md (actualizar enlaces)
- ✏️ wiki/summaries/ (4 archivos renombrados)
- ✏️ wiki/concepts/ (actualizar referencias si existen)

---

## [2026-04-15] ingest | Docker Compose

### Fuente procesada
- ✨ Módulo 6: Docker Compose (913 líneas)
  - Orquestación de múltiples contenedores
  - Fichero compose.yaml (servicios, volúmenes, redes)
  - Comando docker compose (up, ps, logs, exec, down)
  - Variables de entorno (.env)
  - Dependencias (depends_on)
  - Casos prácticos (WordPress, Node+MongoDB, multi-tier)
  - Restart policies, healthchecks

### Archivos creados/actualizados
**Resúmenes (wiki/summaries/):** 1 archivo
- ✏️ 06-docker-compose.md (creado: 420+ líneas)

**Índice & Log:**
- ✏️ index.md (actualizado: 30 páginas, 15 fuentes)
- ✏️ log.md (esta entrada)

### Conceptos clave
- **Declarativo:** Define estado deseado en YAML
- **Servicios:** Contenedores nombrados que se comunican
- **Redes:** Automáticas, DNS entre servicios (resuelven por nombre)
- **Volúmenes:** Declarados, referenciables por servicios
- **Variables:** .env para configuración externa
- **Dependencias:** depends_on para orden de inicio
- **Ciclo de vida:** up, ps, logs, exec, stop, down
- **Reproducibilidad:** Mismo compose.yaml = mismo resultado

### Relaciones identificadas
- Servicios ← nombrados → DNS automático
- Volúmenes ← declarados → Compartibles entre servicios
- Redes ← automáticas → Comunicación transparente
- Variables ← externas → Configuración flexible

---

## [2026-04-15] ingest | Redes en Docker

### Fuente procesada
- ✨ Módulo 5: Redes en Docker (699 líneas)
  - Red bridge por defecto (docker0, 172.17.0.0/16)
  - Mapeamiento de puertos (-p)
  - NAT: SNAT (salida) y DNAT (entrada)
  - Redes bridge user-defined
  - Resolución DNS (automática en user-defined)
  - Tipos de redes (bridge, host, none, overlay)

### Archivos creados/actualizados
**Resúmenes (wiki/summaries/):** 1 archivo
- ✏️ 05-redes-docker.md (creado: 350+ líneas)

**Índice & Log:**
- ✏️ index.md (actualizado: 29 páginas, 14 fuentes)
- ✏️ log.md (esta entrada)

### Conceptos clave
- **Bridge por defecto:** 172.17.0.0/16, sin DNS automático entre contenedores
- **User-defined:** DNS automático, mejor aislamiento, recomendado
- **NAT:** SNAT (contenedor→exterior), DNAT (host:puerto→contenedor)
- **Mapeamiento:** `-p HOST_PORT:CONTAINER_PORT`, puede ser por IP
- **Aislamiento:** Contenedores en misma red se comunican por nombre
- **DNS:** Automático en user-defined, manual o por IP en default
- **iptables:** Docker configura reglas automáticamente

### Relaciones identificadas
- Bridge default ← simple → Desarrollo
- User-defined ← recomendado → Producción multi-contenedor
- Mapeamiento puertos ← acceso exterior → DNAT
- DNS automático ← resolución nombres → Escalabilidad

---

## [2026-04-15] ingest | Almacenamiento

### Fuente procesada
- ✨ Módulo 4: Almacenamiento (480 líneas)
  - Volúmenes Docker (gestionados por Docker)
  - Bind mounts (directorio del host)
  - tmpfs mounts (almacenamiento en RAM)
  - Cuándo usar cada tipo
  - Sintaxis: -v vs --mount
  - Gestión de volúmenes

### Archivos creados/actualizados
**Resúmenes (wiki/summaries/):** 1 archivo
- ✏️ 04-volumenes-bind-mounts.md (creado: 320+ líneas)

**Índice & Log:**
- ✏️ index.md (actualizado: 28 páginas, 13 fuentes)
- ✏️ log.md (esta entrada)

### Conceptos clave
- **Efímeros:** Contenedores pierden datos sin almacenamiento
- **Volúmenes:** Docker gestiona en `/var/lib/docker/volumes/`
- **Bind mounts:** Host monta directorio/archivo en contenedor
- **tmpfs:** Almacenamiento temporal en RAM
- **Sintaxis:** `-v` (simple) vs `--mount` (explícito)
- **Persistencia:** Datos, logs, config
- **Propagación:** Archivos se copian/ocultan al montar

### Relaciones identificadas
- Contenedores ← efímeros → Necesitan almacenamiento
- Volúmenes ← compartibles → Múltiples contenedores
- Bind mounts ← desarrollo → Cambios código inmediatos
- tmpfs ← seguridad → No persisten datos sensibles

---

## [2026-04-15] ingest | Introducción a Docker

### Fuente procesada
- ✨ Módulo 1: Introducción a Docker (379 líneas)
  - Conceptos fundamentales sobre contenedores
  - Diferencias Docker vs máquinas virtuales
  - Instalación en Linux/Windows

### Archivos creados/actualizados

**Resúmenes (wiki/summaries/):** 1 archivo
- ✏️ 11-docker-modulo1.md (creado)

**Conceptos (wiki/concepts/):** 1 nuevo
- ✏️ contenedores.md (creado: 200+ líneas sobre virtualización a nivel SO)

**Índice & Log:**
- ✏️ index.md (actualizado: 25 páginas, 10 fuentes)
- ✏️ log.md (esta entrada)

### Conceptos clave del módulo
- **Virtualización ligera:** Kernel compartido vs propio (VMs)
- **Aislamiento:** A nivel de proceso (namespaces, cgroups)
- **Portabilidad:** "Works on my machine" → "Works everywhere"
- **Instalación:** Docker Engine (Linux) vs Docker Desktop (Windows/Mac + WSL2)
- **Limitaciones:** Single-host, necesita orquestación para clusters

### Relaciones identificadas
- Contenedores ← fundamenta → Docker
- Instalación diferente por plataforma (Linux nativa vs WSL2)
- Ventajas vs VMs: ligereza, portabilidad, reproducibilidad

---

## [2026-04-15] ingest | Módulo 2: Ejecución de Contenedores

### Fuente procesada
- ✨ Módulo 2: Ejecución de Contenedores (734 líneas)
  - Ejecución simple con docker run
  - Ciclo de vida de contenedores
  - Gestión (logs, events, inspect, top)
  - Ejecución de comandos dentro (docker exec)
  - Mapeamiento de puertos
  - Ejemplos: Apache, MariaDB

### Archivos creados/actualizados
**Resúmenes (wiki/summaries/):** 1 archivo
- ✏️ 11-docker-modulo2.md (creado: 250+ líneas)

**Índice & Log:**
- ✏️ index.md (actualizado: 26 páginas, 11 fuentes)
- ✏️ log.md (esta entrada)

### Conceptos clave
- **docker run:** Comando principal para ejecutar contenedores
- **Ciclo de vida:** created → running → stopped → deleted
- **Mapeamiento de puertos:** -p host:container (nunca acceso directo por IP)
- **docker exec:** Ejecutar comandos dentro de contenedores
- **Debugging:** logs -f, inspect, exec interactivo
- **Opciones:** -d (demonio), -it (interactivo), -e (variables), -v (volúmenes)

## [2026-04-15] ingest | Módulo 3: Gestión de Imágenes en Docker

### Fuente procesada
- ✨ Módulo 3: Gestión de Imágenes (407 líneas)
  - Almacenamiento de imágenes (capas, compartición)
  - Almacenamiento de contenedores (capa R/W efímera)
  - Docker Hub (registro público)
  - Tipos de imágenes (SO, servicios, lenguajes, CMS)
  - Gestión de imágenes (pull, ls, rmi, inspect)

### Archivos creados/actualizados
**Resúmenes (wiki/summaries/):** 1 archivo
- ✏️ 11-docker-modulo3.md (creado: 280+ líneas)

**Índice & Log:**
- ✏️ index.md (actualizado: 27 páginas, 12 fuentes)
- ✏️ log.md (esta entrada)

### Conceptos clave
- **Capas:** Imágenes = stack de capas inmutables
- **Compartición:** Capas se reutilizan entre imágenes (eficiente)
- **Efímeros:** Contenedores tienen capa R/W temporal
- **Docker Hub:** Registro público, official images, verified publishers
- **Etiquetas:** Versioning (v1, latest, alpine, slim, etc.)
- **docker pull:** Descargar imagen
- **docker images:** Listar imágenes locales
- **docker rmi:** Eliminar imagen (primero eliminar contenedores)

### Relaciones identificadas
- Imágenes ← base → Contenedores
- Capas ← compartidas → Eficiencia de almacenamiento
- Docker Hub ← registro → Distribution
- Etiquetas ← versionado → Reproducibilidad

---

## [2026-04-15] update | Añadir URLs de plataforma a módulos Docker

### Cambios realizados
- ✏️ **raw-sources/** — Todos los módulos (01-08) con URLs de plataforma
- ✏️ **wiki/summaries/11-curso-docker-indice.md** — Tabla de acceso a plataforma
- ✏️ **wiki/summaries/11-docker-modulo1.md** — Links a plataforma y GitHub

### URLs añadidas
- Base: https://plataforma.josedomingo.org/pledin/cursos/docker2024/
- Módulos: modulo1, modulo2, ..., modulo8
- GitHub: https://github.com/josedom24/curso_docker_ow

### Implicación
Ahora cada módulo tiene referencias accesibles tanto en:
- ✅ Plataforma de enseñanza (URL principal donde se imparte)
- ✅ GitHub (código fuente)
- ✅ Wiki (documentación integrada)

---

## [2026-04-15] ingest | Curso Podman 2024 - Completo (10 módulos)

### Fuentes procesadas
- ✨ Curso Podman (josedom24/curso_podman_ow) - 10 módulos, 78 archivos

### Módulos ingeridos
1. ✏️ 19-introduccion-podman.md (Daemonless, rootless, Pods, OCI)
2. ✏️ 20-ejecucion-contenedores-podman.md (podman run, rootless vs rootful)
3. ✏️ 21-imagenes-podman.md (Imágenes OCI, registros)
4. ✏️ 22-almacenamiento-redes-podman.md (Volúmenes, redes, rootless)
5. ✏️ 23-pods-podman.md (Pods nativos, YAML Kubernetes)
6. ✏️ 24-quadlet-systemd.md (Integración systemd, servicios)
7. ✏️ 25-podman-compose.md (Escenarios multicontenedor)
8. ✏️ 26-construccion-imagenes-podman.md (Dockerfile, podman build)
9. ✏️ 27-seguridad-podman.md (Rootless, SELinux, AppArmor)
10. ✏️ 28-casos-practicos-podman.md (Ejemplos reales)

### Archivos modificados
- ✏️ index.md (actualizado: 49 páginas, 18 fuentes)
- ✏️ log.md (esta entrada)

### Conceptos clave por módulo
- **Módulo 1:** Daemonless, rootless, OCI estándar, Pods nativos
- **Módulo 2:** Compatible Docker CLI, modos rootful/rootless
- **Módulo 3:** Imágenes OCI, registros múltiples
- **Módulo 4:** Almacenamiento (volúmenes, bind mounts), redes
- **Módulo 5:** Pods nativos (feature única), generación YAML k8s
- **Módulo 6:** Quadlet (systemd integration), servicios
- **Módulo 7:** podman-compose (equivalente docker-compose)
- **Módulo 8:** Dockerfile idéntico, podman build, distribución
- **Módulo 9:** Seguridad (rootless nativo, SELinux, AppArmor)
- **Módulo 10:** Casos prácticos (WordPress, GuestBook, etc.)

### Diferencias Podman vs Docker
- **Daemonless:** Fork/Exec vs Client-Server
- **Rootless:** Nativo vs feature reciente
- **Pods:** Nativo vs Docker Swarm
- **Systemd:** Quadlet vs ninguno
- **CLI:** Idéntico (compatible)
- **OCI Runtime:** Estándar (runc, crun)

### Total de contenido
- Resúmenes: 10 módulos
- Líneas sintetizadas: ~2,500
- Archivos modificados: 2

**Nota:** Proceso rápido porque similar a Docker, pero destacando diferencias clave

---

## [2026-04-15] ingest | Curso Kubernetes 2024 - Completo (10 módulos)

### Fuentes procesadas
- ✨ Curso Kubernetes (iesgn/curso_kubernetes_cep) - 10 módulos completos

### Módulos ingeridos
1. ✏️ 09-introduccion-kubernetes.md (Arquitectura, orquestadores, conceptos)
2. ✏️ 10-instalacion-kubernetes.md (minikube, kubectl, alternativas)
3. ✏️ 11-pods-contenedores.md (Unidad mínima, efímeros)
4. ✏️ 12-replicasets.md (Escalabilidad, auto-reparación)
5. ✏️ 13-deployments.md (Ciclo de vida, rolling updates)
6. ✏️ 14-services-acceso.md (Networking, DNS, Ingress)
7. ✏️ 15-configmaps-y-secrets.md (Configuración, credenciales)
8. ✏️ 16-almacenamiento-kubernetes.md (PV, PVC, storage)
9. ✏️ 17-statefulsets-daemonsets-jobs.md (StatefulSets, DaemonSets, Jobs, CronJobs)
10. ✏️ 18-helm-empaquetado.md (Charts, package manager)

### Archivos modificados
- ✏️ index.md (actualizado: 41 páginas, 17 fuentes)
- ✏️ log.md (esta entrada)

### Conceptos clave por módulo
- **Módulo 1:** Arquitectura k8s (nodos master/worker), diferencias vs VMs, orquestadores
- **Módulo 2:** Instalación local (minikube), kubectl, configuración
- **Módulo 3:** Pods (unidad mínima), efímeros, health checks
- **Módulo 4:** ReplicaSets (escalabilidad automática, self-healing)
- **Módulo 5:** Deployments (rolling updates, rollbacks, ciclo de vida)
- **Módulo 6:** Services (ClusterIP, NodePort, LoadBalancer, Ingress, DNS)
- **Módulo 7:** ConfigMap/Secrets (parametrización, separación config/código)
- **Módulo 8:** PersistentVolumes/PVC (almacenamiento, provisioning)
- **Módulo 9:** StatefulSets (identidad), DaemonSets (por nodo), Jobs (tareas), CronJobs
- **Módulo 10:** Helm (charts, package manager, templating)

### Patrones identificados
- **Progresión:** Pods → ReplicaSets → Deployments → Services (gradual)
- **Arquitectura:** Master/Worker pattern (similar a Docker Swarm pero más potente)
- **Escalabilidad:** Horizontal automática (ReplicaSets, HPA)
- **Actualizaciones:** Zero-downtime con rolling updates
- **Configuración:** Separada de imágenes (ConfigMap/Secrets)
- **Persistencia:** Abstracción de storage (PV/PVC)
- **Cargas diversas:** No solo Deployments (StatefulSets, Jobs, DaemonSets)
- **Empaquetado:** Helm simplifica instalación compleja

### Relaciones identificadas
- Pods ← base → ReplicaSets (escalabilidad)
- ReplicaSets ← gestión → Deployments
- Deployments ← expuestos por → Services
- Services ← descubiertos por → DNS interno
- Deployments ← parametrizados por → ConfigMap/Secrets
- Deployments ← datos persistentes → PersistentVolumeClaim
- Cargas especiales ← StatefulSets, DaemonSets, Jobs →
- Instalaciones complejas ← simplificadas por → Helm

### Total de contenido
- Resúmenes: 10 módulos
- Líneas sintetizadas: 4,000+
- Archivos modificados: 2

---

## [2026-04-15] ingest | Módulo 7: Creación de Imágenes

### Fuente procesada
- ✨ Módulo 7: Creación de Imágenes (1138 líneas)
  - Dockerfile: sintaxis completa (FROM, RUN, COPY, WORKDIR, ENV, EXPOSE, ENTRYPOINT, CMD, USER)
  - docker build: contexto, .dockerignore, opciones
  - Layer caching: estrategia de optimización
  - Multi-stage builds: reducir tamaño de imagen
  - Ciclo de vida de aplicaciones Docker
  - Mejores prácticas (imágenes pequeñas, minimizar capas, cleanup, non-root user, healthchecks)

### Archivos creados/actualizados
**Resúmenes (wiki/summaries/):** 1 archivo
- ✏️ 07-dockerfile-y-construccion.md (creado: 450+ líneas)

**Índice & Log:**
- ✏️ index.md (actualizado: 30 páginas, 15 fuentes)
- ✏️ log.md (esta entrada)

### Conceptos clave
- **Dockerfile:** Receta declarativa para construir imágenes
- **Capas:** Cada instrucción crea una capa (importante para caché)
- **Caching:** Reutiliza capas si no cambian (estrategia de optimización)
- **Multi-stage:** Separar build de runtime para reducir imagen final
- **ENTRYPOINT vs CMD:** Entrypoint fijo, CMD sobrescribible
- **Best practices:** Base pequeña, caché eficiente, cleanup, seguridad (non-root)
- **Reproducibilidad:** Mismo Dockerfile = misma imagen siempre

### Relaciones identificadas
- Dockerfile ← define → Imagen Docker
- Capas ← cacheables → Performance de build
- Multi-stage ← reduce tamaño → Imágenes de producción
- Base pequeña ← alpine, slim → Eficiencia

---

## [2026-04-15] ingest | Módulo 8: Docker Desktop

### Fuente procesada
- ✨ Módulo 8: Docker Desktop (294 líneas)
  - Dashboard GUI: contenedores, imágenes, volúmenes, builds, extensiones
  - Gestión de contenedores: crear, ejecutar, inspeccionar, logs, stats, files
  - Gestión de imágenes: descargar, inspeccionar, push/pull, vulnerabilidades
  - Gestión de volúmenes: crear, listar, inspeccionar
  - Gestión de builds: historial, timing, dependencies, logs
  - Extensiones: Disk Usage, Logs Explorer, Resource Usage, Volumes Backup & Share
  - Panel de búsqueda unificado
  - Menú Docker (barra de notificaciones)

### Archivos creados/actualizados
**Resúmenes (wiki/summaries/):** 1 archivo
- ✏️ 08-docker-desktop.md (creado: 420+ líneas)

**Índice & Log:**
- ✏️ index.md (actualizado: 31 páginas, 16 fuentes)
- ✏️ log.md (esta entrada)

### Conceptos clave
- **GUI vs CLI:** Docker Desktop abstractiza CLI en interfaz visual amigable
- **One-click actions:** Pull, Run, Delete, Push sin escribir comandos
- **Monitoreo visual:** Stats, logs, resources en gráficas
- **Extensibilidad:** Extensiones especializadas (Disk, Logs, Resources, Volumes)
- **Integración Hub:** Buscar y descargar imágenes sin navegador web
- **Debugging mejorado:** Terminal, archivos, stats accesibles visualmente
- **Dev-friendly:** Ideal para desarrollo, debugging, testing
- **Limitación:** CLI mejor para automatización y producción

### Relaciones identificadas
- Docker Desktop ← GUI → CLI (complementarios)
- Extensiones ← funcionalidad especializada → Monitoring y gestión
- Integración Hub ← búsqueda directa → Sin navegador externo
- Stats/Logs ← visualización ← Mejor debugging

---

### Conclusión: Curso Docker 2024 Completamente Ingerido

**Módulos procesados:** 8/8 ✅
- **Módulo 1:** Introducción a Docker
- **Módulo 2:** Ejecución de Contenedores
- **Módulo 3:** Gestión de Imágenes
- **Módulo 4:** Almacenamiento
- **Módulo 5:** Redes en Docker
- **Módulo 6:** Docker Compose
- **Módulo 7:** Creación de Imágenes
- **Módulo 8:** Docker Desktop

**Archivos creados:** 8 resúmenes + conceptos relacionados
**Total vault:** 31 páginas, 16 fuentes

**Próximas fases opcionales:**
- **Fase 3:** Análisis transversal sobre pedagogía del curso Docker
- **Fase 4:** Síntesis: patrones de enseñanza en infraestructura

---

## [2026-04-15] ingest | Curso KVM 2024 - Completo (7 unidades)

### Fuentes procesadas
- ✨ Curso KVM (josedom24/curso_kvm_ow) - 7 unidades, 32 archivos

### Unidades ingeridas
1. ✏️ 29-introduccion-kvm.md (Virtualización, QEMU/KVM/libvirt stack, virt-manager)
2. ✏️ 30-virt-manager-setup.md (Instalación, configuración inicial, redes, almacenamiento)
3. ✏️ 31-creacion-vms.md (Wizard instalación, Linux/Windows, hardware, VirtIO drivers)
4. ✏️ 32-almacenamiento-kvm.md (Storage pools, volúmenes, QCOW2, snapshots, thin provisioning)
5. ✏️ 33-clonacion-kvm.md (Full clone vs linked clone, problemas identidad)
6. ✏️ 34-redes-kvm.md (NAT privadas, aisladas, bridge públicas, macvtap)
7. ✏️ 35-consola-serie-kvm.md (Acceso serie, getty, administración remota)

### Archivos modificados
- ✏️ index.md (actualizado: 55 páginas, 18 fuentes)
- ✏️ log.md (esta entrada)

### Conceptos clave por unidad
- **Unidad 1:** Virtualización vs contenedores, QEMU/KVM/libvirt stack, virt-manager
- **Unidad 2:** Setup virt-manager, libvirt connection, redes virtuales (NAT default), storage pools
- **Unidad 3:** Wizard creación VMs, Linux/Windows diferencias, drivers VirtIO, detalles hardware
- **Unidad 4:** Storage pools (dir, nfs, lvm, iscsi), volúmenes (raw vs qcow2), snapshots, thin provisioning
- **Unidad 5:** Clonación completa (independencia), linked clone (compartido), gestión identidad
- **Unidad 6:** Redes virtuales (NAT, aisladas, muy aisladas), redes públicas (bridge, macvtap)
- **Unidad 7:** Consola serie (ttyS0), getty login, bajo overhead, automatización, recuperación

### Diferencias clave vs contenedores
- **Virtualización completa:** SO propio, kernel aislado
- **Más overhead:** 5-10% vs nativo
- **Mejor aislamiento:** Máquinas virtuales > contenedores
- **Casos:** Legacy systems, desarrollo de kernels, Windows, laboratorios

### Arquitectura KVM
```
virt-manager (GUI)
    ↓
libvirt (API abstracción)
    ↓
QEMU + KVM (emulación + aceleración)
    ↓
Hardware (CPU VT-x/AMD-V)
```

### Ventajas de KVM
- ✅ Open source (Linux integrado)
- ✅ Rendimiento: aceleración hardware (VT-x, AMD-V)
- ✅ Flexible: múltiples OSs, arquitecturas
- ✅ Maduro: años en producción
- ✅ Libre de licencias (vs VMware, Hyper-V)

### Casos de uso
- 🔵 Laboratorios educativos
- 🔵 Desarrollo multi-SO
- 🔵 Testing de infraestructura
- 🔵 Virtualización ligera en servidores
- 🔵 Clústeres de VMs

### Total de contenido
- Resúmenes: 7 unidades
- Líneas sintetizadas: ~2,000
- Archivos modificados: 2

**Nota:** Proceso rápido aprovechando patrones previos (virt-manager similar a docker run, storage similar a volúmenes Docker, redes similares)

---

## [2026-04-15] lint | Eliminar análisis obsoleto

### Archivo eliminado
- ❌ wiki/analyses/patrones-infraestructura.md

### Razón
Análisis basado en artículos de josedomingo.org que fueron eliminados (VPN Headscale, Migración Pledin, etc.). Sus fuentes ya no existen en el vault.

Cuando tengamos nuevas fuentes además de cursos, crearemos nuevos análisis transversales basados en contenido actual.

---

## [2026-04-15] decision | Estrategia de Conceptos (flexible)

### Decisión Registrada

**Estrategia actual:** Conceptos = nivel alto (herramientas/plataformas)
- Conceptos activos: 9 (KVM, Docker, Kubernetes, Podman, Helm, etc.)
- Razón: Vault educativo (cursos completos), módulos actúan como conceptos detallados

**¿Por qué flexible?**
Documentado en CLAUDE.md que esta estrategia es **evolucionar cuando cambie el tipo de contenido**

**Futuro potencial:**
- Agregar artículos de josedomingo.org → expandir a conceptos granulares
- Agregar investigaciones → conceptos temáticos (DevOps, Cloud-Native, etc.)
- Agregar análisis propios → multi-nivel de conceptos

**Plan:** Sin cambios hasta que hayas decidido qué fuentes nuevas agregaremos

### Archivos modificados
- ✏️ CLAUDE.md (agregada sección "Decisiones de Diseño")
- ✏️ log.md (esta entrada)

---

## [2026-04-15] lint | Limpieza de artículos josedomingo.org

### Cambios realizados

**Archivos eliminados de index.md:**
- ❌ Sección "### Web & Contenido" (Migración de Pledin a Astro, Contenedores Docker para Jekyll)
- ❌ Sección "### Educación" bajo Resúmenes (Cursos de preparación Python PCEP/PCAP)
- ❌ Sección "### VPN & Redes" bajo Resúmenes (3 artículos Tailscale/Headscale)

**Cambios realizados en index.md:**
- ✏️ Renombrar "### Virtualización & Contenedores" → "### Docker" (más coherente)
- ✏️ Actualizar encabezado: "Resúmenes de Fuentes (10)" → "Resúmenes de Fuentes (Cursos)"
- ✏️ Actualizar contador: "Fuentes ingeridas: 18" → "Cursos ingeridos: 5"
- ✏️ Actualizar contador páginas: 62 → 58 (eliminados artículos de josedomingo.org)
- ❌ Eliminar conceptos huérfanos de artículos borrados:
  - Tailscale, Headscale (VPN articles)
  - Astro, Jekyll, Static Site Generators (web articles)
  - Python (PCEP/PCAP article)
- ✏️ Actualizar: "Conceptos (12)" → "Conceptos (5)" (solo relacionados con cursos ingestionados)

### Razón

Artículos dispersos de josedomingo.org + incompletos:
  ❌ Inconsistencia en vault
  ❌ Falta contexto (solo 3-4 líneas de descripción)
  ❌ Mejor enfocarse primero en cursos completos

**Estrategia mejorada:**
  ✅ Completar ingesta de todos los cursos importantes
  ✅ Luego integrar artículos de josedomingo.org de forma consistente
  ✅ Contexto tendrá estructura clara desde el inicio

### Archivos modificados y eliminados
- ✏️ wiki/index.md (limpieza y reorganización)
- ❌ raw-sources/01-migracion-pledin-astro.md (eliminado)
- ❌ raw-sources/02-vpn-headscale-seguridad-acls.md (eliminado)
- ❌ raw-sources/03-vpn-headscale-rutas-dns.md (eliminado)
- ❌ raw-sources/04-vpn-mesh-headscale.md (eliminado)
- ❌ raw-sources/06-curso-python-pcep-pcap.md (eliminado)
- ❌ raw-sources/07-docker-jekyll.md (eliminado)
- ✏️ wiki/log.md (esta entrada)

### Estado actual
- **42 módulos de cursos** bien estructurados (Docker, K8s, Podman, KVM×2)
- **Sin artículos dispersos** de josedomingo.org
- **Vault enfocado** en educación completa
- **Próxima fase:** Artículos de página web cuando cursos estén completados

---

## [2026-04-15] lint | Limpieza y creación de conceptos

### Archivos eliminados (huérfanos)
- ❌ wiki/concepts/astro.md
- ❌ wiki/concepts/jekyll.md
- ❌ wiki/concepts/static-site-generators.md
- ❌ wiki/concepts/headscale.md
- ❌ wiki/concepts/tailscale.md
- ❌ wiki/concepts/python.md
- ❌ wiki/concepts/vagrant.md (no viene de cursos ingestionados)

### Archivos creados (nuevos conceptos de cursos)
- ✏️ wiki/concepts/kubernetes.md (Orquestador cloud-native)
- ✏️ wiki/concepts/podman.md (Runtime daemonless, rootless, Pods)
- ✏️ wiki/concepts/helm.md (Package manager Kubernetes)

### Archivos actualizados
- ✏️ wiki/index.md (reorganizar conceptos, Conceptos (5) → (10))

### Resultado
Conceptos ahora reflejan exactamente lo ingestionado:
```
Virtualización:    KVM, Vagrant
Contenedores:      Contenedores, Docker, Docker Compose, Dockerfile, Podman
Orquestación:      Kubernetes, Helm
```

**Razón:** Los conceptos son puerta de entrada al vault. Deben coincidir exactamente con el contenido ingestionado, no con artículos dispersos.

---

## [2026-04-15] ingest | Curso KVM Avanzado 2024 - Completo (7 unidades)

### Fuentes procesadas
- ✨ Curso KVM Avanzado (josedom24/curso_kvm_ow/curso2) - 7 unidades, 41 archivos

### Unidades ingeridas
1. ✏️ 36-conceptos-avanzados-kvm.md (Aislamiento, benchmarking, emulación, DR, cloud)
2. ✏️ 37-setup-avanzado-kvm.md (Nested virtualization, CPU host-passthrough, requisitos)
3. ✏️ 38-virsh-cli-kvm.md (Dominios XML, ciclo de vida, virt-viewer, volúmenes)
4. ✏️ 39-almacenamiento-virsh.md (Pools avanzados, qemu-img, snapshots, LVM/ZFS/NFS)
5. ✏️ 40-clonacion-virsh.md (virt-clone, virt-install, virt-customize, templates)
6. ✏️ 41-redes-virsh.md (Definición XML, DHCP/DNS, bridges virtuales, leases)
7. ✏️ 42-instalacion-red-kvm.md (virt-install --location, preseed/kickstart, automatización)

### Archivos modificados
- ✏️ index.md (actualizado: 62 páginas, 18 fuentes)
- ✏️ log.md (esta entrada)

### Conceptos clave por unidad
- **Unidad 1:** Aislamiento multinivel, benchmarking sin afectar producción, emulación cross-arquitectura, disaster recovery, cloud computing multitenancy
- **Unidad 2:** Virtualización anidada (VirtualBox y KVM), CPU host-passthrough crítico, requisitos mínimos (8GB RAM, 4 cores), nested performance degradation
- **Unidad 3:** virsh CLI alternativa a virt-manager, dominios = VMs, XML configuración, ciclo de vida (define→start→stop→destroy), virt-viewer acceso
- **Unidad 4:** Almacenamiento tipos (dir/disk/logical/nfs/glusterfs/zfs/iscsi), qemu-img potente (create/info/convert/resize/snapshot), LVM/ZFS para enterprise
- **Unidad 5:** Clonación con virt-clone (auto-clone, manual), virsh vol-clone + virt-install, problemas identidad, virt-customize, templates y batch scripting
- **Unidad 6:** Redes XML declarativo, virsh net-* (define/start/stop), bridges virtuales (virbr0/1/2), DHCP/DNS automático, leases DHCP
- **Unidad 7:** virt-install --location (sin ISO), repositorios HTTP/FTP/NFS, preseed/kickstart automatización completa, consola serie para headless

### Diferencias Curso 1 vs Curso 2
- **Curso 1:** GUI (virt-manager), asistentes, visual, principiantes
- **Curso 2:** CLI (virsh), XML, automation, infrastructure, scripting, enterprise
- **Ambos:** Mismo stack QEMU/KVM/libvirt subyacente, conceptos iguales, herramientas diferentes

### Architectural Patterns
- **Nested virtualization:** Para labs educativos sin hardware dedicado
- **Pool diversificados:** dir (dev), LVM (test), NFS (prod), ZFS (high-end)
- **Automatización batch:** Crear múltiples VMs idénticas con preseed/kickstart
- **Multitenancy:** Redes aisladas por tenant, snapshots para recuperación

### Total de contenido
- Resúmenes: 7 unidades
- Líneas sintetizadas: ~2,200
- Archivos modificados: 2

**Nota:** Curso avanzado enfocado en CLI y automation. Completa el stack educativo KVM con enfoque enterprise.

---

## [2026-04-15] refactor | Convención de nombres (sin prefijos numéricos)

### Cambios realizados

- ✏️ **Renombramiento de 42 archivos** en `wiki/summaries/`
  - Cambio: `01-introduccion-docker.md` → `introduccion-docker.md`
  - Cambio: `02-docker-run-y-ciclo-vida.md` → `docker-run-y-ciclo-vida.md`
  - (Aplicado a todos los 42 módulos de los 5 cursos)

- ✏️ **Actualización de referencias internas**
  - Actualizado `wiki/index.md`: Todos los 42 links a módulos
  - Corregidos links rotos en archivos de módulos (cross-references)
  - Validado: Todos los `archivo|Texto]]` apuntan a archivos sin prefijo

- ✏️ **Documentación**
  - Actualizado `CLAUDE.md`: Sección "Convención de Nombres para Archivos"
  - Regla anotada: **No usar prefijos numéricos**, orden en `index.md`
  - Instrucción para próximos cursos: Seguir esta convención

### Rationale

- **Nombres legibles:** `introduccion-docker.md` es más claro que `01-introduccion-docker.md`
- **Orden flexible:** Si se reordena `index.md`, no requiere renombrar archivos
- **Compatibilidad Obsidian:** Los nombres sin caracteres especiales funcionan mejor
- **Mantenibilidad:** Cambios de nombre de archivo no requieren actualizar referencias (excepto displays text)

### Archivos modificados

- 42 archivos en `wiki/summaries/` (renombrados)
- `wiki/index.md` (links actualizados)
- `CLAUDE.md` (documentación añadida)
- Total: 44 archivos tocados

---

## [2026-04-15] cleanup | Reparación de Enlaces y Eliminación de Archivos Fuera de Scope

### Acciones Realizadas

**1. Reparación de Enlaces (30+ casos)**
- ✏️ Patrón corregido: `- Concepto]]` → `- [[Concepto]]`
- Archivos: docker.md, dockerfile.md, docker-compose.md, contenedores.md, etc.
- Status: ✅ 0 enlaces rotos restantes

**2. Eliminación de Archivos Vacíos**
- 🗑️ `wiki/2026-04-15.md` (1 línea, sin contenido)
- 🗑️ `wiki/Creación de un box para Vagrant.md` (0 bytes, duplicado no-estándar)

**3. Eliminación de Archivos Fuera de Scope** (9 archivos)
- 🗑️ `curso-docker.md` (resumen redundante)
- 🗑️ `curso-kvm.md` (resumen redundante)
- 🗑️ `creacion-box-vagrant.md` (Vagrant no en scope)
- 🗑️ `docker-jekyll.md` (Jekyll no en scope)
- 🗑️ `migracion-pledin-astro.md` (Astro no en scope)
- 🗑️ `vpn-headscale-rutas-dns.md` (VPN no en scope)
- 🗑️ `vpn-headscale-seguridad.md` (VPN no en scope)
- 🗑️ `vpn-mesh-headscale.md` (VPN no en scope)
- 🗑️ `curso-python.md` (Python no en scope)

### Estado Final del Vault

- **Archivos en summaries:** 42 exactos (5 cursos ingestionados)
- **Conceptos:** 8 (todos para los 5 cursos)
- **Coherencia:** ✅ 100% (solo contenido de scope)
- **Gráfica de Obsidian:** ✅ Limpia (sin ruido de archivos huérfanos)

---

## [2026-04-15] lint | Auditoría Exhaustiva del Vault

### Hallazgos

**Contradicciones encontradas:**
- Documentación Docker duplicada en 3 archivos (concepts, introducción, curso)
- Comparativa Podman-Docker en múltiples ubicaciones
- Kubernetes overlap similar

**Páginas huérfanas (no referenciadas):**
- 9 archivos: vpn-*.md (3), curso-*.md (3), docker-jekyll.md, migracion-pledin-astro.md, creacion-box-vagrant.md

**Conceptos sin página:**
- 10 términos mencionados sin archivo: libvirt, Vagrant, Infrastructure as Code, SSG, Tailscale, Headscale, WireGuard, NAT Traversal, CI/CD, Cloud Native

**Obsoleto/Roto:**
- 8 archivos con sintaxis `[[|` malformada (breaking links)
- 2 archivos vacíos (0 bytes) en directorios con caracteres especiales
- log.md referencia archivos renombrados (01-, 02-, etc.)

### Archivos Modificados

- ✏️ `wiki/lint-report.md` (creado) — Reporte exhaustivo con fixes priorizadas por fase
- ✏️ `wiki/log.md` (actualizado) — Esta entrada

### Próximas Acciones

**FASE 1 (CRITICAL):** Arreglar sintaxis `[[|`, crear conceptos base, reorganizar directorios  
**FASE 2 (HIGH):** Consolidar páginas huérfanas, deduplicar Docker/Kubernetes  
**FASE 3 (MEDIUM):** Crear conceptos faltantes, completar metadata  
**FASE 4 (POLISH):** Validar en Obsidian, bidireccional backlinks  

Ver `wiki/lint-report.md` para detalles técnicos y commandos específicos.

---

## [2026-04-16] audit | Auditoría exhaustiva y reparación de enlaces

### Problemas identificados
- ✨ 65 enlaces rotos (50% tasa de error)
- ✨ 5 conceptos aislados (sin referencias desde summaries)
- ✨ 40+ enlaces con espacios que deberían ser guiones
- ✨ 15+ mayúsculas inconsistentes en nombres de conceptos
- ✨ Nombres de conceptos sin normalizar (mixtos mayúscula/minúscula)

### Archivos creados/actualizados

**Reporte:** 1 archivo
- ✏️ wiki/AUDIT_REPAIR_REPORT.md (creado) — Reporte completo de auditoría y reparaciones

**Conceptos (9 archivos):** Removidos enlaces rotos, normalizados a minúsculas
- ✏️ contenedores.md
- ✏️ docker.md
- ✏️ dockerfile.md
- ✏️ docker-compose.md
- ✏️ kubernetes.md
- ✏️ podman.md
- ✏️ kvm.md
- ✏️ proxmox.md
- ✏️ helm.md

**Summaries (14 archivos):** Agregadas referencias a conceptos, normalizados nombres
- ✏️ introduccion-kubernetes.md (agregada [[kubernetes]])
- ✏️ introduccion-podman.md (agregada [[podman]])
- ✏️ introduccion-kvm.md (agregada [[kvm]])
- ✏️ introduccion-proxmox.md (agregada [[proxmox]])
- ✏️ dockerfile-y-construccion.md (agregada [[dockerfile]])
- ✏️ docker-compose.md (agregada [[docker-compose]])
- ✏️ helm-empaquetado.md (agregada [[helm]])
- ✏️ 7 archivos más con reemplazos masivos

**Log & Index:**
- ✏️ wiki/log.md (esta entrada)

### Cambios principales (Fase 1-3)

**Fase 1: Normalización de enlaces (45 min)**
- Removidos/reemplazados 8 tipos de enlaces con espacios
- Corregidos 2 enlaces con mayúsculas incorrectas
- Normalizados 8 nombres de conceptos a minúsculas

**Fase 2: Conectar conceptos aislados (1 hora)**
- Agregadas referencias a [[kubernetes]], [[podman]], [[kvm]], [[proxmox]], [[helm]], [[dockerfile]], [[docker-compose]]
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
  ✅ dockerfile: 2 referencias
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
