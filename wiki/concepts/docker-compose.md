---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_docker_ow]
tags: [docker, orchestration, docker-compose, infrastructure]
---

# Docker Compose

## Resumen de una línea
Herramienta que define y ejecuta aplicaciones multicontenedor mediante un archivo YAML declarativo (docker-compose.yaml), automatizando redes, volúmenes y servicios.

## Definición
Docker Compose es una herramienta que permite definir múltiples contenedores Docker interdependientes en un único archivo `docker-compose.yaml`. Automatiza la creación de redes, volúmenes y la orquestación simple para escenarios multicontenedor.

## Problema que Resuelve

Sin Docker Compose (manual):
```bash
# Crear red
docker network create app-network

# Crear volumen
docker volume create db-data

# Crear contenedor 1 (Base de datos)
docker run -d --name mariadb --network app-network \
  -e MYSQL_ROOT_PASSWORD=secret \
  -v db-data:/var/lib/mysql \
  mariadb:11

# Crear contenedor 2 (Aplicación web)
docker run -d --name app --network app-network \
  -p 8080:80 \
  -e DB_HOST=mariadb \
  mi-app:1.0

# Crear contenedor 3 (Reverse proxy)
docker run -d --name nginx --network app-network \
  -p 80:80 \
  -v nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx:alpine
```

Con Docker Compose (declarativo):
```yaml
version: '3.8'
services:
  mariadb:
    image: mariadb:11
    environment:
      MYSQL_ROOT_PASSWORD: secret
    volumes:
      - db-data:/var/lib/mysql

  app:
    image: mi-app:1.0
    depends_on:
      - mariadb
    environment:
      DB_HOST: mariadb

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
```

## Estructura del archivo docker-compose.yaml

```yaml
version: '3.8'              # Versión de Docker Compose

services:                   # Define contenedores
  nombre-servicio:
    image: imagen:tag       # O build: .
    container_name: nombre
    ports:
      - "8080:80"          # Puerto host:contenedor
    environment:            # Variables de entorno
      VAR: valor
      DB_HOST: otro-servicio
    volumes:                # Almacenamiento
      - ./local:/container/path
      - volumen-nombrado:/datos
    depends_on:             # Orden de inicio
      - otro-servicio
    networks:               # Redes
      - mi-red

volumes:                    # Volúmenes persistentes
  volumen-nombrado:
    driver: local

networks:                   # Redes personalizadas
  mi-red:
    driver: bridge
```

## Conceptos Principales

### Servicios
Cada contenedor es un "servicio". Se crea a partir de una imagen o se construye con Dockerfile.

```yaml
services:
  web:
    image: nginx:latest           # Usar imagen existente
    # O:
    build:                        # Construir desde Dockerfile
      context: .
      dockerfile: Dockerfile
```

### Redes
Por defecto, Docker Compose crea una red bridge donde todos los servicios pueden comunicarse usando su nombre:

```yaml
services:
  app:
    environment:
      DB_HOST: mariadb  # ← Resuelve a IP de MariaDB automáticamente
  mariadb:
    image: mariadb
```

### Volúmenes
Almacenamiento persistente que persiste aunque se elimine el contenedor.

```yaml
volumes:
  datos:                  # Volumen nombrado (gestionado por Docker)
  
services:
  db:
    volumes:
      - datos:/var/lib/mysql      # Montar volumen
      - ./backup:/backup:ro        # Bind mount (lectura)
```

### Variables de Entorno
Configuración inyectada en contenedores (sin hardcodear).

```yaml
services:
  app:
    environment:
      DEBUG: "true"
      DATABASE_URL: postgres://db:5432/myapp
      
# O desde archivo:
    env_file:
      - .env
```

### Dependencias
Especificar orden de inicio (esperar a que servicios estén listos).

```yaml
services:
  web:
    depends_on:
      - db           # Inicia db antes que web
```

## Comandos Principales

```bash
# Crear e iniciar servicios
docker compose up -d

# Ver estado
docker compose ps

# Ver logs
docker compose logs -f nombre-servicio

# Ejecutar comando en servicio
docker compose exec mariadb mysql -u root -p

# Parar servicios
docker compose down

# Reconstruir imágenes
docker compose up --build
```

## Ejemplos Reales

### WordPress + MariaDB
```yaml
version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "80:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DB_USER: admin
      WORDPRESS_DB_PASSWORD: secret
    depends_on:
      - db
    volumes:
      - wordpress-data:/var/www/html

  db:
    image: mariadb:latest
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: wordpress
      MYSQL_USER: admin
      MYSQL_PASSWORD: secret
    volumes:
      - db-data:/var/lib/mysql

volumes:
  wordpress-data:
  db-data:
```

### Aplicación Python + Redis + PostgreSQL
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      REDIS_URL: redis://redis:6379
      DATABASE_URL: postgres://user:pass@db:5432/appdb
    depends_on:
      - redis
      - db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

## Características Avanzadas

### Override de comandos
```yaml
services:
  app:
    image: python-app
    command: python manage.py runserver 0.0.0.0:8000
    # Sobrescribe el CMD del Dockerfile
```

### Healthchecks
```yaml
services:
  db:
    image: mariadb
    healthcheck:
      test: ["CMD", "mysqladmin", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### Perfiles (dev vs prod)
```yaml
services:
  debug-tool:
    image: debug:latest
    profiles:
      - debug    # Solo con: docker compose --profile debug up
```

## Variables y Parámetros

### Archivo .env
```bash
MYSQL_ROOT_PASSWORD=secreto123
APP_DEBUG=true
APP_PORT=8080
```

### Uso en compose
```yaml
services:
  app:
    ports:
      - "${APP_PORT}:80"
    environment:
      DEBUG: "${APP_DEBUG}"
```

## Escalado de Servicios

```bash
# Escalar a 3 instancias
docker compose up -d --scale app=3

# Equilibrador de carga necesario (nginx, haproxy)
```

## Ciclo de Vida Típico

1. **Desarrollo:** Escribir docker-compose.yaml
2. **Test local:** `docker compose up` en máquina
3. **Producción:** Deployment con docker compose
4. **Actualizaciones:** `docker compose pull && docker compose up --build`

## Limitaciones y Próximo Paso

**Docker Compose para:**
- Desarrollo local
- Testing
- Pequeños despliegues en single-host

**Cuando necesitas Kubernetes:**
- Múltiples hosts
- Auto-scaling
- Rolling updates complejos
- Orquestación global

## Relaciones

### Conecta con
- [[Docker]] — Plataforma contenedora base
- [[Dockerfile]] — Define imágenes que Compose orquesta
- [[Contenedores]] — Unidades que Compose orquesta

### Parte de
- Orquestación de múltiples contenedores
- Prácticas modernas DevOps

### Contrasta con
- [[Kubernetes]] — Orquestación a mayor escala, multi-nodo
- [[KVM]] — Máquinas virtuales con mayor overhead

## Fuentes
- [Curso Docker 2024 - Docker Compose](../summaries/docker-compose.md) — Orquestación de múltiples contenedores
