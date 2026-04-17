---
title: "Setup Avanzado de KVM/QEMU"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kvm_ow]
tags: [instalacion, kvm]
---

# Setup Avanzado de KVM/QEMU

## Resumen de una línea
Setup KVM avanzado: virtualización anidada en VirtualBox/KVM, CPU host-passthrough, requisitos mínimos (8GB RAM, 4 cores, 100GB), BIOS virtualization, optimización memoria.

## Información
- **Fuente:** Curso KVM 2024 (Avanzado) - Unidad 2
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm2/
- **Líneas de contenido:** 200+


## Verificación Hardware

### Soporte Virtualización CPU

```bash
# Comprobar extensiones de virtualización
egrep 'svmvmx' /proc/cpuinfo --color

# Intel: vmx ✅
# AMD: svm ✅
```

**Requisito CRÍTICO:** Activar en BIOS
```
BIOS/UEFI → CPU Settings
  → VT-x (Intel) o AMD-V (AMD)
  → Marcar Enable ✅
  → Salvar y reiniciar
```

**Sin virtualización en BIOS:**
```
❌ KVM no funcionará
❌ Error: "KVM not available"
❌ QEMU fallará
```


## Virtualización Anidada (Nested Virtualization)

### Concepto
Ejecutar hipervisores dentro de máquinas virtuales

```
Hardware Físico
  ↓
Host SO (Linux)
  ↓
KVM/QEMU (Hipervisor 1)
  ↓
VM (Hyper1)
  ↓
KVM/QEMU (Hipervisor 2) ← Nested ✅
  ↓
VM (Hyper2)
```

### Casos de Uso

```
🎓 Docencia
   → Laboratorios KVM/Xen dentro de VirtualBox
   → Sin hardware dedicado
   → Aislamiento de estudiantes

🧪 Desarrollo
   → Probar hipervisores nuevos
   → Testing de infraestructura
   → Simulación de datacenters

🔄 Continuidad
   → Testing en entorno similar a producción
   → Migración de VMs
```


## Nested Virtualization en VirtualBox

### Activación

```
VirtualBox Manager:
  1. Click derecho en VM
  2. Configuración
  3. Sistema → Procesador
  4. ☑️ Habilitar VT-x/AMD-V
```

### Optimización Adicional

```
Sistema → Aceleración:
  ☑️ Habilitar PAE/NX
  ☑️ Habilitar IO APIC
  ☑️ VT-x (si disponible)
  
Memoria:
  → Dedicar ≥ 8GB
  → Extensión paginación (si está)
```

**Resultado:**
```
✅ VirtualBox VM puede ejecutar KVM
✅ Performance degradación ~10-20%
✅ Viable para laboratorios educativos
```


## Nested Virtualization en KVM/QEMU

### Activación Automática

Generalmente está activada por defecto en KVM moderno

```bash
# Verificar módulo KVM
cat /sys/module/kvm_intel/parameters/nested
# Output: Y (activado)

# O para AMD
cat /sys/module/kvm_amd/parameters/nested
# Output: Y
```

### CPU Host-Passthrough (Importante)

Al crear VM en KVM que ejecutará KVM, usar **cpu host-passthrough**

```xml
<!-- En definición VM XML -->
<cpu mode='host-passthrough'>
  <topology sockets='1' cores='2' threads='1'/>
</cpu>
```

**Alternativas (no recomendadas):**
```xml
<!-- Emulación (lento) -->
<cpu mode='emulate'>

<!-- CPU específica (limitado) -->
<cpu mode='custom' match='exact'>
  <model>IvyBridge-IBRS</model>
</cpu>
```

**Por qué host-passthrough:**
```
✅ Acceso directo a VT-x/AMD-V del host
✅ Nested virtualization funciona
✅ Mejor performance
✅ VMs internas pueden virtualizar
```

### Con virt-install

```bash
virt-install --cpu host-passthrough \
             --name mi-vm \
             --memory 4096 \
             --vcpus 2 \
             --disk size=20
```


## Requisitos Mínimos para Laboratorio

### Configuración Recomendada (Host Físico)

```
┌─────────────────────────────┐
│ RAM       │ 8 GB o más      │
│ Disco     │ 100 GB SSD      │
│ CPU       │ 4 cores Min     │
│ BIOS VT   │ Habilitado ✅   │
└─────────────────────────────┘
```

### Distribución de Recursos

#### Distribución RAM por SO Invitado

