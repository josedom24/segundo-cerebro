---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kvm_ow]
tags: [kvm, linux]
---

# Creación de Máquinas Virtuales en virt-manager

## Resumen de una línea
Creación paso a paso de VMs Linux y Windows en virt-manager: wizard de instalación desde ISO, configuración de vCPU/RAM/disco, selección de red, drivers VirtIO para Windows, acceso a detalles y modificación de hardware.

## Información
- **Fuente:** Curso KVM 2024 - Unidad 3
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm1/
- **Líneas de contenido:** 350+

---

## Pasos Generales de Creación

```
1. Archivo → Nueva máquina virtual
2. Elegir fuente: ISO local
3. Seleccionar ISO y detectar SO
4. Configurar vCPU y RAM
5. Seleccionar almacenamiento (tamaño disco)
6. Resumen y red (default NAT)
7. (Opcional) Personalizar antes de instalar
8. Iniciar instalación
```

---

## Creación de VMs Linux (Debian)

### Paso 1: Fuente de Instalación

```
✅ Instalación local desde una imagen ISO
   → Se monta como CDROM virtual
```

### Paso 2: Seleccionar ISO

**Ubicación:** Grupo almacenamiento `isos`

**Detección automática:** SO detectado automáticamente (Debian, Ubuntu, etc.)

**Si no se detecta:** Seleccionar versión más parecida manualmente

### Paso 3: Asignar Recursos

```
RAM: 1-2 GB (Linux con GUI)
vCPU: 2-4 núcleos
```

Modificable después sin reiniciar (aplicado en siguiente boot)

### Paso 4: Almacenamiento

```
Grupo: default (/var/lib/libvirt/images)
Tamaño: p.ej. 20 GB
Formato: qcow2 (recomendado, thin provisioning)
```

### Paso 5: Red

```
Red: default (NAT)
Activar si no está activa: ✅
Acceso SPICE: ✅ (por defecto)
```

### Paso 6: Finalizar

```
Nombre: debian-server
[Finalizar] → Inicia máquina
```

Se abre consola SPICE para instalación

---

## Creación de VMs Windows

### Diferencias Principales

**Problema:** Windows NO soporta VirtIO nativamente
- Drivers SATA/e1000e por defecto (menos rendimiento)
- Solución: Drivers VirtIO desde Fedora Project

### Paso 1: Descargar Drivers VirtIO

```bash
# ISO de drivers VirtIO para Windows
wget https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/stable-virtio/virtio-win.iso

# Copiar a grupo almacenamiento 'isos'
cp virtio-win.iso ~/Descargas/isos/
```

### Paso 2: Crear VM Base

**Igual que Linux, pero:**
- Seleccionar Windows ISO
- Asignar más RAM (2+ GB)

### Paso 3: Personalizar Antes de Instalar

**Marcar:** "Personalizar la configuración antes de instalar"

### Paso 4: Cambiar a Drivers VirtIO

**Disco (Storage → Disk 1):**
```
De: SATA → Aplicar
A: VirtIO → Aplicar
```

**Tarjeta de Red (Network):**
```
De: e1000e → Aplicar
A: VirtIO → Aplicar
```

**Nota:** Sin VirtIO en tarjeta de red, sin acceso a internet durante instalación. Se puede cambiar después.

### Paso 5: Agregar CDROM con Drivers

```
Botón: Agregar Hardware
Tipo: Storage (CDROM)
Fuente: virtio-win.iso
Aplicar
```

**Orden de arranque:** Windows ISO primero, drivers segundo

### Paso 6: Iniciar Instalación

Cuando pida disco en instalación:
```
[Cargar controladores]
[Examinar]
CDROM → amd64 → win10 (o versión)
→ Detecta disco VirtIO ✅
```

Continúa instalación normalmente

---

## Detalles de la Máquina Virtual

### Acceso a Detalles

```
- Doble clic en VM
- Click derecho → Editar
- Click derecho → Detalles
- Menú → Editar → Detalles de la máquina virtual
```

### Vistas Disponibles

**Botones en ventana de detalles:**

 Botón  Vista  Función 
-----------------------
 1  Consola  Control interactivo SPICE 
 2  Detalles  Configuración hardware, XML 
 3  Instantáneas  Snapshots 
 4  Pantalla completa  Modo fullscreen 

### Vista Consola

```
SPICE: Consola gráfica (defecto)
Serie: Puerto serie ttyS0
Modo: Pantalla completa, escala, VNC, RDP
```

**Menú Vista:**
- Escalar al tamaño de ventana
- Pantalla completa (F11)
- Reducir a MV (fit to window)
- Captura de pantalla: Guardar PNG

### Vista Detalles

**Información general:**
- UUID, ID máquina
- SO detectado
- Acceso a XML de configuración

**vCPU:**
```
Cores: Modificable
Sockets: Distribución CPU
Threads: Hyperthreading
→ Cambios tras reboot
```

**Memoria:**
```
Actual: RAM asignada ahora
Máxima: Límite superior
→ Cambios tras reboot
```

**Opciones de arranque:**
```
Orden de dispositivos:
1. CDROM (si instalando)
2. Disco
3. Red (PXE)
```

### Dispositivos Hardware

**Discos:**
```
Driver: VirtIO (recomendado ✅)
Caché: writethrough/writeback
Tamaño: Visible, no redimensionable aquí
```

**Interfaces de Red:**
```
Modelo: VirtIO
Red: default (NAT)
IP: Visible cuando se ejecuta
```

**Otros dispositivos:**
```
- Keyboard, Mouse
- Display (QXL, Spice)
- Controladores USB
- Adaptadores SCSI
```

### Operaciones Hardware

**Eliminar hardware:**
```
Click en dispositivo → Click derecho → Eliminar hardware
```

**Agregar hardware (en caliente posible):**
```
Botón: Agregar Hardware
Opciones: Disco, Red, USB, PCI, Gráficos, ...
```

---

## Mejores Prácticas

```
✅ Usar drivers VirtIO cuando sea posible
✅ Usar qcow2 para aprovisionamiento flexible
✅ Asignar suficientes vCPU para rendimiento
✅ Red NAT por defecto es segura
✅ Usar almacenamiento en grupo default
✅ Acceso gráfico: SPICE > VNC > RDP
❌ No usar --privileged (equivalente a este contexto)
```

---

## Relaciones

### Conecta con
- [[virt-manager-setup|Unidad 2: Setup virt-manager]]
- [[almacenamiento-kvm|Unidad 4: Almacenamiento]]
- [[clonacion-kvm|Unidad 5: Clonación]]
- [[redes-kvm|Unidad 6: Redes]]
- [[consola-serie-kvm|Unidad 7: Consola Serie]]

---

## Fuentes

- [Curso KVM 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm1/)
- [Curso KVM 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
- [VirtIO Drivers Windows (Fedora)](https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/stable-virtio/)
