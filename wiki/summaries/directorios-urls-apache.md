---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [apache, configuracion, http]
---

# Directorios y URLs en Apache

## Resumen de una línea
Gestión de directorios y URLs: Options, Alias, Redirect, negociación contenido, índices, páginas error personalizadas.

## Información
- **Fuente:** Curso Apache 2.4 - Unidades 10-14
- **Directivas:** Options, Alias, Redirect, DirectoryIndex, ErrorDocument
- **URL:** https://plataforma.josedomingo.org/pledin/cursos/apache24/

---

## Opciones de Directorio (Repaso)

```apache
<Directory /var/www/>
    Options Indexes FollowSymLinks
</Directory>
```

Opciones disponibles:
- `Indexes` — Listar directorio si no hay index
- `FollowSymLinks` — Seguir enlaces simbólicos
- `MultiViews` — Negociación contenido
- `ExecCGI` — Ejecutar scripts CGI
- `Includes` — Server-side includes (mod_include)
- `IncludesNOEXEC` — Includes sin exec

Combinar con `+`/`-`:
```apache
<Directory /var/www/docs>
    Options -Indexes                    # No listar directorio
    Options +MultiViews                 # Activar negociación
</Directory>
```

---

## Alias: Mapeo URL → Directorio

`Alias` mapea path URL a directorio diferente sin cambiar DocumentRoot:

```apache
# Mapeo simple
Alias /descargas /home/usuario/descargas
# URL: /descargas/archivo.zip
# Fichero: /home/usuario/descargas/archivo.zip

# Importante: Dar permisos en Directory también
<Directory /home/usuario/descargas>
    Options Indexes
    Require all granted
</Directory>

# Alias con final /
Alias /docs/ /usr/share/doc/
# URL: /docs/apache2/
# Fichero: /usr/share/doc/apache2/
```

Diferencia con DocumentRoot:
```
DocumentRoot:  / → /var/www/
Alias:         /descargas → /home/usuario/descargas
               /static → /opt/assets/
```

---

## Redirect: Redirecciones

Redirigir URLs (cliente sigue redirect, ve nueva URL):

```apache
# Redirigir temporal (302)
Redirect /vieja.html http://www.ejemplo.com/nueva.html

# Redirigir permanente (301)
Redirect permanent /vieja.html http://www.ejemplo.com/nueva.html

# Redirigir temporalmente (307 preserva método)
Redirect temporary /vieja.html http://www.ejemplo.com/nueva.html

# Redirigir directorio
Redirect /viejo/ http://www.nuevo.com/

# Con patrón regex (usa RedirectMatch)
RedirectMatch permanent ^/articulos/(.*)\.html$ /blog/$1/
# /articulos/post1.html → /blog/post1/
```

**Códigos HTTP:**
- 301 (Moved Permanently) — Permanente, actualiza bookmarks
- 302 (Found) — Temporal, no cambiar bookmarks
- 307 (Temporary Redirect) — Temporal, preserva método HTTP

---

## DirectoryIndex: Fichero Índice Default

```apache
# Apache busca en orden estos ficheros si accede directorio
DirectoryIndex index.html index.htm index.php

# URL: /blog/
# Busca: /var/www/blog/index.html (si existe)
#        /var/www/blog/index.htm
#        /var/www/blog/index.php
# Si ninguno, lista directorio (si Options Indexes)
```

---

## Negociación de Contenido

Apache elige formato según preferencias cliente (Accept headers):

```apache
# Activar negociación
<Directory /var/www/docs>
    Options MultiViews
</Directory>

# Ficheros disponibles:
# documento.html
# documento.pdf
# documento.txt

# Cliente solicita:
# GET /documento HTTP/1.1
# Accept: application/pdf, text/html;q=0.9

# Apache responde: documento.pdf (preferencia cliente)

# Con type map (configuración explícita):
# documento.var (fichero especial que lista variantes)
```

---

## Páginas de Error Personalizadas

Mostrar página custom en lugar de error genérico:

```apache
# Errores globales
ErrorDocument 404 /pagina-no-encontrada.html
ErrorDocument 500 "Error interno del servidor"
ErrorDocument 403 /acceso-denegado.html

# En VirtualHost:
<VirtualHost *:80>
    ServerName ejemplo.com
    ErrorDocument 404 /404.html
    ErrorDocument 500 /500.html
</VirtualHost>

# Mostrar fichero: ErrorDocument 404 /404.html
# Mostrar texto: ErrorDocument 404 "Página no encontrada"
# Ejecutar CGI: ErrorDocument 404 /cgi-bin/error.pl

# Fichero /404.html:
<html>
    <h1>404 - Página no encontrada</h1>
    <p>Lo sentimos, la página solicitada no existe.</p>
</html>
```

---

## Orden Búsqueda Ficheros

Cuando cliente solicita URL, Apache busca:

```
1. DocumentRoot (o Alias si aplica)
2. FollowSymLinks (si activado, sigue enlaces)
3. MultiViews (si activado, negocia contenido)
4. DirectoryIndex (si directorio, busca index)
5. Indexes (si Options Indexes, lista directorio)
6. ErrorDocument (si error, muestra página error)
```

---

## Casos de Uso

### Servir archivos estáticos desde ubicación alternativa
```apache
Alias /assets /opt/web/assets
<Directory /opt/web/assets>
    Options -Indexes
    Require all granted
</Directory>
```

### Redirigir dominio antiguo
```apache
<VirtualHost *:80>
    ServerName viejo.com
    Redirect permanent / http://nuevo.com/
</VirtualHost>
```

### Página error 404 con información útil
```apache
ErrorDocument 404 /404.html

# /404.html contiene:
# - Sugerencias de búsqueda
# - Enlaces a secciones principales
# - Contacto support
```

---

## Relaciones

### Conecta con
- [[apache]] — Servidor base
- [[configuracion-apache|Configuración]] — Directivas Apache
- [[http]] — Códigos redirección, negociación contenido
- [[modulos-apache|Módulos]] — mod_negotiation, mod_dir

---

## Fuentes

- [Apache 2.4 Directory, Files Directives](https://httpd.apache.org/docs/2.4/mod/core.html#directory)
- [Apache 2.4 Alias](https://httpd.apache.org/docs/2.4/mod/mod_alias.html)
- [Apache 2.4 Redirect](https://httpd.apache.org/docs/2.4/mod/mod_alias.html#redirect)
- [Apache 2.4 Content Negotiation](https://httpd.apache.org/docs/2.4/content-negotiation.html)
- Curso Apache 2.4 (PLEDIN)
