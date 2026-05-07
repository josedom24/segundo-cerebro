---
created: 2026-05-07
updated: 2026-05-07
sources: [josedomingo-proxmox-cloud-init]
tags: [proxmox, automatizacion, cloud]
title: "Proxmox + cloud-init: Despliegue Automatizado en Hypervisor"
---

# Proxmox + cloud-init: Despliegue Automatizado en Hypervisor

## Resumen de una línea
Proxmox VE integra cloud-init permitiendo crear templates VM reutilizables que se autoconfiguren al clonar, aplicando hostname, SSH keys, IP estáticas y redes sin intervención manual.

## ¿Por Qué cloud-init en Proxmox?

### Problema: VMs Clonadas Idénticas

```
Template VM (plantilla)
  ↓ (clonar)
VM-1 (mismo hostname, misma IP, mismas SSH keys)
VM-2 (mismo hostname, misma IP, mismas SSH keys)
VM-3 (mismo hostname, misma IP, mismas SSH keys)

❌ Conflictos: 3 VMs con misma identidad
```

### Solución: cloud-init en Proxmox

```
Template VM (cloud-init + CloudInit Drive)
  ↓ (clonar)
VM-1: cloud-init aplica config-1 (hostname: vm-1, IP: 192.168.100.10)
VM-2: cloud-init aplica config-2 (hostname: vm-2, IP: 192.168.100.11)
VM-3: cloud-init aplica config-3 (hostname: vm-3, IP: 192.168.100.12)

✅ Cada VM única, desde misma plantilla
```

---

## Workflow: Crear Template y Clonar

### Paso 1: Crear VM Base con cloud-init

**En Proxmox VE:**

```
1. Crear nueva VM estándar
   - ID: 100 (template base)
   - SO: Ubuntu 22.04 Server
   - Recursos: 2 vCPU, 2GB RAM, 30GB disco

2. Instalar cloud-init
   # Dentro de la VM
   apt-get update
   apt-get install -y cloud-init

3. Configurar cloud-init (predeterminados)
   # /etc/cloud/cloud.cfg
   # Deja configuraciones por defecto

4. Añadir CloudInit Drive (CD-ROM)
   # En Proxmox: Hardware → Add → CloudInit Drive
   # Seleccionar storage (local, local-lvm, etc.)
```

### Paso 2: Convertir a Template

```
# En Proxmox VE GUI:
1. Clic derecho VM 100 → "Convert to Template"
2. Confirmar
3. VM-100 aparece como "template" en árbol

# O CLI:
qm template 100
```

**Resultado:**
```
Template 100 (readonly)
  ├─ Sistema base
  ├─ cloud-init instalado
  └─ CloudInit Drive listo
```

### Paso 3: Clonar Template

```
# GUI: Clic derecho Template 100 → Clone

# O CLI:
qm clone 100 101 --name vm-student-1 --full 1

# full 1 = full clone (copia independiente)
# full 0 = linked clone (comparte datos base)
```

**Resultado:**
```
VM-101 (clon de template)
  - Totalmente independiente
  - CloudInit Drive presente
  - Listo para configurar
```

---

## Configurar cloud-init en Clon

### Antes de Iniciar la VM

**En Proxmox VE GUI:**

```
1. Seleccionar VM-101
2. Pestaña "Cloud-Init"
3. Configurar:
   - Hostname: vm-student-1
   - DNS: 8.8.8.8, 8.8.4.4
   - SSH Public Key: [pegar tu clave pública]
   - IP Config: Static (192.168.100.10/24)
   - Gateway: 192.168.100.1
```

**O CLI:**

```bash
qm set 101 \
  --hostname vm-student-1 \
  --nameserver "8.8.8.8 8.8.4.4" \
  --citype nocloud \
  --ciupgrade 1
```

### Inyectar Configuración en CloudInit Drive

**En Proxmox GUI:**

```
1. Cloud-Init
2. Review/Edit button
3. Pegar configuración YAML:

#cloud-config
hostname: vm-student-1
fqdn: vm-student-1.example.com

users:
  - name: ubuntu
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ssh-rsa AAAA... tu-usuario@tu-maquina

package_update: true
package_upgrade: true

packages:
  - openssh-server
  - curl
  - git

runcmd:
  - echo "VM configurada con cloud-init" > /etc/motd
  
final_message: "Sistema listo"
```

4. Regenerate button

---

## Arrancar y Verificar

### Iniciar VM

```
# GUI: Start button
# O CLI:
qm start 101
```

**En primer boot:**
```
1. VM arranca
2. cloud-init lee CloudInit Drive (CD-ROM virtual)
3. Aplica configuración:
   - Hostname → vm-student-1
   - SSH key → injected
   - IP → 192.168.100.10
   - Paquetes → instalados
4. Completa boot
```

### Verificar Configuración

```bash
# Acceder por SSH
ssh -i ~/.ssh/id_rsa ubuntu@192.168.100.10

# Verificar
hostname                    # vm-student-1
ip addr show               # 192.168.100.10
cat /etc/cloud/cloud.cfg   # cloud-init presente
cloud-init status          # done
```

---

## Casos de Uso: Escalar a Múltiples VMs

### Laboratorio Educativo: 30 Estudiantes

```bash
#!/bin/bash
# Script para crear 30 VMs con cloud-init

for i in {1..30}; do
  # Clonar template
  qm clone 100 $((200 + i)) --name "alumno-$i" --full 1
  
  # Configurar cloud-init
  qm set $((200 + i)) \
    --hostname "alumno-$i" \
    --nameserver "8.8.8.8"
  
  # Inyectar SSH key (todos con misma clave + sudo)
  qm cloudinit dump $((200 + i)) > cloud-init-$i.yml
  # Editar cloud-init-$i.yml
  qm set $((200 + i)) --ciupgrade 1
done

# Resultado: 30 VMs listas, cada una con hostname único
```

