---
title: "Almacenamiento en KVM - libvirt con virsh"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kvm_ow]
tags: [almacenamiento, kvm]
---

# Almacenamiento en KVM/libvirt con virsh

## Resumen de una línea
Almacenamiento avanzado con virsh: pool types (dir/disk/logical/nfs/zfs), qemu-img para gestión ficheros, LVM para volúmenes lógicos, snapshots, resize dinámico, thin provisioning QCOW2.

## Información
- **Fuente:** Curso KVM 2024 (Avanzado) - Unidad 4
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm2/
- **Líneas de contenido:** 350+


## Pools de Almacenamiento Avanzados

### Tipos de Pools Disponibles

 Tipo  Base  Uso  Ventajas  Desventajas 
---------------------------------------
 **dir**  Directorio FS  Desarrollo, testing  Simple, flexible  Rendimiento limitado 
 **nfs**  Servidor NFS  Compartido múltiples hosts  Storage centralizado  Depende red 
 **glusterfs**  Distribuido  Escalable, tolerancia fallos  Redundancia, balance  Complejidad setup 
 **disk**  Dispositivo físico  Bloque directo  Máximo rendimiento  Particionamiento manual 
 **logical**  LVM  Enterprise, snapshots  Snapshots nativos, flexible  Administración LVM 
 **zfs**  ZFS filesystem  High-end, snapshots, compresión  Copias-on-write, dedup  Linux limitado, solaris main 
 **iscsi**  iSCSI target  SAN remoto  Almacenamiento compartido  Dependencia red 

### Creación de Pool Personalizado

```bash
# Pool tipo dir (directorio local)
virsh pool-define-as vm-images dir \
  --target /srv/images

# Pool tipo nfs (servidor remoto)
virsh pool-define-as nfs-storage nfs \
  --source-host nfs-server.local \
  --source-path /exports/vm

# Pool tipo logical (LVM)
virsh pool-define-as lvm-storage logical \
  --source-name vg-storage \
  --target /dev/vg-storage

# Pool tipo iscsi
virsh pool-define-as san-storage iscsi \
  --source-host iscsi-server.local \
  --source-path iqn.2024-01.example.com:storage
```

### Gestión de Pools

```bash
# Listar todos los pools
virsh pool-list --all

# Activar pool
virsh pool-start vm-images

# Auto-iniciar al boot
virsh pool-autostart vm-images

# Información detallada
virsh pool-info vm-images

# Refrescar (detectar nuevos volúmenes)
virsh pool-refresh vm-images

# Detener pool
virsh pool-stop vm-images

# Eliminar definición
virsh pool-undefine vm-images
```


## Gestión de Volúmenes con virsh

### Crear Volumen en Pool

```bash
# Con API virsh (recomendado para consistencia)
virsh vol-create-as default mi-vm.qcow2 \
  --format qcow2 20G

# Listar volúmenes
virsh vol-list default

# Información volumen
virsh vol-info default/mi-vm.qcow2
```

### Clonar Volumen

```bash
# Copiar volumen existente
virsh vol-clone default/original.qcow2 \
  default/copia.qcow2

# Resultado: volumen idéntico pero independiente
```

### Redimensionar Volumen

```bash
# Expandir volumen (QCOW2)
virsh vol-resize default/mi-vm.qcow2 30G

# Dentro de VM:
sudo parted /dev/vda
(parted) resizepart 1 30G
(parted) quit
sudo resize2fs /dev/vda1
```


## Gestión Avanzada con qemu-img

### Herramienta qemu-img

`qemu-img` = herramienta estándar para ficheros imagen de disco QEMU

### Operaciones Comunes

#### Crear imagen

```bash
# QCOW2 (thin provisioning)
qemu-img create -f qcow2 disco.qcow2 20G

# Raw (máximo rendimiento)
qemu-img create -f raw disco.raw 20G

# Con backing image (copy-on-write)
qemu-img create -f qcow2 -b imagen-base.qcow2 clon.qcow2
```

#### Información de imagen

```bash
qemu-img info disco.qcow2
# Output:
# image: disco.qcow2
# file format: qcow2
# virtual size: 20 GiB
# disk size: 345 MiB (solo lo usado)
# cluster_size: 65536
# Format specific information:
#   compat: 1.1
#   compression type: zstd
```

#### Convertir entre formatos

```bash
# Raw → QCOW2
qemu-img convert -f raw -O qcow2 disco.raw disco.qcow2

# QCOW2 → Raw
qemu-img convert -f qcow2 -O raw disco.qcow2 disco.raw

# Vmware → QCOW2
qemu-img convert -f vmdk -O qcow2 disco.vmdk disco.qcow2
```

#### Redimensionar

