---
title: "Seguridad en Apache"
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [apache, seguridad]
---

# Seguridad en Apache

## Resumen de una línea
Hardening Apache: mod_security2 (WAF), ocultación version, control de acceso, headers seguridad, permisos ficheros, monitoreo logs.

## Información
- **Fuente:** Curso Apache 2.4 - Unidades 30-31
- **Módulo:** mod_security2 (WAF)
- **Herramientas:** apache2ctl, awstats, logwatch
- **URL:** https://plataforma.josedomingo.org/pledin/cursos/apache24/


## mod_security2 (Web Application Firewall)

Firewall de aplicación web: detecta/bloquea ataques HTTP (SQL injection, XSS, etc.):

```bash
# Instalar
apt install libapache2-mod-security2

# Activar módulo
a2enmod security2

# Copiar config recomendada
cd /etc/modsecurity
mv modsecurity.conf-recommended modsecurity.conf

# Reiniciar
systemctl restart apache2

# Audit log
tail -f /var/log/apache2/modsec_audit.log
```

### Configuración mod_security2

```apache
# /etc/modsecurity/modsecurity.conf
SecRuleEngine DetectionOnly          # DetectionOnly, On, Off

# Tamaño máximo request body
SecRequestBodyLimit 134217728        # 128MB
SecRequestBodyNoFilesLimit 1048576   # 1MB (sin uploads)
SecRequestBodyInMemoryLimit 131072   # 128KB (caché RAM)

# Respuesta
SecResponseBodyAccess On             # Loguear respuesta
SecResponseBodyLimit 524288          # Limitar log respuesta

# Audit logging
SecAuditEngine On
SecAuditLog /var/log/apache2/modsec_audit.log
SecAuditLogParts ABIJDEFHZ           # Qué partes loguear
```

### Reglas mod_security2

```apache
# Regla básica: bloquear User-Agent específico
SecRule REQUEST_HEADERS:User-Agent "@contains BadBot" \
    "id:1000,phase:1,deny,log,msg:'Bad bot'"

# Bloquear POST sin Content-Type
SecRule REQUEST_METHOD "@streq POST" \
    "!@contains REQUEST_HEADERS:Content-Type" \
    "id:1001,phase:1,deny,log,msg:'POST without Content-Type'"

# Ejemplo cargado: Core Rule Set (CRS)
# /usr/share/modsecurity-crs/rules/
# - REQUEST-901-INITIALIZATION.conf
# - REQUEST-911-METHOD-ENFORCEMENT.conf
# - REQUEST-920-PROTOCOL-ENFORCEMENT.conf
# - REQUEST-930-APPLICATION-ATTACK-LFI.conf
# - REQUEST-931-APPLICATION-ATTACK-RFI.conf
# - REQUEST-932-APPLICATION-ATTACK-RCE.conf
# - REQUEST-933-APPLICATION-ATTACK-PHP.conf
# - REQUEST-941-APPLICATION-ATTACK-XSS.conf
# - REQUEST-942-APPLICATION-ATTACK-SQLI.conf
```


## Ocultación Información Servidor

Ocultar versión Apache (evita ataques dirigidos):

```apache
# /etc/apache2/conf-available/security.conf
ServerTokens Prod              # Mostrar solo "Apache"
ServerSignature Off            # No mostrar version en error pages

# Remover headers específicos
<IfModule mod_headers.c>
    Header always unset "X-Powered-By"
    Header unset "X-Aspnet-Version"
    Header unset "X-AspNet-Version"
</IfModule>

# Resultado (antes):
# Server: Apache/2.4.41 (Ubuntu)

# Resultado (después):
# Server: Apache
```


## Control de Acceso Fuerte

```apache
# Denegar acceso general, luego permitir específico
<Directory /var/www>
    Require all denied
</Directory>

<Directory /var/www/public>
    Require all granted
</Directory>

# Proteger archivos sensibles
<FilesMatch "^\.ht">
    Require all denied
</FilesMatch>

<FilesMatch "\.php$">
    Require all denied                  # Deshabilitar PHP en upload
</FilesMatch>
```


## Headers de Seguridad

Adicionar headers HTTPS para protección navegador:

