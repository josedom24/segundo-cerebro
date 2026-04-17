---
title: "Gestión de Máquinas Virtuales con virsh"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kvm_ow]
tags: [kvm]
---

# Gestión de Máquinas Virtuales con virsh

## Resumen de una línea
virsh CLI: gestión de dominios (VMs), definición XML, ciclo de vida (define/start/stop/destroy), volúmenes, acceso a virt-viewer, gestión sin GUI.

## Información
- **Fuente:** Curso KVM 2024 (Avanzado) - Unidad 3
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm2/
- **Líneas de contenido:** 300+


## Concepto: Dominios en virsh

### Definición
Un **dominio** = máquina virtual gestionada por libvirt

```
Conceptos:
  Domain     → VM en libvirt
  XML config → Definición del dominio
  Pool       → Almacenamiento de volúmenes
  Volume     → Disco individual
```

### Ciclo de Vida Dominio

```
No existe
    ↓
define (XML)
    ↓ (persistente, no running)
Defined
    ↓
start
    ↓
Running
    ↓
stop/shutdown
    ↓
Stopped
    ↓
undefine
    ↓
No existe
```


## Crear Dominio con virsh

### Paso 1: Preparar ISO

```bash
# Copiar ISO al pool de almacenamiento
sudo cp debian-12.10.0-amd64-netinst.iso \
  /var/lib/libvirt/images/
```

### Paso 2: Crear Volumen (Disco)

```bash
# Crear disco QCOW2 de 10GB
virsh vol-create-as default mi-vm.qcow2 \
  --format qcow2 10G

# Alternativa con qemu-img
qemu-img create -f qcow2 /var/lib/libvirt/images/mi-vm.qcow2 10G
```

### Paso 3: Crear XML de Dominio

**Archivo: dominio.xml**

```xml
<domain type='kvm'>
  <name>mi-vm</name>
  <memory unit='MiB'>2048</memory>
  <vcpu placement='static'>2</vcpu>
  
  <os>
    <type arch='x86_64' machine='pc-q35-6.2'>hvm</type>
    <boot dev='cdrom'/>
    <boot dev='hd'/>
  </os>
  
  <devices>
    <!-- Disco Principal (QCOW2) -->
    <disk type='file' device='disk'>
      <driver name='qemu' type='qcow2'/>
      <source file='/var/lib/libvirt/images/mi-vm.qcow2'/>
      <target dev='vda' bus='virtio'/>
    </disk>
    
    <!-- CDROM (ISO) -->
    <disk type='file' device='cdrom'>
      <driver name='qemu' type='raw'/>
      <source file='/var/lib/libvirt/images/debian-12.10.0-amd64-netinst.iso' index='1'/>
      <target dev='sda' bus='sata'/>
      <readonly/>
    </disk>
    
    <!-- Red -->
    <interface type='network'>
      <source network='default'/>
      <model type='virtio'/>
    </interface>
    
    <!-- Consola Gráfica -->
    <graphics type='spice' autoport='yes'/>
  </devices>
</domain>
```

**Configuración explicada:**
```
<memory>: RAM en MiB (2048 = 2GB)
<vcpu>: Número de vCPUs
<type arch>: x86_64 recomendado
<boot dev>: Orden arranque (cdrom antes que hd)
<driver type='qcow2'>: Formato disco (thin provisioning)
<model type='virtio'>: Driver red VirtIO (mejor perf)
<graphics type='spice'>: Acceso gráfico SPICE
```


## Ciclo de Vida con virsh

### Definir Dominio (Persistente)

```bash
# Registrar en libvirt (no inicia)
virsh define dominio.xml

# Verificar definido
virsh list --all
# Output:
#  Id   Name      State
#  -    mi-vm     shut off
```

### Crear Dominio (Temporal)

```bash
# Crear sin persistencia (desaparece al apagar)
virsh create dominio.xml

# Útil para testing rápido
```

### Iniciar Dominio

```bash
# Iniciar VM existente
virsh start mi-vm

# Verificar estado
virsh list
# Output:
#  Id   Name      State
#  1    mi-vm     running
```

### Acceder a Consola

```bash
# Instalar herramienta visor
sudo apt install virtinst

# Abrir consola gráfica (SPICE)
virt-viewer mi-vm

# Alternativa no bloqueante
virt-viewer mi-vm &
```

### Detener Dominio

```bash
# Apagar gracefully (ACPI)
virsh shutdown mi-vm
# Tarda segundos, SO realiza shutdown ordenado

# Force kill (si shutdown no responde)
virsh destroy mi-vm
# Tarda milisegundos, no limpia bien
```

### Eliminar Dominio

```bash
# Eliminar definición (mantiene disco)
virsh undefine mi-vm

# Eliminar definición y almacenamiento
virsh undefine --remove-all-storage mi-vm
```


## Gestión de Volúmenes

### Crear Volumen

