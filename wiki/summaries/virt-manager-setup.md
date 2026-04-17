---
title: "Instalación y Configuración de virt-manager"
created: 2026-04-15
updated: 2026-04-17
sources: [curso_kvm_ow]
tags: [configuracion, instalacion, kvm]
---

# Instalación y Configuración de virt-manager

## Resumen de una línea
virt-manager es la interfaz gráfica de libvirt para KVM; se instala con dependencias automáticas de QEMU/KVM/libvirt, configurando conexión local privilegiada, redes virtuales (NAT default) y almacenamiento.

## Información
- **Fuente:** Curso KVM 2024 - Unidad 2
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm1/
- **Líneas de contenido:** 300+


## Hardware y Requisitos Previos

### Virtualización Anidada (Nested Virtualization)
```bash
# Verificar soporte en CPU
egrep 'svmvmx' /proc/cpuinfo --color

# Intel: vmx ✅
# AMD: svm ✅
```

**BIOS:** Activar VT/x o AMD-V en BIOS para que KVM funcione

**Virtualización Anidada:** Permite ejecutar KVM dentro de máquinas virtuales (para laboratorios)
- VirtualBox: Sistema → Procesador → marcar "Virtualización"
- Memoria virtual optimizada: Sistema → Procesador → "Paravirtualización"

### Requerimientos Mínimos Recomendados
```
🔧 8 GB RAM
💾 100 GB disco duro
⚙️ 4 núcleos CPU
```

**Desglose de RAM por SO:**
- Linux sin GUI: 512 MB
- Linux con GUI: 1-2 GB
- Windows: 2 GB mínimo


## Instalación de virt-manager

```bash
# En Debian/Ubuntu (instala automáticamente QEMU, KVM, libvirt)
sudo apt install virt-manager

# Agregar usuario al grupo libvirt
sudo usermod -aG libvirt $USER

# Reiniciar para aplicar cambios
sudo reboot
```


## Configuración Inicial de virt-manager

### Conexión Local Privilegiada

**Conexión por defecto:** QEMU/KVM
- **URI:** `qemu:///system` (local privilegiada)
- **Autoconexión:** ✅ Por defecto al iniciar virt-manager

### Agregar Nueva Conexión

Menú: **Archivo → Añadir conexión...**

O ver detalles: **Editar → Detalles de la conexión** o click derecho en QEMU/KVM → **Detalles**


## Gestión de Redes Virtuales

### Red Default (NAT)

Características:
```
🔹 Tipo: NAT
🔹 Red privada: 192.168.122.0/24
🔹 Rango DHCP: 192.168.122.2 - 192.168.122.254
🔹 Puerta de enlace: 192.168.122.1 (host)
🔹 Bridge virtual: vmbr0
🔹 DNS: Servidor del host
🔹 Funcionamiento: Host hace NAT hacia exterior
```

### Visión en virt-manager
En **Detalles de la conexión → Redes disponibles**:
- Ver redes creadas
- Crear/eliminar/modificar redes
- Activar/desactivar redes


## Gestión de Almacenamiento

### Grupos de Almacenamiento (Storage Pools)

**Grupo Default:** `/var/lib/libvirt/images`
- Directorio estándar para discos VM
- Acceso: **Detalles de la conexión → Almacenamiento disponible**

### Crear Nuevo Grupo

**Ejemplo:** Grupo `isos` para imágenes de instalación

```
1. Click en botón "Añadir grupo"
2. Nombre: "isos"
3. Tipo: "dir: Directorio del Sistema de Archivos"
4. Ruta: ~/Descargas/isos
5. Aplicar
```

**Resultado:**
```
isos → ~/Descargas/isos
default → /var/lib/libvirt/images
```

Grupos pueden corresponder a:
- Directorios locales
- NFS (redes)
- GlusterFS (distribuido)
- LVM, iSCSI, ZFS (bloque)


