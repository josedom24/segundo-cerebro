---
created: 2026-04-17
updated: 2026-04-17
sources: [josedomingo-vagrant-libvirt, josedomingo-vagrant-redes, josedomingo-vagrant-almacenamiento]
tags: [vagrant, libvirt, kvm, redes, almacenamiento, automatizacion]
---

# Vagrant + libvirt: Configuración Completa de Networking y Almacenamiento

## Resumen de una línea
Guía para usar Vagrant con libvirt/KVM en Linux, cobriendo configuración de redes, almacenamiento persistente y casos de uso prácticos.

## ¿Por Qué Vagrant + libvirt en Linux?

### Comparativa de Providers en Linux

| Aspecto | VirtualBox | libvirt | Docker |
|--------|-----------|---------|--------|
| **Hardware** | Virtualización completa | KVM nativo | Container |
| **Rendimiento** | 70-80% nativo | 95%+ nativo | 99%+ nativo |
| **Recursos Host** | ~1.5GB RAM por VM | ~512MB RAM por VM | ~50MB RAM |
| **SO realista** | ✅ Completo | ✅ Completo | ❌ Container |
| **Daemon requerido** | ❌ VirtualBox service | ✅ libvirtd | ✅ Docker daemon |
| **Linux integration** | External | **Kernel nativo** | External |

**Conclusión:** libvirt + Vagrant = eficiencia de KVM + automatización Vagrant

## Instalación Vagrant + libvirt

### Prerequisitos (Ubuntu/Debian)

```bash
# 1. KVM + libvirt
sudo apt-get install qemu qemu-kvm libvirt-daemon-system libvirt-clients

# 2. Vagrant
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get install vagrant

# 3. Plugin libvirt para Vagrant
vagrant plugin install vagrant-libvirt

# 4. Usuario en grupo libvirt (sin sudo)
sudo usermod -aG libvirt,kvm $USER
newgrp libvirt
```

### Verificar Instalación

```bash
vagrant plugin list
# vagrant-libvirt (0.x.x, system plugins)

virsh -c qemu:///system list
# Conecta a libvirt daemon

vagrant box list
# Muestra boxes descargadas
```

## Configuración de Redes en Vagrant + libvirt

### Tipos de Red en libvirt

```
┌─ Host
│
├─ Virbr0 (virtual bridge)
│   ├─ DHCP nativo
│   └─ VMs conectadas (NAT)
│
├─ Virbr1+ (bridges virtuales personalizados)
│   └─ Redes aisladas entre VMs
│
└─ Bridge físico (vmbr0)
    └─ VMs accesibles desde host físicamente
```

### 1. Red NAT (Por Defecto)

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "generic/ubuntu2004"
  
  config.vm.provider "libvirt" do |libvirt|
    # Esta es la red por defecto (virbr0 NAT)
    # Acceso a internet ✅
    # Acceso desde host: SSH solo via localhost:22
  end
end
```

**Características:**
- ✅ Acceso saliente a internet
- ❌ No accesible desde host (excepto port forwarding)
- Múltiples VMs pueden coexistir

### 2. Red Privada (Host-only)

```ruby
config.vm.network "private_network", 
  ip: "192.168.121.10",
  libvirt__network_name: "vagrant-net"
```

**Resultado:**
```
Host:       192.168.121.1 (gateway)
VM:         192.168.121.10
Ping:       ✅ Funciona
SSH:        ✅ ssh vagrant@192.168.121.10
Internet:   ✅ Funciona (ruta via host)
```

**Múltiples Redes Privadas:**

```ruby
config.vm.network "private_network", ip: "192.168.121.10"
config.vm.network "private_network", ip: "10.0.0.10"
# VM tiene 3 interfaces: eth0 (NAT), eth1 (192.168.121.x), eth2 (10.0.0.x)
```

### 3. Red Pública (Bridge con Interfaz Host)

```ruby
config.vm.network "public_network",
  ip: "192.168.1.100",
  netmask: "255.255.255.0",
  gateway: "192.168.1.1",
  dns_servers: ["8.8.8.8"],
  libvirt__network_name: "default"  # O tu bridge personalizado
