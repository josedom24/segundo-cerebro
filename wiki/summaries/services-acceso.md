---
title: "Services: Acceso a Aplicaciones"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kubernetes_cep]
tags: [dns, kubernetes, redes, services]
---

# Services: Acceso a Aplicaciones

## Resumen de una línea
Service proporciona acceso estable a Deployments mediante IP virtual y DNS, con tipos: ClusterIP, NodePort, LoadBalancer, e Ingress para HTTP.

## Información
- **Fuente:** Curso Kubernetes - Módulo 6
- **URL GitHub:** https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo6


## Problema: Acceso a Pods Efímeros

```
Deployment: web-app ×3 Pods
Pods tienen IP: 10.0.0.1, 10.0.0.2, 10.0.0.3 (efímeras)

Problema:
- IPs cambian cuando Pod muere
- ¿A cuál Pod conectarse?
- ¿Cómo balancear carga?
```

**Solución:** Service


## Concepto: Service

Service = punto de acceso **estable** a Pods dinámicos

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: ClusterIP
  selector:
    app: web       # Selecciona Pods con este label
  ports:
  - port: 80
    targetPort: 8080
```


## Tipos de Services

### 1. ClusterIP (Interno)

```yaml
type: ClusterIP
```

```
Service IP: 10.96.0.1 (interna)
Acceso: Dentro del clúster
Ejemplo: servicio de bases de datos interno
```

**Uso:**
```bash
# Desde otro Pod
curl http://web-service:80
# Kubernetes DNS resuelve automáticamente
```

### 2. NodePort (Externo)

```yaml
type: NodePort
spec:
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30000  # Puerto en cada nodo (30000-32767)
```

```
Acceso: NodeIP:30000
Ejemplo: http://192.168.1.100:30000
```

**Uso:** Acceso desde fuera del clúster (desarrollo)

### 3. LoadBalancer (Cloud)

```yaml
type: LoadBalancer
```

```
Cloud crea Load Balancer externo
IP pública asignada automáticamente
Ejemplo: http://load-balancer-ip
```

**Uso:** Producción en cloud (AWS, GCP, Azure)

### 4. ExternalName

```yaml
type: ExternalName
externalName: example.com
```

CNAME a servicio externo


## DNS en Kubernetes

Kubernetes proporciona DNS interno:

```
Service: web-service
Namespace: default

Resolucion:
- web-service → 10.96.0.1
- web-service.default → 10.96.0.1
- web-service.default.svc.cluster.local → 10.96.0.1
```

### Descubrimiento de Servicios

```bash
# Dentro de un Pod
curl http://db-service:5432
# Kubernetes DNS resuelve automáticamente
```


## Ingress Controller

Para HTTP/HTTPS avanzado (routing por URL/host):

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
  - host: example.com
    http:
      paths:
      - path: /app1
        pathType: Prefix
        backend:
          service:
            name: app1-service
            port:
              number: 80
      - path: /app2
        pathType: Prefix
        backend:
          service:
            name: app2-service
            port:
              number: 80
```

```
http://example.com/app1 → app1-service
http://example.com/app2 → app2-service
```


## Operaciones Comunes

### Crear Service

```bash
# Imperativo
kubectl expose deployment web-app --type=ClusterIP --port=80

# Declarativo
kubectl apply -f service.yaml
```

### Ver Services

```bash
# Listar
kubectl get svc

# Detalles
kubectl describe svc web-service

# Endpoints (Pods asociados)
kubectl get endpoints web-service
```

### Acceder a Service

```bash
# Desde dentro del clúster
kubectl exec -it pod-name -- curl http://web-service

# Port forward (desarrollo)
kubectl port-forward svc/web-service 8080:80
# Luego: http://localhost:8080
```


## Parámetros Clave

 Parámetro  Función 
--------------------
 `type`  ClusterIP, NodePort, LoadBalancer 
 `selector`  Labels de Pods a balancear 
 `port`  Puerto del Service 
 `targetPort`  Puerto del contenedor 
 `nodePort`  Puerto en nodo (NodePort) 


## Relaciones

### Conecta con
- [[deployments|Deployments]] — Qué accesar
- [[configmaps-y-secrets|ConfigMaps]] — Configuración


## Fuentes

- [Curso Kubernetes - Módulo 6 (GitHub)](https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo6)
- [Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Kubernetes Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
