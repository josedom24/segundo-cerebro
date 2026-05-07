---
created: 2026-05-07
updated: 2026-05-07
sources: [josedomingo-headscale-mesh, josedomingo-headscale-rutas-dns, josedomingo-headscale-seguridad]
tags: [vpn, seguridad, redes]
title: "Headscale: VPN Mesh - Instalación, Configuración y Seguridad"
---

# Headscale: VPN Mesh - Instalación, Configuración y Seguridad

## Resumen de una línea
Headscale es el control plane open-source para construir VPNs mesh descentralizadas con Tailscale, incluyendo routing avanzado, DNS dinámico y control de acceso granular.

## ¿Qué es Headscale?

Tailscale opera bajo un modelo **Open Core**: el cliente es open-source, pero el servidor de coordinación es propietario. **Headscale** es la alternativa open-source que replaces el control plane proprietary manteniendo total soberanía sobre metadatos y tráfico.

### Arquitectura de Dos Capas

```
┌─ Control Plane (Headscale)
│  ├─ Autenticación de usuarios
│  ├─ Distribución de rutas
│  └─ Gestión de políticas (ACLs)
│
└─ Data Plane (WireGuard)
   ├─ Tráfico P2P encriptado
   ├─ "Zero Trust" — verificación continua
   └─ Soberanía total del administrador
```

## Instalación y Setup

### Requisitos del Servidor

```
✅ IP estática o dominio público
✅ Certificado SSL (Let's Encrypt)
✅ Puertos 443/tcp y 80/tcp abiertos
✅ Mínimo: 1 vCPU, 1GB RAM (para redes pequeñas-medianas)
```

### Instalación con Docker

```bash
# 1. Crear estructura
mkdir -p headscale/{config,data}

# 2. Docker Compose con reverse proxy
# (nginx → headscale:8080)

# 3. Crear usuario
headscale user create classroom

# 4. Registrar nodos
# - Método interactivo: confirmación manual
# - Pre-auth keys: automatización
```

### Verificar Conectividad

```bash
tailscale status           # Listar nodos conectados
tailscale ping <nodo-ip>   # Verificar comunicación
```

## Configuración Avanzada: Routing y DNS

### Subnet Routers (Puertas de Enlace)

Nodos que actúan como gateway a redes físicas locales:

```bash
# En el gateway:
sudo tailscale up --advertise-routes=192.168.1.0/24 --accept-routes

# Luego en Headscale (manual o automático):
# Aprobar que clientes usen esta ruta
```

**Casos de uso:**
- Acceso a servidores internos desde VPN
- Laboratorios: estudiantes acceden a recursos de clase
- Oficinas distribuidas: conectar múltiples sedes

### Exit Nodes (Salida a Internet)

Encaminar todo el tráfico internet a través de un gateway confiable:

```bash
# En el nodo:
tailscale up --advertise-exit-node

# Resultado: estudiantes trafican por el gateway
# Ventaja: seguridad en WiFi público, control centralizado
```

### MagicDNS (DNS Automático)

Headscale registra automáticamente nombres de dispositivos:

```
dispositivo.headscale.net → 100.x.x.x
```

**Ventaja:** Acceso por nombre en lugar de IP cambiante

### Split DNS (DNS Selectivo)

Encaminar solo ciertos dominios a servidores específicos:

```yaml
# config.yaml
dns:
  routes:
    josedomingo.org: 192.168.1.100  # DNS interno
    "*.local": 192.168.1.100
    "*": 8.8.8.8                     # Resto → Google
```

**Aplicación práctica:**
- Classroom → DNS interno para `classroom.josedomingo.org`
- Internet público → DNS público (8.8.8.8, 1.1.1.1)

## Seguridad: Control de Acceso y Aislamiento

### ACLs (Access Control Lists)

