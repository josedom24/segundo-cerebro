---
title: "Ejecución de Contenedores"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_docker_ow]
tags: [contenedores, docker]
---

# Ejecución de Contenedores

## Resumen de una línea
Cómo ejecutar, gestionar y controlar contenedores Docker: `docker run`, ciclo de vida, mapeamiento de puertos, y operaciones básicas de gestión.

## Información
- **Fuente:** Curso Docker 2024 - Módulo 2
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/
- **URL GitHub:** https://github.com/josedom24/curso_docker_ow
- **Líneas de contenido:** 734


## Conceptos Fundamentales

### 1. Descarga de Imágenes: `docker pull`
```bash
docker pull ubuntu              # Descargar imagen
docker pull ubuntu:22.04        # Versión específica
docker images                   # Ver imágenes descargadas
```

### 2. Ejecución de Contenedores: `docker run`

**Sintaxis básica:**
```bash
docker run [opciones] imagen [comando]
```

**Ejemplos:**
```bash
# Ejecutar comando y salir
docker run ubuntu echo 'Hello World'

# Modo interactivo (stdin)
docker run -it ubuntu bash         # -i (stdin), -t (terminal)

# Modo demonio (background)
docker run -d --name mi-app ubuntu bash -c 'while true; do echo $(date); sleep 1; done'

# Con puerto mapeado
docker run -d -p 8080:80 httpd:2.4   # puerto_host:puerto_contenedor
```

**Opciones comunes:**
- `-d` (--detach): Ejecutar en background
- `-it`: Interactivo con terminal
- `--name`: Nombrar el contenedor
- `-p`: Mapear puertos (host:contenedor)
- `-e`: Variables de entorno
- `-v`: Volúmenes/bind mounts
- `--rm`: Eliminar al terminar

### 3. Ciclo de Vida de Contenedores

```
┌─────────────┐
│   Created   │
└──────┬──────┘
       │ docker start
       ▼
┌─────────────┐
│   Running   │◄─────────┐
└──────┬──────┘          │ docker restart
       │ docker stop     │
       ▼                 │
┌─────────────┐          │
│   Stopped   ├──────────┘
└──────┬──────┘
       │ docker rm
       ▼
┌─────────────┐
│   Deleted   │
└─────────────┘

Operaciones adicionales:
- docker pause: Pausa (sin stop)
- docker unpause: Reanuda
```

**Comandos principales:**
```bash
docker start nombre             # Inicia contenedor parado
docker stop nombre              # Para contenedor en ejecución
docker restart nombre           # Para e inicia
docker pause nombre             # Pausa
docker unpause nombre           # Reanuda
docker rename viejo nuevo       # Renombra
docker rm nombre                # Elimina
docker rm -f nombre             # Elimina forzado (aunque esté corriendo)
```

### 4. Visualización de Información

**Ver contenedores:**
```bash
docker ps                       # Contenedores en ejecución
docker ps -a                    # Todos (incluyendo parados)
docker ps -a --format "table {{.Names}}\t{{.Status}}"  # Formato personalizado
```

**Ver logs:**
```bash
docker logs nombre              # Ver output del contenedor
docker logs -f nombre           # Seguimiento en vivo (-f = follow)
docker logs --tail 50 nombre    # Últimas 50 líneas
```

**Información de eventos:**
```bash
docker events                   # Ver eventos en tiempo real
```

Ejemplo de eventos al crear un contenedor:
```
container create ...
container attach ...
network connect ... (bridge)
container start ...
container die ...    (cuando termina)
```

### 5. Ejecución de Comandos en Contenedor: `docker exec`

```bash
# Ejecutar comando en contenedor corriendo
docker exec nombre comando

# Ejemplos:
docker exec mi-app ls           # Listar archivos
docker exec mi-app cat archivo  # Ver archivo
docker exec mi-app bash         # Shell interactivo
docker exec -it mi-app bash     # Shell interactivo + terminal
```

### 6. Copiar Archivos: `docker cp`

```bash
# Host → Contenedor
docker cp archivo.txt nombre:/ruta/destino

# Contenedor → Host
docker cp nombre:/ruta/archivo.txt .
```

