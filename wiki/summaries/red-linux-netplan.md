---
created: 2026-04-19
updated: 2026-04-19
sources: [configuracion_red_linux_netplan]
tags: [redes, linux, netplan, configuracion]
---

# netplan: Abstracción Declarativa de Red en YAML

## Resumen de una línea
Herramienta que abstrae configuración de red en YAML y genera configuración para backends (systemd-networkd o NetworkManager).

## Concepto

netplan es una **capa de abstracción**: no es un servicio de red por sí, sino un **traductor YAML** que genera configuración para:
- **systemd-networkd** (ligero, servidores)
- **NetworkManager** (dinámico, desktops)

Ventaja: **misma configuración, diferentes backends**.

## Instalación

```bash
# Ubuntu/Debian
sudo apt install netplan.io
```

## Ubicación de Configuración

Ficheros YAML en `/etc/netplan/` (extensión `.yaml` o `.yml`)

Convencionalmente:
- `01-netcfg.yaml` (primero)
- `02-wifi.yaml` (segundo)
- Numeración controla orden

## Estructura YAML Básica

```yaml
network:
  version: 2
  renderer: networkd  # o 'NetworkManager'
  ethernets:
    interface_name:
      # configuración
```

## Configuración DHCP

**Fichero: `/etc/netplan/01-dhcp.yaml`**
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: true
      dhcp6: true
```

## Configuración IP Estática

**Fichero: `/etc/netplan/02-static.yaml`**
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      addresses:
        - 192.168.1.50/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
        search: [example.com]
```

## Configuración WiFi

**Fichero: `/etc/netplan/03-wifi.yaml`**
```yaml
network:
  version: 2
  renderer: NetworkManager
  wifis:
    wlan0:
      dhcp4: true
      access-points:
        "MiSSID":
          password: "micontraseña"
```

## Renderer Selection

Elegir backend explícitamente:

```yaml
network:
  version: 2
  renderer: networkd          # systemd-networkd
  # o
  renderer: NetworkManager    # NetworkManager
```

Sin especificar: usa el default del sistema (Ubuntu → networkd).

## Comandos de Netplan

```bash
# Validar sintaxis
sudo netplan validate

# Generar configuración (sin aplicar)
sudo netplan generate

# Aplicar cambios
sudo netplan apply

# Aplicar temporalmente (rollback automático en 120s)
sudo netplan try --timeout 60

# Información de estado actual
netplan status
```

## Bridge (Puente de Red)

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
    eth1:
      dhcp4: no
  bridges:
    br0:
      dhcp4: yes
      interfaces: [eth0, eth1]
```

## VLAN (Virtual LAN)

```yaml
network:
  version: 2
  renderer: networkd
  vlans:
    vlan100:
      id: 100
      link: eth0
      dhcp4: yes
```

## Rutas Personalizadas

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: yes
      routes:
        - to: 10.0.0.0/8
          via: 192.168.1.1
          metric: 100
```

## Ventajas

✅ **Flexible** — Mismo YAML, diferentes backends
✅ **Moderno** — YAML es estándar industria
✅ **Try/Apply** — Rollback automático si falla
✅ **Legible** — Sintaxis clara
✅ **Validación** — `netplan validate` antes de aplicar
✅ **Ubuntu standard** — Método oficial

## Desventajas

❌ **Abstracción** — Menos control que backends directos
❌ **Debugging** — Errores del renderer pueden ser confusos
❌ **No GUI** — Solo texto
❌ **Curva aprendizaje** — YAML + conceptos netplan

## Comparativa: Sintaxis

```
# ifupdown (imperativo)
auto enp0s3
iface enp0s3 inet static
  address 192.168.1.50/24
  gateway 192.168.1.1

# netplan (declarativo YAML)
network:
  version: 2
  ethernets:
    enp0s3:
      addresses: [192.168.1.50/24]
      gateway4: 192.168.1.1

# systemd-networkd (declarativo INI)
[Network]
Address=192.168.1.50/24
Gateway=192.168.1.1
```

## Casos de Uso

| Escenario | Recomendación |
|-----------|---|
| **Ubuntu moderno** | ✅ Ideal |
| **IaC/Ansible** | ✅ Ideal |
| **Servidores** | ✅ Ideal |
| **Desktops Linux** | ✅ Ideal |
| **Portabilidad** | ✅ Ideal (múltiples distros) |
| **Compatibilidad antigua** | ❌ Usar ifupdown |

## Relaciones

### Conecta con
- [[red-linux|Configuración de Red en Linux]] — Abstracción moderna
- [[red-linux-ifupdown|ifupdown]] — Alternativa tradicional
- [[red-linux-networkmanager|NetworkManager]] — Backend compatible
- [[red-linux-systemd-networkd|systemd-networkd]] — Backend compatible
- [[resolucion-nombres-linux|Resolución de Nombres en Linux]] — Configuración de DNS

## Fuentes
- [netplan](https://www.josedomingo.org/pledin/2025/04/configuracion-red-linux-netplan/) — Configuración YAML declarativa
