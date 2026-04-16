---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kubernetes_cep]
tags: [configuracion, kubernetes, secrets]
---

# Despliegues Parametrizados: ConfigMaps y Secrets

## Resumen de una línea
ConfigMap y Secret permiten parametrizar Deployments sin cambiar imágenes: configuración, credenciales y variables de entorno separadas del código.

## Información
- **Fuente:** Curso Kubernetes - Módulo 7
- **URL GitHub:** https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo7

---

## Problema: Configuración Hardcodeada

```dockerfile
# Dockerfile
FROM python:3.9
ENV DB_PASSWORD=secret123      ❌ Hardcodeado
ENV DB_HOST=prod-db            ❌ Hardcodeado
```

Problemas:
- ❌ Misma imagen para dev/prod
- ❌ Cambios requieren rebuild
- ❌ Secretos en imágenes

**Solución:** ConfigMaps y Secrets

---

## ConfigMap: Configuración

### Definición

ConfigMap almacena datos no sensibles como pares clave-valor:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_HOST: "postgres.default.svc"
  DATABASE_PORT: "5432"
  APP_ENV: "production"
  LOG_LEVEL: "info"
```

### Uso en Deployment

```yaml
spec:
  containers:
  - name: app
    image: myapp:1.0
    envFrom:
    - [[config|MapRef:
        name: app-config
    # Inyecta todas las vars del ConfigMap
```

### Operaciones

```bash
# Crear ConfigMap
kubectl create configmap app-config --from-literal=DB_HOST=localhost

# Ver ConfigMaps
kubectl get configmaps
kubectl describe configmap app-config

# Editar
kubectl edit configmap app-config

# Eliminar
kubectl delete configmap app-config
```

---

## Secret: Datos Sensibles

### Definición

Secret almacena datos sensibles (contraseñas, tokens, certificados):

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  password: cGFzc3dvcmQxMjM=  # base64 encoded
  username: YWRtaW4=            # base64 encoded
```

### Tipos de Secrets

 Tipo  Uso 
-----------
 `Opaque`  Datos genéricos (default) 
 `kubernetes.io/basic-auth`  Usuario/contraseña 
 `kubernetes.io/ssh-auth`  SSH keys 
 `kubernetes.io/tls`  Certificados TLS 
 `kubernetes.io/dockercfg`  Docker config 

### Uso en Deployment

```yaml
spec:
  containers:
  - name: app
    image: myapp:1.0
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password
```

### Operaciones

```bash
# Crear Secret
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=secret123

# Ver Secrets
kubectl get secrets
kubectl describe secret db-secret

# Decodificar (base64)
kubectl get secret db-secret -o jsonpath='{.data.password}'  base64 -d
```

---

## Comparación

 Aspecto  ConfigMap  Secret 
---------------------------
 **Datos**  Públicos  Sensibles 
 **Tamaño**  Hasta 1MB  Hasta 1MB 
 **Encoding**  Plaintext  Base64 
 **Caso de uso**  Config, URLs  Credenciales, tokens 

---

## Uso de Variables de Entorno

### Directa

```yaml
env:
- name: APP_NAME
  value: "myapp"
```

### Desde ConfigMap

```yaml
env:
- name: DB_HOST
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: DATABASE_HOST
```

### Desde Secret

```yaml
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-credentials
      key: password
```

### Todas desde ConfigMap

```yaml
envFrom:
- [[config|MapRef:
    name: app-config
```

---

## Caso de Uso: WordPress + MariaDB

```yaml
# ConfigMap para WordPress
apiVersion: v1
kind: ConfigMap
metadata:
  name: wordpress-config
data:
  WORDPRESS_DB_HOST: "mariadb:3306"
  WORDPRESS_DB_NAME: "wordpress"
  WORDPRESS_TABLE_PREFIX: "wp_"
---
# Secret para credenciales
apiVersion: v1
kind: Secret
metadata:
  name: wordpress-secret
type: Opaque
data:
  WORDPRESS_DB_USER: d29yZHByZXNz  # base64(wordpress)
  WORDPRESS_DB_PASSWORD: cGFzc3dvcmQ=  # base64(password)
  WORDPRESS_AUTH_KEY: ...
---
# Deployment usa ambos
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
spec:
  template:
    spec:
      containers:
      - name: wordpress
        image: wordpress:5.9
        envFrom:
        - [[config|MapRef:
            name: wordpress-config
        - [[secret|Ref:
            name: wordpress-secret
```

---

## Relaciones

### Conecta con
- [[deployments|Deployments]] — Usa ConfigMaps/Secrets
- [[services-acceso|Services]] — Acceso a apps configuradas

---

## Fuentes

- [Curso Kubernetes - Módulo 7 (GitHub)](https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo7)
- [Kubernetes ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