```apache
<IfModule mod_headers.c>
    # Prevenir clickjacking
    Header always set X-Frame-Options "SAMEORIGIN"
    
    # Prevenir MIME sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Activar XSS filter navegador
    Header always set X-XSS-Protection "1; mode=block"
    
    # Política referrer
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Content Security Policy (CSP)
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'"
    
    # HSTS (forzar HTTPS)
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
```


## Permisos Ficheros

```bash
# Propietario Apache
chown -R www-data:www-data /var/www/ejemplo

# Directorios: 755 (rwxr-xr-x)
find /var/www/ejemplo -type d -exec chmod 755 {} \;

# Ficheros: 644 (rw-r--r--)
find /var/www/ejemplo -type f -exec chmod 644 {} \;

# Ficheros ejecutables: 755
chmod 755 /var/www/ejemplo/cgi-bin/*.pl

# Proteger .htpasswd
chmod 600 /etc/apache2/.htpasswd

# Archivos sensibles: 600 (solo propietario)
chmod 600 /etc/apache2/.htpasswd
chmod 600 /etc/ssl/private/server.key
```


## Desabilitar Características Innecesarias

```apache
# Deshabilitar listado directorios
<Directory /var/www>
    Options -Indexes
</Directory>

# Deshabilitar CGI
<Directory /var/www>
    Options -ExecCGI
</Directory>

# Deshabilitar .htaccess (más rápido)
<Directory /var/www>
    AllowOverride None
</Directory>

# Limitar métodos HTTP
<Directory /var/www>
    Require method GET POST HEAD
</Directory>
```


## Logging Seguro

```apache
# Log detallado (debugging)
LogLevel warn
# Niveles: debug, info, notice, warn, error, crit, alert, emerg

# Log con info seguridad
<IfModule mod_logio.c>
    CustomLog ${APACHE_LOG_DIR}/access.log "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\" %D"
    # %D = microsegundos request
</IfModule>

# Rotar logs
# /etc/logrotate.d/apache2
/var/log/apache2/*.log {
    weekly
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        systemctl reload apache2 > /dev/null 2>&1 || true
    endscript
}
```


## Monitoreo

```bash
# Análisis logs en tiempo real
tail -f /var/log/apache2/access.log | grep "GET.*php" | awk '{print $1}' | sort | uniq -c | sort -rn
# Detecta requests PHP sospechosas

# Búsqueda errores
grep -i error /var/log/apache2/error.log | tail -20

# Intentos acceso denegado
grep "403" /var/log/apache2/access.log

# IPs sospechosas (múltiples 404)
awk '$9 == 404 {print $1}' /var/log/apache2/access.log | sort | uniq -c | sort -rn | head -10
```


## Checklist de Seguridad

```
□ Apache actualizado (apt upgrade)
□ mod_security2 instalado y activo
□ ServerTokens = Prod
□ ServerSignature = Off
□ .htpasswd con permisos 600
□ Clave privada con permisos 600
□ HTTPS activado (TLS 1.2+)
□ HSTS header activo
□ Directorios: 755, ficheros: 644
□ Logs monitoreados
□ AllowOverride = None (si no necesario)
□ Options -Indexes en directorios públicos
□ Métodos HTTP limitados (GET, POST, HEAD)
□ Antivirus/WAF activos
```


## Relaciones

### Conecta con
- [[apache|Apache]] — Servidor web
- [[https-apache|HTTPS]] — Headers seguridad HSTS
- [[tls|TLS]] — Cifrado transporte
- [[autenticacion-apache|Autenticación]] — Control acceso
- linux — Permisos ficheros, monitoreo


## Fuentes

- [Curso: Apache 2.4 (PLEDIN)](https://plataforma.josedomingo.org/pledin/cursos/apache24/)
- [Apache 2.4 Security Tips](https://httpd.apache.org/docs/2.4/misc/security_tips.html)
- [mod_security](https://www.modsecurity.org/)
- [OWASP Apache Hardening](https://owasp.org/www-project-integration-standards/writeups/owasp_apache_hardening_guide)
- [CIS Apache Benchmark](https://www.cisecurity.org/)
