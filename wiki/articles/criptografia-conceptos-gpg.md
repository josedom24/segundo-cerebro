---
created: 2026-05-07
updated: 2026-05-07
sources: [josedomingo-intro-criptografia, josedomingo-criptografia-gpg]
tags: [criptografia, seguridad]
title: "Criptografía: Conceptos Fundamentales e Implementación con GPG"
---

# Criptografía: Conceptos Fundamentales e Implementación con GPG

## Resumen de una línea
La criptografía (escritura secreta) protege información mediante cifrado simétrico, asimétrico y firmas digitales, con GPG como herramienta open-source práctica para implementar cifrado, firmas y gestión de claves.

## ¿Qué es Criptografía?

**Criptografía** viene de dos palabras:
- **Cripto** = secreto
- **Grafía** = escritura

Es la disciplina que permite **encriptar mensajes** para que solo destinatarios autorizados puedan leerlos.

### Flujo Básico

```
Mensaje original (plaintext)
        ↓
  Algoritmo de cifrado + clave
        ↓
Mensaje cifrado (ciphertext)
        ↓
  Algoritmo de descifrado + clave
        ↓
Mensaje original recuperado
```

## Dos Paradigmas de Criptografía

### 1. Criptografía Simétrica

**Una sola clave compartida** para cifrar y descifrar.

```
Persona A                 Persona B
  ↓                          ↓
Clave secreta común (ej: "mi_contraseña_123")
  ↓                          ↓
Cifra mensaje          Descifra mensaje
```

**Ventajas:**
- ✅ Muy eficiente (rápida, bajo consumo CPU)
- ✅ Excelente para grandes volúmenes de datos

**Desventajas:**
- ❌ **Problema de distribución:** ¿Cómo compartir la clave sin ser interceptada?
- ❌ No autentica quién envía (ambos tienen la misma clave)

**Ejemplos:**
- AES (Advanced Encryption Standard) — Estándar moderno
- DES (Data Encryption Standard) — Obsoleto
- RC4 — Obsoleto

**Uso práctico:**
```bash
# Cifrar archivo con contraseña
gpg -c archivo.txt          # Crea archivo.txt.gpg

# Descifrar
gpg -d archivo.txt.gpg      # Solicita contraseña
```

### 2. Criptografía Asimétrica (PKC)

**Dos claves diferentes:** pública (conocida) y privada (secreta).

```
Persona A (privada: d, pública: e)    Persona B (privada: d', pública: e')

  Cifra con clave pública de B
         ↓
  e' (pública, conocida)
         ↓
  Solo B puede descifrar con su d' (privada)
```

**Ventaja revolucionaria:**
- ✅ **Distribución segura:** Puedo publicar mi clave pública sin riesgo
- ✅ **Autenticación:** Firma con clave privada → verifica con clave pública
- ✅ **No requiere canal seguro previo**

**Desventajas:**
- ❌ Más lenta que simétrica (100-1000x)
- ❌ Mayor consumo CPU
- ❌ Más compleja de implementar

**Ejemplos:**
- RSA (Rivest-Shamir-Adleman) — Basado en factorización de números grandes
- ECC (Elliptic Curve Cryptography) — Basado en curvas elípticas, más eficiente
- El Gamal — Basado en logaritmos discretos

### Uso Híbrido (Práctico Real)

**Problema:** Asimétrica es lenta pero es segura para distribución de claves.

**Solución:** Combinar ambas:

```
┌─ Asimétrica: Intercambiar clave simétrica seguramente
│   A crea clave simétrica aleatoria (ej: AES 256-bit)
│   A cifra con clave pública de B → B descifra con su clave privada
│   Ahora ambos tienen la misma clave simétrica (de forma segura)
│
└─ Simétrica: Usar esa clave para cifrar todo el mensaje (rápido)
   A cifra mensaje con AES usando esa clave
   B descifra con la misma clave AES
```

**Implementado en:**
- HTTPS/TLS
- SSH
- PGP/GPG
- Signal, WhatsApp (end-to-end encryption)

## Firmas Digitales: Autenticidad e Integridad

**Problema:** ¿Cómo pruebo que soy yo quien envía el mensaje?

**Solución:** Firmar con clave privada, verificar con clave pública.

### Proceso

```
Mensaje M
  ↓
Hash (SHA-256, MD5)
  ↓
Hash(M) = ABC123...
  ↓
Cifra con clave privada del remitente
  ↓
Firma = RSA_encrypt(Hash(M), private_key)
  ↓
Envía: [Mensaje original + Firma]
```

**Verificación:**

