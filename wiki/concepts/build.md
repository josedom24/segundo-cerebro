---
title: "Build (BuildConfig en OpenShift)"
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas]
tags: [contenedores, openshift, build]
---

# Build (BuildConfig en OpenShift)

## Resumen de una línea
Sistema automático de construcción de imágenes de contenedores en OpenShift que compila código/Dockerfile y produce ImageStreams sin intervención manual.

## Definición
Un **Build** es un proceso que construye una imagen de contenedor a partir de código fuente o Dockerfile. Se controla mediante un recurso **BuildConfig** que define:
- Estrategia de construcción (Dockerfile, S2I, etc.)
- Fuente del código (Git, repositorio, binarios)
- Registro de destino
- Triggers automáticos

## Estrategias de Build

### 1. Docker Build
```
Dockerfile en repositorio
    ↓
BuildConfig (estrategia: Docker)
    ↓
docker build contexto
    ↓
Imagen nueva → ImageStream
```

**Características:**
- Construye desde Dockerfile
- Contexto desde Git
- Full control sobre la imagen

### 2. S2I (Source-to-Image)
```
Código fuente en repositorio
    ↓
BuildConfig (estrategia: S2I)
    ↓
Builder Image (ej: python:3.9)
    ↓
S2I detecta tipo, compila, crea imagen
    ↓
Imagen nueva → ImageStream
```

**Ventajas:**
- No necesita Dockerfile
- Automático: detecta lenguaje
- Seguro: Builder Images confiables
- Rapid development

### 3. Dockerfile Build
Igual que Docker Build pero explícito

## BuildConfig

Recurso que define un build:

```yaml
apiVersion: build.openshift.io/v1
kind: BuildConfig
metadata:
  name: myapp
spec:
  source:
    git:
      uri: https://github.com/user/repo
      ref: main
  strategy:
    dockerStrategy:
      dockerfilePath: Dockerfile
  output:
    imageStream: myapp:latest
  triggers:
    - type: GitHub
      github:
        secret: webhook-secret
```

## Ciclo de Vida

```
Git push
    ↓ (webhook trigger)
BuildConfig activado
    ↓
Nuevo Build creado (myapp-1, myapp-2, ...)
    ↓
Proceso construcción (clone, build, push)
    ↓
Build completado (Success/Failed)
    ↓
ImageStream actualizado
    ↓ (ImageStream trigger en Deployment)
Redeploy automático
```

## Gestión de Builds

### Crear BuildConfig
```bash
oc new-build https://github.com/user/repo --name=myapp --strategy=docker
```

### Listar BuildConfigs
```bash
oc get bc
```

### Ejecutar build manual
```bash
oc start-build myapp
# o
oc start-build myapp --follow  # Ver logs en vivo
```

### Ver builds ejecutados
```bash
oc get builds
oc logs build/myapp-1
```

### Ver logs de build en progreso
```bash
oc logs -f bc/myapp
```

## Triggers Automáticos

### GitHub Webhook
```
Git push → GitHub notifica → BuildConfig activa
```

### ImageStream
```
Cambio en imagen base → Nuevo build
(ej: python:3.9 actualizado → rebuild automática)
```

### Scheduled
Builds periódicos (como cron)

## S2I en Detalle

**Builder Images disponibles:**
- `python` — Python 2.7, 3.6, 3.8, 3.9, etc.
- `nodejs` — Node.js 12, 14, 16, etc.
- `ruby` — Ruby 2.6, 2.7, 3.0, etc.
- `java` — OpenJDK 8, 11, 17
- `dotnet` — .NET Core
- Custom: Crear builder image propia

**Proceso S2I:**
1. Descarga builder image
2. Clone repositorio en `/tmp/build`
3. Detecta tipo (package.json → Node, requirements.txt → Python, etc.)
4. Ejecuta script `assemble` del builder
5. Crea imagen final
6. Push a registro

## Ventajas de BuildConfig

| Ventaja | Descripción |
|---------|------------|
| **Automatización completa** | Git push → imagen nueva → app actualizada |
| **No requiere infraestructura** | No necesitas Jenkins/GitLab CI aparte |
| **Seguridad** | Construye dentro del clúster con permisos controlados |
| **Integración nativa** | Webhooks, triggers, ImageStreams sincronizadas |
| **Sin Dockerfile** | S2I permite desplegar sin escrib Dockerfile |
| **Versionado automático** | Builds numerados, logs disponibles |

## Relaciones

### Conecta con

- Parte de: [[openshift|OpenShift]] (característica específica)
- Produce: [[imagestream|ImageStream]] (output de cada build)
- Triggers automáticos con: [[imagestream|ImageStream]] (cambios en imágenes base)
- Complementa: [[paas|PaaS (Platform as a Service)]] (automatización de despliegues)

## Fuentes

- [[buildconfig-cicd|Builds: Construcción Automática de Imágenes (Curso 2 - Módulo 4)]]
- [[imagestream-gestion|ImageStreams: Gestión de Imágenes (Curso 2 - Módulo 3)]]
