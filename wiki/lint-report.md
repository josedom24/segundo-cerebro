---
created: 2026-05-07
updated: 2026-05-07
title: "Lint Report - Mayo 2026"
---

# Lint Report - Mayo 2026

**Fecha:** 2026-05-07
**Archivos analizados:** 152 (35 conceptos + 103 summaries + 13 articles + 3 analyses)
**Estado:** ⚠️ Requiere atención (4 categorías de problemas)

---

## 📊 Resumen Ejecutivo

| Categoría | Cantidad | Severidad |
|-----------|----------|-----------|
| **Title != H1** | 6 archivos | 🟡 Media |
| **Sin title en frontmatter** | 2 archivos | 🟡 Media |
| **Archivos huérfanos** | 2 archivos | 🟠 Alta (potenciales duplicados) |
| **Tags con < 3 ocurrencias** | ~30 tags | 🟢 Baja |
| **Enlaces rotos reales** | 0 | ✅ Limpio |

---

## 🔴 1. Archivos Donde TITLE != H1 (6)

**Norma:** El campo `title` del frontmatter debe coincidir exactamente con el H1 del documento.

| Archivo | Title (frontmatter) | H1 actual | Acción |
|---------|---------------------|-----------|--------|
| `redes-kvm.md` | `Redes en KVM - libvirt` | `Redes en KVM/libvirt` | Unificar a `Redes en KVM - libvirt` |
| `almacenamiento-virsh.md` | `Almacenamiento en KVM - libvirt con virsh` | `Almacenamiento en KVM/libvirt con virsh` | Unificar |
| `introduccion-kvm.md` | `Introducción a la Virtualización con KVM - libvirt` | `Introducción a la Virtualización con KVM/libvirt` | Unificar |
| `almacenamiento-kvm.md` | `Almacenamiento en KVM - virt-manager` | `Almacenamiento en KVM/virt-manager` | Unificar |
| `vagrant-introduccion.md` | `Vagrant - Introducción y Conceptos Fundamentales` | `Vagrant: Introducción y Conceptos Fundamentales` | Unificar |
| `vagrant-libvirt-configuracion.md` | `Vagrant + libvirt - Configuración...` | `Vagrant + libvirt: Configuración...` | Unificar |

**Recomendación:** Cambiar H1 para que coincida con title (más simple).

---

## 🟡 2. Archivos SIN `title` en Frontmatter (2)

**Norma:** Todos los archivos deben tener `title:` en frontmatter.

- ❌ `concepts/red-linux.md` → Añadir `title: "Configuración de Red en Linux"`
- ❌ `concepts/resolucion-nombres-linux.md` → Añadir `title: "Resolución de Nombres en Linux"`

---

## 🟠 3. Archivos Huérfanos (Sin Backlinks)

**Norma:** Cada archivo debe tener al menos 1 enlace de entrada (estar referenciado).

### Archivos huérfanos legítimos (esperado):
- ✅ `index.md` — Es el catálogo principal
- ✅ `log.md` — Es el historial

### Archivos huérfanos a investigar:
- ⚠️ `summaries/correo-envio-remoto.md` (159 líneas)
- ⚠️ `summaries/correo-recepcion-remota.md` (141 líneas)

**Análisis:** Probablemente son duplicados/obsoletos:
- `correo-envio-remoto` ↔ `correo-envio-a-internet` + `correo-clientes-remotos`
- `correo-recepcion-remota` ↔ `correo-recepcion-desde-internet` + `correo-clientes-remotos`

**Acciones posibles:**
1. ✂️ **Eliminar** si son duplicados obsoletos
2. 🔗 **Añadir al index** si tienen contenido único
3. 🔄 **Fusionar** con archivos existentes

**Recomendación:** Revisar contenido manualmente para decidir.

---

## 🟢 4. Tags con Pocas Ocurrencias (< 3)

