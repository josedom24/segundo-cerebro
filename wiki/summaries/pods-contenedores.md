---
title: "Pods: Contenedores en Kubernetes"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kubernetes_cep]
tags: [contenedores, deployment, kubernetes, pods]
---

# Pods: Contenedores en Kubernetes

## Resumen de una línea
Pod es la unidad mínima en Kubernetes: envoltura que contiene uno o varios contenedores, efímera pero central en k8s.

## Información
- **Fuente:** Curso Kubernetes - Módulo 3
- **URL GitHub:** https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo3
- **Líneas de contenido:** 400+


## Concepto: Pod

### ¿Qué es un Pod?

**Pod** = contenedor Docker + capa k8s con:
- Política de reinicio
- Health checks (readiness, liveness)
- Abstracción sobre runtime (Docker, containerd, CRI-O)

### Características Fundamentales

```
Pod = Envoltura de 1+ contenedores que:
  ✓ Comparten IP (dirección única)
  ✓ Comparten almacenamiento (volúmenes)
  ✓ Se crean/destruyen juntos
  ✓ Son efímeros (no persistentes)
```

### Comparación: Pod vs Contenedor

 Aspecto  Contenedor  Pod 
-------------------------
 **Runtime**  Docker, containerd  Abstracción k8s 
 **IP**  Privada del host  Propia única 
 **Almacenamiento**  Volúmenes Docker  Volúmenes k8s 
 **Health checks**  Docker health  Readiness/Liveness 
 **Reinicio**  Política Docker  Política k8s 


## Características Clave

### 1. Efímeros (No Persistentes)

Los Pods se crean, ejecutan y se destruyen:
- Cambios → nuevo Pod
- Error → nuevo Pod
- Sin datos persistentes → se pierden

**Solución:** Usar volúmenes para datos que deben persistir

### 2. Una IP por Pod

```
Pod = 172.17.10.5
  ├─ Contenedor 1: localhost:8080
  ├─ Contenedor 2: localhost:3306
  └─ Contenedor 3: localhost:6379

Acceso interno:
  - Pod 1 → Pod 2: 172.17.10.5:3306
```

### 3. Abstracción de Runtime

```yaml
Pod:
  spec:
    containers:
      - name: app
        image: nginx:latest
        # Funciona con Docker, containerd, CRI-O, etc.
        # Sin cambios en la definición
```


## Tipos de Pods

### Pod Single-Container (95% de casos)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mi-pod
spec:
  containers:
  - name: app
    image: nginx:latest
    ports:
    - Port: 80
```

**Uso típico:**
- Servidores web (nginx, Apache)
- Servidores de aplicación (Python, Node)
- Bases de datos (MySQL, PostgreSQL)
- Cachés (Redis)

### Pod Multi-Container (Casos especiales)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-multicontenedor
spec:
  containers:
  - name: web
    image: nginx:latest
  - name: app
    image: myapp:latest
```

**Cuándo usar:**
- Procesos fuertemente acoplados
- Servidor web + aplicación (nginx + PHP-FPM)
- Sidecar containers (logging, monitoring)
- **Nota:** Curso se enfoca en single-container


## Ciclo de Vida de un Pod

```
1. Pending     → Pod creado, esperando recursos
2. Running     → Contenedores ejecutándose
3. Succeeded   → Completado exitosamente
4. Failed      → Error durante ejecución
5. Unknown     → Estado desconocido
```


## Conceptos: Health Checks

### Readiness Probe

¿Está listo el Pod para recibir tráfico?

```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
```

**Caso:** Aplicación que tarda en iniciar

### Liveness Probe

¿Sigue vivo el contenedor?

```yaml
livenessProbe:
  httpGet:
    path: /ping
    port: 8080
  periodSeconds: 10
  failureThreshold: 3
```

**Caso:** Detectar deadlocks, aplicación colgada


## Gestión Básica de Pods

### Crear Pod (imperative)

```bash
# Crear simple
kubectl run mi-pod --image=nginx

# Con exposición
kubectl run web --image=nginx --port=80
```

### Ver Pods

```bash
# Listar todos
kubectl get pods

# Ver detalles
kubectl describe pod mi-pod

# Ver logs
kubectl logs mi-pod

# Logs en vivo
kubectl logs -f mi-pod
```

### Ejecutar Comandos en Pod

```bash
# Ejecutar comando
kubectl exec mi-pod -- ls /app

# Shell interactivo
kubectl exec -it mi-pod -- /bin/bash
```

### Eliminar Pod

```bash
# Eliminar
kubectl delete pod mi-pod

# Forzado
kubectl delete pod mi-pod --grace-period=0 --force
```


## Manifest YAML: Definición Declarativa

### Estructura Básica

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web-app
  labels:
    app: web
spec:
  containers:
  - name: nginx
    image: nginx:1.21
    ports:
    - Port: 80
  - name: app
    image: myapp:1.0
```

### Campos Comunes

| Campo | Descripción |
| :--- | :--- |
| `apiVersion` | `v1` para Pods |
| `kind` | `Pod` |
| `metadata.name` | Nombre único en namespace |
| `metadata.labels` | Etiquetas para seleccionar |
| `spec.containers[]` | Array de contenedores |
| `containers[].image` | Imagen a usar |
| `containers[].ports[]` | Puertos expuestos |
| `containers[].env[]` | Variables de entorno |
| `containers[].volumeMounts[]` | Volúmenes montados |


## Limitaciones de Pods

### ⚠️ Problemas Clave

1. **Efímeros:** Sin persistencia de datos
2. **Manual:** Hay que crearlos manualmente
3. **Sin escalado:** No escalan automáticamente
4. **Sin actualización:** No hay rolling updates

**Solución:** Usar [[replicasets|ReplicaSets: Escalabilidad y Tolerancia a Fallos]] y [[deployments|Deployments: Ciclo de Vida Completo]]


## Relaciones

### Conecta con
- [[instalacion-kubernetes|Instalación de Kubernetes]] — Kubectl para manejar Pods
- [[introduccion-kubernetes|Introducción a Kubernetes]] — Concepto de unidad mínima

### Parte de
- Cargas de trabajo de Kubernetes — Tipos de carga de trabajo


## Próximo Paso

Pods son poderosos pero limitados. Siguiente: [[replicasets|ReplicaSets: Escalabilidad y Tolerancia a Fallos]].


## Fuentes

- [Curso Kubernetes - Módulo 3 (GitHub)](https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo3)
- [Kubernetes Pods Documentation](https://kubernetes.io/docs/concepts/workloads/pods/)
