---
title: "Otros Recursos para Manejar Aplicaciones"
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_k8s_curso]
tags: [deployment, kubernetes, openshift]
---

# Otros Recursos para Manejar Aplicaciones

## Resumen
Recursos avanzados de Kubernetes/OpenShift: StatefulSets (aplicaciones con estado), DaemonSets (un Pod por nodo), Jobs/CronJobs (tareas batch), y HPA (auto-escalado).

## Conceptos Clave

### StatefulSet
**Propósito:** Aplicaciones stateful (con identidad persistente)

**Uso:**
- **Bases de datos:** MySQL, PostgreSQL, MongoDB
- **Aplicaciones ordenadas:** Nodos coordinados (Kafka, Redis)
- **Identidad estable:** Pod-0, Pod-1, Pod-2

**Características:**
- **Identidad ordinal:** Pod-name-0, Pod-name-1, etc.
- **Escalado ordenado:** Crea pods secuencialmente
- **Almacenamiento dedicado:** Cada Pod su propio PVC
- **DNS ordenado:** Pod-0.svc, Pod-1.svc, etc.

**vs Deployment:**
| Aspecto | Deployment | StatefulSet |
|--------|-----------|------------|
| Identidad | Genérica | Ordinal fija |
| Almacenamiento | Compartido | Dedicado por Pod |
| Red | DNS genérico | DNS por ordinal |
| Escalado | Simultáneo | Secuencial |

### DaemonSet
**Propósito:** Ejecutar Pod en cada nodo del cluster

**Uso:**
- Logging: Recolectar logs en cada nodo
- Monitorización: Agentes de monitoreo
- Networking: Proxies, CNI plugins
- Storage: Gestores de volumen

**Características:**
- Automáticamente en nodos nuevos
- Automáticamente removido si nodo desaparece
- Especial para infraestructura

### Job
**Propósito:** Ejecutar tarea una sola vez hasta completarse

**Características:**
- Crea Pod, ejecuta, espera finalización
- Reintentos automáticos si falla
- Completación garantizada
- No continúa ejecutando indefinidamente

**Ejemplo:**
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: calculate-pi
spec:
  template:
    spec:
      containers:
      - image: perl
        command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(200)"]
      restartPolicy: Never
```

### CronJob
**Propósito:** Ejecutar Jobs programados (cron)

**Uso:**
- Backups diarios
- Limpieza de datos
- Reportes automáticos
- Tareas mantenimiento

**Ejemplo:**
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-backup
spec:
  schedule: "0 2 * * *"  # 2 AM diariamente
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - image: backup-app
          restartPolicy: OnFailure
```

### Horizontal Pod Autoscaler (HPA)
**Propósito:** Auto-escalar Deployment según métricas

**Uso:**
- Métricas CPU: Tráfico alto → más Pods
- Métricas memoria: Picos de uso
- Métricas custom: Mensajes en cola, etc.

**Ejemplo:**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

**Comportamiento:**
- CPU > 70% → agrega Pods
- CPU < 70% → reduce Pods
- Respeta min/max replicas

## Relaciones

### Conecta con
- Parte de: [[kubernetes|Kubernetes]], [[openshift|OpenShift]]
- StatefulSet: Para apps con estado
- DaemonSet: Para infraestructura
- Job/CronJob: Para tareas batch
- HPA: Escalado automático

## Fuentes
- [Curso: OpenShift v4](https://plataforma.josedomingo.org/pledin/cursos/osv4_k8s/)
