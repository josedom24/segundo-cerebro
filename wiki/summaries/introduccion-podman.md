---
title: "Introducción a Podman"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_podman_ow]
tags: [contenedores, oci, podman, rootless]
---

# Introducción a Podman

## Resumen de una línea
Podman es un motor de contenedores OCI sin demonio (daemonless), rootless nativo, con Pods integrados: similar a Docker pero más ligero y seguro.

## Información
- **Fuente:** Curso Podman 2024 - Módulo 1
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/podman2024/
- **URL GitHub:** https://github.com/josedom24/curso_podman_ow
- **Líneas de contenido:** 400+


## ¿Qué es Podman?

**Podman** = POD MANager

```yaml
Similar a Docker:
  ✓ Motor de contenedores OCI
  ✓ Gestiona contenedores e imágenes
  ✓ CLI compatible (docker → podman)

Diferente de Docker:
  ✓ Sin demonio (daemonless)
  ✓ Rootless nativo desde el inicio
  ✓ Pods nativos (no solo Docker Swarm)
  ✓ Integración Systemd (Quadlet)
  ✓ OCI runtime estándar (runc, crun)
```


## Características Principales

### 1. CLI Compatible con Docker

```bash
# Docker
docker run -it ubuntu bash

# Podman (¡mismo comando!)
podman run -it ubuntu bash

# Alias automático disponible
alias docker=podman
```

**Ventaja:** Developers conocen Docker pueden usar Podman sin reaprendizaje

### 2. Daemonless (Sin Demonio)

**Docker (Client-Server):**
```
Docker CLI → Docker Daemon → containerd → runc → contenedor
```

**Problemas:** Si daemon falla, todo falla

**Podman (Fork/Exec):**
```
Podman CLI → OCI Runtime (runc/crun) → contenedor
```

**Ventajas:**
- ✅ Más simple
- ✅ Menos overhead
- ✅ Más seguro
- ✅ Fácil de debuguear (ps muestra procesos reales)

### 3. Rootless Nativo

**Docker rootless:** Característica añadida después (versiones recientes)

**Podman rootless:** Desde el inicio

```bash
# Ejecutar Podman sin root
$ podman run nginx

# Contenedor corre con aislamiento de usuario
# Si se compromete → usuario normal, no root ✅
```

**Limitaciones rootless:**
- ❌ Puertos < 1024 (excepto con mapeamiento especial)
- ❌ Algunas características de storage limitadas
- ❌ No ping por defecto
- ⚠️ Pero: No puedes hacer daño al host

### 4. Pods Nativos

Podman soporta **Pods** (grupos de contenedores) nativamente:

```bash
# Crear pod
podman pod create --name mypod

# Ejecutar contenedores en el pod
podman run --pod mypod nginx
podman run --pod mypod php-fpm

# Compartir IP, almacenamiento automático
```

**Beneficio:** Podman puede generar YAML de Kubernetes

### 5. Integración Systemd (Quadlet)

Podman puede gestionar contenedores como servicios systemd:

```ini
# /etc/systemd/system/container-app.service
[Unit]
Description=My App Container

[Container]
Image=myapp:latest
Exec=myapp

[Service]
Restart=always

[Install]
WantedBy=default.target
```

```bash
systemctl start container-app
systemctl enable container-app
```

### 6. Registros Personalizables

Con Podman puedes usar múltiples registros:

```bash
# Nombre corto (Podman busca en registros configurados)
podman run ubi8

# Nombre completo
podman run registry.access.redhat.com/library/ubi8:latest

# Podman te pregunta si ambiguo
```

### 7. OCI Runtime Estándar

Podman usa OCI runtimes estándar:

```
runc  → Runtime de Go (por defecto)
crun  → Runtime de C (más rápido, menos RAM)

Ambos compatibles con OCI spec
```


## Arquitectura: Fork/Exec vs Client-Server

### Docker (Client-Server)

```
┌─────────────────────────────────────┐
│ Docker CLI (cliente)                 │
└────────────┬────────────────────────┘
             │ gRPC
┌────────────▼────────────────────────┐
│ Docker Daemon                         │
├─────────────────────────────────────┤
│ containerd                            │
├─────────────────────────────────────┤
│ OCI Runtime (runc)                   │
├─────────────────────────────────────┤
│ Contenedor                            │
└─────────────────────────────────────┘
```

**Problemas:** 5 capas, demonio central, single point of failure

### Podman (Fork/Exec)

```
┌──────────────────────────────────────┐
│ Podman CLI                            │
└────────────┬─────────────────────────┘
             │ fork/exec
┌────────────▼──────────────────────────┐
│ OCI Runtime (runc/crun) - proceso hijo │
└────────────┬──────────────────────────┘
             │
┌────────────▼──────────────────────────┐
│ Contenedor                             │
└──────────────────────────────────────┘
```

**Ventajas:** 2 capas, sin demonio, más simple


## Contenedores OCI

### ¿Qué es OCI?

**Open Container Initiative** (Linux Foundation):
- Especificación de runtime (OCI Runtime Spec)
- Especificación de imagen (OCI Image Format)
- Especificación de distribución (OCI Distribution Spec)

### Ventaja

```
Antes: Docker propietario
Ahora: OCI abierto → Docker, Podman, CRI-O, etc. interoperables
```


## Instalación

### Linux

```bash
# Ubuntu/Debian
sudo apt install podman

# RHEL/Fedora
sudo dnf install podman

# Verificar
podman --version
podman run hello-world
```

### Windows/macOS

Podman proporciona VM gestionada:

```bash
podman machine init
podman machine start
podman run hello-world
```

Automáticamente crea VM con Podman dentro.


## Contenedores OCI

### Características

 Aspecto  Detalle 
------------------
 **Aislamiento**  Procesos, filesystem, red (namespaces) 
 **Virtualización**  A nivel SO (ligera vs VMs) 
 **Portabilidad**  Mismo contenedor en dev/test/prod 
 **Eficiencia**  Comparten kernel → menos overhead 
 **Velocidad**  Milisegundos vs minutos (VMs) 

### Tipos de Aplicaciones Ideales

```
✅ Monolitos en contenedores separados (web, DB, cache)
✅ Microservicios (cada servicio = 1 contenedor)
✅ Aplicaciones stateless (nginx, API, Node.js)

❌ Sistemas complejos con muchos procesos
❌ Drivers kernel específicos
❌ GPUs (posible pero complejo)
```


## Relaciones

### Conecta con
- [[podman|Podman]] — Concepto y arquitectura
- [[docker|Docker]] — Similar, CLI compatible, pero daemonless y rootless
- [[kubernetes|Kubernetes]] — Podman genera YAML k8s
- [[contenedores|Contenedores]] — Base conceptual

### Diferencia principal con
- [[docker|Docker]] — Daemonless, rootless nativo, Quadlet, Pods integrados

### Parte de
- Runtimes de contenedores OCI estándar


## Próximo Paso

Con Podman instalado, pasar a [[ejecucion-contenedores-podman|Ejecución de Contenedores con Podman]].


## Fuentes

- [Curso: Podman 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/podman2024/)
- [Curso Podman 2024 (GitHub)](https://github.com/josedom24/curso_podman_ow)
- [Podman Official](https://podman.io/)
- [Open Container Initiative](https://opencontainers.org/)
