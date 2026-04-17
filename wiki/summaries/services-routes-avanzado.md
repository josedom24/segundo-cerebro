---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas_curso]
tags: [openshift, redes, services]
---

# Acceso a Aplicaciones: Services y Routes (Curso 2 - Módulo 7)

## Resumen
Exposición de aplicaciones en OpenShift: Services (interno), Routes (externo), DNS, tipos de acceso, y configuración TLS.

## Conceptos Clave

### Service (Repaso)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP
```

**Tipos:**
- **ClusterIP:** Solo interno (default)
- **NodePort:** Puerto en cada nodo
- **LoadBalancer:** IP externa

### Route (Repaso + avanzado)
```yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: myapp
spec:
  host: myapp.example.com
  path: /
  to:
    kind: Service
    name: myapp
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
```

### Enrutamiento por Hostname
```bash
oc create route edge myapp \
  --service=myapp \
  --hostname=myapp.example.com
```

### Enrutamiento por Path
```yaml
spec:
  host: example.com
  path: /api
  to:
    kind: Service
    name: api-service
---
spec:
  host: example.com
  path: /web
  to:
    kind: Service
    name: web-service
```

### DNS Interno
**Formato:** `service-name.namespace.svc.cluster.local`

**Ejemplo:**
```yaml
env:
- name: DATABASE_HOST
  value: mysql.default.svc.cluster.local
```

**Resolución automática:** OpenShift CoreDNS

### TLS/Certificados

#### Edge (Route termina TLS)
```yaml
spec:
  tls:
    termination: edge
    certificate: |
      -----BEGIN CERTIFICATE-----
      ...
    key: |
      -----BEGIN RSA PRIVATE KEY-----
      ...
    insecureEdgeTerminationPolicy: Redirect  # HTTP 301 a HTTPS
```

#### Passthrough (Pod termina TLS)
```yaml
spec:
  tls:
    termination: passthrough
```

Uso: Pod maneja propio certificado

#### Re-encrypt (certificados diferentes)
```yaml
spec:
  tls:
    termination: reencrypt
    certificate: ...    # Cliente a Route
    destinationCACertificate: ...  # Route a backend
```

### Wildcard Routes
```bash
oc create route edge *.example.com \
  --service=wildcard-app
```

Acceso: app1.example.com, app2.example.com, etc.

### Balanceo de Carga
```yaml
spec:
  to:
    kind: Service
    name: primary
    weight: 80
  alternateBackends:
  - kind: Service
    name: secondary
    weight: 20
```

### Creación desde Consola
- Developer view → +Add → Import YAML
- Administrator view → Networking → Routes
- Botón: Create Route

## Relaciones

### Conecta con
- Parte de: [[openshift|OpenShift]]
- Expone: [[service|Service]] internamente
- Reemplaza: [[kubernetes|Ingress]] de Kubernetes (más simple)

## Fuentes
- [Curso: OpenShift v4 PaaS](https://plataforma.josedomingo.org/pledin/cursos/osv4_paas/)
