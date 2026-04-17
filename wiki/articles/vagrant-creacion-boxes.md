---
created: 2026-04-17
updated: 2026-04-17
sources: [josedomingo-creacion-boxes-vagrant]
tags: [vagrant, boxes, imagenes, distribucion, automatizacion]
---

# Creación de Custom Boxes para Vagrant

## Resumen de una línea
Proceso para crear, personalizar y distribuir boxes (imágenes Vagrant) personalizados con tu stack específico, eliminando provision repetitivo.

## ¿Por Qué Crear Custom Boxes?

### Problema: Provisioning Lento

```ruby
# Sin custom box:
vagrant up
  ├─ Crea VM (1 min)
  ├─ apt-get update (3 min)
  ├─ apt-get install nodejs npm postgresql (5 min)
  ├─ npm install -g gulp webpack (2 min)
  └─ Total: ~11 minutos

# Cada miembro del equipo hace esto diario ❌
```

### Solución: Custom Box Preconfigurado

```bash
# Con custom box:
vagrant up
  └─ Crea VM desde box con todo pre-instalado (1 min)
  
# Ganancia: Reduce 11 min → 1 min por developer-day ✅
```

## Estrategia: Crear un Box

### Paso 1: Partir de Base Box Genérica

```bash
# Crear directorio para desarrollo del box
mkdir vagrant-nodejs-box && cd vagrant-nodejs-box

# Crear Vagrantfile mínimo
vagrant init generic/ubuntu2004
```

### Paso 2: Provisioning Manual (Development)

```bash
vagrant up
vagrant ssh
```

**Dentro de la VM:**

```bash
# 1. Actualizar sistema
sudo apt-get update
sudo apt-get upgrade -y

# 2. Instalar dependencias base
sudo apt-get install -y build-essential curl wget git vim

# 3. Instalar runtime (Node.js)
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Instalar servicios (PostgreSQL)
sudo apt-get install -y postgresql postgresql-contrib

# 5. Instalar global tools
sudo npm install -g yarn gulp webpack

# 6. Cleanup (importante para box pequeño)
sudo apt-get clean
sudo apt-get autoclean
sudo apt-get autoremove -y

# Salir
exit
```

### Paso 3: Automatizar Provisioning

**Crear `provision.sh` (en host):**

```bash
#!/bin/bash
set -e

echo "=== Actualizar sistema ==="
sudo apt-get update
sudo apt-get upgrade -y

echo "=== Instalar base ==="
sudo apt-get install -y build-essential curl wget git vim

echo "=== Instalar Node.js ==="
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "=== Instalar PostgreSQL ==="
sudo apt-get install -y postgresql postgresql-contrib

echo "=== Instalar global tools ==="
sudo npm install -g yarn gulp webpack

echo "=== Cleanup ==="
sudo apt-get clean
sudo apt-get autoclean
sudo apt-get autoremove -y

echo "✅ Provisioning completado"
```

**Actualizar Vagrantfile:**

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "generic/ubuntu2004"
  config.vm.hostname = "nodejs-dev"
  
  config.vm.provision "shell", path: "provision.sh"
  
  config.vm.provider "libvirt" do |libvirt|
    libvirt.memory = 2048
    libvirt.cpus = 2
  end
end
```

**Usar para desarrollo:**

```bash
# Destruir VM anterior (si existe)
vagrant destroy -f

# Levantar con provisioning
vagrant up

# Verificar
vagrant ssh -c "node --version && psql --version"
```

## Crear Box desde VM Configurada

### Método 1: Packaging Manual (VirtualBox → cualquier provider)

```bash
# En el host (después de vagrant up y provisioning):
vagrant halt

# Empaquetar la VM
vagrant package --output nodejs-dev-1.0.box

# Verifica qué se creó
ls -lh nodejs-dev-1.0.box
# -rw-r--r-- 1 user user 1.2G nodejs-dev-1.0.box
```

**Resultado:** Un archivo `.box` que contiene:
- Imagen QCOW2 (o VMDK para VirtualBox)
- Vagrantfile plantilla
- Metadatos

### Método 2: Desde libvirt (KVM)

```bash
# List VMs libvirt
virsh -c qemu:///system list --all

# Obtener ruta del disco
virsh domblklist nodejs-dev

# Convertir QCOW2 → Box
# Box necesita estructura específica
mkdir -p box-contents
cd box-contents

# 1. Copiar imagen
cp /var/lib/libvirt/images/nodejs-dev.qcow2 box.img

# 2. Crear Vagrantfile plantilla
cat > Vagrantfile << 'EOF'
Vagrant.configure("2") do |config|
  config.vm.provider "libvirt" do |libvirt|
    libvirt.driver = "kvm"
  end
end
EOF

# 3. Crear metadata.json
cat > metadata.json << 'EOF'
{
  "provider": "libvirt",
  "version": "1.0",
  "architecture": "x86_64",
  "description": "Ubuntu 20.04 con Node.js, PostgreSQL"
}
EOF

