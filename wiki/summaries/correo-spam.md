---
title: Filtrado de Spam en Correo
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, postfix, spam, seguridad]
---

# Filtrado de Spam en Correo

## Resumen de una línea
Técnicas para reducir spam en el servidor de correo: listas negras, filtros y validaciones.

## Problema: Spam

El correo no solicitado es una plaga:
- **Volumen:** Mayoría del correo mundial es spam
- **Impacto:** Ancho de banda, almacenamiento, tiempo
- **Peligro:** Malware, phishing, suplantación

## Soluciones a Nivel MTA

### Listas Negras (DNSBL)

**Principio:** Consultar listas públicas de IPs que envían spam

**Proveedores:**
- [Spamhaus SBL](http://www.spamhaus.org)
- [DNSBL.info](https://www.dnsbl.info)
- [MXToolbox](https://mxtoolbox.com/blacklists.aspx)

**Configuración Postfix:**
```
smtpd_recipient_restrictions =
    permit_mynetworks,
    permit_sasl_authenticated,
    reject_rbl_client zen.spamhaus.org,
    reject_rbl_client blacklist.otro.com,
    permit_dnswl_client whitelist.local,
    reject_unauth_destination
```

**Cómo funciona:**
1. Correo llega de IP X
2. Postfix consulta: X está en lista negra?
3. Sí → Rechazar; No → Aceptar

### Validación de Dominio

**SPF:** ¿IP autorizada por dominio remitente?
```
reject_invalid_helo_hostname,
reject_non_fqdn_helo_hostname,
reject_non_fqdn_sender,
```

**Consecuencia:** Reduce spam "fácil" de fuentes sin SPF

### Límites de Velocidad

```
smtpd_client_connection_rate_limit = 10
smtpd_client_message_rate_limit = 5
```

Rechaza conexiones con demasiados mensajes por segundo.

## Soluciones a Nivel Cliente

### SpamAssassin

Filtro de contenido que analiza:
- Palabras clave ("Viagra", "Click here", etc.)
- URLs sospechosas
- Autenticación DKIM/SPF
- Patrón de envío
- Archivos adjuntos peligrosos

**Resultado:** Puntuación de spam (0-10+)

### Integración Postfix + SpamAssassin

```
smtpd_milters = inet:localhost:10025
non_smtpd_milters = inet:localhost:10025
```

SpamAssassin actúa como "filtro de correo" (milter).

## Mejores Prácticas

### Servidor
1. **Mantener listas negras actualizadas**
2. **Validar SPF/DKIM/DMARC** en entrada
3. **Publicar propias políticas** SPF/DKIM/DMARC
4. **Monitorear IP limpia** (no en listas negras)

### Usuario
1. **No responder a spam** (confirma que dirección es válida)
2. **No hacer click** en enlaces sospechosos
3. **Usar filtros del cliente** (Gmail, Outlook, etc.)
4. **Reportar correos sospechosos**

## Estadísticas

- **80%+ del correo mundial es spam**
- **Descargas:** 1.4 billones de emails spam/día
- **Coste:** Pérdida de productividad, energía, almacenamiento

## Limitaciones

No hay solución 100%:
- **Falsos positivos:** Correo legítimo marcado como spam
- **Falsos negativos:** Spam que pasa
- **Evasión:** Spammers constantemente crean nuevas técnicas

## Relaciones

### Conecta con
- [[correo-envio-a-internet|Envío a Internet]] — SPF/DKIM validación
- [[correo-recepcion-desde-internet|Recepción desde Internet]] — Validación entrada
- [[postfix|Postfix]] — Implementación de filtros

## Fuentes
- [Soluciones al Spam](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo3/spam.md) — Técnicas detalladas
