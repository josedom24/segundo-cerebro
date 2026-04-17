---
title: Apache
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [apache]
aliases: [Apache, Apache2, httpd, Servidor Web Apache]
---

# Apache

## Resumen de una línea
Servidor web modular de código abierto: arquitectura con MPM, virtual hosting, módulos extensibles para aplicaciones web, proxy y seguridad.

## Definición

**Apache** = Servidor HTTP de código abierto más usado en internet. Implementa HTTP/1.1 con arquitectura modular (carga solo módulos necesarios) y soporte para virtual hosting, autenticación, rewriting, proxy inverso y extensiones (PHP, Python, WebDAV).

Desarrollado por Apache Software Foundation desde 1995. Versión actual: 2.4.

## Conceptos Clave

### Arquitectura Modular
```
Core (compilado):
- core.c, mod_so.c, http_core.c, mod_log_config.c

Dinámicos (mods-available/ y mods-enabled/):
- mod_php (ejecución PHP)
- mod_security2 (WAF/firewall)
- mod_proxy (proxy inverso)
- mod_rewrite (reescritura URLs)
- mod_ssl (HTTPS/TLS)
- mod_userdir (directorios de usuario)
- mod_dav (WebDAV)
- mod_negotiation (negociación de contenido)
- mod_auth_basic, mod_auth_digest (autenticación)

Gestión:
- apache2ctl (control, diagnóstico)
- a2enmod / a2dismod (activar/desactivar)
- a2ensite / a2dissite (sitios virtuales)
```

### MPM (Multiprocesamiento)
```
Modelos:
- prefork: procesos separados (estable, overhead)
- worker: threads (más eficiente)
- event: threads + event loop (ideal para proxy)

Selección depende de:
- Módulos (mod_php requiere prefork)
- Carga esperada
- Memoria disponible
```

### Virtual Hosting
```
Dos formas:
1. Basado en nombre (NameVhost)
   - Múltiples dominios en 1 IP
   - Host header identifica sitio

2. Basado en IP
   - Cada dominio en IP diferente
   - Costoso, menos común

Configuración:
- /etc/apache2/sites-available/
- /etc/apache2/sites-enabled/ (enlaces)
- DocumentRoot por sitio
- Logs separados
```

## Características

- **Estable y maduro**: Versión 2.4 desde 2012, producción probada
- **Multiplataforma**: Linux, Windows, macOS
- **Extensible**: 100+ módulos disponibles
- **Configuración flexible**: .conf files + .htaccess override
- **Rendimiento**: Tunable (Timeout, KeepAlive, MaxClients)
- **Seguridad**: mod_security2, mod_ssl, control acceso Require
- **Compatibilidad**: HTTP/1.1, CGI, FastCGI, WSGI, FPM

## Comparación con Alternativas

| Servidor | Modelos | Overhead | Casos |
|----------|---------|----------|-------|
| Apache   | Modular | Medium   | VirtualHosts, PHP, WAF |
| Nginx    | Event   | Low      | Proxy, HLS, SSL/TLS |
| Caddy    | Modern  | Low      | HTTPS auto, API |

Apache sigue dominando en:
- Hosting compartido (VirtualHosts masivos)
- Aplicaciones legacy (mod_php)
- Seguridad web (mod_security)

## Relaciones

### Conecta con

### Enlaza con
- [[http|HTTP]] — Protocolo base que implementa
- [[tls|TLS]] — Certificados y HTTPS (mod_ssl)
- linux — Instalación, gestión systemd
- seguridad — mod_security2, autenticación, control acceso

### En ecosistema
- Alternativa a [[kubernetes|Kubernetes]] — Apache como proxy inverso
- Complemento a [[openshift|OpenShift]] — Proxy web tradicional

## Fuentes

- [Curso: Apache 2.4 (PLEDIN)](https://plataforma.josedomingo.org/pledin/cursos/apache24/)
- [Apache HTTP Server Official](https://httpd.apache.org/)
- [Apache 2.4 Documentation (ES)](https://httpd.apache.org/docs/2.4/es/)
