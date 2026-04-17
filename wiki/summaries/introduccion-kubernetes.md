---
title: "Introducción a Kubernetes"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kubernetes_cep]
tags: [contenedores, kubernetes, orquestacion]
---

# Introducción a Kubernetes

## Resumen de una línea
Qué es Kubernetes, por qué surge, cómo se diferencia de otras soluciones, y su arquitectura fundamental de nodos master/worker.

## Información
- **Fuente:** Curso Kubernetes - Módulo 1
- **URL GitHub:** https://github.com/iesgn/curso_kubernetes_cep
- **URL Repositorio:** https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo1
- **Líneas de contenido:** 400+


## El Problema: Escalabilidad en Producción

### Aplicaciones Tradicionales vs Internet-Scale

**Aplicaciones internas (tradicionales):**
- Usuarios conocidos (empleados)
- Demanda predecible
- Actualizaciones programadas
- Cambios poco frecuentes
- ✅ Fácil de gestionar

**Aplicaciones en Internet:**
- Miles de millones de usuarios potenciales
- Demanda variable (1 a millones de usuarios)
- Debe estar siempre disponible (24/7/365)
- Actualizaciones frecuentes y continuas
- ❌ Imposible gestionar manualmente

### Arquitectura de Servicios Web Escalables

Evolución de 11 pasos (simplificado):
1. **Paso 1-3:** Separar componentes (web, aplicación, DB)
2. **Paso 4-5:** Añadir cachés (SQL, HTTP)
3. **Paso 6-7:** Escalado horizontal + balanceadores + HA
4. **Paso 8-11:** Microservicios en contenedores distribuidos

**Conclusión:** Gestionar esto manualmente es **imposible**. Necesitamos orquestación.


## ¿Qué es Kubernetes?

### Definición

Kubernetes (k8s) es un **orquestador de contenedores** desarrollado por Google que automatiza:
- 🚀 **Despliegue:** Rápido y automático
- 📈 **Escalabilidad:** Ajusta recursos al vuelo
- 🔄 **Actualizaciones:** Sin interrupciones
- ⚙️ **Gestión de recursos:** Limita y asigna CPU/RAM
- 🔌 **Ciclo de vida completo:** Monitoreo, recuperación, self-healing

### Características Principales

- **Centrado en producción:** Para administradores de sistemas (ops)
- **Infraestructura en nube:** Diseñado para cloud (pública/privada/híbrida)
- **Extensible:** Miles de plugins y módulos
- **Código abierto:** Apache License v2.0
- **Gobernanza abierta:** Dirigido por CNCF (Cloud Native Computing Foundation), no por Google


## Historia del Proyecto Kubernetes

### Origen
- **2014:** Google publica Kubernetes (v0.2)
- Basado en experiencia interna con **Borg** (gestor de clústers de Google)
- Heredero de 20+ años de experiencia en orquestación

### Evolución de Gobernanza

```
2014: Google inicia proyecto
  ↓
2015: Google cede control a CNCF
  ↓
Hoy: Proyecto de fundación con contribuciones abiertas
     Miembros: Decenas de grandes empresas (no solo Google)
```

### Desarrollo Actual

 Aspecto  Detalle 
------------------
 **Repositorio**  GitHub (kubernetes/kubernetes) 
 **Contribuciones**  100,000+ commits, miles de participantes 
 **Versión actual**  1.23+ (2 o 3 releases anuales) 
 **Estabilidad**  Muy estable, retrocompatibilidad mantenida 


## Orquestadores: Alternativas

### Docker Swarm
```
Ventajas:
- Simple, integrado en Docker Engine
- Bajo overhead

Desventajas:
- Funcionalidad limitada
- No competir con k8s en grandes entornos
- En declive
```

### Apache Mesos
```
Ventajas:
- Potente, flexible
- Usado en plataformas como DC/OS

Desventajas:
- Curva de aprendizaje pronunciada
- Menos adopción que k8s
```

### Hashicorp Nomad
```
Ventajas:
- Simple, flexible
- Agnóstico de workloads

Desventajas:
- Requiere software adicional
- Menos integrado que k8s
```

### Kubernetes (k8s)
```
Ventajas:
- Estándar de facto en producción
- Completo: gestión, networking, storage, config
- Enorme ecosistema (CNCF landscape)
- Gobernanza abierta

Desventajas:
- Curva de aprendizaje pronunciada
- Complejo para casos simples
```


## Arquitectura Fundamental

### Concepto: Clúster

