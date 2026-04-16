---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_openstack_ies]
tags: [almacenamiento, openstack]
---

# Cinder: Gestión de Almacenamiento en OpenStack

## Resumen de una línea
Componente OpenStack que gestiona volúmenes en bloques: almacenamiento persistente adjuntable a instancias, snapshots, backups, tipos de almacenamiento.

## Definición

**Cinder** = Servicio de almacenamiento en bloques OpenStack. Proporciona volúmenes persistentes que pueden adjuntarse a instancias como discos adicionales.

Diferencia clave:
- **Disco raíz (ephemeral):** Destruido al eliminar instancia
- **Volumen (Cinder):** Persistente, separado de instancia

## Conceptos Clave

### Volumen vs Disco Raíz

```
Disco Raíz (Ephemeral):
- Incluido en flavor
- Limitado por tamaño flavor
- Se pierde al eliminar instancia
- Rápido (local)

Volumen (Cinder):
- Separado e independiente
- Tamaño configurable (1 GB - TB)
- Persiste al eliminar instancia
- Adjuntable a múltiples instancias
- Respaldado por almacenamiento SAN/NAS
```

### Ciclo de Vida Volumen

```
Crear volumen
    ↓
Creating (creando)
    ↓
Available (disponible, sin adjuntar)
    ↓ (Adjuntar a instancia)
In-use (adjunto a instancia)
    ↓ (Desadjuntar)
Available (nuevamente disponible)
    ↓
Delete
```

### Tipos de Almacenamiento

```yaml
Storage Types (depende de implementación):

SSD:
- Alto rendimiento
- Latencia baja
- Costos altos
- Ideal: bases de datos

HDD (SATA):
- Bajo costo
- Mayor latencia
- Gran capacidad
- Ideal: almacenamiento general

NFS/Ceph:
- Red-based
- Escalable
- Compartible
- Backup fácil
```

### Adjunción de Volúmenes

**Modelo:**
```
Instancia (Nova)
    ↓
Interface de red (Neutron)
    ↓
Volumen (Cinder)
    ↓
Almacenamiento backend
```

**Dentro SO:**
```bash
# El volumen aparece como dispositivo
# En Linux típicamente /dev/vdb, /dev/vdc, etc

# Ver dispositivos
lsblk

# Crear partición (si es nuevo volumen)
fdisk /dev/vdb

# Crear filesystem
mkfs.ext4 /dev/vdb1

# Montar
mkdir /mnt/datos
mount /dev/vdb1 /mnt/datos

# Hacer permanente (añadir a /etc/fstab)
/dev/vdb1 /mnt/datos ext4 defaults 0 0
```

### Instancia vs Volumen

**Instalación en volumen:**
```
Ventajas:
- Sistema operativo en volumen persistente
- Rápido cambio de instancia
- Mejor para aplicaciones stateful
- Facilita migración

Desventajas:
- Más lento que disco raíz (red)
- Múltiples instancias pueden compartir volumen
- Requiere cuidado con consistency
```

### Snapshots de Volumen

Captura punto-en-tiempo del volumen:

```
Snapshot = Copia del estado

Crear snapshot:
1. Volumen en producción puede seguir usándose
2. Captura incremental
3. Almacenado en backend

Usar snapshot:
1. Crear nuevo volumen a partir de snapshot
2. Clonación rápida
3. Recuperación ante corrupción

Beneficios:
- Backup incremental
- Clonación eficiente
- Bajo overhead
```

### Gestión con OpenStack Client (OSC)

```bash
# Listar volúmenes
openstack volume list

# Crear volumen
openstack volume create --size 10 "mi-volumen"

# Crear volumen a partir de snapshot
openstack volume create --snapshot [snapshot-id] "volumen-clon"

# Adjuntar volumen a instancia
openstack server add volume [instancia] [volumen]

# Desadjuntar
openstack server remove volume [instancia] [volumen]

# Crear snapshot
openstack volume snapshot create --volume [volumen] "snapshot-1"

# Listar snapshots
openstack volume snapshot list

# Eliminar volumen
openstack volume delete [volumen]

# Mostrar detalles
openstack volume show [volumen]
```

### Operaciones en Volumen

**Expansión:**
```
Expandir volumen:
1. Parar instancia (algunos backends)
2. Extender volumen
3. Dentro SO: redimensionar filesystem
```

**Migración:**
```
Mover volumen entre backends:
1. Migración no-destructiva
2. Mantiene datos
3. Puede requerir pausa
```

## Casos de Uso

```
🟢 Datos persistentes entre instancias
🟢 Bases de datos (MySQL, PostgreSQL, MongoDB)
🟢 Almacenamiento compartido NFS
🟢 Backups y snapshots
🟢 Sistemas de archivos grandes
🟢 Aplicaciones stateful
```

## Workflow Típico

```
1. Crear volumen (Cinder)
2. Adjuntar a instancia (Nova)
3. Dentro de instancia:
   - Particionar (fdisk)
   - Crear filesystem (mkfs)
   - Montar (mount)
   - Usar como directorio
4. Crear snapshots periódicamente
5. Si necesitas clon: crear volumen desde snapshot
6. Desadjuntar cuando no uses
```

## Relaciones

### Conecta con
- [[introduccion-openstack|Introducción a OpenStack]] — Almacenamiento persistent
- [[nova-instancias-openstack|Nova: Instancias]] — Adjunción de volúmenes
- [[proxmox|Proxmox]] — Thin provisioning similar

### Parte de
- OpenStack Stack
- Cloud Computing IaaS

## Fuentes

- [Curso OpenStack - Módulo 4: Cinder](https://github.com/josedom24/curso_openstack_ies/tree/main/modulo4)
- [Cinder Documentation](https://docs.openstack.org/cinder/)
- [Block Storage Management](https://docs.openstack.org/cinder/latest/user/)
