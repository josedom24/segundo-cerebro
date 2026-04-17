---
title: "Autenticación en Apache"
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [apache, seguridad, autenticacion, configuracion]
---

# Autenticación en Apache

## Resumen de una línea
Control acceso por autenticación: directiva Require, autenticación básica (HTTP Basic Auth), digest, políticas complejas, archivo .htaccess.

## Información
- **Fuente:** Curso Apache 2.4 - Unidades 15-19
- **Módulos:** mod_authz_core (Require), mod_auth_basic, mod_auth_digest, mod_access_compat (obsoleto)
- **URL:** https://plataforma.josedomingo.org/pledin/cursos/apache24/


## Directiva Require (Autorización)

Control de acceso a recursos. Versión Apache 2.4 (no 2.2):

```apache
# Acceso público
Require all granted

# Acceso denegado
Require all denied

# Solo usuarios autenticados
Require valid-user

# Usuarios específicos
Require user juan maria

# Grupo específico
Require group admin

# IP específica
Require ip 10.0.0.0/8 192.168.1.0/24

# Hosts específicos
Require host www.ejemplo.com

# Localhost solo
Require local

# Negación (NOT)
Require not ip 192.168.1.100
```


## Combinaciones Lógicas

`RequireAll`, `RequireAny`, `RequireNone` para lógica compleja:

```apache
# AND (todos deben cumplirse)
<RequireAll>
    Require method GET POST
    Require ip 192.168.1.0/24
</RequireAll>
# Solo GET/POST desde red interna

# OR (al menos uno)
<RequireAny>
    Require ip 192.168.1.0/24
    Require user admin
</RequireAny>
# Acceso desde red interna O usuario admin

# Negación
<RequireNone>
    Require ip 192.168.1.100
</RequireNone>
# Denegar IP 192.168.1.100
```


## Autenticación Básica (HTTP Basic Auth)

Usuario/contraseña en Base64 (poco seguro sin HTTPS):

```apache
<Directory /var/www/privado>
    AuthType Basic
    AuthName "Área Privada"              # Mensaje en popup navegador
    AuthUserFile /etc/apache2/.htpasswd  # Fichero usuarios
    Require valid-user
</Directory>
```

### Crear archivo .htpasswd

```bash
# Crear con primer usuario
htpasswd -c /etc/apache2/.htpasswd juan
# New password: ****
# Re-type password: ****

# Agregar usuario (sin -c para no sobrescribir)
htpasswd /etc/apache2/.htpasswd maria

# Ver contenido
cat /etc/apache2/.htpasswd
# juan:$apr1$ABC123...
# maria:$apr1$XYZ456...

# Eliminar usuario
htpasswd -D /etc/apache2/.htpasswd juan
```


## Autenticación Digest

Más segura (hash contraseña, no Base64):

```apache
<Directory /var/www/privado>
    AuthType Digest
    AuthName "Área Privada"
    AuthUserFile /etc/apache2/.htdigest
    Require valid-user
</Directory>
```

### Crear archivo .htdigest

```bash
# Crear usuario (AuthName debe coincidir)
htdigest -c /etc/apache2/.htdigest "Área Privada" juan
# Adding password for juan in realm Área Privada.
# New password: ****
# Re-type password: ****

# Agregar usuario
htdigest /etc/apache2/.htdigest "Área Privada" maria
```


## Archivo .htaccess

Permite sobrescribir directivas en fichero `.htaccess` en directorio (sin reiniciar Apache):

```bash
# /var/www/privado/.htaccess
AuthType Basic
AuthName "Privado"
AuthUserFile /var/www/privado/.htpasswd
Require valid-user

# Solo en contexto Directory si AllowOverride AuthConfig
<Directory /var/www/privado>
    AllowOverride AuthConfig
</Directory>
```

**Ventajas:**
- Sin reiniciar Apache
- Usuario puede gestionar sin acceso root
- Distribuido en directorios

**Desventajas:**
- Menos eficiente (busca .htaccess en cada request)
- AllowOverride None más seguro


## Combinación Autenticación + Require

```apache
<Directory /var/www/secreto>
    # Primero: autenticación
    AuthType Basic
    AuthName "Zona Secreta"
    AuthUserFile /etc/apache2/.htpasswd
    
    # Luego: autorización (usuario debe estar + ser admin)
    <RequireAll>
        Require valid-user
        Require group admin
    </RequireAll>
</Directory>
```


## Migración Apache 2.2 → 2.4

**Antiguo (2.2 - Obsoleto):**
```apache
Allow from 192.168.1.0/24
Deny from all
Order allow,deny
```

**Nuevo (2.4 - Usar):**
```apache
Require ip 192.168.1.0/24
```


## Casos de Uso

### Área privada basic auth
```apache
<Directory /var/www/admin>
    AuthType Basic
    AuthName "Admin Only"
    AuthUserFile /etc/apache2/.htpasswd
    Require user admin
</Directory>
```

### Acceso solo red interna
```apache
<Directory /var/www/intranet>
    Require ip 192.168.0.0/16
</Directory>
```

### Múltiples condiciones
```apache
<Directory /var/www/datos>
    AuthType Basic
    AuthName "Datos Empresa"
    AuthUserFile /etc/apache2/.htpasswd
    
    <RequireAll>
        Require valid-user
        Require ip 192.168.0.0/16
    </RequireAll>
    # Solo usuarios autenticados desde red interna
</Directory>
```


## Relaciones

### Conecta con
- [[apache|Apache]] — Servidor web
- seguridad — Control acceso, autenticación
- [[configuracion-apache|Configuración de Apache]] — Directivas Apache
- [[tls|TLS]] — HTTPS recomendado con autenticación basic


## Fuentes

- [Curso: Apache 2.4 (PLEDIN)](https://plataforma.josedomingo.org/pledin/cursos/apache24/)
- [Apache 2.4 mod_authz_core (Require)](https://httpd.apache.org/docs/2.4/mod/mod_authz_core.html)
- [Apache 2.4 mod_auth_basic](https://httpd.apache.org/docs/2.4/mod/mod_auth_basic.html)
- [Apache 2.4 mod_auth_digest](https://httpd.apache.org/docs/2.4/mod/mod_auth_digest.html)
- [Apache 2.4 .htaccess](https://httpd.apache.org/docs/2.4/howto/htaccess.html)
