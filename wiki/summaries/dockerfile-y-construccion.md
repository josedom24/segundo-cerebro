---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_docker_ow]
tags: [dockerfile, docker-build, image-creation, best-practices]
---

# Creación de Imágenes

## Resumen de una línea
Cómo construir imágenes Docker personalizadas con Dockerfile, docker build, caching, y mejores prácticas para aplicaciones en producción.

## Información
- **Fuente:** Curso Docker 2024 - Módulo 7
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo7
- **URL GitHub:** https://github.com/josedom24/curso_docker_ow
- **Líneas de contenido:** 1138
- **Nota:** Módulo más grande del curso

---

## El Problema: Por Qué Dockerfile

### Forma Manual (❌ No reproducible)

```bash
# Crear contenedor
docker run -it ubuntu bash

# Instalar software dentro
root@abc123:/# apt-get update
root@abc123:/# apt-get install -y apache2
root@abc123:/# echo "<h1>Hello</h1>" > /var/www/html/index.html

# Guardar como imagen
docker commit abc123 mi-apache:v1
```

**Problemas:**
- ❌ No reproducible
- ❌ Difícil de documentar
- ❌ Imposible automatizar
- ❌ Variabilidad entre compilaciones

### Forma Declarativa (✅ Reproducible)

```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y apache2
COPY index.html /var/www/html/
EXPOSE 80
CMD ["apache2ctl", "-D", "FOREGROUND"]
```

**Ventajas:**
- ✅ Reproducible
- ✅ Autodocumentado
- ✅ Versionable (git)
- ✅ Automatizable

---

## Dockerfile: Sintaxis Completa

### Estructura Básica

```dockerfile
# syntax=docker/dockerfile:1         # Parser directive

FROM ubuntu:22.04                    # Imagen base (obligatorio)

LABEL maintainer="user@example.com"  # Metadatos

ENV APP_HOME=/app                    # Variables de entorno
ENV DEBUG=false

RUN apt-get update && \              # Comandos en build
    apt-get install -y python3

WORKDIR /app                         # Directorio de trabajo

COPY app.py .                        # Copiar archivos del host
ADD https://example.com/file .       # Descargar URL

EXPOSE 8000                          # Documentar puerto (no expone realmente)

USER appuser                         # Usuario que ejecuta

ENTRYPOINT ["python3"]               # Comando principal (fijo)
CMD ["app.py"]                       # Argumentos por defecto (sobrescribible)
```

### Instrucciones Principales

#### FROM (Obligatorio)
```dockerfile
FROM ubuntu:22.04
FROM python:3.11-slim
FROM node:18-alpine
FROM scratch                 # Imagen vacía (para binarios)
```

#### RUN (Ejecutar Comandos en Build)
```dockerfile
# Forma shell (con /bin/sh -c)
RUN apt-get update

# Forma exec (recomendado)
RUN ["apt-get", "install", "-y", "curl"]

# Múltiples líneas (mejor legibilidad)
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean
```

#### COPY vs ADD
```dockerfile
COPY file.txt /app/                 # Copiar archivos locales
COPY src/ /app/src/                 # Copiar directorios

ADD https://example.com/file .      # Descargar URL
ADD archive.tar.gz /app/            # Descomprimir automáticamente

# ⚠️ COPY es más explícito, preferible en la mayoría de casos
```

#### WORKDIR (Directorio de Trabajo)
```dockerfile
WORKDIR /app
RUN mkdir -p /app/config
COPY . .                            # Copia en /app

# Equivalente a: cd /app en un contenedor
```

#### ENV (Variables de Entorno)
```dockerfile
ENV NODE_ENV=production
ENV DATABASE_URL="postgres://localhost/db"

# Accesibles en tiempo de ejecución
# docker run -e OVERRIDE=value
```

#### EXPOSE (Documentar Puertos)
```dockerfile
EXPOSE 80
EXPOSE 443
EXPOSE 3000/tcp
EXPOSE 5000/udp

# Solo documentación, no expone realmente
# docker run -p 8080:80 para exponer
```

#### ENTRYPOINT vs CMD

```dockerfile
# ENTRYPOINT: Comando principal (fijo, no se sobrescribe)
ENTRYPOINT ["python"]

# CMD: Argumentos por defecto (se sobrescribe)
CMD ["app.py"]

# Resultado: python app.py
```

**Diferencias:**
```bash
# Con ENTRYPOINT + CMD
docker run mi-image               # python app.py
docker run mi-image server.py     # python server.py

# Con solo CMD
docker run mi-image               # arg.py
docker run mi-image echo "hello"  # echo hello
```

#### USER (Usuario que Ejecuta)
```dockerfile
RUN useradd -m appuser
USER appuser
# Contenedor ejecuta como appuser (no root)
```

---

## docker build: Construir Imágenes

### Sintaxis Básica

```bash
docker build -t nombre:tag [contexto]
```

### Ejemplos

```bash
# Construir en directorio actual
docker build -t mi-app:1.0 .

# Con múltiples tags
docker build -t usuario/repo:1.0 -t usuario/repo:latest .

# Especificar Dockerfile
docker build -t app:latest -f Dockerfile.prod .

# Con argumentos de build
docker build --build-arg ENV=production -t app .

# Sin caché
docker build --no-cache -t app .

# Con labels
docker build --label version=1.0 --label env=prod -t app .
```

### Contexto de Build

```
build/
├── Dockerfile         # Instrucciones
├── app.py
├── requirements.txt
├── .dockerignore      # Archivos a excluir
└── config/
    └── settings.yaml
```

