# Curso Docker 2024 - [[|Índice Completo

**Fuente:** ~/github/curso_docker_ow (67 lecciones, 8 módulos)  
**Autor:** José Domingo González López  
**URL:** https://github.com/josedom24/curso_docker_ow

---

## 🌐 URLs

- **Plataforma de Enseñanza:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/
- **Repositorio GitHub:** https://github.com/josedom24/curso_docker_ow
- **Ejemplos de Código:** https://github.com/josedom24/ejemplos_curso_docker_ow

## Resumen General

Curso completo de Docker que cubre desde conceptos fundamentales hasta la creación de imágenes y orquestación con Docker Compose. Incluye 67 lecciones prácticas con ejemplos reales.

---

## Módulo 1: Introducción a Docker

**Objetivo:** Entender qué es Docker y cómo se diferencia de las máquinas virtuales.

### Lecciones:
- [[|Introducción a los contenedores
- [[|Introducción a Docker
- [[|Instalación de Docker Engine en Linux
- [[|Instalación de Docker Desktop en Linux
- [[|Instalación de Docker Desktop en Windows

**Conceptos clave:** Contenedores, imágenes, daemon Docker, ventajas sobre VMs

---

## Módulo 2: Ejecución de Contenedores

**Objetivo:** Ejecutar y gestionar contenedores Docker básicos.

### Lecciones:
- [[|El "Hola Mundo" de Docker
- [[|Ejecución simple de contenedores
- [[|Más opciones en la ejecución (1ª y 2ª parte)
- [[|Gestión de contenedores Docker
- [[|Ejemplo: Servidor web
- [[|Ejemplo: MariaDB
- [[|Etiquetando contenedores con Labels
- [[|Limitando recursos (CPU, memoria)

**Conceptos clave:** docker run, docker exec, docker logs, labels, límites de recursos

---

## Módulo 3: Gestión de Imágenes en Docker

**Objetivo:** Entender cómo funcionan las imágenes y dónde encontrarlas.

### Lecciones:
- [[|Imágenes Docker (conceptos)
- [[|Registro de imágenes: Docker Hub
- [[|Gestión de Imágenes
- [[|Cómo se organizan las imágenes (capas)
- [[|Almacenamiento de imágenes y contenedores
- [[|Ejemplo: Desplegando MediaWiki

**Conceptos clave:** Capas, Docker Hub, pull/push, organización en capas

---

## Módulo 4: Almacenamiento en Docker

**Objetivo:** Persisten datos en contenedores efímeros.

### Lecciones:
- [[|Los contenedores son efímeros
- [[|Almacenamiento en Docker (conceptos)
- [[|Volúmenes Docker
- [[|Bind mount
- [[|Ejemplo: NextCloud con persistencia
- [[|Ejemplo: MariaDB con persistencia
- [[|Otros usos del almacenamiento

**Conceptos clave:** Volúmenes, bind mounts, persistencia, punto de montaje

---

## Módulo 5: Redes en Docker

**Objetivo:** Comunicar contenedores entre sí y con el exterior.

### Lecciones:
- [[|Introducción a las redes en Docker
- [[|Red host
- [[|Red bridge por defecto
- [[|Redes bridge definidas por el usuario
- [[|Uso de redes bridge personalizadas
- [[|Ejemplo 1: Aplicación Guestbook
- [[|Ejemplo 2: Aplicación Temperaturas
- [[|Ejemplo 3: WordPress + MariaDB
- [[|Ejemplo 4: Apache Tomcat + nginx

**Conceptos clave:** Redes host, bridge, user-defined, resolución DNS, puertos

---

## Módulo 6: Docker Compose

**Objetivo:** Orquestar múltiples contenedores con un único archivo YAML.

### Lecciones:
- [[|Creando escenarios multicontenedor
- [[|El fichero compose.yaml
- [[|El comando docker compose
- [[|Almacenamiento con Docker Compose
- [[|Redes con Docker Compose
- [[|Ejemplo 1: Guestbook
- [[|Ejemplo 2: Temperaturas
- [[|Ejemplo 3: WordPress + MariaDB
- [[|Ejemplo 4: Apache Tomcat + nginx
- [[|Uso de parámetros (variables de entorno)
- [[|Ejemplos reales de despliegues

**Conceptos clave:** docker-compose.yml, servicios, redes, volúmenes, variables

---

## Módulo 7: Creación de Imágenes en Docker

**Objetivo:** Construir tus propias imágenes Docker personalizadas.

### Lecciones:
- [[|Introducción a la construcción y distribución
- [[|Creación de imágenes a partir de un contenedor
- [[|El fichero Dockerfile (conceptos)
- [[|Creación de imágenes a partir de Dockerfile
- [[|Distribución de imágenes
- [[|Ejemplo 1: Página estática
- [[|Ejemplo 2: Aplicación PHP
- [[|Ejemplo 3: Aplicación Python
- [[|Ejemplo 4: Imágenes configurables con variables
- [[|Ejemplo 5: Aplicación Java
- [[|Creación de imágenes con Docker Compose
- [[|Ficheros Dockerfile parametrizados
- [[|Ciclo de vida de aplicaciones con Docker
- [[|Eliminar objetos Docker no utilizados (prune)

**Conceptos clave:** Dockerfile, ENTRYPOINT, CMD, capas, build context, best practices

---

## Módulo 8: Docker Desktop

**Objetivo:** Usar la interfaz gráfica de Docker Desktop.

### Lecciones:
- [[|Introducción a la interfaz
- [[|Gestión de imágenes
- [[|Gestión de contenedores
- [[|Gestión de volúmenes
- [[|Gestión de creación de imágenes (build)
- [[|Extensiones en Docker Desktop

**Conceptos clave:** GUI de Docker, extensiones, facilidad de uso

---

## Conceptos Transversales

### Temas que aparecen en múltiples módulos:
- **Imágenes:** Módulos 3, 7 (creación), 6 (en compose)
- **Contenedores:** Módulos 2, 3, 4 (almacenamiento)
- **Redes:** Módulos 5, 6 (en compose)
- **Almacenamiento:** Módulos 4, 6 (en compose)
- **Compose:** Módulo 6 (principal), 7 (construcción)

### Principios pedagógicos:
1. **De lo simple a lo complejo:** Hola Mundo → Escenarios multicontenedor
2. **Teoría + práctica:** Cada concepto incluye ejemplos
3. **Casos reales:** WordPress, MediaWiki, aplicaciones propias
4. **Herramientas:** CLI, Docker Desktop (interfaz)

---

## Estadísticas del Curso

- **Total de módulos:** 8
- **Total de lecciones:** 67
- **Ejemplos prácticos:** ~20
- **Tamaño del contenido:** 5.8 MB

---

## Cómo está organizado el repositorio

```
curso_docker_ow/
├── contenido/
│   ├── modulo1/          (5 lecciones)
│   ├── modulo2/          (9 lecciones)
│   ├── modulo3/          (6 lecciones)
│   ├── modulo4/          (7 lecciones)
│   ├── modulo5/          (9 lecciones)
│   ├── modulo6/          (11 lecciones)
│   ├── modulo7/          (14 lecciones)
│   └── modulo8/          (6 lecciones)
└── README.md
```

---

**Nota:** Este índice es el punto de entrada. Cada módulo será procesado por separado para extraer conceptos, crear relaciones cruzadas y construir el conocimiento en el vault.
