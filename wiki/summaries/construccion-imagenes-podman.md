---
title: "Construcción y Distribución de Imágenes OCI"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_podman_ow]
tags: [docker, imagenes, oci, podman]
---

# Construcción y Distribución de Imágenes OCI

## Resumen de una línea
Construcción de imágenes OCI con Podman: Dockerfile idéntico a Docker, `podman build`, distribución en registros.

## Información
- **Fuente:** Curso Podman 2024 - Módulo 8


## Construcción: Dockerfile

### Compatible con Docker

```dockerfile
FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y python3

COPY app.py /app/

WORKDIR /app

CMD ["python3", "app.py"]
```

```bash
# Construir (idéntico a Docker)
podman build -t myapp:1.0 .
```


## podman build

### Sintaxis

```bash
# Simple
podman build -t myapp:1.0 .

# Con argumentos
podman build --build-arg ENV=prod -t myapp:1.0 .

# Sin caché
podman build --no-cache -t myapp:1.0 .
```


## Distribución (Push/Pull)

### Push a Registro

```bash
# Etiquetar
podman tag myapp:1.0 registry.example.com/myapp:1.0

# Push
podman push registry.example.com/myapp:1.0
```

### Pull de Registro

```bash
# Pull
podman pull registry.example.com/myapp:1.0
```


## Diferencias Podman vs Docker

En construcción: **Esencialmente idéntico**

```bash
docker build = podman build
docker push = podman push
docker pull = podman pull
```

**Ventaja:** Mismos Dockerfiles funcionan en ambos


## Construcción desde Contenedor

```bash
# Ejecutar cambios en contenedor
podman run -it ubuntu bash
# (instalar, configurar)
# exit

# Crear imagen del contenedor
podman commit <container-id> myapp:1.0
```


## Relaciones

### Conecta con
- [[imagenes-podman|Gestión de Imágenes OCI en Podman]]
- [[dockerfile-y-construccion|Creación de Imágenes en Docker]]


## Fuentes

- [Curso Podman 2024 (GitHub)](https://github.com/josedom24/curso_podman_ow)
