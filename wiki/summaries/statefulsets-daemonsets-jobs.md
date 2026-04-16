---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kubernetes_cep]
tags: [deployment, kubernetes]
---

# Otras Cargas de Trabajo: StatefulSets, DaemonSets, Jobs

## Resumen de una línea
Más allá de Deployments: StatefulSets para DBs con identidad (MySQL cluster), DaemonSets para nodo-por-nodo (logging), Jobs para tareas únicas.

## Información
- **Fuente:** Curso Kubernetes - Módulo 9
- **URL GitHub:** https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo9

---

## El Problema: ¿Deployment para Todo?

Deployment asume:
- ✅ Pods intercambiables
- ✅ Sin estado
- ✅ Stateless (web, API)

Casos que NO funcionan bien:
- ❌ Bases de datos con identidad (MySQL, PostgreSQL)
- ❌ Cache distribuido con estado (Redis, etcd)
- ❌ Un agente por nodo (logging, monitoring)
- ❌ Tareas que corren once (backup, cron)

**Soluciones:** StatefulSet, DaemonSet, Job, CronJob

---

## StatefulSet: Aplicaciones con Estado

### Definición

StatefulSet mantiene identidad estable para Pods con estado:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql-cluster
spec:
  serviceName: mysql
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:5.7
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```

### Características

```
Deployment:         StatefulSet:
- Pod-0            - mysql-0 (identidad)
- Pod-1            - mysql-1 (identidad)
- Pod-2            - mysql-2 (identidad)

Crean/destroyen      Crean/destroyen
en cualquier orden   secuencialmente
No importa identidad Importa identidad
```

### Casos de Uso

- MySQL cluster (replicación)
- PostgreSQL HA
- MongoDB replica set
- Redis cluster
- Kafka brokers

---

## DaemonSet: Un Pod por Nodo

### Definición

DaemonSet ejecuta **un Pod en cada nodo** del clúster:

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
spec:
  selector:
    matchLabels:
      app: logs
  template:
    metadata:
      labels:
        app: logs
    spec:
      containers:
      - name: fluent-bit
        image: fluent/fluent-bit:latest
        volumeMounts:
        - name: logs
          mountPath: /var/log
      volumes:
      - name: logs
        hostPath:
          path: /var/log
```

### Automáticamente

```
Nodos: 3
DaemonSet: log-collector
Resultado: 3 Pods ejecutándose (uno por nodo)

Nodo nuevo se añade: Automáticamente crea Pod
Nodo se elimina: Automáticamente elimina Pod
```

### Casos de Uso

- Log collectors (Fluentd, Filebeat)
- Monitoring agents (Prometheus Node Exporter)
- Network plugins (Calico, Weave)
- Device plugins (GPU drivers)
- Security agents (Falco)

---

## Job: Tarea que Corre Una Vez

### Definición

Job ejecuta una tarea **hasta completarla**:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: backup-db
spec:
  template:
    spec:
      containers:
      - name: backup
        image: mysql-backup:latest
        command: ["./backup.sh"]
      restartPolicy: Never
  backoffLimit: 3  # Reintentos
```

### Ciclo de Vida

```
Creado → Ejecutando → Completado
                   ↓
              Error? → Reintentar
                   ↓
           backoffLimit? → Fallar

Pod NO se elimina automáticamente
```

### Operaciones

```bash
# Crear Job
kubectl apply -f job.yaml

# Ver Jobs
kubectl get jobs

# Ver Pods del Job
kubectl get pods -l job-name=backup-db

# Ver logs
kubectl logs -l job-name=backup-db

# Eliminar Job (elimina Pods)
kubectl delete job backup-db
```

### Casos de Uso

- Backups de BD
- Procesamiento de datos
- Migraciones
- Limpieza de datos

---

## CronJob: Job Periódico

### Definición

CronJob ejecuta un Job **según horario (cron)**:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-backup
spec:
  schedule: "0 2 * * *"  # Cron: 02:00 todos los días
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: mysql-backup:latest
            command: ["./backup.sh"]
          restartPolicy: OnFailure
```

### Sintaxis Cron

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
│ │ │ │ │
* * * * *

Ejemplos:
0 2 * * *     → Todos los días a las 02:00
0 */4 * * *   → Cada 4 horas
0 0 * * 0     → Cada domingo a medianoche
0 9 1 * *     → El 1º de cada mes a las 09:00
```

### Operaciones

```bash
# Crear CronJob
kubectl apply -f cronjob.yaml

# Ver CronJobs
kubectl get cronjobs

# Ver Jobs generados
kubectl get jobs -l cronjob-name=daily-backup

# Modificar cronograma
kubectl edit cronjob daily-backup

# Ejecutar manualmente
kubectl create job manual-backup --from=cronjob/daily-backup
```

---

## Comparativa: Cuándo Usar Cada Uno

 Tipo  Identidad  Per Nodo  Cron  Uso 
--------------------------------------
 **Deployment**  ❌  ❌  ❌  Aplicaciones stateless (web) 
 **StatefulSet**  ✅  ❌  ❌  Bases de datos, cache (estado) 
 **DaemonSet**  ❌  ✅  ❌  Logging, monitoring, network 
 **Job**  ❌  ❌  ❌  Tareas únicas (backup, migrate) 
 **CronJob**  ❌  ❌  ✅  Tareas periódicas (cron) 

---

## Relaciones

### Conecta con
- [[deployments|Deployments]] — Alternativa para otros casos
- [[almacenamiento-kubernetes|Storage]] — StatefulSets necesitan storage

### Parte de
- Cargas de trabajo de Kubernetes — Todas las cargas de trabajo

---

## Flujo de Aprendizaje

```
Deployments (aplicaciones normales)
   ↓
StatefulSets (estado + identidad)
DaemonSets (por nodo)
Jobs (tareas únicas)
CronJobs (tareas periódicas) ← Estás aquí
```

---

## Fuentes

- [Curso Kubernetes - Módulo 9 (GitHub)](https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo9)
- [Kubernetes StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [Kubernetes DaemonSets](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
- [Kubernetes Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/)
- [Kubernetes CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)
