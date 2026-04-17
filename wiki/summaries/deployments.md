---
title: "Deployments: Ciclo de Vida Completo"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kubernetes_cep]
tags: [deployment, kubernetes]
---

# Deployments: Ciclo de Vida Completo

## Resumen de una línea
Deployment es el nivel superior: gestiona ReplicaSets, permite actualizaciones sin downtime (rolling updates), y es lo más usado en producción.

## Información
- **Fuente:** Curso Kubernetes - Módulo 5
- **URL GitHub:** https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo5


## Problema: Actualizar sin Downtime

### Escenario

```
Versión en producción: nginx:1.20 (3 Pods)
Necesito: nginx:1.21 (sin interrumpir servicio)

Con ReplicaSet:
❌ No hay forma nativa
```

### Solución: Deployment

**Deployment** = Gestor de ReplicaSets que permite:
- 🔄 Actualizaciones gradientes (rolling updates)
- ↩️ Rollback (volver a versión anterior)
- ⏸️ Pausar/reanudar despliegues


## Concepto: Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:1.20
```


## Ciclo de Vida: Rolling Update

### Escenario

```
Estado actual: 3 Pods nginx:1.20
Objetivo: 3 Pods nginx:1.21

Estrategia RollingUpdate (maxSurge=1, maxUnavailable=1):

Paso 1: Crea 1 Pod nginx:1.21 (total: 4)
        nginx:1.20 ×3
        nginx:1.21 ×1 (nuevo)

Paso 2: Elimina 1 Pod nginx:1.20 (total: 3)
        nginx:1.20 ×2
        nginx:1.21 ×1

Paso 3: Crea 1 Pod nginx:1.21 (total: 4)
        nginx:1.20 ×2
        nginx:1.21 ×2 (nuevo)

Paso 4: Elimina 1 Pod nginx:1.20 (total: 3)
        nginx:1.20 ×1
        nginx:1.21 ×2

Paso 5: Crea 1 Pod nginx:1.21 (total: 4)
        nginx:1.20 ×1
        nginx:1.21 ×3 (nuevo)

Paso 6: Elimina 1 Pod nginx:1.20 (total: 3)
        nginx:1.21 ×3

✅ Completado: Sin downtime, sin pérdida de tráfico
```


## Estrategias de Actualización

### RollingUpdate (Recomendado)

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1           # Máximo 1 Pod extra
    maxUnavailable: 1     # Máximo 1 Pod no disponible
```

**Ventajas:**
- ✅ Sin downtime
- ✅ Bajo impacto

**Desventajas:**
- ❌ Más lento
- ❌ Momentáneamente 4 Pods en lugar de 3

### Recreate

```yaml
strategy:
  type: Recreate
```

```
Paso 1: Elimina todos los Pods (downtime)
Paso 2: Crea nuevos Pods

❌ Downtime significativo
```


## Operaciones Comunes

### Crear Deployment

```bash
# Declarativo
kubectl apply -f deployment.yaml

# Imperativo
kubectl create deployment web --image=nginx:1.20
```

### Ver Estado

```bash
# Listar deployments
kubectl get deployments

# Ver detalles
kubectl describe deployment web-app

# Ver ReplicaSets (automáticos)
kubectl get rs

# Ver Pods
kubectl get pods
```

### Actualizar Versión

```bash
# Opción 1: Edit
kubectl edit deployment web-app
# (cambiar image a nginx:1.21)

# Opción 2: Set
kubectl set image deployment/web-app nginx=nginx:1.21

# Opción 3: Patch
kubectl patch deployment web-app -p '{"spec":{"template":{"spec":{"containers":[{"name":"nginx","image":"nginx:1.21"}]}}}}'
```

### Ver Historial de Despliegues

```bash
# Ver revisions
kubectl rollout history deployment/web-app

# Ver cambios de una revision
kubectl rollout history deployment/web-app --revision=2
```

### Rollback (Volver a Versión Anterior)

```bash
# Volver a revision anterior
kubectl rollout undo deployment/web-app

# Volver a revision específica
kubectl rollout undo deployment/web-app --to-revision=2

# Ver estado del rollback
kubectl rollout status deployment/web-app
```

### Pausar/Reanudar Despliegue

```bash
# Pausar (útil para debugging)
kubectl rollout pause deployment/web-app

# Reanudar
kubectl rollout resume deployment/web-app
```

### Eliminar

```bash
# Eliminar deployment (y Pods asociados)
kubectl delete deployment web-app
```


## Parámetros Importantes

### replicas

```yaml
spec:
  replicas: 3  # Cuántos Pods ejecutar
```

### selector

```yaml
selector:
  matchLabels:
    app: web   # Qué Pods gestiona este deployment
```

### template

```yaml
template:
  spec:
    containers:
    - name: nginx
      image: nginx:1.20  # Qué versión ejecutar
```

### strategy

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1         # Cuántos extra durante actualización
    maxUnavailable: 1   # Cuántos pueden estar sin servicio
```


## Casos de Uso

### Actualización Simple

```bash
# Cambiar imagen
kubectl set image deployment/web app=myapp:v2

# Kubernetes automatiza rolling update
```

### Rollback por Error

```bash
# Nueva versión tiene bugs
kubectl rollout undo deployment/web-app

# Vuelve a versión anterior automáticamente
```

### Escalado

```bash
# Aumentar réplicas
kubectl scale deployment web-app --replicas=5

# Disminuir
kubectl scale deployment web-app --replicas=2
```


## Relaciones

### Conecta con
- [[replicasets|ReplicaSets: Escalabilidad y Tolerancia a Fallos]] — Gestiona internamente
- [[services-acceso|Services: Acceso a Aplicaciones]] — Acceso a Deployments

### Parte de
- Cargas de trabajo de Kubernetes — Principal carga de trabajo


## Flujo de Aprendizaje

```
Pods (unidad mínima)
   ↓
ReplicaSets (escalabilidad)
   ↓
Deployments (ciclo de vida completo) ← Estás aquí
   ↓
Services (acceso externo)
```


## Fuentes

- [Curso Kubernetes - Módulo 5 (GitHub)](https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo5)
- [Kubernetes Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
