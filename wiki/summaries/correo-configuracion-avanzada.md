---
title: Configuración Avanzada de Postfix
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, postfix, configuracion, seguridad]
---

# Configuración Avanzada de Postfix

## Resumen de una línea
Alias, redirecciones, usuarios virtuales, filtrado de spam y listas negras en Postfix.

## Alias y Redirecciones

### Alias del Sistema
**Archivo:** `/etc/aliases`
```
postmaster: root
noreply: /dev/null
gerentes: gerente1, gerente2, gerente3
```

Compilar con: `newaliases`

### Usuarios Virtuales
**Archivo:** `/etc/postfix/virtual`
```
info@midominio.com usuario_real
soporte@midominio.com usuario1, usuario2
@midominio.com usuario_por_defecto
```

Activar:
```bash
postmap /etc/postfix/virtual
# En main.cf:
virtual_alias_maps = hash:/etc/postfix/virtual
virtual_alias_domains = midominio.com
```

## Filtrado de Spam

### Listas Negras (DNSBL)
Consultar listas públicas de IPs que envían spam.

**En `/etc/postfix/main.cf`:**
```
smtpd_recipient_restrictions =
    permit_mynetworks,
    permit_sasl_authenticated,
    reject_rbl_client zen.spamhaus.org,
    reject_rbl_client blacklist.otro.com,
    permit_dnswl_client whitelist.local,
    reject_unauth_destination
```

**Proveedores:**
- Spamhaus SBL
- DNSBL.info
- MXToolbox

### Límites de Velocidad
```
smtpd_client_connection_rate_limit = 10
smtpd_client_message_rate_limit = 5
```

### SpamAssassin (Milter)
Integración con filtro de contenido:
```
smtpd_milters = inet:localhost:10025
non_smtpd_milters = inet:localhost:10025
```

## Validación de Dominio

Rechazar correos de dominios inválidos:
```
reject_invalid_helo_hostname
reject_non_fqdn_helo_hostname
reject_non_fqdn_sender
```

## Casos Prácticos

### Postmaster Automático
```
/etc/aliases: postmaster: root
```
Correos a postmaster van a administrador.

### Distribución a Grupo
```
/etc/postfix/virtual:
soporte@midominio.com user1, user2, user3
```
Se entrega a múltiples usuarios.

## Relaciones

### Conecta con
- [[postfix|Postfix]] — Servidor MTA
- [[correo-postfix-instalacion|Instalación de Postfix]] — Setup base
- [[correo-recepcion-desde-internet|Recepción desde Internet]] — MX y usuarios

## Fuentes
- [Curso: Gestión del Correo](https://github.com/josedom24/curso_correo_electronico_ies/tree/main/modulo3) — Alias, spam, seguridad
