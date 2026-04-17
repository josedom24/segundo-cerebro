---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kvm_ow]
tags: [kvm, virtualizacion]
---

# Introducción a la Virtualización con KVM/libvirt

## Resumen de una línea
KVM es un hipervisor que virtualiza máquinas completas (con SO propio) a nivel kernel Linux; libvirt es la API para gestionarlas; virt-manager proporciona interfaz gráfica.

## Información
- **Fuente:** Curso KVM Introducción - Unidad 1
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm1/
- **URL GitHub:** https://github.com/josedom24/curso_kvm_ow
- **Líneas de contenido:** 400+

---

## Concepto: ¿Qué es Virtualización?

**Virtualización** = Software imita características de hardware → sistema informático virtual

### Comparación: Contenedores vs Máquinas Virtuales

 Aspecto  Contenedores  VMs 
---------------------------
 **Kernel**  Compartido  Propio (completo) 
 **Sistema Operativo**  Ninguno (librería compartida)  Completo (Ubuntu, Windows, etc.) 
 **Arranque**  Milisegundos  Minutos 
 **Tamaño**  MB  GB 
 **Aislamiento**  Procesos  Completo 
 **Performance**  Nativo  -5-10% overhead 
 **Overhead**  Mínimo  Significativo 
 **Uso típico**  Aplicaciones  Sistemas completos 

---

## Casos de Uso de Virtualización

```
✅ Aislamiento de servicios
✅ Laboratorio de pruebas
✅ Emulación de arquitecturas (ARM en x86)
✅ Clústeres y sistemas distribuidos
✅ Herramienta de aprendizaje (sin hardware)
✅ Consolidación de servidores
✅ Alta disponibilidad y recuperación
✅ Software heredado (legacy)
```

---

## Ventajas

```
💰 Ahorro económico (menos hardware)
🔒 Seguridad (aislamiento)
⚙️ Mejor aprovechamiento de recursos
🚀 Migración en vivo (Live Migration)
📉 Menor consumo energético
📈 Escalabilidad
```

---

## Desventajas

```
❌ Dependencia de un servidor físico
⚡ Sobrecarga de rendimiento (~5-10%)
🔧 Complejidad en configuración
🎓 Curva de aprendizaje pronunciada
```

---

## Conceptos Clave

### Host/Anfitrión
Sistema operativo que ejecuta el hipervisor (Linux en este caso)

### Guest/Invitado/Huésped
Sistema operativo virtualizado (Ubuntu, Windows, etc.)

### Hipervisor
Software de virtualización (KVM en este caso)

---

## Tipos de Virtualización

### 1. Virtualización Completa (Full Virtualization)

```
Guest OS: Windows
  ↓
Hipervisor: KVM
  ↓
Host OS: Linux
  ↓
Hardware: CPU + RAM
```

- Guest no sabe que está virtualizado
- Overhead de emulación
- Ejemplo: KVM, VMware, Hyper-V

### 2. Para-Virtualización

```
Guest OS: Optimizado para paravirtual
  ↓
Hipervisor: Xen
  ↓
Host OS: Linux
```

- Guest conoce que está virtualizado
- Menos overhead
- Ejemplo: Xen

### 3. Virtualización a Nivel SO (Contenedores)

```
Aplicación
  ↓
Contenedor (namespaces, cgroups)
  ↓
Kernel Linux (compartido)
```

- Ejemplo: Docker, Podman

---

## Tecnologías Hardware

```
Intel VT-x:   Extensiones de virtualización Intel
AMD-V:        Extensiones de virtualización AMD
IOMMU:        Entrada/Salida virtualizada
```

Necesarios para buen rendimiento. La mayoría de CPUs modernas los incluyen.

---

## QEMU/KVM Stack

### QEMU
```
- Emulador de sistemas completos
- Puede emular cualquier arquitectura
- Sin KVM: 100% software (lento)
```

### KVM (Kernel Virtual Machine)
```
- Hipervisor en el kernel de Linux
- Acelera QEMU usando hardware (Intel VT-x, AMD-V)
- QEMU + KVM = Rendimiento cercano a nativo
```

### libvirt
```
- Biblioteca de abstracción
- API común para distintos hipervisores (KVM, Xen, VMware)
- Facilita gestión de máquinas virtuales
```

### virt-manager
```
- Interfaz gráfica para libvirt
- Simplifica creación y gestión de VMs
```

---

## Stack Completo

```
┌─────────────────────────────────────┐
│ virt-manager (GUI)                   │
├─────────────────────────────────────┤
│ libvirt (API)                        │
├─────────────────────────────────────┤
│ QEMU + KVM (Virtualización)          │
├─────────────────────────────────────┤
│ Hardware (CPU VT-x/AMD-V)            │
└─────────────────────────────────────┘
```

---

## Relaciones

### Conecta con
- [[kvm|KVM]] — Hipervisor basado en Linux
- [[contenedores|Contenedores]] — Alternativa ligera a virtualización
- [[proxmox|Proxmox]] — Plataforma que usa KVM

### Diferencia con
- [[docker|Docker]] — Virtualización completa vs ligera
- [[podman|Podman]] — Contenedores vs máquinas virtuales

### Parte de
- Soluciones de virtualización en infraestructura

---

## Próximo Paso

Con conceptos claros, pasar a [[virt-manager-setup|Unidad 2: virt-manager]].

---

## Fuentes

- [Curso: KVM 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm1/)
- [Curso KVM 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
- [KVM Official](https://www.linux-kvm.org/)
