---
created: 2026-04-15
updated: 2026-04-15
type: audit
---

# Lint Report: Auditoría del Vault

**Fecha:** 2026-04-15  
**Alcance:** Análisis completo de `wiki/` (index.md, log.md, summaries, concepts)  
**Total de problemas encontrados:** 25+  

---

## Resumen Ejecutivo

El vault contiene **5 problemas críticos**, **8 problemas altos** y **12+ problemas medianos** que afectan la coherencia, navegabilidad y mantenibilidad. Los problemas principales son:

1. **Enlaces rotos** (breaking links to missing concepts)
2. **Páginas huérfanas** (9 archivos no referenciados)
3. **Sintaxis malformada** en links (patrón `[[|` en 8 archivos)
4. **Duplicación de contenido** entre concepts y summaries
5. **Estructura de directorios no estándar** (caracteres especiales, espacios)

---

## 1. ENLACES ROTOS (HIGH PRIORITY)

### 1.1 Conceptos Referenciados Pero Sin Archivo

| Concepto | Referenciado en | Estado | Fix |
|----------|-----------------|--------|-----|
| `[[libvirt]]` | kvm.md (L39), virt-manager-setup.md, curso-kvm.md | Archivo vacío (0 bytes) | Poblar `/wiki/concepts/libvirt.md` |
| `[[Vagrant]]` | kvm.md (L40), creacion-box-vagrant.md | No existe | Crear `/wiki/concepts/vagrant.md` |
| `[[Debian]]` | kvm.md (L40), creacion-box-vagrant.md | No existe | Crear o remover referencia |
| `[[Jekyll]]` | docker-jekyll.md (L44) | No existe | Crear `/wiki/concepts/jekyll.md` |
| `[[Ruby]]` | docker-jekyll.md (L44) | No existe | Crear `/wiki/concepts/ruby.md` |
| `[[Astro]]` | migracion-pledin-astro.md (L21) | No existe | Crear `/wiki/concepts/astro.md` |
| `[[Giscus]]` | migracion-pledin-astro.md (L21) | No existe | Crear `/wiki/concepts/giscus.md` |
| `[[Static Site Generators]]` | docker-jekyll.md, migracion-pledin-astro.md | No existe | Crear `/wiki/concepts/static-site-generators.md` |

### 1.2 Archivos Vacíos o Placeholders

```
wiki/Construcción de VPN mesh con Tailscale/Headscale.md     (0 bytes - VACÍO)
wiki/Cursos de virtualización con KVM/libvirt.md             (0 bytes - VACÍO)
```

**Fix:** Eliminar o poblar con contenido + mover a directorio estándar

---

## 2. PÁGINAS HUÉRFANAS (MEDIUM-HIGH PRIORITY)

Estos archivos existen pero **nunca son referenciados** desde otras páginas:

| Archivo | Líneas | Tema | Nota |
|---------|--------|------|------|
| `summaries/creacion-box-vagrant.md` | 70 | Vagrant box creation | Relacionado a KVM pero aislado |
| `summaries/curso-docker.md` | 159 | Docker course overview | Duplica contenido de introduccion-docker |
| `summaries/curso-kvm.md` | 150 | KVM course overview | Similar a curso-docker |
| `summaries/curso-python.md` | 120 | Python courses | Fuera de scope actual |
| `summaries/docker-jekyll.md` | 200+ | Docker + Jekyll | No en index.md |
| `summaries/migracion-pledin-astro.md` | 280+ | Pledin → Astro migration | Reciente pero orphanizada |
| `summaries/vpn-headscale-seguridad.md` | 260 | Headscale security | Referenciado entre VPN docs pero no en index |
| `summaries/vpn-headscale-rutas-dns.md` | 350 | Headscale DNS routing | Idem |
| `summaries/vpn-mesh-headscale.md` | 400 | VPN mesh architecture | Idem |

**Fix:** Agregar a `index.md` en secciones apropiadas O consolidar relacionadas

---

## 3. SINTAXIS MALFORMADA EN LINKS (HIGH PRIORITY)

### Patrón: `[[|Texto]]` Incorrecto

Estos archivos usan `[[|` que es inválido en Obsidian y rompe el parsing:

#### Archivo: `docker-jekyll.md` (L44-45)
```markdown
# ACTUAL (INCORRECTO):
- [[|Conecta con: Docker]], Jekyll]], Ruby]], Static Site Generators]]
- [[|Ejemplo de: Infrastructure as Code]]

# CORRECTO:
- Conecta con: [[Docker]], [[Jekyll]], [[Ruby]], [[Static Site Generators]]
- Ejemplo de: Infrastructure as Code
```

#### Archivos Afectados (8 total):
1. `docker-jekyll.md:44-45`
2. `migracion-pledin-astro.md:21`
3. `vpn-mesh-headscale.md:37-38`
4. `vpn-headscale-rutas-dns.md:30-31`
5. `vpn-headscale-seguridad.md:27-28`
6. `curso-kvm.md:38`
7. `curso-python.md:34`
8. `creacion-box-vagrant.md:43`

