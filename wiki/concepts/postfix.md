---
title: Postfix
created: 2026-04-19
updated: 2026-04-19
sources: [correo-postfix-instalacion]
tags: [correo, smtp, mta]
---

# Postfix

## Definición
Postfix es un agente de transferencia de correo (MTA) que actúa como servidor de correo SMTP para recibir, enrutar y enviar correos electrónicos entre servidores y desde clientes.

## Resumen de una línea
Servidor de correo de código abierto que reemplaza a Sendmail con una arquitectura modular, segura y fácil de administrar.

## Conceptos Clave Fundamentales

### Componentes Principales
- **SMTP Server (smtpd):** Recibe correos de otros MTA o clientes
- **SMTP Client (smtp):** Envía correos a otros MTA
- **Local Delivery Agent (LDA):** Entrega correos al buzón local
- **Queue Manager:** Gestiona colas de correos
- **Main.cf:** Archivo principal de configuración

### Funciones Clave
- **Enrutamiento:** Determina a qué servidor enviar el correo
- **Validación:** Verifica destinatarios y remitentes
- **Autenticación:** SASL para SMTP autenticado
- **Cifrado:** TLS para conexiones seguras
- **Filtrado:** Integración con milters (DKIM, SpamAssassin)

## Arquitectura

### Modo como Servidor (smtpd)
- Otros MTA se conectan al puerto 25/tcp
- Recibe correos entrantes
- Pueden cifrar con STARTTLS
- Nivel de seguridad configurable

### Modo como Cliente (smtp)
- Postfix se conecta a otros MTA
- Envía correos salientes
- Intenta TLS opcional por defecto
- Reintentos inteligentes si falla

## Comparación con Alternativas

| Sistema | Ventajas | vs Postfix |
|---------|----------|-----------|
| **Sendmail** | Muy antiguo, universal | Postfix: modular, más seguro, fácil config |
| **Exim** | Flexible, potente | Postfix: simpler, menos overhead |
| **Qmail** | Seguridad diseño | Postfix: mantenimiento activo |

## Relaciones

### Conecta con
- [[spf|SPF (Sender Policy Framework)]] — Autenticación DNS
- [[dkim|DKIM]] — Firma digital de correos
- [[dmarc|DMARC]] — Política de autenticación y reportes
- [[tls|TLS]] — Cifrado de conexiones

### Parte de
- Infraestructura de correo empresarial
- Stack de servicios de internet

## Fuentes
- [Postfix Home Page](https://www.postfix.org/) — Documentación oficial
- [Curso Correo Electrónico - Postfix](../summaries/correo-postfix-instalacion.md) — Instalación y configuración
