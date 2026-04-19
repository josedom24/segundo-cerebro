---
title: Envío a Internet
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies, spf-dkim-dmarc-profundizacion]
tags: [correo, postfix, autenticacion, seguridad]
---

# Envío a Internet

## Resumen de una línea
Configuración de Postfix para enviar correos a internet con autenticación SPF, DKIM y DMARC.

## Caso: Correo Desde Servidor a Internet

### Escenario
```
Usuario A (servidor.com)
    └─ SMTP
    └─> Servidor Postfix (servidor.com)
        └─ Consulta DNS: ¿dónde va usuario@destino.com?
        └─ SMTP 25 → Servidor destino
            └─ Verifica SPF/DKIM/DMARC
            └─ Entrega o rechaza
```

### Problema: Spam y Spoofing

Cualquier servidor puede enviar correo fingiendo ser cualquier dominio:
```
MAIL FROM: <ceo@banco.com>  ← Mentira fácil
```

**Solución:** Mecanismos de autenticación.

## Autenticación: SPF

**SPF (Sender Policy Framework)** - Registro DNS que autoriza IPs

```
midominio.com TXT "v=spf1 ip4:192.0.2.1 -all"
```

**Significado:**
- `v=spf1`: Versión SPF
- `ip4:192.0.2.1`: Solo esta IP puede enviar
- `-all`: Rechazar otros (otros: `~all` = spam, `?all` = aceptar)

**Verificación en servidor destino:**
1. Correo llega de IP X
2. Servidor consulta DNS de midominio.com
3. ¿IP X está autorizada?
4. Sí → Pasa SPF; No → Falla SPF

## Autenticación: DKIM

**DKIM (DomainKeys Identified Mail)** - Firma digital del correo

### Generación de Claves
```bash
opendkim-genkey -D /etc/dkimkeys -d midominio.com -s selector1
```

Crea:
- `selector1.private` - Clave privada (en servidor)
- `selector1.txt` - Clave pública (en DNS)

### Configuración Postfix
```
# /etc/opendkim.conf
Mode sv
Domain midominio.com
KeyFile /etc/dkimkeys/selector1.private
Selector selector1
Socket inet:8892@localhost

# /etc/postfix/main.cf
milter_protocol = 2
smtpd_milters = inet:localhost:8892
```

### Publicar en DNS
```
selector1._domainkey.midominio.com TXT "v=DKIM1; h=sha256; k=rsa; p=MIIBIjANB..."
```

**Verificación:**
1. Correo llega firmado
2. Servidor obtiene clave pública de DNS
3. Verifica firma: ¿valida?
4. Sí → Pasa DKIM; No → Falla DKIM

## Autenticación: DMARC

**DMARC (Domain-based Message Authentication, Reporting and Conformance)** - Política unificada

```
_dmarc.midominio.com TXT "v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:admin@midominio.com"
```

**Parámetros:**
- `p=quarantine` - Acción si falla (none/quarantine/reject)
- `adkim=r` - Alineación DKIM relajada
- `aspf=r` - Alineación SPF relajada
- `rua=` - Correo para reportes

**Decisión DMARC:**
- ¿SPF pasa O DKIM pasa? → Aceptar
- ¿Ambos fallan? → Aplicar política (p=)

## Mejores Prácticas

1. **Implementar progresivamente:**
   - Mes 1: SPF
   - Mes 2: DKIM
   - Mes 3: DMARC (p=none)
   - Mes 4: DMARC (p=quarantine)
   - Mes 5: DMARC (p=reject)

2. **Monitorear reportes DMARC** para encontrar servidores legales que fallan

3. **IP limpia:** Listas negras (DNSBL)
   - No estar en listas negras de spam
   - Validar con mxtoolbox.com

4. **Configuración TLS:**
   ```
   smtp_tls_security_level = may
   smtpd_tls_security_level = may
   ```

### Lecturas Relacionadas
- [[spf-dkim-dmarc-profundizacion|SPF, DKIM y DMARC - Profundización]] — Blog con estrategia unificada

## Relaciones

### Conecta con
- [[postfix|Postfix]] — Servidor que envía
- [[spf|SPF]] — Autenticación por DNS
- [[dkim|DKIM]] — Firma digital de correos
- [[dmarc|DMARC]] — Política unificada
- [[tls|TLS]] — Cifrado de tránsito

## Fuentes
- [¿Qué hacer para que llegue a buen puerto?](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo3/asegurar_envio_correo.md) — Detalles técnicos SPF/DKIM/DMARC
- [SPF, DKIM y DMARC - Profundización](../articles/spf-dkim-dmarc-profundizacion.md) — Blog de profundización
