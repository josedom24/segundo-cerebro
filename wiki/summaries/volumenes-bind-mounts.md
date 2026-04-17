---
title: "Almacenamiento en Docker"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_docker_ow]
tags: [almacenamiento, docker, volumes]
---

# Almacenamiento en Docker

## Resumen de una línea
Cómo persistir datos en contenedores efímeros usando volúmenes Docker, bind mounts y tmpfs, y cuándo usar cada uno.

## Información
- **Fuente:** Curso Docker 2024 - Módulo 4
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/
- **URL GitHub:** https://github.com/josedom24/curso_docker_ow
- **Líneas de contenido:** 480


## El Problema: Contenedores Efímeros

```
Contenedor = Capa R/W temporal
    ↓
docker stop/rm
    ↓
Todos los cambios perdidos ❌
```

**Solución:** Almacenamiento persistente fuera del contenedor.


## 3 Tipos de Almacenamiento en Docker

### 1. Volúmenes Docker (`--volume` o `-v`)

**¿Qué son?**
- Creados y gestionados por Docker
- Almacenados en `/var/lib/docker/volumes/` (Linux)
- El host no accede directamente (Docker los gestiona)

**Características:**
```bash
# Crear volumen nombrado
docker volume create mi-volumen

# Crear con contenedor (anónimo)
docker run -v /datos ubuntu

# Crear con contenedor (nombrado)
docker run -v mi-volumen:/datos ubuntu
```

**Ventajas:**
- ✅ Gestionado totalmente por Docker
- ✅ Compartible entre múltiples contenedores
- ✅ Fácil backup y migración
- ✅ Portable entre hosts

**Desventajas:**
- ❌ Host no tiene acceso directo
- ❌ Más opaco que bind mounts

**Cuándo usar:**
- Compartir datos entre múltiples contenedores
- Backup y restauración
- Cuando el host no tiene estructura fija
- Almacenamiento remoto o cloud

### 2. Bind Mounts (`-v /ruta/host:/ruta/container`)

**¿Qué es?**
- Monta un directorio/archivo del host en el contenedor
- Acceso directo a archivos del host
- No es gestionado por Docker

**Características:**
```bash
# Montar directorio del host
docker run -v /home/usuario/datos:/datos ubuntu

# Montar solo lectura
docker run -v /home/usuario/datos:/datos:ro ubuntu

# Crear bajo demanda si no existe
docker run -v /ruta/nueva:/datos ubuntu  # Crea la ruta
```

**Ventajas:**
- ✅ Host accede directamente
- ✅ Control total desde el host
- ✅ Desarrollo: cambios inmediatos
- ✅ Compartir código fuente

**Desventajas:**
- ❌ Requiere estructura fija en host
- ❌ Menos portable (rutas específicas)
- ❌ Problemas de permisos

**Cuándo usar:**
- Desarrollo local (cambios código immediatos)
- Compartir configuración desde host
- Acceso desde otras aplicaciones (no Docker)
- Desarrollo vs producción (diferentes paths)

### 3. tmpfs Mounts

**¿Qué es?**
- Almacenamiento temporal en RAM
- No persiste en disco
- Se elimina cuando contenedor muere

**Características:**
```bash
docker run --tmpfs /datos ubuntu

# Con opciones
docker run --mount type=tmpfs,destination=/datos,tmpfs-size=100m ubuntu
```

**Ventajas:**
- ✅ Muy rápido (en RAM)
- ✅ No contamina disco
- ✅ Seguro (sin persistencia)

**Desventajas:**
- ❌ Datos perdidos al parar
- ❌ Limitado por RAM disponible

**Cuándo usar:**
- Información sensible (no guardar)
- Caches temporales
- Scratchpad de trabajo
- Seguridad (no dejar rastro)


## Sintaxis: `-v` vs `--mount`

### Opción 1: `-v` (Sintaxis tradicional)

```bash
docker run -v FUENTE:DESTINO:OPCIONES imagen
```

**Estructura:**
```
-v nombre-volumen:/path/en/contenedor:ro
   │                │                      │
   │                │                      └─ Opciones (ro=readonly)
   │                └─ Ruta en contenedor
   └─ Nombre volumen (o /ruta/host para bind mount)
```

**Ejemplos:**
```bash
# Volumen nombrado
docker run -v mi-db:/var/lib/mysql mysql

# Volumen anónimo
docker run -v /datos ubuntu

# Bind mount
docker run -v /home/user/code:/app ubuntu

# Solo lectura
docker run -v /home/user/config:/etc/app:ro ubuntu
```

### Opción 2: `--mount` (Más explícito)

```bash
docker run --mount type=volume,source=mi-volumen,destination=/datos ubuntu
docker run --mount type=bind,source=/home/user/code,destination=/app,readonly ubuntu
docker run --mount type=tmpfs,destination=/datos ubuntu
```

