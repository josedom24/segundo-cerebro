---
title: "Neutron: Gestión de Redes en OpenStack"
created: 2026-04-16
updated: 2026-04-16
sources: [curso_openstack_ies]
tags: [openstack, redes]
---

# Neutron: Gestión de Redes en OpenStack

## Resumen de una línea
Componente OpenStack de red virtual: crea redes privadas, subredes, enrutadores, floating IPs, seguridad; implementa SDN (Software Defined Networking).

## Definición

**Neutron** = Servicio de red OpenStack. Proporciona virtualización de red: redes privadas, enrutamiento, IPs flotantes, cortafuegos virtuales (grupos de seguridad).

Implementa Software Defined Networking (SDN): control programático de redes.

## Conceptos Clave

### Arquitectura de Red en OpenStack

```
Exterior (Internet)
    ↓
Router (salida a exterior)
    ↓
Red externa/pública
    ↓
Router (enrutamiento interno)
    ↓
Redes privadas internas
    ↓
Instancias (dentro de subredes)
```

### Redes y Subredes

**Red:**
```
Red = Contenedor de subredes y conectividad

Propiedades:
- ID único
- Nombre
- Tipo (privada, externa)
- Estado (activa)
```

**Subred:**
```
Subred = Espacio de direcciones IP dentro de red

Propiedades:
- Red padre
- CIDR (ej: 192.168.1.0/24)
- Gateway
- DNS
- Rango de IPs asignables
- Servidor DHCP
```

### Tipos de Red

```
Red Privada (tenant):
- Creada por usuario
- Aislada de otros proyectos
- Puede tener múltiples subredes
- Requiere router para salida

Red Externa/Pública:
- Administrador
- Conectada a mundo exterior
- Suministra Floating IPs
- Pool de IPs públicas
```

### Routers y Conectividad

**Router:**
```
Router = Enrutamiento entre redes

Funciones:
- Conecta redes privadas
- Proporciona acceso a red externa
- NAT (Network Address Translation)
- Encaminamiento dinámico
```

**Topología típica:**
```
Instancia 192.168.1.10 (subred privada)
    ↓
Red privada 192.168.1.0/24
    ↓
Router (interfaz interna 192.168.1.1)
    ↓
Red externa (interfaz externa)
    ↓
Acceso a Internet
```

### Floating IPs (IPs Públicas)

**Concepto:**
```
Floating IP = IP pública asociable a instancia

Sin Floating IP:
- Instancia solo tiene IP privada
- Inaccesible desde exterior

Con Floating IP:
- IP pública asignada a instancia
- Tráfico: exterior → Floating IP → IP privada → instancia
- Desasociable (reutilizable en otra instancia)
```

**Gestión:**
```
1. Crear Floating IP (pool de red externa)
2. Asociar a puerto de instancia
3. Acceso: ssh usuario@floating-ip
4. Desasociar: IP vuelve a pool
```

### Puertos y Interfaces

**Puerto:**
```
Puerto = Conexión virtual de instancia a red

Propiedades:
- MAC address
- IP privada
- Grupos de seguridad (firewall)
- Red
- Subred
```

**Múltiples interfaces:**
```
Instancia puede tener múltiples puertos:
- eth0: subred1 (IP 192.168.1.10)
- eth1: subred2 (IP 10.0.0.5)
- Cada una: distinto grupo seguridad
- Enrutamiento dentro SO
```

### Grupos de Seguridad

Cortafuegos virtual (reglas por puerto):

```yaml
Regla típica:
- Protocolo: TCP/UDP/ICMP
- Puerto: 22 (SSH), 80 (HTTP), 443 (HTTPS)
- Origen/destino: IP, CIDR, otro grupo de seguridad
- Acción: allow/deny
```

**Flujo de tráfico:**
```
Entrada (ingress):
- Tráfico hacia instancia
- Default: denegar todo
- Permitir explícitamente

Salida (egress):
- Tráfico desde instancia
- Default: permitir todo
- Más restrictivo si necesita
```

### Conceptos Avanzados

**VLAN (Virtual LAN):**
```
Aislamiento L2 dentro red física
- Tipos de redes Neutron: flat, vlan, vxlan
- Segmentación de tráfico
```

**VXLAN:**
```
Encapsulación de L2 sobre L3
- Escalable
- Móvil
- Soporta muchos tenants
```

### Gestión con OpenStack Client (OSC)

```bash
# Listar redes
openstack network list

# Crear red
openstack network create "mi-red"

# Crear subred
openstack subnet create --network mi-red \
  --subnet-range 192.168.1.0/24 \
  "mi-subred"

# Crear router
openstack router create "mi-router"

# Conectar router a subred
openstack router add subnet mi-router mi-subred

# Conectar router a red externa
openstack router set --external-gateway red-externa mi-router

# Crear Floating IP
openstack floating ip create red-externa

# Asociar Floating IP
openstack server add floating ip [instancia] [floating-ip]

# Listar puertos
openstack port list

# Crear grupo de seguridad
openstack security group create "web"

# Añadir regla
openstack security group rule create --protocol tcp \
  --dst-port 80:80 --remote-ip 0.0.0.0/0 web
```

## Casos de Uso

```
🟢 Aislamiento de aplicaciones por red
🟢 Multi-tier applications (web, app, db en subredes distintas)
🟢 Acceso seguro con grupos de seguridad
🟢 Escalado horizontal con Floating IPs
🟢 VPN site-to-site
🟢 Laboratorios de redes educativos
```

## Workflow Típico

```
1. Crear red privada (ej: 192.168.1.0/24)
2. Crear subred dentro
3. Crear router
4. Conectar router a subred
5. Conectar router a red externa
6. Crear grupo de seguridad (reglas)
7. Crear instancia:
   - Elegir red/subred
   - Asignar grupo de seguridad
8. Crear Floating IP de pool externo
9. Asociar Floating IP a instancia
10. Acceso desde exterior: ssh usuario@floating-ip
```

## Relaciones

### Conecta con
- [[introduccion-openstack|Introducción a OpenStack]] — Conectividad de instancias
- [[nova-instancias-openstack|Nova: Instancias]] — Instancias usan interfaces
- [[cinder-almacenamiento-openstack|Cinder: Almacenamiento]] — También necesita red

### Parte de
- OpenStack Stack
- Cloud Computing IaaS
- Software Defined Networking (SDN)

## Fuentes

- [Curso OpenStack - Módulo 5: Neutron](https://github.com/josedom24/curso_openstack_ies/tree/main/modulo5)
- [Neutron Documentation](https://docs.openstack.org/neutron/)
- [Networking Management](https://docs.openstack.org/neutron/latest/user/)