```

**Resultado:**
```
Host:       192.168.1.50 (en LAN)
VM:         192.168.1.100 (en LAN, ip fija)
Ping host:  ✅ VM ve host
Ping VM:    ✅ Host ve VM
Internet:   ✅ Directo
```

### 4. Multi-VM con Networking

```ruby
Vagrant.configure("2") do |config|
  # Crear bridge personalizado para VMs comunicadas entre sí
  config.vm.define "web" do |web|
    web.vm.box = "generic/ubuntu2004"
    web.vm.hostname = "web.local"
    web.vm.network "private_network", ip: "192.168.121.10"
    web.vm.provision "shell", inline: "apt-get update && apt-get install -y nginx"
  end
  
  config.vm.define "db" do |db|
    db.vm.box = "generic/ubuntu2004"
    db.vm.hostname = "db.local"
    db.vm.network "private_network", ip: "192.168.121.20"
    db.vm.provision "shell", inline: "apt-get update && apt-get install -y mysql-server"
  end
  
  config.vm.define "cache" do |cache|
    cache.vm.box = "generic/ubuntu2004"
    cache.vm.hostname = "cache.local"
    cache.vm.network "private_network", ip: "192.168.121.30"
    cache.vm.provision "shell", inline: "apt-get update && apt-get install -y redis-server"
  end
end

# Resultado:
# web   → 192.168.121.10  (Nginx)
# db    → 192.168.121.20  (MySQL)
# cache → 192.168.121.30  (Redis)
# 
# Todas se comunican internamente via IPs privadas
```

**Uso:**

```bash
vagrant up web db cache

# En la VM web:
vagrant ssh web
ping 192.168.121.20     # ✅ Ping a DB
mysql -h 192.168.121.20 -u root  # ✅ Conectar a BD remota
```

## Almacenamiento Persistente en Vagrant + libvirt

### Problema: Datos Efímeros

```
vagrant destroy
  ↓
Todos los datos de la VM → ❌ Eliminados
```

**Solución:** Volúmenes persistentes desacoplados de la VM

### 1. Volúmenes Adicionales (Block devices)

```ruby
config.vm.provider "libvirt" do |libvirt|
  # Volumen adicional de 10GB
  libvirt.storage :file, 
    :size => '10G',
    :type => 'qcow2'
  
  # Segundo volumen de 5GB
  libvirt.storage :file,
    :size => '5G',
    :type => 'qcow2'
end

# En la VM:
lsblk
# sda     Disco OS
# sdb     Primer volumen (10GB)
# sdc     Segundo volumen (5GB)
```

**Setup del Volumen:**

```bash
vagrant ssh

# En la VM:
sudo mkfs.ext4 /dev/sdb
sudo mkdir -p /data
sudo mount /dev/sdb /data
sudo chown vagrant:vagrant /data
df -h  # ✅ /data disponible
```

**Persistencia automática (Vagrantfile):**

```ruby
config.vm.provision "shell", inline: <<-SHELL
  mkfs.ext4 -F /dev/sdb 2>/dev/null
  mkdir -p /data
  mount /dev/sdb /data
  echo "/dev/sdb /data ext4 defaults 0 0" >> /etc/fstab
  chown vagrant:vagrant /data
SHELL
```

### 2. Carpetas Compartidas con NFS

```ruby
config.vm.synced_folder ".", "/vagrant", type: "nfs"
```

**Ventajas:**
- Más rápido que Guest Additions
- Compartir datos host-VM transparente

**Requisito:**
```bash
# Host: NFS server
sudo apt-get install nfs-kernel-server
```

### 3. Snapshot: Backup Rápido

```bash
# Crear snapshot antes de cambios
virsh snapshot-create-as VM_NAME backup-preupgrade

# Listar snapshots
virsh snapshot-list VM_NAME

