---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas_curso]
tags: [openshift, paas, cloud-computing, introduction]
---

# Introducción a OpenShift v4 como PaaS (Curso 2 - Módulo 1)

## Resumen
OpenShift como plataforma PaaS: características que lo distinguen de Kubernetes puro, automatización de despliegues, integración DevOps, y opciones de instalación (cloud, on-premise, local).

## Conceptos Clave

### OpenShift como PaaS
**Definición:** Plataforma que permite a desarrolladores enfocarse en código, no en infraestructura

**Características PaaS:**
- No escribir YAML de Kubernetes
- Herramientas de despliegue automático
- Construcción automática de imágenes (S2I, BuildConfig)
- Ciclo de vida simplificado
- Despliegue continuo (Git → automatización)
- Integración CI/CD nativa
- Despliegue multi-entorno (dev/test/prod)
- Herramientas de métrica y monitorización
- Plantillas parametrizadas
- Interfaces: web, CLI, API

### Hereda de Kubernetes pero Simplifica
- **Kubernetes puro:** YAML manual, complejidad DevOps
- **OpenShift:** Abstracción, automatización, desarrollador-friendly

### Flujo PaaS Típico
```
Desarrollador: escribir código
    ↓
Git push
    ↓ (OpenShift webhook)
BuildConfig automático
    ↓
S2I detecta lenguaje
    ↓
Imagen construida
    ↓
Despliegue automático
    ↓
Aplicación corriendo
```

### Construcción Automática: S2I (Source to Image)
- **Sin Dockerfile requerido**
- **Detecta tipo:** package.json → Node, requirements.txt → Python, etc.
- **Builder images confiables:** Mantenidas por Red Hat
- **Seguro:** No necesita Dockerfile personalizado

### Integración CI/CD
- **Webhooks GitHub:** Push → build automático
- **Tekton:** Pipeline declarativo
- **Knative:** Serverless
- **Helm:** Package management

### Multi-entorno
```
Desarrollo → Pruebas → Producción
(Same template, different params)
```

## Opciones de Instalación

### Cloud Services (Managed)
- AWS, Azure, IBM
- Red Hat maneja infraestructura
- Escalable automáticamente
- Coste por uso

### Self-Managed (On-Premise)
- Instalación en servidores propios
- Control total
- Requiere equipo DevOps
- Capex vs Opex

### Dedicated (Híbrido)
- Infraestructura propia o cloud
- Red Hat administra OpenShift
- Control del hardware

### Developer Sandbox (Pruebas)
- Gratuito, 1 mes
- Red Hat Cloud
- Usuario sin admin
- Ideal para aprender

### CRC (Local)
- Laptop/PC personal
- Desarrollo offline
- Sin costes cloud
- Admin access

## Relaciones
- Basado en: [[kubernetes]]
- Implementa: [[paas]] (modelo)
- Automatiza: [[build]], [[imagestream]], despliegues
- Simplifica: Acceso via [[route]]

## Fuentes
- [Curso OpenShift v4 PaaS (Módulo 1)](https://plataforma.josedomingo.org/pledin/cursos/osv4_paas/modulo1)
