---
title: "OpenShift como Distribución de Kubernetes"
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_k8s_curso]
tags: [deployment, kubernetes, openshift, pods]
---

# OpenShift como Distribución de Kubernetes

## Resumen
Despliegue de aplicaciones en OpenShift usando recursos Kubernetes: Pods, ReplicaSets, Deployments. Cómo OpenShift hereda y amplía Kubernetes.

## Conceptos Clave

### Recursos Kubernetes en OpenShift
OpenShift mantiene compatibilidad total con recursos K8s:
- **Pod:** Unidad mínima (1+ contenedores)
- **ReplicaSet:** Replica sets, tolerancia a fallos
- **Deployment:** Despliegues declarativos, rolling updates

### Pod
- **Definición:** Uno o más contenedores en mismo host
- **Aislamiento:** Comparten red, filesystem propio
- **Efímeros:** Pueden destruirse en cualquier momento
- **Uso:** Casi nunca crean Pods directamente

### ReplicaSet
**Propósito:** Mantener número de réplicas correcto

- **Tolerancia a fallos:** Si Pod cae, crea nuevo
- **Escalabilidad:** Definir replicas=N
- **Balanceo:** Distribuir carga entre replicas
- **Labels/Selectors:** Identificar qué Pods controlar

**Casi nunca se usan directamente** (usar Deployment)

### Deployment
**Propósito:** Orquestación de aplicaciones

**Características:**
- Define ReplicaSets automáticamente
- **Rolling updates:** Actualizar sin downtime
- **Rollback:** Volver a versión anterior si falla
- **Control de versiones:** Histórico de ReplicaSets
- **Pauses/resuming:** Actualización gradual

**Ejemplo:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - image: myapp:1.0
        name: app
```

### Despliegues desde Consola Web
- **Developer view:** Topology (visual)
- **Administrator view:** Workloads → Deployments
- **Import YAML:** +Add → Import YAML

### Pods Privilegiados
- Algunos contenedores necesitan acceso root
- OpenShift restringe por defecto
- Requiere SecurityContext especial

### Actualización de Deployments
**Rolling update automático:**
```
Versión anterior (replicas=3)
↓ (termina 1 Pod, crea nuevo con v2)
2x v1.0 + 1x v2.0
↓ (termina otro v1.0, crea v2.0)
1x v1.0 + 2x v2.0
↓ (termina último v1.0)
3x v2.0 ✓
```

**Rollout y Rollback:**
```bash
oc rollout history deployment/myapp  # Ver versiones
oc rollout undo deployment/myapp     # Volver anterior
```

## Relaciones

### Conecta con
- Heredado de: [[kubernetes|Kubernetes]]
- Parte de: [[openshift|OpenShift]]
- Relacionado: [[service|Service]] (acceso a Pods)

## Fuentes
- [Curso: OpenShift v4](https://plataforma.josedomingo.org/pledin/cursos/osv4_k8s/)
