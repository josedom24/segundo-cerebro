---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas_curso]
tags: [openshift, security, rbac, network-policy, secrets]
---

# Seguridad en OpenShift (Curso 2 - Módulo 10)

## Resumen
Seguridad en OpenShift: RBAC (control de acceso), network policies (aislamiento de red), secrets (datos sensibles), Security Context (privilegios), y auditoría.

## Conceptos Clave

### RBAC (Role-Based Access Control)

#### Roles
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployer
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "create", "update", "patch"]
```

**Recursos:**
- deployments, pods, services, routes
- configmaps, secrets
- persistentvolumeclaims

**Verbos:**
- get, list, watch (lectura)
- create, patch, update (escritura)
- delete (eliminación)

#### RoleBinding
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: developer-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: deployer
subjects:
- kind: User
  name: alice@example.com
- kind: Group
  name: developers
```

**Resultado:** usuario alice + grupo developers pueden hacer acciones en Role

#### Roles Predefinidos
- `view`: Lectura completa en namespace
- `edit`: Lectura/escritura en namespace
- `admin`: Admin completo en namespace
- `cluster-admin`: Admin total del cluster

### Network Policy (Aislamiento de Red)
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-policy
spec:
  podSelector:
    matchLabels:
      tier: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          tier: frontend
    ports:
    - protocol: TCP
      port: 8080
```

**Resultado:** Solo Pods con label "tier=frontend" pueden acceder backend:8080

### Secrets (Datos Sensibles)
```bash
# Crear secret
oc create secret generic db-creds \
  --from-literal=username=admin \
  --from-literal=password=secret123

# Usar en Deployment
oc set env deployment/app \
  --from=secret/db-creds \
  --prefix=DB_
```

**Almacenamiento:**
- Encriptado en etcd (si configurado)
- No en logs
- Permisos RBAC controlados

### SecurityContext (Privilegios de Pod)
```yaml
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
        - ALL
```

**Restricciones:**
- Non-root user
- Sin privilege escalation
- Capabilities limitadas
- Read-only filesystem

### PodSecurityPolicy
```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
  - ALL
  fsGroup:
    rule: MustRunAs
    ranges:
    - min: 1
      max: 65535
  runAsUser:
    rule: MustRunAsNonRoot
```

**Aplicación:** Todos los Pods deben cumplir política

### Image Registry Security
```yaml
# ImagePullSecret para registros privados
oc create secret docker-registry regcred \
  --docker-server=myregistry.com \
  --docker-username=user \
  --docker-password=pass

# Usar en Deployment
spec:
  imagePullSecrets:
  - name: regcred
  containers:
  - image: myregistry.com/myapp:v1
```

### Auditoría
```
Todas las acciones en OpenShift se loguean:
- Quién (user)
- Qué (acción: create, update, delete)
- Dónde (resource, namespace)
- Cuándo (timestamp)
- Resultado (success/failure)
```

**Acceso:** Logs centralizados (Elasticsearch)

### Network Policies Avanzadas

#### Deny All
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

#### Allow All
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  ingress:
  - {}
```

#### Por Namespace
```yaml
ingress:
- from:
  - namespaceSelector:
      matchLabels:
        name: allowed-namespace
```

## Relaciones
- Parte de: [[openshift]], [[kubernetes]]
- RBAC: Control de acceso basado roles
- Network Policy: Aislamiento micro-segmentación
- Secrets: Gestión de credenciales

## Fuentes
- Curso osv4_paas - Módulo 10
