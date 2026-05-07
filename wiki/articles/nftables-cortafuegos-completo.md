---
created: 2026-05-07
updated: 2026-05-07
sources: [josedomingo-nftables-personal, josedomingo-nftables-nat, josedomingo-nftables-filtrado]
tags: [firewall, seguridad, redes]
title: "nftables: Cortafuegos Moderno - Personal, NAT y Perimetral"
---

# nftables: Cortafuegos Moderno - Personal, NAT y Perimetral

## Resumen de una línea
nftables es el framework moderno de netfilter para packet filtering que reemplaza iptables, permitiendo cortafuegos personales, NAT (SNAT/DNAT) y filtrado perimetral con sintaxis unificada y flexible.

## ¿Por Qué nftables vs iptables?

**iptables** (antiguo):
```bash
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -j DROP
```

❌ Problemas:
- Sintaxis compleja (cada protocolo diferente)
- Sin manera sencilla de listar reglas
- Lento al añadir reglas
- No hay forma de hacer cambios atómicos

**nftables** (moderno):
```bash
nft add rule inet filter input tcp dport 22 accept
nft add rule inet filter input tcp dport 80 accept
nft add rule inet filter input drop
```

✅ Ventajas:
- Sintaxis unificada y clara
- Listar/modificar reglas de forma legible
- Cambios atómicos (todo o nada)
- Mejor rendimiento
- Compatible con IPv4 e IPv6 nativamente

---

## Arquitectura: Tables, Chains, Rules

```
Table (inet/ip/ip6)
  ↓
Chain (input, output, forward, prerouting, postrouting)
  ↓
Rules (match → action)
```

### Tablas

| Tabla | Protocolo | Uso |
|-------|-----------|-----|
| **inet** | IPv4 + IPv6 | Recomendado (unificado) |
| **ip** | Solo IPv4 | Si necesitas específico |
| **ip6** | Solo IPv6 | Si necesitas específico |
| **nat** | IPv4 + IPv6 | NAT (SNAT, DNAT) |
| **filter** | Mismo que inet | Alternativa antigua |

### Chains

| Chain | Hook | Uso |
|-------|------|-----|
| **input** | Paquetes destinados a la máquina | Filtrar tráfico entrante |
| **output** | Paquetes originados en la máquina | Filtrar tráfico saliente |
| **forward** | Paquetes que atraviesan la máquina | Filtrado perimetral |
| **prerouting** | Antes de decisión de routing | NAT de destino (DNAT) |
| **postrouting** | Después de decisión de routing | NAT de origen (SNAT, masquerade) |

---

## Cortafuegos Personal: Proteger 1 Máquina

### Estructura Base

```bash
# 1. Crear tabla
nft add table inet filter

# 2. Crear chains con políticas por defecto
nft add chain inet filter input { type filter hook input priority 0; policy drop; }
nft add chain inet filter output { type filter hook output priority 0; policy accept; }

# Política DROP: todo rechazado excepto lo que permitimos explícitamente
# Política ACCEPT: todo permitido excepto lo que rechazamos explícitamente
```

### Reglas Básicas

```bash
# 1. Permitir loopback (localhost)
nft add rule inet filter input iif lo accept

# 2. Permitir conexiones establecidas
nft add rule inet filter input ct state established,related accept

# 3. Permitir SSH (puerto 22)
nft add rule inet filter input tcp dport 22 accept

# 4. Permitir DNS (puerto 53)
nft add rule inet filter input udp dport 53 accept

# 5. Permitir HTTP/HTTPS
nft add rule inet filter input tcp dport { 80, 443 } accept

# 6. Permitir ICMP (ping)
nft add rule inet filter input icmp type echo-request accept

# Rechazar lo demás (política drop ya lo hace)
```

### Listar y Eliminar Reglas

```bash
# Ver todas las reglas
nft list ruleset

# Ver solo tabla inet
nft list table inet filter

# Ver handles (IDs únicos)
nft list table inet filter -a

# Eliminar regla por handle
nft delete rule inet filter input handle 5
```

### Persistencia (No se Guarda en Reboot)

```bash
# Guardar configuración
nft list ruleset > /etc/nftables.conf

# Cargar configuración
nft -f /etc/nftables.conf

# O instalar servicio systemd
systemctl enable nftables
systemctl start nftables

# El archivo se carga automáticamente en boot desde /etc/nftables.conf
```

---

## NAT: Traducción de Direcciones (SNAT/DNAT)

NAT modifica direcciones de origen o destino en paquetes. Usado por:
- **SNAT:** Máquinas locales → Internet (masquerade)
- **DNAT:** Conexiones externas → Servidores internos (port forwarding)

