---
title: "Gestión de Pods en Podman"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_podman_ow]
tags: [kubernetes, podman, pods]
---

# Gestión de Pods en Podman

## Resumen de una línea
Pods en Podman: grupos nativos de contenedores que comparten IP y almacenamiento, generan YAML de Kubernetes automáticamente.

## Información
- **Fuente:** Curso Podman 2024 - Módulo 5


## Concepto: Pod en Podman

**Pod** = grupo de contenedores relacionados que comparten:
- IP única
- Almacenamiento
- Ciclo de vida

```bash
# Crear pod
podman pod create --name mypod

# Ejecutar contenedores en el pod
podman run --pod mypod nginx
podman run --pod mypod php-fpm

# Ambos compartirán localhost:80, localhost:9000
```


## Gestión de Pods

### Crear y Ver

```bash
# Crear
podman pod create mypod

# Listar
podman pod ls

# Detalles
podman pod inspect mypod
```

### Contenedores en Pod

```bash
# Ver contenedores del pod
podman ps --pod

# Ejecutar en pod
podman run --pod mypod -d nginx
```

### Ciclo de Vida

```bash
# Parar pod (para todos los contenedores)
podman pod stop mypod

# Iniciar
podman pod start mypod

# Eliminar
podman pod rm mypod
```


## Almacenamiento Compartido

```bash
# Volumen compartido en pod
podman volume create shared

# Contenedor 1
podman run --pod mypod -v shared:/data1 busybox

# Contenedor 2
podman run --pod mypod -v shared:/data2 busybox

# Ambos acceden a mismo almacenamiento
```


## Generación de YAML Kubernetes

**Característica única:** Podman genera YAML de Kubernetes

```bash
# Ejecutar contenedores en Podman
podman pod create mypod
podman run --pod mypod nginx
podman run --pod mypod php-fpm

# Exportar a YAML de Kubernetes
podman generate kube mypod > mypod.yaml

# Ejecutar en Kubernetes
kubectl apply -f mypod.yaml
```


## Casos de Uso

### WordPress + MariaDB

```bash
# Crear pod
podman pod create wordpress-pod

# MariaDB
podman run --pod wordpress-pod \
  -e MYSQL_ROOT_PASSWORD=secret \
  mariadb

# WordPress
podman run --pod wordpress-pod \
  -e WORDPRESS_DB_HOST=localhost \
  wordpress

# Ambos comparten red automáticamente
```


## Relaciones

### Conecta con
- [[introduccion-podman|Introducción]] — Feature única de Podman
- [[kubernetes|Kubernetes]] — Generate YAML compatible

### Diferencia con
- [[docker|Docker]] — Docker usa Swarm, Podman usa Pods nativos


## Fuentes

- [Curso Podman 2024 (GitHub)](https://github.com/josedom24/curso_podman_ow)