**Norma:** Los tags deben ser generales y aparecer en 3+ documentos. Tags con 1-2 ocurrencias deben consolidarse.

### Tags Nuevos (Aceptables - introducidos hoy)
Estos son tags nuevos que esperamos crecer:
- 🆕 `vpn` (1) — Headscale (OK, probablemente más artículos VPN)
- 🆕 `criptografia` (1) — Recientes (OK)
- 🆕 `ssh` (1) — Reciente (OK)
- 🆕 `firewall` (1) — Reciente (OK)
- 🆕 `cloud` (2) — KVM/Proxmox cloud-init (OK, crecerá)

### Tags a Consolidar (existentes con 1 ocurrencia):

| Tag actual | Documentos | Sugerencia consolidación |
|------------|------------|--------------------------|
| `dnsmasq`, `caching`, `dhcp` | 1 c/u | → `dns` (ya con 19 ocurrencias) |
| `networkmanager`, `netplan`, `ifupdown` | 1 c/u | → `redes` (ya con 26) |
| `escalabilidad`, `alta-disponibilidad`, `balanceo` | 1 c/u | → `redes` |
| `pod`, `service`, `route`, `volume`, `statefulset`, `template`, `paas`, `deploymentconfig`, `build`, `imagestream` | 1 c/u | → `kubernetes`/`openshift` |
| `https` | 1 | → `seguridad` (con 21) |
| `aplicaciones`, `modulos` | 1 c/u | → `apache` (con 11) |
| `resolucion-nombres` | 1 | → `dns` |

**Total:** ~20 tags candidatos a consolidación.

**Recomendación:** Consolidar en próxima sesión de mantenimiento (no urgente).

---

## ✅ 5. Lo que Está Bien

- ✅ **0 enlaces rotos reales** (los detectados son falsos positivos en `log.md`)
- ✅ **Estructura de carpetas** consistente (concepts, summaries, articles, analyses)
- ✅ **30+ tags consolidados** con buena cobertura (redes, openshift, configuración, kubernetes, seguridad)
- ✅ **156 archivos** total bien organizados
- ✅ **Frontmatter** presente en todos los archivos

---

## 📋 Plan de Acción Recomendado

### Inmediato (15 min)
1. ✅ Corregir 6 archivos con title != H1 (cambiar H1 para que coincida)
2. ✅ Añadir `title:` a 2 conceptos red-linux y resolucion-nombres-linux

### Corto plazo (30 min)
3. ✅ Investigar 2 archivos huérfanos de correo (eliminar/fusionar/integrar)

### Medio plazo (1-2 horas, opcional)
4. ⚙️ Consolidar tags específicos en generales (~20 tags)

---

## 📈 Estadísticas del Wiki

```
Total archivos: 152
├─ Conceptos: 35 (23%)
├─ Summaries: 103 (68%)
├─ Articles: 13 (8.5%)
└─ Analyses: 3 (2%)

Tags utilizados: 60+ (30+ consolidados, ~30 candidatos a consolidar)
Enlaces internos: 157 únicos
Enlaces rotos: 0 (✅)
```

### Top 10 Tags

```
26 redes
25 openshift
25 configuracion
23 kubernetes
21 seguridad
19 kvm
19 dns
16 contenedores
14 linux
12 podman
```

### Crecimiento Reciente

```
2026-05-07: +6 artículos + 1 análisis
- Headscale VPN
- KVM cloud-init
- Criptografía + GPG
- SSH claves
- nftables
- Proxmox cloud-init
- OpenStack vs Proxmox (análisis)
```

---

## 🎯 Próxima Limpieza

**Recomendada:** 2026-06-07 (1 mes)

**Verificar:**
- ¿Han crecido los nuevos tags (vpn, criptografia, ssh, firewall, cloud) a 3+?
- ¿Hay nuevos huérfanos?
- ¿Aparecen contradicciones entre artículos nuevos y summaries?
