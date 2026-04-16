---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas_curso]
tags: [deployment, openshift]
---

# DeployConfig y Rolling Updates (Curso 2 - Módulo 6)

## Resumen
DeployConfig (recurso nativo de OpenShift vs Deployment de K8s): características, rolling updates, rollbacks, y ciclo de vida de despliegues.

## Conceptos Clave

### DeployConfig vs Deployment

| Aspecto | Deployment (K8s) | DeployConfig (OpenShift) |
|--------|----------|------------|
| **Origen** | Kubernetes nativo | OpenShift específico |
| **Integración** | Genérica | Profunda con OpenShift |
| **ImageStream** | Simple ref | Triggers automáticos |
| **Rolling updates** | Manual | Automático |
| **Hooks** | No | Sí (pre/post deploy) |
| **Uso actual** | Recomendado en 4.x | Legacy, aún funciona |

### DeployConfig Básico
```yaml
apiVersion: apps.openshift.io/v1
kind: DeploymentConfig
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - image: myapp:latest
        name: app
  triggers:
    - type: ImageChange
      imageChangeParams:
        automatic: true
        containerNames:
        - app
        from:
          kind: ImageStreamTag
          name: myapp:latest
```

### Rolling Updates

#### Automático
```
Versión anterior (3 Pods v1.0)
    ↓ (crea 1 Pod v2.0, termina 1 v1.0)
2x v1.0 + 1x v2.0
    ↓ (crea 1 Pod v2.0, termina 1 v1.0)
1x v1.0 + 2x v2.0
    ↓ (crea 1 Pod v2.0, termina último v1.0)
3x v2.0 ✓ (sin downtime)
```

#### Configuración
```yaml
spec:
  strategy:
    type: Rolling
    rollingParams:
      updatePeriodSeconds: 1
      intervalSeconds: 1
      timeoutSeconds: 600
      maxSurge: 1
      maxUnavailable: 1
```

- **maxSurge:** Pods excesoivos permitidos durante actualización
- **maxUnavailable:** Pods no disponibles permitidos

### Rollback (Deshacer actualización)

#### Ver historia
```bash
oc rollout history dc/myapp
oc rollout history dc/myapp --revision=2
```

#### Rollback a anterior
```bash
oc rollout undo dc/myapp
```

#### Rollback a versión específica
```bash
oc rollout undo dc/myapp --to-revision=3
```

### Lifecycle Hooks

#### Pre-deployment
```yaml
spec:
  strategy:
    type: Rolling
    rollingParams:
      pre:
        failurePolicy: Abort
        execNewPod:
          containerName: app
          command: ['/bin/sh', '-c', 'npm run migrate']
```

**Uso:** Migraciones de BD antes de desplegar

#### Post-deployment
```yaml
      post:
        failurePolicy: Ignore
        execNewPod:
          containerName: app
          command: ['/bin/sh', '-c', 'npm run seed']
```

**Uso:** Seed data después de desplegar

### ImageChange Trigger
```yaml
triggers:
  - type: ImageChange
    imageChangeParams:
      automatic: true
      containerNames:
      - app
      from:
        kind: ImageStreamTag
        name: myapp:latest
```

**Resultado:** Si ImageStream myapp:latest cambia → redeploy automático

### Otros Triggers
- **ConfigChange:** Cambio en DC
- **Manual:** `oc rollout latest`

## Relaciones
- OpenShift específico: Alternativa a [[deployment]]
- Integración: [[imagestream]] triggers
- Patrón: Reemplazado por Deployment en versiones recientes

## Fuentes
- [Curso OpenShift v4 PaaS (Módulo 6)](https://plataforma.josedomingo.org/pledin/cursos/osv4_paas/modulo6)
