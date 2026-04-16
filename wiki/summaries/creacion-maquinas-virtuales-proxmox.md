---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_proxmox_cep]
tags: [kvm, linux, proxmox, vm]
---

# Creación de Máquinas Virtuales en Proxmox

## Resumen de una línea
Gestión de ISOs, creación de VMs Linux y Windows con dispositivos paravirtualizados (VirtIO), configuración de hardware, instalación de Qemu-guest-agent, y acceso remoto (SSH/RDP).

## Información
- **Fuente:** Curso Proxmox VE - Módulo 3
- **Duración:** 3 horas teoría + 4 horas actividades prácticas
- **Semana:** Semana 3

---

## Gestión de Imágenes ISO

### Cargar ISO en Almacenamiento
1. Acceder a Almacenamiento → local → Subir contenido
2. Seleccionar archivo ISO local
3. Esperar carga completa
4. Disponible para crear VMs

### Tipos de ISO
- **Linux:** Ubuntu, Debian, Red Hat (booteable)
- **Windows:** Windows Server, Windows 10/11 (requiere drivers VirtIO)
- **Herramientas:** VirtIO drivers ISO, boot tools

---

## Dispositivos Paravirtualizados vs Emulados

### Paravirtualizados (VirtIO) - ✅ RECOMENDADO
- **Ventajas:** Alto rendimiento, bajo overhead
- **Requiere:** Driver del SO (incluido en Linux modernos)
- **Dispositivos VirtIO:**
  - virtio-scsi: Controlador SCSI de alto rendimiento
  - virtio-net: Interfaz de red optimizada
  - virtio-rng: Generador de números aleatorios
  - virtio-balloon: Ajuste dinámico de memoria

**Linux:** Drivers integrados (soportado por defecto)  
**Windows:** Requiere ISO de drivers VirtIO cargada durante instalación

### Emulados - Compatibilidad pero lento
- **Ventajas:** Máxima compatibilidad
- **Desventajas:** Rendimiento reducido
- **Típicamente:** e1000 (red emulada), IDE (almacenamiento emulado)

---

## Creación de VM Linux

### Wizard de Creación

**1. General**
- Nombre VM (ej: ubuntu-server-01)
- ID numérico (asignado automático)
- Nodo (servidor donde corre)

**2. SO**
- Tipo: Linux
- Versión: Linux 5.x (kernel Proxmox)

**3. Sistema**
- BIOS: SeaBIOS (estándar)
- Machine: i440fx
- SCSI: VirtIO SCSI ← **Recomendado**

**4. Discos**
- Almacenamiento: local-lvm (para snapshots)
- Tamaño: Mínimo 20 GB para servidor
- Caché: WriteBack (bueno) o WriteThrough (más seguro)
- SSD: Marcar si almacenamiento es SSD

**5. CPU**
- Sockets: 1 (típico)
- Cores: 2-4 para servidor
- Type: host (máximo rendimiento)

**6. Memoria**
- RAM: 2-4 GB mínimo para server
- Balloon: Habilitado (ajuste dinámico)

**7. Red**
- Bridge: vmbr0 (red pública)
- Modelo: VirtIO Net ← **Recomendado**
- MAC: Generada automáticamente

**8. Confirmar**
- Revisar parámetros
- Crear VM
- Automáticamente abre consola

### Instalación del SO
1. Boot automático desde ISO
2. Instalar SO normalmente
3. Usar los drivers VirtIO (ya disponibles)
4. Completar instalación
5. Reiniciar

---

## Creación de VM Windows

### Particularidades de Windows

**Paso 1-3:** Igual a Linux (General, SO como Windows, Sistema igual)

**Paso 4 (Discos especial):** 
- **IMPORTANTE:** Controller debe ser SCSI con VirtIO
- Si no, Windows no detectará el disco y fallará instalación

**Instalación especial:**
1. Boot desde ISO Windows
2. En pantalla de selección de disco: "Drivers"
3. Cargar drivers desde ISO de VirtIO
4. Seleccionar driver "viostor" para disco SCSI
5. Detecta disco y permite continuar instalación
6. Instalar Windows normalmente
7. Completar y drivers restantes se instalan automáticamente

### Drivers VirtIO Necesarios
- **viostor:** SCSI disk (obligatorio para instalación)
- **netkvm:** Network (para conectividad)
- **qemupcdriver:** QEMU PC (opcional)
- **pvpanic:** Panic device (opcional)

---

## Gestión de Ciclo de Vida de VMs

### Estados
- **Stopped:** Apagada
- **Running:** Ejecutándose
- **Paused:** Pausada (en memoria, no ejecuta)

### Operaciones
- **Start:** Inicia VM
- **Shutdown:** Apagado limpio (SO se cierra)
- **Stop:** Apagado forzado (sin cerrar SO)
- **Reboot:** Reinicio limpio
- **Pause:** Pausa (mantiene en memoria)
- **Resume:** Reanuda desde pausa
- **Clone:** Copia la VM
- **Console:** Acceso a VNC/SPICE

---

## Qemu-Guest-Agent

### Propósito
Comunicación entre Proxmox y SO guest para:
- Shutdown limpio desde Proxmox
- Reporte de IP dinámicas
- Información de estado del SO
- Snapshots consistentes

### Instalación

**Linux (Ubuntu/Debian):**
```bash
apt install qemu-guest-agent
systemctl enable qemu-guest-agent
systemctl start qemu-guest-agent
```

**Windows:**
1. Descargar de: https://pve.proxmox.com/wiki/Qemu-guest-agent
2. Instalar MSI
3. Servicio se inicia automáticamente

### Activación en Proxmox
- VM → Opciones → Qemu Agent: ✅ Habilitado

---

## Acceso Remoto a VMs

### Linux - SSH
```bash
ssh usuario@ip_vm
ssh -p 22 usuario@192.168.1.100
```

### Windows - RDP
- Programas: Remote Desktop Connection (built-in)
- Dirección: IP_VM:3389
- Credenciales: Usuario Windows local

### Consola VNC (siempre disponible)
- Proxmox GUI → VM → Console
- Acceso gráfico sin OS instalado

---

## Configuración Recomendada Resumen

```
LINUX VM TÍPICA:
├─ CPU: 2-4 cores
├─ RAM: 2-4 GB
├─ Disco: 20-50 GB, VirtIO SCSI
├─ Red: VirtIO NET
└─ Qemu-agent: Instalado

WINDOWS VM TÍPICA:
├─ CPU: 2-4 cores
├─ RAM: 4-8 GB
├─ Disco: 30-60 GB, VirtIO SCSI
├─ Red: VirtIO NET
├─ Drivers VirtIO: Instalados
└─ Qemu-agent: Instalado
```

---

## Relaciones

### Conecta con
- [[instalacion-proxmox|Instalación de Proxmox]] — Proxmox preinstalado
- [[almacenamiento-proxmox|Almacenamiento]] — Gestión de discos
- [[clonacion-snapshots-backups-proxmox|Clonación y Snapshots]] — Copias y templates

---

## Próximo Paso

Gestión de almacenamiento, adición de discos, y operaciones de disco (resize, move).

---

## Fuentes
- [Curso Proxmox VE - Módulo 3 (GitHub)](https://github.com/iesgn/curso_proxmox_cep)
- [Proxmox VM Creation](https://pve.proxmox.com/wiki/Manual:_Virtual_Machines)
- [VirtIO Drivers](https://pve.proxmox.com/wiki/Qemu/KVM_Virtual_Machines#_drivers)