```bash
# Expandir imagen
qemu-img resize disco.qcow2 +10G

# Contraer (cuidado: pérdida de datos)
qemu-img resize disco.qcow2 -5G --shrink
```

#### Snapshot de imagen

```bash
# Crear snapshot interno
qemu-img snapshot -c snap1 disco.qcow2

# Listar snapshots
qemu-img snapshot -l disco.qcow2

# Restaurar snapshot
qemu-img snapshot -a snap1 disco.qcow2

# Eliminar snapshot
qemu-img snapshot -d snap1 disco.qcow2
```

#### Optimizar imagen (con compresión)

```bash
# Recomprimir QCOW2 (libera espacio)
qemu-img convert -f qcow2 -O qcow2 -c disco.qcow2 disco-compressed.qcow2

# Resultado: archivo más pequeño
```


## Storage Pools Especializados

### Pool LVM (Volúmenes Lógicos)

```bash
# Crear pool con LVM existente
virsh pool-define-as lvm-storage logical \
  --source-name vg-kvmstorage

# Pool ya usa LVM del sistema
# Ventajas: Snapshots nativos, flexible

# Crear volumen en pool LVM
virsh vol-create-as lvm-storage lvm-disk1 \
  --format raw 20G

# Equivalente LVM manual
lvcreate -n lvm-disk1 -L 20G vg-kvmstorage
```

### Pool ZFS (Si disponible)

```bash
# Pool ZFS permite:
#  - Snapshots nativos muy rápidos
#  - Compresión transparente
#  - Deduplicación
#  - Replicación
#  - RAID software

# Crear pool ZFS
zpool create kvm-storage /dev/sdb

# Definir pool en libvirt
virsh pool-define-as zfs-storage zfs \
  --source-name kvm-storage
```

### Pool NFS (Compartido)

```bash
# Pool NFS apunta a servidor remoto
virsh pool-define-as nfs-vms nfs \
  --source-host nas.example.com \
  --source-path /exports/vm

# Ventajas:
#  - Storage centralizado
#  - Múltiples hosts acceden
#  - Live migration más fácil

# Desventajas:
#  - Depende de red
#  - Latencia NFS
```


## Workflow Típico: Pool Múltiples

```bash
# Crear estructura típica
virsh pool-define-as vm-prod logical \
  --source-name vg-prod

virsh pool-define-as vm-backup nfs \
  --source-host backup-nas \
  --source-path /backups

virsh pool-define-as iso-images dir \
  --target /var/lib/libvirt/images/isos

# Iniciar todos
for pool in vm-prod vm-backup iso-images; do
  virsh pool-start $pool
  virsh pool-autostart $pool
done

# Verificar
virsh pool-list
# Output:
#  Name          State    Autostart
#  vm-prod       active   yes
#  vm-backup     active   yes
#  iso-images    active   yes
```


## Performance: Formato QCOW2 vs Raw

```
QCOW2:
  ✅ Thin provisioning (crece dinámicamente)
  ✅ Snapshots internos
  ✅ Compresión opcional
  ❌ Overhead de ~5-10% en IO
  
Raw:
  ✅ Máximo rendimiento (sin overhead)
  ❌ Thin provisioning limitado
  ❌ No snapshots internos
  
Decisión:
  → Desarrollo: QCOW2
  → Producción rendimiento crítico: Raw
  → Balance: QCOW2 con backing images
```


## Troubleshooting Almacenamiento

### Pool no aparece

```bash
# Refrescar pool
virsh pool-refresh vm-images

# O destruir y recrear
virsh pool-destroy vm-images
virsh pool-start vm-images
```

### Volumen corrupto

```bash
# Verificar integridad
qemu-img check disco.qcow2

# Reparar
qemu-img check -r all disco.qcow2
```

### Espacio insuficiente

```bash
# Ver uso
du -sh /var/lib/libvirt/images/*

# Limpiar snapshots antiguos
virsh snapshot-list vm-antigua
virsh snapshot-delete vm-antigua snap-old

# O expandir pool
virsh pool-info vm-images  # ver target
# Luego expandir filesystem del pool
```


## Relaciones

### Conecta con
- [[virsh-cli-kvm|Gestión de Máquinas Virtuales con virsh]]
- [[clonacion-virsh|Clonación Avanzada con virsh]]

### Parte de
- [[kvm|KVM (Kernel-based Virtual Machine)]] — Stack de virtualización


## Fuentes

- [Curso: KVM Avanzado 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm2/)
- [Curso KVM Avanzado 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
- [qemu-img Documentation](https://qemu-project.gitlab.io/qemu/tools/qemu-img.html)
- [libvirt Storage](https://libvirt.org/storage.html)
