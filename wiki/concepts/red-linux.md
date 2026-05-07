---
created: 2026-04-19
updated: 2026-04-19
sources: []
tags: [redes, linux, configuracion]
---

# Configuración de Red en Linux

## Resumen de una línea
Herramientas y métodos para configurar interfaces de red, IP, rutas y DNS en sistemas Linux.

## Concepto

La configuración de red en Linux ha evolucionado desde métodos tradicionales (ifupdown) hacia soluciones modernas más flexibles y declarativas. Existen múltiples herramientas para gestionar:

- **Interfaces de red** (Ethernet, WiFi, VPN)
- **Direccionamiento** (IP estática, DHCP)
- **Rutas** (gateway, tablas de enrutamiento)
- **DNS** (resolución de nombres)

## Herramientas Disponibles

| Herramienta | Tipo | Casos de Uso |
|-------------|------|--------------|
| **ifupdown** | Tradicional, script-based | Servidores estables, configuración simple |
| **NetworkManager** | Dinámico, GUI+CLI | Desktops, laptops, entornos cambiantes |
| **systemd-networkd** | Declarativo, systemd | Servidores modernos, contenedores |
| **netplan** | Abstracción YAML | Ubuntu, backends múltiples |

## Evolución

```
1990s-2000s: ifupdown (scripts simples)
      ↓
2000s-2010s: NetworkManager (dinámico, desktop)
      ↓
2010s+: systemd-networkd (declarativo, moderno)
      ↓
2020s+: netplan (abstracción, flexibilidad)
```

## Relaciones

### Conecta con
- [[resolucion-nombres-linux|Resolución de Nombres en Linux]] — Parte de configuración (DNS)
- [[bind9|Bind9]] — Servidor DNS para redes
- [[dnsmasq-servidor-dns-ligero|dnsmasq]] — DNS + DHCP en redes locales

## Fuentes
- Artículos individuales sobre cada herramienta