```
Recibe: [Mensaje M + Firma]
  ↓
Descifra firma con clave pública del remitente
  ↓
Firma_descifrada = RSA_decrypt(Firma, public_key)
  ↓
Calcula Hash(M) nuevo
  ↓
¿Hash(M) == Firma_descifrada?
  ✅ SÍ → Mensaje auténtico e íntegro
  ❌ NO → Mensaje alterado o no es del remitente
```

**Ventajas:**
- ✅ Autentica al remitente (solo él puede firmar)
- ✅ Detecta alteraciones (hash no coincide)
- ✅ No repudio (remitente no puede negar que firmó)

## Modelos de Confianza

### 1. Infraestructura de Clave Pública (PKI)

**Autoridad Central:** Certificate Authority (CA) firma certificados de terceros.

```
CA (VeriSign, Let's Encrypt, DigiCert)
  ↓ (firma el certificado)
www.example.com (Certificate)
  ↓ (incluye)
Clave pública de www.example.com
Identidad verificada de www.example.com
Firma de CA (proof of authority)
```

**Confianza transitiviva:**
- Confío en CA (navegadores pre-instalan CAs)
- CA firmó certificado de www.example.com
- Por lo tanto, confío en www.example.com

**Ventaja:** Escalable, centralizado, compatible HTTPS/TLS

**Desventaja:** Dependo de CAs (pueden ser comprometidas, censurar)

### 2. Red de Confianza (Web of Trust)

**Sin autoridad central:** Confío en personas que conozco, y ellas confían en otras.

```
Yo (conozco y verifico personalmente)
  ↓ (firmo clave pública de)
Amigo A
  ↓ (Amigo A conoce y firma a)
Colega B
  ↓ (Colega B conoce y firma a)
Desconocido C
```

**Confianza:**
- ✅ Directa: Conozco personalmente y verifico huella
- ✅ Por delegación: Amigos en quienes confío, firman por otros
- ✅ Transitiva: La red entera conecta mediante firmas

**Ventaja:**
- No dependo de autoridades centrales
- Más resistente a censura
- Descentralizado

**Desventaja:**
- Requiere diligencia (verificar fingerprints)
- Menos escalable (requiere conocimiento previo)
- Más lenta de construir

**Implementado en:** PGP, GPG, SSH known_hosts

---

## GPG: Criptografía Práctica

**GnuPG** es "una implementación completa y libre del estándar OpenPGP."

Permite usar criptografía simétrica, asimétrica, firmas y Web of Trust en la práctica.

### 1. Cifrado Simétrico (Contraseña)

```bash
# Cifrar archivo
gpg -c archivo.txt
# Crea: archivo.txt.gpg
# Solicita contraseña (se pide 2x)

# Descifrar
gpg -d archivo.txt.gpg
# Solicita contraseña y muestra contenido

# Descifrar a archivo
gpg -d archivo.txt.gpg -o archivo_original.txt
```

**Caso de uso:** Compartir archivo con contraseña por email inseguro.

### 2. Generar Par de Claves

```bash
# Generar nuevo par (público + privado)
gpg --gen-key

# Responde preguntas:
# - Tipo: RSA 2048 (o 4096 para máxima seguridad)
# - Nombre real: "José García"
# - Email: "jose@example.com"
# - Comentario: "Clave laboral"
# - Contraseña para proteger clave privada (importante!)
```

**Resultado:**
```
Clave pública: compartible públicamente (fingerprint único)
Clave privada: protegida con contraseña, nunca compartir
```

### 3. Cifrado Asimétrico

```bash
# Exportar clave pública (enviar a otros)
gpg --export -a jose@example.com > mi_clave_publica.asc

# Alguien me envía su clave pública (importar)
gpg --import clave_de_amigo.asc

# Listar claves
gpg --list-keys

# Cifrar archivo para amigo (con su clave pública)
gpg -r "amigo@example.com" -e documento.pdf
# Crea: documento.pdf.gpg
# Solo amigo puede descifrar (necesita su clave privada + contraseña)

# Descifrar (solo quien tiene clave privada)
gpg -d documento.pdf.gpg
# Solicita contraseña de clave privada
```

**Flujo típico:**
```
Yo → [Cifro con clave pública de Amigo] → Amigo → [Descifra con su clave privada]
```

### 4. Firmas Digitales

```bash
# Firmar documento (demuestra que es de mi autoría)
gpg --sign documento.txt
# Crea: documento.txt.gpg (binario)

# Firmar en formato ASCII (para email)
gpg --armor --detach-sign documento.txt
# Crea: documento.txt.asc (firma separada, texto)

# Verificar firma
gpg --verify documento.txt.asc documento.txt
# ✅ Good signature from "José García" <jose@example.com>
# o
# ❌ BAD signature - document altered!
```

