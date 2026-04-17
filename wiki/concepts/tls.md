---
title: TLS
created: 2026-04-16
updated: 2026-04-16
sources: [curso_apache24]
tags: [tls, seguridad]
aliases: [SSL, HTTPS, TLS, PKI, Certificados Digitales, X.509]
---

# TLS

## Resumen de una línea
Protocolo de encriptación transport-layer: certificados digitales X.509, autenticación servidor, confidencialidad y integridad en HTTPS.

## Definición

**TLS** (Transport Layer Security) = Protocolo criptográfico que proporciona:
1. **Autenticación** — Verifica identidad servidor (certificado X.509)
2. **Confidencialidad** — Encripta comunicación (AES, ChaCha20)
3. **Integridad** — Verifica datos no alterados (HMAC)

Versión actual: **TLS 1.3** (2018). SSL 3.0 está deprecated.

**HTTPS** = HTTP + TLS (puerto 443 por defecto)

## Infraestructura de Clave Pública (PKI)

```
Entidades:
┌─ CA (Certificate Authority) — Autoridad que firma certificados
│  └─ Root CA — CA raíz (preinstalada navegadores)
│  └─ Intermediate CA — CA intermedia (firma otros certs)
│
├─ Servidor — Solicita certificado (CSR)
│  └─ Certificate — Contiene clave pública + metadatos
│  └─ Private Key — Solo servidor, NUNCA se comparte
│
└─ Cliente — Valida certificado
   └─ Trust Store — CAs raíz preinstaladas

Flujo:
1. Servidor genera CSR (Certificate Signing Request)
2. CA valida identidad
3. CA firma certificado (valida 1-2 años)
4. Cliente verifica firma contra CA raíz
```

## Certificado X.509

```yaml
Certificate:
  version: 3
  serial: 1A2B3C4D
  subject:
    commonName (CN): www.ejemplo.com        # Dominio
    organization: Mi Empresa
    country: ES
  issuer:                                     # Quién firma
    commonName: Let's Encrypt Authority
  validFrom: 2024-01-01
  validUntil: 2025-01-01                     # Expiración
  subjectAltName (SAN):                      # Dominios adicionales
    - www.ejemplo.com
    - api.ejemplo.com
    - *.ejemplo.com                          # Wildcard
  publicKey: RSA 2048 bits
  signature: [firma CA]                      # Prueba autenticidad
```

## Procesos Clave

### Generar CSR (Certificate Signing Request)
```bash
# Generar clave privada (sin contraseña)
openssl genrsa -out server.key 2048

# O con contraseña
openssl genrsa -aes256 -out server.key 2048

# Generar CSR (solicitud a CA)
openssl req -new -key server.key -out server.csr
# Pide: Country, State, City, Org, CN (dominio), email
```

### Obtener Certificado

**Opción 1: CA Comercial (DigiCert, GlobalSign)**
```
Flujo:
1. Generar CSR
2. Enviar CSR a CA
3. CA valida control dominio (email, DNS, HTTP)
4. CA emite certificado firmado
5. Costo: $50-200/año
```

**Opción 2: Let's Encrypt (Gratuito)**
```
Herramienta: certbot (automatiza solicitud + renovación)
certbot certonly --webroot -w /var/www/html -d www.ejemplo.com
# Valida por HTTP (webroot), emite cert válido 90 días
# Renovación automática via cron
```

**Opción 3: CAcert (Educativo)**
```
CA gratuita comunitaria, válida pero NO preinstalada navegadores
Pasos:
1. Registrarse en cacert.org
2. Verificar email y dominio
3. Generar certificado en web
4. Descargar certificate.crt
```

### Firmar CSR Localmente (Auto-signed)
```bash
# Solo para testing, no válido para navegadores
openssl req -x509 -days 365 -newkey rsa:2048 \
  -keyout server.key -out server.crt

# O firmar CSR existente
openssl x509 -req -days 365 -in server.csr \
  -signkey server.key -out server.crt
```

## Handshake TLS 1.2

```
Client                                Server
  |                                    |
  |------- ClientHello (ciphers) ----->|
  |   (TLS version, suites soportados)  |
  |                                    |
  |<---- ServerHello + Certificate ---|
  |   (TLS version, suite elegido,    |
  |    cert servidor)                 |
  |                                    |
  |-- ClientKeyExchange (encrypted) -->|
  |   (datos para generar session key)  |
  |                                    |
  |<---- Finished --------- (encrypted)|
  |<---- Finished --------- (encrypted)|
  |                                    |
  |===== Conexión encriptada =========|
```

**ClientHello:** Cliente especifica versión TLS, cipher suites (ej. TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384), extensions.

**ServerHello:** Servidor elige suite más fuerte, envía certificado.

**Validación Cliente:** Verifica firma certificado contra CA raíz (preinstaladas).

**Session Key:** Se genera desde ClientKeyExchange, no se transmite en claro.

## Configuración en Apache (mod_ssl)

```apache
<VirtualHost *:443>
    ServerName www.ejemplo.com
    DocumentRoot /var/www/html
    
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/server.crt
    SSLCertificateKeyFile /etc/ssl/private/server.key
    SSLCertificateChainFile /etc/ssl/certs/ca-bundle.crt
    
    # Solo TLS 1.2+
    SSLProtocol TLSv1.2 TLSv1.3
    
    # Cipher suites fuertes
    SSLCipherSuite HIGH:!aNULL:!MD5
</VirtualHost>

# Redirigir HTTP a HTTPS
<VirtualHost *:80>
    ServerName www.ejemplo.com
    Redirect permanent / https://www.ejemplo.com/
</VirtualHost>
```

**a2enmod ssl** — Activar módulo mod_ssl

## Validación Certificado

```bash
# Ver certificado
openssl x509 -in server.crt -text -noout

# Verificar contra CA
openssl verify -CAfile ca.crt server.crt

# Ver fecha expiración
openssl x509 -in server.crt -noout -dates

# Ver SANs (dominios)
openssl x509 -in server.crt -noout -text | grep -A1 "Subject Alternative"
```

## Relaciones

### Conecta con

### Implementa
- **HTTPS** — HTTP sobre TLS
- **Autenticación mutua** — Ambos lados verifican identidad

### Complementa
- [[apache|Apache]] — mod_ssl para HTTPS
- [[kubernetes|Kubernetes]] — TLS termination
- [[openshift|OpenShift]] — HTTPS automático

### Base para
- seguridad — Confidencialidad transporte
- redes — Encriptación transport-layer

## Fuentes

- [RFC 8446: TLS 1.3](https://tools.ietf.org/html/rfc8446)
- [openssl Documentation](https://www.openssl.org/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [CAcert Community](http://www.cacert.org/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- Curso Apache 2.4 (PLEDIN)
