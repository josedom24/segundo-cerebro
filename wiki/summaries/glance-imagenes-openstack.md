---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_openstack_ies]
tags: [imagenes, openstack]
---

# Glance: Gestión de Imágenes en OpenStack

## Resumen de una línea
Componente OpenStack que gestiona catálogo de imágenes (plantillas base para instancias): almacenamiento, búsqueda, distribución, soporta múltiples formatos.

## Definición

**Glance** = Servicio de gestión de imágenes en OpenStack. Proporciona API para almacenar, recuperar y distribuir imágenes que sirven como plantillas para crear instancias (VMs).

Una imagen es una plantilla base: SO preinstalado + software opcional, lista para instanciar.

## Conceptos Clave

### Qué es una Imagen

```
Imagen = Plantilla base para instancias

Contiene:
- Sistema operativo preinstalado
- Software base (packages)
- Configuración inicial
- Metadatos (formato, tamaño, arquitectura)
```

### Formatos de Imagen

```
Soportados:
- QCOW2: Formato KVM (usado en Proxmox/Libvirt)
- Raw: Imagen sin procesar
- VDI: Formato VirtualBox
- VMDK: Formato VMware
- ISO: Imágenes de CD/DVD
- VHD/VHDX: Formato Hyper-V
```

### Gestión en Horizon

**Acceso:**
- Menú: Computación → Imágenes
- Listar imágenes disponibles
- Ver detalles (tamaño, formato, estado)
- Subir nuevas imágenes

**Operaciones:**
- Crear snapshot de instancia → nueva imagen
- Subir imagen local
- Copiar imagen (clon)
- Eliminar imagen
- Cambiar visibilidad (privada/pública)

### Gestión con OpenStack Client (OSC)

```bash
# Listar imágenes
openstack image list

# Ver detalles de una imagen
openstack image show [nombre/id]

# Subir imagen
openstack image create --file imagen.qcow2 \
  --disk-format qcow2 \
  --container-format bare \
  "nombre-imagen"

# Eliminar imagen
openstack image delete [id]

# Crear snapshot de instancia
openstack image create --volume [volumen-id] "snapshot-nombre"
```

### Propiedades de Imagen

```yaml
Metadatos:
- ID: identificador único
- Nombre: nombre amigable
- Tamaño: en bytes
- Formato disco: qcow2, raw, etc
- Contenedor: bare (sin envuelta)
- Estado: active, deleted
- Visibilidad: private, public, shared
- Creado: timestamp
- Propietario: proyecto
```

### Ciclo de Vida de Imagen

```
1. Crear/Subir → pending
2. Procesar → saving
3. Disponible → active
4. (Usar en instancias)
5. (Snapshot de instancia → nueva imagen)
6. Eliminar → deleted
```

## Casos de Uso

```
🟢 Plantillas corporativas preconfiguradas
🟢 Imágenes base por proyecto
🟢 Snapshots para backup de instancias
🟢 Distribución rápida de entornos
🟢 Laboratorios educativos con SO estándar
```

## Workflow Típico

```
1. Subir imagen base (Debian, Ubuntu, CentOS, etc)
   ↓
2. Crear instancia a partir de imagen
   ↓
3. Configurar instancia (software, servicios)
   ↓
4. Crear snapshot → nueva imagen personalizada
   ↓
5. Usar imagen personalizada para nuevas instancias
```

## Relaciones

### Conecta con
- [[introduccion-openstack|Introducción a OpenStack]] — Primer componente a usar
- [[nova-instancias-openstack|Nova: Instancias]] — Fuente para instancias
- [[cinder-almacenamiento-openstack|Cinder: Almacenamiento]] — Origen de volúmenes

### Parte de
- OpenStack Stack
- Cloud Computing IaaS

## Fuentes

- [Curso OpenStack - Módulo 2: Glance](https://github.com/josedom24/curso_openstack_ies/tree/main/modulo2)
- [Glance Documentation](https://docs.openstack.org/glance/)
- [Image Management in OpenStack](https://docs.openstack.org/glance/latest/user/index.html)
