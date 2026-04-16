---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_proxmox_cep]
tags: [proxmox, redes, networking, bridge, firewall]
---

# Gestión de Redes en Proxmox VE

## Resumen de una línea
Configuración de red del servidor Proxmox con Linux Bridge (vmbr0), creación de redes internas adicionales (vmbr1, vmbr2), conexión de VMs/contenedores a diferentes redes, y firewall en tres niveles (datacenter, nodo, VM).

## Información
- **Fuente:** Curso Proxmox VE - Módulo 7
- **Duración:** 2 horas teoría + 2.5 horas actividades prácticas
- **Semana:** Semana 7

---

## Conceptos de Red en Proxmox

### Linux Bridge

```
Dispositivo de red que conecta interfaces
├─ Software bridge (no hardware)
├─ Mismo comportamiento que switch físico
└─ Utilizado por Proxmox para conectar VMs/contenedores
```

**Ventajas:**
- Fácil de configurar
- Integrado en Linux kernel
- Bajo overhead
- Compatible con vlan, bonding

**Alternativa:** Open vSwitch (más complejo, más potente)

### Modelo de Red Proxmox

```
SERVIDOR PROXMOX
├─ enp1s0 (interfaz física del servidor)
├─ vmbr0 (Linux Bridge público)
│  ├─ VM/Contenedor 1 (eth0 → DHCP)
│  ├─ VM/Contenedor 2 (eth0 → DHCP)
│  └─ Acceso externo (red física 192.168.100.0/24)
└─ [Bridges privados opcionales]
```

---

## Configuración de Red del Servidor

### Acceso a Configuración

```
Nodo → System → Network
```

### Componentes por Defecto

**1. Interfaz física:** enp1s0 (en VM puede variar: eth0, ens0, etc.)
- Conectada directamente a router físico
- Recibe IP del router (DHCP o estática)

**2. Linux Bridge vmbr0:**
- Conecta interfaz física con VMs/contenedores
- Toma IP del router (ej: 192.168.100.87)
- Esta es la IP para acceder a GUI Proxmox
- Puertos 8006 (GUI), 22 (SSH) siempre abiertos

### Esquema de Red por Defecto

```
Router Físico (192.168.100.1)
    ↓
enp1s0 (interfaz servidor)
    ↓
vmbr0 (192.168.100.87 - Proxmox GUI)
    ├─ VM1 (192.168.100.50 - DHCP)
    ├─ VM2 (192.168.100.51 - DHCP)
    └─ Contenedor1 (192.168.100.52 - DHCP)
```

### Configuraciones Avanzadas (no cubiertas)

```
├─ Bonding (Link Aggregation)
├─ VLAN (tagging)
└─ Open vSwitch
```

---

## Conexión de VMs/Contenedores a vmbr0

### Configuración Automática (por defecto)

```
VM → vmbr0 → DHCP del router
└─ IP automática, accesible desde red local
```

**Resultado:** Todas las VMs en rango 192.168.100.0/24

### Verificación

1. VM/Contenedor → Console
2. Verificar IP asignada
3. Accesible desde cualquier máquina en red local

---

## Redes Internas

### Caso de Uso

```
Escenarios:
├─ VMs en red privada sin acceso exterior
├─ Laboratorio aislado (ej: simulación de infraestructura)
├─ Router/Firewall interno conectado a varias redes
└─ Segmentación de redes (prod, test, dev)
```

### Creación de Bridge Interno

**Procedimiento:**
1. Nodo → System → Network → Create → Linux Bridge
2. Configurar parámetros:

```
Parámetro        | Ejemplo      | Propósito
─────────────────┼──────────────┼────────────────
Name             | vmbr1        | Identificador
IP Address       | [opcional]   | IP del bridge (si acceso)
Gateway          | [opcional]   | Gateway (si conectado)
Autostart        | ✓            | Levantarse al boot
```

3. Aplicar cambios: Network → Revert/Apply

### Ejemplo: Bridge Interno

```
vmbr0 (públic)     vmbr1 (interna)    vmbr2 (interna)
├─ VM público       ├─ VM privada      └─ Red aislada
└─ Acceso externo   └─ Sin salida
```

### Aplicación de Cambios

Después de crear o modificar red:
1. Botón **Revert** (descartar) o **Apply** (aplicar)
2. **Apply** reinicia interfaces (puede perder conectividad)
3. Generalmente se recupera automáticamente

---

## Conexión a Redes Internas

### Configuración Manual

```
VM/Contenedor → Network → eth0/eth1
├─ Conectar a: vmbr1 (bridge interno)
├─ IP: especificar manualmente
├─ Máscara: CIDR (ej: /24)
└─ Gateway: router interno (si existe)
```

### Ejemplo

```
Contenedor "servidor-interno":
├─ eth0 → vmbr0 (pública, 192.168.100.100)
├─ eth1 → vmbr1 (privada, 10.0.0.10)
└─ Acceso: exterior por eth0, red interna por eth1
```

