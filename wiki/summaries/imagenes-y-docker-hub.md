---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_docker_ow]
tags: [docker, imagenes]
---

# Gestión de Imágenes

## Resumen de una línea
Cómo funcionan las imágenes Docker (capas, almacenamiento, compartición), Docker Hub como registro, y comandos para gestionar imágenes locales.

## Información
- **Fuente:** Curso Docker 2024 - Módulo 3
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/
- **URL GitHub:** https://github.com/josedom24/curso_docker_ow
- **Líneas de contenido:** 407

---

## Conceptos Fundamentales

### 1. Arquitectura de Capas en Imágenes

Las imágenes Docker están construidas en **capas** (layers) usando un **union filesystem**:

```
Imagen = Stack de capas (inmutables, lectura)
├── Capa 1: debian:stable-slim (100 MB)
├── Capa 2: RUN apt-get install apache (50 MB)
└── Capa 3: COPY index.html (< 1 MB)
= Total: 150+ MB
```

**Ventaja:** Las capas se **comparten** entre imágenes:

```bash
# Descargas servidorweb:v1
$ docker pull josedom24/servidorweb:v1
9532dfcb62dd: Pull complete  ← Capa 1
209210f58112: Pull complete  ← Capa 2
4f6c4ab344d9: Pull complete  ← Capa 3 (v1)

# Descargas servidorweb:v2 (misma base)
$ docker pull josedom24/servidorweb:v2
9532dfcb62dd: Already exists  ← Capa 1 (compartida!)
209210f58112: Already exists  ← Capa 2 (compartida!)
274f48ad3e93: Pull complete   ← Capa 3 (v2, diferente)
```

**Eficiencia de almacenamiento:**
```bash
$ docker system df -v

REPOSITORY     TAG   SIZE      SHARED SIZE   UNIQUE SIZE
servidorweb    v1    187MB     186.8MB       25B
servidorweb    v2    187MB     186.8MB       22B

# Real en disco: 186.8 MB (capas comunes) + 25B + 22B
# No: 187MB + 187MB
```

### 2. Almacenamiento de Contenedores

Los contenedores añaden una **capa de lectura-escritura** temporal:

```bash
$ docker run -it --name contenedor1 ubuntu
# Capa del contenedor: 5B (vacía)

# Creamos un archivo
root@a2d1ce6990d8:/# echo "datos" > file.txt

# Tamaño crece
$ docker ps -a -s
SIZE: 62B (virtual 77.9MB)
     └─ Real: 62B  Virtual: 77.9MB (imagen base compartida)
```

**Ciclo de vida:**
```
Imagen ubuntu (77.9 MB, compartida)
         ↓
Contenedor (capa R/W temporal)
         ↓
Cambios se guardan en capa del contenedor
         ↓
docker stop → Contenedor pausado (capa intacta)
         ↓
docker rm → Capa de contenedor eliminada (cambios perdidos si no hay volumen)
```

**Conclusión:** Los contenedores son **efímeros** por defecto. Sin volúmenes, los datos se pierden.

### 3. Relación Imagen-Contenedor

No puedes eliminar una imagen que tiene contenedores:

```bash
$ docker rmi ubuntu
Error: unable to remove repository (container 679822aff71a is using it)

# Solución: eliminar contenedor primero
$ docker rm contenedor1
$ docker rmi ubuntu  # Ahora funciona
```

---

## Docker Hub: Registro de Imágenes

### ¿Qué es Docker Hub?

