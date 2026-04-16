---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas_curso]
tags: [automatizacion, openshift]
---

# Builds: Construcción Automática de Imágenes (Curso 2 - Módulo 4)

## Resumen
Sistema BuildConfig de OpenShift: construcción automática de imágenes desde Git, estrategias (S2I, Docker), triggers (webhooks), y gestión del ciclo de vida de builds.

## Conceptos Clave

### BuildConfig (Repaso)
Recurso que define cómo construir imágenes automáticamente

**Componentes:**
- Source: Dónde está el código (Git repo, binarios)
- Strategy: Cómo construir (S2I, Docker, etc.)
- Output: Dónde guardar imagen (ImageStream)
- Triggers: Cuándo construir (push, periódico, manual)

### Estrategias de Build

#### S2I (Source to Image)
```yaml
spec:
  strategy:
    sourceStrategy:
      from:
        kind: ImageStreamTag
        name: python:3.9
```

**Proceso:**
1. Descarga builder image (python:3.9)
2. Inyecta código fuente
3. Ejecuta script `assemble` del builder
4. Crea imagen final

**Ventaja:** Sin Dockerfile

#### Docker Build
```yaml
spec:
  strategy:
    dockerStrategy:
      dockerfilePath: Dockerfile
```

**Proceso:**
1. Clone repo
2. Busca Dockerfile
3. Ejecuta `docker build`
4. Push imagen

**Ventaja:** Control total

### Creación de BuildConfig

#### Automática (oc new-build)
```bash
oc new-build python:3.9~https://github.com/user/myapp \
  --name=myapp \
  --strategy=source
```

#### Manual YAML
```yaml
apiVersion: build.openshift.io/v1
kind: BuildConfig
metadata:
  name: myapp
spec:
  source:
    git:
      uri: https://github.com/user/myapp
      ref: main
  strategy:
    sourceStrategy:
      from:
        kind: ImageStreamTag
        name: python:3.9
  output:
    imageStream: myapp:latest
  triggers:
    - type: GitHub
      github:
        secret: webhook-secret
    - type: ConfigChange
```

### Ciclo de Vida de un Build

```
Git push
    ↓ (GitHub webhook)
BuildConfig triggered
    ↓
Nuevo Build creado (myapp-1, myapp-2, ...)
    ↓
Pod de build (efímero)
    ├─ Clone repo
    ├─ Build (S2I o Docker)
    └─ Push imagen
    ↓
Build finalizado (Success/Failed)
    ↓
ImageStream actualizado
    ↓ (ImageStream trigger)
Deployment redeploy automático
```

### Triggers Automáticos

#### GitHub Webhook
```bash
# OpenShift crea webhook automáticamente si secret configurado
# Git push → GitHub notifica → Build triggered
```

#### ImageStream Trigger
```yaml
triggers:
  - type: ImageChange
    imageChangeParams:
      automatic: true
      from:
        kind: ImageStreamTag
        name: python:3.9  # Cambio en imagen base
```

#### ConfigChange
```yaml
triggers:
  - type: ConfigChange
    # Triggers cuando BuildConfig cambia
```

### Gestión de Builds

#### Ver BuildConfigs
```bash
oc get bc
oc describe bc myapp
```

#### Ejecutar build manual
```bash
oc start-build myapp
oc start-build myapp --follow  # Ver logs
```

#### Ver builds ejecutados
```bash
oc get builds
oc logs build/myapp-1
```

#### Ver logs en vivo
```bash
oc logs -f bc/myapp
```

### Versionado de Builds
OpenShift numera builds automáticamente:
```
myapp-1 (first build)
myapp-2 (second build)
...
myapp-N (latest)
```

Cada build es reproducible, logs preservados

### Flujo CI/CD Automático
```
Desarrollador:
  1. Código → GitHub
  2. Push

OpenShift automático:
  1. Webhook trigger
  2. Clone
  3. Build
  4. Test (si configurado)
  5. Push imagen
  6. Actualizar ImageStream
  7. Redeploy

Resultado:
  - Nueva versión en producción
  - Sin intervención manual
```

## Relaciones
- Parte de: [[openshift]] (característica PaaS)
- Produce: [[imagestream]] (output de build)
- Usa: BuildConfig (recurso)
- Integra: Git webhooks, CI/CD

## Fuentes
- [Curso OpenShift v4 PaaS (Módulo 4)](https://plataforma.josedomingo.org/pledin/cursos/osv4_paas/modulo4)
