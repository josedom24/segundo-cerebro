---
created: 2026-04-15
updated: 2026-04-15
sources: [docker-jekyll, curso_docker_ow]
tags: [containerization, infrastructure, devops, docker]
aliases: [Docker]
---

# Docker

## Definición
Plataforma de containerización que empaqueta aplicaciones con todas sus dependencias (código, runtime, bibliotecas) en unidades aisladas y reproducibles llamadas contenedores.

## Resumen de una línea
Tecnología de containerización que soluciona "works on my machine" empaquetando aplicaciones completas en unidades aisladas, reproducibles y portables.

## Conceptos Clave Fundamentales

### Arquitectura Principal
- **Contenedor:** Unidad ejecutable aislada que contiene la aplicación, runtime, librerías y configuración
- **Imagen:** Plantilla/snapshot de un contenedor (lectura, inmutable)
- **Dockerfile:** Script declarativo que define cómo construir una imagen
- **Registro:** Almacén centralizado de imágenes (Docker Hub es el oficial)
- **Daemon Docker:** Servicio que gestiona imágenes y contenedores

### Características Técnicas
- **Aislamiento:** Cada contenedor tiene su propio filesystem, procesos y red
- **Capas:** Las imágenes están compuestas de capas (union filesystem)
- **Efímeros:** Los datos dentro del contenedor desaparecen si se elimina (sin volúmenes)

## Ventajas Principales

| Ventaja | Descripción |
|---------|-------------|
| **Reproducibilidad** | "Works on my machine" → "Works everywhere" |
| **Aislamiento** | Sin conflictos de versiones entre aplicaciones |
| **Portabilidad** | Corre igual en dev, test, producción |
| **Escalabilidad** | Crear múltiples instancias es trivial |
| **Ligereza** | Más eficiente que máquinas virtuales |

## Los 5 Pilares de Docker (Curso 2024)

### 1. **Contenedores Básicos**
- Ejecución: `docker run`, `docker exec`, `docker logs`
- Gestión: iniciar, parar, eliminar contenedores
- Labels para metadatos
- Límites de recursos (CPU, memoria)

### 2. **Imágenes**
- Concepto de capas (union filesystem)
- Docker Hub: registro oficial
- Pull/push de imágenes
- Diferencia entre imagen y contenedor
- Almacenamiento en disco

### 3. **Persistencia y Almacenamiento**
- Naturaleza efímera de contenedores
- **Volúmenes:** Storage persistente gestionado por Docker
- **Bind mounts:** Mapear directorios del host al contenedor
- Casos reales: bases de datos, aplicaciones con estado

### 4. **Networking**
- **Red host:** Usa la red del host
- **Red bridge:** Aislamiento con acceso controlado (por defecto)
- **Redes user-defined:** Control total de conectividad
- Resolución DNS interna entre contenedores
- Publicación de puertos

### 5. **Orquestación Simple: Docker Compose**
- Archivo YAML declarativo: `docker-compose.yaml`
- Define servicios, redes y volúmenes
- Variables de entorno
- Escenarios multicontenedor

## Construcción de Imágenes

### Dockerfile
```dockerfile
FROM ubuntu:22.04          # Imagen base
RUN apt-get update         # Instalar dependencias
COPY . /app                # Copiar código
WORKDIR /app               # Directorio de trabajo
EXPOSE 8080                # Puerto expuesto
ENTRYPOINT ["python"]      # Comando principal
CMD ["app.py"]             # Argumentos por defecto
```

### Proceso de Build
1. Lee el Dockerfile
2. Ejecuta cada instrucción en una capa nueva
3. Cachea capas para acelerar builds posteriores
4. Crea imagen final

## Casos de Uso Reales

### Desarrollo Local
- Ambiente aislado sin instalar dependencias globales
- Reproducir exactamente lo que corre en producción

### Ejemplo: Jekyll + Docker
Soluciona conflictos de versiones de gemas Ruby al aislar cada proyecto en su contenedor con Ruby 3.2, Jekyll y Bundler preinstalados.

### Ejemplo: Aplicaciones Web Multi-contenedor
- **WordPress + MariaDB:** Aplicación web + base de datos
- **Guestbook:** Frontend + Redis backend
- **Tomcat + Nginx:** Aplicación Java + reverse proxy

### Persistencia
- **NextCloud:** Almacenamiento compartido con volúmenes
- **MariaDB:** Datos persistentes en volúmenes Docker

## Alternativas y Comparaciones

| Alternativa | vs Docker |
|-------------|-----------|
| **Máquinas Virtuales** | Docker es más ligero, arranque más rápido |
| **Instalaciones directas** | Docker es reproducible y aislado |
| **Kubernetes** | Docker es simple; Kubernetes escala a clusters |
| **LXC/LXD** | Docker es más ecosistema (Hub, tooling) |

## Componentes Relacionados

### Herramientas
- **docker CLI:** Interfaz de línea de comandos
- **Docker Desktop:** GUI (incluye Docker Engine + Compose)
- **Docker Hub:** Registro oficial de imágenes
- **Dockerfile:** Formato de definición de imágenes

### Conceptos Avanzados (Mencionados en curso)
- Prune: Limpiar objetos no usados
- Ciclo de vida de aplicaciones
- Multi-stage builds (en Dockerfile)
- Plugins y extensiones

## Relaciones

### Conecta con
- [[docker-compose|Docker Compose]] — Orquestación de múltiples contenedores
- [[dockerfile-y-construccion|Dockerfile]] — Sintaxis para construir imágenes
- [[contenedores]] — Tecnología subyacente
- [[podman]] — Alternativa daemonless

### Parte de
- Arquitectura de microservicios modernos
- Práct icas DevOps y CI/CD

### Contrasta con
- [[kvm]] — Máquinas virtuales con mayor overhead
- [[kubernetes]] — Docker para single-host; K8s para clusters escalables

## Fuentes
- [Curso Docker 2024 - Introducción](../summaries/introduccion-docker.md) — Inicio del curso
