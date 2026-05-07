---
created: 2026-05-07
updated: 2026-05-07
sources: [josedomingo-kvm-cloud-init]
tags: [kvm, automatizacion, cloud]
title: "KVM + cloud-init: Despliegue Automatizado de Máquinas Virtuales"
---

# KVM + cloud-init: Despliegue Automatizado de Máquinas Virtuales

## Resumen de una línea
cloud-init automatiza la personalización de máquinas virtuales en primer boot usando cloud images, permitiendo despliegues reproducibles sin instalación manual de ISO.

## ¿Qué es cloud-init?

**cloud-init** es software de automatización que "personaliza instancias o máquinas virtuales en su primer boot" leyendo configuración desde múltiples fuentes (archivos YAML, metadatos, scripts).

Reemplaza los procesos manuales de instalación:
```
❌ Antes: Descarga ISO → Instala interactivamente → Configura red → Instala paquetes
✅ Ahora: Cloud image + cloud-config YAML → Todo automático en primer boot
```

### Comparativa: ISO vs Cloud Images

| Aspecto | ISO Tradicional | Cloud Image |
|---------|-----------------|-------------|
| **Tamaño** | 2-4 GB | 200-500 MB |
| **Boot** | 15-20 minutos | < 2 minutos |
| **Configuración** | Manual interactiva | YAML automático |
| **Reproducibilidad** | Difícil (pasos manuales) | Perfecta (código) |
| **Escalabilidad** | No (manual) | Sí (plantillas) |

## Cloud Images: Plantillas Preconfiguradas

**Cloud images** son plantillas de disco optimizadas para entornos virtualizados:

- **Sin configuración hardcodeada** — Red, hostname, almacenamiento dinámicos
- **Tamaño comprimido** — ~100-500 MB vs 2-4 GB de ISO
- **Boot rápido** — Optimizadas para arranque en <2 minutos

### Fuentes de Cloud Images

```bash
# Ubuntu (recomendado)
https://cloud-images.ubuntu.com/jammy/current/

# Debian
https://cloud.debian.org/images/cloud/

# Fedora
https://alt.fedoraproject.org/cloud/
```

**Descarga típica:**

```bash
wget https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img
```

## Flujo de Despliegue con cloud-init

### 1. Crear Configuración (cloud-config.yaml)

```yaml
#cloud-config
hostname: servidor-web
fqdn: servidor.example.com

users:
  - name: admin
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ssh-rsa AAAA... admin@example.com

package_update: true
package_upgrade: true

packages:
  - nginx
  - curl
  - git

runcmd:
  - systemctl enable nginx
  - systemctl start nginx
  - echo "Servidor configurado" > /var/www/html/index.html

final_message: "Sistema listo en $UPTIME segundos"
```

**Qué configura cloud-init:**
- ✅ Hostname y FQDN
- ✅ Usuarios y SSH keys
- ✅ Contraseñas (con hash bcrypt)
- ✅ Actualizaciones de paquetes
- ✅ Instalación de software
- ✅ Ejecución de scripts personalizados
- ✅ Configuración de red
- ✅ Particionamiento de disco

### 2. Descargar Cloud Image Base

```bash
# Descargar imagen
wget https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img

# Verificar integridad
sha256sum jammy-server-cloudimg-amd64.img
```

### 3. Crear Clon Enlazado

```bash
# Usar qemu-img para crear linked clone (ahorra espacio)
qemu-img create -f qcow2 -b jammy-server-cloudimg-amd64.img servidor-web.qcow2

# Resultado:
# - servidor-web.qcow2: ~200 KB (solo cambios)
# - jammy-server-cloudimg-amd64.img: Base compartida (500 MB)
```

**Ventaja:** Múltiples VMs comparten la misma imagen base

### 4. Desplegar con virt-install

```bash
virt-install \
  --name servidor-web \
  --memory 2048 \
  --vcpus 2 \
  --disk servidor-web.qcow2 \
  --cloud-init user-data=cloud-config.yaml \
  --noautoconsole \
  --os-variant ubuntu22.04
```

**Alternativa con cloud-localds (data source):**

```bash
# Crear ISO con cloud-config
cloud-localds cloud-init.iso cloud-config.yaml

# Desplegar
virt-install \
  --name servidor-web \
  --memory 2048 \
  --vcpus 2 \
  --disk servidor-web.qcow2 \
  --disk cloud-init.iso,device=cdrom \
  --noautoconsole
```

## Casos de Uso Prácticos

### Laboratorio Educativo: VMs Idénticas en Minutos

