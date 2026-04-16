---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kubernetes_cep]
tags: [kubernetes, replicasets, escalabilidad, tolerancia-fallos]
---

# ReplicaSets: Escalabilidad y Tolerancia a Fallos

## Resumen de una línea
ReplicaSet asegura que N réplicas de un Pod se ejecuten siempre, proporcionando escalabilidad automática y tolerancia a fallos.

## Información
- **Fuente:** Curso Kubernetes - Módulo 4
- **URL GitHub:** https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo4

---

## Problema: Pod Único

Pods son efímeros → si mueren, desaparecen.

```
Pod web-app ← muere → ❌ No hay servicio
```

**Solución:** ReplicaSet

---

## Concepto: ReplicaSet

### Definición

ReplicaSet mantiene siempre N réplicas de un Pod en ejecución:

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: web-rs
spec:
  replicas: 3
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
        image: nginx:latest
```

### Garantía

```
Especifico: 3 réplicas
Kubernetes: Siempre 3 Pods ejecutándose

Pod muere → Crea uno nuevo automáticamente ✅
Tengo 4 → Elimina 1 ✅
Tengo 2 → Crea 1 ✅
```

---

## Características

### Self-Healing (Auto-reparación)

```
Objetivo: 3 Pods
├─ Pod 1: Ejecutándose
├─ Pod 2: Ejecutándose
└─ Pod 3: Crash
   ↓
   Kubernetes detecta → Crea Pod 3 nuevo
```

### Escalabilidad Horizontal

```bash
# Escalar a 5 réplicas
kubectl scale rs web-rs --replicas=5

# Escalar a 2
kubectl scale rs web-rs --replicas=2
```

### Selector de Etiquetas

ReplicaSet usa etiquetas para identificar sus Pods:

```yaml
selector:
  matchLabels:
    app: web     # Pods con esta etiqueta
```

---

## Ciclo de Vida

### Crear ReplicaSet

```bash
kubectl apply -f replicaset.yaml
```

### Ver Estado

```bash
# Listar ReplicaSets
kubectl get rs

# Ver detalles
kubectl describe rs web-rs

# Ver Pods asociados
kubectl get pods -l app=web
```

### Actualizar Réplicas

```bash
# Aumentar
kubectl scale rs web-rs --replicas=5

# Editar
kubectl edit rs web-rs
```

### Eliminar

```bash
# Elimina RS pero mantiene Pods
kubectl delete rs web-rs --cascade=orphan

# Elimina RS y Pods (por defecto)
kubectl delete rs web-rs
```

---

## Limitación: Sin Actualizaciones

⚠️ **Problema:** ¿Cómo actualizar a nueva versión?

```
Versión: nginx:1.20
ReplicaSet web-rs: 3 Pods con nginx:1.20

Necesito: nginx:1.21

Opciones con RS:
❌ Cambiar imagen → Pods viejos siguen igual
❌ Crear nuevo RS → Tráfico se divide
❌ Eliminar RS → Downtime
```

**Solución:** [[deployments|Deployments]]

---

## Relaciones

### Conecta con
- [[pods-contenedores|Pods]] — Lo que ReplicaSet replica
- [[deployments|Deployments]] — Sucesor de ReplicaSets

### Parte de
- Cargas de trabajo de Kubernetes — Cargas de trabajo

---

## Fuentes

- [Curso Kubernetes - Módulo 4 (GitHub)](https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo4)
- [Kubernetes ReplicaSets](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/)
