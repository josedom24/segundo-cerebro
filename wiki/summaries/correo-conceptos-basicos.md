---
title: Conceptos de Correo Electrónico
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, conceptos, protocolos]
---

# Conceptos de Correo Electrónico

## Resumen de una línea
Agentes y protocolos que intervienen en el envío y recepción de correos: MUA, MTA, MDA, SMTP, POP3, IMAP.

## Agentes de Correo

### MUA (Mail User Agent)
**Cliente de correo** que permite al usuario leer y escribir mensajes.
- Ejemplos: Outlook, Thunderbird, Gmail
- Función: Interfaz entre usuario y servidor
- Usa: SMTP (envío), POP3/IMAP (recepción)

### MTA (Mail Transfer Agent)
**Servidor de correo** que transfiere mensajes entre máquinas usando SMTP.
- Ejemplos: Postfix, Sendmail, Exim
- Función: Enrutamiento y entrega entre servidores
- Un mensaje puede pasar por varios MTA
- Usa: SMTP protocolo

### MDA (Mail Delivery Agent)
**Agente de entrega** que entrega el correo al buzón del usuario.
- Función: Almacenar correos en buzón destino
- Puede ser:
  - **Local (LDA):** En el servidor local
  - **Remoto:** Via POP3/IMAP al cliente

## Protocolos

### SMTP (Simple Mail Transfer Protocol)
**Protocolo de transferencia simple de correo** para intercambio de mensajes.
- Puerto: 25 (entre servidores), 587 (clientes autenticados)
- Función: Envío de correos
- Mejora: ESMTP (Simple Mail Transfer Protocol Extendido)

### POP3 (Post Office Protocol v3)
**Protocolo para recuperar correos** desde servidor al cliente.
- Puerto: 110 (sin cifrado), 995 (TLS)
- Característica: **Descarga todos los correos**
- Comportamiento: Elimina mensajes del servidor tras descargar (configurable)
- Uso: Acceso simple, descarga completa

### IMAP (Internet Message Access Protocol)
**Protocolo para acceso a mensajes** en internet.
- Puerto: 143 (sin cifrado), 993 (TLS)
- Característica: **Sincroniza estado** entre servidor y cliente
- Comportamiento: Mantiene correos en servidor
- Uso: Acceso múltiple dispositivos, bandeja centralizada

## Diferencias: POP3 vs IMAP

| Aspecto | POP3 | IMAP |
|--------|------|------|
| **Acceso** | Descarga local | Acceso remoto |
| **Dispositivos** | Uno | Múltiples |
| **Estado** | Local | Sincronizado |
| **Bandeja** | Cliente | Servidor |
| **Offline** | Sí (después descarga) | No (necesita conexión) |

## Relaciones

### Conecta con
- [[correo-funcionamiento|Funcionamiento del Correo Electrónico]] — Viaje de un email
- [[correo-formato|Formato de Correos Electrónicos]] — Estructura técnica

## Fuentes
- [Conceptos sobre Correo Electrónico](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo1/conceptos.md) — Definiciones técnicas
