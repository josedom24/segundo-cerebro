---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kvm_ow]
tags: [bridge, kvm, redes]
---

# Redes en KVM/libvirt

## Resumen de una línea
Redes libvirt: virtuales privadas (NAT, aisladas, muy aisladas) con bridge/DHCP/DNS; redes públicas (bridge externo, macvtap para conexión directa a física; bridge virtual = Linux Bridge.

## Información
- **Fuente:** Curso KVM 2024 - Unidad 6
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm1/
- **Líneas de contenido:** 320+

---

## Conceptos Básicos

### Bridge/Switch Virtual
Dispositivo de interconexión que simula un switch físico

**libvirt usa:** Linux Bridge (software bridge)

```
Funcionamiento:
  Host
   ├─ eth0 (interfaz física)
   └─ vmbr0 (bridge virtual)
       ├─ VM1 (vnet0)
       ├─ VM2 (vnet1)
       └─ VM3 (vnet2)
```

### Red Default
Tipo: **NAT** (privada)
```
Name: default
Type: NAT
DHCP Range: 192.168.122.2 - 192.168.122.254
Gateway: 192.168.122.1 (host)
Bridge: vmbr0
```

---

## Redes Virtuales (Privadas)

### 1. Red Virtual NAT

```
🔹 Máquinas: Dirección privada
🔹 Conectividad: Host actúa como router+NAT
🔹 DHCP: Host proporciona (automático)
🔹 DNS: Host proporciona (automático)
🔹 Bridge: vmbr0 (virtual)
🔹 Comunicación: VM ↔ Host ↔ Exterior (bidireccional)
```

**Diagrama:**
```
┌─────────────────┐
│ Exterior (WAN)  │
└────────┬────────┘
         │ (IP real)
    ┌────┴─────────┐
    │ Host NAT/FW  │ 192.168.122.1
    └────┬─────────┘
         │ Bridge vmbr0
    ┌────┴─────────────┐
    │ Red 192.168.122.0│
    ├──VM1: 192.168.122.10
    ├──VM2: 192.168.122.11
    └──VM3: 192.168.122.12
```

**Características:**
```
✅ Privada (aislada del exterior)
✅ Dinámica (DHCP)
✅ Fácil de configurar
✅ Ideal para desarrollo/testing
```

**Variantes de conectividad exterior:**
- **NAT:** Puerta de enlace única, router/NAT
- **Routed bridge:** Rutas estáticas (avanzado)
- **Open mode:** Sin reglas firewall

### 2. Red Virtual Aislada (Isolated)

```
🔹 Máquinas: Dirección privada
🔹 Conectividad: NADA al exterior ❌
🔹 DHCP: Host proporciona
🔹 DNS: Host proporciona
🔹 Bridge: Virtual
🔹 Aislamiento: VMs ↔ Host (NO exterior)
```

**Diagrama:**
```
         ┌─────────────────┐
         │ Exterior (WAN)  │
         └─────────────────┘
                    ❌ (sin conexión)

    ┌───────────────────┐
    │ Host (acceso)     │
    └────┬──────────────┘
         │ Bridge vmbr1
    ┌────┴─────────────┐
    │ Red 10.0.0.0/24  │
    ├──VM1: 10.0.0.10
    ├──VM2: 10.0.0.11
    └──VM3: 10.0.0.12
```

**Casos de Uso:**
```
🔵 Laboratorios aislados
🔵 Testing sensible
🔵 Entornos de desarrollo cerrados
```

### 3. Red Virtual Muy Aislada (Very Isolated)

```
🔹 Máquinas: Dirección privada (estática)
🔹 Conectividad: Ninguna (ni host) ❌
🔹 DHCP: NO (configuración manual)
🔹 DNS: NO
🔹 Bridge: Virtual (sin host)
🔹 Aislamiento: Completo
```

**Diagrama:**
```
    ┌───────────────────┐
    │ Host (sin acceso) │
    └───────────────────┘
              ❌

    ┌──────────────────┐
    │ Red 10.0.1.0/24  │
    ├──VM1: 10.0.1.10 (manual)
    ├──VM2: 10.0.1.11 (manual)
    └──VM3: 10.0.1.12 (manual)
```

**Casos de Uso:**
```
🔵 Simulación de redes aisladas
🔵 Testing de segregación
```

---

## Redes Puente (Públicas)

### 1. Bridge Externo

```
🔹 Máquinas: IP de red física (DHCP del router)
🔹 Conectividad: Directa a red física
🔹 Gateway: Router físico (no host)
🔹 Bridge: Externo (br0) conectado a interfaz física
🔹 Mismo nivel: VMs en misma subred que host
```

**Diagrama:**
```
     ┌──────────────────┐
     │ Router físico    │
     │ 192.168.1.1      │
     └────────┬─────────┘
              │ Eth0
    ┌─────────┴─────────┐
    │ Bridge br0        │
    ├──Host: 192.168.1.100
    ├──VM1: 192.168.1.101
    ├──VM2: 192.168.1.102
    └──VM3: 192.168.1.103
```

**Setup en host:**
```
1. Crear bridge br0
2. Conectar eth0 al bridge
3. Asignar IP al host desde DHCP
4. VMs conectadas a br0 → DHCP automático
```

**Ventajas:**
```
✅ Acceso directo a red física
✅ VMs como equipos físicos
✅ Sin overhead NAT
```

**Limitaciones:**
```
❌ Requiere reconfiguración de red host
❌ Necesita permisos altos
```

### 2. Macvtap (Directo a Interfaz)

```
🔹 Máquinas: IP de red física (DHCP)
🔹 Conectividad: Directa vía interfaz física
🔹 Bridge: NO (conexión directa)
🔹 Tecnología: Macvtap (MAC virtual tagging)
```

**Diagrama:**
```
     ┌──────────────────┐
     │ Router físico    │
     └────────┬─────────┘
              │ eth0
    ┌─────────┴──────────┐
    │ Host: 192.168.1.100│
    │                    │
    │ Macvtap interfaces:│
    ├──VM1: 192.168.1.101
    ├──VM2: 192.168.1.102
    └──VM3: 192.168.1.103
```

**Características:**
```
✅ Sin overhead bridge
✅ Acceso directo físico
✅ Rendimiento máximo
❌ NO comunicación Host ↔ VMs (limitación macvtap)
❌ VMs ↔ VMs ❌ (si usan misma interfaz)
```

**Limitación crítica:**
```
⚠️ Host no puede comunicarse con VMs macvtap
   (diferente a bridge donde host es parte del bridge)
```

---

## Configuración en virt-manager

### Gestionar Redes

```
Detalles de conexión QEMU/KVM
  → Redes disponibles
  → Ver redes creadas
  → Crear nueva red
  → Editar/Eliminar redes
  → Activar/Desactivar redes
```

### Crear Nueva Red NAT

```
1. Click botón "Añadir grupo" en Redes
2. Nombre: red-test
3. Tipo: NAT
4. Dirección: 10.0.0.0/24
5. DHCP: Marcar ✅
6. Rango DHCP: 10.0.0.10 - 10.0.0.100
7. Gateway: 10.0.0.1 (defecto)
8. Aplicar
```

### Asignar Red a VM

```
Detalles VM → Interfaces de red
  → Agregar Hardware → Red
  → Seleccionar red (default, red-test, etc.)
  → Aplicar
```

---

## Tabla Comparativa de Redes

 Tipo  Privacidad  Exterior  DHCP  Host Access  Uso 
--------------------------------------------------
 NAT  Privada  SÍ (router)  SÍ  SÍ  Dev/Test 
 Isolated  Privada  NO  SÍ  SÍ  Aislado 
 Very Isolated  Privada  NO  NO  NO  Laboratorio 
 Bridge Ext  Pública  SÍ  Sí (router)  SÍ  Producción 
 Macvtap  Pública  SÍ  Sí (router)  NO  Performance 

---

## Mejores Prácticas

```
✅ Desarrollo/Testing: Red NAT default
✅ Múltiples redes: Crear nuevas NAT según necesidad
✅ Producción: Bridge externo o macvtap
✅ Aislamiento: Red isolated para sensible
✅ Documentar: Qué red para qué propósito
```

---

## Relaciones

### Conecta con
- [[creacion-vms|Unidad 3: Creación VMs]]
- [[consola-serie-kvm|Unidad 7: Consola Serie]]

### Parte de
- [[kvm|KVM]] — Stack de virtualización

---

## Fuentes

- [Curso: KVM 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm1/)
- [Curso KVM 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
- [libvirt Networking](https://libvirt.org/formatnetwork.html)
- [Linux Bridge](https://wiki.linuxfoundation.org/networking/bridge)
