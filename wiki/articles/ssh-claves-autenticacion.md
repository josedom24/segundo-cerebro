---
created: 2026-05-07
updated: 2026-05-07
sources: [josedomingo-claves-ssh]
tags: [ssh, seguridad]
title: "SSH: Autenticación por Claves y Acceso Remoto Seguro"
---

# SSH: Autenticación por Claves y Acceso Remoto Seguro

## Resumen de una línea
SSH con autenticación por claves elimina contraseñas débiles, permite acceso automatizado sin interacción y usa criptografía asimétrica (RSA/EdDSA) para conexiones remotas seguras.

## ¿Por Qué Claves SSH?

### Problema: Autenticación por Contraseña

```
ssh usuario@servidor.com
contraseña: ........

❌ Riesgos:
- Contraseña interceptada en red (SSH la cifra, pero igual)
- Contraseña débil (fuerza bruta)
- No funciona en procesos automatizados (sin interacción)
- Servidor sin contraseña (cuentas de servicio) es inseguro
```

### Solución: Claves SSH (Autenticación Asimétrica)

```
ssh usuario@servidor.com
(sin solicitar contraseña)
↓
SSH verifica clave privada del cliente
↓
✅ Acceso autenticado sin contraseña
```

**Ventajas:**
- ✅ Sin contraseña (eliminamos debilidad humana)
- ✅ Funciona automatizado (scripts, cron, CI/CD)
- ✅ Criptografía asimétrica (SSH verifica que eres tú)
- ✅ Más seguro que contraseñas (RSA 2048+ o EdDSA)
- ✅ Passphrase protege clave privada (y ssh-agent lo cachea)

## Cómo Funciona: Criptografía Asimétrica en SSH

### Arquitectura

```
Cliente (tu máquina)                    Servidor (servidor remoto)
  ↓                                          ↓
Clave privada: id_rsa                  Clave pública: en authorized_keys
(secreta, protegida)                   (pública, conocida)
  ↓                                          ↓
Firma desafío del servidor           Verifica firma con clave pública
  ↓                                          ↓
Envía firma                              ¿Firma válida? → ✅ Autenticado
```

### Handshake SSH Simplificado

```
1. Cliente: "Quiero conectar como usuario"
2. Servidor: "Aquí está mi clave pública, prueba que eres quien dices"
3. Cliente: Firma el desafío con su clave privada
4. Servidor: Verifica firma con clave pública del cliente
   - ✅ Firma válida → Acceso permitido
   - ❌ Firma inválida → Acceso denegado
```

**Seguridad:**
- Servidor NUNCA ve clave privada del cliente
- Clave privada nunca sale del cliente (solo firmas)
- Sin contraseña en red (criptografía de clave pública)

## Setup: Paso a Paso

### 1. Generar Par de Claves (Cliente)

```bash
# En tu máquina local
ssh-keygen -t rsa -b 4096

# Responde preguntas:
# Enter file in which to save the key: [Enter] (usa ~/.ssh/id_rsa)
# Enter passphrase: [contraseña fuerte]
# Enter same passphrase again: [repite]
```

**Resultado:**

```
~/.ssh/id_rsa           # Clave PRIVADA (nunca compartir)
~/.ssh/id_rsa.pub       # Clave PÚBLICA (compartir con servidores)
```

**Protección:**

```bash
# Verificar permisos (solo tú puedes leer)
ls -la ~/.ssh/
-rw------- user user ~/.ssh/id_rsa
-rw-r--r-- user user ~/.ssh/id_rsa.pub
```

### 2. Copiar Clave Pública al Servidor

**Opción A: Automática (recomendado)**

```bash
# Copia clave pública y la añade a authorized_keys en servidor
ssh-copy-id -i ~/.ssh/id_rsa.pub usuario@servidor.com

# Solicita contraseña del usuario (última vez)
# Luego: clave pública está en ~/.ssh/authorized_keys del servidor
```

**Opción B: Manual**

