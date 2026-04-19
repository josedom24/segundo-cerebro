---
title: DKIM
created: 2026-04-19
updated: 2026-04-19
sources: [correo-envio-a-internet, spf-dkim-dmarc-profundizacion]
tags: [correo, autenticacion, dns, seguridad]
---

# DKIM

## Definición
DKIM (DomainKeys Identified Mail) es un mecanismo de autenticación criptográfica que firma digitalmente los correos con una clave privada, permitiendo a receptores verificar la autenticidad usando la clave pública publicada en DNS.

## Resumen de una línea
Firma digital para correos: tu servidor firma con clave privada, receptores verifican con clave pública en DNS.

## Conceptos Clave Fundamentales

### Proceso DKIM

**1. Generación de Claves**
```bash
opendkim-genkey -D /etc/dkimkeys -d midominio.com -s selector1
```
- Clave privada: `selector1.private` (en servidor)
- Clave pública: `selector1.txt` (publica en DNS)
- Selector: Identificador único de las claves

**2. Firma de Correos**
- El MTA firma cada correo saliente con la clave privada
- Añade encabezado DKIM-Signature al mensaje
- Signature contiene hash del mensaje

**3. Verificación Remota**
- Receptor busca el selector en DNS: `selector1._domainkey.midominio.com`
- Obtiene la clave pública
- Verifica el hash del mensaje
- Resultado: PASS / FAIL / NEUTRAL

### Componentes
- **opendkim:** Servicio que firma/verifica
- **Milter Protocol:** Integración con Postfix
- **Configuración:** `/etc/opendkim.conf`
- **Integración Postfix:** `smtpd_milters` en main.cf

### Registro DNS

```
selector1._domainkey.midominio.com TXT (
  "v=DKIM1; h=sha256; k=rsa; "
  "p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..."
)
```

- `v=DKIM1`: Versión
- `h=sha256`: Hash usado (SHA-256)
- `k=rsa`: Algoritmo RSA
- `p=...`: Clave pública

## Ventajas sobre SPF

| Aspecto | SPF | DKIM |
|--------|-----|------|
| **Verifica** | IP remitente | Contenido del mensaje |
| **Spoofing** | Solo evita suplantación dominio | Previene alteración del mensaje |
| **Seguridad** | Débil (solo DNS) | Fuerte (criptografía) |

## Limitaciones
- **Complejo setup:** Generar claves, configurar Postfix, publicar DNS
- **Múltiples selectores:** Necesario para rotación de claves
- **No valida remitente:** Solo autentica dominio

## Relaciones

### Conecta con
- [[postfix|Postfix]] — Implementación con opendkim
- [[spf|SPF]] — Autenticación complementaria
- [[dmarc|DMARC]] — Política que requiere DKIM
- [[tls|TLS]] — Cifrado de transporte

## Fuentes
- [DKIM - Detalles Técnicos](../summaries/correo-envio-a-internet.md) — Implementación
- [SPF, DKIM y DMARC - Profundización](../articles/spf-dkim-dmarc-profundizacion.md) — Comparativa y mejores prácticas