# Revertir
virsh snapshot-revert VM_NAME backup-preupgrade
```

## Casos Prácticos

### Caso 1: Stack LEMP Completo

```ruby
Vagrant.configure("2") do |config|
  # Stack: Linux (Ubuntu) + Nginx + MySQL + PHP
  
  config.vm.box = "generic/ubuntu2004"
  config.vm.hostname = "lemp.local"
  
  # Red privada (acceso desde host)
  config.vm.network "private_network", ip: "192.168.121.50"
  
  # Volumen persistente para MySQL
  config.vm.provider "libvirt" do |libvirt|
    libvirt.storage :file, :size => '20G', :type => 'qcow2'
  end
  
  # Carpeta compartida para código PHP
  config.vm.synced_folder "code/", "/var/www/html", type: "nfs"
  
  # Provisioning
  config.vm.provision "shell", path: "provision-lemp.sh"
end
```

### Caso 2: Cluster Kubernetes Local

```ruby
Vagrant.configure("2") do |config|
  # Master
  config.vm.define "k8s-master" do |master|
    master.vm.box = "generic/ubuntu2004"
    master.vm.hostname = "k8s-master"
    master.vm.network "private_network", ip: "192.168.121.100"
    master.vm.vm.provider "libvirt" do |libvirt|
      libvirt.cpus = 4
      libvirt.memory = 4096
    end
    master.vm.provision "shell", path: "init-master.sh"
  end
  
  # Workers
  (1..2).each do |i|
    config.vm.define "k8s-worker-#{i}" do |worker|
      worker.vm.box = "generic/ubuntu2004"
      worker.vm.hostname = "k8s-worker-#{i}"
      worker.vm.network "private_network", ip: "192.168.121.#{110 + i}"
      worker.vm.provision "shell", path: "init-worker.sh"
    end
  end
end
```

## Troubleshooting Común

### Error: "No host memory available"

```bash
# Solución: Reducir RAM por VM
config.vm.provider "libvirt" do |libvirt|
  libvirt.memory = 1024  # 1GB en lugar de 2GB
  libvirt.cpus = 1       # 1 CPU en lugar de 2
end
```

### NFS timeout en carpetas compartidas

```bash
# Verificar NFS está ejecutándose
sudo systemctl status nfs-kernel-server

# Reiniciar NFS
sudo systemctl restart nfs-kernel-server

# O cambiar a rsync (más lento pero confiable)
config.vm.synced_folder ".", "/vagrant", type: "rsync",
  rsync__exclude: [".git/", "node_modules/", ".DS_Store"]
```

### VM no tiene acceso a internet

```bash
# Verificar route
vagrant ssh
ip route
# Debe mostrar: default via 192.168.121.1 dev eth0

# Si no, reiniciar net
sudo netplan apply
sudo systemctl restart systemd-networkd
```

## Relaciones

### Conecta con
- [[vagrant-introduccion|Vagrant: Introducción]] — Conceptos base
- [[kvm|KVM]] — Backend de virtualización
- [[redes-kvm|Redes en KVM]] — Networking avanzado
- [[almacenamiento-kvm|Almacenamiento en KVM]] — Volúmenes QCOW2, snapshots
- [[ansible|Ansible]] — Provisioning alternativo a shell scripts

### Mejora a
- [[introduccion-kvm|Introducción a KVM]] — Automatización de VMs
- [[virt-manager-setup|Setup de virt-manager]] — Alternativa GUI (vs IaC)

---

## Fuentes
- [Introducción al uso de vagrant + libvirt + QEMU/KVM (josedomingo.org)](https://www.josedomingo.org/pledin/2021/09/introduccion-vagrant-libvirt/)
- [Introducción vagrant + libvirt: Definición de redes (josedomingo.org)](https://www.josedomingo.org/pledin/2021/10/introduccion-vagrant-libvirt-redes/)
- [Introducción vagrant + libvirt: Almacenamiento (josedomingo.org)](https://www.josedomingo.org/pledin/2021/10/introduccion-vagrant-libvirt-almacenamiento/)
