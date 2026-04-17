---
title: "Proxy Inverso y Análisis de Logs en Apache"
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [apache, redes, configuracion, automatizacion]
---

# Proxy Inverso y Análisis de Logs en Apache

## Resumen de una línea
Proxy inverso con mod_proxy: enrutamiento a servidores backend, balanceo carga; análisis logs con AWStats: estadísticas visitantes, tráfico, navegadores.

## Información
- **Fuente:** Curso Apache 2.4 - Unidades 32-33
- **Módulos:** mod_proxy, mod_proxy_http, mod_proxy_fcgi, mod_proxy_wstunnel
- **Herramienta:** AWStats (análisis logs)
- **URL:** https://plataforma.josedomingo.org/pledin/cursos/apache24/


## Proxy Inverso (mod_proxy)

Reenviar peticiones a servidor backend (oculta servidor real):

```
Cliente → Apache (Proxy) → Backend Server
         (80, 443)         (localhost:8000)
```

### Activar Módulo

```bash
a2enmod proxy
a2enmod proxy_http         # Para HTTP/HTTPS
a2enmod proxy_fcgi         # Para FastCGI (PHP-FPM)
a2enmod proxy_wstunnel     # Para WebSocket

systemctl restart apache2
```

### ProxyPass Básico

Reenviar requests a servidor backend:

```apache
# /etc/apache2/sites-available/ejemplo.conf
<VirtualHost *:80>
    ServerName www.ejemplo.com
    DocumentRoot /var/www/html
    
    # Reenviar /app a localhost:8000
    ProxyPass /app http://localhost:8000/
    ProxyPassReverse /app http://localhost:8000/
</VirtualHost>
```

**Diferencia:**
- `ProxyPass` — Reenviar request al backend
- `ProxyPassReverse` — Reescribir response headers (Location, Set-Cookie)

### Ejemplos Proxy

```apache
# Proxy a API Node.js
ProxyPass /api http://localhost:3000/
ProxyPassReverse /api http://localhost:3000/

# Proxy a Django
ProxyPass / http://127.0.0.1:8000/
ProxyPassReverse / http://127.0.0.1:8000/

# Proxy a Gunicorn (FPM)
ProxyPass / unix:/run/php/php7.4-fpm.sock|fcgi://localhost/

# Proxy a Kubernetes (via LoadBalancer)
ProxyPass / http://10.0.0.50:8080/
ProxyPassReverse / http://10.0.0.50:8080/

# Proxy a HTTPS backend
ProxyPass / https://backend.interno:443/
SSLProxyEngine on                                    # Habilitar SSL
SSLProxyVerify none                                 # No verificar cert
```


## Balanceo de Carga

Distribuir tráfico entre múltiples backends:

```apache
# Activar módulo
a2enmod proxy_balancer
a2enmod lbmethod_byrequests        # Balanceo por requests

<Proxy balancer://mycluster>
    BalancerMember http://backend1.local:8000
    BalancerMember http://backend2.local:8000
    BalancerMember http://backend3.local:8000
    ProxySet lbmethod=byrequests   # Round-robin
</Proxy>

ProxyPass / balancer://mycluster/
ProxyPassReverse / balancer://mycluster/
```

**Métodos balanceo:**
- `byrequests` — Round-robin (distribuye requests)
- `bytraffic` — Por volumen datos
- `bybusyness` — Por conexiones activas


## Headers Proxy

Información servidor original conservada:

```apache
# Conservar IP cliente original
ProxyPreserveHost On

# Headers custom
RequestHeader set X-Forwarded-For "%{REMOTE_ADDR}s"
RequestHeader set X-Forwarded-Proto "http"

# Backend ve:
# X-Forwarded-For: 192.168.1.100 (IP cliente)
# X-Forwarded-Proto: http (protocolo original)
```


## Casos de Uso Proxy

### API Gateway (agregar seguridad)
```apache
# Apache en puerto 80/443 (público)
# Backend API en puerto 8000 (privado)

<VirtualHost *:443>
    ServerName api.ejemplo.com
    SSLEngine on
    SSLCertificateFile ...
    
    # Proxy a API
    ProxyPass / http://localhost:8000/
    ProxyPassReverse / http://localhost:8000/
    
    # Seguridad
    Require all granted
    <Directory /api>
        Require ip 10.0.0.0/8
    </Directory>
</VirtualHost>
```

### Agregar HTTPS a HTTP backend
```apache
# Backend corre HTTP (localhost:3000)
# Apache agrega HTTPS (público)

<VirtualHost *:443>
    SSLEngine on
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```


