---
created: 2026-04-19
updated: 2026-04-19
sources: [configuracion_red_linux_ifupdown]
tags: [redes, linux, ifupdown, configuracion]
---

# ifupdown: Configuración Tradicional de Red en Linux

## Resumen de una línea
Herramienta tradicional para gestionar interfaces de red mediante ficheros en `/etc/network/interfaces`.

## Concepto

ifupdown es la **forma clásica** de configurar redes en Linux (especialmente Debian/Ubuntu). La configuración persiste en ficheros de texto y se activa automáticamente al arrancar el sistema.

## Fichero Principal: `/etc/network/interfaces`

```
# Interfaz loopback
auto lo
iface lo inet loopback

# DHCP (obtiene IP automáticamente)
auto enp1s0
iface enp1s0 inet dhcp

# IP estática
auto enp7s0
iface enp7s0 inet static
    address 192.168.1.2/24
    gateway 192.168.1.1
    dns-nameserver 1.1.1.1
    dns-nameserver 8.8.8.8
```

## Directivas Clave

| Directiva | Función |
|-----------|---------|
| `auto` | Activa interfaz al arrancar |
| `allow-hotplug` | Activa al conectarse (WiFi, USB) |
| `iface` | Define configuración de interfaz |
| `address` | IP en notación CIDR (192.168.1.2/24) |
| `gateway` | Ruta por defecto |
| `dns-nameserver` | Servidores DNS |
| `up/down` | Comandos pre/post activación |

## Hooks: Pre/Post Activación

Ejecutar comandos cuando interfaz sube/baja:

```
auto enp7s0
iface enp7s0 inet static
    address 192.168.1.2/24
    gateway 192.168.1.1
    pre-up /sbin/ip route add 10.0.0.0/8 via 192.168.1.1
    post-down /sbin/iptables -F
```

## Configuración Modular

Incluir ficheros en `/etc/network/interfaces.d/`:

```
# En /etc/network/interfaces.d/02-wan
auto eth0
iface eth0 inet dhcp

# En /etc/network/interfaces.d/03-lan
auto eth1
iface eth1 inet static
    address 192.168.100.1/24
```

## Activación Manual

```bash
# Activar interfaz
ifup enp7s0

# Desactivar interfaz
ifdown enp7s0

# Recargar todas
systemctl restart networking
```

## Ventajas

✅ **Simple** — Sintaxis clara y tradicional
✅ **Ligero** — Bajo overhead de recursos
✅ **Servidor** — Ideal para configuraciones estables
✅ **Persistente** — Sobrevive reinicios
✅ **Scripts** — Fácil integración con hooks

## Desventajas

❌ **Inflexible** — Manual para cambios dinámicos
❌ **No GUI** — Requiere edición de texto
❌ **Complejo** — Escenarios avanzados resultan tedios
❌ **Conflictos** — Puede chocar con NetworkManager

## Comparativa con Alternativas

| Aspecto | ifupdown | NetworkManager | systemd-networkd | netplan |
|---------|----------|---|---|---|
| **Complejidad** | Simple | Media | Media | Simple |
| **GUI** | ❌ No | ✅ Sí | ❌ No | ❌ No |
| **Dinámico** | ⚠️ Manual | ✅ Automático | ✅ Automático | ✅ Automático |
| **Servidores** | ✅ Ideal | ⚠️ OK | ✅ Ideal | ✅ Ideal |
| **Desktops** | ⚠️ OK | ✅ Ideal | ⚠️ OK | ✅ Ideal |

## Relaciones

### Conecta con
- [[red-linux|Configuración de Red en Linux]] — Herramienta tradicional
- [[red-linux-networkmanager|NetworkManager]] — Alternativa moderna y dinámica
- [[red-linux-systemd-networkd|systemd-networkd]] — Alternativa declarativa
- [[red-linux-netplan|netplan]] — Abstracción moderna

## Fuentes
- [Configuración de Red con ifupdown](https://www.josedomingo.org/pledin/2025/01/configuracion-red-linux-ifupdown/) — Guía completa
