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

## Configuración Básica

### Parámetros Esenciales

**Identidad del servidor:**
```
myhostname = servidor.midominio.com
mydomain = midominio.com
```

**Usuarios locales:**
```
myorigin = midominio.com
mydestination = localhost, localhost.localdomain, servidor.midominio.com
```

**Redes permitidas:**
```
mynetworks = 127.0.0.1/8, [::1]/128
```

**Almacén de correos:**
```
home_mailbox = Maildir/
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
