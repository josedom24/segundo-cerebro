---
title: "Módulos en Apache"
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [apache, modulos, configuracion]
---

# Módulos en Apache

## Resumen de una línea
Arquitectura modular Apache: a2enmod/a2dismod, módulos clave (mod_userdir, mod_dav, mod_rewrite), MPM (prefork, worker, event), selección por caso de uso.

## Información
- **Fuente:** Curso Apache 2.4 - Unidades 20-24
- **Directorios:** mods-available/, mods-enabled/
- **Herramienta:** a2enmod / a2dismod
- **URL:** https://plataforma.josedomingo.org/pledin/cursos/apache24/


## Gestión de Módulos

Apache carga módulos dinámicamente (excepto core compilado). Estructura:

```
/etc/apache2/
├── mods-available/         # Módulos instalados
│   ├── ssl.load
│   ├── ssl.conf
│   ├── php7.0.load
│   └── ...
└── mods-enabled/           # Módulos activos (enlaces)
    ├── ssl.load -> ../mods-available/ssl.load
    └── ...

/usr/lib/apache2/modules/   # Ficheros .so compilados
├── mod_ssl.so
├── mod_php7.0.so
└── ...
```

### a2enmod / a2dismod

```bash
# Activar módulo (crea enlace simbólico)
a2enmod ssl
# Module ssl already enabled → ya estaba activo
# Enabling module ssl.  To activate...
# systemctl restart apache2

# Desactivar módulo
a2dismod ssl
# Disabling module ssl.
# systemctl restart apache2

# Ver módulos cargados
apache2ctl -M
# Salida: ssl_module (shared)

# Listar disponibles
ls /etc/apache2/mods-available/
```


## Módulos Clave

### mod_userdir

Servir página personal por usuario (`~/public_html`):

```apache
# Activar módulo
a2enmod userdir

# Configuración (típica)
# /etc/apache2/mods-enabled/userdir.conf
<IfModule mod_userdir.c>
    UserDir public_html
    UserDir disabled root
    
    <Directory /home/*/public_html>
        AllowOverride FileInfo AuthConfig Limit Indexes
        Options MultiViews Indexes SymLinksIfOwnerMatch IncludesNoExec
        Require method GET POST OPTIONS
    </Directory>
</IfModule>
```

**Uso:**
```bash
# Usuario juan crea ~/public_html/index.html
mkdir -p ~/public_html
echo "<h1>Web Juan</h1>" > ~/public_html/index.html

# Acceder: http://servidor/~juan/
```


### mod_dav (WebDAV)

Protocolo para editar ficheros remotamente (HTTP):

```apache
# Activar módulos necesarios
a2enmod dav
a2enmod dav_fs

# Configuración
<VirtualHost *:80>
    DocumentRoot /var/www/webdav
    
    <Directory /var/www/webdav>
        Dav On
        Options Indexes FollowSymLinks
        Require all granted
    </Directory>
</VirtualHost>
```

**Uso cliente:**
```bash
# Montar WebDAV (Linux)
mount -t davfs http://servidor/webdav /mnt/webdav

# O con nautilus (GNOME):
Ctrl+L → davs://servidor/webdav
```


### mod_rewrite

Reescritura de URLs (poderoso pero complejo):

```apache
# Activar módulo
a2enmod rewrite

# Reescrituras simples
<Directory /var/www>
    RewriteEngine On
    
    # Redirigir HTTP a HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
    
    # Remover www
    RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
    RewriteRule ^(.*)$ http://%1/$1 [R=301,L]
    
    # Redirigir /old.html a /new.html
    RewriteRule ^old\.html$ new.html [L]
</Directory>
```

**Flags:**
- `[L]` = Last rule (detener procesamiento)
- `[R]` = Redirect (301, 302, 303, 307)
- `[NC]` = No case (insensible mayúsculas)


## Módulos de Multiprocesamiento (MPM)

Modelo de concurrencia Apache. **Solo uno activado** por Apache:

### prefork (Por defecto en mod_php)

```
Procesos separados (fork cada request)
├─ Padre
├─ Hijo 1 (request)
├─ Hijo 2 (request)
└─ Hijo 3 (request)

Ventajas:
- Estable, aislamiento proceso
- Compatible mod_php (thread-unsafe)

Desventajas:
- Alto overhead CPU/memoria
- Más lento con muchas conexiones
```

**Configuración:**
```apache
# /etc/apache2/mods-enabled/mpm_prefork.conf
<IfModule mpm_prefork_module>
    StartServers            10
    MinSpareServers         5
    MaxSpareServers         20
    MaxRequestWorkers       256
    MaxConnectionsPerChild  0
</IfModule>
```

### worker (Híbrido)

```
Procesos con threads (más eficiente)
├─ Proceso 1
│  ├─ Thread 1 (request)
│  ├─ Thread 2 (request)
│  └─ Thread 3 (request)
├─ Proceso 2
   └─ ...

Ventajas:
- Menor consumo memoria que prefork
- Más conexiones simultáneas

Desventajas:
- Incompatible mod_php (usa prefork)
- Más complejo debug
```

### event (Apache 2.4+, óptimo)

```
Procesos + threads + event loop
Ideal para proxy inverso y HTTP/2

Ventajas:
- Máximo rendimiento
- Bajo overhead
- Keep-Alive eficiente

Desventajas:
- Incompatible mod_php
- Solo Apache 2.4+
```

**Ver MPM actual:**
```bash
# Antes de instalación
apache2ctl -M | grep mpm

# Cambiar MPM
a2dismod mpm_prefork
a2enmod mpm_worker
systemctl restart apache2
```


## Módulos Útiles Adicionales

| Módulo | Propósito |
|--------|-----------|
| mod_ssl | HTTPS/TLS |
| mod_php | Ejecutar PHP (prefork) |
| mod_proxy | Proxy inverso |
| mod_security2 | WAF (firewall) |
| mod_headers | Modificar headers |
| mod_expires | Cache control |
| mod_deflate | Compresión gzip |


## Casos de Uso

### Cambiar a MPM worker (no mod_php)
```bash
a2dismod mpm_prefork
a2enmod mpm_worker
a2enmod php-fpm          # PHP via FPM, no mod_php
systemctl restart apache2
```

### Habilitar WebDAV + rewrite
```bash
a2enmod dav dav_fs rewrite
systemctl restart apache2
```


## Relaciones

### Conecta con
- [[apache|Apache]] — Servidor modular
- [[configuracion-apache|Configuración]] — Activación módulos
- [[aplicaciones-web-apache|Aplicaciones Web]] — mod_php, mod_wsgi
- [[https-apache|HTTPS]] — mod_ssl
- [[seguridad-apache|Seguridad]] — mod_security2


## Fuentes

- [Curso: Apache 2.4 (PLEDIN)](https://plataforma.josedomingo.org/pledin/cursos/apache24/)
- [Apache 2.4 Modules Index](https://httpd.apache.org/docs/2.4/mod/)
- [Apache 2.4 MPM Documentation](https://httpd.apache.org/docs/2.4/mpm.html)
- [mod_rewrite Guide](https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html)
- [mod_userdir](https://httpd.apache.org/docs/2.4/mod/mod_userdir.html)
- [mod_dav](https://httpd.apache.org/docs/2.4/mod/mod_dav.html)
