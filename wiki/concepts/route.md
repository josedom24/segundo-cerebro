---
title: Route
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_k8s]
tags: [openshift, redes, route]
---

# Route

## Resumen de una línea
Recurso de OpenShift que simplifica el acceso HTTP/HTTPS a aplicaciones, funcionando como una versión más sencilla del Ingress de Kubernetes.

## Definición
Una **Route** es un mecanismo de OpenShift que expone un Service en una dirección HTTP/HTTPS accesible desde fuera del clúster, permitiendo enrutamiento basado en hostname y path.

## Comparación: Route vs Ingress (Kubernetes)

| Aspecto | Route (OpenShift) | Ingress (K8s) |
|--------|----------|---------|
| **Complejidad** | Simple, configuración mínima | Más compleja, YAML verboso |
| **Creación** | `oc expose service` | YAML multi-líneas |
| **Hostname** | Automático (DNS interno) | Manual, requiere DNS externo |
| **Actualizaciones** | Automáticas | Requiere recarga |
| **TLS** | Fácil, auto-managed | Requiere certificados manuales |
| **Wildcards** | Soporte nativo | Limitado |

## Tipos de Routes

### 1. Unsecured (HTTP)
```
Cliente HTTP
    ↓
Route
    ↓
Service
    ↓
Pod
```

Uso: Desarrollo, testing interno

### 2. Edge TLS (HTTPS terminada en Route)
```
Cliente HTTPS
    ↓
Route (TLS termination)
    ↓
HTTP a Service
    ↓
Pod
```

Ventaja: Certificado en Route, backends en HTTP

### 3. Passthrough TLS (HTTPS end-to-end)
```
Cliente HTTPS
    ↓
Route (solo enrutamiento)
    ↓
HTTPS a Service
    ↓
Pod (TLS termination)
```

Ventaja: Pod responsable de certificado

### 4. Re-encrypt (HTTPS certificados diferentes)
```
Cliente HTTPS (cert1)
    ↓
Route (cert1 → cert2)
    ↓
Backend HTTPS (cert2)
```

## Creación

### Automática (lo más común)
```bash
oc new-app nodeimage:latest --name=myapp
oc expose svc/myapp --hostname=myapp.example.com
# Automáticamente:
# - Crea Route "myapp"
# - Hostname: myapp.example.com
# - Apunta a Service "myapp"
# - TLS automático (si configured)
```

### Manual YAML
```yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: myapp-route
spec:
  host: myapp.example.com
  to:
    kind: Service
    name: myapp
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
```

## Enrutamiento Avanzado

### Por Path
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

### Wildcards
```yaml
spec:
  host: *.example.com    # Cualquier subdominio
  to:
    kind: Service
    name: app
```

### Balanceo de carga
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

## Gestión

### Ver Routes
```bash
oc get routes
oc describe route myapp-route
```

### Crear Route desde Service
```bash
oc expose service myservice --name=myroute
```

### Editar Route
```bash
oc edit route myapp-route
```

### Eliminar
```bash
oc delete route myapp-route
```

## Hostname Automático

En CRC (local):
```
Route → Route nombre
↓
myapp-project.apps-crc.testing
```

En cloud público:
```
Route → Route nombre
↓
myapp-project.apps.example.com
```

El dominio base lo configura el cluster administrator.

## TLS/Certificados

### Automático (Recomendado)
```bash
oc create route edge myapp \
  --service=myapp \
  --cert=cert.pem \
  --key=key.pem
```

### Let's Encrypt Integration
OpenShift puede integrar cert-manager para renovación automática

### Auto-generated
OpenShift genera certificados self-signed si no se proporciona

## Relaciones

### Conecta con

- Parte de: [[openshift|OpenShift]] (característica específica)
- Expone: [[service|Service]] (acceso a Pods internos)
- Alternativa a: Ingress de [[kubernetes|Kubernetes]] (más simple)
- Complementa: [[paas|PaaS (Platform as a Service)]] (simplificación de acceso a aplicaciones)

## Ventajas sobre Ingress

| Ventaja |
|---------|
| Configuración simplificada |
| Hostname automático |
| TLS/HTTPS built-in |
| Menos YAML, más intuitivo |
| Integración nativa OpenShift |

## Fuentes

- [[services-routes|Services Routes]]
- [[services-routes-avanzado|Services Routes Avanzado]]
