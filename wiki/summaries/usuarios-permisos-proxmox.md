---
title: "Gestión de Usuarios y Permisos en Proxmox VE"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_proxmox_cep]
tags: [proxmox, seguridad]
---

# Gestión de Usuarios y Permisos en Proxmox VE

## Resumen de una línea
Autenticación con Linux PAM y Proxmox VE Server, creación de usuarios y grupos, sistema de roles con privilegios específicos, asignación de permisos por objeto, y pools de recursos para agrupar VMs/contenedores.

## Información
- **Fuente:** Curso Proxmox VE - Módulo 8
- **Duración:** 2.5 horas teoría + 1.5 horas actividades prácticas
- **Semana:** Semana 8


## Realms de Autenticación

### Concept: Realm

```
Realm = Fuente de autenticación
├─ Define dónde se validan credenciales
├─ Usuarios pertenecen a un Realm
└─ Multiple realms posibles en mismo Proxmox
```

### 1. Linux PAM Standard Authentication

```
Usuarios: Cuentas del sistema operativo
├─ Ej: root, usuario, admin
├─ Acceso: Consola del servidor + SSH
├─ Almacenamiento: /etc/passwd
└─ Uso: Administradores
```

**Ventajas:**
- Integración con sistema Linux
- Acceso de consola al servidor

**Desventajas:**
- Usuarios require crear cuenta en SO

### 2. Proxmox VE Authentication Server

```
Usuarios: Manejados por Proxmox (virtuales)
├─ No necesitan cuenta SO
├─ Solo para acceso GUI Proxmox
├─ Cambio de contraseña desde GUI
└─ Uso: Operadores, estudiantes
```

**Ventajas:**
- Gestión simplificada
- Sin cuentas del SO

**Desventajas:**
- Solo acceso GUI Proxmox

### 3. Otros Realms (No cubiertos)

```
├─ LDAP (Directorio LDAP)
├─ Active Directory (AD)
└─ OpenID Connect
```

### Selector de Realm en Login

```
GUI Proxmox:
├─ Usuario: jdoe
├─ Contraseña: ****
└─ Realm: [Linux PAM] ↓
          [Proxmox VE Authentication Server]
          [LDAP]
          [AD]
```


## Gestión de Usuarios y Grupos

### Acceso a Permissions

```
Datacenter → Permissions
├─ Permissions: Asignación de roles a usuarios
├─ Users: Crear/modificar usuarios
├─ API Tokens: Acceso automático
├─ Groups: Crear/modificar grupos
├─ Pools: Agrupar recursos
├─ Roles: Conjuntos de privilegios
└─ Authentication: Configurar realms
```

### Creación de Grupo

```
Parámetros:
├─ Nombre: grupo1, developers, estudiantes
├─ Comentario: [opcional] "Grupo de desarrollo"
└─ Operaciones: Editar, Eliminar
```

### Creación de Usuario

```
Parámetros:
├─ Username: jdoe, maria, estudiante1
├─ Realm: Proxmox VE Authentication Server (típico)
├─ Password: [contraseña]
├─ Name: Juan Pérez
├─ Last name: Pérez
├─ Email: jdoe@ejemplo.com
├─ Groups: [seleccionar grupo(s)]
├─ Expiration date: [opcional]
├─ Comment: [opcional]
├─ Enabled: ✓ activado
└─ Operaciones: Editar, Eliminar, Cambiar contraseña
```


## Sistema de Privilegios y Roles

### Privilegios

```
Un privilegio = derecho a realizar acción específica

Categorías:
```

#### Privilegios de Nodo/Sistema

```
Permissions.Modify  → Modificar permisos
Sys.PowerMgmt       → Apagar/reiniciar servidor
Sys.Console         → Acceso a consola
Sys.Syslog          → Ver logs del sistema
Sys.Audit           → Ver estado/configuración
Sys.Modify          → Crear/modificar red
Group.Allocate      → Crear/modificar grupos
Pool.Allocate       → Crear/modificar pools
Pool.Audit          → Ver pools
Realm.Allocate      → Crear/modificar autenticación
Realm.AllocateUser  → Asignar usuarios a realm
User.Modify         → Crear/modificar/eliminar usuarios
```

