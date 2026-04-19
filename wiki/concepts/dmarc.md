---
title: DMARC
created: 2026-04-19
updated: 2026-04-19
sources: [correo-envio-a-internet, spf-dkim-dmarc-profundizacion]
tags: [correo, autenticacion, dns, reportes]
---

# DMARC

## Definición
DMARC (Domain-based Message Authentication, Reporting and Conformance) es una política de autenticación de correo que unifica SPF y DKIM, definiendo qué hacer con correos que fallan autenticación y generando reportes de incidentes.

## Resumen de una línea
Política DNS que dice "usa SPF y/o DKIM" y ordena a servidores remotos qué hacer si fallan, con reportes de intentos fraudulentos.

## Conceptos Clave Fundamentales

### Cómo Funciona DMARC

**1. Publicación de Política**
```
_dmarc.midominio.com TXT "v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc@midominio.com"
```

**2. Evaluación por Receptor**
- Verifica si el correo pasa SPF y/o DKIM
- Si ambos fallan: aplica la política (p=)
- Si al menos uno pasa: el correo se considera OK

**3. Reportes**
- Agregados diarios (`rua=`)
- Reportes forenses en caso de fallo (`ruf=`)

### Parámetros

**Política (p=)**
- `p=none`: Monitoreo, sin acción (test)
- `p=quarantine`: Enviar a spam si falla
- `p=reject`: Rechazar completamente si falla

**Alineación**
- `adkim=s` (strict): El From debe ser exactamente el dominio autenticado
- `adkim=r` (relaxed): El From puede ser subdominio (por defecto)
- `aspf=s/r`: Lo mismo pero para SPF

**Reportes**
- `rua=mailto:email@ejemplo.com`: Correo de reportes agregados
- `ruf=mailto:email@ejemplo.com`: Correo de reportes forenses

### Ejemplo Real
```
_dmarc.gonzalonazareno.org TXT "v=DMARC1; p=quarantine; adkim=r; aspf=r;"
```
- Requiere SPF o DKIM válido
- Si ambos fallan: spam
- Sin reportes configurados

## Flujo de Decisión DMARC

```
¿SPF PASS?  ¿DKIM PASS?  → Resultado
   SÍ           SÍ       → PASS (correo entregado)
   SÍ           NO       → PASS (un mecanismo basta)
   NO           SÍ       → PASS (un mecanismo basta)
   NO           NO       → Aplicar política (p=)
```

## Ventajas Integradas

| Ventaja | Descripción |
|---------|-------------|
| **Unificada** | SPF + DKIM en una sola política |
| **Flexible** | Modo test (none) antes de reject |
| **Reportes** | Visibilidad de intentos de spoofing |
| **Estándar** | Google, Yahoo, etc. lo requieren |

## Configuración Progresiva

**Fase 1: Monitoreo (1-2 meses)**
```
p=none
```

**Fase 2: Cuarentena (1 mes)**
```
p=quarantine
```

**Fase 3: Rechazo (producción)**
```
p=reject
```

## Relaciones

### Conecta con
- [[spf|SPF]] — Autenticación DNS complementaria
- [[dkim|DKIM]] — Firma digital complementaria
- [[postfix|Postfix]] — Servidor que implementa políticas

## Fuentes
- [DMARC - Detalles Técnicos](../summaries/correo-envio-a-internet.md) — Implementación
- [SPF, DKIM y DMARC - Profundización](../articles/spf-dkim-dmarc-profundizacion.md) — Política unificada
