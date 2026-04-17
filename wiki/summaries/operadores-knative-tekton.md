---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas_curso]
tags: [openshift]
---

# Extensiones de OpenShift: Operadores, Knative, Tekton (Curso 2 - Módulo 8)

## Resumen
Extensibilidad de OpenShift: Operadores (instalación de software), Knative (serverless), Tekton (CI/CD), y cómo ampliar funcionalidad del cluster.

## Conceptos Clave

### Operadores
**Propósito:** Automatizar instalación y gestión de software complejo

**Ventaja:** Operaciones automáticas, no manual

**Ejemplos:**
- Red Hat OpenStack (RHOSO)
- Prometheus (monitorización)
- Elasticsearch (búsqueda)
- Kafka (messaging)

**Instalación:**
- OperatorHub (en OpenShift web console)
- Buscar operador
- Instalar en namespace
- Crear CustomResource (CR)

**Workflow:**
```
Instalar Operador (deployable pod)
    ↓
Crear CustomResource (configuración)
    ↓
Operador detecta CR
    ↓
Operador crea/configura componentes
    ↓
Sistema funcionando automáticamente
```

### Knative (Serverless)
**Propósito:** Ejecutar código sin gestionar infraestructura

**Conceptos:**
- **Serving:** Exponer servicios serverless
- **Eventing:** Event-driven workloads

**Características:**
- Auto-escalado a cero (sin uso = no cuesta)
- Escalado automático
- Versionado de servicios
- Traffic splitting (canary deployments)

**Ejemplo:**
```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: myapp
spec:
  template:
    spec:
      containers:
      - image: myapp:latest
```

**Acceso:** URL automática + auto-escala

### Tekton (CI/CD Nativo)
**Propósito:** Pipeline CI/CD declarativa dentro OpenShift

**Conceptos:**
- **Task:** Unidad de trabajo (build, test, deploy)
- **TaskRun:** Ejecución de task
- **Pipeline:** Flujo de tasks
- **PipelineRun:** Ejecución de pipeline

**Ejemplo Pipeline:**
```yaml
apiVersion: tekton.dev/v1
kind: Pipeline
metadata:
  name: build-test-deploy
spec:
  tasks:
  - name: build
    taskRef:
      name: build-image
    params:
    - name: repo-url
      value: https://github.com/user/app
  - name: test
    taskRef:
      name: test-image
    runAfter:
    - build
  - name: deploy
    taskRef:
      name: deploy-image
    runAfter:
    - test
```

**Ventaja:** Pipelines en código, versionable, reproducible

### Cómo Ampliar OpenShift
1. **OperatorHub:** Instalar software pre-empaquetado
2. **Tekton:** Customizar CI/CD
3. **Webhooks:** Integración externa
4. **Custom Operators:** Escribir propio operador

## Relaciones

### Conecta con
- Extensiones de: [[openshift|OpenShift]]
- Knative: Abstracción por encima de Pods
- Tekton: Alternativa a Jenkins
- Operadores: Software as code

## Fuentes
- [Curso: OpenShift v4 PaaS](https://plataforma.josedomingo.org/pledin/cursos/osv4_paas/)
