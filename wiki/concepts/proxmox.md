---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_proxmox_cep]
tags: [proxmox, virtualizacion]
aliases: [Proxmox]
---

# Proxmox VE: Plataforma de Virtualización

## Definición

**Proxmox VE** es una plataforma de virtualización de código abierto que combina:
- **KVM:** Hipervisor para máquinas virtuales completas (Linux, Windows)
- **LXC:** Contenedores Linux ligeros (bajo overhead)
- **Interfaz Web:** Gestión centralizada en GUI y CLI
- **Clustering:** Múltiples nodos con almacenamiento compartido
- **Backup/HA:** Sistema integrado de copias y alta disponibilidad

## Características Principales

### Virtualización Dual

```
Proxmox VE
├─ KVM para máquinas virtuales (VMs)
│  ├─ SO completo (Linux, Windows)
│  ├─ Isolamiento total
│  └─ Mayor overhead
└─ LXC para contenedores (CTs)
   ├─ Kernel compartido
   ├─ Bajo overhead
   └─ Solo Linux
```

### Gestión Centralizada

```
GUI Web (https://IP:8006)
├─ Crear/modificar/eliminar VMs y contenedores
├─ Gestión de almacenamiento
├─ Configuración de red
├─ Usuarios, permisos, roles
└─ Backups y snapshots

CLI (ssh root@IP)
├─ Acceso a virsh, qm, pct
├─ Edición de XML
└─ Scripts de automatización
```

### Arquitectura Flexible

```
Escenarios:
├─ Single Node: 1 servidor Proxmox (laboratorio)
├─ Single + Storage: 1 servidor + NAS/SAN
└─ Cluster: 3+ nodos + almacenamiento compartido
```

### Almacenamiento

```
Tipos soportados:
├─ Local: /var/lib/vz (ISOs, backups)
├─ Local-LVM: Volúmenes LVM thin-provisioning
├─ NFS: Network File System
├─ iSCSI: Storage SAN
├─ Ceph: Storage distribuido
└─ ZFS: Almacenamiento avanzado
```

## Relaciones

### Conecta con

### Conceptos Relacionados

**Técnicamente Vinculados:**
- [[kvm|KVM]] — Hipervisor subyacente para VMs
- [[contenedores|Contenedores]] — Fundamento de LXC

**En Contexto de Infraestructura:**
- [[docker|Docker]] — Alternativa para containerización (daemon)
- [[kubernetes|Kubernetes]] — Orquestación de contenedores (nivel superior)

## Casos de Uso

### Educación
- Laboratorios de sistemas operativos
- Simulación de infraestructura multiservidor
- Pruebas de clustering y alta disponibilidad

### Producción Pequeña/Mediana
- Consolidación de servidores
- Hosting privado
- Entornos de testing

### Desarrollo
- Entornos reproducibles
- CI/CD con infraestructura virtual
- Testing multiOS

## Ventajas

✅ **Código abierto:** Sin licencias por VM  
✅ **Dual:** KVM + LXC en un mismo lugar  
✅ **Interfaz intuitiva:** GUI moderna, fácil de usar  
✅ **Scalable:** De 1 a N nodos  
✅ **Completo:** Almacenamiento, red, usuarios integrados  
✅ **Enterprise-ready:** Backup, HA, clustering  

## Limitaciones

❌ **Curva aprendizaje:** Concepto más complejo que Docker  
❌ **Overhead de hypervisor:** Mayor que containers puros  
❌ **Permisos de red:** Limitación actual (sin RBAC en bridges)  

## Módulos del Curso

1. **Introducción** — Conceptos de virtualización
2. **Instalación** — Setup, GUI, estructura
3. **Creación de VMs** — Instalación Linux/Windows
4. **Almacenamiento** — Gestión de discos y storage
5. **Clonación, Snapshots, Backups** — Copias y recuperación
6. **Contenedores LXC** — Alternativa ligera a VMs
7. **Redes** — Bridges, aislamiento, firewall
8. **Usuarios y Permisos** — RBAC, autenticación, pools

## Fuentes

- [Proxmox Official](https://www.proxmox.com/)
- [Proxmox Documentation](https://pve.proxmox.com/wiki/)
- Curso Proxmox VE (GitHub: iesgn/curso_proxmox_cep)
