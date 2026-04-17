---
title: "Gestión de Almacenamiento en Proxmox"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_proxmox_cep]
tags: [almacenamiento, proxmox]
---

# Gestión de Almacenamiento en Proxmox

## Resumen de una línea
Tipos de almacenamiento (filesystem vs block device), creación de storage Directory, adición de discos a VMs, operaciones de disco (resize, move, detach), y thin provisioning.

## Información
- **Fuente:** Curso Proxmox VE - Módulo 4
- **Duración:** 3 horas teoría + 3 horas actividades prácticas
- **Semana:** Semana 4


## Arquitectura de Almacenamiento

### Tipos de Almacenamiento

```
ALMACENAMIENTO PROXMOX
├─ Local (en servidor)
│  ├─ local (Directory) → /var/lib/vz
│  └─ local-lvm (LVM thin) → volumen LVM
│
├─ Compartido (Cluster)
│  ├─ NAS (Network Attached Storage)
│  ├─ SAN (Storage Area Network)
│  └─ iSCSI, NFS, Ceph
```

### Filesystem vs Block Device

| Aspecto | Filesystem | Block Device |
|---------|-----------|--------------|
| **Tipo** | Directory | LVM, iSCSI |
| **Capacidad** | Límite filesystem | Mayor capacidad |
| **Snapshots** | Con qcow2 | Nativos (LVM) |
| **Overhead** | Bajo | Bajo |
| **Uso típico** | Local, backup | Rendimiento |


## Almacenamiento Predeterminado

### local (Directory)
```
Tipo: Filesystem
Ubicación: /var/lib/vz
Contenido:
  - ISOs (imágenes booteo)
  - Backups (copias seguridad)
  - Plantillas contenedores
  - Otros (imágenes, snippets)
```

### local-lvm (LVM Thin-provisioning)
```
Tipo: Block device LVM
Características:
  - Thin provisioning: ocupa según uso real
  - Snapshots: soportados
  - Rendimiento: muy bueno
Contenido:
  - Discos de VMs (rootfs, data)
  - Discos de contenedores
```


## Creación de Storage Directory

### Caso: Agregar almacenamiento adicional

**Paso 1: Preparar disco en Linux**
```bash
# Particionar disco /dev/sdb
fdisk /dev/sdb
# o
parted /dev/sdb

# Crear filesystem ext4
mkfs.ext4 /dev/sdb1

# Crear directorio
mkdir -p /mnt/storage-images

# Montar
mount /dev/sdb1 /mnt/storage-images

# Persistente: editar /etc/fstab
echo "/dev/sdb1 /mnt/storage-images ext4 defaults 0 2" >> /etc/fstab
```

**Paso 2: Crear Storage en Proxmox GUI**

1. Datacenter → Almacenamiento → Agregar → Directory
2. ID: local-images (nombre del storage)
3. Directorio: /mnt/storage-images
4. Contenido: Disk image, Container (seleccionar)
5. Nodes: Seleccionar nodos donde disponible
6. Crear

**Paso 3: Verificación**
- Storage → local-images → Visible en árbol
- Proxmox puede crear VMs/contenedores allí


## Agregar Discos a VMs

### Procedimiento

**Paso 1: VM → Hardware → Agregar → Disco duro SCSI**
- Storage: local-lvm (o storage elegido)
- Tamaño: GB requeridos
- Cache: WriteBack recomendado
- SSD: Si el storage es SSD
- Agregar

**Paso 2: En VM (dentro del SO)**

**Linux:**
```bash
# Detectar disco nuevo
sudo fdisk -l

# Particionar (si es necesario)
sudo fdisk /dev/sdb
# Crear partición, marcar booteable, escribir

# Crear filesystem
sudo mkfs.ext4 /dev/sdb1

# Crear punto de montaje
sudo mkdir /mnt/datos

# Montar
sudo mount /dev/sdb1 /mnt/datos

# Persistente
echo "/dev/sdb1 /mnt/datos ext4 defaults,nofail 0 2" | sudo tee -a /etc/fstab
sudo mount -a  # Verificar
```

**Windows:**
```
Disk Management → Buscar disco sin particionar
→ Right click → New Simple Volume
→ Asignar letra, formatear NTFS
→ Listo para usar
```


## Operaciones de Disco

### Resize (Aumentar tamaño)

**En Proxmox GUI:**
- VM → Hardware → Seleccionar disco → Resize disk
- Ingresar nuevo tamaño (siempre mayor que actual)
- Resize

**En SO (para usar espacio nuevo):**

**Linux:**
```bash
# Si es partición
sudo resize2fs /dev/sdb1  # ext4
sudo resize2fs -p /dev/sdb1  # btrfs

# Si es LVM (más flexible)
sudo lvextend -L +10G /dev/mapper/vg-datos
sudo resize2fs /dev/mapper/vg-datos
```

**Windows:**
```
Disk Management → Right click disco → Extend Volume
```

### Move (Mover disco entre storage)

**En Proxmox GUI:**
- VM → Hardware → Disco → Move disk
- Seleccionar storage destino
- Confirmar (puede tardar si es grande)

**Requiere:** VM apagada

### Detach (Desconectar disco)

**En Proxmox GUI:**
- VM → Hardware → Disco → Detach disk
- Disco se desconecta de VM (no se elimina)

**Resultado:** Disco queda huérfano en storage, reutilizable


## Formatos de Disco

### raw
```
Ventaja: Rendimiento máximo
Desventaja: Espacio preasignado, sin snapshots
Uso: Rendimiento crítico
```

### qcow2
```
Ventaja: Snapshots, thin provisioning, compresión
Desventaja: Leve overhead
Uso: Estándar, flexibilidad
```

### vmdk
```
Ventaja: Compatible con VMware
Desventaja: Overhead
Uso: Migración desde VMware
```


## Thin Provisioning

### Concepto
VM creada con 100 GB ocupa **solo lo que usa**

```
VM: 100 GB asignado → Realidad: 15 GB usado
Ventaja: Ahorro de espacio (múltiples VMs)
Riesgo: Storage puede llenarse sin advertencia
```

### Monitoreo
- Storage → Ver "Used" vs "Available"
- Alertar si uso > 80%
- Expandir storage proactivamente


## Snapshots

### Concepto
Captura estado del disco en momento específico

### Requisitos
- Storage con soporte (local-lvm, qcow2)
- VM apagada o usando Qemu-agent

### Operación
```
VM apagada:
  VM → Snapshots → Take Snapshot
  → Nombrar snapshot
  → Crear

Rollback:
  Snapshots → Seleccionar snapshot
  → Rollback
```


## Relaciones

### Conecta con
- [[creacion-maquinas-virtuales-proxmox|VMs]] — Discos pertenecen a VMs
- [[clonacion-snapshots-backups-proxmox|Clonación y Backups]] — Usa almacenamiento


## Próximo Paso

Clonación de VMs, creación de templates, y sistema de backups.


## Fuentes
- [Curso Proxmox VE - Módulo 4 (GitHub)](https://github.com/iesgn/curso_proxmox_cep)
- [Proxmox Storage](https://pve.proxmox.com/wiki/Storage)
