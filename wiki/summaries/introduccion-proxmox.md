---
title: "Introducción a la Virtualización con Proxmox VE"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_proxmox_cep]
tags: [proxmox, virtualizacion]
---

# Introducción a la Virtualización con Proxmox VE

## Resumen de una línea
Conceptos de virtualización, tipos de hipervisores (KVM, LXC), y cómo Proxmox VE actúa como plataforma de gestión centralizada para máquinas virtuales y contenedores.

## Información
- **Fuente:** Curso Proxmox VE - Módulo 1
- **URL Plataforma:** https://github.com/iesgn/curso_proxmox_cep
- **URL GitHub:** https://github.com/iesgn/curso_proxmox_cep
- **Duración:** 2 horas teoría + 30 minutos actividad
- **Semana:** Semana 1


## Definición: Virtualización

**Virtualización = Software que imita características de hardware y crea un sistema informático virtual**

Permite:
- Ejecutar múltiples sistemas operativos en un solo servidor físico
- Aislar aplicaciones y servicios
- Optimizar uso de recursos hardware
- Migración en vivo entre servidores


## Tipos de Virtualización

### 1. Emulación (QEMU)
- Simula CPU completa en software
- Muy lenta
- Ejemplo: emular procesador ARM en x86

### 2. Virtualización Completa (Full Virtualization)
- Hipervisor tipo 1 (bare metal)
- Acceso directo a hardware
- Guest OS desconoce que está virtualizado
- Ejemplo: KVM en Linux, Hyper-V en Windows

### 3. Paravirtualización
- Guest OS colabora con hipervisor
- Mejor rendimiento que full virtualization
- Requiere SO modificado
- Ejemplo: Xen

### 4. Virtualización Ligera (Containers)
- Virtualización a nivel SO
- Kernel compartido
- Bajo overhead
- Ejemplo: Docker, LXC, Podman


## Conceptos Clave

### Host
- Servidor físico donde se ejecuta el hipervisor

### Guest
- Sistema operativo virtualizado

### Hipervisor
- Software de virtualización (KVM, LXC, VMware, Hyper-V)

### Hardware Virtualization
- **Intel VT-x:** Extensiones Intel para virtualización
- **AMD-V:** Extensiones AMD para virtualización
- **Requerido** para buen rendimiento en KVM


## Ventajas de Virtualización

✅ **Ahorro económico:** Menos hardware necesario  
✅ **Seguridad:** Aislamiento entre sistemas  
✅ **Aprovechamiento:** Mejor uso de recursos  
✅ **Migración en vivo:** Mover VMs entre servidores  
✅ **Eficiencia energética:** Consolidación de servidores  


## Desventajas

❌ **Dependencia de hardware:** Si falla servidor físico, fallan todas VMs  
❌ **Overhead:** Rendimiento ~5-10% inferior a nativo  
❌ **Complejidad:** Requiere configuración y gestión  


## Proxmox VE: Solución de Virtualización

### Arquitectura
```
Proxmox VE (Hypervisor Manager)
├── KVM (Máquinas Virtuales completas)
├── LXC (Containers Linux ligeros)
├── Almacenamiento compartido
├── Red centralizada
└── Usuario/permisos
```

### Capacidades Principales
- **KVM:** Virtualización completa de máquinas
- **LXC:** Containers Linux de bajo overhead
- **Gestión centralizada:** Interfaz web unificada
- **Clustering:** Múltiples servidores Proxmox
- **Almacenamiento:** Soporta múltiples fuentes (local, NAS, SAN)
- **Backups:** Sistema integrado de copias de seguridad

### Ventajas de Proxmox
- Open source
- Sin licencias por máquina virtual
- Soporta VMs Linux y Windows
- Soporta containers LXC
- Interfaz web moderna
- CLI completa
- API REST disponible


## Casos de Uso Educativos

```
✅ Laboratorios de SOs
✅ Entornos multiservidor
✅ Pruebas de infraestructura
✅ Estudios de clustering
✅ Consolidación de servidores
```


## Relaciones

### Conecta con
- [[proxmox|Proxmox]] — Plataforma de virtualización integrada
- [[kvm|KVM]] — Hipervisor de máquinas virtuales en Proxmox
- [[contenedores|Contenedores]] — LXC es virtualización ligera en Proxmox

### Diferencia con
- [[docker|Docker]] — Proxmox es full virtualization + containers
- [[kubernetes|Kubernetes]] — Proxmox es infraestructura, K8s es orquestación

### Parte de
- Soluciones de virtualización para datacenters


## Próximo Paso

Instalación de Proxmox VE en servidor o VM anidada con preparación de laboratorio.


## Fuentes
- [Curso Proxmox VE - Módulo 1 (GitHub)](https://github.com/iesgn/curso_proxmox_cep)
- [Proxmox Official](https://www.proxmox.com/)
- [KVM Documentation](https://www.linux-kvm.org/)
