---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kvm_ow]
tags: [bridge, dns, kvm, redes]
---

# Redes Virtuales con virsh

## Resumen de una línea
Gestión redes virsh: definir XML, virsh net-create/define/start, DHCP/DNS automático, bridges virtuales (virbr), consultar leases, aisladas/NAT/bridge, configuration XML.

## Información
- **Fuente:** Curso KVM 2024 (Avanzado) - Unidad 6
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm2/
- **Líneas de contenido:** 350+

---

## Gestión de Redes con virsh

### Listar Redes

```bash
# Redes iniciadas
virsh net-list

# Todas (incluidas paradas)
virsh net-list --all

# Output:
#  Name      State    Autostart
#  default   active   yes
#  red-nat   active   yes
#  aislada   inactive no
```

### Crear Red (Persistente)

```bash
# Definir desde XML (persistente)
virsh net-define red-nat.xml

# Crear temporal (desaparece al parar)
virsh net-create red-nat.xml
```

### Iniciar/Parar Red

```bash
# Iniciar red definida
virsh net-start red-nat

# Auto-iniciar con host
virsh net-autostart red-nat

# Parar red
virsh net-stop red-nat

# Eliminar definición
virsh net-undefine red-nat
```

---

## Definición XML de Red

### Red NAT (Privada)

```xml
<network>
  <name>red-nat</name>
  <forward mode='nat'>
    <nat>
      <port start='1024' end='65535'/>
    </nat>
  </forward>
  <bridge name='virbr1' stp='on' delay='0'/>
  <domain name='red-nat.local'/>
  <ip address='192.168.101.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='192.168.101.2' end='192.168.101.254'/>
    </dhcp>
  </ip>
</network>
```

**Elementos:**
```
<name>: Identificador de red
<forward mode='nat'>: Modo NAT (tráfico exterior)
<bridge>: Bridge virtual a usar (virbr1)
<domain>: Dominio DNS interno (opcional)
<ip>: Rango de direcciones
<dhcp>: Rango DHCP automático
```

### Red Aislada

```xml
<network>
  <name>aislada</name>
  <bridge name='virbr2' stp='on' delay='0'/>
  <ip address='10.0.0.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='10.0.0.2' end='10.0.0.254'/>
    </dhcp>
  </ip>
</network>
```

**Diferencia:**
- Sin `<forward mode>` = no hay NAT
- VMs aisladas del exterior
- DNS del host disponible

### Red Muy Aislada

```xml
<network>
  <name>muy-aislada</name>
  <bridge name='virbr3' stp='on' delay='0'/>
  <ip address='10.1.0.1' netmask='255.255.255.0'>
    <!-- Sin DHCP -->
  </ip>
</network>
```

**Características:**
- Sin DHCP
- Sin DNS del host
- Configuración manual necesaria

---

## Bridges Virtuales en Host

### Verificación

```bash
# Instalar herramientas
sudo apt install bridge-utils

# Listar bridges
sudo brctl show

# Output:
# bridge name     bridge id      STP enabled   interfaces
# virbr0          8000.525400ae  yes           
# virbr1          8000.5254002d  yes           
# virbr2          8000.525400d5  yes           
```

### Interfaces de Red del Host

```bash
# Ver interfaces creadas por libvirt
ip a

# Output:
# 4: virbr0: <BROADCAST,MULTICAST,UP> mtu 1500
#    inet 192.168.122.1/24
#
# 5: virbr1: <BROADCAST,MULTICAST,UP> mtu 1500
#    inet 192.168.101.1/24
```

**Concepto:**
- Cada bridge virtual → interfaz en host
- Host puede conectarse a red virtual
- Actúa como gateway

---

## Configuración DHCP en Red Virtual

### Rango DHCP

En definición XML:

```xml
<ip address='192.168.101.1' netmask='255.255.255.0'>
  <dhcp>
    <range start='192.168.101.10' end='192.168.101.254'/>
    <host mac='52:54:00:12:34:56' 
          name='servidor1' 
          ip='192.168.101.100'/>
  </dhcp>
</ip>
```

**Opciones:**
- `<range>`: direcciones dinámicas
- `<host>`: asignación estática por MAC

### Verificar Leases DHCP

