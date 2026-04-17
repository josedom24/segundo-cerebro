---
title: "Ejemplo Final: Aplicación Citas (Curso 1 - Módulo 9)"
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_k8s_curso]
tags: [openshift]
---

# Ejemplo Final: Aplicación Citas (Curso 1 - Módulo 9)

## Resumen
Despliegue end-to-end de aplicación real: Citas (microservicios). Incluye citas-backend (Python), citas-frontend (Node.js), base de datos MySQL, y actualización de versiones.

## Arquitectura de la Aplicación

```
Cliente HTTP
    ↓
Route citas.example.com
    ↓
Service citas-frontend
    ↓
Deployment frontend (Node.js)
    ├─ Route citas-api.example.com
    ├─ Service citas-backend
    │   ├─ Deployment backend-v1 (Python)
    │   └─ Deployment backend-v2 (Python actualizado)
    │
    └─ Comunicación interna
        ↓
        Service mysql
        ↓
        Deployment mysql
        ├─ ConfigMap (database, usuario)
        ├─ Secret (passwords)
        └─ PVC (almacenamiento)
```

## Componentes

### Backend (citas-backend)
- **Lenguaje:** Python
- **Propósito:** API REST que maneja citas
- **Endpoints:** GET /citas, POST /citas, etc.
- **Acceso DB:** Variable envvironment para host MySQL
- **Versiones:** v1 y v2 (ejemplo de actualización)

### Frontend (citas-frontend)
- **Lenguaje:** Node.js
- **Propósito:** Interfaz web, llama a backend API
- **Comunicación:** HTTP REST a backend
- **Ruta:** Acceso público vía Route

### Base de Datos (MySQL)
- **Propósito:** Almacenar citas
- **Almacenamiento:** PVC persistente
- **Acceso:** Internal Service DNS
- **Configuración:** ConfigMap + Secrets

## Despliegue Paso a Paso

### 1. Crear proyecto
```bash
oc new-project citas
```

### 2. Desplegar MySQL
```bash
oc new-app mysql:5.7 \
  -e MYSQL_DATABASE=citas \
  -e MYSQL_USER=citas \
  -e MYSQL_PASSWORD=secret123 \
  -e MYSQL_ROOT_PASSWORD=rootsecret
```

### 3. Desplegar Backend
```bash
oc new-app python:3.9~https://github.com/user/citas-backend \
  --name=citas-backend \
  -e DATABASE_HOST=mysql \
  -e DATABASE_USER=citas \
  -e DATABASE_PASSWORD=secret123
```

### 4. Desplegar Frontend
```bash
oc new-app node:14~https://github.com/user/citas-frontend \
  --name=citas-frontend \
  -e BACKEND_URL=http://citas-backend:5000
```

### 5. Exponer aplicación
```bash
oc expose service citas-frontend \
  --hostname=citas.example.com
```

## Actualización: Backend v1 → v2

### Trigger automático (si usa Git)
```
Git push → Webhook → BuildConfig
  ↓
Nuevo build → Nueva ImageStream
  ↓
Deployment trigger
  ↓
Rolling update automático
```

### Manual
```bash
# Cambiar imagen en Deployment
oc set image deployment/citas-backend \
  citas-backend=myrepo/citas-backend:v2 \
  --record

# Ver progreso
oc rollout status deployment/citas-backend

# Si falla, rollback
oc rollout undo deployment/citas-backend
```

## Escalado y Acceso

### Escalar Frontend
```bash
oc scale deployment citas-frontend --replicas=3
```

### Ver estado
```bash
oc get deployments
oc get pods
oc logs -f deployment/citas-backend
```

### Acceso a URLs
```
Frontend: https://citas.example.com
Backend (interno): http://citas-backend:5000
MySQL (interno): mysql:3306
```

## Lecciones del Ejemplo

1. **Microservicios:** Frontend y backend independientes
2. **Comunicación interna:** Nombres DNS (service.namespace.svc)
3. **Almacenamiento:** MySQL requiere PVC
4. **Actualizaciones:** Rolling updates sin downtime
5. **Configuración:** ConfigMap + Secrets
6. **Acceso público:** Routes para clientes externos

## Relaciones

### Conecta con
- Aplicación de: [[deployment|Deployment]], [[service|Service]], [[route|Route]]
- Usa: ConfigMap, Secret, [[volume|Volume]]
- Ejemplo de: Arquitectura microservicios real

## Fuentes
- [Curso: OpenShift v4](https://plataforma.josedomingo.org/pledin/cursos/osv4_k8s/)
