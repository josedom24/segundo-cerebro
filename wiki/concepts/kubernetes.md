---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kubernetes_cep]
tags: [kubernetes, orquestacion, contenedores, cloud-native]
aliases: [Kubernetes]
---

# Kubernetes

## Resumen de una línea
Orquestador de contenedores a nivel enterprise: múltiples nodos master/worker, auto-scaling, rolling updates, storage persistente, DNS interno, ideal para aplicaciones cloud-native.

## Definición

**Kubernetes (K8s)** = Plataforma de orquestación de contenedores de código abierto que automatiza la implementación, escalabilidad y gestión de aplicaciones en contenedores.

Abstrae la infraestructura subyacente para que los desarrolladores se enfoquen en aplicaciones, no en máquinas.

## Conceptos Clave

### Arquitectura

```
Cluster Kubernetes:
  ├─ Master Node (Control Plane)
  │   ├─ API Server
  │   ├─ Scheduler
  │   ├─ Controller Manager
  │   └─ etcd (almacenamiento estado)
  │
  ├─ Worker Node 1
  │   ├─ kubelet
  │   ├─ Container runtime (Docker/podman)
  │   └─ kube-proxy
  │
  └─ Worker Node 2
      ├─ kubelet
      ├─ Container runtime
      └─ kube-proxy
```

### Unidades de Trabajo

- **Pod**: Unidad mínima, 1+ contenedores (usualmente 1)
- **ReplicaSet**: Escalabilidad automática, N replicas
- **Deployment**: Rolling updates, rollbacks, ciclo de vida
- **StatefulSet**: Identidad persistente (bases de datos)
- **DaemonSet**: Ejecutar en cada nodo (logging, monitoreo)
- **Job/CronJob**: Tareas que terminan o periódicas

### Exposición de Servicios

- **ClusterIP**: Interno, DNS automático
- **NodePort**: Puerto en cada nodo (acceso externo)
- **LoadBalancer**: IP pública, load balancing
- **Ingress**: Enrutamiento HTTP/HTTPS, dominios

### Configuración y Secretos

- **ConfigMap**: Configuración (archivos, variables)
- **Secrets**: Credenciales (contraseñas, tokens)
- Separación config/código → reproducibilidad

### Almacenamiento

- **PersistentVolume (PV)**: Almacenamiento cluster
- **PersistentVolumeClaim (PVC)**: Request de almacenamiento
- **StorageClass**: Provisioning dinámico
- Desacoplamiento aplicación ↔ almacenamiento

### Packaging y Distribución

- **Helm**: Package manager de Kubernetes
- **Charts**: Plantillas reutilizables (como apt packages)
- Simplifica instalación de aplicaciones complejas

## Ventajas

```
✅ Auto-escalabilidad horizontal
✅ Self-healing (reinicia contenedores fallidos)
✅ Rolling updates sin downtime
✅ Portabilidad entre clouds
✅ Gestión declarativa (deseado state)
✅ Comunidad enorme (CNCF)
✅ Ecosistema maduro
```

## Desventajas

```
❌ Curva de aprendizaje pronunciada
❌ Complejidad para apps simples
❌ Overhead de recursos (master nodes)
❌ Debugging más difícil que docker-compose
❌ Requiere infraestructura o managed service
```

## Casos de Uso

```
🟢 Microservicios complejos
🟢 Alta disponibilidad crítica
🟢 Multi-tenant SaaS
🟢 Escalado dinámico por demanda
🟢 Migración cloud-agnostic

🔴 Aplicación monolítica simple
🔴 Presupuesto muy limitado
🔴 Baja carga de trabajo
```

## Instalación

### Local (Desarrollo)

- **minikube**: VM single-node (fácil setup)
- **kind**: Kubernetes en Docker (rápido)
- **kubeadm**: Multi-node manual (educativo)

### Cloud (Producción)

- **EKS** (AWS)
- **AKS** (Azure)
- **GKE** (Google Cloud)
- **DigitalOcean Kubernetes**

## Relaciones

### Conecta con
- [[Contenedores]] — Unidad de deployment
- [[Docker]] — Runtime típico
- [[Podman]] — Alternativa OCI-compatible

### Parte de
- Cloud Native Computing Foundation (CNCF) ecosystem

### Comparado con
- [[Docker]] Compose: Simple single-host
- Nomad: Orquestador general-purpose (no solo contenedores)
- OpenShift: Kubernetes + features enterprise

## Fuentes

- [Curso Kubernetes 2024 (CEP)](https://github.com/iesgn/curso_kubernetes_cep)
- [Kubernetes Official](https://kubernetes.io/)
- [CNCF Landscape](https://landscape.cncf.io/)
