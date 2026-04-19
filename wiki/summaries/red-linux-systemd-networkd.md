---
created: 2026-04-19
updated: 2026-04-19
sources: [configuracion_red_linux_systemd_networkd]
tags: [redes, linux, systemd, configuracion]
---

# systemd-networkd: Configuración Declarativa de Red

## Resumen de una línea
Componente de systemd para gestionar red de forma declarativa mediante ficheros `.network` en `/etc/systemd/network/`.

## Concepto

systemd-networkd es la **solución moderna de systemd** para gestionar redes: usa ficheros declarativos (no imperativos como ifupdown scripts). Perfecto para **servidores, contenedores, entornos IaC**.

## Ficheros de Configuración

Ubicación: `/etc/systemd/network/`

### Tipos de Ficheros

| Fichero | Función |
|---------|---------|
| `.network` | Configuración de interfaz |
| `.netdev` | Dispositivos virtuales (bridge, VLAN, túnel) |
| `.link` | Propiedades de interfaz (MTU, nombre, MAC) |

## Configuración Básica: `.network`

### DHCP (obtener IP automáticamente)

**Fichero: `/etc/systemd/network/10-dhcp.network`**
```
[Match]
Name=enp1s0

[Network]
DHCP=yes
```

### IP Estática

**Fichero: `/etc/systemd/network/20-static.network`**
```
[Match]
Name=enp1s0

[Network]
Address=192.168.1.2/24
Gateway=192.168.1.1
DNS=1.1.1.1 8.8.8.8
```

## Sección [Match]

Define cuáles interfaces aplican esta configuración:

```
[Match]
Name=enp*              # Interfaz que empieza con enp
Name=eth0 eth1        # O estas específicas
MACAddress=00:11:22:33:44:55
Type=ether            # Tipo de interfaz
```

## Sección [Network]

Configuración principal:

```
[Network]
DHCP=yes              # DHCP IPv4
DHCP6=yes             # DHCP IPv6
Address=192.168.1.2/24
Gateway=192.168.1.1
DNS=8.8.8.8 8.8.4.4
Domains=example.com   # Search domain
RouteMetric=100       # Métrica de ruta
```

## Dispositivos Virtuales: `.netdev`

### Bridge (puente de red)

**Fichero: `/etc/systemd/network/10-br0.netdev`**
```
[NetDev]
Name=br0
Kind=bridge
```

**Fichero: `/etc/systemd/network/11-eth0-br0.network`**
```
[Match]
Name=eth0

[Network]
Bridge=br0
```

### VLAN (Virtual LAN)

```
[NetDev]
Name=vlan100
Kind=vlan

[VLAN]
Id=100
```

## Comandos de Gestión

```bash
# Ver estado de interfaces
networkctl list
networkctl status enp0s3

# Recargar configuración
networkctl reload

# Reconfigurar interfaz específica
networkctl reconfigure enp0s3

# Reiniciar servicio
sudo systemctl restart systemd-networkd
```

## Ventajas

✅ **Declarativo** — Define el estado deseado (no pasos)
✅ **Integrado systemd** — Coherencia con resto de SO
✅ **Ligero** — Bajo overhead, ideal servidor
✅ **Versátil** — Soporta configuraciones complejas (VLAN, bridge, túnel)
✅ **IaC-friendly** — Fácil para automatización (Ansible, Terraform)
✅ **Rápido** — Inicio más rápido que NetworkManager

## Desventajas

❌ **No GUI** — Solo configuración de texto
❌ **Curva aprendizaje** — Sintaxis específica
❌ **Menos maduro** — Que ifupdown/NetworkManager
❌ **Desktop** — No tiene gestor de WiFi visual

## Comparación de Sintaxis

```yaml
# ifupdown
auto enp1s0
iface enp1s0 inet static
  address 192.168.1.2/24
  gateway 192.168.1.1

# systemd-networkd
[Network]
Address=192.168.1.2/24
Gateway=192.168.1.1

# netplan (YAML)
network:
  version: 2
  ethernets:
    enp1s0:
      addresses: [192.168.1.2/24]
      routes:
        - to: default
          via: 192.168.1.1
```

## Casos de Uso

| Escenario | Recomendación |
|-----------|---|
| **Servidor** | ✅ Ideal |
| **Contenedor** | ✅ Ideal |
| **IaC/Ansible** | ✅ Ideal |
| **Rendimiento** | ✅ Ideal |
| **Desktop** | ❌ Usar NetworkManager |
| **WiFi** | ❌ Usar NetworkManager |

## Relaciones

### Conecta con
- [[red-linux|Configuración de Red en Linux]] — Solución moderna
- [[red-linux-ifupdown|ifupdown]] — Alternativa tradicional
- [[red-linux-networkmanager|NetworkManager]] — Alternativa para desktops
- [[red-linux-netplan|netplan]] — Abstracción que usa systemd-networkd como renderer

## Fuentes
- [systemd-networkd](https://www.josedomingo.org/pledin/2025/03/configuracion-red-linux-systemd-networkd/) — Configuración declarativa