#### Privilegios de VM/Contenedor

```
VM.Allocate         → Crear/eliminar VMs
VM.Migrate          → Mover entre nodos
VM.PowerMgmt        → Encender/apagar
VM.Console          → Acceso a consola
VM.Monitor          → Ver monitorización
VM.Backup           → Crear/restaurar backups
VM.Audit            → Ver configuración
VM.Clone            → Clonar
VM.Snapshot         → Crear/eliminar snapshots
VM.Config.Disc      → Modificar discos
VM.Config.CPU       → Modificar CPU
VM.Config.Memory    → Modificar memoria
VM.Config.Network   → Modificar red
VM.Config.HWType    → Modificar hardware
VM.Config.Options   → Modificar opciones
```

#### Privilegios de Almacenamiento

```
Datastore.Allocate      → Crear/modificar storage
Datastore.AllocateSpace → Asignar espacio
Datastore.AllocateTemplate → Subir templates/ISOs
Datastore.Audit         → Ver almacenamiento
```

### Roles (Conjuntos de Privilegios)

```
Role = Colección de privilegios predefinidos
└─ Se asignan a usuarios, no privilegios directamente
```

#### Roles Predefinidos

```
Administrator       → Todos los privilegios
NoAccess           → Sin permisos (prohibir acceso)
PVEAdmin           → Mayoría de tareas (excepto SO)
PVEAuditor         → Solo lectura
PVEDatastoreAdmin  → Crear/asignar almacenamiento
PVEDatastoreUser   → Asignar espacio, ver storage
PVEPoolAdmin       → Administrar pools
PVEPoolUser        → Ver/usar pools
PVESysAdmin        → Usuarios, auditoría, logs
PVETemplateUser    → Ver/clonar templates
PVEUserAdmin       → Gestionar usuarios
PVEVMAdmin         → Administrar VMs completamente
PVEVMUser          → Usar VMs (power mgmt, console)
```

### Creación de Roles Personalizados

```
Puedes crear roles con combinación personalizada
de privilegios según necesidades.

Ejemplo "SysAdmin":
├─ Sys.PowerMgmt
├─ Sys.Modify
├─ User.Modify
└─ Pool.Allocate
```


## Pools de Recursos

### Concepto

```
Pool = Agrupación de recursos
├─ VMs/Contenedores
├─ Fuentes de almacenamiento
└─ Para organización y/o permisos
```

### Usos

```
Caso 1: Organización
├─ Pool "Producción" (VMs críticas)
├─ Pool "Testing" (laboratorio)
└─ Pool "Desarrollo" (desarrollo)

Caso 2: Permisos (Educativo)
├─ Pool "Grupo1" (VMs de estudiante1)
├─ Pool "Grupo2" (VMs de estudiante2)
└─ Cada estudiante solo accede a su pool
```

### Creación de Pool

```
Parámetros:
├─ Name: produccion, grupo1, estudiante1
├─ Comment: [opcional] "Máquinas de producción"
└─ Operaciones: Editar, Eliminar (si vacío)
```

### Asignación de Recursos a Pool

**Procedimiento:**
1. Pool → Pool View → Seleccionar pool
2. Members → Add
3. Agregar storage y VMs/contenedores

**Requisito:** Incluir storages que usan las VMs

### Asignación de Pool a Nueva VM

```
Al crear VM:
├─ Parámetro: Pool (dropdown)
└─ Seleccionar pool destino
```

### Clonación con Pool

```
Al clonar:
├─ Opción: Indicar pool nuevo
└─ VM clonada hereda pool especificado
```


## Sistema de Permisos RBAC

### Componentes de Permiso