```bash
# 1. Cloud-config estándar (todas las VMs iguales)
# 2. Generar 30 VMs para 30 estudiantes
for i in {1..30}; do
  qemu-img create -f qcow2 -b base.img alumno-$i.qcow2
  virt-install --name alumno-$i \
    --cloud-init user-data=cloud-config.yaml \
    --disk alumno-$i.qcow2 \
    --noautoconsole
done

# Resultado: 30 servidores idénticos en <10 minutos
```

### Despliegue de Servidores Web

```yaml
#cloud-config
hostname: web-01

packages:
  - nginx
  - certbot
  - python3-certbot-nginx

write_files:
  - path: /var/www/html/index.html
    content: |
      <h1>Servidor Web Automatizado</h1>
      <p>Desplegado con cloud-init</p>

runcmd:
  - systemctl enable nginx
  - systemctl start nginx
  - certbot --nginx --non-interactive -m admin@example.com \
    -d web-01.example.com --agree-tos --redirect
```

### Cluster de Bases de Datos

```yaml
#cloud-config
packages:
  - mysql-server
  - mysql-client

runcmd:
  - sed -i 's/bind-address = 127.0.0.1/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
  - mysql -e "GRANT ALL ON *.* TO 'replicator'@'%' IDENTIFIED BY 'replicator_pass';"
  - systemctl restart mysql
```

## Comparativa: cloud-init vs Vagrant vs Ansible

| Herramienta | Uso | Complejidad | Velocidad |
|------------|-----|------------|-----------|
| **cloud-init** | VMs iniciales, cloud | Baja (YAML) | Muy rápida (<2 min) |
| **Vagrant** | Desarrollo local reproducible | Media (Ruby) | Rápida (5-10 min) |
| **Ansible** | Configuración post-despliegue | Alta (YAML/Python) | Lenta (requiere SSH) |

**Uso combinado:**
```
Cloud-init (primer boot)
    ↓
Vagrant (opcional: desarrollo local)
    ↓
Ansible (configuración post-despliegue)
```

## Ventajas de cloud-init + KVM

✅ **Reproducibilidad:** Mismo YAML = mismo resultado siempre
✅ **Escalabilidad:** Desplegar 100 VMs con 1 comando
✅ **Rapidez:** < 2 minutos vs 15-20 minutos con ISO
✅ **Código de Infraestructura:** Versionar en Git
✅ **Sin instalador interactivo:** Totalmente automatizado
✅ **Compatible:** Funciona en KVM, VirtualBox, AWS, Azure, etc.

## Limitaciones

⚠️ **Requiere cloud image:** No todas las distros tienen cloud images actualizadas
⚠️ **Primer boot solamente:** cloud-init se ejecuta una sola vez (se puede forzar con `cloud-init clean`)
⚠️ **Debugging limitado:** Errores de cloud-config difíciles de diagnosticar

## Verificación Post-Despliegue

```bash
# Acceder a la VM
virsh console servidor-web

# Verificar hostname
hostname
hostnamectl

# Ver logs de cloud-init
cloud-init status
cat /var/log/cloud-init-output.log

# Verificar paquetes instalados
dpkg -l | grep nginx
```

## Flujo Completo: Ejemplo Real

```bash
# 1. Descargar imagen
wget https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img

# 2. Crear clon
qemu-img create -f qcow2 -b jammy-server-cloudimg-amd64.img web-server.qcow2

# 3. Crear cloud-config
cat > cloud-config.yaml << EOF
#cloud-config
hostname: web-server
packages:
  - nginx
runcmd:
  - systemctl enable nginx
  - systemctl start nginx
EOF

# 4. Desplegar
virt-install \
  --name web-server \
  --memory 1024 \
  --vcpus 1 \
  --disk web-server.qcow2 \
  --cloud-init user-data=cloud-config.yaml \
  --noautoconsole

# 5. Verificar
sleep 30
virsh console web-server
# ✅ Servidor listo con nginx funcionando
```

---

## Relaciones

### Conecta con
- [[introduccion-kvm|Introducción a la Virtualización con KVM - libvirt]] — Fundamentos KVM/libvirt
- [[creacion-vms|Creación de Máquinas Virtuales en virt-manager]] — Alternativa manual vs automatizada
- [[almacenamiento-kvm|Almacenamiento en KVM - virt-manager]] — Linked clones y QCOW2
- [[vagrant-introduccion|Vagrant - Introducción y Conceptos Fundamentales]] — Alternativa para desarrollo local

## Fuentes
- [KVM + libvirt + cloud-init](https://www.josedomingo.org/pledin/2025/05/kvm-libirt-cloud-init/) — Despliegue automatizado con cloud images