**Caso de uso:**
```
Publico: documento.txt + documento.txt.asc
Otros pueden verificar: gpg --verify documento.txt.asc documento.txt
Resultado: Saben que es genuino y no fue alterado
```

### 5. Gestión de Claves

```bash
# Listar claves públicas
gpg --list-keys

# Listar claves privadas
gpg --list-secret-keys

# Ver fingerprint (identificador único)
gpg --fingerprint jose@example.com

# Exportar clave pública en formato binary
gpg --export -o mi_clave.gpg jose@example.com

# Exportar clave privada (⚠️ CUIDADO!)
gpg --export-secret-keys -a > clave_privada_BACKUP.asc
# (guardar en lugar muy seguro - USB cifrado, caja fuerte)

# Importar clave
gpg --import clave_amigo.asc

# Firmar clave de otros (validar en Web of Trust)
gpg --sign-key amigo@example.com
# Luego: gpg --send-keys amigo@example.com (publicarla)

# Eliminar clave
gpg --delete-key email@example.com
gpg --delete-secret-key email@example.com  # (privada)
```

### 6. Web of Trust en Práctica

```bash
# Yo conozco personalmente a Amigo
# Amigo me muestra su fingerprint (ej: por teléfono, en persona)
# Comparo con mi copia
gpg --fingerprint amigo@example.com

# Firmo su clave (validar identidad)
gpg --sign-key amigo@example.com
# Pregunta confirmación, firmo con mi clave privada

# Publico la firma (para que otros vean que confío en él)
gpg --send-keys amigo@example.com
# (a servidor de claves: keybase.io, keys.openpgp.org, etc.)

# Ahora otros ven:
gpg --list-keys amigo@example.com
# [Firma de yo] [Firma de otros]
# → Amigo está bien conectado en la red de confianza
```

## Casos de Uso Reales

### 1. Comunicación Privada (Email)

```
Yo envío email a Amigo:
1. Escrito en cliente de email (Thunderbird + Enigmail)
2. Automáticamente: cifro con clave pública de Amigo
3. Envío email cifrado (servidor no ve contenido)
4. Amigo recibe → descifra con su clave privada
5. Solo Amigo puede leer
```

### 2. Verificación de Software

```
Distribuidor publica:
  - software.tar.gz (el archivo)
  - software.tar.gz.asc (firma)

Yo descargo ambos y verifico:
gpg --verify software.tar.gz.asc software.tar.gz
✅ Good signature from "Distribuidor Confiable"
→ Sé que es software genuino, no fue alterado
```

### 3. Backup Cifrado

```
Copia de seguridad importante (contraseña de BD, claves privadas):
1. Cifra con contraseña fuerte: gpg -c backup.sql
2. Almacena backup.sql.gpg en nube sin miedo
3. Nadie puede leer sin la contraseña
```

### 4. Autenticación Descentralizada (SSH)

```
SSH usa GPG para autenticar usuarios:
- Clave pública en ~/.ssh/authorized_keys
- Clave privada en ~/.ssh/id_rsa (protegida con contraseña)
- Sin contraseña correcta, no se puede entrar

Similar a GPG pero integrado en SSH
```

## Mejores Prácticas

✅ **Clave privada:**
- Protege con contraseña fuerte
- Almacena en lugar seguro (no en la nube)
- Haz backup en USB/hardware wallet cifrado
- Nunca compartas con nadie

✅ **Clave pública:**
- Comparte libremente
- Publica en múltiples servidores de claves
- Incluye en tu email, web, redes sociales

✅ **Web of Trust:**
- Firma claves solo si verificas personalmente
- Usa fingerprint (no confíes en name solamente)
- Publica firmas (para ayudar a otros a confiar)

❌ **Errores comunes:**
- ❌ Usar contraseña débil para clave privada
- ❌ Perder backup de clave privada (no puedes recuperar mensajes cifrados)
- ❌ Firmar claves sin verificar fingerprint
- ❌ Dejar clave privada en servidor público

---

## Relaciones

### Conecta con
- [[tls|TLS]] — Criptografía en HTTPS y comunicación segura
- [[spf|SPF]] — Autenticación de email (complementario a GPG)
- [[dkim|DKIM]] — Firma digital para correo (similar concepto a GPG)
- [[red-linux|Configuración de Red en Linux]] — SSH usa criptografía asimétrica

## Fuentes
- [Introducción a la Criptografía](https://www.josedomingo.org/pledin/2023/10/introduccion-criptografia/) — Conceptos fundamentales, simétrica vs asimétrica
- [Criptografía con GPG](https://www.josedomingo.org/pledin/2023/11/criptografia-con-gpg/) — Implementación práctica, gestión de claves, Web of Trust
