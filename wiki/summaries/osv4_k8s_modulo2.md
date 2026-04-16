---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_k8s_curso]
tags: [openshift, developer-sandbox, oc-cli]
---

# Red Hat OpenShift Dedicated Developer Sandbox (Curso 1 - Módulo 2)

## Resumen
Instalación y uso del Developer Sandbox: plataforma gratuita en cloud de Red Hat. Descarga de `oc` CLI, configuración de acceso, y primeros pasos en la consola web de OpenShift.

## Conceptos Clave

### Developer Sandbox
- **Plataforma:** Cloud gestionado por Red Hat (gratuito)
- **Duración:** 1 mes de acceso libre
- **Usuario:** Developer (sin permisos admin)
- **Ideal para:** Aprender OpenShift en entorno real sin costes

### Acceso al Developer Sandbox
1. Registrarse en https://www.openshift.com/try
2. Obtener credenciales
3. Acceder a consola web
4. Descargar `oc` CLI desde panel de ayuda

### CLI: Herramienta `oc`
**Propósito:** Gestionar recursos OpenShift desde línea de comandos

**Instalación:**
1. Acceder consola web → Icono ayuda (arriba derecha)
2. Elegir "Command Line Tools"
3. Descargar versión para tu SO (Linux, macOS, Windows)
4. Descomprimir e instalar en PATH:
   ```bash
   tar xvf oc.tar
   sudo install oc /usr/local/bin
   ```

**Ventajas sobre kubectl:**
- Extensiones OpenShift (new-app, routes, etc.)
- Sintaxis similar a kubectl
- Manejo de recursos específicos de OpenShift

### Consola Web
- **Developer view:** Diseño moderno para desarrolladores
- **Administrator view:** Gestión completa del cluster
- **Topology:** Visualización gráfica de recursos

### Primeros Pasos
- Crear proyecto
- Desplegar aplicación
- Ver logs
- Escalar aplicaciones
- Acceder por Route

## Diferenciar: Sandbox vs CRC
- **Sandbox:** Cloud gestionado, acceso remoto, sin admin
- **CRC:** Local, control total, admin access, desarrollo offline

## Relaciones
- Parte de: [[OpenShift]]
- Usa: `oc` CLI
- Alternativa a: [[Build]] manual (Deploy Config)

## Fuentes
- Curso osv4_k8s - Módulo 2
