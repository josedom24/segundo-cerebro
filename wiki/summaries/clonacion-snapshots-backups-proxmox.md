---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_proxmox_cep]
tags: [proxmox, vm]
---

# Clonación, Snapshots y Backups en Proxmox

## Resumen de una línea
Clonación de VMs (completa vs ligera), conversión de VMs en plantillas, creación y rollback de snapshots, y copias de seguridad con tres modos (stop/suspend/snapshot).

## Información
- **Fuente:** Curso Proxmox VE - Módulo 5
- **Duración:** 2 horas teoría + 2 horas actividades prácticas
- **Semana:** Semana 5

---

## Clonación de Máquinas Virtuales

### Clonación Completa (Full Clone)

```
Máquina original → Copia independiente (almacenamiento duplicado)
├─ Discos copiados completamente
├─ Nueva máquina autónoma
└─ Requiere configuración posterior (hostname, red, etc.)
```

**Procedimiento:**
1. VM original debe estar creada
2. Botón derecho → Clone
3. Elegir ID y nombre de nueva VM
4. Seleccionar storage destino
5. Completar clonación

**Nota:** Nueva máquina idéntica a la original, requiere modificaciones de configuración

### Ventajas
- VM completamente independiente
- Sin dependencias de máquina origen
- Mejor para producción

### Desventajas
- Copia completa del almacenamiento
- Más tiempo de creación
- Consume más espacio

---

## Plantillas y Clonación Ligera

### Conversión en Plantilla

```
VM Configurada → Plantilla (Read-only)
├─ VM debe estar apagada
├─ No se puede usar la VM original nuevamente
└─ Punto base para clonaciones ligeras
```

**Procedimiento:**
1. VM → Hardware → Convert to template
2. VM cambia icono y se vuelve read-only
3. Solo operación posible: Clone

### Clonación Ligera (Linked Clone)

```
Plantilla (base) → VM 1
                 → VM 2  
                 → VM 3
(Aprovisionamiento ligero, crecimiento dinámico)
```

**Características:**
- Almacenamiento vinculado a plantilla
- Sin copiar datos al crear
- VMs crecen según cambios
- Creación muy rápida
- Ahorro significativo de espacio

**Opción durante clonación:**
- **Full Clone:** Independencia total (almacenamiento copiado)
- **Linked Clone:** Vinculado (almacenamiento compartido con plantilla)

### Modificación de Plantillas

```
Plantilla → Modificar hardware (RAM, CPU, etc.)
         → Nuevas VMs heredan cambios
```

Permite ajustar características base antes de clonar

---

## Snapshots (Instantáneas)

### Concepto

```
VM en tiempo T1 → Guardar estado (almacenamiento + RAM)
              ↓
              → Versión guardada para rollback posterior
```

**Propósito:** Capturar estado completo de VM para poder volver a ese punto

### Requisitos

- Storage con soporte (local-lvm, qcow2)
- VM puede estar corriendo o apagada
- Qemu-agent mejora consistencia

### Creación de Snapshot

**Procedimiento:**
1. VM → Snapshots → Take Snapshot
2. Ingresar nombre descriptivo
3. Opcionalmente agregar descripción
4. Guardar almacena estado de almacenamiento + RAM

### Rollback (Restauración)

```
Estado A → Estado B (snapshot) → Estado A (rollback)
```

**Procedimiento:**
1. VM → Snapshots → Seleccionar snapshot
2. Botón Rollback
3. VM vuelve a estado guardado

### Operaciones

- **Remove:** Eliminar snapshot
- **Edit:** Modificar información (nombre, descripción)
- **Rollback:** Volver a estado guardado

### Caso de Uso Educativo

En ciclos formativos (FP), estudiantes pueden:
- Experimentar con cambios en VM
- Volver a estado estable si hay problemas
- No necesitan eliminar VM y recrearla

---

## Copias de Seguridad

### Tres Modos de Backup

```
┌─────────────────────┬──────────────────┬───────────────────┐
│ STOP MODE           │ SUSPEND MODE     │ SNAPSHOT MODE     │
├─────────────────────┼──────────────────┼───────────────────┤
│ VM se para          │ VM se suspende   │ VM sigue corriendo │
│ Mayor consistencia  │ Consistencia 80% │ Menor consistencia │
│ Breve downtime      │ Sin downtime     │ Mínimo downtime    │
│ Más seguro          │ Término medio    │ Más rápido         │
└─────────────────────┴──────────────────┴───────────────────┘
```

**Elección según necesidad:**
- Producción crítica → STOP MODE
- Laboratorio → SNAPSHOT MODE
- Balance → SUSPEND MODE

### Creación de Backup

**Procedimiento:**
1. VM → Backup → Backup now
2. Seleccionar storage destino
3. Elegir modo (stop/suspend/snapshot)
4. Seleccionar compresión (gzip, lz4, zstd)
5. Opcionalmente: email de notificación
6. Si múltiples discos: se copian todos

### Archivo de Backup

```
Formato: qemu-YYYYMMDD-HHMMSS.vma.gz
         [tipo]-[fecha]-[hora].[compresión]

Ejemplo: qemu-20260415-143022.vma.lz4
```

Incluye información de compresión en nombre

### Restauración

**Opción 1: Desde backup de VM**
- VM → Backup → Restore
- Restaura sobre misma VM

**Opción 2: Desde backup de storage**
- Storage → local → Backup → Restore
- Crea nueva VM desde backup

**En ambos casos:** Elegir almacenamiento destino

### Operaciones sobre Backup

- **Remove:** Eliminar backup
- **Show Configuration:** Ver detalles
- **Restore:** Crear o restaurar VM

---

## Comparativa: Snapshots vs Backups

| Aspecto | Snapshot | Backup |
|---------|----------|--------|
| **Almacenamiento** | Local (misma fuente) | Otro almacenamiento |
| **Velocidad** | Muy rápido | Más lento (comprime) |
| **Propósito** | Rollback temporal | Recuperación ante desastre |
| **Retención** | Corto plazo | Largo plazo |
| **Consistencia** | Alta (si Qemu-agent) | Seleccionable |
| **Compresión** | No | Sí |

---

## Relaciones

### Conecta con
- [[creacion-maquinas-virtuales-proxmox|Creación de VMs]] — Base para clonar
- [[almacenamiento-proxmox|Almacenamiento]] — Dónde se guardan
- [[usuarios-permisos-proxmox|Usuarios y Permisos]] — Control de acceso

---

## Próximo Paso

Trabajar con Linux Containers (LXC), creación y gestión de contenedores ligeros.

---

## Fuentes
- [Curso Proxmox VE - Módulo 5 (GitHub)](https://github.com/iesgn/curso_proxmox_cep)
- [Proxmox Backup and Restore](https://pve.proxmox.com/wiki/Backup_and_Restore)
