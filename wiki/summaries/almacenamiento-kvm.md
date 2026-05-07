---
title: "Almacenamiento en KVM - virt-manager"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kvm_ow]
tags: [almacenamiento, kvm]
---

# Almacenamiento en KVM - virt-manager

## Resumen de una línea
Gestión de almacenamiento KVM: storage pools (directorios, bloque, red), volúmenes (raw vs qcow2), snapshots para recuperación, thin provisioning para optimización de espacio.

## Información
- **Fuente:** Curso KVM 2024 - Unidad 4
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm1/
- **Líneas de contenido:** 300+


## Grupos de Almacenamiento (Storage Pools)

### Concepto
Los storage pools son espacios lógicos organizados donde se guardan discos de VMs

**Dos categorías principales:**

### 1. Almacenamiento Basado en Sistemas de Ficheros

```
📁 dir
   └─ Directorios locales (p.ej. /var/lib/libvirt/images)
   
🌐 nfs
   └─ Sistema de ficheros en red desde servidor NFS
   
🔀 glusterfs
   └─ Almacenamiento distribuido en red
```

### 2. Almacenamiento Basado en Dispositivos de Bloque

```
💾 disk
   └─ Particiones o discos físicos completos
   
🔗 iscsi
   └─ Dispositivos compartidos a través de iSCSI
   
📦 logical
   └─ Volúmenes lógicos LVM (gestor de volúmenes)
   
⚡ zfs
   └─ Sistemas avanzados con snapshots nativos
```

### Pool Default

**Ruta:** `/var/lib/libvirt/images`
**Tipo:** dir (directorio)
**Uso:** Almacenamiento principal de discos VM


## Volúmenes de Almacenamiento (Storage Volumes)

### Definición
Unidades individuales dentro de un grupo (corresponden a diferentes elementos según tipo):

 Pool Type  Volume Corresponde a 
---------------------------------
 **dir**  Ficheros de imagen de disco 
 **disk**  Particiones de disco 
 **logical**  Volúmenes LVM 
 **nfs/glusterfs**  Ficheros remotos 


## Formatos de Imagen de Disco

### RAW (Sin procesar)

```
✅ Mejor rendimiento
✅ Compatible con cualquier herramienta
❌ Ocupa TODO el espacio asignado desde inicio
❌ No soporta snapshots
```

**Ejemplo:** VM con 100GB asignado = 100GB ocupado inmediatamente

### QCOW2 (QEMU Copy-On-Write)

```
✅ Thin provisioning (crece dinámicamente)
✅ Soporta snapshots/instantáneas
✅ Compresión disponible
❌ Ligeramente menos eficiente en acceso
❌ Más lento que raw
```

**Ejemplo:** VM con 100GB asignado = solo espacio usado al inicio

**Recomendación:** Usar QCOW2 por defecto ✅


## Snapshots (Instantáneas)

### Definición
Captura del estado completo de una VM en un momento específico

### Casos de Uso

```
💾 Recuperación ante fallos
   → Volver a estado anterior si algo falla

🧪 Pruebas y desarrollo
   → Experimentar sin afectar datos originales
   → Rollback fácil a estado anterior

🔄 Testing
   → Crear múltiples puntos de control
```

### Niveles de Snapshot

**A nivel de almacenamiento:**
- LVM, ZFS tienen snapshots nativos
- Muy rápidos y eficientes
- Nivel bajo

**A nivel de imagen de disco:**
- Formato QCOW2 soporta snapshots
- Controlables desde virt-manager
- Nivel de aplicación

### Uso en virt-manager

Acceso: **Detalles VM → Instantáneas** (botón 3)

```
- Crear snapshot actual
- Ver snapshots previos
- Restaurar a snapshot antiguo
- Eliminar snapshot
```


## Thin Provisioning (Aprovisionamiento Ligero)

### Concepto
Asignar espacio de forma **dinámica** según sea necesario, no todo desde inicio

### Ventajas
```
💾 Economizar espacio en disco
📈 Mejor utilización de recursos
🚀 Crear muchas VMs sin llenar disco
```

### Soporte

```
✅ QCOW2: Soporta thin provisioning
❌ RAW: NO soporta (ocupa todo desde inicio)
✅ LVM: Soporta (logical volumes)
✅ ZFS: Soporta (snapshots nativos)
```

### Ejemplo Práctico

```
Pool: default (/var/lib/libvirt/images - 200 GB disponibles

VM1: 50GB asignado, QCOW2
    → Ocupa 5GB al iniciar
    → Crece según se escribe

VM2: 100GB asignado, QCOW2
    → Ocupa 3GB al iniciar
    → Crece según se escribe

VM3: 50GB asignado, QCOW2
    → Ocupa 2GB al iniciar

Total pool: 200GB disponibles ✅
Usado actualmente: 10GB
Capacidad para crecer: 180GB
```

Sin thin provisioning (RAW) = 200GB ocupados inmediatamente ❌


## Gestión en virt-manager

### Acceder a Storage Pools

```
Detalles de conexión QEMU/KVM
  → Almacenamiento disponible
  → Listar pools (default, isos, ...)
```

### Crear Nuevo Pool

**Ejemplo: pool "datos" en /mnt/datos**

```
1. Click botón "Añadir grupo"
2. Nombre: datos
3. Tipo: dir
4. Ruta: /mnt/datos
5. Aplicar
```

**Resultado:** Nuevo pool para almacenar discos VM

### Operaciones en Pools

```
- Crear nuevo pool: Botón "Añadir"
- Ver características: Click en pool
- Eliminar: Click derecho → Eliminar
- Refrescar: Botón "Refrescar"
- Crear volumen: Dentro del pool
```


## Estrategia de Almacenamiento

### Recomendado

```
Pool 1: default
Type: dir
Path: /var/lib/libvirt/images
Uso: Todos los discos VM

Pool 2: isos
Type: dir
Path: ~/Descargas/isos
Uso: Imágenes ISO para instalación

Pool 3: backups (opcional)
Type: dir
Path: /backups
Uso: Copias de seguridad VM
```

### Decisiones de Formato

```
🟢 QCOW2: Casos normales (desarrollo, testing)
🟡 RAW: Si requieres máximo rendimiento
🔵 LVM: Entornos corporativos con infraestructura
```


## Relaciones

### Conecta con
- [[creacion-vms|Creación de Máquinas Virtuales en virt-manager]]
- [[clonacion-kvm|Clonación de Máquinas Virtuales en KVM]]
- [[virt-manager-setup|Instalación y Configuración de virt-manager]]

### Parte de
- [[kvm|KVM (Kernel-based Virtual Machine)]] — Stack de virtualización


## Fuentes

- [Curso: KVM 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm1/)
- [Curso KVM 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
- [QEMU QCOW2 Format](https://en.wikibooks.org/wiki/QEMU/Images)
