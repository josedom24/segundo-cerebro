---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_paas_curso]
tags: []
---

# PaaS (Platform as a Service)

## Resumen de una línea
Modelo de computación en la nube que proporciona una plataforma completa para desarrollar, ejecutar y gestionar aplicaciones sin preocuparse por la infraestructura subyacente.

## Definición

**PaaS** = Plataforma como Servicio. Abstracción que oculta la complejidad de infraestructura y proporciona herramientas para que desarrolladores desplieguen aplicaciones directamente.

El desarrollador se enfoca en **código**, la plataforma gestiona **todo lo demás** (servidores, networking, almacenamiento, escalado).

## Capas de Computación en Nube

```
IaaS (Infrastructure as a Service)
└─ Máquinas virtuales, almacenamiento, networking
   (Ejemplo: AWS EC2, OpenStack, Azure)

PaaS (Platform as a Service)
└─ Lenguajes, frameworks, bases de datos gestionadas
   (Ejemplo: Heroku, OpenShift, Google App Engine)

SaaS (Software as a Service)
└─ Aplicaciones completamente gestionadas
   (Ejemplo: Slack, Salesforce, Google Docs)
```

## Características de PaaS

### Abstracción
- Desarrollador: `git push` → aplicación desplegada
- Infraestructura: gestión automática (servidores, escalado, networking)

### Ciclo de Vida Automatizado
```
Código → Git webhook → Build → Test → Deploy → Ejecutando
```

### Despliegue Múltiple
- `oc new-app my-app:latest` (desde imagen)
- `oc new-app https://github.com/user/repo` (desde código)
- `oc new-app --dockerfile` (desde Dockerfile)

### Escalado Automático
- HPA (Horizontal Pod Autoscaler): ajusta réplicas según carga
- Ninguna intervención manual

### Integración CI/CD
- Webhooks automáticos en repositorios Git
- Builds sin intervención
- Despliegues sin intervención

## Ventajas

| Ventaja | Descripción |
|---------|------------|
| **Time-to-market** | Desplegar en minutos, no horas/días |
| **Automatización** | CI/CD nativo, builds, deployments |
| **Escalabilidad** | De 1 usuario a millones sin cambiar código |
| **Abstracción** | Desarrolladores ignoran infraestructura |
| **Mantenimiento** | Actualizaciones de plataforma automáticas |
| **Seguridad** | RBAC, redes aisladas, secretos gestionados |

## Desventajas

| Desventaja | Descripción |
|--------|------------|
| **Vendor lock-in** | Difícil migrar a otra plataforma |
| **Control limitado** | No puedes optimizar detalles bajos |
| **Sobrecostos** | Menos control = a veces más caro que IaaS |
| **Curva de aprendizaje** | Modelo diferente a desarrollo tradicional |

## Implementaciones PaaS

- **OpenShift** (Red Hat) — Kubernetes + PaaS
- **Heroku** — Cloud pública fácil (pero cara)
- **Google App Engine** — GCP PaaS
- **AWS Elastic Beanstalk** — AWS PaaS
- **Cloud Foundry** — Open source PaaS

## Comparación: IaaS vs PaaS vs SaaS

| Responsabilidad | IaaS | PaaS | SaaS |
|---------|------|------|------|
| **Aplicación** | Developer | Developer | Proveedor |
| **Datos** | Developer | Developer | Proveedor |
| **Runtime** | Developer | Proveedor | Proveedor |
| **Middleware** | Developer | Proveedor | Proveedor |
| **Base datos** | Developer | Proveedor | Proveedor |
| **SO** | Developer | Proveedor | Proveedor |
| **Virtualización** | Developer | Proveedor | Proveedor |
| **Servidores** | Proveedor | Proveedor | Proveedor |
| **Almacenamiento** | Proveedor | Proveedor | Proveedor |
| **Networking** | Proveedor | Proveedor | Proveedor |

## Relaciones

### Conecta con
- [[openshift]] — Implementación PaaS basada en Kubernetes
- [[kubernetes]] — Orquestador subyacente (abstracción más baja)
- [[contenedores]] — Unidad de despliegue en PaaS

### Parte de
- Cloud Computing (junto con IaaS, SaaS)

### Comparado con
- **IaaS:** Más control, más complejo (AWS, OpenStack)
- **SaaS:** Menos control, más simple (Slack, Salesforce)

## Fuentes
- Cursos OpenShift v4 (osv4_paas) - Módulo 1
