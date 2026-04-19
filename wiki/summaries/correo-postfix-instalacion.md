---
title: Instalación y Configuración de Postfix
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, postfix, instalacion, configuracion]
---

# Instalación y Configuración de Postfix

## Resumen de una línea
Instalación del servidor Postfix en Linux y configuración básica de parámetros esenciales.

## Postfix - Introducción

Postfix es un MTA (agente de transferencia de correo) modular, seguro y fácil de administrar que reemplaza a Sendmail.

**Características:**
- Arquitectura modular (procesos separados)
- Más seguro que Sendmail
- Configuración clara en `/etc/postfix/main.cf`
- Estándar en muchas distribuciones

## Instalación en Linux

### Debian/Ubuntu

```bash
apt-get update
apt-get install postfix
```

Durante instalación elige configuración:
- **Internet Site:** Configuración completa (recomendada)
- **Internet with smarthost:** Usa otro servidor
- **Satellite system:** Reenviador hacia otro servidor
- **Local only:** Solo correo local

### Archivo de Configuración

**Ubicación:** `/etc/postfix/main.cf`

Esta es la configuración principal que controla todo el comportamiento.

## Instalación - Opciones

Durante `apt install postfix` se pregunta:

**Tipo de servidor:**
- **Internet Site** (recomendado) — Recibe/envía directamente
- Internet with smarthost — Usa otro servidor
- Satellite system — Reenviador
- Local only — Solo correo local

**Mailname:** Dominio (se guarda en `/etc/mailname`)

## Configuración Básica (`/etc/postfix/main.cf`)

### Identidad del Servidor
```
myhostname = mail.midominio.com
mydomain = midominio.com
myorigin = midominio.com  # Dominio que usa para envío
```

### Dominios Locales
```
mydestination = localhost, localhost.localdomain, midominio.com
  # Dominios para los que recibe correo
```

### Dominios Reenviados
```
relay_domains = dominio2.com, dominio3.com
  # Dominios cuyo correo reenviará (relay)
```

### Redes y Acceso
```
mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128
  # IPs desde las que puede enviar correo
```

### Almacén de Correos
```
home_mailbox = Maildir/
  # Formato Maildir (moderno, escalable)
  # Alternativa: mbox (tradicional, un archivo por usuario)
```

### Servicios Postfix

```bash
systemctl start postfix
systemctl enable postfix
systemctl status postfix
```

## Validación

### Verificar Configuración
```bash
postfix check
```

### Ver Configuración Actual
```bash
postconf -n
```

### Log de Errores
```bash
tail -f /var/log/mail.log
```

## Relaciones

### Conecta con
- [[postfix|Postfix]] — Concepto del servidor
- [[correo-envio-local|Envío Local de Correos]] — Casos de uso
- [[correo-envio-a-internet|Envío a Internet]] — Configuración avanzada

## Fuentes
- [Postfix](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo2/postfix.md) — Descripción del MTA
- [Instalación y Configuración Básica](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo2/instalacion.md) — Paso a paso
