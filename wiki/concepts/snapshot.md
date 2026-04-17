---
title: Snapshot
created: 2026-04-16
updated: 2026-04-16
sources: [curso_kubernetes_cep, curso_openstack_ies, curso_proxmox_cep, curso_kvm_ow]
tags: [snapshot]
aliases: [Snapshot]
---

# Snapshot

## Resumen de una línea
Captura punto-en-tiempo de estado: máquina virtual, volumen, o contenedor; base para backup incremental, clones, y recuperación ante fallos.

## Definición

**Snapshot** = Captura congelada del estado de un recurso (VM, volumen, imagen). Permite:
- Backup sin parar sistema
- Rollback a punto anterior
- Clonación rápida (copia-en-escritura)
- Testing seguro

Presente en múltiples plataformas: KVM, Proxmox, OpenStack, Kubernetes

## Tipos de Snapshot

### VM Snapshot (Máquina completa)

```
Captura:
- Contenido memoria (RAM)
- Estado disco
- Configuración

Tamaño: Puede ser grande (incluye RAM)

Casos: Proxmox, KVM

Rollback:
VM v1.0 → Snapshot → Cambios
     ↓ (Rollback)
VM v1.0 (sin cambios)
```

**Ventajas:**
- Recuperación completa
- Testing sin riesgo

**Desventajas:**
- Consumo espacio (incluye RAM)
- Lento si VM grande
- No viable para producción constante

### Volume/Disk Snapshot (Almacenamiento)

```
Captura:
- Solo disco (datos)
- NO incluye RAM

Tamaño: Mínimo inicialmente (copia-en-escritura)

Casos: OpenStack Cinder, KVM, Kubernetes

Rollback:
Volumen original con cambios
        ↓
Revertir a snapshot anterior
        ↓
Volumen en estado anterior
```

**Ventajas:**
- Ligero (sin RAM)
- Incremental (crecimiento mínimo)
- Mejor para storage

**Desventajas:**
- No recupera RAM/estado memoria
- Requiere aplicación consciente (fsync, flush)

### Image Snapshot (Plantilla)

```
Captura:
- Estado actual como nueva imagen

Uso:
- Crear nuevas VMs/contenedores
- Distribución de plantillas
- Rollback sin revertir estado

Casos: OpenStack Glance, Proxmox templates
```

## Copia-en-Escritura (Copy-on-Write)

```
Snapshot ocupa mínimo espacio inicialmente:

Volumen original: 10 GB
    ↓
Crear snapshot
    ↓
Snapshot: 0 GB (apunta al original)
    ↓
Volumen modifica 2 GB
    ↓
Snapshot ahora: 2 GB (datos modificados)
Volumen: 10 GB (original intacto)
```

Eficiencia:
- Snapshot rápido (no copia datos)
- Espacio incremental (solo cambios)
- Flexible (múltiples snapshots)

## Casos de Uso

### Backup Incremental

```
Día 1: Snapshot S1 (10 GB)
       Backup S1 a almacenamiento externo

Día 2: Snapshot S2 (solo cambios: 1 GB)
       Backup solo deltas
       Espacio total: 11 GB

Día 3: Snapshot S3 (cambios: 0.5 GB)
       Backup eficiente
```

### Testing Seguro

```
Producción ejecutándose
        ↓
Crear snapshot
        ↓
Hacer cambios/experimentos
        ↓
Si todo OK: commit cambios
Si falla: rollback a snapshot
```

### Clonación Rápida

```
Snapshot de VM template
        ↓
Crear 100 clones (copia-en-escritura)
        ↓
Cada clon comparte base
        ↓
Cambios son privados de cada clon
```

## Recuperación ante Desastre

```
Falla en Producción
        ↓
Revertir a snapshot previo (minutos)
        ↓
Servicio arriba
        ↓
Investigar qué falló
        ↓
Aplicar fix
```

**RPO:** Recovery Point Objective (datos perdidos)
- Snapshot cada 1 hora → máximo 1 hora de datos perdidos

**RTO:** Recovery Time Objective (downtime)
- Revertir snapshot: minutos

## Limitaciones

```
❌ No es backup completo
   - Snapshot local = riesgo pérdida total

❌ No preserva memoria
   - VM snapshot: sí, pero pesado
   - Volume snapshot: no

❌ Depende storage backend
   - Algunos backends no soportan snapshots
   - Rendimiento impacto

✅ Solución: Snapshots locales + Backup remoto
```

## Relaciones

### Conecta con

### Aparece en
- [[kvm|KVM (Kernel-based Virtual Machine)]] — Internal/external snapshots
- [[proxmox|Proxmox VE: Plataforma de Virtualización]] — VM snapshots
- [[openstack|OpenStack]] — Volume/image snapshots
- [[kubernetes|Kubernetes]] — Volume snapshots
- [[volume|Volume]] — Storage snapshots

### Casos comunes
- Backup incremental vía snapshots
- Clonación rápida con copia-en-escritura
- Rollback a punto anterior ante fallos

## Fuentes

- [Proxmox Snapshots](https://pve.proxmox.com/wiki/Backup_and_Restore)
- [OpenStack Snapshots](https://docs.openstack.org/cinder/latest/user/blockstorage-manage-volumes.html#create-a-snapshot)
- [KVM Snapshots](https://www.linux-kvm.org/page/Snapshots)
- [Kubernetes Volume Snapshots](https://kubernetes.io/docs/concepts/storage/volume-snapshots/)
