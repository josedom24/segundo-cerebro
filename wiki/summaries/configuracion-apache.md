---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [apache, configuracion, linux]
---

# Configuración de Apache

## Resumen de una línea
Estructura de ficheros config en Apache: apache2.conf, directivas clave (Timeout, KeepAlive, User/Group), contextos (Directory, Files), comprobación sintaxis.

## Información
- **Fuente:** Curso Apache 2.4 - Unidades 4-6
- **Ficheros:** /etc/apache2/apache2.conf, *.conf en mods-enabled/ y sites-enabled/
- **URL:** https://plataforma.josedomingo.org/pledin/cursos/apache24/

---

## Estructura de Ficheros de Configuración

Apache cargar configuración en cascada. Fichero principal: `/etc/apache2/apache2.conf`

```apache
# apache2.conf incluye:
IncludeOptional mods-enabled/*.load     # Carga módulos (ordenado alfabético)
IncludeOptional mods-enabled/*.conf     # Configuración módulos
Include ports.conf                      # Puertos escucha
IncludeOptional conf-enabled/*.conf     # Config adicional
IncludeOptional sites-enabled/*.conf    # Sitios virtuales
```

### Directorios Clave

```
/etc/apache2/
├── apache2.conf              # Fichero principal
├── ports.conf                # Puertos escucha (80, 443)
├── mods-available/           # Módulos instalados
├── mods-enabled/             # Módulos activos (enlaces)
├── conf-available/           # Config opcionales disponibles
├── conf-enabled/             # Config activas (enlaces)
├── sites-available/          # VirtualHosts disponibles
└── sites-enabled/            # VirtualHosts activos (enlaces)

/var/www/                      # DocumentRoot default
/var/log/apache2/              # Logs (access.log, error.log)
```

---

## Directivas de Control

### Conexión

```apache
# Tiempo máximo espera (segundos)
Timeout 300

# Conexiones persistentes
KeepAlive On                              # Default: On
MaxKeepAliveRequests 100                  # Requests por conexión
KeepAliveTimeout 5                        # Segundos entre requests
```

### Usuario y Grupo

```apache
# Usuario que ejecuta procesos Apache
User www-data

# Grupo del usuario
Group www-data

# Por seguridad: NOT root
```

### Logging

```apache
# Nivel de detalle (debug, info, notice, warn, error, crit, alert, emerg)
LogLevel warn

# Formato logs (apache predefinido, o custom)
LogFormat "%h %l %u %t \"%r\" %>s %b" common
CustomLog /var/log/apache2/access.log common
ErrorLog /var/log/apache2/error.log
```

---

## Contextos de Configuración

Directivas aplican a contextos específicos:

### Directory (y subdirectorios)

```apache
<Directory /var/www/>
    Options Indexes FollowSymLinks         # Ver opciones disponibles
    AllowOverride None                    # No permitir .htaccess
    Require all granted                   # Acceso público
</Directory>

<Directory /var/www/privado/>
    Require all denied                    # Acceso prohibido
</Directory>
```

### Files (conjunto ficheros)

```apache
# Denegar acceso a .htaccess
<Files ~ "^\.ht">
    Deny from all
</Files>

# Ejecutar CGI en .cgi
<Files "*.cgi">
    SetHandler cgi-script
</Files>
```

### VirtualHost (sitio virtual)

```apache
<VirtualHost *:80>
    ServerName www.ejemplo.com
    DocumentRoot /var/www/ejemplo
    # Resto de directivas...
</VirtualHost>
```

---

## Opciones de Directorio

Directiva `Options` controla qué características activa:

```apache
Options Indexes FollowSymLinks

# All         = Todas excepto MultiViews
# None        = Ninguna
# FollowSymLinks = Seguir enlaces simbólicos
# SymLinksIfOwnerMatch = Seguir enlaces si propietario coincide
# Indexes     = Listar directorio (si no index.html)
# MultiViews  = Negociación contenido
# ExecCGI     = Ejecutar scripts CGI
```

Activar/desactivar con `+`/`-`:

```apache
<Directory /var/www/privado/>
    Options -Indexes                      # Denegar listado
    Options +MultiViews                   # Permitir negociación
</Directory>
```

---

## AllowOverride

```apache
AllowOverride None         # .htaccess inerte (más rápido)
AllowOverride All          # .htaccess puede cambiar todo
AllowOverride Indexes      # .htaccess solo para Indexes
AllowOverride AuthConfig   # .htaccess para autenticación
```

---

## Comprobación de Sintaxis

```bash
# Verificar sintaxis sin reiniciar
apache2ctl -t
# Salida: Syntax OK o error detallado

# Ver configuración efectiva (expandida)
apache2ctl -S
# Muestra VirtualHosts, ports, documentroots
```

---

## Relaciones

### Conecta con
- [[apache]] — Concept general
- [[fundamentos-apache|Fundamentos]] — Instalación previa
- [[virtual-hosting-apache|Virtual Hosting]] — Usando VirtualHosts en config
- [[directorios-urls-apache|Directorios y URLs]] — Directivas Directory avanzadas
- [[autenticacion-apache|Autenticación]] — Contextos con Require

---

## Fuentes

- [Apache 2.4 Configuration Directives](https://httpd.apache.org/docs/2.4/mod/directives.html)
- [Apache 2.4 Sections (Directory, Files, VirtualHost)](https://httpd.apache.org/docs/2.4/sections.html)
- Curso Apache 2.4 (PLEDIN)
