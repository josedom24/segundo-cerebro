---
title: Clientes Remotos - POP3, IMAP y SMTP 587
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, protocolos, autenticacion, tls]
---

# Clientes Remotos - POP3, IMAP y SMTP 587

## Resumen de una línea
Configuración de POP3/IMAP para recepción remota y SMTP 587 autenticado para envío desde clientes.

## POP3 - Descarga Completa

### Características
- **Descarga:** Copia todos los correos al cliente
- **Almacenamiento:** Después descargar, elimina del servidor (configurable)
- **Acceso:** Un solo dispositivo
- **Puertos:** 110 (sin cifrado), **995 (TLS recomendado)**

### Flujo
1. Cliente conecta
2. Autentica usuario/contraseña
3. Descarga correos
4. Marca para borrar
5. Servidor elimina

### Configuración Cliente
```
Servidor POP3: mail.midominio.com
Puerto: 995 (con TLS)
Usuario: usuario
Borrar del servidor: después de X días
```

## IMAP - Sincronización Remota

### Características
- **Sincronización:** Estado sincronizado servidor ↔ cliente
- **Múltiples dispositivos:** Acceso desde varios clientes
- **Almacenamiento:** Correos en servidor
- **Carpetas:** Gestión remota
- **Puertos:** 143 (sin cifrado), **993 (IMAPS recomendado)**

### Flujo
1. Cliente conecta
2. Autentica
3. Sincroniza estado
4. Descarga bajo demanda
5. Cambios reflejados en todos los clientes

### Configuración Cliente
```
Servidor IMAP: mail.midominio.com
Puerto: 993 (con IMAPS)
Usuario: usuario
Mantener en servidor: siempre
```

## POP3 vs IMAP

| Aspecto | POP3 | IMAP |
|--------|------|------|
| **Descarga** | Local completa | Remoto sincronizado |
| **Múltiples dispositivos** | No | Sí |
| **Ancho de banda** | Alto inicial | Continuo |
| **Almacenamiento** | Todo en cliente | Configurable |
| **Offline** | Sí | No |

## SMTP Autenticado (Puerto 587)

### Para Clientes
**Puerto 587 + STARTTLS** (recomendado)

**Configuración en `/etc/postfix/main.cf`:**
```
smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, defer_unauth_destination
smtpd_sasl_auth_enable = yes
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_tls_security_level = encrypt
smtpd_tls_auth_only = yes
```

### En Cliente
```
Servidor SMTP: mail.midominio.com
Puerto: 587
Seguridad: STARTTLS
Usuario: usuario@midominio.com
Contraseña: password
```

## Dovecot - Backend POP3/IMAP

### Instalación
```bash
apt-get install dovecot-core dovecot-imapd dovecot-pop3d
```

### Configuración Básica
```
# Ubicación buzones
mail_location = maildir:~/Maildir

# TLS obligatorio
ssl = required
ssl_cert = </etc/ssl/certs/certificado.pem
ssl_key = </etc/ssl/private/clave.pem
```

### SASL para Postfix
```
# /etc/dovecot/conf.d/10-master.conf
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0660
    user = postfix
    group = postfix
  }
}
```

## TLS - Cifrado en Transporte

### Puertos Seguros
- **993:** IMAPS (TLS desde inicio)
- **995:** POP3S (TLS desde inicio)
- **587:** SMTP + STARTTLS (TLS negociado)

### Certificados
**Generar autofirmado (test):**
```bash
openssl req -x509 -newkey rsa:4096 -out cert.pem -keyout key.pem -days 365
```

**Lets Encrypt (producción):**
```bash
certbot certonly --standalone -d mail.midominio.com
```

## Mejor Práctica

1. **Certificado válido:** Lets Encrypt
2. **IMAPS (993) o IMAP+STARTTLS (143):** Ambos cifrados
3. **SMTP 587:** STARTTLS obligatorio
4. **POP3:** Evitar (IMAP superior)
5. **Dovecot:** Backend para POP3/IMAP

## Relaciones

### Conecta con
- [[correo-conceptos-basicos|Conceptos de Correo Electrónico]] — Protocolos
- [[correo-postfix-instalacion|Instalación de Postfix]] — Backend
- [[postfix|Postfix]] — Servidor MTA
- [[tls|TLS]] — Cifrado transporte

## Fuentes
- [Curso: Gestión del Correo desde Clientes](https://github.com/josedom24/curso_correo_electronico_ies/tree/main/modulo4) — POP3, IMAP, SMTP, TLS
