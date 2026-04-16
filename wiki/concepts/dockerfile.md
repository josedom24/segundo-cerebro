---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_docker_ow]
tags: [docker, dockerfile, image-building, infrastructure]
---

# Dockerfile

## Resumen de una línea
Formato declarativo de script que define cómo construir una imagen Docker especificando la imagen base, dependencias e instrucciones de ejecución.

## Definición
Archivo de configuración (sin extensión) que describe los pasos necesarios para construir una imagen Docker. Funciona como un "receta" que Docker ejecuta capa por capa para crear una imagen final.

## Sintaxis Básica

```dockerfile
FROM ubuntu:22.04              # Imagen base obligatoria
LABEL maintainer="tu@email"    # Metadatos
RUN apt-get update             # Ejecutar comando en build
RUN apt-get install -y python3 # Instalar dependencias
COPY app.py /app/              # Copiar archivos del host
WORKDIR /app                   # Directorio de trabajo
EXPOSE 8080                    # Puerto expuesto (documentación)
ENV DEBUG=true                 # Variables de entorno
ENTRYPOINT ["python3"]         # Comando principal
CMD ["app.py"]                 # Argumentos por defecto
```

## Instrucciones Principales

### Obligatorias
- **FROM:** Imagen base (primera instrucción, obligatoria)

### De construcción
- **RUN:** Ejecutar comandos durante el build
- **COPY:** Copiar archivos del host al contenedor
- **ADD:** Como COPY pero puede descargar URLs y descomprimir
- **WORKDIR:** Establecer directorio de trabajo

### De configuración
- **ENV:** Variables de entorno
- **EXPOSE:** Documentar qué puertos expone la aplicación
- **LABEL:** Metadatos (key-value)
- **ARG:** Argumentos de build (variables temporales)

### De ejecución
- **ENTRYPOINT:** Comando principal (NO se puede sobrescribir)
- **CMD:** Argumentos/comando por defecto (se puede sobrescribir)

## Proceso de Build

```bash
docker build -t mi-imagen:1.0 .
```

1. Lee el Dockerfile línea por línea
2. Ejecuta cada instrucción en una **capa nueva**
3. Cachea cada capa para acelerar builds posteriores
4. Crea imagen final combinando todas las capas

## Capas y Optimización

```dockerfile
# ❌ Ineficiente: 5 capas innecesarias
FROM ubuntu:22.04
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y wget
RUN apt-get install -y git

# ✅ Eficiente: 1 capa
FROM ubuntu:22.04
RUN apt-get update && \
    apt-get install -y curl wget git && \
    apt-get clean
```

### Principios
- Menos capas = imagen más pequeña
- Cachear bien: instrucciones frecuentes arriba (apt-get update), código mutable abajo
- Limpiar residuos (apt cache) dentro de la misma instrucción RUN

## Ejemplos Reales

### Página estática
```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Aplicación Python
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

### Aplicación PHP
```dockerfile
FROM php:8.2-apache
COPY . /var/www/html/
RUN docker-php-ext-install pdo_mysql
EXPOSE 80
```

### Con variables de entorno
```dockerfile
FROM alpine:latest
ARG APP_VERSION=1.0
ENV APP_VERSION=$APP_VERSION
RUN echo "Building version $APP_VERSION"
```

## Mejores Prácticas

| Práctica | Razón |
|----------|-------|
| **Usa imágenes base pequeñas** | alpine (5MB) vs ubuntu (77MB) |
| **Minimiza capas** | Combina RUN con && |
| **Limpia después** | rm -rf, apt-get clean |
| **Ordena instrucciones** | Lo que cambia menos primero |
| **ENTRYPOINT vs CMD** | ENTRYPOINT para comando fijo; CMD para opcionales |
| **Usa .dockerignore** | Excluir archivos innecesarios (node_modules, .git) |

## Construcción Multi-Stage

```dockerfile
# Stage 1: Build
FROM node:18 as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: Runtime
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/
EXPOSE 80
```

Ventaja: La imagen final no incluye herramientas de build, es muy pequeña.

## Relaciones

### Conecta con
- [[Docker]] — Plataforma contenedora que ejecuta Dockerfiles
- [[Docker Compose]] — Puede hacer build de imágenes Dockerfile
- [[Contenedores]] — Tecnología empaquetada en imágenes

### Está relacionado con
- Construcción automatizada de imágenes
- Reproducibilidad e infrastructure as code

### Contrasta con
- **docker commit:** Crear imagen desde contenedor corriendo (manual, no reproducible)
- **Kubernetes manifests:** Dockerfile es para imágenes; Kubernetes es para orquestación

## Ciclo de Vida

1. **Desarrollo:** Escribir Dockerfile
2. **Build:** `docker build` crea imagen
3. **Test:** `docker run` con la imagen
4. **Publicar:** `docker push` a Docker Hub
5. **Deploy:** `docker pull` y `docker run` en producción

## Fuentes
- [Curso Docker 2024 - Dockerfile](../summaries/dockerfile-y-construccion.md) — Creación de imágenes en Docker
