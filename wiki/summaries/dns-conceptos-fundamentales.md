---
title: Fundamentos de DNS
created: 2026-04-19
updated: 2026-04-19
sources: [curso_dns_bind9]
tags: [dns, redes]
---

# Fundamentos de DNS

## Resumen de una línea
Protocolo DNS: nombres, FQDN, zonas, autoridad, registros DNS (A, MX, CNAME, NS, SOA) y resolución recursiva.

## Protocolo DNS

**DNS: Domain Name Server** — Protocolo que almacena y permite consultar información sobre dominios: direcciones IP, servidores de correo, nombres de máquinas, etc.

## Estructura de Nombres

### Componentes
- **Hostname:** Nombre único de un host, almacenado en `/etc/hostname`
- **FQDN (Fully Qualified Domain Name):** hostname + dominio (ejemplo: www.ejemplo.com)
- **Domain Name:** Sucesión de nombres separados por puntos
- **Dominio Raíz:** Punto final invisible (ejemplo.com.)
- **TLD:** Top Level Domains (.com, .org, .es, etc.)

## Zonas DNS

### Tipos de Zonas
- **Directa:** Traduce nombres a direcciones IP (zona gonzalonazareno.org)
- **Inversa:** Traduce IPs a nombres (resolución inversa, zona 0.0.10.in-addr.arpa)

### Fichero de Zona
Fichero de texto que almacena información mediante registros DNS distintos.

## Autoridad sobre una Zona

- **Servidor con Autoridad:** Servidor que almacena y responde sobre su zona
- **Registro NS:** Identifica al servidor autorizado
- **Maestro/Esclavo:** Maestro principal, esclavos replican para redundancia
- **Root Servers:** Servidores raíz (autoridad sobre el dominio ".")

## Registros DNS

| Registro | Función |
|----------|---------|
| **SOA** | Start of Authority - Metainformación (serial, refresh, expire) |
| **NS** | Servidor con autoridad sobre la zona |
| **A** | Dirección IPv4 del nombre |
| **AAAA** | Dirección IPv6 |
| **CNAME** | Alias de nombre (alias → nombre real) |
| **MX** | Servidor de correo del dominio |
| **PTR** | Resolución inversa (IP → nombre) |

## Consulta DNS por Recursión

### Proceso
1. Cliente consulta a su DNS (en resolv.conf)
2. Si DNS tiene autoridad → responde
3. Si DNS tiene en caché → responde
4. Si no → consulta a root servers → TLD → servidor autorizado
5. Guarda en caché y devuelve resultado

### Tipos de Servidores
- **Recursivo:** Resuelve haciendo preguntas en cadena
- **Forward:** Reenvía a otro servidor
- **Cache:** Almacena resoluciones previas

## DNS en Red Local

**Ventajas:**
- Resoluciones más rápidas (caché local)
- Resuelve servicios internos con IPs privadas
- DHCP distribuye DNS local a clientes

## Relaciones

### Conecta con
- [[bind9|Bind9]] — Servidor que implementa DNS
- [[dns-bind9-configuracion|Configuración de Bind9]] — Instalación y setup
- [[postfix|Postfix]] — Usa registros MX

## Fuentes
- [Conceptos sobre DNS](https://github.com/josedom24/curso_dns_bind9) — Protocolo y fundamentos
- [Resolución de nombres Linux](https://www.josedomingo.org/pledin/2024/02/resolucion-nombres-linux/) — Resolución en sistemas
