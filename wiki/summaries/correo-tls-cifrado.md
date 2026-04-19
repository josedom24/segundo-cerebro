---
title: TLS y Cifrado en Correo
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, postfix, tls, seguridad, cifrado]
---

# TLS y Cifrado en Correo

## Resumen de una línea
Configuración de cifrado TLS en Postfix para proteger transmisión de correos entre servidores y clientes.

## Criptografía en Correo

### Niveles

**1. Transporte (TLS):**
- Cifra la comunicación entre cliente-servidor
- Protege credenciales y contenido en tránsito
- **NO** protege cuerpo del correo almacenado

**2. Contenido (S/MIME, PGP):**
- Cifra el cuerpo del mensaje
- Requiere acción del usuario
- Protege incluso en servidor destino

## TLS Entre MTAs (Postfix ↔ Postfix)

### Modo Servidor (smtpd)

**Recibe correos en puerto 25 (MTA a MTA)**

**Configuración en `/etc/postfix/main.cf`:**
```
smtpd_tls_cert_file = /etc/ssl/certs/servidor.pem
smtpd_tls_key_file = /etc/ssl/private/servidor.key
smtpd_tls_security_level = may
smtpd_tls_session_cache_database = btree:${data_directory}/smtpd_scache
```

**Niveles de seguridad (smtpd_tls_security_level):**
- `none`: No usar TLS
- `may`: Ofrecer TLS, pero no obligatorio (por defecto)
- `encrypt`: Requiere TLS (algunos servidores viejos fallarán)
- `secure`: Requiere TLS + certificado válido

### Modo Cliente (smtp)

**Envía correos a otros MTAs en puerto 25**

**Configuración en `/etc/postfix/main.cf`:**
```
smtp_tls_CApath = /etc/ssl/certs
smtp_tls_security_level = may
smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache
```

**Niveles (smtp_tls_security_level):**
- `none`: No usar TLS
- `may`: Intentar TLS, continuar sin si falla
- `encrypt`: Requiere TLS
- `secure`: Requiere TLS + certificado válido de CA

### Problema: Certificados Autofirmados

El servidor lleva certificado autofirmado por defecto:
```
/etc/ssl/certs/ssl-cert-snakeoil.pem
/etc/ssl/private/ssl-cert-snakeoil.key
```

**Limitación:**
- Cliente no confía (sin firma de CA)
- Pueden aceptarlo (TLS débil) o rechazarlo
- Actualmente: mayoría lo acepta (may = optativo)

**Solución:** Certificado de CA confiable (Lets Encrypt)

## TLS con Clientes (IMAP, POP3, SMTP 587)

### IMAP con TLS

**STARTTLS (Puerto 143):**
```
Comienza en texto plano
STARTTLS (negocia cifrado)
Continúa cifrado
```

**IMAPS (Puerto 993):**
```
TLS desde el inicio (como HTTPS)
Más seguro
```

**Configuración Dovecot:**
```
# /etc/dovecot/conf.d/10-ssl.conf
ssl = required
ssl_cert = </etc/ssl/certs/certificado.pem
ssl_key = </etc/ssl/private/clave.pem

protocol imap {
  port = 993
}
```

### POP3 con TLS

Análogo a IMAP:
```
POP3 + STARTTLS: Puerto 110
POP3S: Puerto 995
```

### SMTP Autenticado (Puerto 587)

**En `/etc/postfix/main.cf`:**
```
# Obligar TLS para clientes
smtpd_tls_security_level = encrypt
smtpd_tls_auth_only = yes
```

- `smtpd_tls_security_level = encrypt`: TLS obligatorio
- `smtpd_tls_auth_only = yes`: Autenticación SOLO después de STARTTLS

## Certificados

### Generar Certificado Autofirmado

```bash
openssl req -x509 -newkey rsa:4096 -keyout clave.pem -out cert.pem -days 365
```

### Usar Lets Encrypt

```bash
certbot certonly --standalone -d mail.midominio.com
```

Crea:
```
/etc/letsencrypt/live/mail.midominio.com/
├── cert.pem
├── privkey.pem
└── fullchain.pem (incluye CA)
```

**En Postfix:**
```
smtpd_tls_cert_file = /etc/letsencrypt/live/mail.midominio.com/fullchain.pem
smtpd_tls_key_file = /etc/letsencrypt/live/mail.midominio.com/privkey.pem
```

## Validación

### Ver Certificado
```bash
openssl x509 -in /etc/ssl/certs/servidor.pem -text -noout
```

### Probar Conexión Segura
```bash
# IMAP + TLS
openssl s_client -connect mail.midominio.com:993

# SMTP + STARTTLS
openssl s_client -starttls smtp -connect mail.midominio.com:587
```

## Mejor Práctica

1. **Certificado válido:** Lets Encrypt (gratis)
2. **TLS en clientes:** Obligatorio (encrypt)
3. **STARTTLS:** May en MTA (compatible pero seguro)
4. **Puertos:** 993 (IMAPS), 995 (POP3S), 587 (SMTP)
5. **Renovación:** Verificar expiración de certificado

## Relaciones

### Conecta con
- [[postfix|Postfix]] — Servidor implementa TLS
- [[correo-envio-remoto|Envío Remoto]] — SMTP + STARTTLS
- [[correo-recepcion-remota|Recepción Remota]] — IMAP/POP3 + TLS
- [[tls|TLS]] — Protocolo de cifrado

## Fuentes
- [Postfix y Cifrado con TLS](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo4/tls.md) — Configuración detallada
