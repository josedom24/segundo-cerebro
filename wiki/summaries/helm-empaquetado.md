---
title: "Helm: Empaquetado y Despliegue de Aplicaciones"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kubernetes_cep]
tags: [helm, kubernetes]
---

# Helm: Empaquetado y Despliegue de Aplicaciones

## Resumen de una línea
Helm es el "apt/npm de Kubernetes": gestor de paquetes que permite instalar aplicaciones complejas (DBs, CMS) sin escribir YAMLs manuales.

## Información
- **Fuente:** Curso Kubernetes - Módulo 10
- **URL GitHub:** https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo10


## Problema: YAML Repetitivo

### Escenario: Instalar WordPress

Necesitas crear manualmente:
- ConfigMap (configuración)
- Secret (credenciales)
- PVC (almacenamiento)
- Deployment (WordPress)
- Deployment (MariaDB)
- Service (WordPress)
- Service (MariaDB)

```
≥ 8 archivos YAML
≥ 200+ líneas
Propenso a errores
```

**Solución:** Helm


## Concepto: Helm

**Helm** = gestor de paquetes para Kubernetes

```
npm     → JavaScript
apt     → Linux
pip     → Python
Helm    → Kubernetes 🎯
```

### Chart

Package Helm = "Chart":
- Colección de templates YAML
- Variables/parámetros
- Valores por defecto
- Dependencias


## Flujo Típico

### Instalar Aplicación con Helm

```bash
# 1. Añadir repositorio
helm repo add bitnami https://charts.bitnami.com/bitnami

# 2. Buscar chart
helm search repo wordpress

# 3. Instalar con valores personalizados
helm install my-wordpress bitnami/wordpress \
  --set wordpressUsername=admin \
  --set wordpressPassword=mypassword \
  --set mariadb.auth.rootPassword=secret

# ✅ Instala: WordPress + MariaDB + configuración
```

### Sin Helm

```bash
# Necesitarías crear:
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f pvc-wordpress.yaml
kubectl apply -f pvc-mariadb.yaml
kubectl apply -f deployment-wordpress.yaml
kubectl apply -f deployment-mariadb.yaml
kubectl apply -f service-wordpress.yaml
kubectl apply -f service-mariadb.yaml

# 8+ comandos, 200+ líneas de YAML ❌
```


## Componentes de Helm

### Chart: Paquete

```
wordpress/
├── Chart.yaml          # Metadata
├── values.yaml         # Valores por defecto
├── templates/          # Templates YAML
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── secret.yaml
├── charts/             # Dependencias (MariaDB)
└── README.md
```

### Release: Instancia

```
Chart: bitnami/wordpress (plantilla)
Release: my-wordpress (instancia 1)
Release: my-wordpress-prod (instancia 2)

Mismo chart, diferentes valores
```

### Repository: Repositorio

```
repos:
- Bitnami: https://charts.bitnami.com
- Stable: https://charts.helm.sh/stable
- Jetstack: https://charts.jetstack.io
- Custom: https://charts.mycompany.com
```


## Operaciones Comunes

### Instalar

```bash
# Simple
helm install my-app bitnami/wordpress

# Con valores
helm install my-app bitnami/wordpress \
  --values custom-values.yaml \
  --set wordpress.password=secret

# Dry-run (preview sin instalar)
helm install my-app bitnami/wordpress --dry-run
```

### Ver Releases

```bash
# Listar
helm list

# Listar todas (todos namespaces)
helm list -A

# Ver detalles
helm status my-wordpress

# Ver valores
helm get values my-wordpress
```

### Actualizar

```bash
# Upgrade de versión
helm upgrade my-wordpress bitnami/wordpress

# Upgrade con nuevos valores
helm upgrade my-wordpress bitnami/wordpress \
  --set wordpress.password=newpassword
```

### Rollback

```bash
# Ver historial
helm history my-wordpress

# Rollback a versión anterior
helm rollback my-wordpress 1
```

