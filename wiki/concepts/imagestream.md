---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas]
tags: [openshift, images, containers, imagestream]
---

# ImageStream

## Resumen de una línea
Abstracción de OpenShift que gestiona imágenes de contenedores con referencias inmutables (digests) y triggers automáticos para redeployes.

## Definición
Un **ImageStream** es un recurso de OpenShift que proporciona una abstracción para hacer referencia a imágenes de contenedores, permitiendo crear y actualizar imágenes de forma continua sin romper los despliegues que las usan.

## Características Principales

### Qué es realmente
- **No es una imagen:** Es un puntero a imágenes reales
- **Contiene tags:** Cada tag apunta a una imagen específica (por digest, no por nombre)
- **Uso de digests:** Identifica de forma única una versión (hash SHA-256 de la imagen)
- **Abstracción:** Desvincula los despliegues del registro real de imágenes

### Origen de las imágenes
- **Registro interno:** OpenShift (almacenamiento centralizado del clúster)
- **Registro externo:** Docker Hub, Quay, repositorio privado
- **BuildConfig:** Creadas automáticamente por construcciones

## Ventajas

| Ventaja | Descripción |
|---------|------------|
| **Actualizaciones seguras** | Tag sigue apuntando a versión conocida, no cambia si origen cambia |
| **Triggers automáticos** | Despliegues se actualizan cuando ImageStream se actualiza |
| **Gestión de versiones** | Tags múltiples: latest, stable, v1.0, etc. |
| **Disponibilidad garantizada** | Si imagen del repositorio desaparece, ImageStream mantiene copia local |
| **Acceso controlado** | Gestión de permisos centralizada |

## Casos de Uso

### 1. Actualización Automática
```
ImageStream nginx (tag: latest)
    ↓
Apunta a nginx:1.20.2 (digest: sha256:abc123...)
    ↓
Deployment usa ImageStream:latest
    ↓
Si ImageStream → nginx:1.21.0 automáticamente
    → Trigger redeploy
```

### 2. S2I (Source to Image)
```
BuildConfig + Git
    ↓
Crea ImageStream automáticamente
    ↓
Deployment ya apunta a ImageStream
    ↓
Nuevo push a Git → nuevo build → nuevo ImageStream → redeploy automático
```

## ImageStreamTag

Recurso individual que representa **una etiqueta específica** de un ImageStream:
- Nombre: `imagestream-name:tag`
- Apunta a: Digest (hash único) de una imagen
- Permite: Referencias precisas a versiones

Ejemplo:
```
ImageStream "nginx"
├── Tag "latest" → Digest sha256:abc123...
├── Tag "stable" → Digest sha256:def456...
└── Tag "v1.20" → Digest sha256:ghi789...
```

## Creación de ImageStreams

### Automático (con oc new-app)
```bash
oc new-app bitnami/nginx --name=web
# Crea automáticamente ImageStream "web"
```

### Manual desde registro externo
```bash
oc import-image myapp:latest --from=quay.io/myorg/myapp:latest
```

### Desde BuildConfig
Se crean automáticamente después de cada build exitoso

## Gestión

### Ver ImageStreams
```bash
oc get is
oc describe is nginx
```

### Ver tags disponibles
```bash
oc describe is nginx
# Muestra todos los tags y digests
```

### Actualizar/cambiar tags
```bash
oc tag imagestream:v1.0 imagestream:latest
# Ahora "latest" apunta al mismo digest que "v1.0"
```

## Relaciones

- Parte de: [[OpenShift]] (abstracción propia)
- Usado por: [[Build]] (BuildConfig crea ImageStreams)
- Asociado con: [[Deployment]] (despliegues referencian ImageStreams)
- Reemplaza concepto de: Referencias simples a registros en K8s

## Fuentes
- Curso osv4_paas - Módulo 3: ImageStreams