### Router/Firewall Interno

```
VM con dos interfaces:
├─ eth0 → vmbr0 (internet)
└─ eth1 → vmbr1 (red interna)

Función: Enrutar y filtrar tráfico entre redes
```

---

## Firewall en Proxmox

### Tres Niveles de Activación

#### 1. Nivel Datacenter

```
Datacenter → Firewall → Options
├─ Habilitado: ✓
├─ Input Policy: DROP (denegar entrada por defecto)
├─ Output Policy: DROP (denegar salida por defecto)
└─ Nota: Solo requerido si seguridad crítica
```

**Elementos adicionales:**
- Security Group: conjuntos de reglas reutilizables
- Alias: nombrar IPs para simplificar reglas
- IPSec: grupos de IPs para reglas

#### 2. Nivel Nodo (Servidor)

```
Nodo (pve) → Firewall → Options
├─ Habilitado: ✓
├─ Usa políticas de Datacenter por defecto
├─ Puertos siempre abiertos: 8006 (web), 22 (ssh)
└─ Se aplican a todo el servidor
```

#### 3. Nivel VM/Contenedor

```
VM/Contenedor → Firewall → Options
├─ Input Policy: DROP (deniega entrada)
├─ Output Policy: ACCEPT (permite salida)
├─ Por interfaz: en/out puede variar
└─ Recomendado para máquinas con servicios
```

### Requisito para Habilitar Firewall en VM

```
Para que funcione firewall en VM:
1. Habilitar en Datacenter
2. Habilitar en Nodo
3. Habilitar en VM (entonces sí funciona)

Omitir paso 1 o 2 → paso 3 no tiene efecto
```

---

## Creación de Reglas de Cortafuego

### Estructura de Regla

```
Regla = Dirección + Acción + Protocolo + Puerto + Destino
```

### Parámetros

```
Direction     | in (entrada) | out (salida)
Action        | ACCEPT       | DROP
Protocol      | tcp, udp, icmp
Port          | Destino (in) | Origen (out)
Macro         | SSH, DNS, HTTP, HTTPS (lista)
Source/Dest IP| Origen/Destino (opcional)
Interface     | eth0, eth1, etc.
```

### Ejemplo 1: Permitir SSH

```
VM sin acceso desde exterior
├─ Input Policy: DROP (default deniega todo)
├─ Regla: Direction=in, Action=ACCEPT, 
│        Protocol=tcp, Port=22, Macro=SSH
└─ Resultado: SSH permitido, resto bloqueado
```

### Ejemplo 2: Denegar ICMP (Ping)

```
VM con salida general permitida
├─ Output Policy: ACCEPT (default permite todo)
├─ Regla: Direction=out, Action=DROP, Macro=ICMP
└─ Resultado: No puede hacer ping, resto sigue permitido
```

### Procedimiento Crear Regla

1. VM → Firewall → Add
2. Especificar parámetros
3. Habilitar regla (checkbox)
4. Crear

---

## Firewall Práctico: Caso Educativo

### Servidor Web + SSH

```
Políticas por defecto:
├─ Input: DROP (bloquea todo)
└─ Output: ACCEPT (permite todo)

Reglas:
1. SSH: Direction=in, Action=ACCEPT, Port=22, Protocol=tcp
2. HTTP: Direction=in, Action=ACCEPT, Port=80, Protocol=tcp
3. HTTPS: Direction=in, Action=ACCEPT, Port=443, Protocol=tcp

Resultado:
├─ Accesible por SSH
├─ Servidor web disponible
└─ Resto del tráfico bloqueado
```

---

## Limitaciones Actuales

### Sin Control de Permisos en Bridges

```
Problema:
├─ Linux Bridges no son objetos con permisos
├─ Solo root puede crear/modificar
└─ Cualquier usuario puede usar cualquier bridge

Impacto educativo:
└─ Imposible asegurar aislamiento entre estudiantes a nivel red
```

**Nota:** En desarrollo en futuras versiones

---

## Relaciones

### Conecta con
- [[creacion-maquinas-virtuales-proxmox|VMs]] — Conexión de VMs a redes
- [[linux-containers-lxc-proxmox|Contenedores]] — Conexión de LXC a redes
- [[usuarios-permisos-proxmox|Usuarios y Permisos]] — Control de acceso (limitado en redes)
- [[instalacion-proxmox|Instalación]] — Configuración inicial de red

---

## Próximo Paso

Gestión de usuarios, autenticación, permisos y roles en Proxmox.

---

## Fuentes
- [Curso Proxmox VE - Módulo 7 (GitHub)](https://github.com/iesgn/curso_proxmox_cep)
- [Proxmox Network Configuration](https://pve.proxmox.com/wiki/Network_Configuration)
- [Proxmox Firewall](https://pve.proxmox.com/wiki/Firewall)
