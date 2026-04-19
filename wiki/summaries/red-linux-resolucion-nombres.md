---
created: 2026-04-19
updated: 2026-04-19
title: Resolución de Nombres en Linux
sources: [resolucion_nombres_linux]
tags: [dns, linux, resolucion-nombres, configuracion]
---

# Resolución de Nombres en Linux

## Resumen de una línea
Sistema de traducción de nombres a IPs mediante `/etc/resolv.conf`, `/etc/nsswitch.conf`, `/etc/hosts` y systemd-resolved.

## Concepto

Resolución de nombres es cómo Linux traduce nombres (www.example.com) a direcciones IP. Involucra múltiples ficheros y servicios en un orden específico.

## Flujo de Resolución

```
Aplicación solicita IP
        ↓
Consulta /etc/nsswitch.conf (¿qué usar?)
        ↓
Si "files": busca en /etc/hosts
        ↓
Si "dns": consulta systemd-resolved (localhost:53 o 127.0.0.53:53)
        ↓
systemd-resolved consulta servidores en /etc/resolv.conf
        ↓
Retorna IP (en caché)
```

## Fichero 1: `/etc/resolv.conf`

Especifica **servidores DNS** y comportamiento de búsqueda:

```bash
# Servidores DNS (en orden)
nameserver 8.8.8.8
nameserver 8.8.4.4
nameserver 1.1.1.1

# Dominio por defecto (se añade a nombres incompletos)
domain example.com

# Dominios de búsqueda (varios)
search example.com subdomain.com

# Opciones de resolución
options timeout:2 attempts:3 rotate
```

### Parámetros Clave

| Parámetro | Función |
|-----------|---------|
| `nameserver` | IP servidor DNS |
| `domain` | Dominio a añadir a consultas incompletas |
| `search` | Lista de dominios para búsqueda |
| `options timeout:N` | Timeout en segundos |
| `options attempts:N` | Reintentos por servidor |
| `options rotate` | Rota entre servidores |

## Fichero 2: `/etc/nsswitch.conf`

Define el **orden de búsqueda** para resolución de nombres:

```bash
# Buscar primero /etc/hosts, luego DNS
hosts: files dns

# Solo /etc/hosts (no DNS)
# hosts: files

# DNS primero, luego /etc/hosts
# hosts: dns files
```

### Valores Comunes

| Fuente | Función |
|--------|---------|
| `files` | /etc/hosts (local) |
| `dns` | systemd-resolved (servicios DNS) |
| `myhostname` | Nombre de máquina del sistema |
| `mymachines` | Contenedores systemd-nspawn |

## Fichero 3: `/etc/hosts`

Base de datos **local** de nombres (no necesita DNS):

```bash
127.0.0.1       localhost
::1             localhost

# Máquinas en red local
192.168.1.10    servidor.example.local    servidor
192.168.1.20    web.example.local         web
192.168.1.30    db.example.local          db
```

**Uso real:** Máquinas internas que no están en DNS público:
```bash
# Evitar consultar DNS público cada vez
10.0.0.1        kubernetes.local
10.0.0.2        docker.local
```

## systemd-resolved

Servicio DNS moderno que maneja resolución en sistemas systemd:

### Características

- **Caché DNS** local (más rápido)
- **mDNS** para `.local` domains (sin servidor central)
- **DNSSEC** (validación de seguridad)
- **DNS over TLS** (privacidad)

### Puertos

- **127.0.0.53:53** — Stub resolver (recomendado)
- **127.0.0.1:53** — Legacy socket (antiguo)

### Ubicación en Debian/Ubuntu

**Ubuntu 22.04+:** Usa stub resolver
```bash
# /run/systemd/resolve/stub-resolv.conf apunta a 127.0.0.53
```

**Debian 12:** Enlaza directo a DNS configurado
```bash
# /run/systemd/resolve/resolv.conf lista servidores reales
```

### Comandos de Gestión

```bash
# Ver estado DNS actual
resolvectl status

# Ver DNS por interfaz
resolvectl query example.com

# Estadísticas de caché
resolvectl statistics

# Limpiar caché
resolvectl flush-caches

# Configurar DNS globales
sudo resolvectl dns eth0 8.8.8.8 8.8.4.4

# Configurar DNS por interfaz
echo "nameserver 8.8.8.8" | sudo tee /etc/systemd/resolved.conf
sudo systemctl restart systemd-resolved
```

## Configuración de systemd-resolved

**Fichero: `/etc/systemd/resolved.conf`**

```ini
[Resolve]
DNS=8.8.8.8 8.8.4.4 1.1.1.1
FallbackDNS=8.8.8.8
Domains=example.com ~localdomain
DNSSEC=yes
DNS_over_TLS=no
mDNS=yes
```

## mDNS: Nombres Locales sin DNS Central

Permite `.local` domains automáticamente (similar Bonjour):

```bash
# Con mDNS activado en systemd-resolved
ping servidor.local      # Funciona sin DNS
ping micompu.local       # Descubre en la red local
```

Requiere: **avahi-daemon** (mDNS) instalado

## Caso Real: Orden Completo

Cliente pregunta por `www.example.com`:

1. **nsswitch.conf dice:** `hosts: files dns`
2. **Busca `/etc/hosts`** → No encontrado
3. **Consulta systemd-resolved** (puerto 127.0.0.53)
4. **systemd-resolved mira `/etc/resolv.conf`** → encuentra `nameserver 8.8.8.8`
5. **Consulta Google DNS** → Retorna 93.184.216.34
6. **Caché localmente** → Siguientes consultas son instantáneas
7. **Retorna a cliente**

## Ventajas del Nuevo Sistema

✅ **Caché** — Faster DNS after first query
✅ **DNSSEC** — Validación de autenticidad
✅ **DNS over TLS** — Privacidad contra ISP
✅ **mDNS** — Nombres locales sin servidor
✅ **Flexible** — Diferentes DNS por interfaz

## Troubleshooting Común

```bash
# ¿Qué DNS estoy usando?
resolvectl status

# ¿Está systemd-resolved activo?
systemctl status systemd-resolved

# ¿Resuelve correctamente?
nslookup example.com
dig example.com

# Ver logs de resolución
journalctl -u systemd-resolved -f
```

## Comparativa: Evolución

| Aspecto | Antiguo (ifupdown) | Moderno (systemd-resolved) |
|--------|---|---|
| **DNS** | `/etc/resolv.conf` estático | Dinámico, por interfaz |
| **Caché** | Ninguno (aplicación) | systemd-resolved caché |
| **mDNS** | No | avahi daemon |
| **DNSSEC** | No | ✅ Sí |
| **Privacidad** | No | DoT (DNS over TLS) |

## Relaciones

### Conecta con
- [[red-linux-resolucion-nombres|Resolución de Nombres en Linux]] — Concepto
- [[red-linux|Configuración de Red en Linux]] — Parte de configuración
- [[dns-conceptos-fundamentales|Fundamentos de DNS]] — Protocolo DNS
- [[bind9|Bind9]] — Servidor DNS autoritativo
- [[dnsmasq-dns-caching-dhcp|dnsmasq]] — DNS + DHCP local

## Fuentes
- [Resolución de Nombres en Linux](https://www.josedomingo.org/pledin/2024/02/resolucion-nombres-linux/) — Configuración systemd-resolved y nsswitch
