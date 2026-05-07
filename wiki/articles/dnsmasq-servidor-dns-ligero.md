---
created: 2026-04-19
updated: 2026-04-19
sources: [dnsmasq_servidor_dns]
tags: [dns, dnsmasq, caching, dhcp]
title: "dnsmasq: Servidor DNS Ligero para Redes Locales"
---

# dnsmasq: Servidor DNS Ligero para Redes Locales

## Resumen de una línea
Servidor DNS forwarder ligero con caching, DHCP e integración con `/etc/hosts` para redes locales sin configuración compleja.

## Introducción

dnsmasq es un servidor DNS alternativo a Bind9, diseñado para **entornos pequeños y medianos** donde se necesita:
- Caché DNS para acelerar resoluciones
- Integración con máquinas locales vía DHCP
- Compartir nombres locales a toda la red
- Configuración simple sin zonas

## Ventajas vs Bind9

| Aspecto | dnsmasq | Bind9 |
|--------|---------|-------|
| **Complejidad** | Muy simple | Compleja (zonas, vistas) |
| **Instalación** | Apt, sin config | Apt + configuración extensa |
| **DHCP integrado** | ✅ Nativo | ❌ Requiere ISC DHCP |
| **Caché DNS** | ✅ Automático | ✅ Sí, pero manual |
| **Redes pequeñas** | ✅ Ideal | ⚠️ Overkill |
| **Autoridad DNS** | ❌ No | ✅ Sí |

## Cómo Funciona

1. **Cliente** pregunta nombre a dnsmasq
2. **dnsmasq** busca en `/etc/hosts` local
3. Si existe → responde con IP local
4. Si no existe → consulta upstream DNS (de `/etc/resolv.conf`)
5. **Caché** la respuesta para futuras consultas
6. Retorna resultado al cliente

## Integración con `/etc/hosts`

Cualquier entrada en `/etc/hosts` se convierte automáticamente en registro DNS queryable:

```
127.0.0.1       localhost
192.168.1.10    servidor.example.local
192.168.1.20    web.example.local
```

**Resultado:** Todos los clientes de la red pueden resolver `servidor.example.local` → `192.168.1.10`

## Integración con DHCP

dnsmasq puede actuar como servidor DHCP y DNS simultáneamente. Máquinas que toman DHCP aparecen automáticamente en DNS:

- Cliente recibe IP `192.168.1.100` + hostname `cliente1` vía DHCP
- dnsmasq registra automáticamente: `cliente1` → `192.168.1.100`
- Otros clientes pueden resolver `cliente1.local`

## Registros DNS Soportados

dnsmasq soporta registros estándar:
- **A/AAAA:** Direcciones IPv4/IPv6
- **CNAME:** Alias
- **MX:** Servidores de correo
- **NS:** Servidores de nombres
- **PTR:** Resolución inversa
- **SOA:** Zona authority

## Casos de Uso Reales

✅ **Red de laboratorio educativo** — Máquinas + DHCP + DNS en una única herramienta
✅ **Oficina pequeña** — Caché centralizad + control interno de hostnames
✅ **Contenedores locales** — DNS para Podman/Docker (resolución .local)
✅ **Redes domésticas** — Router con dnsmasq integrado (OpenWrt, DD-WRT)

## Comparación: Cuándo Usar Qué

- **dnsmasq:** Redes < 50 máquinas, DNS interno simple, no necesita autoridad sobre dominio
- **Bind9:** Servidores DNS autoritativos, múltiples vistas, delegación de subdominios, master/slave

## Ventajas para Educación

1. **Instalación trivial** — `apt install dnsmasq`
2. **Configuración mínima** — Editar `/etc/dnsmasq.conf`
3. **Integración automática** — `/etc/hosts` + DHCP
4. **Bajo overhead** — Ideal para VMs de laboratorio
5. **Debugging sencillo** — Logs claros en `/var/log/syslog`

## Relaciones

### Conecta con
- [[dns-conceptos-fundamentales|Fundamentos de DNS]] — Concepto base (FQDN, zonas, registros)
- [[dns-bind9-configuracion|Configuración de Bind9]] — Alternativa más potente para redes grandes
- [[bind9|Bind9]] — Concepto servidor DNS autoritativo

## Fuentes
- [Configurando un servidor DNS con dnsmasq](https://www.josedomingo.org/pledin/2020/12/servidor-dns-dnsmasq/) — Artículo original
