---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_proxmox_cep]
tags: [proxmox, instalacion, configuracion, setup]
---

# Instalación de Proxmox VE

## Resumen de una línea
Descarga, instalación en servidor o VM anidada, configuración de almacenamiento por defecto, acceso a GUI web, y comprensión de la estructura del clúster.

## Información
- **Fuente:** Curso Proxmox VE - Módulo 2
- **URL GitHub:** https://github.com/iesgn/curso_proxmox_cep
- **Duración:** 2 horas teoría + 2 horas actividad (instalación)
- **Semana:** Semana 2

---

## Escenarios de Instalación

### 1. Single Node (Un servidor Proxmox)
```
┌─────────────────────┐
│  Servidor Proxmox   │
│ ├─ VM 1             │
│ ├─ VM 2             │
│ └─ Container 1      │
└─────────────────────┘
```
**Uso:** Laboratorios, desarrollo, pequeños despliegues

### 2. Single Node con NAS/SAN
```
Servidor Proxmox ←→ NAS/SAN (almacenamiento compartido)
```
**Uso:** Separación compute-storage, mayor capacidad

### 3. Cluster (Múltiples nodos)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Proxmox 1    │  │ Proxmox 2    │  │ Proxmox 3    │
└──────────────┘  └──────────────┘  └──────────────┘
       ↓                  ↓                  ↓
    Almacenamiento compartido (SAN/NAS)
```
**Uso:** Alta disponibilidad, migración en vivo, escalabilidad

---

## Requisitos de Sistema

**Mínimo recomendado para laboratorio:**
- RAM: 8 GB
- Almacenamiento: 100 GB
- CPU: 4 cores
- Red: Tarjeta de red Gigabit

**Para virtualización anidada (VirtualBox):**
- VirtualBox con virtualización anidada habilitada
- CPU del host: VT-x (Intel) o AMD-V (AMD) activado
- RAM disponible: 8+ GB

---

## Proceso de Instalación

### Paso 1: Descarga de ISO
- Descargar ISO de Proxmox VE 7 desde www.proxmox.com/downloads
- Preparar USB booteable o cargarlo en virtualización

### Paso 2: Creación de VM (si es virtualizado)
- **VirtualBox settings:**
  - RAM: 4 GB mínimo (8 recomendado)
  - CPU: 4 cores
  - Disco: 100 GB
  - Red: Bridged (para acceso externo)
  - Virtualización anidada: ✅ Habilitada
  - VT-x/AMD-V: ✅ Habilitada

### Paso 3: Instalación
1. Boot desde ISO
2. Aceptar licencia
3. Seleccionar disco de destino
4. Configurar hostname (ej: proxmox1.local)
5. Contraseña root
6. Configuración de red (DHCP o estática)
7. Resumen y confirmación
8. Esperar instalación (5-10 minutos)
9. Reinicio automático

---

## Estructura de GUI

### Componentes Principales

```
HEADER (Barra superior)
├── Logo Proxmox
├── Datacenter: pve (nombre clúster)
├── Usuario: root@pam (logueado)
├── Búsqueda
└── Ayuda, Logout

ÁRBOL DE RECURSOS (Izquierda)
├── Datacenter
│   ├── Nodos
│   │   └── proxmox1
│   │       ├── Resumen
│   │       ├── VM/Contenedores
│   │       ├── Almacenamiento local
│   │       ├── Logs
│   │       └── Firewall
│   ├── Almacenamiento global
│   ├── Backups
│   └── Permisos
├── VMs/Contenedores
└── Almacenamiento

PANEL CENTRAL
├── Información de recursos
├── Gráficas (CPU, Memory, Disk I/O, Network)
├── VMs/Contenedores listadas
└── Opciones de gestión

PANEL DE LOG (Abajo)
├── Tareas recientes
├── Estado de operaciones
└── Historial
```

---

## Estructura del Clúster (Proxmox)

### Datacenter
- Contenedor lógico de todo el clúster
- Configuración compartida
- Nombre: `pve` (default)

### Nodos (Nodes)
- Servidores Proxmox individuales
- Nombre: `proxmox1`, `proxmox2`, etc.
- Cada nodo contiene:
  - VMs/Contenedores
  - Almacenamiento local
  - Configuración local

### Almacenamiento
- **Local:** Disco interno (`/var/lib/vz`)
- **Local-LVM:** Thin-LVM en partición
- **Compartido:** NAS, SAN (accesible desde todos los nodos)

### Redes
- **vmbr0:** Bridge puente por defecto
- **Interfaces físicas:** Conectadas a vmbr0
- **Contenedores/VMs:** Conectados a bridges

---

## Almacenamiento por Defecto

### local
```
Tipo: Directory
Contenido:
  - ISOs de instalación
  - Backups de VMs/contenedores
  - Plantillas de contenedores
Ubicación: /var/lib/vz
```

### local-lvm
```
Tipo: LVM Thin-provisioning
Contenido:
  - Discos de VMs
  - Discos de contenedores
Características:
  - Snapshots soportados
  - Thin provisioning (ocupa según uso)
```

---

## Configuración de Red Predeterminada

```
enp1s0 (interfaz física) ─→ vmbr0 (Linux Bridge)
                              ├─ VMs/Contenedores
                              └─ Acceso externo
```

**Red por defecto:** 192.168.x.x (DHCP o configurada durante instalación)

---

## Acceso a la GUI

### URL: https://IP_PROXMOX:8006

**Ejemplo:** https://192.168.1.100:8006

**Credenciales:**
- Usuario: root
- Password: Configurada durante instalación
- Realm: pam (Linux authentication)

**Nota:** SSL auto-firmado, navegador mostrará advertencia de seguridad

---

## Relaciones

### Conecta con
- [[introduccion-proxmox|Introducción a Proxmox]] — Conceptos previos
- [[creacion-vms|Creación de Máquinas Virtuales]] — Siguiento paso

### Parte de
- Proceso de preparación de Proxmox

---

## Próximo Paso

Creación de máquinas virtuales Linux y Windows con configuración correcta de dispositivos (VirtIO).

---

## Fuentes
- [Curso Proxmox VE - Módulo 2 (GitHub)](https://github.com/iesgn/curso_proxmox_cep)
- [Proxmox Installation](https://pve.proxmox.com/wiki/Installation)
