---
title: Envío Remoto de Correos
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, smtp, autenticacion, clientes]
---

# Envío Remoto de Correos

## Resumen de una línea
Configuración de SMTP autenticado para que clientes remotos envíen correos a través del servidor.

## Caso: Envío desde Cliente Remoto

### Escenario
```
Cliente de correo (usuario@midominio.com)
    │
    └─ SMTP (puerto 587 o 25)
    └─> Servidor Postfix (midominio.com)
        └─> SMTP 25
        └─> Servidor destino
            └─> Entrega al receptor
```

## SMTP para Clientes

### Puertos

| Puerto | Protocolo | Usar |
|--------|-----------|------|
| **25** | SMTP sin cifrado | NO (solo entre servidores) |
| **587** | SMTP + STARTTLS | ✅ SÍ (clientes autenticados) |
| **465** | SMTPS (SSL puro) | ✅ SÍ (alternativa) |

**Recomendación:** Puerto 587 con STARTTLS

### Diferencia con Puerto 25

**Puerto 25 (MTA a MTA):**
- Sin autenticación
- Solo para servidores
- Aceptar correo de cualquier origen

**Puerto 587 (Clientes):**
- Requiere autenticación (SASL)
- Usuario/contraseña
- Solo clientes autenticados

## Configuración Postfix

### Habilitar Autenticación SASL

**En `/etc/postfix/main.cf`:**
```
# Puerta de entrada para clientes
smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, defer_unauth_destination

# SASL
smtpd_sasl_auth_enable = yes
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth

# TLS (recomendado)
smtpd_tls_security_level = may
smtpd_use_tls = yes
smtpd_tls_cert_file = /etc/ssl/certs/certificado.pem
smtpd_tls_key_file = /etc/ssl/private/clave.pem
```

### Configurar Dovecot para SASL

**En `/etc/dovecot/conf.d/10-master.conf`:**
```
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0660
    user = postfix
    group = postfix
  }
}
```

### Reiniciar Servicios
```bash
systemctl restart postfix dovecot
```

## Configuración Cliente

### En MUA (Thunderbird, Outlook, etc.)

**Configuración de salida (SMTP):**
```
Servidor SMTP: mail.midominio.com
Puerto: 587
Seguridad: STARTTLS
Usuario: usuario@midominio.com
Contraseña: password
Autenticación: SASL/LOGIN
```

### Verificación

```bash
# Probar SMTP con autenticación
telnet mail.midominio.com 587
EHLO mail.midominio.com
AUTH LOGIN
[Base64 de usuario y contraseña]
```

## Seguridad

### STARTTLS vs SMTPS

**STARTTLS (Puerto 587):**
- Comienza en texto plano
- Negocia TLS si cliente lo soporta
- Mayor compatibilidad

**SMTPS (Puerto 465):**
- TLS desde el inicio
- Similar a HTTPS
- Más seguro pero menos compatible

### Mejor Práctica

1. **Puerto 587 + STARTTLS:** Recomendado
2. **TLS obligatorio:** `smtpd_tls_security_level = encrypt`
3. **Certificado válido:** De CA confiable (Lets Encrypt)
4. **Contraseña segura:** Política de complejidad

## Limitaciones

### Relay Abierto (SPAM)

Si configurado incorrectamente, cualquiera puede usarlo:
```
telnet mail.midominio.com 25
MAIL FROM: <spammer@spam.com>
RCPT TO: <victima@otro.com>
```

**Prevención:**
- Autenticación obligatoria para clientes
- Restricción de relay: `smtpd_relay_restrictions`
- Solo relajar si necesario

## Relaciones

### Conecta con
- [[correo-conceptos-basicos|Conceptos de Correo Electrónico]] — SMTP
- [[correo-postfix-instalacion|Instalación de Postfix]] — Configuración base
- [[correo-tls-cifrado|TLS en Correo]] — Cifrado STARTTLS

## Fuentes
- [Caso 5: Envío Remoto](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo4/caso5.md) — SMTP autenticado
