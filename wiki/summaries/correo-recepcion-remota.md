---
title: Recepción Remota de Correos
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, protocolos, autenticacion, tls]
---

# Recepción Remota de Correos

## Resumen de una línea
Configuración de servidores POP3 e IMAP para que clientes remotos descarguen o sincronicen correos.

## Caso: Correo desde Cliente Remoto

### Escenario
```
Servidor Postfix (correos almacenados en buzón)
    ↑
    │ POP3 (110) o IMAP (143)
    │
Cliente de correo (Outlook, Thunderbird, Gmail)
```

## POP3 (Post Office Protocol v3)

### Características
- **Descarga completa:** Copia todos los correos al cliente
- **Almacenamiento:** Después de descargar, elimina del servidor (configurable)
- **Acceso:** Solo un dispositivo
- **Simplicidad:** Protocolo simple y ligero

### Puertos
- **110:** Sin cifrado (obsoleto, no usar)
- **995:** TLS (RECOMENDADO)

### Flujo POP3

```
1. Cliente conecta puerto 110/995
2. Autentica usuario/contraseña
3. Lista correos en buzón
4. Descarga cada correo
5. Marca para borrar (DELE)
6. Cierra conexión
7. Servidor elimina marcados
```

### Configuración Cliente

**En Thunderbird/Outlook:**
```
Servidor POP3: mail.midominio.com
Puerto: 995 (con TLS)
Usuario: usuario
Contraseña: password
Borrar del servidor: después de X días
```

## IMAP (Internet Message Access Protocol)

### Características
- **Sincronización:** Estado sincronizado entre servidor y cliente
- **Múltiples dispositivos:** Acceso desde varios clientes
- **Almacenamiento:** Correos permanecen en servidor
- **Carpetas:** Gestión de carpetas remotas

### Puertos
- **143:** Sin cifrado (obsoleto, no usar)
- **993:** IMAPS con TLS (RECOMENDADO)

### Flujo IMAP

```
1. Cliente conecta puerto 143/993
2. Autentica usuario/contraseña
3. Lista carpetas
4. Sincroniza estado de correos
5. Descarga bajo demanda
6. Mantiene sincronización
7. Los cambios se reflejan en todos los clientes
```

### Configuración Cliente

**En Thunderbird/Outlook:**
```
Servidor IMAP: mail.midominio.com
Puerto: 993 (con IMAPS)
Usuario: usuario
Contraseña: password
Mantener en servidor: siempre
```

## POP3 vs IMAP

| Aspecto | POP3 | IMAP |
|--------|------|------|
| **Acceso** | Descarga local | Remoto sincronizado |
| **Múltiples dispositivos** | No | Sí |
| **Ancho de banda** | Alto inicial, bajo después | Continuo pero selectivo |
| **Almacenamiento cliente** | Todos los correos | Configurable |
| **Offline** | Sí (después descarga) | No |
| **Complejidad** | Baja | Media |

## Instalación Dovecot (POP3 + IMAP)

### En Debian/Ubuntu
```bash
apt-get install dovecot-core dovecot-imapd dovecot-pop3d
systemctl start dovecot
systemctl enable dovecot
```

### Configuración Básica
```
# /etc/dovecot/conf.d/10-mail.conf
mail_location = maildir:~/Maildir

# /etc/dovecot/conf.d/10-ssl.conf
ssl = required
ssl_cert = </etc/ssl/certs/certificado.pem
ssl_key = </etc/ssl/private/clave.pem
```

### Verificar
```bash
systemctl status dovecot
telnet localhost 143  # IMAP
telnet localhost 110  # POP3
```

## Relaciones

### Conecta con
- [[correo-conceptos-basicos|Conceptos de Correo Electrónico]] — Protocolos POP3/IMAP
- [[correo-postfix-instalacion|Instalación de Postfix]] — Backend de almacenamiento
- [[correo-tls-cifrado|TLS en Correo]] — Cifrado de sesiones

## Fuentes
- [Caso 4: Recepción Remota](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo4/caso4.md) — POP3 e IMAP detallado
