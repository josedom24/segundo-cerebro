---
title: DNS
created: 2026-04-19
updated: 2026-04-19
sources: [curso_dns_bind9]
tags: [dns, redes]
---

# DNS

## Definición
DNS (Domain Name System) es un protocolo que permite almacenar y consultar información sobre nombres de dominio: direcciones IP, servidores de correo, nombres de máquinas, etc.

## Resumen de una línea
Sistema de nombres distribuido que traduce nombres de dominio (ejemplo.com) a direcciones IP y proporciona servicios de resolución en toda internet.

## Conceptos Clave Fundamentales

### Estructura de Nombres

- **Hostname:** Nombre único de un host (una palabra), almacenado en `/etc/hostname`
- **FQDN (Fully Qualified Domain Name):** Nombre completamente cualificado (hostname + dominio)
- **Domain Name:** Sucesión de nombres concatenados por puntos
- **Dominio Raíz:** Punto final que termina todo dominio (ejemplo.com.)
- **TLD (Top Level Domain):** Dominios de nivel superior (.com, .org, .es, etc.)

### Zonas y Autoridad

- **Zona DNS:** Conjunto de información sobre un dominio
  - Directa: Traduce nombres a IPs
  - Inversa: Traduce IPs a nombres (resolución inversa)
- **Servidor con Autoridad:** MTA que almacena el fichero de zona
- **Maestro/Esclavo:** Maestro autorizado, esclavos replicados para redundancia

### Registros DNS Principales

| Registro | Función |
|----------|---------|
| **SOA** | Start of Authority - Metainformación de zona |
| **NS** | Servidores con autoridad sobre la zona |
| **A** | Dirección IPv4 |
| **AAAA** | Dirección IPv6 |
| **CNAME** | Alias de nombre |
| **MX** | Servidor de correo |
| **PTR** | Resolución inversa (IP → nombre) |

## Proceso de Resolución

### Consulta Recursiva
1. Cliente pregunta a servidor DNS configurado
2. Si servidor tiene autoridad → responde
3. Si servidor tiene en caché → responde
4. Si no → consulta a root servers → TLD → servidor con autoridad
5. Guarda en caché y devuelve resultado

### Tipos de Servidores

- **Recursivo:** Resuelve consultas haciendo preguntas en cadena
- **Forward:** Reenviador, pregunta a otro servidor
- **Cache:** Solo almacena resoluciones previas

## Resolución Inversa

Traduce dirección IP a nombre (PTR). Usa notación inversa:
```
IP 10.0.0.11 → 11.0.0.10.in-addr.arpa
```

## Relaciones

### Conecta con
- [[bind9|Bind9]] — Implementación de servidor DNS
- [[postfix|Postfix]] — Usa MX records para enrutamiento
- [[http|HTTP]] — Resolución de nombres para sitios web

## Fuentes
- [Protocolo DNS](https://github.com/josedom24/curso_dns_bind9) — Conceptos fundamentales
- [Resolución de nombres en Linux](https://www.josedomingo.org/pledin/2024/02/resolucion-nombres-linux/) — Implementación
