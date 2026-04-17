---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_kubernetes_cep]
tags: [deployment, kubernetes]
aliases: [Deployment]
---

# Deployment

## Resumen de una línea
Patrón de orquestación declarativo para gestionar aplicaciones: rolling updates, rollbacks, replicación automática, estado deseado vs actual.

## Definición

**Deployment** = Abstracción de Kubernetes para gestionar ciclo de vida de aplicaciones stateless. Define estado deseado, Kubernetes lo mantiene automáticamente.

Responsabilidades:
- Crear/destruir réplicas (Pods)
- Rolling updates sin downtime
- Rollback a versión anterior
- Auto-reparación si Pod falla

## Conceptos Clave

### Declarativo vs Imperativo

```
Imperativo (cómo):
- kubectl run myapp --replicas=3
- "Crea 3 instancias de myapp"

Declarativo (qué):
- kubectl apply -f deployment.yaml
- "Quiero 3 réplicas de myapp ejecutándose"
- Idempotente: aplicar 2 veces = mismo resultado
```

### Rolling Update

Cambio de versión sin downtime:

```yaml
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # 1 extra Pod durante update
      maxUnavailable: 0    # 0 Pods abajo durante update
```

**Proceso:**
```
v1.0 (3 pods)
  ↓
v1.0 (2) + v1.1 (1) → 4 pods
  ↓
v1.0 (1) + v1.1 (2) → 3 pods
  ↓
v1.1 (3 pods) ✓
```

### Rollback

Revertir a versión anterior si update falla:

```bash
# Ver historial
kubectl rollout history deployment myapp

# Rollback a versión anterior
kubectl rollout undo deployment myapp

# Rollback a versión específica
kubectl rollout undo deployment myapp --to-revision=2
```

### ReplicaSet Implícito

Deployment crea ReplicaSet automáticamente:

```
Deployment (declaración, ciclo de vida)
    ↓
ReplicaSet (gestión de replicas)
    ↓
Pods (instancias reales)
```

## Patrón de Uso

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mi-app
  template:
    metadata:
      labels:
        app: mi-app
    spec:
      containers:
      - name: app
        image: mi-app:v1.0
        ports:
        - containerPort: 8080
```

## Ventajas

```
✅ Estado declarativo: reproducible
✅ Rolling updates: sin downtime
✅ Auto-reparación: Pod muere → se recrea
✅ Escalado fácil: cambiar replicas
✅ Rollback: revertir cambios rápidamente
✅ Historial: seguimiento de versiones
```

## Relaciones

### Conecta con
- [[pod|Pod]] — Unidad desplegada
- [[service|Service]] — Expone Deployment
- [[statefulset|StatefulSet]] — Para aplicaciones stateful
- [[job|Job]] — Para tareas que terminan

### Reutilizable en
- [[kubernetes|Kubernetes]] — Patrón principal
- Cualquier orquestador de contenedores

## Fuentes

- [Curso Kubernetes - Deployments](https://github.com/iesgn/curso_kubernetes_cep)
- [Kubernetes Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
