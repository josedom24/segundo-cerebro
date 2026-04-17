---
title: "Instalación de VMs por Red en KVM"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kvm_ow]
tags: [automatizacion, instalacion, kvm]
---

# Instalación de VMs por Red en KVM

## Resumen de una línea
Instalación virt-install por URL (--location): repositorios HTTP/FTP/NFS, consola serie (--graphics none, --console pty), kernel parameters, automatización sin ISO local.

## Información
- **Fuente:** Curso KVM 2024 (Avanzado) - Unidad 7
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm2/
- **Líneas de contenido:** 250+


## Instalación por Red vs ISO Local

### Ventajas Instalación por Red

```
✅ Sin descargar ISO (3-4 GB)
✅ Siempre última versión disponible
✅ Múltiples VMs sin copiar ISO
✅ Repositorios centralizados
✅ Automatizable fácilmente
✅ Entorno headless (sin GUI)

❌ Requiere conectividad red
❌ Más lento que SSD local
```

### Caso Típico

```
ISP/Datacenter sin GUI
  → virt-install --location
  → Consola serie
  → Instalación automática
  → Sin interfaz gráfica
```


## Repositorios de Instalación Disponibles

### Debian

```bash
# Instalación netinst (mínima, descarga paquetes)
http://deb.debian.org/debian/dists/bookworm/main/installer-amd64/

# Instalación full (todos paquetes incluidos)
http://deb.debian.org/debian-cd/current/amd64/iso-dvd/

# Arquitecturas soportadas
# - amd64 (x86_64)
# - arm64
# - ppc64el
# - s390x
```

### Rocky Linux / AlmaLinux

```bash
# Rocky 9 Stream
http://download.rockylinux.org/pub/rocky/9/BaseOS/x86_64/os/

# AlmaLinux 9
http://repo.almalinux.org/almalinux/9/BaseOS/x86_64/os/
```

### CentOS / RHEL

```bash
# CentOS 9 Stream
http://mirror.centos.org/centos/9-stream/BaseOS/x86_64/os/

# RHEL (requiere subscripción)
# https://access.redhat.com/downloads/...
```

### Fedora

```bash
# Fedora 41
https://download.fedoraproject.org/pub/fedora/linux/releases/41/Everything/x86_64/os/
```

### Ubuntu

```bash
# Ubuntu 24.04 LTS
http://archive.ubuntu.com/ubuntu/dists/noble/main/installer-amd64/

# O repositorio local si tienes mirror
http://mirror.local/ubuntu/...
```

### Arch Linux

```bash
# Arch (más complejo, no netinst típico)
http://mirror.rackspace.com/archlinux/iso/latest/
```


## Instalación Básica por Red

### Sintaxis Simple

```bash
virt-install --connect qemu:///system \
             --virt-type kvm \
             --name debian12-net \
             --location http://deb.debian.org/debian/dists/bookworm/main/installer-amd64/ \
             --os-variant debian12 \
             --disk size=10 \
             --memory 1024 \
             --vcpus 2
```

**Parámetros:**
- `--location URL`: Repositorio de instalación
- `--os-variant`: Optimizaciones para SO
- `--disk size=10`: Tamaño disco (10 GB)
- `--memory 1024`: RAM en MB
- `--vcpus 2`: Número de vCPUs


## Instalación Headless (Sin GUI)

### Configuración para Consola Serie

```bash
virt-install --connect qemu:///system \
             --virt-type kvm \
             --name debian12-headless \
             --location http://deb.debian.org/debian/dists/bookworm/main/installer-amd64/ \
             --os-variant debian12 \
             --disk size=10 \
             --memory 1024 \
             --vcpus 2 \
             --graphics none \
             --console pty,target_type=serial \
             --extra-args="console=ttyS0,115200n8"
```

**Parámetros clave:**

 Parámetro  Significado 
-----------------------
 `--graphics none`  Sin interfaz gráfica 
 `--console pty,target_type=serial`  Consola serie por PTY 
 `--extra-args="console=ttyS0"`  Kernel envía output a serie 
 `115200n8`  Baud rate 115200, 8 bits, sin paridad 

### Flujo de Instalación

```
Ejecución:
  ↓
virt-install inicia instalador
  ↓
Consola serie en terminal
  ↓
Preguntas instalador (interactivo)
  ↓
Seleccionar disco
  ↓
Particionar
  ↓
Instalar paquetes base
  ↓
Configurar red (DHCP auto)
  ↓
Instalar grub
  ↓
Primer boot
  ↓
Sistema listo
```


## Instalación Automatizada

### Preseed (Debian/Ubuntu)

Archivo de respuestas automático para instalador Debian

**Archivo: preseed.cfg**

```
# Idioma
d-i debian-installer/language string es
d-i debian-installer/locale string es_ES.UTF-8

# Disco
d-i partman-auto/disk string /dev/vda
d-i partman-auto/method string regular
d-i partman-auto/choose_recipe select atomic

# Particionamiento
d-i partman/choose_partition select finish
d-i partman/confirm boolean true
d-i partman/confirm_nooverwrite boolean true

# Red
d-i netcfg/choose_interface select auto
d-i netcfg/dhcp_timeout string 60

# Hostname
d-i netcfg/get_hostname string debian12
d-i netcfg/get_domain string ejemplo.local

# Root password
d-i passwd/root-password password root
d-i passwd/root-password-again password root

# Usuario normal
d-i passwd/user-fullname string Usuario Test
d-i passwd/username string usuario
d-i passwd/user-password password password
d-i passwd/user-password-again password password

# Zona horaria
d-i time/zone string Europe/Madrid

# Paquetes
tasksel tasksel/first multiselect standard
d-i pkgsel/include string openssh-server vim curl

# Grub
d-i grub-installer/only_debian boolean true
d-i grub-installer/with_other_os boolean false

# Acabar
d-i finish-install/reboot_in_seconds integer 0
```

