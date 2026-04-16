---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_kubernetes_cep, curso_openstack_ies, curso_proxmox_cep]
tags: [storage, volume, persistent, block-storage, data]
---

# Volume

## Resumen de una línea
Abstracción de almacenamiento persistente en plataformas de virtualización: desacoplado de compute, supervive eliminación de máquinas/contenedores.

## Definición

**Volume** = Almacenamiento persistente e independiente de la instancia que lo usa. Pueden adjuntarse/desadjuntarse sin pérdida de datos.

Presente en:
- Kubernetes: PersistentVolume (PV)
- OpenStack: Cinder volumes
- Proxmox: LVM/Directory volumes
- Docker: Named volumes
- KVM: Storage pools

## Características Comunes

```
Independencia:
- Existen sin máquina/contenedor
- Se pueden transferir entre máquinas
- No se destruyen al eliminar máquina

Persistencia:
- Datos sobreviven reinicio
- Datos intactos si máquina falla
- Snapshots para backup

Desacoplamiento:
- Storage separado de compute
- Permite escalado flexible
- Backend intercambiable
```

## Tipos Comunes

### Block Volume
```
Acceso a nivel bloque
Casos: Bases de datos, aplicaciones que necesitan POSIX

Ejemplos:
- OpenStack Cinder
- Kubernetes PersistentVolume (block)
- Proxmox LVM thin
- KVM storage pools (QCOW2, LVM)

Montaje:
1. Particionar (fdisk)
2. Formato (mkfs)
3. Montar (mount /mnt/datos)
4. Usar como directorio
```

### Network Volume
```
Acceso remoto vía red
Casos: Datos compartidos, NFS, almacenamiento centralizado

Ejemplos:
- NFS shares
- iSCSI
- Ceph RBD
- Cloud provider disks

Ventajas:
- Fácil backup
- Migraciones rápidas
- Escalabilidad

Desventajas:
- Latencia de red
- Punto único fallo (storage)
```

### Ephemeral Volume
```
Temporal, no persistente
Casos: Cache, logs temporales, datos scratch

Ejemplos:
- emptyDir en Kubernetes
- tmpfs
- Disco local de máquina

Destruido cuando máquina termina
```

## Ciclo de Vida Típico

```
1. Crear volume
   - Size: 10 GB
   - Type: SSD o HDD
   - Backend: Local, NFS, Cloud

2. Adjuntar a máquina/contenedor
   - Instancia Nova obtiene device /dev/vdb
   - Kubernetes monta en /data
   - Container accede al volumen

3. Usar
   - Aplicación escribe datos
   - Datos persisten en storage backend

4. Snapshot (opcional)
   - Captura punto-en-tiempo
   - Backup incremental
   - Base para clones

5. Desadjuntar
   - Máquina sigue activa
   - Volumen disponible para otra máquina

6. Eliminar (cuando no necesita)
   - Libera espacio backend
   - Irreversible
```

## Snapshots

Captura del estado del volumen:

```
Volumen original: 10GB datos
                 ↓
Crear snapshot
                 ↓
Snapshot: 0GB (referencia, copia-en-escritura)
                 ↓
Volumen modifica datos
                 ↓
Snapshot: ahora 2GB (datos cambiados)
```

**Usos:**
- Backup incremental
- Clonación rápida
- Rollback de cambios
- Testing (clone para test, descarta después)

## Comparación entre Plataformas

| Platform | Tipo | Persistencia | Móvil |
|----------|------|--------------|-------|
| Kubernetes | PV | Sí | Sí (entre nodos) |
| OpenStack | Cinder | Sí | Sí (entre instancias) |
| Proxmox | LVM/Dir | Sí | Sí (entre VMs) |
| KVM | QCOW2 | Sí | Sí (portable) |
| Docker | Named | Sí | Limitado |

## Relaciones

### Aparece en
- [[Kubernetes]] — PersistentVolumes
- [[OpenStack]] — Cinder blocks
- [[Proxmox]] — Storage management
- [[KVM]] — Storage pools
- [[StatefulSet]] — Para aplicaciones con estado
- [[Deployment]] — Configuración, secretos

### Complementa
- [[Snapshot]] — Backup incremental de volúmenes

## Fuentes

- [Kubernetes Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [OpenStack Cinder](https://docs.openstack.org/cinder/latest/)
- [Proxmox Storage](https://pve.proxmox.com/wiki/Storage)
