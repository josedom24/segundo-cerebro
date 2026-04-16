---
created: 2026-04-16
updated: 2026-04-16
sources: [curso_openstack_ies]
tags: [openstack]
---

# Introducción a OpenStack

## Resumen de una línea
Plataforma open-source de cloud computing IaaS con componentes modulares (Horizon UI + OpenStack Client CLI) para gestionar infraestructura virtual.

## Definición

**OpenStack** = Plataforma de cloud computing open-source que proporciona infraestructura como servicio (IaaS). Permite gestionar máquinas virtuales, almacenamiento, redes y otros recursos.

Dos interfaces principales:
- **Horizon:** Interfaz web gráfica
- **OpenStack Client (OSC):** Herramienta CLI para automatización y scripting

## Conceptos Clave

### Cloud Computing IaaS

```
Ventajas:
- Elasticidad: escala según demanda
- Pay-as-you-go: paga solo lo que usas
- Automatización: infraestructura como código
- Abstracción: usuario no gestiona hardware físico
```

### Componentes Principales

```
OpenStack Stack:
- Keystone: Autenticación y autorización
- Glance: Gestión de imágenes
- Nova: Gestión de instancias (VMs)
- Cinder: Almacenamiento en bloques (volúmenes)
- Neutron: Redes virtuales
- Horizon: Dashboard web
```

### Acceso: Horizon

**Interfaz Web:**
- URL: `https://openstack.gonzalonazareno.org`
- Usuarios y dominios
- Gestión visual de recursos
- Configuración gráfica

**Elementos clave en Horizon:**
- Dashboard (resumen de recursos)
- Proyectos y usuarios
- Redes y seguridad
- Instancias y volúmenes
- Imágenes

### Acceso: OpenStack Client (OSC)

**Herramienta CLI:**
```bash
openstack [recurso] [acción] [opciones]
```

**Ventajas:**
- Automatización mediante scripts
- Reproducibilidad
- Integración en pipelines CI/CD
- Control total vía línea de comandos

**Sintaxis:**
```bash
# Ver ayuda
openstack help
openstack [comando] --help

# Ejemplos
openstack server list          # Listar instancias
openstack image list           # Listar imágenes
openstack volume list          # Listar volúmenes
openstack network list         # Listar redes
```

### Configuración Previa

**1. Claves SSH**

OpenStack inyecta claves públicas en instancias:
- Crear nuevo par: "Crear Par de Claves"
- Importar existente: "Importar clave pública"
- Descargable una sola vez

```bash
# Una vez descargada, dar permisos
chmod 600 mi-clave.pem

# Acceso a instancia
ssh -i mi-clave.pem usuario@instancia
```

**2. Grupos de Seguridad**

Cortafuegos virtuales (reglas de entrada/salida):
- Grupo default: incluido por defecto
- Crear nuevos: agrupar reglas por servicio
- Reglas: puertos, protocolos, orígenes

```
Ejemplo:
- SSH (puerto 22) desde cualquier origen
- HTTP (puerto 80) desde cualquier origen
- ICMP (ping) para diagnóstico
```

**3. Redes**

Conexión de instancias a redes virtuales:
- Red privada: comunicación interna
- Router: conecta a red externa
- Flotantes (Floating IPs): acceso desde exterior

## Casos de Uso

```
🟢 Hosting de aplicaciones web
🟢 Entornos de desarrollo/testing
🟢 Computación en la nube privada
🟢 Laboratorios educativos
🟢 Infraestructura elástica bajo demanda
```

## Relaciones

### Conecta con
- [[glance-imagenes-openstack|Glance: Imágenes]] — Plantillas para instancias
- [[nova-instancias-openstack|Nova: Instancias]] — Máquinas virtuales
- [[cinder-almacenamiento-openstack|Cinder: Almacenamiento]] — Volúmenes persistentes
- [[neutron-redes-openstack|Neutron: Redes]] — Conectividad virtual
- [[contenedores]] — Alternativa: contenedores vs VMs

### Parte de
- Cloud Computing IaaS
- OpenStack Stack

## Flujo Típico

```
1. Acceder a Horizon o usar OSC
2. Crear/importar clave SSH
3. Configurar grupos de seguridad (firewall)
4. Seleccionar imagen (Glance)
5. Crear instancia (Nova)
6. Adjuntar volumen si necesitas almacenamiento (Cinder)
7. Conectar a red (Neutron)
8. Acceder vía SSH con clave privada
```

## Fuentes

- [Curso OpenStack 2022 (GitHub)](https://github.com/josedom24/curso_openstack_ies)
- [OpenStack Documentation](https://docs.openstack.org/)
- [OpenStack Client Reference](https://docs.openstack.org/python-openstackclient/latest/)
