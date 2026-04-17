---
title: "Docker Desktop"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_docker_ow]
tags: [docker, imagenes, volumes]
---

# Docker Desktop

## Resumen de una línea
Interfaz gráfica de Docker Desktop para gestionar contenedores, imágenes, volúmenes, construcciones y extensiones sin necesidad de CLI.

## Información
- **Fuente:** Curso Docker 2024 - Módulo 8
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/
- **URL GitHub:** https://github.com/josedom24/curso_docker_ow
- **Líneas de contenido:** 294


## Dashboard Principal

Docker Desktop proporciona un **Docker Dashboard** gráfico que reemplaza comandos CLI con una interfaz visual intuitiva.

### Funciones Principales

**1. Contenedores (Containers Tab)**
- Gestión completa del ciclo de vida (inicio, parada, reinicio)
- Ver recursos (CPU, memoria RAM)
- Monitoreo de estado
- Tareas comunes: inspeccionar, terminal, logs

**2. Imágenes (Images Tab)**
- Ver imágenes locales y en Docker Hub
- Gestión de versiones (tags)
- Información de vulnerabilidades
- Ejecutar contenedores desde imagen

**3. Volúmenes (Volumes Tab)**
- Listar volúmenes Docker creados
- Crear nuevos volúmenes
- Ver contenedor asociado
- Información de almacenamiento

**4. Construcciones (Builds Tab)**
- Historial de compilaciones
- Inspeccionar construcciones en curso
- Gráficas de rendimiento

**5. Extensiones (Extensions Tab)**
- Instalar nuevas funcionalidades
- Buscar en repositorio de extensiones

### Otras Funciones
- Settings (configuración)
- Troubleshooting (solución de problemas)
- Learning Center (documentación)
- Dev Environments (entornos de desarrollo)
- Docker Scout (análisis de vulnerabilidades)


## Gestión de Contenedores

### Ejecución de Contenedores

Desde Docker Desktop, crear contenedor con opción **Run**:

```
✓ Nombre del contenedor
✓ Mapeo de puertos (host:contenedor)
✓ Volúmenes (Docker volumes o bind mounts)
✓ Variables de entorno
✓ Modo desatendido (-d equivalente)
```

### Listado de Contenedores

Información visible por contenedor:
- Nombre e ID
- Imagen base
- Estado (Running, Stopped, etc.)
- Recursos (CPU, RAM)
- Mapeo de puertos (clickable → abre en navegador)
- Tiempo desde creación

### Acciones sobre Contenedores

**Básicas:**
- ▶️ Iniciar / ⏸️ Pausar / ⏹️ Parar
- 🗑️ Eliminar

**Menú Avanzado:**
- **View details:** Información del contenedor
- **View packages and CVEs:** Vulnerabilidades de imagen
- **Copy docker run:** Copiar `docker run` al portapapeles
- **Open in terminal:** Acceso interactivo
- **View files:** Explorador de archivos del contenedor
- **Pause/Restart:** Control de ciclo de vida
- **Open with browser:** Acceder a aplicación web

### Inspeccionar Contenedor

Al hacer click en nombre del contenedor:

 Pestaña  Información 
----------------------
 **Logs**  Output del contenedor 
 **Inspect**  Detalles JSON (filtrable) 
 **Bind mounts**  Directorios montados 
 **Exec**  Terminal interactivo 
 **Files**  Explorador con cambios marcados 
 **Stats**  Gráficas de CPU, RAM, disco, red 


## Gestión de Imágenes

### Descargar Imágenes

Búsqueda en Docker Hub directamente desde Docker Desktop:

```
Información visible:
- ID de imagen
- Etiquetas disponibles
- Fecha de creación
- Tamaño
- Documentación

Acciones:
- Pull: Descargar al registro local
- Run: Crear contenedor inmediatamente
```

### Listado de Imágenes

**Pestaña "Local":**
- Imágenes descargadas localmente
- Nombre, ID, etiqueta
- Estado (In use / Available)
- Tiempo de creación
- Tamaño

**Pestaña "Hub":**
- Imágenes personales en Docker Hub (si logueado)
- Ver en Hub
- Pull a local

### Acciones sobre Imágenes

- **Run:** Ejecutar contenedor
- **View packages and CVEs:** Ver vulnerabilidades
- **Pull:** Actualizar si hay cambios
- **Push to Hub:** Subir imagen a Docker Hub
- **Delete:** Eliminar del registro local

### Inspeccionar Imagen

Al hacer click en imagen:

 Sección  Contenido 
--------------------
 **Image hierarchy**  Comandos usados para crear (como `docker history`) 
 **Vulnerabilidades**  CVEs encontrados en paquetes 
 **Paquetes**  Lista de paquetes instalados 


## Gestión de Construcciones (Builds)

### Vista de Construcciones

Interfaz para inspeccionar historial y construcciones en curso.

**En construcción activa:**
- Acceso a logs en tiempo real

**En construcción finalizada:**
- Información detallada en múltiples pestañas

### Inspeccionar Construcción

**Pestaña "Info":**
- **Source details:** Información del Dockerfile, repositorio
- **Build timing:** Gráficas de rendimiento
  - Tiempo real (duración total)
  - Tiempo acumulado (CPU total)
  - Uso de caché
  - Ejecución paralela
