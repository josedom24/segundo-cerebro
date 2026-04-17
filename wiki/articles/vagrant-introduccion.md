---
created: 2026-04-17
updated: 2026-04-17
sources: [josedomingo-vagrant-blog, hashicorp-vagrant-docs]
tags: [vagrant, vm, automatizacion, kvm, docker]
title: Vagrant - Introducción y Conceptos Fundamentales
---

# Vagrant: Introducción y Conceptos Fundamentales

## Resumen de una línea
Vagrant es una herramienta que automatiza la creación y configuración de máquinas virtuales mediante código declarativo, permitiendo reproducibilidad y colaboración en equipos de desarrollo.

## ¿Qué es Vagrant?

### Problema: Entornos Inconsistentes
```
Desarrollador A: Ubuntu 20.04, Python 3.8
Desarrollador B: Ubuntu 22.04, Python 3.10
QA: CentOS 7
Producción: Debian 11

Resultado: "Funciona en mi máquina" ❌
```

### Solución: Infraestructura as Code
```
Vagrantfile (define una sola vez)
  ↓
vagrant up (todos obtienen el mismo entorno)
  ↓
✅ Consistencia garantizada
```

## Conceptos Clave

### Vagrant
**Herramienta que automatiza provisioning de VMs** mediante:
- **Vagrantfile:** Definición declarativa de la VM
- **Providers:** Backend de virtualización (VirtualBox, libvirt, Hyper-V, AWS)
- **Provisioners:** Scripts de configuración (shell, Ansible, Puppet)
- **Boxes:** Imágenes preconfiguradas (SO + dependencias mínimas)

### Flujo Típico

```bash
# 1. Crear Vagrantfile (define VM)
vagrant init hashicorp/bionic64

# 2. Levantar VM (descarga box, crea, configura)
vagrant up

# 3. Acceder
vagrant ssh

# 4. Trabajar
# ... desarrollo, testing ...

# 5. Compartir estado
git commit Vagrantfile

# 6. Compañero clona y:
vagrant up  # Entorno idéntico
```

### Vagrantfile: Definición

```ruby
Vagrant.configure("2") do |config|
  # 1. Base box (imagen)
  config.vm.box = "hashicorp/bionic64"
  
  # 2. Configuración de red
  config.vm.network "private_network", ip: "192.168.33.10"
  
  # 3. Carpetas compartidas
  config.vm.synced_folder ".", "/vagrant"
  
  # 4. Provisioning (qué instalar/configurar)
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nginx
    systemctl start nginx
  SHELL
  
  # 5. Recursos VM
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 2048
    vb.cpus = 2
  end
end
```

## Providers: Backends Soportados

| Provider | Backend | Uso Típico | Overhead |
|----------|---------|-----------|----------|
| **VirtualBox** | VirtualBox | Development, testing | Alto |
| **libvirt** | KVM/QEMU | Linux servers, integration | Medio |
| **Hyper-V** | Windows native | Windows environments | Bajo |
| **Docker** | Containers | Lightweight, rápido | Muy bajo |
| **AWS** | Cloud | Production-like envs | Variable |

### Vagrant + libvirt (Linux nativo)
```ruby
config.vm.provider "libvirt" do |libvirt|
  libvirt.driver = "kvm"
  libvirt.memory = 2048
  libvirt.cpus = 2
  libvirt.graphics_type = "spice"
end
```

## Ciclo de Vida de la VM

```
vagrant up
  ├─ Descarga box (si no existe)
  ├─ Crea VM
  ├─ Configura red
  ├─ Monta carpetas compartidas
  └─ Ejecuta provisioners

vagrant ssh
  └─ Shell remoto en la VM

vagrant provision
  └─ Re-ejecuta provisioners (cambios en Vagrantfile)

vagrant reload
  └─ Reinicia VM (aplica cambios de network/provider)

vagrant suspend
  └─ Pausa VM (ahorra batería)

vagrant resume
  └─ Reanuda VM

vagrant halt
  └─ Apaga VM (mantiene datos)

vagrant destroy
  └─ Elimina VM completamente
```

## Boxes: Imágenes Preconfiguradas

### ¿Qué es un Box?

```
Box = OVA/QCOW2 + metadatos
    ├─ SO base (Ubuntu, CentOS, Debian)
    ├─ Vagrant guest agent
    ├─ SSH configurado
    ├─ Sudo sin contraseña
    └─ ~500MB-1GB (comprimido)
```

