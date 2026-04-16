---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_openstack_ies]
tags: [openstack, cloud, iaas, virtualizacion, sdn]
---

# OpenStack

## Resumen de una línea
Plataforma open-source de cloud computing IaaS: gestión integrada de compute (Nova), almacenamiento (Cinder), redes (Neutron), imágenes (Glance) con interfaz web (Horizon) y CLI.

## Definición

**OpenStack** = Suite de proyectos open-source que implementan cloud computing de infraestructura como servicio (IaaS). Proporciona gestión integrada de recursos virtuales: máquinas virtuales, almacenamiento, redes, imágenes.

Componentes principales:
- **Nova:** Gestión de instancias (VMs)
- **Glance:** Catálogo de imágenes
- **Cinder:** Almacenamiento en bloques (volúmenes)
- **Neutron:** Virtualización de redes
- **Horizon:** Interfaz web
- **Keystone:** Autenticación y autorización

## Conceptos Clave

### Compute Cloud (IaaS)

```
Provisión de:
- Máquinas virtuales (instancias)
- Almacenamiento persistente
- Redes virtuales
- Snapshots y backups
```

### Flujo Típico

```
1. Seleccionar imagen (Glance) → plantilla SO
2. Elegir flavor (recursos: vCPU, RAM, disco)
3. Crear instancia (Nova) en flavor + imagen
4. Definir red y Floating IP (Neutron) → acceso exterior
5. Opcional: adjuntar volumen (Cinder) para datos
6. Configurar firewall (grupos de seguridad)
7. Acceder por SSH con Floating IP
```

### Ventajas

```
✅ Open-source: código abierto, auditable
✅ Modular: usar solo componentes necesarios
✅ Cloud privado: ejecutar en propia infraestructura
✅ Escalable: diseño distribuido
✅ Maduro: amplia comunidad y documentación
✅ Multi-tenant: soporta múltiples usuarios/proyectos
✅ Estándares: usa tecnologías estándar (libvirt, KVM, Linux)
```

### Desventajas

```
❌ Curva aprendizaje pronunciada
❌ Complejidad operacional
❌ Overhead de componentes
❌ Mantenimiento requiere expertise
❌ Alternativas más simples (ProxmoxVE, etc)
```

## Componentes por Módulo

### Módulo 1: Introducción
- **Horizon:** Dashboard web
- **OpenStack Client (OSC):** CLI para automatización
- Configuración: claves SSH, grupos de seguridad

### Módulo 2: Glance
- Gestión de imágenes
- Catálogo reutilizable
- Formatos múltiples (QCOW2, raw, etc)
- Snapshots de instancias → nuevas imágenes

### Módulo 3: Nova
- Ciclo de vida de instancias
- Sabores (flavors) = configuración de recursos
- Snapshots y redimensión
- Cloud-init para automatización

### Módulo 4: Cinder
- Almacenamiento persistente (volúmenes)
- Adjunción a instancias
- Snapshots incremental
- Tipos de almacenamiento (SSD, HDD, etc)

### Módulo 5: Neutron
- Redes privadas virtuales
- Enrutadores y conectividad
- Floating IPs (IPs públicas)
- Grupos de seguridad (cortafuegos)
- Software Defined Networking (SDN)

## Casos de Uso

```
🟢 Cloud privado corporativo
🟢 Hosting de aplicaciones web escalables
🟢 Entornos de desarrollo/testing on-demand
🟢 Laboratorios educativos
🟢 Infraestructura elástica bajo demanda
🟢 Migración desde hardware tradicional
```

## Comparación

### vs Proxmox VE

```
OpenStack:
- Más complejo, mayor curva aprendizaje
- Componentes modulares
- IaaS puro (más control usuario)
- Mejor para multi-tenant

Proxmox VE:
- Más simple, setup rápido
- Integrado (VMs + Containers)
- Mejor para administradores
- Mejor para small/medium
```

### vs Kubernetes

```
OpenStack:
- Gestión de VMs completas
- IaaS (infraestructura)
- Cada app en su VM

Kubernetes:
- Gestión de contenedores
- Paas/Serverless
- Múltiples apps por nodo
- Mayor densidad
```

## Stack Típico

```
      Usuario (SSH)
           ↓
    Floating IP (Neutron)
           ↓
    Red privada (Neutron)
           ↓
    Instancia (Nova) en flavor
           ↓
      Imagen base (Glance)
           ↓
    Volumen Cinder (opcional)
           ↓
    Hypervisor (KVM típicamente)
           ↓
    Hardware físico
```

## Relaciones

### Conecta con
- [[nova-instancias-openstack|Nova: Instancias]] — Computación
- [[glance-imagenes-openstack|Glance: Imágenes]] — Plantillas
- [[cinder-almacenamiento-openstack|Cinder: Almacenamiento]] — Persistencia
- [[neutron-redes-openstack|Neutron: Redes]] — Conectividad
- [[introduccion-openstack|Introducción OpenStack]] — Primer paso
- [[kvm|KVM]] — Hypervisor típico subyacente
- [[proxmox|Proxmox VE]] — Alternativa integrada

### Parte de
- Cloud Computing (IaaS)
- Infrastructure as Code
- Data Center virtualization

## Fuentes

- [Curso OpenStack 2022 (GitHub)](https://github.com/josedom24/curso_openstack_ies)
- [OpenStack Official](https://www.openstack.org/)
- [OpenStack Documentation](https://docs.openstack.org/)
