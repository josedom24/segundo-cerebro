---
title: SPF (Sender Policy Framework)
created: 2026-04-19
updated: 2026-04-19
sources: [correo-envio-a-internet, spf-dkim-dmarc-profundizacion]
tags: [correo, autenticacion, dns, seguridad]
---

# SPF (Sender Policy Framework)

## Definición
SPF es un mecanismo de autenticación basado en DNS que autoriza qué servidores de correo (por dirección IP) están permitidos enviar correos desde un dominio específico.

## Resumen de una línea
Registro DNS que lista las direcciones IP autorizadas para enviar correo desde tu dominio, previniendo suplantación de remitentes.

## Conceptos Clave Fundamentales

### Cómo Funciona SPF
1. Un MTA externo recibe un correo de `usuario@tudominio.com`
2. Verifica la dirección IP del servidor que envía
3. Consulta el registro TXT `v=spf1...` en DNS de `tudominio.com`
4. Compara la IP: ¿está autorizada?
5. Actúa según la política (-all, ~all, ?all)

### Sintaxis del Registro SPF

```
v=spf1 a mx ip4:192.0.2.1 ip6:2001:db8::1 -all
```

**Qualifiers (decisiones):**
- `-` (Fail/Reject): Rechazar correo
- `~` (Softfail): Aceptar pero marcar como spam
- `?` (Neutral): Aceptar sin acción
- `+` (Pass): Explícitamente autorizado (por defecto)

**Mecanismos (qué autorizar):**
- `a`: Las IPs de los registros A del dominio
- `mx`: Las IPs de los servidores MX
- `ip4:X.X.X.X`: Dirección IPv4 específica
- `ip6:XXXX::XXXX`: Dirección IPv6 específica
- `ptr`: Verificar DNS inverso (obsoleto)

### Ejemplo Real
```
gonzalonazareno.org TXT "v=spf1 ip4:5.39.73.79 ~all"
```
- Solo la IP 5.39.73.79 puede enviar correo
- Si viene de otra IP: softfail (spam probable)

## Limitaciones
- **255 caracteres:** Registros muy largos necesitan SPF múltiple
- **10 lookups DNS:** Máximo de consultas permitidas
- **Sin encriptación:** Solo valida IP remitente, no contenido
- **Relax alignment:** No verifica que el "From" coincida con dominio SPF

## Mejoras Posteriores
SPF soluciona suplantación de dominio, pero DKIM añade firma digital y DMARC establece política.

## Relaciones

### Conecta con
- [[postfix|Postfix]] — Servidor que implementa SPF
- [[dkim|DKIM]] — Firma digital de correos
- [[dmarc|DMARC]] — Política unificada de autenticación

## Fuentes
- [Sender Policy Framework (SPF)](../summaries/correo-envio-a-internet.md) — Detalles técnicos
- [SPF, DKIM y DMARC - Profundización](../articles/spf-dkim-dmarc-profundizacion.md) — Artículo de blog
