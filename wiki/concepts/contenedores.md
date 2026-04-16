---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_docker_ow]
tags: [contenedores, linux, virtualizacion]
aliases: [Contenedores]
---

# Contenedores

## Resumen de una línea
Técnica de virtualización a nivel del Sistema Operativo que aísla procesos, filesystems y redes sin necesidad de kernel propio, logrando ligereza y portabilidad.

## Definición

Contenedor = Proceso Linux aislado con:
- **Filesystem propio** (chroot, union filesystems)
- **Procesos propios** (PID namespace)
- **Red propia** (network namespace)
- **Recursos limitados** (cgroups: CPU, memoria)

Todo compartiendo el **kernel del SO host**.

## Diferencia con Máquinas Virtuales

| Característica | Contenedor | Máquina Virtual |
|---|---|---|
| **Kernel** | Compartido | Propio |
| **SO** | No incluye | SO completo (GB) |
| **Arranque** | ms | minutos |
| **Tamaño** | MB | GB |
| **Overhead** | Mínimo (~1%) | Significativo (5-10%) |
| **Aislamiento** | A nivel proceso | Hardware |
| **Portabilidad** | Entre hosts Linux | Cualquier hypervisor |

## Historia

### Pre-contenedores (2000s)
- Máquinas virtuales (VMware, Xen, KVM)
- Costosas en recursos
- Lentes de arrancar

### Tecnologías Linux subyacentes (2006+)
- **cgroups** (control groups): Limitar recursos
- **namespaces**: Aislar PID, network, filesystem
- **chroot**: Aislar filesystem
- **LXC** (2008): Contenedores en Linux

### Estandarización con Docker (2013+)
- Simplifica uso de contenedores
- Imágenes portables
- Ecosistema (Hub, Compose, etc.)
- Explosion en adopción

## Características Técnicas

### 1. Namespace Isolation
```
┌─────────────────────────────┐
│  Contenedor 1               │
│  - PID: 1, 2, 3            │ ← Aislado del host
│  - Network: eth0 privada   │
│  - FS: /container1 raíz    │
└─────────────────────────────┘

┌─────────────────────────────┐
│  Contenedor 2               │
│  - PID: 1, 2, 3            │ ← Mismo PID que Cont. 1 (diferente NS)
│  - Network: eth0 privada   │
│  - FS: /container2 raíz    │
└─────────────────────────────┘

Kernel Linux Compartido (ve ambos como procesos diferentes)
```

### 2. Control Groups (cgroups)
Limitar recursos por contenedor:
```bash
# Limitar a 512 MB RAM
docker run -m 512m imagen

# Limitar a 1 CPU
docker run --cpus 1.0 imagen
```

### 3. Union Filesystems (capas)
```
Imagen = Stack de capas (lectura)
├── Capa base: ubuntu:22.04 (150 MB)
├── Capa: RUN apt-get install (50 MB)
├── Capa: COPY app.py (1 MB)
└── Capa: RUN pip install (100 MB)

Contenedor en ejecución = Capa R/W temporal (diferencias)
├── Cambios durante ejecución (máx 1 MB)
└── Desaparece al parar (si no hay volumen)
```

## Ventajas

### 1. **Portabilidad Total**
Contenedor = SO + dependencias + código
→ Corre igual en laptop, testing, producción

### 2. **Ligereza**
- Kernel compartido = overhead mínimo
- Arranque en ms (vs minutos en VMs)
- Tamaño en MB (vs GB)

### 3. **Escalabilidad**
Crear 100 contenedores es más trivial que 100 VMs:
- No hay overhead de múltiples kernels
- Bajo consumo de recursos

### 4. **Aislamiento de Dependencias**
Proyecto A requiere Python 3.8
Proyecto B requiere Python 3.11
→ Cada uno en su contenedor, sin conflictos

### 5. **Reproducibilidad**
CI/CD pipeline:
- Build → Test → Deploy
Misma imagen en todos lados = predictibilidad

## Desventajas

### 1. **Single-Kernel Limitation**
No puedes correr Windows en contenedor (en Linux). La imagen debe ser compatible con el kernel host.

### 2. **Seguridad debajo de VMs**
Aislamiento a nivel proceso (no hardware)
→ Kernel vulnerability afecta todos los contenedores

### 3. **Persistencia No-Trivial**
Contenedores son efímeros por defecto
→ Necesitas volúmenes para datos persistentes

### 4. **No es para Todo**
- GUI applications (difícil)
- Real-time systems (no garantizado)
- Hardware específico (GPU, USB)

## Tipos de Contenedores

### 1. **Contenedores de Sistema**
Contienen SO mínimo + herramientas base
- Imagen: ubuntu, debian, alpine (100-300 MB)
- Uso: Bases de datos, servicios

```dockerfile
FROM ubuntu:22.04
RUN apt-get install mariadb-server
```

### 2. **Contenedores de Aplicación**
Contienen aplicación specific + runtime
- Imagen: python:3.11, node:18 (1-2 GB)
- Uso: Web apps, scripts, servicios

```dockerfile
FROM python:3.11-slim
RUN pip install flask
COPY app.py .
```

## Caso de Uso Típico

**Desarrollo:**
```bash
docker run -it ubuntu:22.04 /bin/bash
# Experimenta aquí, instala cosas, prueba
```

**Guarda como imagen:**
```bash
docker commit container-id mi-imagen:1.0
docker push docker.io/usuario/mi-imagen:1.0
```

**Producción:**
```bash
docker run -d mi-imagen:1.0
# Corre exactamente igual que en desarrollo
```

## Tecnologías Subyacentes (Linux Kernel)

| Tecnología | Función |
|---|---|
| **cgroups** | Limitar CPU, memoria, I/O |
| **namespaces** | Aislar PID, network, IPC, UTS, user |
| **seccomp** | Restringir llamadas al kernel |
| **SELinux/AppArmor** | MAC (Mandatory Access Control) |

Docker abstrae todo esto → No necesitas entender los detalles.

## Contenedores vs Procesos Normales

```bash
# Proceso normal (sin aislamiento)
python app.py
# Puede:
# - Ver todos los procesos (ps aux)
# - Acceder a todos los archivos
# - Usar toda la red del host

# Contenedor (aislado)
docker run python:3.11 python app.py
# Solo ve:
# - Su propio PID 1, 2, 3...
# - Su propio filesystem
# - Su propia red (virtual)
# - Su propia memoria limitada
```

## Ciclo de Vida

```
Imagen (template, inmutable)
  ↓
docker run
  ↓
Contenedor en ejecución (aislado, cambios temporales)
  ↓
docker stop
  ↓
Contenedor parado (existe, con cambios perdidos si no hay volumen)
  ↓
docker rm
  ↓
Contenedor eliminado
```

## Relaciones

### Conecta con
- [[docker]] — Plataforma que ejecuta contenedores
- [[podman]] — Runtime alternativo daemonless
- [[kubernetes]] — Orquestación de contenedores
- [[openshift]] — Distribución K8s con abstracciones PaaS para contenedores

### Contrasta con
- [[kvm]] — Máquinas virtuales con overhead mayor

## Fuentes
- [Curso Docker 2024 - Módulo 1](../summaries/introduccion-docker.md) — Introducción a contenedores
- [Documentación Linux Kernel - namespaces](https://man7.org/linux/man-pages/man7/namespaces.7.html)
