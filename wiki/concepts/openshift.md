---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_k8s, osv4_paas]
tags: [platform, paas, kubernetes, containers, red-hat]
---

# OpenShift

## Resumen de una línea
Plataforma PaaS de Red Hat basada en Kubernetes que simplifica el despliegue de aplicaciones en contenedores sin necesidad de YAML complejo.

## Definición
OpenShift v4 es una plataforma de contenedores de código abierto basada en Kubernetes que proporciona una solución completa de orquestación de contenedores y servicios de aplicaciones para desarrolladores y equipos de operaciones.

## Características Principales

### Como PaaS
- **Abstracción de complejidad:** Desarrolladores no escriben YAML de Kubernetes
- **Herramientas de despliegue automático:** S2I (Source 2 Image), despliegue desde código/Dockerfile
- **Ciclo de vida simplificado:** Integración automática con repositorios Git
- **Construcción automática:** BuildConfig ejecuta builds sin intervención manual
- **Despliegue continuo:** Cambios en repositorio → nuevo despliegue automático

### Como distribución de Kubernetes
- **Mantiene APIs de K8s:** Pod, Service, Deployment, StatefulSet, Job, etc.
- **Añade abstracciones:** ImageStream, Route (vs Ingress), DeployConfig
- **Gestión simplificada:** CLI `oc` y consola web intuitiva
- **Ecosistema integrado:** Tekton (CI/CD), Knative (serverless), Helm

## Componentes Principales

| Recurso | Propósito |
|---------|-----------|
| **Pod** | Unidad mínima (heredado de K8s) |
| **Deployment** | Declarar aplicaciones escalables |
| **ImageStream** | Gestión continua de imágenes, triggers automáticos |
| **BuildConfig** | Construcción automática desde Git/Dockerfile/imagen |
| **Route** | Acceso HTTP/HTTPS a aplicaciones (simplifica Ingress) |
| **Service** | Exposición interna de Pods |
| **Template** | Plantillas parametrizadas para despliegues repetibles |
| **ConfigMap/Secret** | Parametrización y secretos |

## Ventajas

| Ventaja | Descripción |
|---------|------------|
| **Developer Experience** | Despliegue trivial: `oc new-app` maneja todo |
| **Automatización** | S2I, builds, despliegues sin scripts manuales |
| **Escalabilidad** | Heredado de K8s: replica sets, HPA |
| **Resiliencia** | Tolerancia a fallos, rolling updates automáticos |
| **Integración** | Git webhooks, CI/CD nativo, métricas |
| **Multi-entorno** | Fácil replicar dev → test → producción |

## Arquitectura de Deployments Típicos

```
Repositorio Git
    ↓ (webhook)
BuildConfig → Build → ImageStream (nueva imagen)
    ↓ (ImageStream trigger)
Deployment actualizado automáticamente
    ↓
Pods ejecutándose
    ↓
Route → acceso HTTP/HTTPS
```

## Herramientas de Acceso

- **Consola Web:** Interfaz gráfica en navegador (Developer/Administrator views)
- **CLI `oc`:** Línea de comandos (similar a `kubectl` pero con extensiones)
- **API REST:** Acceso programático a todos los recursos

## OpenShift vs Kubernetes Puro

| Aspecto | Kubernetes | OpenShift |
|--------|-----------|-----------|
| **Despliegue de app** | YAML a mano o Helm | `oc new-app` automático |
| **Construcción de imagen** | External (Docker, Buildah) | Integrada (BuildConfig) |
| **Acceso a apps** | Ingress complejo | Route simple |
| **Imágenes** | Simples refs a registros | ImageStream + triggers |
| **Flujo DevOps** | Manual | Integración Git automática |

## Conceptos Relacionados

- [[PaaS]] — Modelo de plataforma que OpenShift implementa
- [[Kubernetes]] — Orquestador subyacente
- [[Contenedores]] — Unidad de despliegue
- [[ImageStream]] — Abstracción propia de OpenShift
- [[Build]] — Construcción automática en OpenShift
- [[Route]] — Acceso simplificado a aplicaciones

## Instalaciones Disponibles

- **OpenShift Dedicated Developer Sandbox:** Cloud pública, gratis, limitado
- **CRC (CodeReady Containers):** Local en laptop, desarrollo
- **On-Premises:** Instalación en infraestructura propia
- **AWS/Azure/Google:** OpenShift en clouds públicos

## Fuentes
- Cursos: osv4_k8s, osv4_paas de Pledin
