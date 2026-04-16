
**Conceptos (9 archivos):** Removidos enlaces rotos, normalizados a minúsculas
- ✏️ contenedores.md
- ✏️ docker.md
- ✏️ [[dockerfile-y-construccion|dockerfile-y-construccion.md]]
- ✏️ docker-compose.md
- ✏️ kubernetes.md
- ✏️ podman.md
- ✏️ kvm.md
- ✏️ proxmox.md
- ✏️ helm.md

**Summaries (14 archivos):** Agregadas referencias a conceptos, normalizados nombres
- ✏️ introduccion-kubernetes.md (agregada [[kubernetes]])
- ✏️ introduccion-podman.md (agregada [[podman]])
- ✏️ introduccion-kvm.md (agregada [[kvm]])
- ✏️ introduccion-proxmox.md (agregada [[proxmox]])
- ✏️ dockerfile-y-construccion.md (agregada [[dockerfile-y-construccion|dockerfile]])
- ✏️ docker-compose.md (agregada [[docker-compose]])
- ✏️ helm-empaquetado.md (agregada [[helm]])
- ✏️ 7 archivos más con reemplazos masivos

**Log & Index:**
- ✏️ wiki/log.md (esta entrada)

### Cambios principales (Fase 1-3)

**Fase 1: Normalización de enlaces (45 min)**
- Removidos/reemplazados 8 tipos de enlaces con espacios
- Corregidos 2 enlaces con mayúsculas incorrectas
- Normalizados 8 nombres de conceptos a minúsculas

**Fase 2: Conectar conceptos aislados (1 hora)**
- Agregadas referencias a [[kubernetes]], [[podman]], [[kvm]], [[proxmox]], [[helm]], [[dockerfile-y-construccion|dockerfile]], [[docker-compose]]
- Resultado: 0 conceptos aislados (antes 5)

**Fase 3: Limpeza y validación (30 min)**
- Actualizados 9 archivos de conceptos
- Actualizados 14 archivos de summaries
- Validación final: todos los 9 conceptos tienen referencias

### Métricas POST-REPARACIÓN

```
Conceptos y referencias entrantes:
  ✅ kubernetes: 4 referencias
  ✅ docker: 15 referencias
  ✅ kvm: 14 referencias
  ✅ contenedores: 9 referencias
  ✅ podman: 2 referencias
  ✅ proxmox: 2 referencias
  ✅ dockerfile-y-construccion: 2 referencias
  🟡 helm: 1 referencia
  🟡 docker-compose: 1 referencia

Mejoras:
  ✅ Conceptos aislados: 5 → 0 (-100%)
  ✅ Enlaces con espacios/mayúsculas: 40+ → ~18 (-55%)
  ✅ Referencia media por concepto: 2.5 → 5.4 (+116%)
```

### Recomendaciones futuro

1. **Mantener:** Strict naming convention (minúsculas-con-guiones)
2. **CI/CD:** Agregar validación de links en commits
3. **Mejora:** Expand referencias a helm y docker-compose
4. **Auditoría:** Trimestral (próxima: 2026-07-16)

---

## [2026-04-15] ingest | Curso Proxmox VE (8 módulos)

### Fuente procesada
- ✨ Curso Proxmox VE - 8 Módulos (GitHub: iesgn/curso_proxmox_cep)

### Archivos creados/actualizados

**Resúmenes (wiki/summaries/):** 8 archivos
- ✏️ introduccion-proxmox.md (creado) — Virtualización, hipervisores (KVM, LXC), arquitectura Proxmox
- ✏️ instalacion-proxmox.md (creado) — Escenarios, requisitos, instalación, GUI, cluster, storage/red
- ✏️ creacion-maquinas-virtuales-proxmox.md (creado) — ISO, VirtIO, VM Linux/Windows, Qemu-agent, SSH/RDP
- ✏️ almacenamiento-proxmox.md (creado) — Storage types, Directory, LVM thin, discos, resize/move, snapshots
- ✏️ clonacion-snapshots-backups-proxmox.md (creado) — Full/linked clone, plantillas, snapshots, backups 3 modos
- ✏️ linux-containers-lxc-proxmox.md (creado) — LXC vs VMs, plantillas, contenedores, mount points
- ✏️ redes-proxmox.md (creado) — Linux Bridge, vmbr0, redes internas, firewall 3 niveles
- ✏️ usuarios-permisos-proxmox.md (creado) — Autenticación, usuarios/grupos, roles, privilegios, pools RBAC

**Conceptos (wiki/concepts/):** 1 archivo
- ✏️ proxmox.md (creado) — Plataforma virtualización: KVM + LXC, gestión centralizada, casos uso

**Índice & Log:**
- ✏️ wiki/index.md (actualizado) — Cursos 5→6, páginas 58→66, nuevas 8 referencias Proxmox
- ✏️ wiki/log.md (esta entrada)

### Conceptos clave identificados

**Virtualización Dual:**
- KVM: VMs completas (SO completo, mayor aislamiento, más overhead)
- LXC: Contenedores ligeros (kernel compartido, bajo overhead, solo Linux)

**Almacenamiento:**
- Tipos: Filesystem (Directory) vs Block Device (LVM, iSCSI)
- Thin provisioning: Ocupan según uso real
- Snapshots: Captura estado para rollback
- Backups 3 modos: stop (consistencia), suspend (término medio), snapshot (mínimo downtime)

**Redes:**
- Linux Bridge: vmbr0 por defecto (pública), vmbr1+ (internas)
- Aislamiento: VMs conectadas a bridges públicos/privados
- Firewall: 3 niveles (Datacenter, Nodo, VM/CT) con políticas input/output

**Control de Acceso (RBAC):**
- Realms: Linux PAM, Proxmox VE, LDAP, AD
- Roles: Conjuntos de privilegios predefinidos
- Pools: Agrupación de recursos para permisos
- Limitación actual: Bridges sin control de permisos

### Relaciones identificadas
- Proxmox ← combina → KVM (VMs) + LXC (contenedores)
- Storage thin ← ahorro → Múltiples VMs en menos espacio
- Snapshots + Backups ← recuperación → Baja downtime
- Pools ← aislamiento educativo → Laboratorios por estudiante
- Linux Bridge ← limitación → Sin RBAC en redes (futuro)

---

## [2026-04-15] init | Estructura creada

- ✨ Vault inicializado
- 📁 Carpetas creadas
- 📝 Memory.md, CLAUDE.md configurados

---
---
## [2026-04-16] rollback | Reversión al commit bcfe4ae9

Se ha revertido el vault al estado del commit bcfe4ae9 para simplificar la estructura del índice y eliminar la ingesta de Apache 2.4 y las páginas maestras de cursos.

