---
created: 2026-04-19
updated: 2026-04-19
sources: [dns_balanceo_carga]
tags: [dns, balanceo, escalabilidad, alta-disponibilidad]
title: "DNS para Balanceo de Carga"
---

# DNS para Balanceo de Carga

## Resumen de una línea
Técnicas DNS (round robin y delegación) para distribuir tráfico entre múltiples servidores sin hardware adicional.

## Introducción

DNS puede usarse para **distribuir carga** entre servidores sin necesidad de hardware especial (load balancers). El cliente automaticamente conecta a servidores diferentes según la resolución DNS.

## Técnica 1: DNS Round Robin (A Records)

### Concepto

Múltiples registros A apuntan el mismo dominio a IPs diferentes:

```
www.example.com    IN    A    10.1.1.101
www.example.com    IN    A    10.1.1.102
www.example.com    IN    A    10.1.1.103
```

### Cómo Funciona

1. Cliente pregunta por `www.example.com`
2. DNS retorna **3 IPs en orden diferente** cada vez:
   - Respuesta 1: [10.1.1.101, 10.1.1.102, 10.1.1.103]
   - Respuesta 2: [10.1.1.102, 10.1.1.103, 10.1.1.101]
   - Respuesta 3: [10.1.1.103, 10.1.1.101, 10.1.1.102]

3. Cliente conecta a **la primera IP** de la lista
4. Resultado: **distribución aproximadamente uniforme**

### Ventajas
- ✅ Sin hardware adicional
- ✅ Configurable en DNS
- ✅ Simple de implementar

### Limitaciones
- ❌ **Sin high availability** — Si servidor cae, clientes aún lo reciben
- ❌ Sin verificación de salud
- ❌ Cliente espera timeout (3-30 seg) antes de reintentar

## Técnica 2: Delegación DNS (NS + dnsmasq)

### Arquitectura

```
Servidor DNS principal (Bind9)
    ↓
www.example.com → CNAME → www.http.example.com
    ↓
www.http.example.com → NS → nodo1.http.example.com
                    → NS → nodo2.http.example.com
    ↓
nodo1 (10.1.1.101): dnsmasq responde
nodo2 (10.1.1.102): dnsmasq responde (failover)
```

### Configuración en Bind9

**En zona principal (db.example.com):**
```
www         IN    CNAME    www.http.example.com.

$ORIGIN http.example.com.
@           IN    NS       nodo1.http.example.com.
@           IN    NS       nodo2.http.example.com.
nodo1       IN    A        10.1.1.101
nodo2       IN    A        10.1.1.102
```

### Configuración en Servidores (dnsmasq)

**En nodo1 (10.1.1.101): /etc/dnsmasq.conf**
```
local=/http.example.com/
address=/www.http.example.com/10.1.1.101
```

**En nodo2 (10.1.1.102): /etc/dnsmasq.conf**
```
local=/http.example.com/
address=/www.http.example.com/10.1.1.102
```

### Cómo Funciona

1. Cliente pregunta por `www.example.com` → Bind9
2. Bind9 dice: "Pregunta a nodo1.http.example.com o nodo2.http.example.com"
3. Cliente pregunta a **nodo1** (primera NS)
   - Si nodo1 responde → cliente usa 10.1.1.101
   - Si nodo1 falla → cliente pregunta a **nodo2** (segunda NS)
   - nodo2 responde con 10.1.1.102

### Ventajas
- ✅ **High availability** — Failover automático si servidor cae
- ✅ Sin timeout de cliente
- ✅ Cada servidor controla su propia respuesta
- ✅ Escalable (agregar más NS para más servidores)

### Limitaciones
- ⚠️ Más complejo de configurar
- ⚠️ Requiere dnsmasq en cada servidor

## Comparativa: Round Robin vs Delegación

| Aspecto | Round Robin | Delegación |
|---------|------------|-----------|
| **Implementación** | Simple (solo DNS) | Compleja (Bind9 + dnsmasq) |
| **High Availability** | ❌ No | ✅ Sí |
| **Failover automático** | ❌ No | ✅ Sí |
| **Distribución** | Aproximada | Automática por NS |
| **Escalabilidad** | ✅ Fácil (agregar A) | ✅ Fácil (agregar NS) |
| **Verificación salud** | ❌ No | Implícita (DNS responde) |

## Casos de Uso

### ✅ Round Robin
- Servidores con igual potencia
- Baja tasa de fallos esperada
- Clientes reintentarán automáticamente

### ✅ Delegación DNS
- **Alta disponibilidad requerida** (web crítico)
- Servidores pueden fallar
- Sin hardware load balancer disponible
- Entornos educativos/laboratorios

## Limitaciones Generales

1. **TTL bajo** — Cambios en DNS toman tiempo (TTL de registros)
2. **Sin verificación de salud real** — DNS no "ping" servidores
3. **Distribución imperfecta** — Round robin depende del cliente
4. **Estado de sesión** — Cada conexión puede ir a servidor diferente

## Solución Moderna: Comparativa con Load Balancers

| Solución | Costo | Complejidad | HA | L4/L7 |
|----------|-------|-------------|----|----|
| **DNS RR** | 🟢 Gratis | 🟢 Simple | 🔴 No | 🟢 L7 |
| **DNS Delegación** | 🟢 Gratis | 🟡 Media | 🟢 Sí | 🟢 L7 |
| **HAProxy/Nginx** | 🟢 Gratis | 🟡 Media | 🟢 Sí | 🟢 L4/L7 |
| **Load Balancer HW** | 🔴 Caro | 🟡 Media | 🟢 Sí | 🟢 L4/L7 |

## Relaciones

### Conecta con
- [[dns-conceptos-fundamentales|Fundamentos de DNS]] — Registros A, NS, CNAME
- [[dns-bind9-configuracion|Configuración de Bind9]] — Configuración de zonas
- [[dns-bind9-subdominios|Subdominios en Bind9]] — Delegación de subdominios
- [[dnsmasq-servidor-dns-ligero|dnsmasq]] — Implementación en servidores secundarios

## Fuentes
- [DNS para Balanceo de Carga](https://www.josedomingo.org/pledin/2022/02/dns-balanceo-carga/) — Técnicas round robin y delegación