### Usar un Box Público

```bash
# Buscar
vagrant box search ubuntu

# Usar
vagrant init ubuntu/focal64
vagrant up
```

### Repositorio de Boxes

- **Vagrant Cloud:** https://vagrantcloud.com (oficial)
- **Hashicorp:** hashicorp/bionic64, hashicorp/focal64
- **Ubuntu:** ubuntu/focal64, ubuntu/jammy64
- **CentOS:** centos/7, centos/8

## Carpetas Compartidas

### Sincronización Automática

```ruby
config.vm.synced_folder ".", "/vagrant"
```

**Host:** `/home/user/proyecto`  
**Guest:** `/vagrant`

Editar en host → cambios inmediatos en VM (desarrollo fluido)

### Tipos de Sync

- **VirtualBox:** Guest Additions (lento en grandes volúmenes)
- **libvirt:** NFS (rápido, requiere NFS en host)
- **rsync:** Unidireccional (rápido, no-live)

## Provisioning: Instalar/Configurar

### Opción 1: Shell Inline

```ruby
config.vm.provision "shell", inline: <<-SHELL
  apt-get update
  apt-get install -y nodejs npm
SHELL
```

### Opción 2: Script Externo

```ruby
config.vm.provision "shell", path: "provision.sh"
```

### Opción 3: Ansible (Recomendado para equipos)

```ruby
config.vm.provision "ansible" do |ansible|
  ansible.playbook = "site.yml"
  ansible.inventory_path = "inventory"
end
```

### Opción 4: Chef, Puppet (Enterprise)

```ruby
config.vm.provision "chef_solo" do |chef|
  chef.add_recipe "web::nginx"
end
```

## Casos de Uso

### 1. Desarrollo Local
```
Equipo: macOS, Windows, Linux
Vagrant: Ubuntu LTS idéntica a Producción
Beneficio: Bugs ambientales eliminados
```

### 2. Testing de Playbooks Ansible
```
Vagrantfile define 3 VMs (web, db, cache)
Ansible playbook las configura
Testing completo antes de producción
```

### 3. Training/Laboratorios
```
Profesor distribu Vagrantfile
Alumnos hacen `vagrant up`
Todos con mismo entorno (evita problemas setup)
```

### 4. CI/CD (Integración con Jenkins/GitHub Actions)
```
vagrant up en CI pipeline
Correr tests en entorno real
vagrant destroy (cleanup)
```

## Relaciones

### Conecta con
- [[kvm|KVM (Kernel-based Virtual Machine)]] — Backend de virtualización (via libvirt)
- [[vm|Máquinas Virtuales]] — Lo que Vagrant crea/gestiona
- [[docker|Docker]] — Alternativa ligera (mismo concepto, distinta implementación)
- [[ansible|Ansible]] — Provisioning avanzado

### Conceptos Relacionados
- **Infraestructura as Code (IaC):** Definir infraestructura en código
- **Reproducibilidad:** Mismo Vagrantfile = mismo entorno siempre
- **Colaboración:** Equipo completo con mismo setup

## Ventajas vs Alternativas

| Aspecto | Vagrant | Docker | Virt-manager |
|--------|---------|--------|-------------|
| **Aprendizaje** | Medio | Medio | Bajo |
| **Código compartible** | ✅ SÍ | ✅ SÍ | ❌ GUI |
| **VM completa** | ✅ SÍ | ❌ Container | ✅ SÍ |
| **Entorno exacto Prod** | ✅ Sí | ✅ Sí | ❌ Manual |
| **Equipo pequeño** | ✅ Ideal | ⚠️ Complejidad | ⚠️ Manual |

## Conclusión

Vagrant es la **herramienta estándar de la industria** para:
- Desarrollo local reproducible
- Ambientes de testing automático
- Training técnico
- Colaboración en equipos (uno-click setup)

Es especialmente poderosa con **libvirt en Linux**, donde combina:
- Automatización de Vagrant
- Eficiencia de KVM nativo
- Control total vía código

---

## Fuentes
- [Gestionando máquinas virtuales con Vagrant (josedomingo.org)](https://www.josedomingo.org/pledin/2013/09/gestionando-maquinas-virtuales-con-vagrant/)
- [Vagrant Official Documentation](https://developer.hashicorp.com/vagrant/docs)