### SNAT: Local a Internet (Masquerade)

**Escenario:** Computadoras en red local (192.168.100.0/24) acceden a internet a través del cortafuegos.

```
Máquina local (192.168.100.10)
  ↓ tráfico a internet
Cortafuegos: cambia IP origen (192.168.100.10 → 203.0.113.50)
  ↓
Internet ve 203.0.113.50 (IP pública del cortafuegos)
  ↓ respuesta
Cortafuegos: restaura IP origen (203.0.113.50 → 192.168.100.10)
  ↓
Máquina local recibe respuesta
```

**Configuración:**

```bash
# Crear tabla NAT
nft add table nat

# Chain postrouting (después de routing)
nft add chain nat postrouting { type nat hook postrouting priority 0; }

# Masquerade: cambiar origen a IP del cortafuegos automáticamente
nft add rule nat postrouting oif eth0 masquerade

# oif = output interface (eth0 es la interfaz hacia internet)
```

### DNAT: Internet a Servidor Interno (Port Forwarding)

**Escenario:** Servicio web interno (192.168.100.10:8080) accesible desde internet en puerto 80.

```
Internet → 203.0.113.50:80 (cortafuegos)
  ↓
DNAT: cambia destino (203.0.113.50:80 → 192.168.100.10:8080)
  ↓
Servidor interno recibe en :8080
```

**Configuración:**

```bash
# Chain prerouting (antes de routing)
nft add chain nat prerouting { type nat hook prerouting priority 0; }

# Port forwarding: 80 → 192.168.100.10:8080
nft add rule nat prerouting iif eth0 tcp dport 80 \
  dnat to 192.168.100.10:8080

# iif = input interface (tráfico que entra por eth0)
```

### PAT: Port Address Translation

Cambiar puertos además de IPs (útil para servicios en puertos no estándar).

```bash
# Redirigir puerto 2222 → servidor interno SSH (22)
nft add rule nat prerouting iif eth0 tcp dport 2222 \
  dnat to 192.168.100.10:22
```

### Requisito: IP Forwarding

**Sin esto, NAT no funciona (paquetes se descartan):**

```bash
# Habilitar forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward

# Persistente (en /etc/sysctl.conf)
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p
```

---

## Cortafuegos Perimetral: Proteger Red Completa

**Escenario:** Cortafuegos en borde de red, protege computadoras locales + servidores internos.

```
Internet ← [Cortafuegos con nftables] → Red Local (192.168.100.0/24)
```

### Three Chains

```
INPUT:   Tráfico → cortafuegos
OUTPUT:  Tráfico ← cortafuegos
FORWARD: Tráfico local ↔ internet (traverse)
```

### Configuración Completa

```bash
# Tabla y chains
nft add table inet filter

# INPUT: rechazar todo por defecto
nft add chain inet filter input { type filter hook input priority 0; policy drop; }

# OUTPUT: permitir todo (más flexible)
nft add chain inet filter output { type filter hook output priority 0; policy accept; }

# FORWARD: rechazar todo por defecto (control estricto)
nft add chain inet filter forward { type filter hook forward priority 0; policy drop; }

# --- INPUT RULES (al cortafuegos) ---

# Loopback
nft add rule inet filter input iif lo accept

# Conexiones establecidas
nft add rule inet filter input ct state established,related accept

# SSH desde subnet de administración
nft add rule inet filter input iif eth1 tcp dport 22 accept

# --- FORWARD RULES (entre redes) ---

# Conexiones establecidas
nft add rule inet filter forward ct state established,related accept

# Red local → internet (permitir salida)
nft add rule inet filter forward iif eth1 oif eth0 accept

# Internet → servicios internos (via DNAT previo)
nft add rule inet filter forward iif eth0 oif eth1 accept
```

### Políticas Típicas

**Redes Locales (eth1: 192.168.100.0/24):**
```bash
# Permitir: DNS, HTTP/HTTPS, SSH, ping
nft add rule inet filter forward \
  iif eth1 oif eth0 ip protocol icmp accept
nft add rule inet filter forward \
  iif eth1 oif eth0 tcp dport { 80, 443, 22 } accept
nft add rule inet filter forward \
  iif eth1 oif eth0 udp dport 53 accept

# Prohibir: P2P, torrents, etc. (puerto 6881-6889)
nft add rule inet filter forward \
  tcp dport { 6881-6889 } drop
```

---

## Ejemplo Completo: Cortafuegos de Laboratorio Educativo

