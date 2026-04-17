---
title: "Aplicaciones Web en Apache"
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [apache, aplicaciones, configuracion]
---

# Aplicaciones Web en Apache

## Resumen de una línea
Ejecutar aplicaciones dinámicas: mod_php (integrado, prefork), PHP-FPM (separado, worker), Python/WSGI, alternativas modernas.

## Información
- **Fuente:** Curso Apache 2.4 - Unidades 25-26
- **Módulos:** mod_php, mod_fcgid, mod_proxy_fcgi (para FPM)
- **URL:** https://plataforma.josedomingo.org/pledin/cursos/apache24/


## mod_php (Integrado)

PHP ejecutado dentro del proceso Apache (módulo):

```bash
# Instalar
apt install apache2 php libapache2-mod-php

# Configura automáticamente
# /etc/apache2/mods-available/php.conf
<FilesMatch ".+\.ph(p[3457]?|t|tml)$">
    SetHandler application/x-httpd-php
</FilesMatch>
```

**Características:**
- PHP corre en procesos Apache (www-data)
- `$_SERVER['PHP_SELF']` contiene path
- Acceso directo a ficheros (sin socket)
- Require MPM prefork (threads no compatibles)

**Ventajas:**
- Simple configuración
- Sin socket (rápido)
- Adecuado hosting compartido

**Desventajas:**
- MPM prefork solo (ineficiente)
- PHP con fallo mata proceso Apache
- Memoria por request (cada proceso duplica PHP)


## PHP-FPM (Recomendado)

PHP corre en proceso separado (FastCGI Process Manager):

```
Cliente → Apache → Socket/TCP → PHP-FPM
                     (proxy)
```

### Instalación

```bash
# Instalar FPM
apt install php-fpm

# Socket unix (recomendado)
# /run/php/php7.4-fpm.sock (escucha socket)

# O puerto TCP
# localhost:9000
```

### Configuración Apache

```apache
# Activar módulos
a2enmod proxy_fcgi
a2enmod setenvif

# /etc/apache2/sites-available/ejemplo.conf
<VirtualHost *:80>
    ServerName ejemplo.com
    DocumentRoot /var/www/ejemplo
    
    <FilesMatch ".+\.php$">
        SetHandler "proxy:unix:/run/php/php7.4-fpm.sock|fcgi://localhost"
    </FilesMatch>
</VirtualHost>
```

O con ProxyPassMatch:

```apache
<VirtualHost *:80>
    DocumentRoot /var/www/ejemplo
    
    ProxyPassMatch ^/(.+\.php)$ unix:/run/php/php7.4-fpm.sock|fcgi://localhost
</VirtualHost>
```

**Ventajas:**
- MPM worker/event posible (eficiente)
- PHP separado (fallo aislado)
- Múltiples versiones PHP simultáneas
- Escalable (múltiples FPM pools)

**Desventajas:**
- Configuración más compleja
- Socket/TCP overhead
- Requiere módulos proxy


## Configuración PHP

Directorios config PHP:

```bash
# Configuración global
/etc/php/7.4/cli/php.ini           # Línea de comandos
/etc/php/7.4/fpm/php.ini           # FPM
/etc/php/7.4/apache2/php.ini       # mod_php (si aplica)

# Extensiones
/etc/php/7.4/fpm/conf.d/           # Configuración adicional
/usr/lib/php/extensions/           # Módulos .so
```


## Python + WSGI

Python requiere servidor WSGI separado (como Flask, Django):

```bash
# Instalar herramientas
apt install python3 python3-venv

# Crear entorno virtual
python3 -m venv /opt/myapp
source /opt/myapp/bin/activate
pip install flask

# Crear app Flask
# /opt/myapp/app.py
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hola'

if __name__ == '__main__':
    app.run()
```

### Servir con Apache + gunicorn (WSGI server)

```bash
# Instalar gunicorn
pip install gunicorn

# Ejecutar en background
gunicorn -b 127.0.0.1:8000 app:app

# Systemd unit para auto-start
# /etc/systemd/system/myapp.service
[Unit]
Description=Flask App
After=network.target

[Service]
Type=notify
User=www-data
ExecStart=/opt/myapp/bin/gunicorn -b 127.0.0.1:8000 app:app
WorkingDirectory=/opt/myapp

[Install]
WantedBy=multi-user.target
```

### Configuración Apache (proxy)

```apache
# /etc/apache2/sites-available/ejemplo.conf
<VirtualHost *:80>
    ServerName ejemplo.com
    
    ProxyPass / http://127.0.0.1:8000/
    ProxyPassReverse / http://127.0.0.1:8000/
</VirtualHost>

# Habilitar módulos
a2enmod proxy_http
```


## Node.js / Express

Similar a Python, requiere servidor Node separado:

```bash
# Instalar Node
apt install nodejs npm

# Crear app Express
npm init
npm install express

# /opt/myapp/server.js
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hola Node'));
app.listen(3000);
```

### Configuración Apache

```apache
# Apache proxy a Node en puerto 3000
<VirtualHost *:80>
    ServerName ejemplo.com
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
```


## Comparación Métodos

| Método | Ventaja | Desventaja | MPM |
|--------|---------|-----------|-----|
| mod_php | Simple | Lento, inflexible | prefork |
| PHP-FPM | Eficiente, escalable | Config compleja | worker/event |
| Python + Gunicorn | Escalable, staging | Overhead proxy | any |
| Node.js | Moderno | Memoria | any |


## Relaciones

### Conecta con
- [[apache|Apache]] — Servidor web
- [[modulos-apache|Módulos]] — mod_php, mod_proxy_fcgi
- [[configuracion-apache|Configuración]] — SetHandler, ProxyPass


## Fuentes

- [Curso: Apache 2.4 (PLEDIN)](https://plataforma.josedomingo.org/pledin/cursos/apache24/)
- [Apache 2.4 mod_php](https://www.php.net/manual/en/security.apache.php)
- [PHP-FPM Official](https://www.php.net/manual/en/install.fpm.php)
- [Apache 2.4 mod_proxy](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html)
- [Gunicorn Documentation](https://gunicorn.org/)
- [Flask Deployment](https://flask.palletsprojects.com/deployment/)
