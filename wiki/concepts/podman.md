---
title: Podman
created: 2026-04-15
updated: 2026-04-15
sources: [curso_podman_ow]
tags: [contenedores, oci, podman, rootless]
aliases: [Podman]
---

# Podman

## Resumen de una línea
Runtime de contenedores daemonless sin demonio central, rootless nativo, compatible CLI Docker, Pods nativos, integración systemd (Quadlet), estándar OCI.

## Definición

**Podman** = Container engine que reemplaza Docker con arquitectura daemonless (sin servicio central), soporte nativo rootless y Pods.

Enfoque: "Podman and systemd go together" → contenedores como servicios systemd.

## Conceptos Clave

### Arquitectura: Daemonless

**Docker:**
```
docker CLI → docker daemon (root) → contenedores
```

**Podman:**
```
podman CLI → fork/exec directo → contenedores
  (no hay demonio intermedio)
```

**Ventajas:**
- Menor overhead
- Sin single point of failure
- Mejor integración systemd

### Rootless Nativo

```
Opción 1: rootless
  podman run myapp
  → ejecuta como usuario normal
  → máximo daño: tu usuario, no sistema

Opción 2: rootful
  sudo podman run myapp
  → ejecuta como root (menos recomendado)
```

**Por qué rootless:**
- Seguridad mejorada
- Pods aislados por usuario
- Sin privilegios de sistema

### Pods Nativos

Feature única de Podman (Docker usa Swarm):

```
Pod = grupo de contenedores compartiendo:
  - Network namespace
  - Storage
  - Recursos CPU/RAM
  - Ciclo de vida

Uso: aplicaciones multicontenedor sin orquestador
```

### Quadlet (systemd Integration)

```
Podman + systemd = Quadlet
  → Contenedores como servicios
  → Declarativos (.service files)
  → Auto-start, restart, logging nativo systemd
```

**Fichero Quadlet:**
```ini
[Container]
Image=myapp:latest
Ports=8080:80
Environment=DEBUG=1

[Service]
Restart=always
```

### Compatibilidad Docker

```
podman run = docker run
podman build = docker build
podman-compose = docker-compose

PERO: Algunas diferencias
  ✅ Rootless por defecto
  ✅ Sin demonio
  ❌ Algunas flags no existen
```

## Ventajas vs Docker

| Aspecto | Podman | Docker |
|---------|--------|--------|
| **Demonio** | No | Sí (systemd) |
| **Rootless** | Nativo | Feature reciente |
| **Pods** | Nativo | No (usa Swarm) |
| **systemd** | Integrado (Quadlet) | Ninguno |
| **OCI** | Estándar | Estándar |
| **Seguridad** | Mejor (nativo) | Aceptable |

## Casos de Uso

```
🟢 Single-host containerización
🟢 Desarrollo local (rootless seguro)
🟢 Servidores sin orquestador
🟢 Aplicaciones multi-contenedor (Pods)
🟢 Integración systemd (VPS, IoT)
🟢 Migración fácil desde Docker

🔴 Clustering (usa Kubernetes)
🔴 Compatibilidad 100% Docker
```

## Instalación

### Linux

```bash
# Debian/Ubuntu
sudo apt install podman podman-compose

# RedHat/CentOS
sudo yum install podman podman-compose
```

### Uso Básico

```bash
# Equivalente a docker
podman run -d -p 8080:80 nginx

# Pods
podman pod create myapp
podman run --pod myapp nginx
podman run --pod myapp myapp:api

# Podman Compose
podman-compose -f compose.yaml up -d
```

## Relaciones

### Conecta con
- [[contenedores|Contenedores]] — Virtualización a nivel SO
- [[docker|Docker]] — Alternativa directa
- [[kubernetes|Kubernetes]] — Siguiente nivel orquestación

### Diferencia con
- [[docker|Docker]] — Demonio vs daemonless, rootless nativo
- Kubernetes — Single-host vs cluster-wide

### Compatible con
- Docker CLI (mayoría de comandos)
- docker-compose (via podman-compose)
- OCI standard (imágenes portables)

## Fuentes

- [Curso Podman 2024 (GitHub)](https://github.com/josedom24/curso_podman_ow)
- [Podman Official](https://podman.io/)
- [Quadlet Documentation](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
