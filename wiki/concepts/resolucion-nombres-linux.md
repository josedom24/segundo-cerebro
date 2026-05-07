---
created: 2026-04-19
updated: 2026-04-19
sources: []
tags: [dns, linux, redes]
---

# Resolución de Nombres en Linux

## Resumen de una línea
Mecanismo para traducir nombres de dominio a direcciones IP mediante `/etc/resolv.conf`, `/etc/nsswitch.conf`, `/etc/hosts` y systemd-resolved.

## Concepto

Resolución de nombres es el proceso por el cual un sistema Linux traduce nombres (ej: www.example.com) a direcciones IP. Involucra múltiples componentes:

1. **Configuración estática** (/etc/hosts)
2. **Configuración dinámica** (/etc/resolv.conf, systemd-resolved)
3. **Orden de búsqueda** (/etc/nsswitch.conf)

## Componentes Clave

### /etc/resolv.conf
Especifica servidores DNS y comportamiento de búsqueda:
```
nameserver 8.8.8.8         # DNS primario
nameserver 8.8.4.4         # DNS secundario
search example.com         # Dominio por defecto
```

### /etc/nsswitch.conf
Define el orden de búsqueda (qué fuente consultar primero):
```
hosts: files dns           # Primero /etc/hosts, luego DNS
```

### /etc/hosts
Base de datos local de nombres:
```
127.0.0.1    localhost
192.168.1.10 servidor.local
```

### systemd-resolved
Servicio DNS moderno en sistemas systemd:
- Caché DNS local (puerto 127.0.0.53)
- mDNS (.local domains)
- DNSSEC, DNS over TLS
- Manejo automático de `/run/systemd/resolve/stub-resolv.conf`

## Flujo de Resolución

```
Aplicación → nsswitch.conf → /etc/hosts (files) → systemd-resolved → servidores DNS
```

1. Aplicación solicita resolver nombre
2. Consulta /etc/nsswitch.conf para orden de búsqueda
3. Si "files" primero: busca en /etc/hosts
4. Si no encuentra: consulta systemd-resolved
5. systemd-resolved consulta servidores en /etc/resolv.conf
6. Retorna resultado (caché)

## Relaciones

### Conecta con
- [[red-linux|Configuración de Red en Linux]] — Parte de configuración de red
- [[dns-conceptos-fundamentales|Fundamentos de DNS]] — Protocolo DNS
- [[bind9|Bind9]] — Servidor DNS autoritativo
- [[dnsmasq-servidor-dns-ligero|dnsmasq]] — DNS + DHCP local

## Fuentes
- Artículo: Resolución de Nombres en Linux
