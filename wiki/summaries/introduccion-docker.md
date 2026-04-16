---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_docker_ow]
tags: [docker, containers, virtualization, fundamentals]
---

# Introducción a Docker

## Resumen de una línea
Fundamentos de Docker: qué son los contenedores, cómo se diferencian de máquinas virtuales, e instalación en Linux y Windows.

## Conceptos Fundamentales

### Tipos de Virtualización

**Emulación (QEMU):** Simula CPU completa, muy lenta

**Virtualización Tipo 1 (Hypervisor nativo):** Corre directamente en hardware
- Ejemplos: ESXi, Hyper-V
- Cada VM tiene su propio kernel
- Arranque: 2-5 minutos

**Virtualización Tipo 2 (Hypervisor hospedado):** Corre dentro del SO
- Ejemplos: VirtualBox, VMware Workstation
- Cada VM tiene su propio kernel
- Arranque: 2-5 minutos

**Contenedores:** Virtualización a nivel SO (aislamiento a nivel de proceso)
- Kernel compartido entre contenedores
- Arranque: milisegundos
- Tamaño: MB vs GB
- Overhead: mínimo

### Docker es una Plataforma Completa

No es solo "contenedores" (que existen desde Linux/LXC). Docker incluye:
- **Engine:** Runtime que ejecuta contenedores
- **CLI:** Interfaz de línea de comandos (`docker run`, `docker build`)
- **Imágenes:** Templates reutilizables
- **Registros:** Almacenes centralizados (Docker Hub)
- **Compose:** Orquestación simple
- **Desktop:** GUI (para Windows/Mac)

### Diferencias: Contenedores vs Máquinas Virtuales

 Aspecto  Contenedores  VMs 
---------------------------
 **Kernel**  Compartido  Propio 
 **Arranque**  Milisegundos  Minutos 
 **Tamaño**  MB  GB 
 **Overhead**  Mínimo  Significativo 
 **Aislamiento**  Procesos  Completo 
 **Performance**  Nativo (sin penalty)  Penalty 5-10% 

## Problema que Resuelve Docker

### "Works on my machine but not in production"

**Situación:**
- Desarrollador: Ubuntu 22.04, Python 3.10, Django 4.1
- Testing: Ubuntu 20.04, Python 3.8, Django 3.2
- Producción: RHEL 8, Python 3.6, Django 2.2

Resultado: Incompatibilidades, bugs misteriosos, deployments fallidos

**Solución Docker:**
```
Imagen Docker = SO + Dependencias + Código
= Mismo entorno en todos lados
```

## Instalación

### En Linux

1. Actualizar repositorios:
```bash
apt-get update
apt-get install ca-certificates curl gnupg lsb-release
```

2. Añadir key GPG oficial:
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg  gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

3. Añadir repositorio:
```bash
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] ..." >> /etc/apt/sources.list.d/docker.list
```

4. Instalar:
```bash
apt-get install docker-ce docker-ce-cli containerd.io
```

5. Verificar:
```bash
docker --version
docker run hello-world
```

**Componentes instalados:**
- `docker-ce`: Docker Engine (core)
- `docker-ce-cli`: CLI herramienta
- `containerd`: Runtime de bajo nivel

### En Windows

**Requisitos:**
- Windows 10 Professional/Enterprise
- Hyper-V activado
- WSL 2 instalado (Windows Subsystem for Linux v2)

**Instalación:**
1. Descargar Docker Desktop installer
2. Ejecutar .exe
3. Seleccionar "WSL 2" como backend
4. Reiniciar Windows
5. Verificar: `docker --version`

**Backend WSL 2:**
- Corre Linux en subsistema de Windows
- Performance cercana a nativa
- Integración transparente

### En Mac

Similar a Windows pero usa Hypervisor.framework (en lugar de Hyper-V)

## Conceptos Clave

### 1. **Virtualización Ligera = Kernel Compartido**
Contenedores no incluyen sistema operativo completo, solo aislamiento a nivel de proceso.

### 2. **Docker es Ecosistema Completo**
No es solo ejecutar contenedores; incluye imágenes, registros, herramientas.

### 3. **Portabilidad + Aislamiento**
"Works on my machine" desaparece porque el contenedor lleva TODO: código, dependencias, config.

### 4. **Instalación Plataforma-Dependiente**
- Linux: Docker Engine (nativo)
- Windows/Mac: Docker Desktop (VM con Linux adentro)

### 5. **Limitaciones que Abren Nuevas Herramientas**
Docker es para single-host. Cuando necesitas múltiples servidores → Kubernetes/Swarm.

## Arquitectura de Docker

```
┌─────────────────────────────────────┐
│   Docker CLI (docker run, build)    │
├─────────────────────────────────────┤
│     Docker Daemon (dockerd)         │
│  ┌──────────────────────────────┐   │
│  │  Contenedor 1 (aislado)      │   │
│  │  - Filesystem propio         │   │
│  │  - Procesos propios          │   │
│  │  - Network namespace         │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Contenedor 2 (aislado)      │   │
│  │  - Filesystem propio         │   │
│  │  - Procesos propios          │   │
│  │  - Network namespace         │   │
│  └──────────────────────────────┘   │
├─────────────────────────────────────┤
│   Kernel Linux (compartido)         │
├─────────────────────────────────────┤
│   Hardware / SO Host                │
└─────────────────────────────────────┘
```

## Ventajas Resumidas

1. **Reproducibilidad:** Mismo código + dependencias en todos lados
2. **Aislamiento:** Sin conflictos entre proyectos
3. **Ligereza:** MB vs GB, arranque rápido
4. **Escalabilidad:** Replicar es trivial
5. **Simplidad:** Una imagen, múltiples instancias

## Limitaciones

- Single-host (necesita orquestación para clusters)
- Persistencia requiere volúmenes (datos efímeros por defecto)
- Networking básico (complejo para escenarios avanzados)
- Overhead de entorno Windows/Mac (VM con Linux)

## Próximos Pasos

**Módulo 2:** Ejecutar contenedores básicos
- `docker run`
- Gestión de contenedores
- Primeros ejemplos (web, bases de datos)

## Relaciones

### Conecta con
- [[contenedores]] — Concepto fundamental
- [[docker]] — Plataforma general

## Fuentes
- [Curso Docker 2024 - Módulo 1](https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo1) — En la plataforma de enseñanza
