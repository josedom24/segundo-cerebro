---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_kubernetes_cep]
tags: [deployment, kubernetes]
aliases: [Job]
---

# Job

## Resumen de una línea
Patrón Kubernetes para tareas que terminan: garantiza finalización exitosa, reintentos automáticos, ejecución paralela; base para CronJob.

## Definición

**Job** = Controlador para cargas de trabajo que completan y terminan (vs Deployment que corre indefinidamente).

Garantías:
- Completar al menos una vez
- Reintentos automáticos si fallan
- Limpieza automática de Pods finalizados
- Ejecución paralela configurable

## Job vs Deployment

```
Deployment (Long-running):
- Aplicación siempre activa
- Si Pod falla → se reinicia
- Objetivo: disponibilidad continua

Job (Batch):
- Tarea con fin definido
- Si falla → reintentos hasta éxito
- Objetivo: completar tarea
- Se limpia después de finalizar
```

## Patrón de Uso

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: procesar-datos
spec:
  completions: 1        # ¿Cuántos Pods exitosos?
  parallelism: 1        # ¿Cuántos en paralelo?
  backoffLimit: 3       # ¿Cuántos reintentos?
  template:
    spec:
      containers:
      - name: procesar
        image: mi-worker:latest
        command: ["python", "procesar.py"]
      restartPolicy: Never  # No reintentar el Pod
```

## Completions vs Parallelism

### Serial (completions=1, parallelism=1)

```
1 Pod ejecuta tarea → Completa
```

```yaml
completions: 1
parallelism: 1
```

### Paralelo (completions=3, parallelism=3)

```
Pod1, Pod2, Pod3 ejecutan simultáneamente
```

```yaml
completions: 3
parallelism: 3
```

### Work queue pattern (completions=3, parallelism=2)

```
Pod1, Pod2 toman items de queue
Cuando terminan, Pod3 toma más items
```

```yaml
completions: 3
parallelism: 2
```

## Reintentos y Fallos

```
backoffLimit: 3 → máximo 3 reintentos

Intento 1: Falla
Intento 2: Falla
Intento 3: Falla
→ Job marcado como "Failed"
```

## CronJob (Ejecución Periódica)

Job ejecutado en schedule:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup-diario
spec:
  schedule: "0 2 * * *"  # 2:00 AM cada día
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: backup-tool:latest
            command: ["backup", "/data"]
          restartPolicy: OnFailure
```

## Casos Reales

```
Procesar archivo → Job
Backup nocturno → CronJob
Enviar emails en lote → Job
Cleanup de datos antiguos → CronJob
Migración de datos → Job
Análisis de logs → Job paralelo
```

## Estados

```
Active: Job en ejecución
Succeeded: Completado exitosamente (1+ Pod éxito)
Failed: Falló tras reintentos
Suspended: Pausado temporalmente
```

## Limpieza

```yaml
# Mantener últimos 5 Jobs exitosos
successfulJobsHistoryLimit: 5

# Mantener último Job fallido
failedJobsHistoryLimit: 1
```

## Relaciones

### Conecta con
- [[deployment]] — Alternativa para Pods que no terminan
- [[pod]] — Unidad ejecutada
- [[kubernetes]] — Patrón de batch

### Reutilizable en
- Kubernetes principalmente
- Concepto de tareas batch en orquestadores

## Flujo Típico

```
1. Crear Job
   ↓
2. Pods inician
   ↓
3. Ejecutan comando/aplicación
   ↓
4. Completan exitosamente
   ↓
5. Job termina (cleanup automático)
```

## Fuentes

- [Curso Kubernetes - Jobs](https://github.com/iesgn/curso_kubernetes_cep)
- [Kubernetes Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/)
- [Kubernetes CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)
