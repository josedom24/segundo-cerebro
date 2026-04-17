---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_k8s, osv4_paas]
tags: [deployment, openshift, deploymentconfig]
---

# DeploymentConfig

## Resumen de una línea
Recurso de OpenShift que extiende el concepto de Deployment con triggers automáticos, lifecycle hooks pre/post deploy, y ciclo de vida avanzado.

## Definición

**DeploymentConfig** es un recurso nativo de OpenShift que gestiona el ciclo de vida completo de despliegues con características adicionales no presentes en Kubernetes Deployment:
- Triggers automáticos (imagen, configuración)
- Hooks de ciclo de vida (pre-deploy, post-deploy)
- Rolling updates configurables
- Rollbacks con historial

## Características Principales

### Triggers Automáticos
```yaml
triggers:
  - type: ImageChange
    imageChangeParams:
      automatic: true
      from:
        kind: ImageStreamTag
        name: myapp:latest
  - type: ConfigChange
```

Cuando cambia la imagen o configuración, automáticamente se redeploy

### Lifecycle Hooks
```yaml
strategy:
  type: Rolling
  rollingParams:
    pre:
      failurePolicy: Abort
      execNewPod:
        containerName: app
        command: ['/bin/sh', '-c', 'npm run migrate']
    post:
      failurePolicy: Ignore
      execNewPod:
        containerName: app
        command: ['/bin/sh', '-c', 'npm run seed']
```

**Pre-deploy:** Ejecuta antes de iniciar nuevos Pods (migraciones, validaciones)
**Post-deploy:** Ejecuta después (seed data, notificaciones)

### Rolling Updates
```yaml
strategy:
  type: Rolling
  rollingParams:
    updatePeriodSeconds: 1
    intervalSeconds: 1
    timeoutSeconds: 600
    maxSurge: 1
    maxUnavailable: 1
```

- **maxSurge:** Pods adicionales permitidos durante update
- **maxUnavailable:** Pods no disponibles permitidos
- Sin downtime → actualización progresiva

## Comparación: Deployment vs DeploymentConfig

| Aspecto | Deployment (K8s) | DeploymentConfig (OpenShift) |
|--------|----------|---------|
| **Triggers** | Ninguno (manual) | ImageChange, ConfigChange, Manual |
| **Hooks** | No | Pre/post deploy |
| **Rolling** | Básico | Configurable (maxSurge, maxUnavailable) |
| **Historial** | ReplicaSets | DeploymentConfigs numerados |
| **ImageStream** | No integración | Integración automática |
| **Reclamos de revisor** | Ninguno | Soportado |

## Ciclo de Vida

```
Trigger ocurre (ImageChange, ConfigChange, Manual)
    ↓
Crea nuevo Deployment (revision 2, 3, ...)
    ↓
Ejecuta pre-deploy hook (si existe)
    ↓
Rolling update inicia
    ├─ Crea Pod nuevo con v2
    ├─ Termina Pod viejo v1
    ├─ Crea Pod nuevo con v2
    ├─ Termina Pod viejo v1
    └─ Todos en v2 → ready
    ↓
Ejecuta post-deploy hook (si existe)
    ↓
Deployment completado
    ↓
Historial disponible para rollback
```

## Gestión

### Crear DeploymentConfig
```bash
oc create deploymentconfig myapp --image=myimage:latest
```

### Ver DeploymentConfigs
```bash
oc get dc
oc describe dc myapp
```

### Ver historial de deployments
```bash
oc rollout history dc/myapp
oc rollout history dc/myapp --revision=2
```

### Hacer rollback
```bash
# A despliegue anterior
oc rollout undo dc/myapp

# A versión específica
oc rollout undo dc/myapp --to-revision=1
```

### Redeploy manual
```bash
oc rollout latest dc/myapp
```

## Ventajas

| Ventaja | Descripción |
|---------|------------|
| **Automatización completa** | Triggers, hooks, sin intervención manual |
| **Migraciones integradas** | Pre-deploy ejecuta scripts (migraciones BD) |
| **Seed data** | Post-deploy siembra datos iniciales |
| **ImageStream integration** | Redeploy automático cuando imagen cambia |
| **Historial detallado** | Rollback rápido a cualquier revisión |
| **Control fino** | Rolling parameters (surge, unavailable, timing) |

## Desventajas

| Desventaja | Descripción |
|--------|------------|
| **OpenShift-specific** | No portable a Kubernetes puro |
| **Complejidad** | Más características = más configuración |
| **Deprecación potencial** | Red Hat usa Deployment + Tekton en versiones nuevas |

## Relaciones

### Conecta con

- Parte de: [[openshift|OpenShift]] (característica específica)
- Basado en: [[deployment|Deployment]] (concepto subyacente)
- Integra: [[imagestream|ImageStream]] (triggers automáticos)
- Complementa: [[paas|PaaS]] (automatización de despliegues)
- Alternativa a: Deployment + webhook externo

## Nota Histórica

DeploymentConfig fue el método primario de OpenShift para despliegues antes de versiones recientes. Ahora:
- **OpenShift 4.x**: Todavía soportado, pero Deployment es recomendado
- **Tendencia**: Migrar a Deployment + Tekton para CI/CD

Para proyectos nuevos, considera [[deployment|Deployment]] nativo en lugar de DeploymentConfig, especialmente si portabilidad a K8s puro importa.

## Fuentes

- [[deployconfig-rolling-updates|Deployconfig Rolling Updates]]
- [[metodos-despliegue|Metodos Despliegue]]