### 7. Información Detallada: `docker inspect`

```bash
# Información completa (JSON)
docker inspect nombre

# Filtrar campos específicos:
docker inspect --format='{{.Id}}' nombre          # ID del contenedor
docker inspect --format='{{.Config.Image}}' nombre # Imagen usado
docker inspect --format='{{.State.Status}}' nombre # Estado actual
docker inspect -s nombre                          # Incluir tamaño
```

### 8. Procesos en Contenedor: `docker top`

```bash
docker top nombre               # Ver procesos corriendo en contenedor
```


## Casos de Uso Prácticos

### Ejemplo 1: Servidor Web Apache

```bash
# Crear contenedor con Apache
docker run -d --name my-apache-app -p 8080:80 httpd:2.4

# Verificar puertos mapeados
docker port my-apache-app
# Salida:
# 80/tcp -> 0.0.0.0:8080
# 80/tcp -> [::]:8080

# Acceder: http://localhost:8080
```

**Conceptos:**
- `-p 8080:80`: Puerto 8080 del host → puerto 80 del contenedor
- Los contenedores no se acceden directamente por IP
- Siempre se mapean puertos explícitamente

### Ejemplo 2: Contenedor con Base de Datos MariaDB

```bash
docker run -d \
  --name mariadb-container \
  -e MYSQL_ROOT_PASSWORD=secreto \
  -p 3306:3306 \
  mariadb:latest
```

**Conceptos:**
- `-e`: Pasar variables de entorno
- El servicio es accesible en localhost:3306

### Ejemplo 3: Contenedor Interactivo

```bash
docker run -it --rm --name ubuntu-shell ubuntu bash
# Dentro del contenedor:
root@abc123:/# apt-get update
root@abc123:/# python --version
# exit → contenedor se elimina (--rm)
```


## Conceptos Importantes

### Mapeamiento de Puertos

```
Host (localhost:8080)
        ↓
Docker daemon
        ↓
Contenedor (172.17.0.2:80)
```

**Nunca accedes directamente a la IP del contenedor.** Siempre mapeas puertos explícitamente con `-p`.

### Ciclo de Vida

1. **Created:** Contenedor existe pero no corre
2. **Running:** Contenedor ejecutándose
3. **Stopped:** Contenedor parado (puede reiniciarse)
4. **Deleted:** Contenedor eliminado

### Logs y Debugging

Los logs son cruciales:
```bash
docker logs -f nombre           # Seguir logs en vivo
docker inspect nombre           # Información completa
docker exec -it nombre bash     # Conectarse y debuguear
```


## Comandos Cheat Sheet

 Comando  Descripción 
------------
 `docker run`  Crear y ejecutar contenedor 
 `docker ps`  Listar contenedores 
 `docker start/stop`  Controlar ciclo de vida 
 `docker logs`  Ver salida 
 `docker exec`  Ejecutar comando adentro 
 `docker cp`  Copiar archivos 
 `docker inspect`  Información detallada 
 `docker port`  Ver mapeamiento de puertos 
 `docker rm`  Eliminar contenedor 


## Relaciones

### Conecta con
- [[docker|Docker]] — Plataforma base
- [[contenedores|Contenedores]] — Lo que estamos ejecutando
- [[docker-compose|Docker Compose]] — Orquestación de múltiples contenedores

### Parte de
- Ciclo de vida de contenedores — Gestión completa
- Redes en Docker — Mapeamiento de puertos


## Ideas Clave del Módulo

1. **`docker run` es el comando principal** para crear y ejecutar contenedores
2. **Mapear puertos explícitamente** con `-p` (no acceder por IP del contenedor)
3. **Ciclo de vida:** created → running → stopped → deleted
4. **Modo interactivo (-it)** para debugging
5. **Modo demonio (-d)** para servicios de larga vida
6. **docker exec** para ejecutar comandos en contenedores corriendo
7. **docker logs -f** para debugging en tiempo real
8. **docker inspect** para información detallada en JSON


## Fuentes

- [Curso: Docker 2024 - Módulo 2](https://plataforma.josedomingo.org/pledin/cursos/docker2024/)
