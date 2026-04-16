---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_openstack_ies]
tags: [openstack, nova, instancias, compute, vm]
---

# Nova: Gestión de Instancias en OpenStack

## Resumen de una línea
Componente de computación OpenStack que gestiona ciclo de vida de instancias (VMs): creación, arranque, parada, snapshots, redimensión, cloud-init.

## Definición

**Nova** = Servicio de computación OpenStack. Gestiona máquinas virtuales (instancias) y el hypervisor subyacente.

Responsabilidades:
- Crear/eliminar instancias
- Arrancar/parar instancias
- Snapshots (copias punto-en-tiempo)
- Redimensión y reconstrucción
- Acceso remoto (SSH, consola)

## Conceptos Clave

### Instancia vs Imagen

```
Imagen (Glance):
- Plantilla estática
- Almacenada en Glance
- Reutilizable

Instancia (Nova):
- Copia viva de una imagen
- En ejecución en hypervisor
- Con datos propios (volátil)
```

### Ciclo de Vida de Instancia

```
Crear instancia
    ↓
Spawning (creando)
    ↓
Active (ejecutándose)
    ↓ (Parar)
Stopped (parada)
    ↓
Reanudar → Active
    ↓ (Eliminar)
Deleted
```

### Sabores (Flavors)

Configuración de recursos para instancia:

```yaml
Flavor = Plantilla de recursos

Ejemplo:
- m1.small:   1 vCPU, 2 GB RAM, 20 GB disco
- m1.medium:  2 vCPU, 4 GB RAM, 40 GB disco
- m1.large:   4 vCPU, 8 GB RAM, 80 GB disco

Elementos:
- vCPU (virtual CPUs)
- RAM (memoria)
- Disco raíz (ephemeral)
- Volúmenes adjuntos (persistent)
```

### Acceso a Instancia

**SSH:**
```bash
# Usando clave privada
ssh -i mi-clave.pem usuario@ip-publica

# Usuarios estándar por SO:
- Debian/Ubuntu: usuario 'debian' o 'ubuntu'
- CentOS/RHEL: usuario 'centos' o 'root'
```

**Consola VNC:**
- Acceso mediante navegador
- Útil para troubleshooting
- Acceso directo sin SSH

### Claves SSH

**Gestión de claves:**
1. Generar o importar en Horizon
2. Seleccionar al crear instancia
3. OpenStack inyecta clave pública
4. Usuario accede con clave privada

```bash
# Generar clave local
ssh-keygen -t rsa -b 4096 -f mi-clave

# Importar en OpenStack
# (Horizon: Computación → Pares de claves → Importar clave pública)
```

### Operaciones en Instancia

**Parar vs Suspender vs Eliminar:**
```
Parar:
- Apaga VM
- Conserva disco y datos
- Puede reanudarse
- Típico para ahorro

Suspender:
- Pausa estado en memoria
- Más rápido reanudación
- Menos usado que parar

Eliminar:
- Destruye instancia
- Datos se pierden (a menos que tenga volumen persistent)
- Irreversible
```

**Redimensión:**
```bash
# Cambiar flavor (recursos)
# Puede requerir parar instancia
# Algunas veces no es posible (hypervisor limitaciones)
```

**Snapshots:**
```
Snapshot = Captura del estado actual

Crear snapshot:
1. Parar instancia (opcional pero recomendado)
2. Crear snapshot
3. Se convierte en nueva imagen en Glance
4. Puede usarse para instancias nuevas

Uso:
- Backup punto-en-tiempo
- Clones rápidos
- Recuperación de cambios
```

### Cloud-Init

Automatización de instancia al arrancar:

```bash
# Script para ejecutar al iniciar
#!/bin/bash
apt-get update
apt-get install -y nginx
systemctl start nginx
```

**Beneficios:**
- Instancia lista para usar sin login manual
- SSH, hostname, usuarios configurados
- Servicios iniciados automáticamente
- Ideal para automatización

### Gestión con OpenStack Client (OSC)

```bash
# Listar instancias
openstack server list

# Crear instancia
openstack server create --flavor m1.small \
  --image debian-11 \
  --key-name mi-clave \
  "nombre-instancia"

# Mostrar consola
openstack console url show [instancia]

# Parar/Reanudar
openstack server stop [instancia]
openstack server start [instancia]

# Crear snapshot
openstack server image create [instancia] [nombre-snapshot]

# Redimensionar
openstack server resize --flavor m1.medium [instancia]

# Eliminar
openstack server delete [instancia]
```

## Casos de Uso

```
🟢 Servidores web escalables
🟢 Entornos desarrollo/testing efímeros
🟢 Bases de datos en la nube
🟢 Aplicaciones multi-tier
🟢 Laboratorios educativos on-demand
```

## Workflow Típico

```
1. Elegir imagen base (Glance)
2. Elegir flavor (recursos)
3. Crear instancia
4. Esperar a ACTIVE
5. Obtener IP pública (Floating IP desde Neutron)
6. Acceder por SSH
7. Configurar como necesites
8. Snapshot para guardar estado
9. Parar/eliminar cuando no uses
```

## Relaciones

### Conecta con
- [[introduccion-openstack|Introducción a OpenStack]] — Componente central
- [[glance-imagenes-openstack|Glance: Imágenes]] — Plantillas para instancias
- [[cinder-almacenamiento-openstack|Cinder: Almacenamiento]] — Volúmenes persistentes
- [[neutron-redes-openstack|Neutron: Redes]] — Conectividad de instancias
- [[kvm|KVM]] — Hypervisor subyacente típico

### Parte de
- OpenStack Stack
- Cloud Computing IaaS

## Fuentes

- [Curso OpenStack - Módulo 3: Nova](https://github.com/josedom24/curso_openstack_ies/tree/main/modulo3)
- [Nova Documentation](https://docs.openstack.org/nova/)
- [Instance Management](https://docs.openstack.org/nova/latest/user/)
