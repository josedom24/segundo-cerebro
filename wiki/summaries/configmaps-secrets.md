---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_k8s_curso]
tags: [openshift, secrets]
---

# Despliegues Parametrizados (Curso 1 - Módulo 6)

## Resumen
Cómo parametrizar despliegues en OpenShift usando variables de entorno, ConfigMaps para configuración, y Secrets para datos sensibles. Ejemplo completo: WordPress + MySQL.

## Conceptos Clave

### Variables de Entorno
**Propósito:** Pasar configuración a contenedores

```yaml
containers:
- image: myapp
  env:
  - name: DATABASE_HOST
    value: mysql.default.svc.cluster.local
  - name: DATABASE_USER
    value: wordpress
```

**Uso en app:** `$DATABASE_HOST`, `$DATABASE_USER`

### ConfigMap
**Propósito:** Almacenar configuración (no sensible)

**Características:**
- Key-value pairs
- Montaje como archivos o envvars
- Reutilizable en múltiples Pods
- Fácil actualización

**Uso:**
```bash
oc create configmap myconfig --from-literal=key=value
oc set env deployment/myapp --from=configmap/myconfig
```

### Secret
**Propósito:** Almacenar datos sensibles (encriptados)

**Tipos:**
- `Opaque`: Generic key-value
- `kubernetes.io/dockercfg`: Credenciales Docker
- `kubernetes.io/dockerconfigjson`: Docker config JSON
- `kubernetes.io/basic-auth`: Usuario/contraseña
- `kubernetes.io/ssh-auth`: SSH key

**Uso:**
```bash
oc create secret generic mysecret --from-literal=password=secret123
oc set env deployment/myapp --from=secret/mysecret
```

### Agrupación de Aplicaciones
- **Application grouping:** Agrupar despliegues relacionados en topología
- **Connect:** Establecer relaciones visuales entre componentes

## Ejemplo: WordPress + MySQL

### Arquitectura
```
Route myapp.example.com
    ↓
Service wordpress
    ↓
Deployment wordpress (replicas=2)
    ↓ (conecta a MySQL via env)
Deployment mysql
    ├─ Volume (almacenamiento)
    └─ Service mysql
```

### ConfigMaps
```
mysql-config:
  MYSQL_DATABASE: wordpress
  MYSQL_USER: wordpress
```

### Secrets
```
mysql-secret:
  MYSQL_PASSWORD: <generated>
  MYSQL_ROOT_PASSWORD: <generated>
```

### Despliegue
```bash
oc new-app mysql:5.7 -e MYSQL_ROOT_PASSWORD=secret
oc new-app wordpress:latest -e WORDPRESS_DB_HOST=mysql
oc expose service wordpress --hostname=myapp.example.com
```

## Relaciones

### Conecta con
- Parte de: [[openshift|OpenShift]]
- Usa: ConfigMap, Secret, Environment variables
- Ejemplo de: Despliegue real multi-tier

## Fuentes
- [Curso: OpenShift v4](https://plataforma.josedomingo.org/pledin/cursos/osv4_k8s/)
