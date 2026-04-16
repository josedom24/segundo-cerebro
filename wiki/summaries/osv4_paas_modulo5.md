---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas_curso]
tags: [openshift, imagestream, tags, updates, automation]
---

# ImageStreams Avanzado: Etiquetas y Actualizaciones (Curso 2 - Módulo 5)

## Resumen
Gestión avanzada de ImageStreams: etiquetado, promoción entre entornos (dev→test→prod), actualizaciones automáticas de imágenes base, y patrones de versioning.

## Conceptos Clave

### Gestión de Tags

#### Crear Tags
```bash
# Tag nuevo apuntando a existente
oc tag nginx:latest nginx:stable

# Tag apuntando a externa
oc tag myregistry/app:v2 app:latest

# Tag apuntando a otra IS
oc tag proj-a/app:v1 proj-b/app:v1
```

#### Eliminar Tags
```bash
oc delete istag app:old-version
```

#### Ver Tags
```bash
oc get istag -A  # Todos los tags
oc describe is app  # Tags específicos de app
```

### Patrones de Versioning

#### Latest (Moving Tag)
```
app:latest → Apunta a build más reciente
app:latest → Se actualiza con cada build
app:latest → Riesgoso en producción
```

#### Stable (Fixed Tag)
```
app:stable → Apunta a build aprobado
app:stable → Se actualiza cuando "promover"
app:stable → Seguro en producción
```

#### Semantic Versioning
```
app:v1.0.0 → Release específica
app:v1.0 → Patch versions
app:v1 → Minor versions
```

### Promoción entre Entornos

```
Desarrollo:
  Build → app:dev (latest)

Pruebas:
  Cuando ready: oc tag app:dev app:test
  Deployment prueba usa app:test

Producción:
  Cuando aprobado: oc tag app:test app:stable
  Deployment prod usa app:stable
```

**Ventaja:** Misma imagen en todos entornos, trazabilidad

### Actualizaciones Automáticas

#### Monitorear Imagen Base
```bash
oc import-image python:3.9 \
  --scheduled=true \
  --from=python:3.9

# OpenShift chequea periódicamente python:3.9
```

**Workflow:**
```
python:3.9 actualiza en Docker Hub
    ↓ (OpenShift chequea)
ImageStream detecta cambio
    ↓
IS apunta a nuevo digest
    ↓ (BuildConfig ImageChange trigger)
Nuevo build automático
    ↓
Imagen app actualizada
    ↓ (Deployment trigger)
Redeploy automático
```

### BuildConfig + ImageStream Integration

#### Build referencia imagen base via IS
```yaml
spec:
  strategy:
    sourceStrategy:
      from:
        kind: ImageStreamTag
        name: python:3.9  # NOT docker.io/library/python:3.9
  triggers:
    - type: ImageChange
      imageChangeParams:
        automatic: true
        from:
          kind: ImageStreamTag
          name: python:3.9  # Trigger si cambia
```

**Resultado:**
```
python:3.9 actualiza
    ↓
BuildConfig detecta (ImageChange trigger)
    ↓
Nuevo build automático
    ↓
app:latest actualizado
    ↓
Deployment redeploy
```

### Diferencias: Scheduled vs Manual
- **Scheduled:** OpenShift chequea periódicamente
- **Manual:** `oc import-image` cuando quieras

### Multi-Entorno Pattern
```
Repositorio:
  main branch → Deployment dev (app:dev)
  release branch → Deployment prod (app:stable)

Tags:
  app:dev = build de main reciente
  app:stable = tag manual cuando release

Flujo:
  1. Dev: push → build → app:dev
  2. Test: oc tag app:dev app:test
  3. Prod: oc tag app:test app:stable
```

## Relaciones
- Extensión de: [[imagestream]]
- Usado por: [[build]] (producción)
- Patrón para: Multi-entorno (dev/test/prod)
- Automation: Triggers automáticos

## Fuentes
- Curso osv4_paas - Módulo 5
