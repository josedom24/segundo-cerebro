---
title: "Despliegue de Aplicaciones en OpenShift v4 (Curso 2 - Módulo 2)"
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas_curso]
tags: [deployment, imagenes, openshift, templates]
---

# Despliegue de Aplicaciones en OpenShift v4 (Curso 2 - Módulo 2)

## Resumen
Métodos para desplegar aplicaciones en OpenShift: desde imágenes Docker, código fuente (S2I), Dockerfile, y Templates del catálogo. Comparación de enfoques PaaS.

## Conceptos Clave

### Métodos de Despliegue

#### 1. Desde Imagen Docker
```bash
oc new-app bitnami/nginx --name=web
```

**Workflow:**
- Pull imagen de registro
- Crea Deployment, Service
- Automáticamente crea ImageStream
- Listo para acceso via Route

**Ventaja:** Rápido, usa imagen existente
**Desventaja:** No integración Git, manual

#### 2. Desde Código Fuente (S2I)
```bash
oc new-app python:3.9~https://github.com/user/myapp --name=myapp
```

**Workflow:**
- Clone código
- Detecta lenguaje (package.json, requirements.txt, etc.)
- BuildConfig automático
- S2I builder image
- Imagen construida
- Deployment automático

**Ventaja:** 
- Sin Dockerfile requerido
- Git webhook integrado
- Actualización automática

**Soportados:** Python, Node.js, Ruby, Java, PHP, .NET, Go

#### 3. Desde Dockerfile
```bash
oc new-app https://github.com/user/myapp --strategy=docker --name=myapp
```

**Workflow:**
- Clone código
- Busca Dockerfile
- BuildConfig Docker
- Build image
- Deploy

**Ventaja:** Control total sobre imagen
**Desventaja:** Requiere escribir Dockerfile

#### 4. Desde Catálogo (Templates)
```bash
oc new-app mariadb-persistent \
  -p MEMORY_LIMIT=512Mi \
  -p MYSQL_ROOT_PASSWORD=secret
```

**Qué incluye Template:**
- Deployment
- Service
- ConfigMap/Secret
- PVC (si persistent)
- Route

**Ventaja:** Configurado por expertos, parametrizable
**Uso:** Bases de datos, middleware

### Consola Web vs CLI

**CLI (oc new-app):**
- Rápido para desarrolladores
- Fácil scripting
- Control total

**Consola Web:**
- UI intuitiva
- +Add → Deploy Image/Source
- Wizards paso a paso
- Visual feedback

### ImageStreams Automáticos
Cada `oc new-app` crea ImageStream automáticamente:
```bash
oc get is
# Muestra stream de imágenes disponibles
```

**Ventaja:** Triggers automáticos para redeploy

## Relaciones

### Conecta con
- Parte de: [[openshift|OpenShift]] (característica PaaS)
- Usa: [[build|Build]] (construcción automática)
- Produce: [[imagestream|ImageStream]] (referencias)
- Define: Deployment, Service, Route

## Fuentes
- [Curso: OpenShift v4 PaaS](https://plataforma.josedomingo.org/pledin/cursos/osv4_paas/)