- **Dependencies:** Imágenes base, repos Git, recursos HTTPS usados
- **Configuration:** Argumentos de build, etiquetas
- **Build results:** Artefactos generados

**Pestaña "Source":**
- Contenido del Dockerfile
- Señala errores de compilación

**Pestaña "Logs":**
- Salida de cada paso del build

**Pestaña "History":**
- Estadísticas de construcciones completadas
- Gráficas de duración, pasos, caché


## Gestión de Volúmenes

### Listado de Volúmenes

Información visible:
- Nombre del volumen
- Estado (In use / Available)
- Tiempo desde creación
- Tamaño

### Inspeccionar Volumen

Al click en nombre:
- Explorador de archivos (contenido del volumen)
- Contenedor que lo está usando

### Crear Volumen

Opción simple para crear nuevo volumen indicando nombre.


## Extensiones

Las extensiones añaden funcionalidades especializadas a Docker Desktop. Se instalan desde repositorio central con un click.

### Extensión: Disk Usage

```
Propósito: Optimizar almacenamiento
Funcionalidad:
- Ver gráficamente uso de espacio (Docker objects)
- Eliminar objetos no utilizados
- Análisis de ocupación
```

### Extensión: Logs Explorer

```
Propósito: Centralizar logs de contenedores
Funcionalidad:
- Visualización unificada
- Filtrado de logs
- Búsqueda
- Vista consolidada sin CLI
```

### Extensión: Resource Usage

```
Propósito: Monitoreo de recursos
Funcionalidad:
- Gráficas en vivo (CPU, RAM, red, disco)
- Seguimiento de contenedores específicos
- Dashboard consolidado
```

### Extensión: Volumes Backup & Share

```
Propósito: Gestión avanzada de volúmenes
Funcionalidad:
- Exportar volumen (archivo comprimido, imagen)
- Importar datos a nuevo volumen
- Transferir volumen vía SSH a otro host
- Clonar, vaciar o eliminar volumen
```


## Panel de Búsqueda

Búsqueda unificada (Cmd+K o Ctrl+K):

**Buscar:**
- **Contenedores/Compose:** Variables de entorno, acciones rápidas
- **Imágenes:** Públicas (Hub), locales, privadas (si logueado)
  - Pull, documentación, ir a Hub, crear contenedor
- **Extensiones:** Información, instalación
- **Volúmenes:** Ver contenedor asociado
- **Documentación:** Ayuda oficial Docker

**Acciones sin dejar búsqueda:** Filtrar, ejecutar, navegar


## Menú Docker (Barra de Notificaciones)

Acceso rápido desde icono en barra de notificaciones:

```
- Dashboard (Docker Dashboard)
- Iniciar sesión/Registrarse
- Configuración
- Buscar actualizaciones
- Solución de problemas
- Dar feedback
- Cambiar a contenedores Windows (Windows)
- Información de versiones
- Docker Hub
- Documentación
- Extensiones
- Kubernetes
- Reiniciar
- Salir
```


## Flujo Típico en Docker Desktop

```
1. Buscar imagen en Hub (dentro de Docker Desktop)
   ↓
2. Pull para descargar
   ↓
3. Run para crear contenedor (configurar puertos, volúmenes, ENV)
   ↓
4. Ver Logs/Stats/Files para monitoreo
   ↓
5. Exec o "Open in terminal" para debugging
   ↓
6. View packages/CVEs para seguridad
```


## Ventajas de Docker Desktop vs CLI

 Tarea  CLI  Desktop 
---------------------
 Ver logs en vivo  `docker logs -f`  Click + follow 
 Inspeccionar contenedor  `docker inspect` (JSON)  GUI filtrable 
 Ver stats  `docker stats`  Gráficas en vivo 
 Copiar docker run  Recrear comando  Copy al portapapeles 
 Ver archivos  `docker exec ls`  Explorador visual 
 Buscar imagen  Ir a hub.docker.com  Dentro del app 
 Compilar imagen  Ver texto logs  Gráficas de timing 

**Conclusión:** Desktop es ideal para desarrollo y debugging. CLI es mejor para automatización y producción.


## Relaciones

### Conecta con
- [[docker|Docker]] — Plataforma base
- [[docker-run-y-ciclo-vida|Ejecución de Contenedores]] — Funciones en GUI
- [[imagenes-y-docker-hub|Gestión de Imágenes]] — Interfaz visual
- [[volumenes-bind-mounts|Almacenamiento]] — Gestión de volúmenes
- [[dockerfile-y-construccion|Creación de Imágenes]] — Vista de builds


## Conceptos Clave

1. **GUI vs CLI:** Docker Desktop abstractiza CLI en interfaz amigable
2. **One-click actions:** Pull, Run, Delete sin escribir comandos
3. **Monitoreo visual:** Stats, logs, resources en gráficas
4. **Extensibilidad:** Extensiones añaden funcionalidad especializada
5. **Integración Hub:** Buscar y descargar imágenes sin navegador
6. **Debugging mejorado:** Terminal, archivos, stats accesibles visualmente
7. **Portabilidad:** Windows/Mac/Linux con interfaz consistente


## Fuentes

- [Curso: Docker 2024 - Módulo 8](https://plataforma.josedomingo.org/pledin/cursos/docker2024/)
