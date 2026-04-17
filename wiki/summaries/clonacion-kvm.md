---
title: "Clonación de Máquinas Virtuales en KVM"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kvm_ow]
tags: [kvm]
---

# Clonación de Máquinas Virtuales en KVM

## Resumen de una línea
Clonación en virt-manager: clonación completa copia XML y discos con cambios automáticos; clonación sin disco usa almacenamiento compartido; gestión de identidad única (machine ID, MAC, hostname).

## Información
- **Fuente:** Curso KVM 2024 - Unidad 5
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm1/
- **Líneas de contenido:** 250+


## Clonación Completa (Full Clone)

### Concepto
Copia **independiente** de VM original:
```
- XML config completo
- Todos los discos copiados
- Ajustes automáticos para unicidad
- Totalmente standalone
```

### Proceso

```
1. VM origen debe estar apagada ✅
2. Click derecho en VM → Clonar
3. Dar nombre a VM clonada
4. [Opcional] Detalles... → cambiar nombre fichero disco
5. Confirmar
```

### Resultado

```
VM Original (debian-server)
├─ Fichero disco: debian-server.qcow2
└─ Configuración: debian-server.xml

VM Clonada (debian-server-clon)
├─ Fichero disco: debian-server-clon.qcow2 (NUEVA COPIA)
└─ Configuración: debian-server-clon.xml (ADAPTADA)
```

**Cambios automáticos en clon:**
```
✅ Nombre de máquina
✅ UUID único
✅ Rutas de discos actualizadas
❌ NO cambia: machine ID, MAC, hostname, claves SSH
```

### Ventajas Clonación Completa
```
✅ Independencia total
✅ Cambios en uno no afectan otro
✅ Seguro para producción
✅ Portable a otro host
```

### Desventajas
```
❌ Consume mucho espacio (2 copias de disco)
❌ Tarda más tiempo en crear
```


## Clonación sin Disco (Linked Clone)

### Concepto
Clona VM pero **NO copia discos**

```
VM Original (debian-server)
└─ Fichero disco: debian-server.qcow2

VM Clonada (debian-server-clon)
└─ Referencia AL MISMO disco: debian-server.qcow2
```

### Proceso

```
1. Clonar (igual que completa)
2. En opciones de disco → DESMARCAR disco
3. Confirmar
```

### Características

```
✅ Economiza espacio (sin duplicar disco)
✅ Creación muy rápida
❌ PELIGROSO: Ambas VMs escriben en mismo disco
❌ Riesgo corrupción de datos
❌ Cambios en una afectan a la otra
```

### Casos de Uso Limitados

```
🔵 Cluster de máquinas (donde compartir es intencional)
⚠️ Desarrollo especial con sincronización
❌ NO recomendado para uso normal
```


## Problemas de Identidad en Clones

### El Problema

Después de clonar, VM clonada es **idéntica** a original:

```
Machine ID: IGUAL
MAC address: IGUAL  
Hostname: IGUAL
Claves SSH: IGUAL
SSH keys: IGUAL
```

**Consecuencia:** Si ambas VMs en red → Conflictos graves

### Soluciones Manuales

#### Cambiar Hostname

**Opción 1: Editar fichero**
```bash
sudo nano /etc/hostname
# Cambiar contenido
```

**Opción 2: GUI de SO**
```
Acerca de → Nombre del equipo → [cambiar]
```

#### Regenerar Machine ID (Linux)

```bash
sudo systemd-machine-id-setup --print
# Regenera /etc/machine-id
```

#### Cambiar MAC Address (en virt-manager)

```
Detalles → Interfaces de red
→ Click derecho → Detalles
→ MAC address → Generar nueva
```

#### Regenerar Claves SSH (Linux)

```bash
sudo ssh-keygen -A
# Regenera todas las claves host en /etc/ssh/ssh_host_*
```

### Herramientas Automatizadas (Futura)

Algunos entornos usan **cloud-init** o **sysprep** para automatizar:
```
- RHEL/CentOS: virt-sysprep
- Ubuntu: cloud-init
```

Pero no se cubren en este módulo


## Estrategia de Clonación

### Para Laboratorio de Pruebas

```
1. Crear VM "plantilla" perfecta
   └─ Sistema limpio
   └─ Herramientas instaladas
   └─ Configuración base

2. Clonar N veces (FULL CLONE)
   └─ VM test-1
   └─ VM test-2
   └─ VM test-3

3. En cada clon, cambiar:
   └─ Hostname
   └─ Machine ID
   └─ MAC address
   └─ IPs si es necesario
```

### Para Producción

```
❌ NO usar clonación simple
✅ Usar soluciones profesionales:
   - Template management (vSphere, CloudStack)
   - Infrastructure-as-Code (Terraform, Ansible)
   - Cloud-init scripts
```


## Casos Prácticos

### Caso 1: Crear 3 VMs de prueba

```
1. Crear VM debian-base apagada
2. Clonar → debian-test-1 ✅
3. Clonar → debian-test-2 ✅
4. Clonar → debian-test-3 ✅
5. En cada una: Cambiar hostname
   - sudo hostnamectl set-hostname debian-test-N
6. Reiniciar cada una
```

**Resultado:** 3 VMs independientes, lista para testing

### Caso 2: Error - Clonación sin disco (INCORRECTO)

```
❌ Clonar sin disco para ahorrar espacio
   → Ambas VMs escriben mismo disco
   → Corrupción garantizada ❌
```


## Relaciones

### Conecta con
- [[creacion-vms|Creación de Máquinas Virtuales en virt-manager]]
- [[almacenamiento-kvm|Almacenamiento en KVM - virt-manager]]
- [[redes-kvm|Redes en KVM - libvirt]]

### Parte de
- [[kvm|KVM (Kernel-based Virtual Machine)]] — Stack de virtualización


## Fuentes

- [Curso: KVM 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm1/)
- [Curso KVM 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