```bash
# Con virsh (mediante API libvirt)
virsh vol-create-as default mi-nuevo.qcow2 \
  --format qcow2 20G

# Con qemu-img (herramienta nativa)
qemu-img create -f qcow2 mi-nuevo.qcow2 20G
```

### Listar Volúmenes

```bash
virsh vol-list default
# Output:
#  Name              Path
#  mi-vm.qcow2       /var/lib/libvirt/images/mi-vm.qcow2
#  mi-nuevo.qcow2    /var/lib/libvirt/images/mi-nuevo.qcow2
```

### Clonar Volumen

```bash
# Copiar disco existente
virsh vol-clone mi-vm.qcow2 copia-vm.qcow2 \
  --pool default

# Result: nuevo volumen idéntico
```

### Redimensionar Volumen

```bash
# Expandir disco (toma espacio dinámicamente)
virsh vol-resize default/mi-vm.qcow2 25G

# En VM, expandir filesystem
sudo growpart /dev/vda 1  # si particiones
sudo resize2fs /dev/vda1  # expandir ext4
```


## Consultar Información de Dominio

### Ver Detalles

```bash
# XML completo del dominio
virsh dumpxml mi-vm

# Información en formato tabla
virsh dominfo mi-vm
# Output:
#  Id:             1
#  Name:           mi-vm
#  UUID:           ...
#  OS Type:        hvm
#  State:          running
#  CPU(s):         2
#  Max memory:     2097152 KiB
#  Used memory:    2097152 KiB
```

### Monitoreo

```bash
# Estadísticas en tiempo real
virsh domstats mi-vm
# Output: CPU %, IO, memoria...

# Procesos dentro de VM
virsh top

# Eventos del dominio
virsh event --domain mi-vm
```


## Opciones Avanzadas de virsh

### Editar Dominio en Vivo

```bash
# Editar XML (cambios tras reboot)
virsh edit mi-vm

# Abre editor de texto con XML
# Cambios se aplican automáticamente
```

### Snapshots desde virsh

```bash
# Crear snapshot
virsh snapshot-create-as mi-vm snap1 \
  "Pre-test snapshot"

# Listar snapshots
virsh snapshot-list mi-vm

# Restaurar
virsh snapshot-revert mi-vm snap1

# Eliminar
virsh snapshot-delete mi-vm snap1
```

### Clonación Avanzada

```bash
# Clonar dominio completo (incluye discos)
virsh vol-clone mi-vm.qcow2 clon-vm.qcow2
virt-clone --original mi-vm --auto-clone \
  --name mi-vm-clon
```


## Flujo de Trabajo Completo: virsh vs virt-manager

### Con virt-manager (GUI - Curso 1)
```
1. Interfaz visual
2. Wizard asistente
3. Clicks en botones
4. Ideal principiantes
```

### Con virsh (CLI - Curso 2)
```
1. Editor de texto (XML)
2. Comandos directos
3. Programable/automatizable
4. Ideal scripting
5. Mejor para infraestructura
```

### Equivalencias

 Acción  virt-manager  virsh 
-----------------------------
 Nueva VM  Archivo → Nueva  virsh define + XML 
 Iniciar  Botón play  virsh start 
 Parar  Botón stop  virsh shutdown 
 Eliminar  Click derecho  virsh undefine 
 Consola  Doble clic  virt-viewer 
 Snapshots  Botón 3 (Instantáneas)  virsh snapshot-* 


## Ejemplos Prácticos

### Crear múltiples VMs scriptadas

```bash
#!/bin/bash
for i in {1..3}; do
  virsh vol-create-as default vm$i.qcow2 \
    --format qcow2 10G
  
  sed "s/mi-vm/vm$i/g" dominio.xml > dominio$i.xml
  virsh define dominio$i.xml
  virsh start vm$i
done
```

### Backup de VM

```bash
# Exportar definición
virsh dumpxml mi-vm > backup-mi-vm.xml

# Copiar disco
cp /var/lib/libvirt/images/mi-vm.qcow2 \
   /backup/mi-vm-$(date +%Y%m%d).qcow2
```

### Restaurar desde backup

```bash
virsh define backup-mi-vm.xml
virsh vol-create-as default mi-vm-restore.qcow2 \
  --inputpool default \
  --input backup-mi-vm-20260415.qcow2
```


## Relaciones

### Conecta con
- [[conceptos-avanzados-kvm|Unidad 1: Conceptos Avanzados]]
- [[setup-avanzado-kvm|Unidad 2: Setup Avanzado]]
- [[almacenamiento-virsh|Unidad 4: Almacenamiento (virsh)]]
- [[clonacion-virsh|Unidad 5: Clonación (virsh)]]

### Parte de
- [[kvm|KVM]] — Stack de virtualización


## Fuentes

- [Curso: KVM Avanzado 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm2/)
- [Curso KVM Avanzado 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
- [virsh Man Page](https://linux.die.net/man/1/virsh)
- [libvirt Domain XML](https://libvirt.org/formatdomain.html)
