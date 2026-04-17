---
title: "Docker Compose"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_docker_ow]
tags: [docker, orquestacion]
---

# Docker Compose

## Resumen de una línea
Cómo orquestar múltiples contenedores declarativamente con `docker-compose.yaml`: servicios, volúmenes, redes y ciclo de vida.

## Información
- **Fuente:** Curso Docker 2024 - Módulo 6
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/
- **URL GitHub:** https://github.com/josedom24/curso_docker_ow
- **Líneas de contenido:** 913


## El Problema: Múltiples Contenedores

### Sin Docker Compose (Manual)

```bash
# Crear red
docker network create app-net

# Base de datos
docker run -d \
  --name mysql-db \
  --network app-net \
  -e MYSQL_ROOT_PASSWORD=secret \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0

# Cache
docker run -d \
  --name redis-cache \
  --network app-net \
  redis:7

# API
docker run -d \
  --name api \
  --network app-net \
  -p 3000:3000 \
  mi-api:latest

# Web
docker run -d \
  --name web \
  --network app-net \
  -p 80:80 \
  mi-web:latest
```

**Problemas:**
- ❌ Comandos largos y complejos
- ❌ Difícil de recordar
- ❌ Fácil de equivocarse
- ❌ No reproducible
- ❌ Difícil de documentar

### Con Docker Compose (Declarativo)

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
    volumes:
      - mysql-data:/var/lib/mysql

  redis:
    image: redis:7

  api:
    image: mi-api:latest
    ports:
      - "3000:3000"
    depends_on:
      - mysql
      - redis

  web:
    image: mi-web:latest
    ports:
      - "80:80"

volumes:
  mysql-data:
```

**Ventajas:**
- ✅ Todo en un archivo
- ✅ Reproducible
- ✅ Autodocumentado
- ✅ Fácil de versionar (git)
- ✅ Portable


## Estructura Básica del `compose.yaml`

```yaml
version: '3.8'              # Versión de Compose

services:                   # Define los contenedores
  nombre-servicio:
    image: imagen:tag       # O build: .
    container_name: nombre
    ports:
      - "8080:80"          # Puerto host:container
    environment:            # Variables de entorno
      VAR: valor
      DB_HOST: mysql
    volumes:                # Almacenamiento
      - volumen-nombrado:/datos
      - ./local:/container
    depends_on:             # Orden de inicio
      - mysql
    networks:               # Redes
      - app-net
    restart: always         # Policy de reinicio

volumes:                    # Volúmenes persistentes
  volumen-nombrado:
    driver: local

networks:                   # Redes personalizadas
  app-net:
    driver: bridge
```


## Secciones Principales

### 1. `services` (Contenedores)

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: my-mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: myapp
    volumes:
      - db-data:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - app-net
    restart: unless-stopped
```

**Opciones comunes:**
- `image`: Imagen Docker
- `build`: Path a Dockerfile (en lugar de image)
- `container_name`: Nombre del contenedor
- `environment`: Variables de entorno
- `volumes`: Almacenamiento
- `ports`: Mapeamiento de puertos
- `depends_on`: Otros servicios que debe esperar
- `networks`: Redes a las que conectar
- `restart`: Política de reinicio (always, unless-stopped, on-failure)
- `command`: Sobrescribir comando
- `working_dir`: Directorio de trabajo
- `user`: Usuario que ejecuta

### 2. `volumes` (Almacenamiento Persistente)

```yaml
volumes:
  mysql-data:               # Volumen nombrado
    driver: local
  
  redis-data:
    driver: local
```

**Usar en servicios:**
```yaml
services:
  mysql:
    volumes:
      - mysql-data:/var/lib/mysql  # Volumen nombrado
      - ./backup:/backup            # Bind mount
```

### 3. `networks` (Redes)

```yaml
networks:
  app-net:
    driver: bridge
    ipam:
      config:
        - subnet: 192.168.1.0/24
```

**Usar en servicios:**
```yaml
services:
  app:
    networks:
      - app-net
```


## Comandos Docker Compose

### `docker compose up` - Crear e Iniciar

```bash
# Iniciar en foreground
docker compose up

# Iniciar en background
docker compose up -d

# Reconstruir imágenes
docker compose up --build

# Forzar creación de nuevos contenedores
docker compose up --force-recreate
```

**Qué hace:**
1. Crea red (si no existe)
2. Crea volúmenes (si no existen)
3. Crea contenedores
4. Inicia contenedores
5. Respeta `depends_on`

### `docker compose ps` - Ver Estado

```bash
docker compose ps

# Output:
NAME          IMAGE         SERVICE   STATUS
mysql-db      mysql:8.0     mysql     Up 2 minutes
api           mi-api:latest api       Up 1 minute
```

### `docker compose logs` - Ver Logs

```bash
# Logs de todos
docker compose logs

# Logs de un servicio
docker compose logs mysql

# Seguir en vivo (-f)
docker compose logs -f api

# Últimas 50 líneas
docker compose logs --tail 50 mysql
```

### `docker compose exec` - Ejecutar en Contenedor

```bash
# Comando simple
docker compose exec mysql mysql -u root -p

# Shell interactivo
docker compose exec api bash

# Sin TTY (-T)
docker compose exec -T api npm test
```

