---
title: "CRC (CodeReady Containers) (Curso 1 - Módulo 3)"
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_k8s_curso]
tags: [openshift]
---

# CRC (CodeReady Containers) (Curso 1 - Módulo 3)

## Resumen
Instalación local de OpenShift v4 en laptop usando CRC. Cluster single-node con Kubernetes/OpenShift completo para desarrollo offline sin costes.

## Conceptos Clave

### ¿Qué es CRC?
- **Instalación local:** OpenShift v4 en máquina personal
- **Single-node:** Un solo nodo del cluster
- **Máquina virtual:** Corre en VM controlada localmente
- **Gratuito:** Sin cuotas ni costes de cloud
- **Desarrollo:** Ideal para trabajar offline

### Características de CRC
- **Control total:** Eres admin del cluster
- **Usuarios:** Developer (sin privilegios) + kubeadmin (admin)
- **Sin límites de recursos:** Usos los que asignes a VM
- **Almacenamiento:** Volúmenes = directorios del host (hostpath)
- **Operadores:** Instalar funcionalidades vía Operators

### Instalación
1. Descargar CRC desde developers.redhat.com
2. Seguir wizard de instalación
3. `crc setup` → prepara VM
4. `crc start` → inicia cluster
5. Configurar `oc` con credenciales

### Usuarios en CRC
- **kubeadmin:** Admin, acceso total (no usar para desarrollo normal)
- **developer:** Usuario regular, permisos limitados (recomendado)

### Almacenamiento en CRC
- **Tipos de volumen:**
  - **hostpath:** Directorio en host (único tipo disponible)
  - Todos los Pods en mismo nodo → mismo almacenamiento

- **Usuarios admin/developer:** Admin puede crear PV, developer crea PVC

### Diferencias: CRC vs Sandbox
| Aspecto | CRC | Sandbox |
|--------|-----|---------|
| Ubicación | Local (laptop) | Cloud (Red Hat) |
| Admin | Sí (kubeadmin) | No |
| Almacenamiento | hostpath | Cloud storage |
| Conectividad | Offline posible | Requiere internet |
| Duración | Indefinida | 1 mes |

## Proyectos en OpenShift
- **Aislamiento:** Namespace para agrupar recursos
- **RBAC:** Control de acceso por usuario/rol
- **Recursos:** Deployments, Services, Pods por proyecto

## Relaciones

### Conecta con
- Alternativa a: Developer Sandbox
- Implementación local de: [[openshift|OpenShift]]
- Herramienta de desarrollo: Para antes de producción

## Fuentes
- [Curso: OpenShift v4](https://plataforma.josedomingo.org/pledin/cursos/osv4_k8s/)