```bash
docker build -t app .  # `.` = contexto (directorio actual)
```

**Archivos excluidos con .dockerignore:**
```
.git
.gitignore
node_modules
__pycache__
*.pyc
.env
```

### Ver Capas

```bash
docker history mi-app:1.0

# Output:
IMAGE          CREATED          CREATED BY                           SIZE
abc123         2 minutes ago    /bin/sh -c echo "done"              0B
def456         2 minutes ago    COPY app.py .                       1.2MB
ghi789         2 minutes ago    RUN apt-get install -y curl        10MB
jkl012         2 minutes ago    /bin/sh -c #(nop) WORKDIR /app      0B
```

---

## Caching en Docker Build

### Cómo Funciona

```dockerfile
FROM ubuntu:22.04              # Capa 1 (caché hit)
RUN apt-get update && \
    apt-get install -y curl    # Capa 2 (caché hit)
COPY app.py .                  # Capa 3 (caché hit)
RUN python app.py              # Capa 4 (caché hit, sin cambios)
```

Primera compilación: Todas las capas se generan

```dockerfile
# Modifica app.py y recompila
RUN python app.py              # Capa 4 (CACHÉ INVÁLIDA)
```

Segunda compilación: Solo recompila desde la primera capa modificada

### Optimizar Caching

**❌ Ineficiente:**
```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y curl wget git
COPY . /app                                    # Copia TODO
RUN python app.py
```

Problema: Cambiar cualquier archivo → Recompila desde la copia

**✅ Eficiente:**
```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y curl wget git
COPY requirements.txt .                        # Solo dependencias
RUN pip install -r requirements.txt            # Caché si no cambia
COPY . /app                                    # Copia código (cambia frecuente)
RUN python app.py
```

Beneficio: Cambiar código no invalida caché de dependencias

### Estrategias

1. **FROM primero:** Base no cambia
2. **RUN apt-get primero:** Dependencias del SO
3. **COPY dependencias:** requirements.txt, package.json
4. **RUN install:** Instalar dependencias
5. **COPY código:** Código fuente (cambia frecuente)
6. **Comandos:** CMD/ENTRYPOINT al final

---

## Ciclo de Vida de Aplicaciones Docker

```
1. Desarrollo     (escribir código + Dockerfile)
   ↓
2. Build          (docker build → imagen)
   ↓
3. Test           (docker run en dev/test)
   ↓
4. Distribución   (docker push a Docker Hub)
   ↓
5. Producción     (docker run en prod)
   ↓
6. Actualización  (volver al paso 1 si cambios)
```

---

## Casos de Uso Prácticos

### Caso 1: Aplicación Web Estática

```dockerfile
FROM nginx:alpine
COPY html/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t web-static:1.0 .
docker run -d -p 8080:80 web-static:1.0
```

### Caso 2: Aplicación Python

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

ENV FLASK_APP=app.py

CMD ["flask", "run", "--host=0.0.0.0"]
```

```bash
docker build -t flask-app:1.0 .
docker run -d -p 5000:5000 flask-app:1.0
```

### Caso 3: Aplicación Node.js

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Caso 4: Multi-stage (Pequeño)

```dockerfile
# Stage 1: Build
FROM node:18 as builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json .
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

Beneficio: Imagen final sin herramientas de build (más pequeña)

---

## Mejores Prácticas

### 1. Usar Imágenes Base Pequeñas
```dockerfile
# ❌ 300MB
FROM ubuntu:22.04

# ✅ 80MB
FROM debian:bookworm-slim

# ✅✅ 5MB
FROM alpine:3.18
```

### 2. Minimizar Capas
```dockerfile
# ❌ 3 capas
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git

# ✅ 1 capa
RUN apt-get update && \
    apt-get install -y curl git && \
    apt-get clean
```

### 3. Limpiar Después de RUN
```dockerfile
# ❌ Deja residuos
RUN apt-get install -y build-essential

# ✅ Limpia caché
RUN apt-get update && \
    apt-get install -y build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### 4. No Ejecutar como Root
```dockerfile
RUN useradd -m appuser
USER appuser
```

### 5. Usar .dockerignore
```
.git
node_modules
__pycache__
.env
.pytest_cache
```

### 6. Healthchecks
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/  exit 1
```

---

## Conceptos Clave

1. **Dockerfile:** Receta declarativa (no procedural)
2. **Capas:** Cada instrucción crea una capa
3. **Caché:** Reutiliza capas si no cambian
4. **Contexto:** Directorio que se envía a Docker daemon
5. **ENTRYPOINT:** Comando fijo (no sobrescribible)
6. **CMD:** Argumentos (sobrescribibles)
7. **Multi-stage:** Separar build de runtime
8. **Reproducibilidad:** Mismo Dockerfile = misma imagen

---

## Flujo Típico

```bash
# 1. Escribir Dockerfile
# 2. Construir
docker build -t myapp:1.0 .

# 3. Verificar
docker images myapp

# 4. Ejecutar localmente
docker run -d -p 8080:80 myapp:1.0

# 5. Distribuir
docker push myregistry.com/myapp:1.0

# 6. Usar en producción
docker run -d myregistry.com/myapp:1.0
```

---

## Relaciones

### Conecta con
- [[dockerfile]] — Concepto y sintaxis
- [[docker]] — Plataforma base
- [[docker-compose|Docker Compose]] — Define imágenes a construir

### Parte de
- Construcción y automatización de imágenes
- Infrastructure as Code declarativo

---

## Fuentes

- [Curso Docker 2024 - Módulo 7](https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo7)
