---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_k8s_curso]
tags: [openshift, kubernetes, containers, introduction]
---

# Introducción a OpenShift v4 (Curso 1 - Módulo 1)

## Resumen
Introducción a OpenShift v4, explicando qué son los contenedores, las diferencias con máquinas virtuales, Docker vs alternativas, y por qué OpenShift es una distribución de Kubernetes con características PaaS.

## Conceptos Clave

### Virtualización Ligera vs Máquinas Virtuales
- **Contenedores:** Procesos aislados que comparten kernel del SO anfitrión
- **Máquinas virtuales:** Emulación completa del hardware, kernel propio
- **Ventaja contenedores:** Más ligeros, arranque rápido, eficiencia de recursos

### Tipos de Contenedores
- **Contenedores de Sistema:** Similar a VM (acceso SSH, instalación de servicios). Ejemplo: LXC
- **Contenedores de Aplicación:** Despliegue de apps web. Ejemplo: Docker, Podman

### Aplicaciones Idóneas
- Aplicaciones monolíticas: esquema multicapa (cada servicio en contenedor)
- **Microservicios:** Ideales para contenedores
  - Cada microservicio en contenedor propio
  - Comunicación vía HTTP REST
  - Facilita actualización independiente de componentes

### Docker y Alternativas
- **Docker:** Estándar de facto (build, ship, run)
- **Podman:** Alternativa open-source de Red Hat (daemonless)
- **CRI-O:** Creado por Red Hat para Kubernetes únicamente
- **Pouch:** Alternativa de Alibaba

### Orquestadores de Contenedores
Programas que gestionan contenedores en clústers:
- Actualizaciones automáticas
- Balanceo de carga
- Tolerancia a fallos
- Escalabilidad
- **Kubernetes:** El más usado actualmente

### OpenShift v4: Distribución de Kubernetes
**Definición:** Plataforma open-source de Red Hat basada en Kubernetes con funcionalidades PaaS

**Ventajas heredadas de Kubernetes:**
- Despliegue simplificado
- Tolerancia a fallos
- Escalabilidad automática
- Actualizaciones automáticas
- Límites de recursos
- Enrutamiento
- Volúmenes persistentes

**Ventajas adicionales (PaaS):**
- No requiere escribir YAML complejo
- Construcción automática de imágenes
- Integración CI/CD nativa
- Despliegue en múltiples entornos (dev/test/prod)
- Herramientas de monitorización
- Plantillas parametrizadas
- Múltiples interfaces: web, CLI, API

## Plataformas para Usar OpenShift

### Opciones Comerciales
- **Cloud Services:** AWS, Azure, IBM (infraestructura gestionada)
- **Self-Managed:** Infraestructura propia con OpenShift
- **Dedicated:** Infraestructura dedicada administrada por Red Hat

### Para Probar/Aprender
- **Developer Sandbox:** Gratuito, 1 mes, usuario sin privilegios, cluster gestionado
- **Managed Services:** 2 meses, en proveedores cloud (con coste cloud)
- **Self-managed trial:** 2 meses en servidores propios

### Alternativas Open-Source
- **OKD (Origin Community Distribution):** Versión gratuita de comunidad
- **CRC (CodeReady Containers):** OpenShift local en laptop para desarrollo

## Relaciones
- Conecta con: [[kubernetes]], [[contenedores]], [[docker]]
- Introducción a: [[openshift]], [[build]], [[route]], [[imagestream]]

## Fuentes
- [Curso OpenShift v4 (Módulo 1)](https://plataforma.josedomingo.org/pledin/cursos/osv4_k8s/modulo1)
