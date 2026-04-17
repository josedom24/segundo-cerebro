---
title: "Gestión de Imágenes OCI en Podman"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_podman_ow]
tags: [imagenes, oci, podman]
---

# Gestión de Imágenes OCI en Podman

## Resumen de una línea
Gestión de imágenes OCI con Podman: muy similar a Docker, con formato OCI estándar, múltiples registros, y almacenamiento eficiente.

## Información
- **Fuente:** Curso Podman 2024 - Módulo 3


## Conceptos OCI

### Formato OCI Image

```
Imagen OCI:
├── Config (metadata)
├── Capas (layers)
└── Manifest
```

**Compatible con:** Docker, Podman, CRI-O, Containerd

### Almacenamiento

```bash
# Ubicación (rootful)
/var/lib/containers/storage

# Ubicación (rootless)
~/.local/share/containers/storage
```


## Operaciones Comunes

### Descargar y Listar

```bash
# Pull
podman pull nginx:latest

# Listar
podman images

# Información
podman inspect nginx
```

### Eliminar y Limpiar

```bash
# Eliminar
podman rmi nginx

# Limpiar no usadas
podman image prune
```

### Etiquetas

```bash
# Crear etiqueta
podman tag nginx:latest myregistry/nginx:v1

# Enviar (push)
podman push myregistry/nginx:v1
```


## Múltiples Registros

```bash
# Usar nombre corto (Podman busca en registros)
podman run ubi8

# Especificar registro
podman run docker.io/library/ubuntu

# Configurar registros en /etc/containers/registries.conf
```


## Ahorro de Almacenamiento

```bash
# Ver uso
podman system df

# Eliminar todo no usado
podman system prune
```


## Relaciones

### Conecta con
- [[ejecucion-contenedores-podman|Ejecución de Contenedores con Podman]]
- [[almacenamiento-redes-podman|Almacenamiento y Redes en Podman]]


## Fuentes

- [Curso Podman 2024 (GitHub)](https://github.com/josedom24/curso_podman_ow)
