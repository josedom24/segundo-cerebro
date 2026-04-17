---
title: "Trabajando con Linux Containers (LXC) en Proxmox"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_proxmox_cep]
tags: [contenedores, linux, proxmox]
---

# Trabajando con Linux Containers (LXC) en Proxmox

## Resumen de una línea
Gestión de contenedores LXC como alternativa ligera a VMs, descarga de plantillas de contenedores, creación con configuración de CPU/RAM/red, operaciones de ciclo de vida, y adición de volúmenes de almacenamiento con mount points.

## Información
- **Fuente:** Curso Proxmox VE - Módulo 6
- **Duración:** 2.5 horas teoría + 2.5 horas actividades prácticas
- **Semana:** Semana 6


## Introducción a LXC

### Contenedores vs Máquinas Virtuales

```
MÁQUINAS VIRTUALES          CONTENEDORES LXC
├─ Kernel emulado          ├─ Kernel compartido
├─ Hardware emulado        ├─ Sin emulación
├─ Mayor overhead          ├─ Bajo overhead
├─ SO completo             ├─ Distribuido Linux
└─ Mayor aislamiento       └─ Aislamiento a nivel SO
```

### Características de LXC

**Ventajas:**
- Overhead mínimo
- Creación muy rápida
- Uso eficiente de recursos
- Ideal para laboratorios y testing

**Limitaciones:**
- Solo Linux
- No soporta Windows, FreeBSD
- Requiere kernel 3.10+

### Uso en Proxmox

```
Proxmox VE
├─ KVM: Máquinas virtuales completas
└─ LXC: Contenedores Linux ligeros
```

Ambos gestionables desde misma interfaz


## Plantillas de Contenedores

### Concepto

```
Plantilla = Sistema de archivos base para LXC
├─ Ubuntu, Debian, Red Hat, AlmaLinux, etc.
├─ Descargadas en storage "local"
└─ Clonadas al crear cada contenedor
```

### Gestión de Plantillas

**Ubicación:** Storage → local → CT Templates

### Tres Formas de Obtener Plantillas

#### 1. Upload
- Subir plantilla desde ordenador local
- Formato: archivo comprimido

#### 2. Download from URL
- Descargar usando URL directa
- Útil para plantillas personalizadas

#### 3. Templates (Repositorio)
```
Proxmox ofrece repositorio oficial
├─ Ubuntu-20.04-standard
├─ Ubuntu-22.04-standard
├─ Debian-10-standard
├─ CentOS-8-default
└─ Más disponibles
```

Con buscador integrado para encontrar por nombre

### Descarga desde Repositorio

**Procedimiento:**
1. Storage → local → CT Templates → Templates
2. Buscar plantilla deseada (ej: Ubuntu-20.04)
3. Botón Download
4. Esperar a que descargue completamente


## Creación de Contenedores LXC

### Paso 1: Identificar Contenedor

```
Configuración:
├─ Nodo destino
├─ ID único del contenedor
├─ Nombre descriptivo
└─ Acceso: Contraseña root O clave SSH pública
```

### Paso 2: Elegir Plantilla

```
Seleccionar de plantillas descargadas
├─ Ubuntu, Debian, Red Hat
├─ Cualquiera disponible en storage "local"
└─ Se clona al crear el contenedor
```

**Nota:** Clonación de plantilla = creación muy rápida

### Paso 3: Configuración de Disco

```
Parámetros:
├─ Storage destino (ej: local-pve → LVM)
├─ Tamaño disco raíz (GB)
└─ Crecimiento dinámico (si thin provisioning)
```

### Paso 4: CPU

```
Seleccionar número de cores vCPU
├─ Mínimo: 1 core
├─ Típico laboratorio: 2-4 cores
└─ Máximo: cores disponibles
```

### Paso 5: Memoria

```
Especificar en MiB (IMPORTANTE: no MB)
├─ Mínimo: 256 MiB
├─ Típico: 512-1024 MiB
└─ Máximo: RAM disponible
```

### Paso 6: Configuración de Red

```
Parámetro: Bridge + Interfaz
├─ Bridge por defecto: vmbr0 (red pública)
├─ Interfaz: eth0 (puede cambiar)
└─ DHCP automático O IP manual + gateway
```

