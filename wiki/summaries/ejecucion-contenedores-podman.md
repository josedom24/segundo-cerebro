---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_podman_ow]
tags: [podman, contenedores, ejecucion, rootless, interactivo]
---

# Ejecución de Contenedores con Podman

## Resumen de una línea
Ejecutar contenedores con Podman: `podman run` (igual que Docker), modos rootless/rootful, contenedores interactivos y demonios, configuración.

## Información
- **Fuente:** Curso Podman 2024 - Módulo 2
- **URL GitHub:** https://github.com/josedom24/curso_podman_ow/tree/main/contenido/modulo2

---

## Ejecución Básica

### Compatible con Docker

```bash
# Hola Mundo (idéntico a Docker)
podman run hello-world

# Interactivo (igual a Docker)
podman run -it ubuntu bash

# Demonio (igual a Docker)
podman run -d -p 8080:80 nginx
```

**Ventaja:** Si conoces Docker, ya sabes Podman

---

## Rootful vs Rootless

### Rootful (con sudo)

```bash
sudo podman run ubuntu

# Contenedor ejecuta con UID/GID del sistema
# Si se compromete → acceso root ❌
```

### Rootless (sin privilegios)

```bash
podman run ubuntu

# Contenedor ejecuta con aislamiento de usuario
# Si se compromete → usuario normal ✅
# Pero con limitaciones (ver módulo 1)
```

---

## Modos de Ejecución

### Contenedor Simple

```bash
podman run ubuntu echo "Hello"
```

### Contenedor Interactivo

```bash
# -i (stdin), -t (terminal)
podman run -it ubuntu bash
```

### Contenedor Demonio

```bash
# -d (detach)
podman run -d --name web nginx

# Ver logs
podman logs web

# Logs en vivo
podman logs -f web
```

---

## Configuración de Contenedores

### Mapeamiento de Puertos

```bash
# Host:Contenedor
podman run -p 8080:80 nginx

# Ver puertos
podman port web
```

### Variables de Entorno

```bash
podman run -e DB_HOST=localhost -e DB_PORT=5432 myapp
```

### Volúmenes

```bash
# Volumen Docker
podman run -v mydata:/app/data ubuntu

# Bind mount
podman run -v /home/user/data:/app/data ubuntu
```

---

## Información de Contenedores

### Listar

```bash
podman ps              # En ejecución
podman ps -a          # Todos
```

### Logs y Procesos

```bash
podman logs container-name
podman top container-name   # Procesos dentro
```

### Inspeccionar

```bash
podman inspect container-name   # Detalles JSON
```

---

## Contenedores Rootless Específicos

### Limitaciones

- Puertos < 1024 no accesibles (excepto con slirp4netns)
- Algunos modos storage limitados
- No ping a internet por defecto
- Red slirp4netns (user-mode networking)

### Ventajas

- ✅ Sin root necesario
- ✅ Más aislado
- ✅ Más seguro

---

## Comparativa: Docker vs Podman

 Operación  Docker  Podman 
---------------------------
 `docker run`  ✅  `podman run` ✅ 
 `docker ps`  ✅  `podman ps` ✅ 
 `docker logs`  ✅  `podman logs` ✅ 
 Rootless  ⚠️ Reciente  ✅ Nativo 
 Sin demonio  ❌  ✅ 

---

## Relaciones

### Conecta con
- [[introduccion-podman|Introducción a Podman]]
- [[docker]] — Misma interfaz

### Parte de
- Ejecución de contenedores — Ejecución de contenedores

---

## Fuentes

- [Curso Podman 2024 (GitHub)](https://github.com/josedom24/curso_podman_ow)