**Fix:** Batch replace en todos estos archivos:
```bash
sed -i 's/\[\[|//g; s/\]\], /]], [[/g' wiki/summaries/*.md
```

---

## 4. PROBLEMAS DE ESTRUCTURA Y DIRECTORIOS (MEDIUM-HIGH PRIORITY)

### 4.1 Directorios con Caracteres Especiales (No Obsidian-Safe)

```
wiki/Construcción de VPN mesh con Tailscale/              ❌ Espacios, acentos
wiki/Cursos de virtualización con KVM/                    ❌ Espacios
```

**Estándar establecido en CLAUDE.md:** `nombre-descriptivo.md` (minúsculas, guiones)

**Fix:** Migrar contenido a:
- `summaries/vpn-mesh-headscale.md` ← `Construcción de VPN mesh...`
- `summaries/curso-kvm.md` ← `Cursos de virtualización...`

### 4.2 Archivo Sin Directorio Padre Estándar
- `Creación de un box para Vagrant.md` - Está suelto en `wiki/`, no en `summaries/`

**Fix:** Mover a `wiki/summaries/creacion-box-vagrant.md` (ya existe el nombre, consolidar)

---

## 5. CONCEPTOS SIN PÁGINA (MEDIUM PRIORITY)

Términos mencionados en todo el vault pero **sin archivo dedicado**:

```
Infrastructure as Code          (ref: docker-jekyll.md, kubernetes.md)
Static Site Generators          (ref: docker-jekyll.md, migracion-pledin-astro.md)
Tailscale                        (ref: vpn articles)
Headscale                        (ref: vpn articles)
WireGuard                        (ref: vpn articles)
NAT Traversal                    (ref: vpn articles)
CI/CD                            (ref: docker-jekyll.md)
DevOps                           (ref: multiple)
Cloud Native                     (ref: kubernetes.md)
Virtualización (como concepto)   (ref: kvm.md → pero link roto)
```

**Recomendación:**
- Crear los 5+ conceptos más críticos (Infrastructure as Code, SSG, Cloud Native)
- Los demás pueden linkarse a artículos de Wikipedia o documentación externa
- O re-evaluar si deben estar en el vault dado el enfoque "solo cursos"

---

## 6. DUPLICACIÓN DE CONTENIDO (MEDIUM PRIORITY)

### 6.1 Docker Documentation Overlap

| Archivo | Líneas | Contenido Duplicado |
|---------|--------|-------------------|
| `concepts/docker.md` | 154 | Overview genérico de Docker |
| `summaries/introduccion-docker.md` | 210 | Introducción + instalación |
| `summaries/curso-docker.md` | 159 | Estructura del curso |

**Overlap específico:**
- **Tipos de virtualización:** Explicados en `introduccion-docker.md` y `concepts/docker.md`
- **Docker vs VMs:** Comparado en ambos
- **Instalación:** Pasos duplicados en concepto e introducción
- **Imágenes, contenedores, registros:** Concepto duplicado

**Fix:**
- `concepts/docker.md` → 80 líneas máx (definición conceptual)
- `introduccion-docker.md` → Mantener detallado (referencia a concepto al inicio)
- `curso-docker.md` → Puramente índice de módulos, sin duplicar contenido

### 6.2 Kubernetes Documentation Overlap

| Archivo | Overlap |
|---------|---------|
| `concepts/kubernetes.md` | Arquitectura, Pods, Storage |
| `summaries/introduccion-kubernetes.md` | Mismo contenido + más detalle |

**Fix:** `introduccion-kubernetes.md` debe comenzar: "Ver [[Kubernetes]] para concepto general"

### 6.3 Podman vs Docker Comparison

Comparativa repetida en:
- `concepts/podman.md` (tabla Docker vs Podman)
- `concepts/docker.md` (tabla inversa)
- `summaries/introduccion-podman.md`

**Fix:** Crear único archivo de comparativa, linkear desde ambos conceptos

---

## 7. INCONSISTENCIAS EN METADATA Y ENLACES (MEDIUM PRIORITY)

### 7.1 log.md Referencia Archivos Renombrados

```markdown
# EN log.md (líneas 27-34):
- ✏️ 00-curso-docker.md        ← YA NO EXISTE
- ✏️ 01-introduccion-docker.md ← RENOMBRADO a introduccion-docker.md
```

**Fix:** Actualizar log.md para que refleje nombres actuales

### 7.2 Archivos VPN Referenciados Mutuamente Pero No en Index

Los 3 archivos VPN (headscale-seguridad, rutas-dns, mesh) se referencian entre sí pero:
- **No aparecen en `index.md`**
- **Falta sección "Virtualización & Seguridad" o "VPN" en index**

**Fix:** Agregar a index.md bajo nueva sección

---

## 8. RELACIONES INCOMPLETAS (MEDIUM PRIORITY)

### Páginas que Referencian Pero No Son Referenciadas

**Ejemplo:** `concepts/contenedores.md`
- Referencia: `[[Docker]]`, `[[Podman]]`, `[[Kubernetes]]`
- **Pero:** Ninguno de esos referencia atrás a `[[Contenedores]]`

