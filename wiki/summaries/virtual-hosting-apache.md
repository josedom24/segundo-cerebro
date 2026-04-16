---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [apache, redes, configuracion]
---

# Virtual Hosting en Apache

## Resumen de una línea
Servir múltiples sitios en un servidor Apache: virtual hosting por nombre (NameVhost) o por IP, a2ensite/a2dissite, dominios en /var/www, logs separados por sitio.

## Información
- **Fuente:** Curso Apache 2.4 - Unidades 7-9
- **Ficheros:** /etc/apache2/sites-available/, /etc/apache2/sites-enabled/
- **URL:** https://plataforma.josedomingo.org/pledin/cursos/apache24/

---

## Virtual Hosting por Nombre (NameVhost)

Múltiples dominios en **una única IP**. Servidor identifica sitio por cabecera `Host`.

```apache
# /etc/apache2/sites-available/ejemplo1.conf
<VirtualHost *:80>
    ServerName www.ejemplo1.com
    ServerAlias ejemplo1.com *.ejemplo1.com      # Alias adicionales
    DocumentRoot /var/www/ejemplo1
    
    <Directory /var/www/ejemplo1>
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/ejemplo1-error.log
    CustomLog ${APACHE_LOG_DIR}/ejemplo1-access.log combined
</VirtualHost>

# /etc/apache2/sites-available/ejemplo2.conf
<VirtualHost *:80>
    ServerName www.ejemplo2.com
    ServerAlias ejemplo2.com
    DocumentRoot /var/www/ejemplo2
    # ... resto config
</VirtualHost>
```

**Ventajas:**
- Una IP para múltiples dominios
- Económico (hosting compartido)
- Fácil agregar/quitar sitios

**Limitación:**
- HTTPS requiere SNI (Server Name Indication) → TLS 1.2+
- Navegadores antiguos pueden problemas

---

## Virtual Hosting por IP

Cada dominio en **IP diferente**. Identifica sitio por IP:

```apache
<VirtualHost 192.168.1.10:80>
    ServerName www.ejemplo1.com
    DocumentRoot /var/www/ejemplo1
</VirtualHost>

<VirtualHost 192.168.1.11:80>
    ServerName www.ejemplo2.com
    DocumentRoot /var/www/ejemplo2
</VirtualHost>
```

**Desventajas:**
- Costoso (varias IPs)
- Menos común modernamente
- HTTPS simple (sin SNI)

---

## Gestión de Sitios: a2ensite / a2dissite

Apache usa **enlaces simbólicos** para activar/desactivar sitios:

```bash
# sites-available/ = definiciones disponibles
# sites-enabled/   = enlaces activos (usar estos)

# Activar sitio (crea enlace simbólico)
a2ensite ejemplo1.conf
# Output: Enabling site ejemplo1...

# Desactivar sitio (borra enlace)
a2dissite ejemplo1.conf
# Output: Disabling site ejemplo1...

# Listar sitios habilitados
apache2ctl -S
# VirtualHost configuration:
# *:80  www.ejemplo1.com (/etc/apache2/sites-enabled/ejemplo1.conf:1)
# *:80  www.ejemplo2.com (/etc/apache2/sites-enabled/ejemplo2.conf:1)

# Recargar tras cambiar sitios
systemctl reload apache2
```

---

## Estructura de Directorios

Recomendación: cada sitio en subdirectorio de `/var/www/`:

```
/var/www/
├── ejemplo1/
│   ├── index.html
│   ├── css/
│   └── js/
├── ejemplo2/
│   ├── index.html
│   └── ...
└── default/
    └── index.html
```

---

## Sitio Default

Cuando no coincide Host header con ningún VirtualHost, Apache sirve el **default** (primer VirtualHost definido o el puerto).

```apache
# Evitar información servidor:
<VirtualHost *:80>
    ServerName localhost
    DocumentRoot /var/www/default
    # Retorna 403 Forbidden
</VirtualHost>
```

---

## Acceso a Sitios Virtuales

Desde cliente:

```bash
# Si DNS resuelve ejemplo1.com a IP servidor
curl http://www.ejemplo1.com/
# Navegador → HTTP request con Host: www.ejemplo1.com
# Apache → Busca VirtualHost coincidente → DocumentRoot /var/www/ejemplo1

# Si no tiene DNS, usar header Host local
curl -H "Host: www.ejemplo1.com" http://192.168.1.10/
```

---

## Logs por Sitio

Cada VirtualHost puede tener logs separados:

```apache
<VirtualHost *:80>
    ServerName www.ejemplo1.com
    ErrorLog ${APACHE_LOG_DIR}/ejemplo1-error.log
    CustomLog ${APACHE_LOG_DIR}/ejemplo1-access.log combined
</VirtualHost>
```

Análisis:
```bash
# Logs ejemplo1
tail -f /var/log/apache2/ejemplo1-access.log

# Estadísticas
grep "GET" /var/log/apache2/ejemplo1-access.log | wc -l
```

---

## Relaciones

### Conecta con
- [[apache]] — Servidor web base
- [[configuracion-apache|Configuración]] — Ficheros .conf VirtualHost
- [[https-apache|HTTPS]] — VirtualHost en puerto 443
- [[redes]] — Concepto multi-IP vs multi-dominio

### Conceptos relacionados
- [[service]] — Kubernetes Services vs Apache VirtualHosts

---

## Fuentes

- [Curso Apache 2.4 (PLEDIN)](https://plataforma.josedomingo.org/pledin/cursos/apache24/)
- [Apache 2.4 VirtualHosts Guide](https://httpd.apache.org/docs/2.4/vhosts/)
- [Apache 2.4 NameVhost](https://httpd.apache.org/docs/2.4/vhosts/name-based.html)
- [Apache 2.4 IP-based VirtualHosts](https://httpd.apache.org/docs/2.4/vhosts/ip-based.html)