## Interfaz Principal de virt-manager

```
┌─────────────────────────────────┐
│ virt-manager                     │
├─────────────────────────────────┤
│ Archivo  Editar  Vista  Ayuda │
├─────────────────────────────────┤
│ QEMU/KVM (conexión)              │
│ ├─ VM1                           │
│ ├─ VM2                           │
│ └─ VM3                           │
├─────────────────────────────────┤
│ [Nueva] [Abrir] [Editar] [Más]  │
└─────────────────────────────────┘
```

**Operaciones principales:**
- Nueva máquina virtual: Archivo → Nueva máquina virtual
- Abrir consola: Doble clic o botón "Abrir"
- Editar configuración: Click derecho → Editar o Detalles
- Gestionar redes: Detalles conexión → Redes
- Gestionar almacenamiento: Detalles conexión → Almacenamiento


## Alternativas: Automatización con Vagrant

virt-manager es ideal para crear y gestionar máquinas virtuales **manualmente** con interfaz gráfica.

Para **reproducibilidad, automatización y entornos de equipo**, considera **Vagrant:**

### Vagrant: Infrastructure as Code para VMs

[[vagrant|Vagrant]] define máquinas virtuales en código (Vagrantfile) en lugar de mediante GUI. Ideal para:
- **Equipos de desarrollo:** Mismo Vagrantfile = setup idéntico para todos
- **Testing infrastructure code:** Ansible, Kubernetes, testing cloud-like
- **CI/CD pipelines:** VMs reproducibles en pipelines de testing
- **Reproducibilidad garantizada:** Código versionado, sin errores de configuración manual

```ruby
# Vagrantfile: Define VM en código
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"
  config.vm.network "private_network", ip: "192.168.121.10"
  config.vm.provision "shell", inline: "apt-get update && apt-get install -y nginx"
end

# Resultado:
vagrant up  # VM con Nginx lista en <1 minuto
```

### Comparativa: virt-manager vs Vagrant

| Aspecto | virt-manager | Vagrant |
|--------|-------------|---------|
| **Interfaz** | GUI visual | CLI + Código (Vagrantfile) |
| **Modo de trabajo** | Punto-and-click | Declarativo (IaC) |
| **Reproducibilidad** | Manual, propensa a errores | Automática, garantizada |
| **Versionado** | No | Sí (Git) |
| **Equipo sincronizado** | Setup manual para cada miembro | `vagrant up` automático |
| **Batch operations** | No (1 VM por vez) | Sí (múltiples VMs) |
| **Curva aprendizaje** | Rápida (GUI intuitiva) | Media (Ruby DSL) |
| **Provisioning** | Manual post-instalación | Automático (shell, Ansible) |

**Recomendación:** 
- **virt-manager:** Para exploración inicial, administración visual, laboratorios simples
- **Vagrant:** Para equipos, testing, entornos production-like, reproducibilidad

### Recursos Vagrant

- [[vagrant-introduccion|Vagrant - Introducción y Conceptos Fundamentales]]
- [[vagrant-libvirt-configuracion|Vagrant + libvirt - Configuración Completa de Networking y Almacenamiento]]
- [[vagrant-creacion-boxes|Creación de Custom Boxes para Vagrant]]


## Relaciones

### Conecta con
- [[introduccion-kvm|Introducción a la Virtualización con KVM/libvirt]]
- [[creacion-vms|Creación de Máquinas Virtuales en virt-manager]]
- [[almacenamiento-kvm|Almacenamiento en KVM/virt-manager]]
- [[clonacion-kvm|Clonación de Máquinas Virtuales en KVM]]
- [[redes-kvm|Redes en KVM/libvirt]]

### Parte de
- [[kvm|KVM (Kernel-based Virtual Machine)]] — Stack de virtualización


## Fuentes

- [Curso: KVM 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm1/)
- [Curso KVM 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
- [virt-manager Official](https://virt-manager.org/)