```bash
# 1. Ver clave pública
cat ~/.ssh/id_rsa.pub
# ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDx... usuario@cliente

# 2. En el servidor
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 3. Pegar clave pública
echo "ssh-rsa AAAAB3NzaC1yc2E... usuario@cliente" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. Conectar (Sin Contraseña)

```bash
# Conectar al servidor
ssh usuario@servidor.com

# Solicita: Enter passphrase for key '/home/user/.ssh/id_rsa': [tu passphrase]
# (no la contraseña del usuario en servidor)

# Resultado: ✅ Conectado sin contraseña de usuario
```

## Caching de Contraseña: ssh-agent

**Problema:** Cada conexión pide la passphrase.

```bash
ssh usuario@servidor1.com
# Passphrase: ....

ssh usuario@servidor2.com
# Passphrase: ....  ← tedioso

ssh usuario@servidor3.com
# Passphrase: ....
```

**Solución: ssh-agent**

ssh-agent cachea la clave privada descifrada en memoria:

```bash
# Iniciar ssh-agent (generalmente automático en desktops)
eval $(ssh-agent -s)
# Agent pid 1234

# Añadir clave privada al agente
ssh-add ~/.ssh/id_rsa
# Enter passphrase: ... [pide 1 sola vez]

# Ahora: conexiones sin pedir passphrase (usa caché del agente)
ssh usuario@servidor1.com  # Sin passphrase
ssh usuario@servidor2.com  # Sin passphrase
```

**En GNOME/KDE:** ssh-agent se inicia automáticamente y cachea claves.

## Casos de Uso: Dónde SSH por Claves es Esencial

### 1. Acceso Automatizado (Scripts, Cron, CI/CD)

```bash
#!/bin/bash
# Script que se ejecuta en cron

ssh usuario@servidor.com "cd /var/www && git pull"
# ✅ Funciona sin interacción (usa clave SSH en cron)

# Sin claves SSH:
# ❌ No puede entrar (cron no puede escribir contraseña)
```

### 2. Cuentas de Servicio (Sin Contraseña)

```bash
# Usuario "deploy" sin contraseña (no puede hacer login interactivo)
sudo useradd -s /usr/sbin/nologin deploy

# Pero deploy puede acceder a otros servidores por SSH
ssh -i /home/deploy/.ssh/id_rsa usuario@servidor-produccion.com "deploy.sh"

# ✅ Automatización segura sin contraseña
```

### 3. Git + GitHub/GitLab

```bash
# Clonar repositorio privado (sin usuario/contraseña)
git clone git@github.com:usuario/privado.git

# SSH verifica automáticamente con clave local
# ✅ Acceso a repos privados sin credentials en .git/config
```

### 4. Transferencia de Archivos Segura (SCP/SFTP)

```bash
# Copiar archivos seguramente sin contraseña
scp archivo.txt usuario@servidor.com:/tmp/

# O con SFTP (más flexible)
sftp usuario@servidor.com
> put archivo.txt /tmp/
> get archivo-remoto.txt
```

### 5. Port Forwarding (Tunneling)

```bash
# Acceder a puerto remoto privado a través de SSH
ssh -L 3306:localhost:3306 usuario@servidor.com

# Ahora: localhost:3306 → servidor.com:3306 (cifrado por SSH)
# Ideal para BD remota, aplicaciones internas, etc.
```

## Administración de Múltiples Claves

### Caso: Diferentes Claves para Diferentes Servidores

```bash
# GitHub: una clave SSH
~/.ssh/github_rsa
~/.ssh/github_rsa.pub

# Empresa: otra clave SSH
~/.ssh/empresa_rsa
~/.ssh/empresa_rsa.pub

# Personal: otra clave SSH
~/.ssh/personal_rsa
~/.ssh/personal_rsa.pub
```

**Configuración: ~/.ssh/config**

```yaml
# GitHub
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_rsa

# Servidor empresa
Host empresa.com
  HostName empresa.com
  User admin
  IdentityFile ~/.ssh/empresa_rsa

# Servidor personal
Host mi-servidor.com
  HostName mi-servidor.com
  User usuario
  IdentityFile ~/.ssh/personal_rsa