### Cluster de Servidores Web

```yaml
#cloud-config
hostname: web-{{ i }}  # Reemplazar {{ i }} por número

packages:
  - nginx
  - certbot
  - postgresql-client

write_files:
  - path: /etc/nginx/sites-available/default
    content: |
      server {
        listen 80;
        server_name web-{{ i }}.example.com;
        location / {
          proxy_pass http://backend-api:8080;
        }
      }

runcmd:
  - systemctl enable nginx
  - systemctl start nginx
  - apt-get autoremove -y
```

### Replicas de Base de Datos (Galera MySQL)

```yaml
#cloud-config
hostname: mysql-{{ i }}

packages:
  - mariadb-server
  - mariadb-client

write_files:
  - path: /etc/mysql/conf.d/galera.cnf
    content: |
      [mysqld]
      wsrep_cluster_name="my_cluster"
      wsrep_cluster_address="gcomm://mysql-1,mysql-2,mysql-3"
      wsrep_node_name="mysql-{{ i }}"
      wsrep_node_address="{{ ip_address }}"
      wsrep_provider="/usr/lib/galera/libgalera_smm.so"
      binlog_format=ROW
      default_storage_engine=InnoDB

runcmd:
  - systemctl restart mysql
```

---

## Comparativa: Métodos de Despliegue en Proxmox

| Método | Tiempo | Automatización | Escalabilidad |
|--------|--------|-----------------|----------------|
| **Manual (GUI)** | 10-15 min/VM | 0% | ❌ No |
| **Template + cloud-init** | 2-3 min/VM | 95% | ✅ Sí |
| **Terraform + Proxmox** | 1-2 min/VM | 100% | ✅✅ Excelente |
| **Ansible post-boot** | 5 min/VM | 100% | ✅ Sí |

**Recomendación:** cloud-init es lo más simple para Proxmox nativo.

---

## Ventajas de cloud-init en Proxmox

✅ **Rápido:** Despliegue en < 3 minutos por VM

✅ **Reproducible:** Misma config → mismo resultado siempre

✅ **Escalable:** 100 VMs idénticas con 1 script

✅ **Nativo:** Integrado en Proxmox VE GUI

✅ **Estándar:** Compatible con cloud-init (AWS, Azure, etc.)

✅ **Versionable:** Config en Git, reproducible

---

## Limitaciones

⚠️ **Primer boot solamente:** cloud-init se ejecuta 1 sola vez
- Solución: `cloud-init clean` si necesitas re-ejecutar

⚠️ **Requiere template:** Necesitas VM base con cloud-init

⚠️ **CloudInit Drive:** Debe estar presente (algunos templates viejos no lo tienen)

⚠️ **Password vs SSH keys:** SSH keys más seguro, pero requiere inyectar clave

---

## Ejemplo Completo: Laboratorio de Desarrollo

**Objetivo:** Crear 5 VMs para equipo de desarrollo (misma config base, IPs diferentes).

**Pasos:**

1. **Crear template base (VM-100)**
   ```bash
   # En Proxmox VE
   # - Instalar Ubuntu 22.04
   # - apt-get install cloud-init
   # - Añadir CloudInit Drive
   # - Convertir a template
   ```

2. **Clonar 5 veces**
   ```bash
   for i in {1..5}; do
     qm clone 100 $((200 + i)) --name "dev-$i" --full 1
   done
   ```

3. **Configurar cloud-init para cada una**
   ```bash
   for i in {1..5}; do
     qm set $((200 + i)) \
       --hostname "dev-$i" \
       --nameserver "8.8.8.8"
   done
   ```

4. **Inyectar SSH keys + paquetes comunes**
   ```bash
   cat > cloud-config.yml << 'EOF'
   #cloud-config
   users:
     - name: developer
       sudo: ALL=(ALL) NOPASSWD:ALL
       ssh_authorized_keys:
         - ssh-rsa AAAA... team@company
   
   packages:
     - git
     - docker.io
     - docker-compose
     - curl
     - vim
     - tmux
   EOF
   
   for i in {1..5}; do
     qm cloudinit dump $((200 + i)) cloud-config.yml
   done
   ```

5. **Iniciar todas**
   ```bash
   for i in {1..5}; do
     qm start $((200 + i))
   done
   ```

6. **Resultado en 5 minutos**
   ```
   dev-1: 192.168.100.10 ✅
   dev-2: 192.168.100.11 ✅
   dev-3: 192.168.100.12 ✅
   dev-4: 192.168.100.13 ✅
   dev-5: 192.168.100.14 ✅
   
   Todas con:
   - Docker instalado
   - SSH accesible
   - Git configurado
   - Usuarios iguales
   ```

---

## Relaciones

### Conecta con
- [[kvm-cloud-init-automatizacion|KVM + cloud-init]] — Similar en KVM/libvirt
- [[introduccion-proxmox|Introducción a Proxmox VE]] — Plataforma base
- [[creacion-maquinas-virtuales-proxmox|Creación de VMs en Proxmox]] — Alternativa manual vs automatizada

## Fuentes
- [Proxmox + cloud-init: Configuración Automática de VMs](https://www.josedomingo.org/pledin/2022/10/proxmox-cloud-init/) — Templates, clonado, cloud-init en Proxmox VE
