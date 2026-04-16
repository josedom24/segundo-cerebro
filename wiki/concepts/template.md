---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas]
tags: [openshift, templates, parametrization, deployments]
---

# Template

## Resumen de una línea
Plantilla parametrizada de OpenShift que permite crear conjuntos repetibles de recursos (Deployment, Service, ConfigMap, etc.) con valores configurables.

## Definición
Un **Template** es un archivo YAML que define un conjunto de recursos de OpenShift con parámetros que pueden reemplazarse en tiempo de instanciación, permitiendo reutilizar configuraciones complejas.

## Estructura Básica

```yaml
apiVersion: template.openshift.io/v1
kind: Template
metadata:
  name: wordpress
  description: "WordPress + MySQL"
objects:
  - apiVersion: v1
    kind: Service
    metadata:
      name: wordpress-${APP_NAME}
    spec:
      ...
  - apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: mysql-${APP_NAME}
    ...
parameters:
  - name: APP_NAME
    description: "Nombre de la aplicación"
    value: myapp
    required: true
  - name: DATABASE_PASSWORD
    description: "Contraseña de MySQL"
    generate: expression
    from: '[a-zA-Z0-9]{16}'
    required: true
```

## Parámetros

### Tipos de Parámetros

1. **Simples con valor por defecto**
```yaml
- name: NAMESPACE
  description: "Namespace destino"
  value: production
```

2. **Requeridos**
```yaml
- name: API_KEY
  required: true
  description: "API Key obligatoria"
```

3. **Con sugerencias**
```yaml
- name: IMAGE_VERSION
  description: "Versión de imagen"
  value: "1.0"
  required: false
```

4. **Generados automáticamente**
```yaml
- name: DATABASE_PASSWORD
  description: "Contraseña aleatoria"
  generate: expression
  from: '[a-zA-Z0-9]{16}'
```

## Usos de Parámetros

Dentro del Template se reemplazan con `${PARAM_NAME}`:

```yaml
spec:
  replicas: ${{REPLICAS}}
  template:
    containers:
    - image: mysql:${MYSQL_VERSION}
      env:
      - name: MYSQL_ROOT_PASSWORD
        value: ${DATABASE_PASSWORD}
```

## Uso Práctico

### Listar Templates disponibles
```bash
oc get templates -n openshift
# Muestra plantillas predefinidas (mariadb, postgresql, etc.)
```

### Ver parámetros de un Template
```bash
oc describe template mariadb-ephemeral -n openshift
oc process --parameters mariadb-ephemeral -n openshift
```

### Crear recursos desde Template
```bash
# Con valores por defecto
oc new-app mariadb-ephemeral

# Especificando parámetros
oc new-app mariadb-ephemeral \
  -p MEMORY_LIMIT=512Mi \
  -p MYSQL_ROOT_PASSWORD=mypassword
```

### Procesar Template (ver YAML generado)
```bash
oc process mariadb-ephemeral \
  -p MEMORY_LIMIT=512Mi \
  -p MYSQL_ROOT_PASSWORD=mypassword | oc apply -f -
```

## Template Catalog

OpenShift incluye Templates predefinidos:

| Template | Recursos | Uso |
|----------|----------|-----|
| **mariadb-ephemeral** | Service, Deployment, ConfigMap | MariaDB sin persistencia |
| **mariadb-persistent** | Lo anterior + PVC | MariaDB con almacenamiento |
| **postgresql-ephemeral** | Service, Deployment | PostgreSQL sin persistencia |
| **postgresql-persistent** | Lo anterior + PVC | PostgreSQL con almacenamiento |
| **mongodb-ephemeral** | Service, Deployment | MongoDB sin persistencia |
| **mongodb-persistent** | Lo anterior + PVC | MongoDB con almacenamiento |

## Ventajas

| Ventaja | Descripción |
|---------|------------|
| **Reutilización** | Misma plantilla para dev, test, prod |
| **Parametrización** | Cambiar valores sin tocar YAML base |
| **Consistencia** | Múltiples deploys idénticos |
| **Documentación** | Parámetros documentan configuración |
| **Catálogo central** | Descubrir aplicaciones compartidas |
| **Automatización** | Scripts pueden procesar y aplicar |

## Ejemplo Completo: WordPress + MySQL

```yaml
apiVersion: template.openshift.io/v1
kind: Template
metadata:
  name: wordpress-complete
objects:
  # MySQL
  - apiVersion: v1
    kind: Service
    metadata:
      name: mysql-${APP_NAME}
    spec:
      selector:
        app: mysql-${APP_NAME}
      ports:
      - port: 3306
  
  - apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: mysql-${APP_NAME}
    spec:
      replicas: 1
      template:
        spec:
          containers:
          - image: mysql:${MYSQL_VERSION}
            env:
            - name: MYSQL_ROOT_PASSWORD
              value: ${MYSQL_PASSWORD}
  
  # WordPress
  - apiVersion: v1
    kind: Service
    metadata:
      name: wordpress-${APP_NAME}
    spec:
      selector:
        app: wordpress-${APP_NAME}
      ports:
      - port: 80

  - apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: wordpress-${APP_NAME}
    spec:
      replicas: ${WORDPRESS_REPLICAS}
      template:
        spec:
          containers:
          - image: wordpress:latest
            env:
            - name: WORDPRESS_DB_HOST
              value: mysql-${APP_NAME}
            - name: WORDPRESS_DB_PASSWORD
              value: ${MYSQL_PASSWORD}

  # Route para acceso público
  - apiVersion: route.openshift.io/v1
    kind: Route
    metadata:
      name: wordpress-${APP_NAME}
    spec:
      host: ${APP_NAME}.example.com
      to:
        kind: Service
        name: wordpress-${APP_NAME}

parameters:
  - name: APP_NAME
    description: "Nombre de la aplicación"
    value: myapp
    required: true
  - name: MYSQL_VERSION
    description: "Versión de MySQL"
    value: "8.0"
  - name: MYSQL_PASSWORD
    description: "Contraseña MySQL"
    generate: expression
    from: '[a-zA-Z0-9]{16}'
    required: true
  - name: WORDPRESS_REPLICAS
    description: "Réplicas de WordPress"
    value: "2"
```

Uso:
```bash
oc new-app wordpress-complete \
  -p APP_NAME=blog \
  -p MYSQL_PASSWORD=secret123 \
  -p WORDPRESS_REPLICAS=3
```

## Relaciones

- Parte de: [[openshift]] (característica propia)
- Define: Conjunto de recursos ([[deployment]], [[service]], [[route]], etc.)
- Similar a: [[helm]] charts de [[kubernetes]] (pero más simple)
- Complementa: [[paas]] (parametrización de aplicaciones)

## Fuentes
- Curso osv4_paas - Módulo 2: Templates
