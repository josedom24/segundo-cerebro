---
title: Configuración Avanzada de Postfix
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, postfix, configuracion, seguridad]
---

# Configuración Avanzada de Postfix

## Resumen de una línea
Alias, redirecciones, usuarios virtuales, filtrado de spam y listas negras en Postfix.

## SMTPd Restrictions

Controlar conexiones SMTP entrantes y salientes con directivas en `/etc/postfix/main.cf`:

### Directivas Principales
- `smtpd_helo_restrictions` — Filtrar por parámetro HELO
- `smtpd_client_restrictions` — Filtrar dominio MAIL FROM
- `smtpd_relay_restrictions` — Permisos para relay (reenvío)
- `smtpd_recipient_restrictions` — Filtrar clientes origen (búsquedas RBL)

### Ejemplo Completo
```
smtpd_client_restrictions =
    permit_mynetworks,
    reject_unknown_client_hostname

smtpd_recipient_restrictions =
    permit_mynetworks,
    permit_sasl_authenticated,
    reject_non_fqdn_recipient,
    reject_unauth_destination,
    check_policy_service unix:private/policyd-spf
```

## Validación de SPF en Recepción

Verificar remitentes contra registros SPF:

**Instalación:**
```bash
apt install postfix-policyd-spf-python
```

**Configuración `/etc/postfix/master.cf`:**
```
policyd-spf unix - n n - 0 spawn user=policyd-spf argv=/usr/bin/policyd-spf
```

**En `/etc/postfix/main.cf`:**
```
policyd-spf_time_limit = 3600
smtpd_recipient_restrictions =
    ...
    check_policy_service unix:private/policyd-spf
```

Rechaza/marca spam si SPF falla.

## Alias y Redirecciones

### Alias del Sistema
**Archivo:** `/etc/aliases`
```
postmaster: root
noreply: /dev/null
gerentes: gerente1, gerente2, gerente3
```

Compilar con: `newaliases`

### Usuarios Virtuales
**Archivo:** `/etc/postfix/virtual`
```
info@midominio.com usuario_real
soporte@midominio.com usuario1, usuario2
@midominio.com usuario_por_defecto
```

Activar:
```bash
postmap /etc/postfix/virtual
# En main.cf:
virtual_alias_maps = hash:/etc/postfix/virtual
virtual_alias_domains = midominio.com
```

## Antivirus: ClamAV + Amavis

### Arquitectura
```
Correo → Postfix → Amavis (puerto 10024) → ClamAV
                                        → SpamAssassin
         ↓
    Postfix (puerto 10025) → Entrega/Rechazo
```

**Amavis** actúa como intermediario:
1. Recibe correo de Postfix (10024)
2. Envía a ClamAV para análisis de virus
3. Devuelve a Postfix (10025) con decisión
4. Rechaza si tiene virus, marca si es sospechoso

**Instalación:**
```bash
apt install amavis clamav clamav-daemon
```

**Test antivirus (EICAR):**
```
X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*
```

## Filtrado de Spam

### Listas Negras (RBL/DNSBL)
Consultar bases de datos en tiempo real de IPs de spam.

**En `/etc/postfix/main.cf`:**
```
smtpd_recipient_restrictions =
    permit_mynetworks,
    permit_sasl_authenticated,
    reject_rbl_client zen.spamhaus.org,
    reject_rbl_client blacklist.otro.com,
    reject_unauth_destination
```

**Proveedores:** Spamhaus, DNSBL.info, MXToolbox

### SpamAssassin - Análisis Avanzado

Motor de filtrado que analiza múltiples factores:

| Método | Descripción |
|--------|------------|
| Palabras clave | Detecta frases típicas de spam |
| RBL | Consulta listas negras |
| Análisis Bayesian | Aprende correos spam vs legítimos |
| Heurística | Aplica reglas predefinidas |
| SPF/DKIM | Verifica autenticación |

Cada regla suma/resta puntos. Umbral por defecto: 5.0 = spam.

**Integración con Postfix (via spamc):**
```bash
apt install spamassassin spamc
```

Postfix envía correos a SpamAssassin para análisis, recibe con cabecera `X-Spam-Score`.

**Test SpamAssassin (GTUBE):**
```
XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X
```

### Límites de Velocidad
```
smtpd_client_connection_rate_limit = 10
smtpd_client_message_rate_limit = 5
```

## Validación de Dominio

Rechazar correos de dominios inválidos:
```
reject_invalid_helo_hostname
reject_non_fqdn_helo_hostname
reject_non_fqdn_sender
```

## Casos Prácticos

### Postmaster Automático
```
/etc/aliases: postmaster: root
```
Correos a postmaster van a administrador.

### Distribución a Grupo
```
/etc/postfix/virtual:
soporte@midominio.com user1, user2, user3
```
Se entrega a múltiples usuarios.

## Relaciones

### Conecta con
- [[postfix|Postfix]] — Servidor MTA
- [[correo-postfix-instalacion|Instalación de Postfix]] — Setup base
- [[correo-recepcion-desde-internet|Recepción desde Internet]] — MX y usuarios

## Fuentes
- [Curso: Gestión del Correo](https://github.com/josedom24/curso_correo_electronico_ies/tree/main/modulo3) — Alias, spam, seguridad
