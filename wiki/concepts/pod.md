---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_kubernetes_cep]
tags: [contenedores, kubernetes]
aliases: [Pod]
---

# Pod

## Resumen de una línea
Unidad mínima desplegable en Kubernetes: 1+ contenedores que comparten network namespace, IP, storage; efímeros y reemplazables.

## Definición

**Pod** = Contenedor de 1 o más contenedores. La unidad más pequeña en Kubernetes.

Características únicas:
- Comparten IP (dirección única)
- Comparten network namespace (localhost entre contenedores)
- Volúmenes compartidos
- Ciclo de vida ligado (mueren juntos)
- Efímeros (sin persistencia)

## Un vs Múltiples Contenedores

### 1 Contenedor (típico)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mi-app
spec:
  containers:
  - name: app
    image: mi-app:latest
    ports:
    - containerPort: 8080
```

Caso más común: 1 Pod = 1 contenedor aplicación

### 2+ Contenedores (sidecar)

```yaml
spec:
  containers:
  - name: app
    image: mi-app:latest
    ports:
    - containerPort: 8080
  - name: logger
    image: logging-agent:latest
```

Casos:
- **Sidecar logging:** enviar logs a sistemas centralizados
- **Service mesh:** proxy de red
- **Inicialización:** preparar datos antes de app
- Comparten IP: `localhost:8080` desde logger

## Ciclo de Vida

```
Pending (creando) → Running (ejecutando) → Succeeded/Failed (terminado)
```

**Estados:**
- Pending: Esperando recursos
- Running: Al menos 1 contenedor activo
- Succeeded: Completado exitosamente
- Failed: Terminado con error
- Unknown: Estado desconocido

## Efemeralidad

Pods NO tienen persistencia:
- Se recrean frecuentemente
- Datos en memoria se pierden
- Se crean nuevas IPs
- **Solución:** Deployment (gestiona Pods)

```
❌ No uses Pod directo en producción
✅ Usa Deployment que gestione Pods
```

## Almacenamiento Compartido

Contenedores en mismo Pod comparten volúmenes:

```yaml
spec:
  containers:
  - name: app
    volumeMounts:
    - name: data
      mountPath: /data
  - name: logger
    volumeMounts:
    - name: data
      mountPath: /var/log/app
  volumes:
  - name: data
    emptyDir: {}
```

## Health Checks

Kubernetes verifica salud del Pod:

```yaml
spec:
  containers:
  - name: app
    livenessProbe:           # ¿Está vivo?
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 30
    readinessProbe:          # ¿Está listo?
      httpGet:
        path: /ready
        port: 8080
```

## Relaciones

### Conecta con
- [[deployment]] — Gestiona Pods automáticamente
- [[service]] — Expone grupo de Pods
- [[kubernetes]] — Unidad fundamental

### Reutilizable en
- Kubernetes principalmente
- Conceptos de contenedores en otros orquestadores

## Flujo Típico

```
No creas Pods directamente ❌

Crea Deployment o ReplicaSet:
  ↓
Estos crean y gestionan Pods ✓
  ↓
Si Pod falla, se recrea automáticamente
  ↓
Service descubre nuevas IPs
```

## Fuentes

- [Curso Kubernetes - Pods](https://github.com/iesgn/curso_kubernetes_cep)
- [Kubernetes Pods](https://kubernetes.io/docs/concepts/workloads/pods/)
