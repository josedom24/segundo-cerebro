---
title: "SPF, DKIM y DMARC: Profundización en Autenticación de Correo"
created: 2026-04-19
updated: 2026-04-19
sources: [josedomingo-blog-2024, curso_correo_electronico_ies]
tags: [correo, autenticacion, seguridad]
---

# SPF, DKIM y DMARC: Profundización en Autenticación de Correo

## Resumen de una línea
Estándares de autenticación de correo que Google y Yahoo ahora requieren para combatir spam y suplantación.

## Contexto: ¿Por qué es Crítico Ahora?

A partir de **febrero 2024**, Google y Yahoo implementaron requisitos obligatorios:
- **Google:** Mínimo SPF o DKIM válido
- **Yahoo:** DMARC con política p=quarantine o p=reject

**Impacto:** Sin cumplimiento, correos rechazados o marcados como spam.

## SPF: Primera Línea de Defensa

### El Problema Original
```
MAIL FROM: <ceo@banco.com>  ← Cualquiera puede fingir esto
```

**Solución:** Publicar en DNS quién PUEDE enviar correo desde tu dominio.

### Mecanismo SPF

**Registro DNS:**
```
banco.com TXT "v=spf1 ip4:192.0.2.1 ip4:192.0.2.2 -all"
```

**Flujo de validación:**
1. Servidor recibe correo de IP X
2. Extrae dominio del `MAIL FROM` (ej: banco.com)
3. Consulta DNS: banco.com TXT record
4. Busca SPF: `v=spf1 ...`
5. ¿IP X está autorizada?
   - Sí → **PASS**
   - No → **FAIL** (aplicar política -all: rechazar)

### Mecanismos SPF Comunes

| Mecanismo | Significado |
|-----------|------------|
| `a` | IPs del registro A |
| `mx` | IPs de servidores MX |
| `ip4:X.X.X.X` | IPv4 específica |
| `include:otro.com` | Incluir política de otro dominio |
| `~all` | Softfail (spam si no pasa) |
| `-all` | Fail (rechazar si no pasa) |

### Ejemplo Real: Gmail

```
gmail.com TXT "v=spf1 include:_netblocks.google.com include:_netblocks2.google.com ~all"
```

Google mantiene la lista de IPs en `_netblocks.google.com`.

### Limitaciones

- **255 caracteres:** Registros muy largos necesitan múltiples SPF
- **10 lookups DNS:** Máximo de consultas (cuidado con `include:`)
- **Alineación débil:** No verifica que From === dominio SPF
- **IP spoofing:** Solo valida IP, no contenido

## DKIM: Firma Digital del Correo

### El Problema

SPF valida la IP, pero no previene alteración del correo en tránsito:
```
Servidor A envía correo
    ↓
Ataque Man-in-the-Middle altera cuerpo
    ↓
Servidor B lo recibe (alterado)
```

**Solución:** Firma digital criptográfica.

### Mecanismo DKIM

**1. Generación de claves (1 vez):**
```bash
opendkim-genkey -d banco.com -s selector1
```

Crea:
- `selector1.private` - Clave privada (en servidor)
- `selector1.txt` - Clave pública (publicar en DNS)

**2. Firma de cada correo (automático):**
```
DKIM-Signature: v=1; a=rsa-sha256; s=selector1; d=banco.com;
  bh=xyz123...; b=abc456...
```

El servidor firma con clave privada.

**3. Verificación en destino (automático):**
1. Receptor obtiene clave pública: `selector1._domainkey.banco.com`
2. Verifica firma con clave pública
3. ¿Válida? → **PASS** ; ¿Inválida? → **FAIL**

### Ejemplo DNS DKIM

```
selector1._domainkey.banco.com TXT (
  "v=DKIM1; h=sha256; k=rsa; "
  "p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A..."
)
```

### Ventaja sobre SPF

| Aspecto | SPF | DKIM |
|--------|-----|------|
| **Valida** | IP remitente | Contenido del mensaje |
| **Previene** | Suplantación IP | Alteración de mensaje |
| **Criptografía** | No | Sí (RSA 2048/4096) |
| **Complejidad** | Baja | Media |

## DMARC: Política Unificada + Reportes

### El Problema

SPF y DKIM son independientes. ¿Qué pasa si uno falla?

**Solución:** Política unificada que dice "requiero SPF Y/O DKIM" y "si ambos fallan, haz esto".

### Mecanismo DMARC

