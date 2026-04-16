---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_podman_ow]
tags: [podman, rootless, seguridad]
---

# Seguridad en Podman

## Resumen de una línea
Seguridad Podman: rootless nativo, SELinux/AppArmor, aislamiento de usuarios, mejores prácticas.

## Información
- **Fuente:** Curso Podman 2024 - Módulos 9-10

---

## Rootless: La Mejor Defensa

```bash
# Contenedor rootless
podman run myapp

# Si se compromete: usuario normal, no root ✅
# Máximo daño: tu usuario, no sistema ✅
```

---

## SELinux y AppArmor

### SELinux (RHEL/Fedora)

```bash
# Ver política
getenforce

# Podman usa políticas SELinux automáticamente
podman run myapp  # Ejecuta con contexto SELinux
```

### AppArmor (Debian/Ubuntu)

```bash
# Podman genera perfiles AppArmor
podman run myapp
```

---

## Mejores Prácticas

### 1. Usar Rootless

```bash
# ✅ Recomendado
podman run myapp

# ❌ Evitar
sudo podman run myapp
```

### 2. No usar --privileged

```bash
# ❌ Peligroso (casi root)
podman run --privileged myapp

# ✅ Usar capabilidades específicas si necesario
podman run --cap-add NET_ADMIN myapp
```

### 3. Imágenes confiables

```bash
# ✅ Oficiales
podman pull docker.io/library/ubuntu

# ✅ Verificadas
podman pull registry.access.redhat.com/ubi8

# ❌ Desconocidas
podman pull random-registry.com/random-image
```

### 4. Read-only filesystem

```bash
podman run --read-only myapp
```

---

## Limitaciones Rootless

- Puertos < 1024
- Algunas capabilities
- Red slirp4netns (más lento)

**But:** Worth it for security

---

## Relaciones

### Conecta con
- [[introduccion-podman|Introducción]] — Seguridad

---

## Fuentes

- [Curso Podman 2024 (GitHub)](https://github.com/josedom24/curso_podman_ow)
