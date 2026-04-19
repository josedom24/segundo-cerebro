---
title: Recepción de Correos desde Internet
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, dns, configuracion]
---

# Recepción de Correos desde Internet

## Resumen de una línea
Configuración de Postfix para recibir correos externos: registros MX en DNS y gestión de usuarios.

## Caso: Correo Desde Internet al Servidor

### Escenario
```
Usuario externo@yahoo.com
    └─ SMTP → Servidor Yahoo
        └─ DNS lookup: ¿dónde va usuario@midominio.com?
        └─ SMTP 25 → Servidor Postfix (midominio.com)
            └─ Valida usuario
            └─ Entrega a buzón
            └─> Usuario local
```

## Requisitos de DNS

### Registro MX (Mail eXchange)

```
midominio.com MX 10 mail.midominio.com
midominio.com MX 20 mail2.midominio.com (secundario)
```

- **Prioridad baja (10):** Servidor primario
- **Prioridad alta (20):** Servidor secundario (si primario cae)
- **Orden:** El DNS resuelve en orden de prioridad

### Registro A (Dirección)

```
mail.midominio.com A 192.0.2.1
```

El servidor MX apunta a una máquina con registro A.

## Configuración Postfix

### Aceptar Correos Externos

**En `/etc/postfix/main.cf`:**
```
mydomain = midominio.com
mydestination = localhost, localhost.localdomain, midominio.com

# Usuarios que acepta
local_recipient_maps = unix:passwd.byname $alias_maps
```

- `mydestination`: Dominios para los que recibe correo
- `local_recipient_maps`: Dónde buscar usuarios válidos

### Permitir Conexiones

**En `/etc/postfix/main.cf`:**
```
inet_interfaces = all
mynetworks = 127.0.0.1/8, 192.0.2.0/24
smtpd_recipient_restrictions = ...
```

## Validación de Usuarios

### Usuarios Locales del Sistema

Postfix valida contra `/etc/passwd`:
```bash
grep usuario /etc/passwd
```

Correo se entrega en:
```
~usuario/Maildir/  (si home_mailbox = Maildir/)
~usuario/mbox      (si home_mailbox = mbox)
```

### Usuarios Virtuales

Para usuarios sin cuenta del sistema, usar:
```
/etc/postfix/virtual
usuario@midominio.com otrouser
```

Activar:
```bash
postmap /etc/postfix/virtual
```

Configurar en main.cf:
```
virtual_alias_maps = hash:/etc/postfix/virtual
```

## Resolución de Problemas

### Correos no llegan
1. Verificar DNS: `dig MX midominio.com`
2. Revisar log: `tail -f /var/log/mail.log`
3. Probar conexión: `telnet mail.midominio.com 25`

### Usuario no encontrado
```
550 5.1.1 <usuario@midominio.com>: Recipient rejected
```
→ Usuario no existe en local_recipient_maps

### Relay denunciado
Si no restringe relays, cualquiera puede usarlo de spam.

## Relaciones

### Conecta con
- [[correo-conceptos-basicos|Conceptos de Correo Electrónico]] — DNS, MX
- [[correo-postfix-instalacion|Instalación de Postfix]] — Configuración base
- [[correo-alias-redirecciones|Alias y Redirecciones]] — Usuarios virtuales

## Fuentes
- [Caso 3: Recibir desde Internet](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo3/caso3.md) — Configuración completa
