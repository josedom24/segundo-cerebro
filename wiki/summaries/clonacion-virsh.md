---
title: "Clonación Avanzada con virsh"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kvm_ow]
tags: [kvm, templates]
---

# Clonación Avanzada con virsh

## Resumen de una línea
Clonación CLI: virt-clone (--auto-clone, --name, --file), virsh vol-clone + virt-install, problemas identidad, plantillas VM, automation scripting.

## Información
- **Fuente:** Curso KVM 2024 (Avanzado) - Unidad 5
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm2/
- **Líneas de contenido:** 280+


## Clonación con virt-clone

### Herramienta virt-clone

CLI tool para clonar dominios (VMs) completos

```
virt-clone: High-level tool
  → Clona automáticamente
  → Resuelve detalles
  → Ideal usuarios
  
virsh vol-clone + virt-install: Manual
  → Más control
  → Para scripting
  → Avanzado
```

### Auto-Clone (Más Simple)

```bash
# Clonar dominio completo (automático)
virt-clone --connect=qemu:///system \
           --original debian12 \
           --auto-clone

# Auto-clone resuelve:
#  ✅ Nuevo nombre (debian12-clon)
#  ✅ Nueva MAC address
#  ✅ Nuevo disco (debian12-clon.qcow2)
```

### Clone Manual (Más Control)

```bash
# Especificar nombre
virt-clone --original debian12 \
           --name debian12-prod

# Especificar nombre + disco
virt-clone --original debian12 \
           --name debian12-prod \
           --file /var/lib/libvirt/images/prod.qcow2

# Especificar todo
virt-clone --connect qemu:///system \
           --original debian12 \
           --name debian12-prod \
           --file /var/lib/libvirt/images/prod.qcow2 \
           --auto-clone  # aun resuelve MAC automáticas
```

### Opciones Útiles

```bash
# Sin conectar automáticamente
virt-clone --original origen \
           --name clon \
           --noreboot

# Especificar pool de almacenamiento
virt-clone --original origen \
           --name clon \
           --disk pool=vm-images

# Preservar MAC address (mismo dominio)
virt-clone --original origen \
           --name clon \
           --preserve
```


## Clonación Paso a Paso: virsh vol-clone + virt-install

### Paso 1: Clonar Volumen

```bash
# Copiar disco de origen
virsh vol-clone debian12.qcow2 \
                 debian12-clon.qcow2 \
                 --pool default

# Resultado: nuevo volumen independiente
virsh vol-list default  grep debian12
# debian12.qcow2      /var/lib/libvirt/images/debian12.qcow2
# debian12-clon.qcow2 /var/lib/libvirt/images/debian12-clon.qcow2
```

### Paso 2: Crear Dominio con virt-install

```bash
# Crear nueva VM usando volumen clonado
virt-install --connect qemu:///system \
             --virt-type kvm \
             --name debian12-clon \
             --os-variant debian12 \
             --disk vol=default/debian12-clon.qcow2 \
             --memory 2048 \
             --vcpus 2 \
             --import  # NO pide instalación
```

**Opciones:**
- `--import`: usa volumen clonado (no instala)
- `--disk vol=`: referencia pool/volumen
- `--memory/--vcpus`: puede diferir de original

### Ventajas vs virt-clone

```
virt-clone:
  ✅ Una línea, automático
  ❌ Menos flexible
  
virsh vol-clone + virt-install:
  ✅ Máximo control
  ✅ Scripteable
  ❌ Más pasos
```


## Problemas de Identidad en Clones

### Problema

Clon es **idéntico** al original:

```
Machine ID:  IGUAL (sistema)
MAC address: IGUAL (red)
Hostname:    IGUAL (SO)
SSH keys:    IGUAL (criptografía)
UUID:        IGUAL (sistema)
```

**Consecuencias:**
```
❌ Dos VMs en red → conflictos MAC
❌ Autenticación SSH → confusión clave pública
❌ Identificación sistema → problemas log
❌ UUIDs no únicos → issues clustering
```

### Soluciones Manuales

#### 1. Cambiar Machine ID (Linux)

```bash
# Dentro de clon
sudo cat /etc/machine-id
# Output: abc123xyz...

sudo hostnamectl set-hostname nuevo-nombre
# Regenera machine-id automáticamente

# O manual
sudo rm /etc/machine-id
sudo systemd-machine-id-setup
```

#### 2. Cambiar Hostname

```bash
# Opción 1: CLI
sudo hostnamectl set-hostname nueva-vm

# Opción 2: Editar fichero
sudo nano /etc/hostname
# Cambiar contenido

# Opción 3: GUI (Debian)
# Configuración → Acerca de → Nombre equipo
```

#### 3. Regenerar Claves SSH

```bash
# Dentro de clon
sudo ssh-keygen -A
# Regenera todas las claves host

# Verificar
sudo ls -la /etc/ssh/ssh_host_*
# Debería tener timestamps nuevos
```

