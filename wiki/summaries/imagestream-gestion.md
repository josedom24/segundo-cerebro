---
title: "ImageStreams: Gestión de Imágenes (Curso 2 - Módulo 3)"
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas_curso]
tags: [automatizacion, imagestream, openshift]
---

# ImageStreams: Gestión de Imágenes (Curso 2 - Módulo 3)

## Resumen
Profundización en ImageStreams: cómo gestionar imágenes en OpenShift, referencias inmutables (digests), etiquetado, actualizaciones automáticas, y triggers de redeploy.

## Conceptos Clave

### ImageStream (Repaso)
- **No es imagen:** Es referencia/puntero
- **Apunta a digest:** Hash único (SHA-256) de imagen
- **Permite tags:** latest, stable, v1.0, etc.
- **Abstracción:** Desvincula de registry real

### Ventajas Core
1. **Seguridad:** Si imagen en Docker Hub actualiza, IS mantiene versión conocida
2. **Triggers:** Redeploy automático cuando ImageStream cambia
3. **Gestión:** Tags centralizados en cluster
4. **Control:** Acceso/permisos a imágenes

### Registro Interno vs Externo
- **Interno:** OpenShift (almacenamiento centralizado)
- **Externo:** Docker Hub, Quay.io, registro privado

### Creación de ImageStreams

#### Automática (oc new-app)
```bash
oc new-app bitnami/nginx --name=web
# Automáticamente crea ImageStream "web"
```

#### Manual desde Registro Externo
```bash
oc import-image myapp:latest \
  --from=quay.io/myorg/myapp:latest \
  --confirm
```

#### Desde BuildConfig
```bash
# Cada build exitoso:
# BuildConfig → Build → ImageStream actualizado
```

### ImageStreamTag
Cada tag individual es un recurso:
```
ImageStream "nginx"
├── Tag "latest" → Digest sha256:abc123
├── Tag "stable" → Digest sha256:def456
└── Tag "v1.20" → Digest sha256:ghi789
```

Comando:
```bash
oc describe is nginx
# Muestra todos los tags y digests
```

### Etiquetado (Tagging)
```bash
# Crear tag nuevo apuntando a otro tag
oc tag nginx:v1.20 nginx:latest
# Ahora "latest" apunta a mismo digest que "v1.20"

# Tag apuntando a imagen externa
oc tag myregistry/myapp:v2.0 myapp:latest
```

### Actualizaciones Automáticas
**ImageStream puede monitorear imagen externa:**
```bash
oc import-image myapp:latest \
  --from=quay.io/myorg/myapp:latest \
  --scheduled=true  # Chequear periódicamente
```

**Workflow:**
```
Imagen externa se actualiza
    ↓
OpenShift detecta cambio (periódicamente)
    ↓
ImageStream apunta a nuevo digest
    ↓
Trigger en Deployment (si configurado)
    ↓
Redeploy automático
```

### Triggers
ImageStream trigger en Deployment:
```yaml
spec:
  triggers:
  - type: ImageChange
    imageChangeParams:
      automatic: true
      containerNames:
      - mycontainer
      from:
        kind: ImageStreamTag
        name: myapp:latest
```

**Resultado:** Si ImageStream:latest cambia → redeploy automático

### Gestión desde Consola Web
- **Administrator view → Image Streams**
- Ver registros internos
- Importar imágenes externas
- Gestionar tags
- Ver cuáles Pods usan qué imagen

## Relaciones

### Conecta con
- Parte de: [[openshift|OpenShift]]
- Produce: [[build|Build (BuildConfig en OpenShift)]] (BuildConfig crea IS)
- Usa: [[deployment|Deployment]] (referencian IS)
- Alternativa: Referencias simples a Docker registros

## Fuentes
- [Curso: OpenShift v4 PaaS](https://plataforma.josedomingo.org/pledin/cursos/osv4_paas/)