## AWStats: Análisis de Logs

Herramienta para generar estadísticas desde logs Apache:

```bash
# Instalar
apt install awstats

# Copiar config default
cp /etc/awstats/awstats.model.conf /etc/awstats/awstats.ejemplo.conf

# Editar
nano /etc/awstats/awstats.ejemplo.conf
# LogFile="/var/log/apache2/ejemplo-access.log"
# SiteDomain="www.ejemplo.com"
# HostAliases="ejemplo.com localhost"
```

### Generar Estadísticas

```bash
# Procesar logs (crear/actualizar BD)
/usr/lib/cgi-bin/awstats.pl -update -config=ejemplo

# Salida
# LibGeoIP2 not installed. Not using Geo information.
# AWStats Database directory: /var/lib/awstats/
# Processed 234 lines in access log
```

### Servir AWStats en Web

```apache
# Activar CGI para AWStats
a2enmod cgi

# VirtualHost
<VirtualHost *:80>
    ServerName stats.ejemplo.com
    
    Alias /awstatsclasses "/usr/share/awstats/lib/"
    Alias /awstats-icon "/usr/share/awstats/icon/"
    ScriptAlias /awstats "/usr/lib/cgi-bin/"
    
    <Directory /usr/lib/cgi-bin/>
        AllowOverride None
        Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
        Require all granted
    </Directory>
</VirtualHost>

# Acceder: http://stats.ejemplo.com/cgi-bin/awstats.pl?config=ejemplo
```

### Estadísticas en AWStats

- **Resumen visitantes:** Número único IPs, navegadores
- **Top 10 páginas:** /index.html, /contact.html
- **Métodos HTTP:** GET, POST, DELETE
- **Códigos estado:** 200 OK, 404 Not Found, 500 Error
- **Referer:** Sitios que envían tráfico
- **Robot/Bots:** Google, Bing, Yandex
- **Tráfico:** Bytes entrada/salida
- **Búsquedas:** Palabras clave búsqueda


## Logrotate: Rotación de Logs

Rotación automática logs cada semana/mes:

```bash
# Configuración
# /etc/logrotate.d/apache2
/var/log/apache2/*.log {
    weekly                                         # Cada semana
    missingok                                      # OK si no existe
    rotate 12                                      # Mantener 12 backups
    compress                                       # Comprimir (.gz)
    delaycompress                                  # Esperar 1 rotación para comprimir
    notifempty                                     # No rotar si vacío
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /etc/apache2/envvars ]; then \
            . /etc/apache2/envvars; \
        fi
        if [ -f /var/run/apache2.pid ]; then \
            /etc/init.d/apache2 reload > /dev/null 2>&1; \
        fi
    endscript
}

# Test
logrotate -d /etc/logrotate.d/apache2
```


## Análisis Manual Logs

```bash
# Ver últimas líneas
tail -f /var/log/apache2/access.log

# Contar requests por IP
awk '{print $1}' /var/log/apache2/access.log | sort | uniq -c | sort -rn | head -10

# Status codes
awk '{print $9}' /var/log/apache2/access.log | sort | uniq -c | sort -rn

# Requests GET vs POST
awk '{print $6}' /var/log/apache2/access.log | sort | uniq -c

# Páginas más solicitadas
awk '{print $7}' /var/log/apache2/access.log | sort | uniq -c | sort -rn | head -10

# Errores 4xx/5xx
grep " 4[0-9][0-9] " /var/log/apache2/access.log
grep " 5[0-9][0-9] " /var/log/apache2/access.log

# Intentos login (POST /login)
grep "POST /login" /var/log/apache2/access.log | wc -l

# Tiempos respuesta lentos (>1000ms)
awk '$NF > 1000 {print $7, $NF}' /var/log/apache2/access.log | sort -k2 -rn
```


## Relaciones

### Conecta con
- [[apache|Apache]] — Servidor web
- [[modulos-apache|Módulos en Apache]] — mod_proxy, mod_proxy_http
- redes — Concepto proxy, balanceo carga
- [[seguridad-apache|Seguridad en Apache]] — Logs análisis


## Fuentes

- [Curso: Apache 2.4 (PLEDIN)](https://plataforma.josedomingo.org/pledin/cursos/apache24/)
- [Apache 2.4 mod_proxy](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html)
- [Apache 2.4 mod_proxy_balancer](https://httpd.apache.org/docs/2.4/mod/mod_proxy_balancer.html)
- [AWStats Official](https://awstats.sourceforge.io/)
- [Logrotate Manual](https://linux.die.net/man/8/logrotate)