**Estructura:**
```
--mount type=volumebindtmpfs,source=...,destination=...,readonly
```

**Ventajas de `--mount`:**
- ✅ Más claro y explícito
- ✅ Menos propenso a errores
- ✅ Mejor para scripts


## Comandos de Gestión de Volúmenes

```bash
# Crear volumen
docker volume create mi-volumen

# Listar volúmenes
docker volume ls

# Información del volumen
docker volume inspect mi-volumen

# Eliminar volumen
docker volume rm mi-volumen

# Eliminar volúmenes no usados
docker volume prune

# Ver espacio ocupado
docker system df
```


## Propagación de Contenido

### Caso 1: Volumen vacío montado en dir con archivos

```
Imagen:
└── /datos/
    ├── archivo1.txt
    └── archivo2.txt

docker run -v mi-volumen:/datos ubuntu

Resultado:
Volumen mi-volumen contiene:
├── archivo1.txt  ← copiado del contenedor
└── archivo2.txt  ← copiado del contenedor
```

### Caso 2: Volumen no vacío montado en dir con archivos

```
Volumen:
└── /datos/
    └── archivo-existente.txt

Contenedor:
└── /datos/
    ├── archivo-nuevo.txt
    └── otro-archivo.txt

docker run -v mi-volumen:/datos ubuntu

Resultado:
Contenedor solo ve:
└── /datos/
    └── archivo-existente.txt  ← Archivos nuevos ocultos!
```

**Conclusión:** El montaje oculta el contenido original del contenedor.


## Qué Persistir: Buenas Prácticas

### ✅ Persistir

1. **Datos de la aplicación**
   - Base de datos
   - Archivos de usuario
   - Caché

2. **Logs del servicio**
   - Para debugging y auditoría
   - Para análisis posterior

3. **Configuración (según caso)**
   - Si cambia frecuentemente
   - Si es diferente por ambiente

### ❌ NO Persistir

- Código fuente (va en imagen)
- Dependencias (go en imagen)
- Sistema operativo (va en imagen)


## Casos de Uso Prácticos

### Caso 1: Base de Datos MySQL

```bash
# Crear volumen para datos
docker volume create mysql-data

# Crear contenedor con persistencia
docker run -d \
  --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=secret \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0

# Los datos persisten aunque elimines el contenedor
docker rm mysql-db
docker run -d --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=secret \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0
# Datos intactos ✅
```

### Caso 2: Desarrollo Web (Bind Mount)

```bash
# Directorio del proyecto en host
/home/user/myapp/
├── src/
├── public/
└── docker-compose.yml

# Código cambia en tiempo real en contenedor
docker run -d \
  -v /home/user/myapp/src:/app/src \
  -v /home/user/myapp/public:/app/public \
  mi-app:dev

# Editar archivo → cambio inmediato en contenedor ✅
```

### Caso 3: Configuración desde Host

```bash
# Config en host
/etc/myapp/config.yaml

docker run -d \
  -v /etc/myapp/config.yaml:/app/config.yaml:ro \
  mi-app:prod

# Solo lectura, config controlada por host ✅
```

### Caso 4: Información Sensible (tmpfs)

```bash
# Secrets en RAM, no persisten
docker run -d \
  --mount type=tmpfs,destination=/run/secrets \
  -e SECRET_KEY=... \
  mi-app:prod

# Al parar contenedor, secrets desaparecen de disco ✅
```


## Conceptos Clave

1. **Efímeros:** Contenedores pierden datos sin almacenamiento
2. **Volúmenes:** Gestionados por Docker (recomendado)
3. **Bind Mounts:** Host controla directorios (desarrollo)
4. **tmpfs:** RAM temporal (seguridad/performance)
5. **Persistencia:** Datos, logs, config
6. **Propagación:** Archivos se copian/ocultan al montar
7. **Docker gestiona:** Volúmenes (él los crea/elimina)
8. **Host gestiona:** Bind mounts (directorios existentes)


## Relaciones

### Conecta con
- [[docker|Docker]] — Plataforma base
- [[contenedores|Contenedores]] — Lo que almacenan
- [[docker-compose|Docker Compose]] — Define volúmenes declarativamente

### Parte de
- Persistencia de datos — Almacenamiento persistente
- Ciclo de vida de contenedores — Estado de contenedores


## Flujo Típico

```
1. Crear volumen (o usar bind mount)
2. Montar en contenedor (docker run -v)
3. Aplicación escribe en /ruta/montada
4. docker stop → datos intactos
5. docker start → datos recuperados
6. Otro contenedor puede leer mismo volumen
```


## Fuentes

- [Curso: Docker 2024 - Módulo 4](https://plataforma.josedomingo.org/pledin/cursos/docker2024/)