#### 4. Cambiar MAC Address (virsh)

```bash
# Editar dominio
virsh edit debian12-clon

# Cambiar en sección interface:
# <mac address='52:54:00:12:34:56'/>
# a algo nuevo como:
# <mac address='52:54:00:ab:cd:ef'/>

# Salvar (automático)
```

#### 5. Cambiar UUID del Dominio

```bash
# Editar dominio
virsh edit debian12-clon

# Cambiar UUID:
# <uuid>original-uuid-here</uuid>
# a uno nuevo (o dejar que libvirt genere)

# Salvar
```


## Flujo Completo: Clone + Limpieza

### Script de Clonación

```bash
#!/bin/bash
set -e

ORIGEN="debian12"
CLON="debian12-prod"

echo "1. Clonando volumen..."
virsh vol-clone $ORIGEN.qcow2 $CLON.qcow2 \
  --pool default

echo "2. Creando dominio..."
virt-install --connect qemu:///system \
             --virt-type kvm \
             --name $CLON \
             --os-variant debian12 \
             --disk vol=default/$CLON.qcow2 \
             --memory 2048 \
             --vcpus 2 \
             --import \
             --noreboot

echo "3. Arrancar clon..."
virsh start $CLON

echo "4. Esperar a que inicie..."
sleep 10

echo "5. Regenerar claves SSH..."
virt-customize -d $CLON --run-command \
  'ssh-keygen -A'

echo "6. Cambiar machine ID..."
virt-customize -d $CLON --run-command \
  'rm /etc/machine-id && systemd-machine-id-setup'

echo "7. Cambiar hostname..."
virt-customize -d $CLON --hostname $CLON

echo "✅ Clon completado: $CLON"
```

### Herramienta virt-customize

Herramienta para modificar VMs sin iniciar:

```bash
# Instalar
sudo apt install libguestfs-tools

# Cambiar hostname (sin iniciar VM)
virt-customize -d debian12-clon \
  --hostname nuevo-nombre

# Ejecutar comando
virt-customize -d debian12-clon \
  --run-command 'ssh-keygen -A'

# Cambiar contraseña
virt-customize -d debian12-clon \
  --root-password password:new-password

# Inyectar SSH key
virt-customize -d debian12-clon \
  --ssh-inject root:file:/root/.ssh/id_rsa.pub
```


## Plantillas de VMs (VM Templates)

### Concepto

Crear VM "plantilla" perfecta, luego clonarla múltiples veces

### Creación de Plantilla

```bash
# 1. Crear VM "plantilla-debian12"
# 2. Instalar SO, paquetes, configuración
# 3. Limpiar antes de usar como plantilla

# Limpieza de plantilla
virt-customize -d plantilla-debian12 \
  --run-command 'apt-get clean' \
  --run-command 'rm -rf /tmp/*' \
  --run-command 'rm -rf /var/log/*' \
  --run-command 'truncate -s 0 /var/log/wtmp' \
  --run-command 'ssh-keygen -A' \
  --run-command 'history -c'

# 4. Apagar y sellar
virsh shutdown plantilla-debian12
```

### Clonar desde Plantilla

```bash
# Clonar múltiples veces
for i in {1..5}; do
  virt-clone --original plantilla-debian12 \
             --name web-$i \
             --auto-clone
  
  # Personalizar cada clon
  virt-customize -d web-$i \
    --hostname web-$i
done
```


## Automatización: Clonación en Batch

```bash
#!/bin/bash
# Script para crear clones múltiples

TEMPLATE="plantilla-debian12"
CANTIDAD=10
PREFIX="server"

for i in $(seq 1 $CANTIDAD); do
  NAME="${PREFIX}-${i:02d}"
  
  echo "Clonando $NAME..."
  virt-clone --original $TEMPLATE \
             --name $NAME \
             --auto-clone
  
  # Personalizar
  echo "Personalizando $NAME..."
  virt-customize -d $NAME \
    --hostname $NAME \
    --run-command "sed -i 's/DHCP/192.168.1.$((100+i))/' \
      /etc/network/interfaces"
  
  # Inicial arranque rápido
  virsh start $NAME --console  true
done

echo "✅ $CANTIDAD clones creados"
```


## Relaciones

### Conecta con
- [[virsh-cli-kvm|Gestión de Máquinas Virtuales con virsh]]
- [[almacenamiento-virsh|Almacenamiento en KVM/libvirt con virsh]]

### Parte de
- [[kvm|KVM (Kernel-based Virtual Machine)]] — Stack de virtualización


## Fuentes

- [Curso: KVM Avanzado 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm2/)
- [Curso KVM Avanzado 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
- [virt-clone Man Page](https://linux.die.net/man/1/virt-clone)
- [virt-customize Man Page](https://linux.die.net/man/1/virt-customize)
