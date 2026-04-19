---
created: 2026-04-19
updated: 2026-04-19
title: "NetworkManager: Configuración Dinámica de Red en Linux"
sources: [configuracion_red_linux_networkmanager]
tags: [redes, linux, networkmanager, configuracion]
---

# NetworkManager: Configuración Dinámica de Red en Linux

## Resumen de una línea
Gestor dinámico de red con interfaz gráfica y CLI (`nmcli`) para desktops, laptops y entornos cambiantes.

## Concepto

NetworkManager es una **herramienta moderna para entornos dinámicos**: detecta redes automáticamente, gestiona conexiones WiFi, VPN y Ethernet sin intervención manual. Ideal para **desktops y laptops**.

## Instalación y Activación

```bash
# Instalar
sudo apt install network-manager

# Iniciar y activar
sudo systemctl enable NetworkManager
sudo systemctl start NetworkManager
```

## Interfaces de Uso

### 1. **nmcli** — Command Line Interface

```bash
# Ver dispositivos disponibles
nmcli device

# Listar conexiones activas
nmcli connection show --active

# Crear conexión Ethernet estática
nmcli connection add type ethernet ifname enp0s3 \
  con-name "ManualEthernet" \
  ip4 192.168.1.100/24 \
  gw4 192.168.1.1

# Activar conexión
nmcli connection up ManualEthernet

# Desconectar interfaz
nmcli device disconnect ifname enp0s3

# Eliminar conexión
nmcli connection delete "ManualEthernet"
```

### 2. **nmtui** — Text User Interface

Interfaz interactiva en terminal:
```bash
sudo nmtui
```

Menú:
- Edit a connection
- Activate a connection
- Set system hostname

### 3. **nm-applet** — Graphical Applet

Icono en bandeja de tareas (GNOME, KDE). Click → seleccionar red WiFi, cambiar conexión, etc.

## Configuración Automática (DHCP)

NetworkManager detecta redes automáticamente:

1. Escanea interfaces
2. Obtiene IP vía DHCP
3. Configura DNS automáticamente
4. Conecta sin intervención

## Configuración Manual (IP Estática)

```bash
nmcli connection add type ethernet ifname enp0s3 \
  con-name "StaticEthernet" \
  autoconnect yes \
  ipv4.addresses 192.168.1.50/24 \
  ipv4.gateway 192.168.1.1 \
  ipv4.dns "8.8.8.8 8.8.4.4" \
  ipv4.method manual

nmcli connection up StaticEthernet
```

## Gestión de Conexiones WiFi

```bash
# Escanear redes disponibles
nmcli device wifi list

# Conectar a WiFi
nmcli device wifi connect "SSID" password "password"

# Mostrar conexión actual
nmcli connection show --active
```

## Coexistencia con ifupdown

NetworkManager puede respetar configuraciones de ifupdown si está configurado correctamente, pero **evitar conflictos**:

- Si NetworkManager gestiona `enp0s3`, no configurarlo en `/etc/network/interfaces`
- O deshabilitar NetworkManager en interfaces específicas

## Ventajas

✅ **Dinámico** — Detecta redes automáticamente
✅ **GUI** — Fácil para usuarios no técnicos
✅ **WiFi** — Manejo excelente de redes inalámbricas
✅ **Laptop-friendly** — Ideal para roaming entre redes
✅ **VPN** — Soporte nativo para VPN

## Desventajas

❌ **Pesado** — Más recursos que ifupdown
❌ **Complejo** — Más configuración bajo capó
❌ **Servidor** — Overkill para máquinas estables
❌ **Conflictos** — Choca con ifupdown si no se configura bien

## Casos de Uso

| Entorno | Recomendación |
|---------|---|
| **Desktop/Laptop** | ✅ Ideal |
| **WiFi móvil** | ✅ Ideal |
| **VPN** | ✅ Ideal |
| **Servidor estable** | ❌ Overkill |
| **Contenedores** | ❌ No aplica |

## Comparativa con Alternativas

| Aspecto | NetworkManager | ifupdown | systemd-networkd | netplan |
|---------|---|---|---|---|
| **Complejidad** | Media | Simple | Media | Simple |
| **GUI** | ✅ Sí | ❌ No | ❌ No | ❌ No |
| **Dinámico** | ✅ Automático | ⚠️ Manual | ✅ Automático | ✅ Automático |
| **Desktops** | ✅ Ideal | ⚠️ OK | ⚠️ OK | ✅ Ideal |
| **Servidores** | ⚠️ OK | ✅ Ideal | ✅ Ideal | ✅ Ideal |

## Relaciones

### Conecta con
- [[red-linux|Configuración de Red en Linux]] — Herramienta moderna para desktops
- [[red-linux-ifupdown|ifupdown]] — Alternativa tradicional
- [[red-linux-systemd-networkd|systemd-networkd]] — Alternativa servidor
- [[red-linux-netplan|netplan]] — Abstracción que usa NetworkManager como renderer

## Fuentes
- [NetworkManager](https://www.josedomingo.org/pledin/2025/01/configuracion-red-linux-networkmanager/) — Guía nmcli y configuración