Reglas JSON que definen quién puede comunicar con quién. **Principio:** "Deny by default" — si no hay regla explícita, se bloquea.

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:alumno"],
      "dst": ["tag:recurso:*"]
    },
    {
      "action": "deny",
      "src": ["tag:alumno"],
      "dst": ["tag:alumno"]
    }
  ]
}
```

**Interpretación:**
- ✅ Estudiantes → Recursos de clase
- ❌ Estudiante → Estudiante (bloqueado)

### Tags (Etiquetas de Dispositivo)

Agrupar dispositivos por **función**, no por propietario:

```
tag:alumno      → Dispositivos de estudiantes
tag:profesor    → Dispositivos de docentes
tag:recurso     → Servidores/recursos compartidos
```

**Ventaja:** Un dispositivo cambia de rol sin cambiar usuario

### Dos Estrategias de Aislamiento

#### Estrategia 1: Red Unificada con Tags (Escalable)

```
┌─ Todos en headscale.net
│  ├─ tag:alumno (aislados por ACL)
│  ├─ tag:profesor (acceso total)
│  └─ tag:recurso (compartido)
└─ Control granular por reglas
```

**Ventajas:**
- ✅ Escalable a 100+ dispositivos
- ✅ Políticas centralizadas
- ✅ Cambios de rol sin reconectar

**Desventajas:**
- Require entender ACLs JSON
- Configuración más compleja

#### Estrategia 2: User Segmentation (Simple)

```
┌─ usuario:alumno1 (usuario separado)
│  └─ Solo ve sus propios nodos
│
├─ usuario:alumno2
│  └─ Solo ve sus propios nodos
│
└─ usuario:profesor
   └─ Ve todo
```

**Ventajas:**
- ✅ Seguridad por aislamiento por defecto
- ✅ Configuración simple

**Desventajas:**
- ❌ Difícil escalar (muchos usuarios)
- ❌ Administración tedosa

### Recomendación

- **< 30 dispositivos:** Estrategia 2 (usuarios separados)
- **> 30 dispositivos:** Estrategia 1 (tags + ACLs)

## Casos de Uso Reales

### Laboratorio Educativo

```
Profesor (exit node)
  ↓ (gateway a 192.168.1.0/24)
Estudiantes (tag:alumno)
  ├─ Acceso a: servidor clase, impresora, almacenamiento
  └─ NO pueden: ver dispositivos unos de otros
```

**Implementación:** Estrategia 1 (tags) + subnet router

### Oficinas Distribuidas

```
Oficina A ──┐
             ├─ Headscale Central
Oficina B ──┤
             ├─ Tráfico P2P entre oficinas
Oficina C ──┘   (no pasa por servidor)
```

### Acceso Remoto Seguro

```
Admin en WiFi público
  ↓ (exit node en datacenter)
Tráfico cifrado + controlado
  ↓
Infraestructura interna
```

## Flujo de Configuración Típico

1. **Instalar Headscale** con Docker + reverse proxy
2. **Crear usuarios** (usuarios = namespaces lógicos)
3. **Registrar nodos** (interactivo o pre-auth keys)
4. **Configurar DNS** (MagicDNS + Split DNS en config.yaml)
5. **Definir ACLs** (si usas tags + Estrategia 1)
6. **Aprobar rutas** (subnet routers, exit nodes)
7. **Verificar conectividad** (tailscale status, ping)

## Ventajas de Headscale vs Tailscale Cloud

| Aspecto | Headscale | Tailscale |
|---------|-----------|-----------|
| **Costo** | Gratis | Freemium + premium |
| **Soberanía** | 100% | Datos en servidores Tailscale |
| **Customización** | Total | Limitada |
| **Escalabilidad** | Depende del servidor | Ilimitada (cloud) |
| **Open Source** | ✅ Sí | ❌ Solo clientes |

## Limitaciones y Consideraciones

⚠️ **Punto único de fallo:** Si Headscale cae, no se pueden registrar nuevos nodos (conexiones P2P existentes siguen funcionando)

✅ **Solución:** Alta disponibilidad (2+ instancias + base de datos compartida)

---

## Relaciones

### Conecta con
- [[red-linux|Configuración de Red en Linux]] — Fundamentos (IP, rutas, DNS)
- [[tls|TLS]] — Encriptación de tráfico VPN
- [[spf|SPF]] — Control de acceso (similar concepto)

## Fuentes
- [VPN Mesh con Tailscale/Headscale](https://www.josedomingo.org/pledin/2026/02/vpn-mesh-headscale/) — Instalación y arquitectura
- [Rutas y DNS en Headscale](https://www.josedomingo.org/pledin/2026/02/vpn-mesh-headscale-rutas-dns/) — Routing avanzado y DNS dinámico
- [Seguridad y Control de Acceso en Headscale](https://www.josedomingo.org/pledin/2026/03/vpn-mesh-headscale-seguridad-control-acceso/) — ACLs, tags y aislamiento