**Registro DNS:**
```
_dmarc.banco.com TXT (
  "v=DMARC1; p=reject; "
  "adkim=s; aspf=s; "
  "rua=mailto:dmarc@banco.com; "
  "ruf=mailto:forensics@banco.com"
)
```

**Parámetros:**

| Parámetro | Valor | Significado |
|-----------|-------|------------|
| `p` | reject/quarantine/none | Acción si ambos fallan |
| `adkim` | s (strict) / r (relaxed) | Alineación DKIM |
| `aspf` | s (strict) / r (relaxed) | Alineación SPF |
| `rua` | email | Reportes agregados (diarios) |
| `ruf` | email | Reportes forenses (fallos) |

### Decisión DMARC

```
SPF = PASS ?   DKIM = PASS ?   → Resultado
   SÍ            SÍ          → PASS (ok)
   SÍ            NO          → PASS (uno basta)
   NO            SÍ          → PASS (uno basta)
   NO            NO          → Aplicar p= (reject/quarantine/none)
```

### Alineación

**Strict (s):**
- SPF: `MAIL FROM` === dominio visible
- DKIM: `d=` === dominio visible

**Relaxed (r):**
- SPF: `MAIL FROM` puede ser subdominio
- DKIM: `d=` puede ser subdominio

Ejemplo:
```
From: usuario@banco.com
MAIL FROM: noreply@newsletter.banco.com (SPF domain)
```
- `aspf=s` → FAIL (no coinciden)
- `aspf=r` → PASS (subdominio relacionado)

## Implementación Progresiva

### Fase 1: Monitoreo (1-2 meses)
```
p=none  ← No tomar acción
rua=... ← Recibir reportes para analizar
```

Objetivo: Ver qué fallarías si fuera p=reject.

### Fase 2: Cuarentena (1 mes)
```
p=quarantine  ← Enviar a spam (pero entregados)
```

Objetivo: Comodín para servidores legítimos que fallan.

### Fase 3: Rechazo (producción)
```
p=reject  ← Rechazar directamente
```

Objetivo: Máxima seguridad.

## Reportes DMARC

### Agregados (rua=)
Informe diario con estadísticas:
- Correos pasados
- Correos fallidos (por qué)
- IPs que envían

**Formato:** XML comprimido
**Frecuencia:** Diaria

### Forenses (ruf=)
Detalles de cada fallo:
- IP específica
- Razón del fallo (SPF/DKIM)
- Cuerpo del mensaje

**Formato:** RFC 5322 completo
**Frecuencia:** Cada fallo

## Casos Reales: Google, Microsoft, Yahoo

### Políticas Actuales (2024)

**Gmail:**
```
_dmarc.gmail.com: p=reject
```

**Microsoft (outlook.com):**
```
Requiere SPF + DKIM
```

**Yahoo:**
```
_dmarc.yahoo.com: p=reject; adkim=s; aspf=s
```

→ **Sí, los "gigantes" cumplen sus propias políticas.**

## Mejor Práctica Consolidada

```
1. SPF:
   - Publicar registro SPF con todas las IPs autorizadas
   - Usar -all (reject) o ~all (softfail)

2. DKIM:
   - Generar claves RSA 2048+
   - Usar selector rotado (selector1, selector2, etc.)
   - Publicar en DNS

3. DMARC:
   - Inicio: p=none + reportes
   - Monitor 1-2 meses
   - Escalar a p=quarantine
   - Final: p=reject

4. Monitoreo:
   - Leer reportes DMARC
   - Identificar IPs legítimas que fallan
   - Añadirlas a SPF/DKIM
```

## Herramientas de Validación

- **MXToolbox:** mxtoolbox.com/dkim, mxtoolbox.com/spf
- **Dmarcian:** Free DMARC reports
- **Google Admin Toolbox:** toolbox.googleapps.com

## Relaciones

### Conecta con
- [[spf|SPF]] — Autenticación por DNS
- [[dkim|DKIM]] — Firma digital
- [[dmarc|DMARC]] — Política unificada
- [[postfix|Postfix]] — Implementación
- [[correo-envio-a-internet|Envío a Internet]] — Aplicación práctica

## Fuentes
- [Blog: SPF, DKIM y DMARC](https://www.josedomingo.org/pledin/2024/02/spf-dkim-dmark/) — Artículo original
- [Curso: Asegurar Envío de Correo](../summaries/correo-envio-a-internet.md) — Implementación técnica
