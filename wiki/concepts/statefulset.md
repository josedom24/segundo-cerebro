---
title: StatefulSet
created: 2026-04-16
updated: 2026-04-16
sources: [curso_kubernetes_cep]
tags: [deployment, kubernetes, statefulset]
aliases: [StatefulSet]
---
title: StatefulSet

# StatefulSet

## Resumen de una línea
Patrón Kubernetes para aplicaciones stateful: identidad persistente, almacenamiento dedicado, orden garantizado; ideal bases de datos.

## Definición

**StatefulSet** = Controlador para aplicaciones que mantienen estado. A diferencia de Deployment, cada réplica tiene identidad única y estable.

Casos de uso:
- Bases de datos (MySQL, PostgreSQL, MongoDB)
- Caches persistentes (Redis, Memcached)
- Message queues (RabbitMQ, Kafka)

## Diferencias con Deployment

```
Deployment (Stateless):
- Pods reemplazables
- Nombres aleatorios (pod-abc123)
- Múltiples replicas idénticas
- Almacenamiento temporal

StatefulSet (Stateful):
- Pods con identidad
- Nombres ordenados (pod-0, pod-1, pod-2)
- Cada uno con almacenamiento dedicado
- Orden garantizado en operaciones
```

## Identidad Persistente

```
StatefulSet "db" con 3 replicas:

db-0 → PersistentVolume-0
db-1 → PersistentVolume-1
db-2 → PersistentVolume-2

Si db-1 falla y se recrea:
- Nuevo Pod: mismo nombre (db-1)
- Acceso a: mismo almacenamiento (PersistentVolume-1)
- Data intacta
```

## Orden Garantizado

```
Creación:
db-0 espera → Ready
db-1 espera → Ready
db-2 espera → Ready
(Uno a uno, orden)

Actualización:
db-2 → db-1 → db-0
(Orden inverso, para no interrumpir el primario)

Eliminación:
db-2 → db-1 → db-0
(Orden reverso, últimos primero)
```

## PersistentVolumeClaim

Cada Pod obtiene almacenamiento dedicado:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: db
spec:
  serviceName: db-headless
  replicas: 3
  selector:
    matchLabels:
      app: db
  template:
    metadata:
      labels:
        app: db
    spec:
      containers:
      - name: db
        image: postgres:14
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```

Resultado: 3 PVCs, uno por Pod

## Headless Service

StatefulSets requieren Service "headless":

```yaml
apiVersion: v1
kind: Service
metadata:
  name: db-headless
spec:
  clusterIP: None  # ← Headless (sin IP virtual)
  selector:
    app: db
  ports:
  - port: 5432
```

DNS resultante:
- `db-0.db-headless.default.svc.cluster.local` → Pod 0
- `db-1.db-headless.default.svc.cluster.local` → Pod 1
- `db-2.db-headless.default.svc.cluster.local` → Pod 2

Permite acceso directo a cada Pod (útil para replicación)

## Casos Reales

```yaml
# PostgreSQL HA Cluster
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-cluster
spec:
  serviceName: postgres-headless
  replicas: 3
  ...
```

Comportamiento:
- postgres-0: Primario (escritura)
- postgres-1,2: Réplicas (lectura)
- Replicación streaming entre Pods
- Failover automático si primario cae

## Relaciones

### Conecta con
- [[deployment|Deployment]] — Alternativa para aplicaciones stateless
- [[pod|Pod]] — Unidad gestionada
- [[service|Service]] — Acceso a StatefulSet (headless)
- [[kubernetes|Kubernetes]] — Patrón de estado

### Reutilizable en
- Kubernetes principalmente
- Concepto de estado en orquestadores

## Flujo Típico

```
1. Crear StatefulSet
   ↓
2. Crear PersistentVolumes
   ↓
3. Crear volumeClaimTemplates (auto)
   ↓
4. Cada Pod vinculado a PVC
   ↓
5. Datos persisten entre recreaciones
```

## Fuentes

- [Curso Kubernetes - StatefulSets](https://github.com/iesgn/curso_kubernetes_cep)
- [Kubernetes StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
