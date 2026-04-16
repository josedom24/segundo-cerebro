---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kubernetes_cep]
tags: [instalacion, kubernetes]
---

# Instalación de Kubernetes

## Resumen de una línea
Alternativas para instalar Kubernetes localmente: minikube (recomendado para aprendizaje), kubeadm, kind, k3s; instalación de kubectl en Linux/Windows.

## Información
- **Fuente:** Curso Kubernetes - Módulo 2
- **URL GitHub:** https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo2
- **Líneas de contenido:** 400+

---

## Problema: Kubernetes en Desarrollo

### Producción vs Desarrollo

**Kubernetes en Producción:**
- Clúster multi-nodo (3, 5, 7+ nodos)
- Alta disponibilidad
- Balanceadores de carga
- Infraestructura cloud/on-premise
- ❌ Complejo, caro, lento de instalar

**Kubernetes en Desarrollo:**
- Necesitamos aprender k8s
- Single-node o pocos nodos
- Local, rápido, sin costos
- ✅ Simple de usar
- ⚠️ No para producción

### Solución: Instalaciones Locales Simplificadas

---

## Alternativas de Instalación

### 1. Minikube ⭐ (Recomendado para aprendizaje)

```yaml
Qué es:
  - Clúster k8s single-node en local
  - Proyecto oficial de Kubernetes
  - Maduro y fácil de usar
  - Automatizado al máximo

Requisitos:
  - 2 CPUs
  - 2 GB RAM
  - 20 GB disco
  - Virtualizador: Docker, VirtualBox, KVM, Hyper-V, VMware

Ventajas:
  - ✅ Más fácil de instalar
  - ✅ Automatizado
  - ✅ Perfecto para aprender
  - ✅ Requisitos mínimos

Desventajas:
  - ❌ Single-node (no muestra master/worker)
  - ❌ No apto para producción
  - ❌ Recursos limitados

Instalación:
  1. Instalar minikube
  2. minikube start
  3. Listo para kubectl

Tipología:
  - Nodos: 1 (puedes agregar más, pero no necesario)
  - Casos de uso: Aprendizaje, desarrollo local
```

### 2. kubeadm (Más realista, multi-nodo)

```yaml
Qué es:
  - Tool para instalar clúster k8s real
  - Proyecto oficial
  - Más manual que minikube

Ventajas:
  - ✅ Multi-nodo (master + workers)
  - ✅ Muestra arquitectura real
  - ✅ Acerca a producción

Desventajas:
  - ❌ Instalación más compleja
  - ❌ Requiere más recursos
  - ❌ Configuración manual

Casos de uso:
  - Entender arquitectura real
  - Lab dedicado
  - Preparación para producción

Tipología:
  - Nodos: 2+
  - Estructura: 1 master + 1+ workers
```

### 3. kind (Kubernetes In Docker)

```yaml
Qué es:
  - Clúster k8s sobre Docker
  - Proyecto oficial reciente
  - Multi-nodo

Ventajas:
  - ✅ Multi-nodo sin VM
  - ✅ Rápido
  - ✅ Sin overhead de VM

Desventajas:
  - ❌ Requiere Docker
  - ❌ Menos popular que minikube

Casos de uso:
  - Testing CI/CD
  - Desarrollo local avanzado
  - Alternativa a minikube

Tipología:
  - Nodos: N nodos en Docker
```

### 4. k3s (Kubernetes ligero para producción)

```yaml
Qué es:
  - Distribución minimalista de k8s
  - Proyecto CNCF (mantenido por Rancher)
  - 100 MB instalable

Ventajas:
  - ✅ Muy ligero
  - ✅ Apto para IoT/Edge
  - ✅ Bajo consumo de recursos
  - ✅ Para ARM

Desventajas:
  - ❌ No es minikube
  - ❌ Más orientado a producción

Casos de uso:
  - IoT, edge computing
  - Entornos de recursos limitados
  - Producción en sistemas pequeños

Tipología:
  - Nodos: Flexible
  - Arquitectura: Simplificada vs full k8s
```

### 5. Instalaciones Cloud (AWS EKS, GCP GKE, Azure AKS)

```
Ventajas:
  - ✅ Gestionado completamente
  - ✅ Producción listo
  - ✅ Escalabilidad automática

Desventajas:
  - ❌ Costos
  - ❌ Vendor lock-in
```

---

## kubectl: Herramienta de Control

### ¿Qué es?

Herramienta CLI para comunicarse con el API de Kubernetes.

```bash
# Ejemplo: Crear un pod
kubectl run mi-pod --image=nginx

# Ejemplo: Ver pods
kubectl get pods

# Ejemplo: Eliminar un pod
kubectl delete pod mi-pod
```

### Instalación en Linux

```bash
# Descargar kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Hacer ejecutable
chmod +x kubectl

# Mover a PATH
sudo mv kubectl /usr/local/bin/

# Verificar
kubectl version --client
```

### Instalación en Windows

```
1. Descargar kubectl.exe desde:
   https://dl.k8s.io/release/v1.23.0/bin/windows/amd64/kubectl.exe

2. Añadir a PATH

3. Verificar:
   kubectl version --client
```

### Configuración

kubectl necesita un archivo kubeconfig que le diga:
- ¿Dónde está el API server?
- ¿Qué credenciales usar?
- ¿Qué contexto usar?

```bash
# Ubicación típica
~/.kube/config

# Ver contextos
kubectl config get-contexts

# Cambiar contexto
kubectl config use-context minikube
```

---

## Flujo Típico de Configuración

```
1. Instalar virtualizador
   (Docker, VirtualBox, KVM)
   ↓
2. Instalar minikube
   (o herramienta alternativa)
   ↓
3. Iniciar minikube
   minikube start
   ↓
4. Instalar kubectl
   ↓
5. Verificar conexión
   kubectl get nodes
   ↓
6. Listo para desplegar
   kubectl run ...
```

---

## Despliegues Básicos en Kubernetes

Una vez instalado, se puede desplegar:

```bash
# 1. Desplegar una imagen Docker
kubectl run mi-app --image=nginx

# 2. Exponer servicio
kubectl expose pod mi-app --port=80 --type=NodePort

# 3. Ver estado
kubectl get pods
kubectl get services

# 4. Acceder
kubectl port-forward svc/mi-app 8080:80
# Luego: http://localhost:8080
```

---

## Comparativa Resumen

 Herramienta  Nodos  Facilidad  Realismo  Prod 
---------------------------------------------
 **Minikube**  1  ⭐⭐⭐⭐⭐  ⭐  ❌ 
 **kind**  N  ⭐⭐⭐⭐  ⭐⭐  ❌ 
 **kubeadm**  N  ⭐⭐⭐  ⭐⭐⭐⭐  ⭐⭐ 
 **k3s**  N  ⭐⭐⭐⭐  ⭐⭐⭐  ⭐⭐⭐⭐ 

---

## Relaciones

### Conecta con
- [[introduccion-kubernetes|Introducción a Kubernetes]] — Conceptos antes de instalar

---

## Próximo Paso

Una vez instalado, pasamos a [[pods-contenedores|Módulo 3: Pods]].

---

## Fuentes

- [Curso Kubernetes - Módulo 2 (GitHub)](https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo2)
- [Minikube Official](https://minikube.sigs.k8s.io/)
- [kubectl Documentation](https://kubernetes.io/docs/reference/kubectl/)
