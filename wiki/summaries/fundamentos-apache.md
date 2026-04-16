---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [apache, http, instalacion, linux]
---

# Fundamentos de Apache

## Resumen de una línea
Conceptos base de Apache 2.4: protocolo HTTP, historia del servidor, instalación en Debian/Ubuntu, gestión con systemd y apache2ctl.

## Información
- **Fuente:** Curso Apache 2.4 - Unidades 1-3
- **Plataforma:** Linux Debian/Ubuntu
- **URL:** https://plataforma.josedomingo.org/pledin/cursos/apache24/

---

## Protocolo HTTP

[[http]] es el protocolo base que Apache implementa. Características:
- **Request/Response:** Cliente solicita, servidor responde
- **Sin estado:** Cada petición es independiente
- **Texto plano:** Mensajes legibles (antes de HTTPS)
- **Métodos:** GET (obtener), POST (enviar), HEAD, PUT, DELETE
- **Códigos estado:** 2xx (éxito), 3xx (redirección), 4xx (cliente error), 5xx (servidor error)

Ejemplo request:
```
GET /index.html HTTP/1.1
Host: www.ejemplo.com
```

---

## Historia de Apache

- **1994:** Surge de "parches" (patches) al HTTPd NCSA → nombre "A patchy server" = "Apache"
- **Abril 1995:** Versión 0.6 publicada
- **Desde 1996:** Servidor HTTP más usado en internet
- **2.4 (actual):** Versión estable producción desde 2012

**Por qué Apache:**
- Estable y maduro
- Multiplataforma (Linux, Windows, macOS)
- Código abierto (Apache License)
- Modular y extensible

---

## Instalación en Debian/Ubuntu

```bash
# Instalar Apache 2.4
apt-get install apache2

# Estado del servicio
systemctl status apache2.service

# Control de servicio
systemctl [start|stop|restart|reload|status] apache2.service
```

**Nota:** `systemctl reload` recarga config sin reiniciar (graceful).

---

## Gestión con apache2ctl

Herramienta específica de Apache para diagnóstico y control:

```bash
# Comprobar sintaxis config
apache2ctl -t
# Salida: Syntax OK

# Listar módulos cargados
apache2ctl -M
# Salida: mpm_prefork_module, core_module, mod_ssl, ...

# Listar sitios virtuales
apache2ctl -S
# Muestra VirtualHosts, puertos, config

# Ver opciones compilación
apache2ctl -V
# Salida: AP_TYPES_CONFIG_FILE, HTTPD_ROOT, MODULE_DIR

# Control del servidor
apache2ctl [-k start|restart|stop|graceful|graceful-stop]
# graceful: termina conexiones actuales, reinicia suavemente
```

---

## Conceptos Clave

### Arquitectura Modular
Apache carga **solo módulos necesarios** en memoria → más eficiente que incluir todo compilado.

```
/etc/apache2/
├── mods-available/     # Módulos disponibles (instalados)
│   ├── ssl.load, ssl.conf
│   ├── php7.0.load, php7.0.conf
│   └── ...
└── mods-enabled/       # Módulos activos (enlaces simbólicos)
    ├── ssl.load -> /etc/apache2/mods-available/ssl.load
    └── ...
```

### Usuario Apache
Apache corre como usuario no-root por seguridad:

```bash
# Ver usuario Apache
grep -E "^User " /etc/apache2/apache2.conf
# Típicamente: User www-data
```

---

## Relaciones

### Conecta con
- [[http]] — Protocolo implementado
- [[apache]] — Concepto general del servidor
- [[configuracion-apache|Configuración]] — Ficheros config

### Conceptos previos
- [[linux]] — Sistema operativo base
- [[redes]] — Puertos, TCP/IP

---

## Fuentes

- [Apache HTTP Server 2.4 Documentation](https://httpd.apache.org/docs/2.4/)
- [Apache 2.4 Docs ES](https://httpd.apache.org/docs/2.4/es/)
- Curso Apache 2.4 (PLEDIN, JOSEDOMINGO)
