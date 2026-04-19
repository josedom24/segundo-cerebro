---
title: Bind9
created: 2026-04-19
updated: 2026-04-19
sources: [curso_dns_bind9]
tags: [bind9, configuracion, redes]
---

# Bind9

## Definición
Bind9 (Berkeley Internet Name Domain) es el servidor DNS más utilizado en internet. Software de código abierto que implementa el protocolo DNS permitiendo crear servidores DNS autorizados, recursivos y esclavos.

## Resumen de una línea
Servidor DNS libre y estándar que gestiona zonas, autoridad, replicación maestro/esclavo y resolución de nombres para dominios.

## Características Principales

### Servidor Autorizado
- Almacena información de dominio en ficheros de zona
- Responde consultas sobre su dominio con autoridad
- Soporta zonas directas (nombre → IP) e inversas (IP → nombre)

### Maestro/Esclavo
- **Maestro:** Servidor primario con autoridad, guarda ficheros de zona
- **Esclavo:** Servidor secundario, replica zonas del maestro
- Redundancia y tolerancia a fallos

### Características Avanzadas
- **Vistas:** Diferentes resoluciones según IP del cliente (interna/externa)
- **Subdominio:** Delegación a otros servidores DNS
- **Integración DHCP:** Actualizaciones dinámicas de registros
- **Control de Acceso:** Restricciones por IP, allow-query, allow-recursion

## Arquitectura

### Ficheros Principales
- `/etc/bind/named.conf` — Configuración principal
- `/etc/bind/named.conf.local` — Zonas locales
- `/etc/bind/named.conf.options` — Opciones globales
- `/var/cache/bind/db.*` — Ficheros de zona

### Flujo de Consulta
```
Cliente → Bind9 → Caché/Fichero de zona → Respuesta
                ↓
           (Si no tiene) → Root servers → TLD → Servidor autorizado
```

## Relaciones

### Conecta con
- [[dns|DNS]] — Protocolo que implementa
- [[postfix|Postfix]] — Usa registros MX
- [[apache|Apache]] — Resuelve nombres de sitios web

## Fuentes
- [Servidor DNS Bind9](https://fp.josedomingo.org/sri/2526/u5/) — Curso completo
- [Vistas en Bind9](https://www.josedomingo.org/pledin/2017/12/vistas-views-en-el-servidor-dns-bind9/) — Configuración avanzada