Un clúster k8s es un conjunto de **nodos coordinados** (máquinas físicas, VMs, o instancias cloud) que trabajan juntos para ejecutar aplicaciones.

```
┌─────────────────────────────────────────────┐
│           Kubernetes Cluster                 │
├─────────────────────────────────────────────┤
│  Master Nodes (Control Plane)                │
│  ├─ kube-apiserver (API)                     │
│  ├─ etcd (almacén de config)                 │
│  ├─ kube-scheduler (asigna pods)             │
│  └─ kube-controller-manager (controla)       │
├─────────────────────────────────────────────┤
│  Worker Nodes                                │
│  ├─ Node 1: kubelet + containers             │
│  ├─ Node 2: kubelet + containers             │
│  └─ Node 3: kubelet + containers             │
└─────────────────────────────────────────────┘
```

### Tipos de Nodos

**Master (Control Plane)**
- Ejecuta servicios principales de k8s
- Gestiona el estado del clúster
- Ordena a workers qué contenedores ejecutar
- Típicamente 3, 5, o 7 en HA (número impar)

**Worker**
- Ejecutan los contenedores de aplicaciones
- Reciben órdenes del master
- Número variable según demanda


## Componentes del Master (Control Plane)

### kube-apiserver
Interfaz central de Kubernetes. Todos los comandos pasan por aquí.

### etcd
Base de datos clave-valor que almacena **toda la configuración** del clúster.

### kube-scheduler
Selecciona qué nodo worker ejecutará cada contenedor basándose en:
- Disponibilidad de recursos
- Restricciones (affinity, taints)
- Políticas de distribución

### kube-controller-manager
Ejecuta controladores que garantizan el estado deseado:
- ReplicationController
- Node controller
- Endpoint controller

### cloud-controller-manager
Interactúa con proveedores cloud:
- Gestión de nodos
- Balanceadores de carga
- Volúmenes en cloud


## Componentes del Worker

### kubelet
Agente que controla los pods en el nodo:
- Asegura que los contenedores estén corriendo
- Monitorea salud
- Reporta estado al master

### kube-proxy
Implementa networking:
- Permite comunicación entre pods y servicios
- Gestiona reglas de firewall

### Container Runtime
Docker, containerd, CRI-O, etc.

### supervisord
Monitoriza y controla kubelet y el runtime


## Complementos (Add-ons)

Funcionalidad adicional que corre en el propio k8s:

 Add-on  Función 
-----------------
 **Cluster DNS**  Registros DNS para servicios (CoreDNS) 
 **Web UI**  Dashboard visual 
 **Monitoring**  Métricas (Prometheus, Sysdig) 
 **Logging**  Centralización de logs 


## Conceptos Clave

1. **Cluster:** Conjunto coordinado de nodos
2. **Node:** Máquina que ejecuta contenedores
3. **Master/Control Plane:** Nodos que gestionan el clúster
4. **Worker:** Nodos que ejecutan aplicaciones
5. **Pod:** Unidad más pequeña en k8s (veremos después)
6. **Scheduler:** Decide dónde ejecutar los pods
7. **etcd:** Corazón de la configuración del clúster


## Relaciones

### Conecta con
- [[kubernetes|Kubernetes]] — Concepto fundamental de orquestación
- [[contenedores|Contenedores]] — Base de k8s
- [[docker|Docker]] — Runtime por defecto
- [[docker-compose|Docker Compose]] — Orquestación simple (un solo host)

### Primer paso en
- Orquestación de contenedores escalable
- Arquitectura cloud-native


## Flujo de Aprendizaje

```
Módulo 1 (aquí): ¿Por qué k8s? Arquitectura básica
   ↓
Módulo 2: Instalar k8s (minikube + kubectl)
   ↓
Módulo 3: Pods (unidad básica)
   ↓
Módulo 4: ReplicaSets (escalabilidad)
   ↓
Módulo 5: Deployments (ciclo de vida)
   ↓
Módulo 6: Services (acceso a apps)
   ↓
Módulo 7: ConfigMaps/Secrets (config)
   ↓
Módulo 8: Storage (persistencia)
   ↓
Módulo 9: Otros workloads (StatefulSets, Jobs)
   ↓
Módulo 10: Helm (empaquetado)
```


## Fuentes

- [Curso Kubernetes - Módulo 1 (GitHub)](https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo1)
- [Kubernetes Official Documentation](https://kubernetes.io/docs/)
- [CNCF Landscape](https://landscape.cncf.io/)