**Fix:** Agregar backlinks bidireccionales:
```markdown
# En concepts/docker.md:
### Conecta con
- Contenedores — Concepto base que Docker implementa
```

---

## 9. ESTADO DE DIRECTORIOS (LOW PRIORITY)

### Directorio `/wiki/analyses/` 

**Estado:** Existe pero vacío o sin archivos visibles

**Nota en CLAUDE.md:** "Síntesis propias, comparaciones"

**Fix:** 
- Crear primer archivo de análisis (ej: comparativa-orchestration.md)
- O remover si no se usa

---

## PLAN DE REMEDICIÓN (Ordered by Impact)

### FASE 1: CRITICAL (Esta semana)

- [ ] **T1.1** Arreglar sintaxis `[[|` en 8 archivos (Issue #3)
  - Command: `sed -i 's/\[\[|//g' wiki/summaries/{docker-jekyll,migracion-pledin-astro,vpn-*,curso-*,creacion-box}.md`
  
- [ ] **T1.2** Crear archivos de concepto faltantes
  - `concepts/libvirt.md` (referencia: https://libvirt.org/)
  - `concepts/vagrant.md`
  - Línea de comando: `touch wiki/concepts/{libvirt,vagrant}.md`

- [ ] **T1.3** Poblar o eliminar archivos vacíos
  - Decidir: ¿Mantener Headscale y libvirt en vault?
  - Si sí: Mover a `summaries/` y llenar contenido
  - Si no: Eliminar directorio `wiki/Construcción...` y `wiki/Cursos...`

### FASE 2: HIGH (Próximas 2 semanas)

- [ ] **T2.1** Agregar 9 archivos huérfanos a `index.md`
  - Crear sección "Artículos Adicionales" para VPN/Vagrant/Python
  - O consolidar VPN en subtema de Seguridad

- [ ] **T2.2** Consolidar documentación Docker
  - Reducir `concepts/docker.md` a 80-100 líneas
  - Agregar link a `introduccion-docker.md` desde concepto
  - Eliminar duplicación

- [ ] **T2.3** Reorganizar directorios
  - Mover archivos de `wiki/Construcción de...` a `summaries/`
  - Eliminar directorios con caracteres especiales

### FASE 3: MEDIUM (Próximos 30 días)

- [ ] **T3.1** Crear conceptos faltantes (si decide mantenerlos)
  - Infrastructure as Code
  - Static Site Generators
  - Cloud Native (vinculado a Kubernetes)

- [ ] **T3.2** Consolidar Kubernetes documentation
  - Aplicar mismo patrón que Docker (concepto + intro)

- [ ] **T3.3** Crear comparativa Podman-Docker unificada
  - Único source of truth

- [ ] **T3.4** Actualizar log.md
  - Corregir referencias a archivos renombrados

### FASE 4: POLISH (Mantenimiento continuo)

- [ ] **T4.1** Validar todos los links en Obsidian
  - Abrir vault en Obsidian
  - Revisar que no haya broken link indicators

- [ ] **T4.2** Asegurar backlinks bidireccionales
  - Si X referencia Y, Y debe referenciar X (donde lógico)

- [ ] **T4.3** Poblar `/wiki/analyses/`
  - Crear primer análisis comparativo
  - Ej: "Orquestación: Docker Compose vs Kubernetes vs Podman"

---

## IMPACTO DE NO ARREGLARSE

| Problema | Impacto | Severidad |
|----------|---------|-----------|
| Links `[[|` | Broken links en Obsidian, navegación rota | 🔴 ALTA |
| Concepto sin archivo | 404 links, confusión | 🟠 MEDIA |
| Páginas huérfanas | Contenido valioso invisible | 🟠 MEDIA |
| Duplicación | Mantenimiento 3x más difícil | 🟠 MEDIA |
| Directorios con espacios | Movimiento de archivo rompe en Obsidian | 🔴 ALTA |

---

## MÉTRICAS ACTUALES vs OBJETIVO

| Métrica | Actual | Objetivo | Gap |
|---------|--------|----------|-----|
| Enlaces rotos | 8+ | 0 | -8 |
| Páginas huérfanas | 9 | 0-2 (consolidadas) | -7 |
| Sintaxis malformada | 8 instancias | 0 | -8 |
| Conceptos sin página | 10+ | 0-5 (core only) | -5-10 |
| Documentación duplicada | 3+ secciones | 1 por tema | 50% reduction |
| Directorios estándar | 85% | 100% | -15% |

---

## PRÓXIMAS ACCIONES

**Responsable:** José (con soporte de Claude)  
**Fecha de inicio sugerida:** 2026-04-16  
**Fecha de completación objetivo:** 2026-05-01  

1. Revisar este reporte y confirmar prioridades
2. Ejecutar FASE 1 (critical fixes)
3. Re-audit después de FASE 1 para validar
4. Continuar con FASES 2-4

---

**Generado:** 2026-04-15 por Claude Lint Audit  
**Próximo audit sugerido:** 2026-05-15 (mensual)