```bash
# Ver direcciones asignadas
virsh net-dhcp-leases default

# Output:
#  Expiry Time          MAC address         IP address
#  2025-04-25 10:30:45  52:54:00:13:88:94   192.168.122.223/24
#  2025-04-25 11:15:30  52:54:00:ab:cd:ef   192.168.122.224/24
```

**Información:**
- Vencimiento del lease
- MAC del cliente
- IP asignada
- Hostname (si disponible)

---

## DNS en Redes Virtuales

### DNS por Red

```xml
<network>
  <name>red-nat</name>
  <domain name='red-nat.local' localOnly='yes'/>
  <!-- DNS aquí -->
</network>
```

### Comportamiento DNS

```
Red NAT (con <domain>):
  → DNS del host resuelve dominio
  → VMs usan DNS del host
  → *.red-nat.local resuelve internamente

Red Aislada:
  → VMs usan DNS del host (si configurado)
  → Resuelven dominios públicos

Red Muy Aislada:
  → Sin DNS (manual necesario)
```

---

## Flujo Completo: Crear Red

### Paso 1: Crear XML

**Archivo: red-produccion.xml**

```xml
<network>
  <name>prod</name>
  <forward mode='nat'/>
  <bridge name='virbr-prod' stp='on' delay='0'/>
  <domain name='prod.interno' localOnly='yes'/>
  <ip address='10.100.0.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='10.100.0.100' end='10.100.0.200'/>
      <host mac='52:54:00:aa:00:01' name='db-server' ip='10.100.0.10'/>
      <host mac='52:54:00:aa:00:02' name='web-server' ip='10.100.0.20'/>
    </dhcp>
  </ip>
</network>
```

### Paso 2: Definir Red

```bash
virsh net-define red-produccion.xml
virsh net-start prod
virsh net-autostart prod
```

### Paso 3: Verificar

```bash
virsh net-list
virsh net-info prod
virsh net-dumpxml prod
sudo brctl show
```

### Paso 4: Conectar VMs a Red

```bash
# Nueva VM
virt-install --network network=prod \
             --name web1 \
             ...

# O editar dominio existente
virsh edit db-server

# Cambiar interface:
# <interface type='network'>
#   <source network='prod'/>
# </interface>
```

---

## Casos de Uso: Múltiples Redes

### Topología Multi-Red

```
Host (192.168.1.0/24)
  │
  ├─ Red NAT "prod" (10.100.0.0/24)
  │   ├─ VM db-server (10.100.0.10)
  │   └─ VM web-server (10.100.0.20)
  │
  ├─ Red Aislada "test" (10.200.0.0/24)
  │   ├─ VM test-db (10.200.0.10)
  │   └─ VM test-app (10.200.0.20)
  │
  └─ Red Muy Aislada "sandbox" (10.250.0.0/24)
      └─ VM sandbox (10.250.0.10 - manual)
```

### Setup Multired

```bash
#!/bin/bash

# Crear redes
virsh net-define prod.xml && virsh net-start prod
virsh net-define test.xml && virsh net-start test
virsh net-define sandbox.xml && virsh net-start sandbox

# Conectar VMs
virsh attach-interface db-server \
  --type network --source prod
virsh attach-interface web-server \
  --type network --source prod
```

---

## Troubleshooting Redes

### Red no inicia

```bash
# Verificar definición
virsh net-dumpxml prod

# Intentar iniciar con debug
virsh net-create prod.xml

# Logs del sistema
sudo journalctl -u libvirtd -f
```

### VM no obtiene IP

```bash
# Verificar interfaz conectada
virsh domiflist vm-name

# Verificar red existe y está activa
virsh net-list

# Renovar DHCP dentro de VM
sudo dhclient -r && sudo dhclient
```

### Bridge conflict

```bash
# Si interface ya existe
ip link show virbr-test

# Eliminar
sudo ip link del virbr-test

# O cambiar nombre en XML
<bridge name='virbr-test-new' ... />
```

---

## Relaciones

### Conecta con
- [[redes-kvm|Redes KVM (Curso 1)]]
- [[clonacion-virsh|Unidad 5: Clonación]]
- [[instalacion-red-kvm|Unidad 7: Instalación por Red]]

### Parte de
- [[kvm]] — Stack de virtualización

---

## Fuentes

- [Curso KVM Avanzado 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm2/)
- [Curso KVM Avanzado 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
- [libvirt Networking](https://libvirt.org/formatnetwork.html)
