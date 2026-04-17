---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_kubernetes_cep]
tags: [dns, kubernetes, redes, service]
aliases: [Service]
---

# Service

## Resumen de una línea
Abstracción Kubernetes para exponer Pods: load balancing automático, DNS interno, múltiples tipos (ClusterIP, NodePort, LoadBalancer, Ingress).

## Definición

**Service** = Punto de acceso estable a un conjunto de Pods. Proporciona:
- IP virtual estable (no cambia si Pods se recrean)
- Load balancing entre Pods
- DNS interno automático
- Exposición a usuarios externos (según tipo)

## Tipos de Service

### ClusterIP (Interno)

```yaml
kind: Service
spec:
  type: ClusterIP
  selector:
    app: mi-app
  ports:
  - port: 80
    targetPort: 8080
```

**Características:**
- Solo accesible desde dentro cluster
- IP virtual interna
- DNS: `mi-app.default.svc.cluster.local`
- Ideal: comunicación inter-servicios

### NodePort (Público en cada nodo)

```yaml
kind: Service
spec:
  type: NodePort
  selector:
    app: mi-app
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30080      # Puerto en cada nodo (30000-32767)
```

**Características:**
- Abierto en puerto de cada nodo
- Accesible: `nodo-ip:30080`
- Útil: desarrollo, testing
- Menos eficiente que LoadBalancer

### LoadBalancer (IP pública)

```yaml
kind: Service
spec:
  type: LoadBalancer
  selector:
    app: mi-app
  ports:
  - port: 80
    targetPort: 8080
```

**Características:**
- IP pública dedicada
- Load balancer externo asignado
- Mejor para producción
- Requiere cloud provider (AWS, GCP, Azure)

### Ingress (Enrutamiento HTTP/HTTPS)

```yaml
kind: Ingress
metadata:
  name: mi-ingress
spec:
  rules:
  - host: miapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: mi-app
            port:
              number: 80
```

**Características:**
- Enrutamiento L7 (HTTP/HTTPS)
- Dominios y paths
- TLS/SSL nativo
- Múltiples servicios en 1 IP

## Load Balancing Automático

```
Service (ClusterIP 10.0.0.100)
    ├─ Pod1 (10.244.0.5)
    ├─ Pod2 (10.244.0.6)
    └─ Pod3 (10.244.0.7)

Cliente solicita → 10.0.0.100
Service distribuye → Pod1, Pod2, o Pod3
```

## Service Discovery (DNS)

Kubernetes DNS automático:

```bash
# Dentro cluster, acceso directo:
curl http://mi-app        # En mismo namespace
curl http://mi-app.default.svc.cluster.local  # FQDN
```

## Relaciones

### Conecta con
- [[deployment|Deployment]] — Define Pods a exponer
- [[pod|Pod]] — Unidad detrás del Service
- [[kubernetes|Kubernetes]] — Patrón de networking

### Reutilizable en
- Kubernetes principalmente
- Conceptos de load balancing en otros contextos

## Fuentes

- [Curso Kubernetes - Services](https://github.com/iesgn/curso_kubernetes_cep)
- [Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)
