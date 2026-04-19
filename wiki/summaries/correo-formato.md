---
title: Formato de Correos Electrónicos
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, formato, estructura]
---

# Formato de Correos Electrónicos

## Resumen de una línea
Estructura técnica de un correo electrónico: cabeceras, cuerpo y MIME para multipart.

## Estructura Base

### Partes de un Correo

```
Cabeceras (headers)
─ Línea en blanco (separador)
Cuerpo (body)
```

## Cabeceras Comunes

### Cabeceras Esenciales
- **From:** Remitente (usuario@dominio)
- **To:** Destinatario principal
- **Cc:** Copia carbón (visible para todos)
- **Bcc:** Copia carbón oculta (invisible para otros)
- **Subject:** Asunto del mensaje
- **Date:** Fecha/hora de envío

### Cabeceras Técnicas
- **Message-ID:** Identificador único del correo
- **In-Reply-To:** ID del correo anterior (en threads)
- **References:** Cadena de referencias previas
- **Return-Path:** Dirección para rebotes
- **Received:** Traza de servidores por los que pasó

### Cabeceras de Contenido
- **Content-Type:** Tipo MIME (text/plain, text/html, etc.)
- **Content-Transfer-Encoding:** Codificación (7bit, 8bit, quoted-printable, base64)
- **Content-Disposition:** Inline o attachment

## Cuerpo

### Texto Plano
```
Contenido simple en ASCII de 7 bits
Máximo simplicidad
```

### HTML
- Mensaje formateado (colores, fuentes, imágenes)
- Se incluye como alternativa junto con texto plano
- Riesgo de seguridad (scripts, phishing)

## MIME (Multipurpose Internet Mail Extensions)

Permite correos con múltiples partes:

### Estructura Multipart
```
--boundary123
Content-Type: text/plain
Versión texto del mensaje
--boundary123
Content-Type: text/html
<html>Versión HTML...</html>
--boundary123
Content-Type: image/png; name="foto.png"
Content-Transfer-Encoding: base64
[datos binarios en base64]
--boundary123--
```

**Boundary:** Separador único entre partes

### Tipos MIME Comunes
- `text/plain` — Texto simple
- `text/html` — HTML formateado
- `image/*` — Imágenes (png, jpg, gif)
- `application/pdf` — PDF
- `application/octet-stream` — Binario genérico

## Codificación de Caracteres

### En Cabeceras
- ASCII original (7 bits)
- Caracteres especiales: `=?UTF-8?B?base64?=`

### En Cuerpo
- **Quoted-Printable:** Texto legible, caracteres especiales escapados
- **Base64:** Cualquier dato binario, overhead ~33%

## Relaciones

### Conecta con
- [[correo-conceptos-basicos|Conceptos de Correo Electrónico]] — Protocolos
- [[correo-funcionamiento|Funcionamiento del Correo Electrónico]] — Transmisión

## Fuentes
- [Formato de Correos Electrónicos](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo1/formato.md) — Especificación técnica