### Desinstalar

```bash
# Eliminar release (y recursos)
helm uninstall my-wordpress
```


## Valores y Personalización

### values.yaml Default

```yaml
# bitnami/wordpress/values.yaml
wordpressUsername: user
wordpressEmail: user@example.com
wordpressPassword: ""

mariadb:
  enabled: true
  auth:
    rootPassword: secret
  primary:
    persistence:
      size: 8Gi
```

### Personalizar con Archivo

```yaml
# custom-values.yaml
wordpressUsername: admin
wordpressPassword: mypassword
mariadb:
  primary:
    persistence:
      size: 20Gi
```

```bash
helm install my-app bitnami/wordpress -f custom-values.yaml
```

### Personalizar con Flags

```bash
helm install my-app bitnami/wordpress \
  --set wordpressPassword=secret \
  --set mariadb.primary.persistence.size=20Gi
```


## Crear un Chart Propio

### Estructura Básica

```bash
helm create mychart
mychart/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
└── charts/
```

### Chart.yaml

```yaml
apiVersion: v2
name: mychart
description: Mi aplicación personalizada
version: 0.1.0
appVersion: "1.0"
```

### templates/deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mychart.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - [[container|Port: {{ .Values.service.port }}
```

### values.yaml

```yaml
replicaCount: 3
image:
  repository: myapp
  tag: 1.0
service:
  port: 8080
```


## Casos de Uso

### Instalar WordPress

```bash
helm install wordpress bitnami/wordpress \
  --set wordpressPassword=secure123
```

### Instalar PostgreSQL

```bash
helm install postgres bitnami/postgresql \
  --set postgresqlPassword=secure123 \
  --set persistence.size=20Gi
```

### Instalar Nginx Ingress

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx
```


## Helm vs Deployment Manual

 Aspecto  Manual YAML  Helm 
--------------------------
 **Líneas YAML**  200+  0 (chart hace todo) 
 **Reutilización**  ❌  ✅ 
 **Parametrización**  Hardcodeado  ✅ Flexible 
 **Versioning**  Manual  ✅ Automático 
 **Rollback**  Manual  ✅ helm rollback 
 **Instalación**  8+ comandos  1 comando 
 **Actualizaciones**  Manual merge  helm upgrade 


## Relaciones

### Conecta con
- [[helm|Helm]] — Package manager de Kubernetes
- [[kubernetes|Kubernetes]] — Orquestador donde corre Helm
- [[deployments|Deployments: Ciclo de Vida Completo]] — Lo que Helm despliega
- [[services-acceso|Services: Acceso a Aplicaciones]] — Parte de Charts
- [[almacenamiento-kubernetes|Almacenamiento en Kubernetes]] — PVCs en Charts

### Parte de
- Gestión y empaquetado de aplicaciones en Kubernetes


## Conclusión: Fin del Curso

```
Módulo 1: Introducción a Kubernetes
   ↓
Módulo 2: Instalación (minikube, kubectl)
   ↓
Módulo 3: Pods (unidad mínima)
   ↓
Módulo 4: ReplicaSets (escalabilidad)
   ↓
Módulo 5: Deployments (ciclo de vida)
   ↓
Módulo 6: Services (acceso)
   ↓
Módulo 7: ConfigMaps/Secrets (configuración)
   ↓
Módulo 8: Storage (persistencia)
   ↓
Módulo 9: StatefulSets, DaemonSets, Jobs
   ↓
Módulo 10: Helm ← ¡Estás aquí!

✅ Completo: Kubernetes end-to-end
```


## Fuentes

- [Curso Kubernetes - Módulo 10 (GitHub)](https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo10)
- [Helm Official Website](https://helm.sh/)
- [Helm Documentation](https://helm.sh/docs/)
- [Artifact Hub (Chart Repository)](https://artifacthub.io/)