### `docker compose stop` - Parar

```bash
docker compose stop             # Para todos
docker compose stop mysql       # Para uno
```

### `docker compose start` - Reiniciar

```bash
docker compose start            # Inicia todos parados
```

### `docker compose down` - Eliminar

```bash
# Elimina contenedores y redes (mantiene volúmenes)
docker compose down

# Elimina incluyendo volúmenes
docker compose down -v

# Elimina imagenes
docker compose down --rmi all
```

### `docker compose build` - Construir Imágenes

```bash
# Construir todas
docker compose build

# Construir una
docker compose build api

# Sin cachés
docker compose build --no-cache
```


## Variables de Entorno y Parámetros

### Método 1: `.env` File

```bash
# archivo .env
MYSQL_ROOT_PASSWORD=secreto123
APP_PORT=3000
APP_DEBUG=true
```

```yaml
# compose.yaml
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
```

```bash
# Ejecutar
docker compose up -d
# Automáticamente lee .env
```

### Método 2: Variables Directas

```yaml
services:
  app:
    image: mi-app:latest
    environment:
      DEBUG: "true"
      PORT: "3000"
```

### Método 3: Desde Archivo

```yaml
services:
  app:
    env_file:
      - .env
      - .env.local
```


## Casos de Uso Prácticos

### Caso 1: WordPress + MariaDB

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
      WORDPRESS_DB_USER: user
      WORDPRESS_DB_PASSWORD: password
    volumes:
      - wordpress:/var/www/html
    depends_on:
      - db

  db:
    image: mariadb:latest
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: user
      MYSQL_PASSWORD: password
      MYSQL_ROOT_PASSWORD: rootpass
    volumes:
      - db-data:/var/lib/mysql

volumes:
  wordpress:
  db-data:
```

**Usar:**
```bash
docker compose up -d
# WordPress en http://localhost
```

### Caso 2: Node.js + MongoDB

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      MONGO_URL: mongodb://mongo:27017/myapp
    depends_on:
      - mongo
    volumes:
      - ./src:/app/src

  mongo:
    image: mongo:latest
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Caso 3: Multi-tier con Redis

```yaml
version: '3.8'
services:
  frontend:
    image: my-frontend:latest
    ports:
      - "80:80"
    environment:
      API_URL: http://api:3000
    depends_on:
      - api

  api:
    image: my-api:latest
    ports:
      - "3000:3000"
    environment:
      REDIS_URL: redis://redis:6379
      DB_HOST: db
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

  redis:
    image: redis:7
    volumes:
      - redis-data:/data

volumes:
  db-data:
  redis-data:
```


## Dependencias: `depends_on`

### Esperar Que Exista

```yaml
services:
  app:
    depends_on:
      - db
      - redis
```

**Qué hace:**
- Inicia `db` y `redis` primero
- Luego inicia `app`
- ⚠️ No espera a que estén listos, solo que existan

### Esperar Que Esté Listo (Healthcheck)

```yaml
services:
  db:
    image: postgres:14
    healthcheck:
      test: ["CMD", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    depends_on:
      db:
        condition: service_healthy
```


## Build desde Dockerfile

```yaml
services:
  api:
    build: .                      # Path a Dockerfile
    # O con contexto específico:
    build:
      context: ./api
      dockerfile: Dockerfile
      args:
        BUILD_ENV: production
```

**Con variables:**
```yaml
services:
  app:
    build:
      context: .
      args:
        NODE_ENV: ${APP_ENV}
```


## Restart Policies

```yaml
restart: always              # Siempre reinicia
restart: unless-stopped      # Excepto si fue detenido
restart: on-failure          # Solo si falla
restart: on-failure:3        # Max 3 intentos
restart: no                  # No reiniciar
```


## Conceptos Clave

1. **Declarativo:** Define estado deseado, no comandos
2. **Reproducible:** Mismo compose.yaml = mismo resultado
3. **Servicios:** Contenedores nombrados que se comunican
4. **Redes:** Automáticas, DNS entre servicios
5. **Volúmenes:** Persistencia declarada
6. **Dependencias:** Orden de inicio (`depends_on`)
7. **Variables:** Configuración externa (.env)
8. **Ciclo de vida:** up, ps, logs, exec, down


## Flujo Típico

```bash
# Desarrollo
docker compose up -d
docker compose logs -f api
# Editar código
# Cambios automáticos (si bind mount)

# Testing
docker compose exec api npm test

# Producción
docker compose down -v
docker compose up -d --build

# Limpieza
docker compose down -v
```


## Relaciones

### Conecta con
- [[docker-compose|Docker Compose]] — Package manager de multi-contenedores
- [[docker|Docker]] — Plataforma base
- [[dockerfile-y-construccion|Creación de Imágenes]] — Define imágenes que Compose orquesta
- [[volumenes-bind-mounts|Almacenamiento]] — Define volúmenes
- [[redes-docker|Redes en Docker]] — Define redes

### Parte de
- Orquestación de múltiples contenedores
- Infrastructure as Code declarativo


## Fuentes

- [Curso: Docker 2024 - Módulo 6](https://plataforma.josedomingo.org/pledin/cursos/docker2024/)
