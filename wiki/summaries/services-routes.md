---
title: "Acceso a las Aplicaciones"
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_k8s_curso]
tags: [openshift, redes, services]
---

# Acceso a las Aplicaciones

## Resumen
Cómo exponer aplicaciones en OpenShift mediante Services (acceso interno) y Routes (acceso externo), simplificando la configuración versus Ingress de Kubernetes.

## Conceptos Clave

### Service
**Propósito:** Exponer Pods internamente

**Tipos:**
- **ClusterIP:** Acceso solo dentro del cluster (default)
- **NodePort:** Acceso en puerto del nodo
- **LoadBalancer:** IP externa (en cloud)

**Uso:**
```bash
oc expose deployment myapp --port=8080 --name=myapp-svc
```

### Route (específico de OpenShift)
**Propósito:** Exponer Service externamente con HTTP/HTTPS

**Ventajas sobre Ingress:**
- Más simple (menos YAML)
- Hostname automático
- TLS integrado
- Específico OpenShift

**Creación:**
```bash
oc expose service myapp --hostname=myapp.example.com
```

### DNS en Kubernetes
- **Resolución interna:** service-name.namespace.svc.cluster.local
- **Comunicación entre Pods:** Automática via Service

### Acceso desde Consola Web
- **Developer view → Topology:** Ver Services/Routes visualmente
- **Administrator view → Networking:** Gestión detallada
- **Create Service/Route:** Botones en consola

### Enrutamiento Avanzado
- **Por hostname:** Diferentes servicios en different hosts
- **Por path:** /api vs /web → servicios distintos
- **Balanceo:** Weights en alternateBackends

## Flujo: Pod → Service → Route
```
Cliente HTTP
    ↓ (myapp.example.com)
Route
    ↓ (enruta a)
Service (myapp)
    ↓ (load balancer)
Pods (replicas)
```

## Relaciones

### Conecta con
- Parte de: [[openshift|OpenShift]]
- Expone: Deployments/Pods
- Alternativa de: [[kubernetes|Kubernetes]] de [[kubernetes|Kubernetes]]
- Usa: [[service|Service]] internamente

## Fuentes
- [Curso: OpenShift v4](https://plataforma.josedomingo.org/pledin/cursos/osv4_k8s/)
