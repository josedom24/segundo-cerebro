---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kubernetes_cep]
tags: [kubernetes, helm]
aliases: [Helm]
---

# Helm

## Resumen de una línea
Package manager de Kubernetes: charts (plantillas reutilizables), templating con variables, versionado, distribución simplificada de aplicaciones complejas.

## Definición

**Helm** = Package manager para Kubernetes (como apt para Debian, npm para Node.js).

Simplifica instalación de aplicaciones complejas (que requieren múltiples deployments, services, configmaps, etc.) en una sola línea.

## Conceptos Clave

### Chart

Plantilla reutilizable que describe una aplicación Kubernetes:

```
mychart/
├── Chart.yaml              # Metadatos
├── values.yaml             # Variables por defecto
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── ingress.yaml
└── charts/                 # Dependencias
```

### Values (Configuración)

```yaml
# values.yaml (por defecto)
image:
  repository: nginx
  tag: "1.21"
  pullPolicy: IfNotPresent

replicas: 3

service:
  type: LoadBalancer
  port: 80
```

### Templating

Templates usan Golang templating:

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-deployment
spec:
  replicas: {{ .Values.replicas }}
  template:
    spec:
      containers:
      - name: app
        image: {{ .Values.image.repository }}:{{ .Values.image.tag }}
```

### Releases

Instancia de un chart:

```bash
# Instalar chart mychart con release "my-app"
helm install my-app ./mychart

# Listar releases
helm list

# Upgrade
helm upgrade my-app ./mychart --values custom-values.yaml

# Rollback a versión anterior
helm rollback my-app 1
```

## Flujo Típico

```
1. Buscar chart
   helm search hub wordpress

2. Agregar repositorio
   helm repo add bitnami https://charts.bitnami.com/bitnami

3. Descargar valores por defecto
   helm show values bitnami/wordpress

4. Personalizar
   nano my-values.yaml

5. Instalar
   helm install mi-blog bitnami/wordpress -f my-values.yaml

6. Verificar
   helm list
   kubectl get pods
```

## Helm Hub (Repositorio Central)

```
https://artifacthub.io/
  → Thousands of charts
  → bitnami, stable, jetstack, ...
  → Verificadas, actualizadas
```

## Ventajas

```
✅ Reutilización de configuraciones
✅ Versionado de releases
✅ Rollback fácil
✅ Templating reduce repetición
✅ Dependencias entre charts
✅ Testing antes de instalar (helm lint, helm template)
```

## Desventajas

```
❌ Otro lenguaje/tool que aprender
❌ Debugging templates complicado
❌ Seguridad (secrets en values)
❌ Curva aprendizaje pronunciada
```

## Estructura de Chart Profesional

```
mychart/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-prod.yaml
├── templates/
│   ├── NOTES.txt           # Mensaje post-install
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   └── _helpers.tpl        # Funciones reutilizables
├── charts/                 # Dependencias (otros charts)
└── tests/                  # Tests de chart
```

## Casos de Uso

```
🟢 Instalar aplicaciones complejas (WordPress, Prometheus, ELK)
🟢 Multi-ambiente (dev, staging, prod con mismo chart)
🟢 Distribución de apps (venderlas como charts)
🟢 GitOps (versionar releases en git)

🔴 Configuración simple (usa kubectl directamente)
🔴 Full customization (demasiadas variables)
```

## Relaciones

### Conecta con
- [[kubernetes|Kubernetes]] — Plataforma subyacente
- [[podman|Podman]] — Container images que empaqueta

### Parte de
- Ecosistema CNCF
- GitOps practices (Flux, ArgoCD usan charts)

### Complementa
- [[kubernetes|Kubernetes]] package distribution
- CI/CD pipelines para deployment

## Fuentes

- [Curso Kubernetes 2024 (CEP)](https://github.com/iesgn/curso_kubernetes_cep)
- [Helm Official](https://helm.sh/)
- [Artifact Hub (Chart Repository)](https://artifacthub.io/)