**Opciones de IP:**
- DHCP: automático (recomendado para inicio)
- Manual: especificar IPv4/CIDR + gateway

### Paso 7: DNS

```
Opciones:
├─ Dejar en blanco → Usa DNS del servidor Proxmox
└─ Especificar → Custom DNS servers
```


## Ciclo de Vida de Contenedores

### Estados

```
Stopped ←→ Running
         ←→ Restarting
```

### Operaciones (Botón Derecho)

- **Start:** Iniciar contenedor
- **Shutdown:** Apagado limpio (ordenado)
- **Stop:** Apagado inmediato (forzado)
- **Reboot:** Reinicio limpio
- **Clone:** Clonar contenedor
- **Convert to template:** Crear plantilla
- **Console:** Acceso a consola

### Panel Lateral (VM/LXC seleccionado)

- **Summary:** Resumen y monitorización
- **Console:** Acceso shell
- **Resources:** CPU, memoria, mount points
- **Networks:** Configuración de interfaces
- **DNS:** Servidores DNS
- **Options:** Configuración adicional
- **Task History:** Historial de tareas
- **Backup:** Copias de seguridad
- **Replication:** Replicación entre nodos
- **Snapshot:** Instantáneas del contenedor
- **Firewall:** Cortafuegos
- **Permissions:** Control de acceso

### Eliminar Contenedor

```
Procedimiento:
1. Detener contenedor (Stop)
2. More → Remove
3. Confirmar con ID del contenedor
```


## Adición de Almacenamiento: Mount Points

### Concepto

```
Contenedor LXC puede tener múltiples "discos"
├─ /dev/mapper/pve-vm-XXX (disco raíz, ya existe)
└─ Mount points adicionales (volúmenes nuevos)
```

### Creación de Mount Point

**Procedimiento:**
1. Contenedor → Resources → Add → Mount Point
2. Seleccionar storage destino (ej: local-pve)
3. Especificar tamaño del volumen (GB)
4. Indicar path de montaje en contenedor (ej: /datos)
5. Confirmar

**Resultado:** Volumen nuevo accesible como directorio en contenedor

### Ejemplo

```
Contenedor ubuntu-dev:
├─ /dev/mapper/pve-vm-110 → / (20 GB, disco raíz)
├─ /dev/mapper/pve-vm-data → /datos (50 GB, mount point)
└─ /dev/mapper/pve-vm-backup → /backup (100 GB, mount point)
```


## Clonación de Contenedores

### Procedimiento

Botón derecho → Clone
- Similar a VMs
- Crea contenedor independiente
- Copia plantilla completamente


## Conversión a Plantilla

### Uso

```
Contenedor Configurado → Plantilla
├─ Base para crear nuevos contenedores rápidamente
├─ Read-only, no se puede usar directamente
└─ Requiere clonar para usar
```


## Comparativa: Contenedores vs VMs

| Aspecto | LXC | KVM VM |
|---------|-----|--------|
| **Kernel** | Compartido | Emulado |
| **SO** | Linux solo | Cualquiera |
| **Overhead** | Mínimo (~50 MB) | Medio (500+ MB) |
| **Creación** | Segundos | Minutos |
| **Rendimiento** | Casi nativo | 5-10% inferior |
| **Uso** | Servicios, microservicios | Laboratorios, complejo |
| **Escalabilidad** | Excelente | Limitada |


## Relaciones

### Conecta con
- [[creacion-maquinas-virtuales-proxmox|VMs]] — Alternativa a máquinas virtuales
- [[almacenamiento-proxmox|Almacenamiento]] — Dónde se guardan
- [[redes-proxmox|Redes]] — Configuración de interfaz
- [[usuarios-permisos-proxmox|Usuarios y Permisos]] — Control de acceso


## Próximo Paso

Gestión de redes en Proxmox, creación de bridges internos, y conexión de recursos a diferentes redes.


## Fuentes
- [Curso Proxmox VE - Módulo 6 (GitHub)](https://github.com/iesgn/curso_proxmox_cep)
- [Proxmox Container Toolkit](https://pve.proxmox.com/pve-docs/pve-admin-guide.html#chapter_pct)