```
Linux sin GUI (Headless)
  → 512 MB - 1 GB

Linux con GUI (Escritorio)
  → 2 GB - 4 GB

Windows 10/11
  → 2 GB mínimo
  → 4 GB recomendado

Windows Server
  → 2 GB mínimo
  → 4-8 GB recomendado
```

**Ejemplo distribución en host 8GB:**
```
Host reserva        → 2 GB
VM1 (Linux CLI)     → 1 GB
VM2 (Linux GUI)     → 2 GB
VM3 (Windows)       → 3 GB
                      -------
Total               ~ 8 GB ✅
```

#### CPU (Número de Vvirtual Cores)

```
Asignación flexible:
  → VM puede tener 1-N vcpus
  → Mejor performance: 2-4 vcpus por VM
  → Oversubscription posible (no recomendado)

Host 4 cores:
  ✅ VM1: 2 vcpus (headless)
  ✅ VM2: 2 vcpus (escritorio)
  ⚠️ Oversubscription: 4 cores > 4 físicos

Host 8 cores:
  ✅ VM1: 2 vcpus
  ✅ VM2: 2 vcpus
  ✅ VM3: 2 vcpus
  ✅ VM4: 2 vcpus
  (1:1 mapping, mejor)
```

#### Almacenamiento

**Espacio Total Requerido:**
```
ISOs instalación          → 5-10 GB
  (Debian, Windows, CentOS)

Discos VMs (3 VMs × 20GB)→ 60 GB

Buffer/snapshots          → 20 GB
                           --------
Total                     → 90-100 GB

SSD preferible (vs HDD)
  → Mejor performance
  → Faster boot VMs
```


## Consideraciones Avanzadas

### Nested Virtualization Performance

```
Degradación esperada:
  Bare metal      → 100% (baseline)
  KVM una capa    → 90-95%
  KVM 2 capas     → 70-85%
  KVM 3 capas     → 50-70%
```

Aceptable para educación, no para producción

### Memory Overcommitment

```
❌ NO hacer:
  Host 8GB, VMs piden 16GB
  → Swap desastre
  → Performance colapse

✅ Hacer:
  Reservar 2GB para host
  Distribuir resto entre VMs
  Monitorear con `top`
```

### Almacenamiento Hot Plug

```
qemu-img resize disco.qcow2 +10G
  → Disco crece dinámicamente
  → VM puede usar espacio nuevo
  → Útil para laboratorios
```


## Troubleshooting Setup

### KVM no disponible

```bash
# Verificar
kvm-ok
# Output: KVM acceleration can be used

# Si falla:
# 1. Verificar VT-x en BIOS
# 2. Verificar módulo cargado
cat /proc/cpuinfo  grep vmx

# 3. Cargar módulo
sudo modprobe kvm
```

### Nested virtualization no funciona

```bash
# Verificar activado
cat /sys/module/kvm_intel/parameters/nested
# Debería ser: Y

# Si es N, activar:
sudo modprobe -r kvm_intel
sudo modprobe kvm_intel nested=1

# Permanente:
echo "options kvm_intel nested=1"  \
  sudo tee /etc/modprobe.d/kvm.conf
```

### Performance pobre

```
Diagnóstico:
  1. Verificar CPU: cat /proc/cpuinfo
  2. Monitorear: watch -n1 "virsh domstats mi-vm"
  3. Check oversub: virsh vcpucount
  4. Memory pressure: free -h

Soluciones:
  → Reducir número de VMs activas
  → Aumentar RAM del host
  → Usar CPU pinning (avanzado)
  → Cambiar a bare metal si crítico
```


## Checklist Post-Setup

```
✅ CPU: egrep 'vmxsvm' /proc/cpuinfo
✅ BIOS: VT-x/AMD-V habilitado
✅ KVM: kvm-ok (o virt-host-validate)
✅ libvirt: systemctl status libvirtd
✅ virsh: virsh list (sin errores)
✅ Storage: virsh pool-list
✅ Network: virsh net-list
✅ Nested (si aplica): cat /sys/module/kvm_intel/parameters/nested
```


## Relaciones

### Conecta con
- [[conceptos-avanzados-kvm|Unidad 1: Conceptos Avanzados]]
- [[virsh-cli-kvm|Unidad 3: virsh CLI]]

### Parte de
- [[kvm|KVM]] — Stack de virtualización


## Fuentes

- [Curso: KVM Avanzado 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm2/)
- [Curso KVM Avanzado 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
- [KVM Nested Virtualization](https://en.wikibooks.org/wiki/QEMU/Devices/Nested)
