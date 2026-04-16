---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_podman_ow]
tags: [podman, almacenamiento, redes, volumen, bind-mount]
---

# Almacenamiento y Redes en Podman

## Resumen de una línea
Volúmenes, bind mounts y redes en Podman: muy similar a Docker pero con soporte rootless nativo mejorado.

## Información
- **Fuente:** Curso Podman 2024 - Módulo 4

---

## Almacenamiento

### Volúmenes Docker

```bash
podman run -v mydata:/app/data ubuntu
```

### Bind Mount

```bash
podman run -v /home/user/data:/app/data ubuntu
```

### Rootless Storage

Limitaciones en rootless:
- ❌ overlay2 puede tener problemas
- ✅ vfs funciona (menos eficiente)
- ✅ fuse-overlayfs es alternativa

---

## Redes

### Red Bridge por Defecto

```bash
podman run --net bridge nginx
```

### Red Definida por Usuario

```bash
# Crear red
podman network create mynet

# Usar en contenedor
podman run --net mynet nginx

# DNS automático entre contenedores
podman run --net mynet busybox ping mycontainer
```

### Red Host

```bash
# Acceso directo a red del host
podman run --net host nginx
```

### Rootless: slirp4netns

Red especial para rootless (user-mode networking):

```bash
podman run --net slirp4netns nginx
```

---

## Comparativa: Docker vs Podman

Esencialmente idéntico en:
- Volúmenes
- Bind mounts
- Redes bridge
- Mapeamiento de puertos

**Diferencia:** Podman maneja mejor rootless automáticamente

---

## Relaciones

### Conecta con
- [[ejecucion-contenedores-podman|Ejecución]]
- [[imagenes-podman|Imágenes]]

---

## Fuentes

- [Curso Podman 2024 (GitHub)](https://github.com/josedom24/curso_podman_ow)
