---
title: Fundamentos de Correo Electrónico
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, protocolos]
---

# Fundamentos de Correo Electrónico

## Resumen de una línea
Agentes (MUA, MTA, MDA), protocolos (SMTP, POP3, IMAP) y el viaje de un correo de extremo a extremo.

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

## Viaje de un Correo Electrónico

### De Extremo a Extremo

```
Remitente (MUA)
    ↓ SMTP 587
Servidor A (MTA)
    ↓ DNS lookup MX
Servidor B (MTA)
    ↓ MDA (entrega)
Buzón del Receptor
    ↑ POP3/IMAP
Receptor (MUA)
```

**Pasos Detallados:**
1. Usuario A escribe en su MUA (Thunderbird, Outlook)
2. MUA conecta al servidor SMTP (puerto 587 con autenticación)
3. Servidor A examina destino: usuario@dominioB.com
4. Servidor A consulta DNS: ¿Qué MTA gestiona dominioB.com?
5. Servidor A se conecta a servidor B (puerto 25 SMTP)
6. Servidor B valida que usuario existe
7. MDA de servidor B entrega al buzón (`~/Maildir` o `~/mbox`)
8. Usuario B conecta por POP3/IMAP cuando quiere leer
9. Descarga (POP3) o sincroniza (IMAP)

### Reintento Automático

Si servidor destino no responde:
- Reintentos a intervalos: 5 min, 30 min, 1h, etc.
- Después de 5 días: rebota (devuelve al remitente con error)

## Direcciones de Correo

### Estructura
```
usuario@dominio.com
└─┬──┘ └────┬─────┘
  │         └─ Dominio (organización, servidor)
  └─ Usuario (buzón local o virtual)
```

### Usuarios Especiales
- `postmaster` — Cuenta **obligatoria** para administración del servidor
- `root` — Usuario administrador del sistema operativo
- `abuse` — Contacto para reportar correos de abuso
- `noreply` — Correos automatizados (no lee respuestas)

## Relaciones

### Conecta con
- [[correo-envio-a-internet|Envío de Correo con Postfix]] — SPF, DKIM, DMARC, autenticación
- [[correo-recepcion-desde-internet|Recepción de Correo con Postfix]] — MX, usuarios locales/virtuales

## Fuentes
- [Conceptos sobre Correo Electrónico](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo1/conceptos.md) — Definiciones técnicas