**Topology:**
```
Internet (eth0: 203.0.113.50)
  ↓
Cortafuegos nftables
  ↓
Red de laboratorio (eth1: 192.168.100.0/24)
  ├─ Máquinas estudiantes
  ├─ Servidor web (192.168.100.10)
  └─ Servidor DNS (192.168.100.20)
```

**Configuración:**

```bash
#!/bin/bash
# nftables.conf

flush ruleset

# Crear tabla y chains
add table inet filter
add table nat

# INPUT
add chain inet filter input { type filter hook input priority 0; policy drop; }

# OUTPUT
add chain inet filter output { type filter hook output priority 0; policy accept; }

# FORWARD
add chain inet filter forward { type filter hook forward priority 0; policy drop; }

# NAT
add chain nat postrouting { type nat hook postrouting priority 0; }
add chain nat prerouting { type nat hook prerouting priority 0; }

# --- INPUT RULES (al cortafuegos) ---
add rule inet filter input iif lo accept
add rule inet filter input ct state established,related accept
add rule inet filter input iif eth1 tcp dport 22 accept

# --- NAT RULES ---
# SNAT: estudiantes → internet
add rule nat postrouting oif eth0 masquerade

# DNAT: internet → servidor web interno
add rule nat prerouting iif eth0 tcp dport 80 dnat to 192.168.100.10:80

# --- FORWARD RULES ---
# Conexiones establecidas
add rule inet filter forward ct state established,related accept

# Estudiantes → internet
add rule inet filter forward iif eth1 oif eth0 accept

# Internet → servidor web
add rule inet filter forward iif eth0 oif eth1 tcp dport 80 accept

# Estudiantes pueden:
# - DNS
add rule inet filter forward iif eth1 oif eth1 udp dport 53 accept
# - Ping
add rule inet filter forward iif eth1 oif eth0 icmp type echo-request accept
# - HTTP/HTTPS
add rule inet filter forward iif eth1 oif eth0 tcp dport { 80, 443 } accept

# Bloquear P2P/torrents
add rule inet filter forward tcp dport { 6881-6889 } drop
```

**Usar:**

```bash
nft -f nftables.conf
systemctl enable nftables
systemctl start nftables
```

---

## Debugging: Ver qué Se Rechaza

```bash
# Ver paquetes rechazados (kernel logging)
dmesg | tail -20

# O con syslog
grep nft /var/log/syslog

# Añadir logging a reglas
nft add rule inet filter input drop comment "log dropped" log

# Ver estadísticas
nft list ruleset -s
```

---

## Comparativa: Casos de Uso

| Caso | Chains | Policy | Ejemplos |
|------|--------|--------|----------|
| **Personal (máquina)** | input/output | drop/accept | SSH, web, DNS |
| **Cortafuegos interno** | input/output/forward | drop/accept/drop | Proteger subnet |
| **DMZ (servidores)** | forward + NAT | drop + DNAT | Exponer servicios |
| **Gateway NAT** | postrouting | accept | Masquerade local |

---

## Mejores Prácticas

✅ **Política por defecto DROP:** Denegar todo, permitir explícitamente

✅ **Ordenar reglas:** Específicas primero, genéricas después

✅ **Estateful:** Usar `ct state established,related` para conexiones activas

✅ **Logging:** Registrar lo que se rechaza para debuggin

✅ **Backup:** Guardar con `nft list ruleset > backup.conf`

❌ **Errores comunes:**
- ❌ Política accept por defecto (inseguro)
- ❌ Olvidar IP forwarding para NAT
- ❌ No permitir conexiones establecidas
- ❌ Reglas muy complejas sin comentarios

---

## Relaciones

### Conecta con
- [[ssh-claves-autenticacion|SSH: Autenticación por Claves]] — Acceso seguro a cortafuegos
- [[red-linux|Configuración de Red en Linux]] — Interfaces, enrutamiento
- [[tls|TLS]] — Cifrado de datos (complementario a cortafuegos)

## Fuentes
- [Cortafuegos Personal con nftables](https://www.josedomingo.org/pledin/2019/12/nftables-cortafuegos-personal/) — Estructura básica, reglas fundamentales
- [nftables: NAT Perimetral](https://www.josedomingo.org/pledin/2020/01/nftables-cortafuegos-perimetral-nat/) — SNAT, DNAT, PAT, masquerade
- [nftables: Cortafuegos Perimetral Filtrado](https://www.josedomingo.org/pledin/2020/01/nftables-cortafuegos-perimetral-filtrado/) — Forward chain, políticas complejas, laboratorios educativos