# 4. Empaquetar
tar czf ../nodejs-dev-1.0.box ./*
cd ..
ls -lh nodejs-dev-1.0.box
```

## Agregar Box Localmente

```bash
# Registrar box en Vagrant
vagrant box add nodejs-dev-local ./nodejs-dev-1.0.box

# Verificar
vagrant box list
# nodejs-dev-local (libvirt, 1.0)
```

**Usar en nuevo proyecto:**

```bash
mkdir mi-proyecto && cd mi-proyecto

vagrant init nodejs-dev-local

# Vagrantfile ahora tiene:
# config.vm.box = "nodejs-dev-local"

vagrant up
# ✅ 1 minuto: VM con Node + PostgreSQL lista
```

## Distribuir Boxes (Team / Público)

### Opción 1: Almacenamiento Local (Git, NFS)

```bash
# Commit a repo privado
git lfs add nodejs-dev-1.0.box  # Large File Storage
git commit -m "Add nodejs dev box"
git push

# En otra máquina:
git clone <repo>
vagrant box add nodejs-dev ./nodejs-dev-1.0.box
```

### Opción 2: Vagrant Cloud (Oficial)

```bash
# Crear cuenta: https://app.vagrantup.com

# Publicar box
vagrant cloud publish username/nodejs-dev 1.0 libvirt nodejs-dev-1.0.box \
  --description "Ubuntu 20.04 con Node.js y PostgreSQL" \
  --release

# Otros usuarios lo usan:
vagrant init username/nodejs-dev --minimal
vagrant up

# ✅ Descarga box automáticamente
```

### Opción 3: S3 / Servidor Privado

```ruby
# Vagrantfile en tu servidor
config.vm.box = "nodejs-dev"
config.vm.box_url = "https://s3.empresa.com/boxes/nodejs-dev-1.0.box"
config.vm.box_download_checksum = "sha256-abc123..."
config.vm.box_download_checksum_type = "sha256"
```

## Versionado de Boxes

### Estrategia de Versiones

```
nodejs-dev-1.0.box  ← Base: Node 16, PostgreSQL 12
nodejs-dev-1.1.box  ← Update: PostgreSQL 13, npm packages actualizados
nodejs-dev-2.0.box  ← Major: Node 18, Debian 12, Redis añadido
```

**Usar versiones específicas en Vagrantfile:**

```ruby
config.vm.box = "username/nodejs-dev"
config.vm.box_version = "~> 1.1"  # ≥ 1.1, < 2.0
```

### Mantener Boxes en Git LFS

```bash
# Configurar Git LFS
git lfs install

# Trackear boxes
git lfs track "*.box"

# Commit
git add .gitattributes nodejs-dev-*.box
git commit -m "Add nodejs-dev box v1.0, v1.1, v2.0"
git push
```

## Validación de Boxes

### Checklist Antes de Distribuir

```bash
# 1. Verificar tamaño
ls -lh nodejs-dev-1.0.box
# ¿< 2GB? ✅ (si > 2GB, limpiar más)

# 2. Probar en máquina diferente
mkdir test-box && cd test-box
vagrant init ../nodejs-dev-1.0.box
vagrant up
vagrant ssh -c "node -v && npm ls -g"

# 3. Verificar provisioning (si lo usas)
vagrant destroy
vagrant up
# ¿Provisioning se ejecuta correctamente? ✅

# 4. Performance
time vagrant up  # Debería ser < 2 minutos
time vagrant ssh -c "npm install lodash"  # NFS rápido? ✅
```

## Troubleshooting

### Box muy grande (> 3GB)

```bash
# Problema: Muchos archivos temporales
# Solución: Limpiar dentro de la VM antes de package

vagrant ssh

# Limpiar caches
sudo apt-get clean
sudo apt-get autoclean
sudo apt-get autoremove -y

# Limpiar logs
sudo journalctl --vacuum=50M
sudo find /var/log -type f -delete

# Limpiar tmp
sudo rm -rf /tmp/* /var/tmp/*

# Limpiar SSH keys (se regeneran al usar box)
sudo rm -f /etc/ssh/ssh_host_*

# Zerear disco (opcional, mejora compresión)
sudo dd if=/dev/zero of=/EMPTY bs=1M
sudo rm -f /EMPTY

exit

# Ahora empaquetar
vagrant halt
vagrant package --output nodejs-dev-1.0.box
```

### Box no bootea después de package

```bash
# Verificar que Vagrant guest agent está instalado
vagrant ssh
which vagrant
# /usr/bin/vagrant debe existir

# Si no:
wget https://releases.hashicorp.com/vagrant/2.3.0/vagrant_2.3.0_linux_amd64.zip
unzip vagrant_2.3.0_linux_amd64.zip -d /tmp
sudo mv /tmp/vagrant /usr/bin/

exit
vagrant halt
vagrant package --output nodejs-dev-1.0.box
```

## Relaciones

### Conecta con
- [[vagrant-introduccion|Vagrant: Introducción]] — Conceptos de boxes
- [[vagrant-libvirt-configuracion|Vagrant + libvirt]] — Usar boxes en KVM
- [[kvm|KVM]] — Backend virtualización

### Casos de Uso Relacionados
- **CI/CD:** Usar custom box en pipelines de testing
- **Training:** Distribuir box a estudiantes (one-click setup)
- **Team:** Equipo de desarrollo con ambiente idéntico
- **Stack Replicación:** Clonar stack completo fácilmente

---

## Conclusión

Custom boxes son la **optimización final** de Vagrant:
- ✅ Setup reproducible en 1 minuto
- ✅ Código shareable (`Vagrantfile` + `provision.sh`)
- ✅ Distribución escalable a equipos
- ✅ Versionado automático

Caso ideal: **Crear un box base para cada proyecto/equipo**, actualizar anualmente, distribuir vía Git LFS o Vagrant Cloud.

---

## Fuentes
- [Creación de un box para vagrant (josedomingo.org)](https://www.josedomingo.org/pledin/2025/09/creacion-box-vagrant/)
- [Vagrant Box Documentation](https://developer.hashicorp.com/vagrant/docs/boxes)