### Usar Preseed en virt-install

```bash
# Servir preseed.cfg por HTTP
python3 -m http.server 8000 &  # en directorio con preseed.cfg

# Instalar con preseed
virt-install --connect qemu:///system \
             --virt-type kvm \
             --name debian12-auto \
             --location http://deb.debian.org/debian/dists/bookworm/main/installer-amd64/ \
             --os-variant debian12 \
             --disk size=10 \
             --memory 1024 \
             --vcpus 2 \
             --graphics none \
             --console pty,target_type=serial \
             --extra-args="preseed/url=http://192.168.122.1:8000/preseed.cfg console=ttyS0,115200n8" \
             --noreboot
```

**Resultado:** Instalación completamente automática, sin interacción


## Kickstart (RedHat/CentOS/Rocky)

Equivalente a preseed para sistemas RedHat

**Archivo: kickstart.cfg**

```
# Instalador
install

# Ubicación instalación
url --url="http://mirror.centos.org/centos/9-stream/BaseOS/x86_64/os/"

# Disco
ignoredisk --only-use=vda
bootloader --location=mbr --driveorder=vda

# Particionamiento automático
zerombr
clearpart --all --initlabel
autopart

# Teclado/Idioma
keyboard --vckeymap=es
lang es_ES.UTF-8

# Zona horaria
timezone --utc Europe/Madrid

# Root password
rootpw --plaintext root

# Usuario
user --name=usuario --password=password

# Paquetes
%packages
@core
openssh-server
vim
curl
%end

# Comandos post-instalación
%post
systemctl enable sshd
%end
```

### Usar Kickstart

```bash
virt-install --connect qemu:///system \
             --virt-type kvm \
             --name rocky9-auto \
             --location http://mirror.centos.org/centos/9-stream/BaseOS/x86_64/os/ \
             --os-variant rocky9 \
             --disk size=10 \
             --memory 2048 \
             --vcpus 2 \
             --graphics none \
             --console pty,target_type=serial \
             --extra-args="console=ttyS0,115200n8 ks=http://192.168.122.1:8000/kickstart.cfg" \
             --noreboot
```


## Cloud-Init (Para Cloud)

Alternativa moderna para inicialización VM en cloud

```yaml
#cloud-config
hostname: mi-vm
fqdn: mi-vm.ejemplo.local

users:
  - name: usuario
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh-authorized-keys:
      - ssh-rsa AAAA... usuario@host

packages:
  - openssh-server
  - vim
  - curl

runcmd:
  - systemctl enable sshd
  - echo "VM inicializada" > /root/init.txt

power_state:
  mode: reboot
  delay: 0
```

### Usar Cloud-Init

```bash
# Preparar ISO cloud-init
cloud-localds init.iso user-data.yaml

# Montar en instalación
# (más avanzado, típicamente con qcow2 backing images)
```


## Flujo Completo: Automatización Batch

```bash
#!/bin/bash

# Configuración
LOCATION="http://deb.debian.org/debian/dists/bookworm/main/installer-amd64/"
CANTIDAD=5
PREFIX="web"

# Servir preseed
cat > preseed.cfg <<'EOF'
# (contenido preseed aquí)
EOF
python3 -m http.server 8000 > /dev/null 2>&1 &
HTTP_SERVER_PID=$!

# Crear múltiples VMs
for i in $(seq 1 $CANTIDAD); do
  NAME="${PREFIX}-$(printf %02d $i)"
  IP="192.168.122.$((100+i))"
  
  echo "Creando $NAME..."
  
  virt-install --connect qemu:///system \
               --virt-type kvm \
               --name $NAME \
               --location $LOCATION \
               --os-variant debian12 \
               --disk size=10 \
               --memory 1024 \
               --vcpus 2 \
               --graphics none \
               --console pty,target_type=serial \
               --extra-args="preseed/url=http://192.168.122.1:8000/preseed.cfg console=ttyS0,115200n8" \
               --noreboot \
               --wait 0  # No esperar
done

# Esperar a que terminen
wait $HTTP_SERVER_PID
echo "✅ $CANTIDAD VMs creadas automáticamente"
```


## Troubleshooting

### Instalador no se conecta

```bash
# Verificar conectividad
virsh net-list
virsh net-info default

# Comprobar URL válida
curl http://deb.debian.org/debian/dists/bookworm/main/installer-amd64/
```

### Preseed/Kickstart no se carga

```bash
# Verificar servidor HTTP
python3 -m http.server 8000

# Desde otra terminal
curl http://192.168.122.1:8000/preseed.cfg
```

### Consola serie no aparece

```bash
# Ejecutar sin --noreboot
virt-install ... --noreboot

# O usar virt-viewer
virt-viewer nombre-vm
```


## Relaciones

### Conecta con
- [[virsh-cli-kvm|Unidad 3: virsh CLI]]
- [[redes-virsh|Unidad 6: Redes]]

### Parte de
- [[kvm|KVM (Kernel-based Virtual Machine)]] — Stack de virtualización


## Fuentes

- [Curso: KVM Avanzado 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm2/)
- [Curso KVM Avanzado 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
- [virt-install Man Page](https://linux.die.net/man/1/virt-install)
- [Debian Preseed](https://wiki.debian.org/DebianInstaller/Preseed)
- [Kickstart Documentation](https://pykickstart.readthedocs.io/)
