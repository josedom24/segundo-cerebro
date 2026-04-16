---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [apache, tls, https, seguridad, configuracion]
---

# HTTPS en Apache

## Resumen de una línea
Activar HTTPS: módulo mod_ssl, certificados (CAcert, Let's Encrypt), VirtualHost 443, TLS 1.2+, configuración cipher suites, redirecciones HTTP→HTTPS.

## Información
- **Fuente:** Curso Apache 2.4 - Unidades 27-29
- **Módulo:** mod_ssl
- **Certificados:** CAcert (educativo), Let's Encrypt (gratuito), CA comercial
- **URL:** https://plataforma.josedomingo.org/pledin/cursos/apache24/

---

## Módulo mod_ssl

Soporte HTTPS en Apache:

```bash
# Activar módulo
a2enmod ssl

# Puerto 443 debe estar habilitado en ports.conf
# Listen 443 ssl

# Reiniciar
systemctl restart apache2
```

---

## Obtener Certificado

### Opción 1: CAcert (Educativo)

Autoridad certificadora comunitaria (validez educativa):

```bash
# 1. Registrarse en https://www.cacert.org/
# 2. Verificar email
# 3. Agregar dominio (verificación por email/DNS/HTTP)
# 4. Generar certificado en web

# 5. Descargar
# - class1.crt (certificado)
# - key (clave privada)

# 6. Copiar a Apache
sudo cp class1.crt /etc/ssl/certs/cacert-server.crt
sudo cp key /etc/ssl/private/cacert-server.key
sudo chmod 600 /etc/ssl/private/cacert-server.key
```

**Limitación:** CAcert NO está preinstalado navegadores → aviso "certificado no confiable"

### Opción 2: Let's Encrypt (Gratuito, Recomendado)

Certificado gratuito, renovación automática, preinstalado navegadores:

```bash
# Instalar certbot
apt install certbot python3-certbot-apache

# Solicitar certificado (automático)
certbot certonly --webroot -w /var/www/html -d www.ejemplo.com

# Certbot valida control dominio:
# - Crea archivo temporal en /var/www/html/.well-known/acme-challenge/
# - Verifica acceso desde internet
# - Emite certificado (válido 90 días)

# Certificados en:
# /etc/letsencrypt/live/www.ejemplo.com/fullchain.pem
# /etc/letsencrypt/live/www.ejemplo.com/privkey.pem

# Renovación automática
certbot renew --dry-run    # Test
systemctl enable certbot.timer
```

### Opción 3: Generar Localmente (Testing)

Auto-signed (testing local, aviso navegador):

```bash
# Generar clave privada (2048 bits, sin contraseña)
openssl genrsa -out /etc/ssl/private/server.key 2048

# Generar certificado auto-firmado (válido 365 días)
openssl req -x509 -new -key /etc/ssl/private/server.key \
  -out /etc/ssl/certs/server.crt -days 365 \
  -subj "/C=ES/ST=Madrid/L=Madrid/O=Ejemplo/CN=www.ejemplo.local"

# Permisos
chmod 600 /etc/ssl/private/server.key
```

---

## Configuración VirtualHost HTTPS

```apache
# /etc/apache2/sites-available/ejemplo.conf
<VirtualHost *:443>
    ServerName www.ejemplo.com
    ServerAlias ejemplo.com
    DocumentRoot /var/www/ejemplo
    
    # Certificado
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/server.crt
    SSLCertificateKeyFile /etc/ssl/private/server.key
    SSLCertificateChainFile /etc/ssl/certs/ca-bundle.crt   # CA intermedia
    
    # Seguridad TLS
    SSLProtocol TLSv1.2 TLSv1.3                             # Solo TLS 1.2+
    SSLCipherSuite HIGH:!aNULL:!MD5                         # Ciphers fuertes
    SSLHonorCipherOrder on
    
    # HSTS (forzar HTTPS)
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/ejemplo-error.log
    CustomLog ${APACHE_LOG_DIR}/ejemplo-access.log combined
</VirtualHost>

# VirtualHost HTTP (redirigir a HTTPS)
<VirtualHost *:80>
    ServerName www.ejemplo.com
    Redirect permanent / https://www.ejemplo.com/
</VirtualHost>
```

---

## Directivas mod_ssl Importantes

```apache
# Activar SSL en VirtualHost
SSLEngine on

# Certificados
SSLCertificateFile /path/to/cert.crt
SSLCertificateKeyFile /path/to/key.key
SSLCertificateChainFile /path/to/chain.crt    # Intermedias (opcional)

# Protocolos (TLS)
SSLProtocol TLSv1.2 TLSv1.3
# Evitar: SSLv3, TLSv1.0, TLSv1.1 (inseguros)

# Cipher suites (algoritmos encriptación)
SSLCipherSuite HIGH:!aNULL:!MD5              # Strong
SSLHonorCipherOrder on                       # Servidor elige orden

# Session caching (rendimiento)
SSLSessionCache shmcb:/var/cache/apache2/ssl_scache(512000)
SSLSessionCacheTimeout 300

# OCSP Stapling (validación certificado)
SSLUseStapling on
SSLStaplingCache shmcb:/var/run/apache2/stapling_cache(128000)
```

---

## Verificar Configuración

```bash
# Sintaxis
apache2ctl -t
# Syntax OK

# Ver certificado
openssl x509 -in /etc/ssl/certs/server.crt -text -noout

# Ver fecha expiración
openssl x509 -in /etc/ssl/certs/server.crt -noout -dates
# notBefore=Apr 16 10:00:00 2024 GMT
# notAfter=Apr 16 10:00:00 2025 GMT

# Test SSL/TLS (desde cliente)
openssl s_client -connect www.ejemplo.com:443

# Test con curl
curl -v https://www.ejemplo.com/
# * subject: CN=www.ejemplo.com
# * issuer: O=CAcert
# * SSL certificate verify ok.

# Scan seguridad SSL (online)
# https://www.ssllabs.com/ssltest/
```

---

## HSTS (HTTP Strict-Transport-Security)

Forzar HTTPS en navegador cliente (sin pasar HTTP):

```apache
# Forzar HTTPS 1 año, incluir subdominios
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Con preload (browsers precargan sitio)
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
```

**Nota:** Preload registra tu sitio en navegadores para siempre usar HTTPS.

---

## Casos de Uso

### Servir HTTPS simple (Let's Encrypt)
```bash
certbot certonly --webroot -d www.ejemplo.com
# Editar VirtualHost con rutas Let's Encrypt
a2ensite ejemplo-ssl
systemctl reload apache2
```

### Redirigir HTTP → HTTPS
```apache
<VirtualHost *:80>
    ServerName www.ejemplo.com
    Redirect 301 / https://www.ejemplo.com/
</VirtualHost>
```

### Certificado con cadena (CA intermedia)
```apache
SSLCertificateFile /etc/ssl/certs/server.crt
SSLCertificateChainFile /etc/ssl/certs/ca-bundle.crt
SSLCertificateKeyFile /etc/ssl/private/server.key
```

---

## Relaciones

### Conecta con
- [[apache]] — Servidor web
- [[tls]] — Protocolo TLS/SSL base
- [[modulos-apache|Módulos]] — mod_ssl
- [[seguridad-apache|Seguridad]] — HSTS, cipher suites
- [[virtual-hosting-apache|Virtual Hosting]] — VirtualHost puerto 443

---

## Fuentes

- [Curso Apache 2.4 (PLEDIN)](https://plataforma.josedomingo.org/pledin/cursos/apache24/)
- [Apache 2.4 mod_ssl](https://httpd.apache.org/docs/2.4/mod/mod_ssl.html)
- [Apache 2.4 SSL/TLS Configuration](https://httpd.apache.org/docs/2.4/ssl/)
- [CAcert Community](http://www.cacert.org/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Certbot Documentation](https://certbot.eff.org/)
- [OWASP TLS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)
