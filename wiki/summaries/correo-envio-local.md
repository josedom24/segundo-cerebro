---
title: Envío Local de Correos
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, postfix, envio, local]
---

# Envío Local de Correos

## Resumen de una línea
Envío de correos entre usuarios del mismo servidor, sin salir a internet.

## Caso: Correo Entre Usuarios Locales

### Escenario
```
Usuario A (servidor.com)
    └─ SMTP (localhost:25)
    └─> Servidor Postfix
        └─ Entrega a buzón local
        └─> Usuario B (servidor.com)
```

### Configuración Necesaria

**En `/etc/postfix/main.cf`:**
```
mydomain = servidor.com
mydestination = localhost, localhost.localdomain, servidor.com
home_mailbox = Maildir/
```

- `mydomain`: Dominio local
- `mydestination`: Dominios que gestiona este servidor
- `home_mailbox`: Dónde se almacenan los correos (Maildir o mbox)

## Envío Local en Práctica

### Desde Terminal (usando mail/sendmail)
```bash
echo "Contenido del mensaje" | mail usuario@servidor.com
```

### Desde MUA (cliente de correo)
1. Configurar servidor SMTP: localhost:25
2. Configurar servidor POP3/IMAP: localhost:110 o 143
3. Usuario/contraseña: usuario del sistema
4. Enviar y recibir normalmente

## Almacenamiento

### Formato Maildir
```
~/Maildir/
├── cur/       # Mensajes leídos
├── new/       # Mensajes nuevos
└── tmp/       # Temporales
```
- Un archivo por correo
- Más seguro con acceso concurrente
- Mejor para IMAP

### Formato mbox
```
~/mbox
```
- Un archivo con todos los correos
- Formato tradicional
- Más lento con muchos correos

## Resolución de Problemas

### Correo no llega
1. Verificar que usuario existe: `id usuario`
2. Revisar log: `tail -f /var/log/mail.log`
3. Probar conexión SMTP local: `telnet localhost 25`

### Permisos de buzón
```bash
chmod 700 ~/Maildir
chmod 600 ~/Maildir/cur/*
```

## Relaciones

### Conecta con
- [[correo-conceptos-basicos|Conceptos de Correo Electrónico]] — MTA, MDA
- [[correo-postfix-instalacion|Instalación de Postfix]] — Configuración base
- [[correo-funcionamiento|Funcionamiento del Correo]] — Proceso de entrega

## Fuentes
- [Caso 1: Envío Local](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo3/caso1.md) — Detalles técnicos