[Docker Hub](https://hub.docker.com) es el registro **público** oficial de Docker:
- Millones de imágenes
- Autenticación con Docker CLI
- Repositorios personales y públicos
- Versioning con etiquetas

### Concepto: Repositorio

```
Un repositorio = Una aplicación + varias versiones

josedom24/servidorweb
├── v1 (etiqueta)
├── v2 (etiqueta)
├── latest (etiqueta especial)
└── dev (etiqueta)
```

**Nombre de imagen:** `usuario/nombre:etiqueta`

Imágenes oficiales (sin usuario): `ubuntu:22.04`, `nginx:latest`

### Tipos de Imágenes en Docker Hub

#### 1. Distribuciones SO
Sistemas operativos base:
- `ubuntu:22.04`, `debian:bookworm`
- `alpine:3` (muy pequeña: 7 MB vs 180 MB ubuntu)
- Variantes `-slim` para versiones livianas

#### 2. Servicios
Aplicaciones específicas:
- `nginx:latest`, `httpd:2.4-bookworm`
- `mariadb:11.2-jammy`, `postgresql:15-alpine`
- `redis:7-alpine`

#### 3. Lenguajes de Programación
Con runtime y compiladores:
- `python:3.12-slim-bookworm`
- `node:20-alpine`
- `openjdk:23-jdk-bookworm`
- `php:fpm-bookworm`

#### 4. CMS y Aplicaciones Completas
- `wordpress:6.4.2-php8.1-apache`
- `nextcloud:latest`
- `gitlab/gitlab-ce:latest`

### Contenido de Confianza

 Badge  Significado 
--------------------
 **Official Image**  Mantenida por Docker Inc. Segura para producción 
 **Verified Publisher**  Usuario verificado por Docker. Actualizada regularmente 
 **Sponsored**  Proyecto open-source patrocinado por Docker 

### Entendiendo Docker Hub

**Pestaña Overview:**
- Descripción de la imagen
- Etiquetas disponibles
- Cómo crear contenedores
- Variables de entorno
- Volúmenes persistentes
- Ejemplos Docker Compose

**Pestaña Tags:**
Lista todas las versiones disponibles por SO y arquitectura

---

## Gestión de Imágenes: Comandos

### Descargar Imágenes

```bash
# Forma 1: Pull explícito
docker pull ubuntu:22.04
docker pull josedom24/servidorweb:v2

# Forma 2: Automático al crear contenedor
docker run ubuntu echo "hello"  # Descarga si no existe
```

### Listar Imágenes

```bash
# Ver todas
docker images
docker image ls

# Ver con tamaño
docker images -a

# Formato personalizado
docker images --format "table {{.Repository}}\t{{.Size}}"
```

### Información de Imágenes

```bash
docker inspect nombre:tag       # Info detallada (JSON)
docker history nombre:tag       # Ver capas y cómo se crearon
```

### Eliminar Imágenes

```bash
# Eliminar una
docker rmi nombre:tag

# Forzado (si hay contenedores)
docker rmi -f nombre:tag

# Eliminar sin etiqueta
docker rmi image_id

# Limpiar todas no usadas
docker image prune
```

### Ver Uso de Espacio

```bash
# Resumen
docker system df

# Detallado
docker system df -v
```

---

## Concepto: Pull vs Run

```bash
# docker pull: Descargar solo
docker pull nginx:latest
# → Imagen descargada, lista para usar

# docker run: Descargar + crear contenedor
docker run -d --name web nginx
# → Descarga si no existe + crea + ejecuta

# Equivalente a:
docker pull nginx:latest
docker run -d --name web nginx:latest
```

---

## Casos de Uso Prácticos

### Caso 1: Usar una Imagen Base del Hub

```bash
# Buscar en hub.docker.com: "python"
# Encontrar: python:3.12-slim-bookworm

docker pull python:3.12-slim-bookworm
docker run -it python:3.12-slim-bookworm python --version
# Python 3.12.2
```

### Caso 2: Servicio con Versión Específica

```bash
# Buscar: "mariadb"
# Encontrar: mariadb:11.2-jammy

docker pull mariadb:11.2-jammy
docker run -d --name db \
  -e MYSQL_ROOT_PASSWORD=secret \
  mariadb:11.2-jammy
```

### Caso 3: Etiqueta Latest vs Versión

```bash
# ✅ Bueno para desarrollo
docker run postgres:latest  # Última versión

# ✅ Mejor para producción (reproducible)
docker run postgres:15-alpine  # Versión específica
```

---

## Conceptos Clave del Módulo

1. **Capas:** Las imágenes están construidas en capas inmutables
2. **Compartición:** Las capas se comparten entre imágenes (eficiente)
3. **Efímeros:** Los contenedores son efímeros (capa R/W temporal)
4. **Docker Hub:** Registro público con millones de imágenes
5. **Etiquetas:** Identifican versiones (v1, latest, alpine, etc.)
6. **Confianza:** Buscar badges (Official, Verified Publisher)
7. **Tipos:** SO, servicios, lenguajes, CMS
8. **Comandos:** pull, images, rmi, inspect, history

---

## Relaciones

### Conecta con
- [[docker|Docker]] — Plataforma base
- Docker Hub — Registro de imágenes
- [[contenedores|Contenedores]] — Basados en imágenes
- [[dockerfile-y-construccion|Dockerfile]] — Cómo construir imágenes

---

## Flujo Típico

```
1. Buscar en Docker Hub: hub.docker.com
2. Leer documentación (Variables, volúmenes, etc.)
3. docker pull imagen:tag
4. docker run [opciones] imagen:tag
5. docker ps / docker logs para debugging
```

---

## Fuentes

- [Curso: Docker 2024 - Módulo 3](https://plataforma.josedomingo.org/pledin/cursos/docker2024/)
- [Docker Hub](https://hub.docker.com)