```

**Uso:**

```bash
# SSH sabe qué clave usar automáticamente
ssh github.com                  # Usa github_rsa
ssh empresa.com                 # Usa empresa_rsa
ssh mi-servidor.com            # Usa personal_rsa
```

### Gestionar Claves en ssh-agent

```bash
# Ver claves cargadas en ssh-agent
ssh-add -l

# Añadir clave específica
ssh-add ~/.ssh/github_rsa

# Remover clave del agente
ssh-add -d ~/.ssh/github_rsa

# Limpiar todas las claves
ssh-add -D
```

## Seguridad: Mejores Prácticas

### ✅ Clave Privada

- ✅ **Passphrase fuerte:** Protege contra robo de clave
- ✅ **Permisos 600:** Solo tú puedes leer `~/.ssh/id_rsa`
- ✅ **Almacenamiento seguro:** No en nube sin cifrado
- ✅ **Backup seguro:** USB cifrado, caja fuerte
- ❌ **Nunca compartir:** Ni por email, ni en repos, ni en chat

### ✅ Clave Pública

- ✅ **Compartir libremente:** No hay secreto en clave pública
- ✅ **Publicar en:**
  - GitHub, GitLab, Gitea
  - Servidores autorizados
  - Servicios cloud (AWS, DigitalOcean, etc.)

### ✅ Servidor (authorized_keys)

- ✅ **Permisos correctos:**
  ```bash
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  ```
- ✅ **Auditar claves:** Revisar quién tiene acceso
  ```bash
  cat ~/.ssh/authorized_keys  # Ver todas las claves públicas
  ```
- ✅ **Rotar claves:** Remover claves antiguas/comprometidas
  ```bash
  # Editar authorized_keys, borrar línea, guardar
  nano ~/.ssh/authorized_keys
  ```

### ❌ Errores Comunes

- ❌ Clave privada sin passphrase (vulnerable)
- ❌ Permisos 644 en id_rsa (otros pueden leer)
- ❌ Copiar id_rsa.pub a authorized_keys (es al revés)
- ❌ Subir clave privada a GitHub por accidente
- ❌ Usar misma clave SSH para múltiples propósitos (crear una por servicio)

## Tipos de Claves: RSA vs EdDSA

| Aspecto | RSA 2048 | RSA 4096 | EdDSA (Ed25519) |
|---------|----------|----------|-----------------|
| **Seguridad** | ✅ Segura | ✅✅ Muy segura | ✅✅ Muy segura |
| **Tamaño clave** | 2048 bits | 4096 bits | 256 bits |
| **Velocidad** | Rápida | Más lenta | Muy rápida |
| **Compatibilidad** | Excelente | Excelente | Buena (algunos servidores viejos) |

**Recomendación actual:** EdDSA (Ed25519) si es soportado, sino RSA 4096

```bash
# Generar EdDSA (recomendado moderno)
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519

# Generar RSA 4096 (compatible, más seguro que 2048)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa
```

## Comparativa: Contraseña vs Clave SSH

| Aspecto | Contraseña | Clave SSH |
|---------|-----------|-----------|
| **Seguridad** | Débil (fuerza bruta) | Fuerte (criptografía) |
| **Automatización** | ❌ No | ✅ Sí |
| **Cuentas sin password** | ❌ No | ✅ Sí |
| **Complejidad** | Simple | Media |
| **Robo** | Fácil (usuario escribe) | Difícil (clave privada) |

**Conclusión:** Claves SSH > Contraseñas para acceso remoto seguro

---

## Relaciones

### Conecta con
- [[criptografia-conceptos-gpg|Criptografía: Conceptos Fundamentales]] — Asimétrica, firmas digitales
- [[tls|TLS]] — Otra aplicación de criptografía (HTTPS)
- [[red-linux|Configuración de Red en Linux]] — Acceso remoto en Linux

## Fuentes
- [Claves SSH para Acceso Remoto Seguro](https://www.josedomingo.org/pledin/2023/01/claves-ssh/) — Generación, setup, ssh-agent, casos de uso