```
Permiso = (Usuario/Grupo) + (Objeto/Ruta) + (Rol)
```

### Rutas de Objeto

```
Ejemplos (formato similar a filesystem):
├─ /vms                 → Todas VMs/contenedores
├─ /vms/{vmid}          → VM específica (ej: /vms/110)
├─ /storage/{storeid}   → Storage (ej: /storage/local-lvm)
├─ /pool/{poolname}     → Pool (ej: /pool/produccion)
├─ /nodes/{nodename}    → Nodo (ej: /nodes/proxmox1)
└─ /datacenters/pve     → Datacenter
```

### Asignación de Permisos

**Procedimiento:**
1. Datacenter → Permissions → Permissions → Add
2. Elegir tipo: Usuario o Grupo
3. Especificar Usuario/Grupo
4. Especificar Objeto/Ruta
5. Elegir Rol
6. Propagar down: ✓ (hereda a sub-objetos)

### Ejemplo: Auditor para Todas VMs

```
Permiso:
├─ Type: Group
├─ Group: auditores
├─ Path: /vms
├─ Role: PVEAuditor
└─ Propagate: ✓

Resultado: Grupo "auditores" ve todas VMs (lectura)
```

### Ejemplo: Admin para Pool Educativo

```
Permiso:
├─ Type: User
├─ User: jdoe
├─ Path: /pool/grupo1
├─ Role: PVEVMAdmin
└─ Propagate: ✓

Resultado: Usuario jdoe administra VMs de grupo1
```


## Escenarios Educativos

### Profesor + Estudiantes

```
Estructura:
├─ Profesor: Usuario Admin full
├─ Estudiante 1: Pool "grupo1" con role PVEVMUser
├─ Estudiante 2: Pool "grupo2" con role PVEVMUser
└─ Cada estudiante solo ve/usa sus VMs
```

### Laboratorio Multi-grupo

```
├─ Pool "grupo_ciberseguridad"
├─ Pool "grupo_redes"
├─ Pool "grupo_infraestructura"
├─ Cada grupo tiene sus VMs/storage
└─ Limitado por pool, no por red
```


## Limitación: Permisos y Redes

### Problema

```
Linux Bridges (redes) NO son objetos controlables:
├─ No se pueden asignar permisos
├─ Solo root puede crear/modificar
├─ Cualquier usuario ve todos los bridges
└─ No se pueden agrupar en pools
```

### Impacto Educativo

```
Limitación: Imposible garantizar aislamiento de red
├─ Ejemplo: Estudiante A podría conectar VM a 
│           red que debería ser solo de Estudiante B
└─ Requiere confianza o separación física
```

### Workaround

```
1. Bridge privado por estudiante (manual)
2. Firewall restrictivo + reglas por usuario
3. Monitorización y auditoría (logs)
```

### Futuro

```
En desarrollo en próximas versiones:
└─ Redes como recurso controlable con permisos
```


## Relaciones

### Conecta con
- [[creacion-maquinas-virtuales-proxmox|Creación de Máquinas Virtuales en Proxmox]] — Control de quién puede acceder
- [[linux-containers-lxc-proxmox|Trabajando con Linux Containers (LXC) en Proxmox]] — Mismo sistema de permisos
- [[almacenamiento-proxmox|Gestión de Almacenamiento en Proxmox]] — Permisos sobre storage
- [[redes-proxmox|Gestión de Redes en Proxmox VE]] — Limitación actual (sin control)


## Próximo Paso

Completar comprensión de administración de Proxmox para despliegues en producción o laboratorios educativos.


## Fuentes
- [Curso Proxmox VE - Módulo 8 (GitHub)](https://github.com/iesgn/curso_proxmox_cep)
- [Proxmox User Management](https://pve.proxmox.com/pve-docs/pve-admin-guide.html#chapter_user_management)
- [Proxmox Firewall](https://pve.proxmox.com/wiki/Firewall)
