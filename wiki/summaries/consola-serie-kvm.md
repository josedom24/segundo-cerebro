---
title: "Acceso por Consola Serie en KVM"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kvm_ow]
tags: [kvm]
---

# Acceso por Consola Serie en KVM

## Resumen de una línea
Consola serie en KVM: acceso por puerto serial virtual (ttyS0) ideal para servidores sin GUI, recuperación, automatización; configuración getty en SO guest; menor consumo CPU que SPICE/VNC.

## Información
- **Fuente:** Curso KVM 2024 - Unidad 7
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/kvm1/
- **Líneas de contenido:** 270+


## Concepto

### Alternativa a Consola Gráfica

**Consola Gráfica (SPICE/VNC):**
```
❌ Requiere entorno gráfico
❌ Alto consumo CPU/RAM
❌ Necesita renderer gráfico
```

**Consola Serie:**
```
✅ Texto puro (TTY)
✅ Bajo consumo recursos
✅ Ideal administración remota
✅ Recuperación de fallos
```


## Casos de Uso

### 1. Servidores Sin GUI

```
Servidor Linux puro (headless)
  → No hay monitor
  → No hay entorno gráfico
  → SPICE/VNC inútil
  → Consola serie ✅
```

### 2. Recuperación de Sistemas

```
Problema:
  ❌ VM no arranca correctamente
  ❌ Drivers gráficos rotos
  ❌ Kernel panic

Solución:
  ✅ Acceder por serie
  ✅ Reparar en modo texto
  ✅ Sin dependencias gráficas
```

### 3. Administración Remota

```
Escenario: SSH/telnet a consola serie
  → Herramientas de gestión remota
  → Automatización con scripts
  → Acceso desde datacenter
```

### 4. Laboratorios

```
N VMs simultáneas
  → Múltiples terminales serie
  → Monitoreo sencillo
  → Bajo overhead
```


## Configuración Hardware en virt-manager

### Dispositivo Serial Virtual

**Requisito:** Agregar puerto serie a VM

```
Pasos:

1. Detalles VM → Agregar Hardware
2. Tipo: Console (Consola)
3. Tipo de origen: Virtual Serial Port
4. Tipo del dispositivo: Virtio Serial Port (recomendado)
5. Protocolo: Protocolos soportados (drvirt.socket)
6. Aplicar
```

**Resultado en VM:**
```
/dev/ttyS0 (puerto serie virtual)
```

### En virt-manager

```
Pantalla de Hardware:
  └─ Consola (virtio-serial)
     └─ ttyS0
```

**Acceso visual:**
```
Detalles VM → botón Consolas (dropdown)
  ├─ Consola gráfica Spice
  └─ Serie 1 (ttyS0)
```


## Configuración del Sistema Operativo

### Linux (Debian/Ubuntu)

#### Getty: Login por Serie

**Definición:**
```
getty = "get TTY"
  → Servicio de login en terminal serie
  → Escucha en /dev/ttyS0
  → Muestra login prompt
```

#### Activar Getty en ttyS0

```bash
# Activar servicio inmediatamente
sudo systemctl enable --now getty@ttyS0.service

# Verificar estado
sudo systemctl status getty@ttyS0.service

# Ver servicio activo
ps aux  grep getty
```

**Resultado:**
```
Servicio getty escuchando en ttyS0
↓
Prompt de login en serie
↓
Login interactivo por serie
```

#### Desactivar Getty (si no lo quieres)

```bash
sudo systemctl disable --now getty@ttyS0.service
```

### Windows

**Opciones:**
1. SAC (Special Administration Console) - Nativa
2. WinRM - Remota
3. Drivers serie - Compatibilidad (no cubierto aquí)

(Este módulo enfoca Linux)


## Uso desde virt-manager

### Acceder a Consola Serie

```
1. Abrir VM (doble clic)
2. Vista → Consolas
3. Seleccionar "Serie 1" (o ttyS0)
```

### Sesión en Consola Serie

```
# Se abre terminal de texto
# Aparece login prompt

debian login: root
Password: ****

root@debian:~# _
```

### Interactividad

```
✅ Escribir comandos normalmente
✅ Comandos de navegación (ls, cat, etc.)
✅ Sudo funciona
✅ VI/Nano funciona
```

### Salir de Consola Serie

```
Teclas: CTRL + ALT GR + ]

(ALT GR = AltRight en algunos teclados)
```


## Ventajas vs Desventajas

### Consola Serie

```
✅ Bajo consumo CPU/RAM (~5-10% vs SPICE)
✅ Texto puro (copiar/pegar fácil)
✅ Acceso remoto eficiente
✅ Automatización via scripts
✅ Recuperación de fallos

❌ Sin entorno gráfico
❌ Requiere SO con getty
❌ No apto para aplicaciones GUI
```

### SPICE/VNC

```
✅ GUI completo
✅ Aplicaciones gráficas
✅ Experiencia completa escritorio

❌ Alto consumo recursos
❌ Overhead de renderizado
❌ Latencia en conexiones remotas
```


## Comparativa: Acceso a VM

 Método  Tipo  Overhead  GUI  Remoto  Automatización 
-----------------------------------------------------
 Serie  TTY  Bajo  NO  SÍ  Excelente 
 SPICE  Gráfico  Alto  SÍ  Sí  Pobre 
 VNC  Gráfico  Alto  SÍ  Sí  Pobre 
 SSH  TTY  Bajo  NO  SÍ  Excelente 


## Casos Prácticos

### Caso 1: Servidor Linux Minimal

```
1. Crear VM Debian sin GUI
2. Instalar getty@ttyS0
3. Conectar serie desde virt-manager
4. Administración completa por serie
5. Bajo consumo = muchas VMs simultáneas
```

### Caso 2: Recuperación de VM

```
Escenario:
  ❌ VM no arranca (kernel panic)
  ❌ SPICE offline

Solución:
  ✅ Acceder por serie
  ✅ Ver logs (/var/log/)
  ✅ Reparar a mano
  ✅ Reiniciar
```

### Caso 3: Automatización

```
Script (telnet a consola serie):
  #!/bin/bash
  (echo "comando1"; sleep 1; echo "comando2")  nc localhost 3000
  
Resultados:
  ✅ Ejecutar comandos remotamente
  ✅ Recolectar resultados
  ✅ Logging automático
```


## Mejores Prácticas

```
✅ Servidores: Usar serie + SSH
✅ Workstations: Usar SPICE/VNC
✅ Laboratorios: Serie para monitoreo
✅ Producción: Ambos (redundancia)
✅ Documentar: Qué VMs tienen serie
✅ Probar: Antes de producción
```


## Stack Completo: Acceso a KVM

```
┌─────────────────────────────────┐
│ Cliente Local (host)             │
├─────────────────────────────────┤
│ virt-manager GUI                 │
│  ├─ Tab: Consola (SPICE)        │
│  └─ Tab: Serie 1 (Serial Port)  │
├─────────────────────────────────┤
│ Conexión libvirt                 │
│  ├─ QEMU/KVM (system)           │
│  └─ Socket Unix (local)         │
├─────────────────────────────────┤
│ VM Guest (Linux)                 │
│  ├─ getty@ttyS0 (escucha)       │
│  └─ Kernel (porta serie)        │
└─────────────────────────────────┘
```


## Relaciones

### Conecta con
- [[creacion-vms|Creación de Máquinas Virtuales en virt-manager]]
- [[redes-kvm|Redes en KVM/libvirt]]

### Parte de
- [[kvm|KVM (Kernel-based Virtual Machine)]] — Stack de virtualización



## Fuentes

- [Curso: KVM 2024 (Plataforma)](https://plataforma.josedomingo.org/pledin/cursos/kvm1/)
- [Curso KVM 2024 (GitHub)](https://github.com/josedom24/curso_kvm_ow)
- [Systemd getty](https://man7.org/linux/man-pages/man8/getty.8.html)
- [Serial Console Debugging](https://wiki.ubuntu.com/Kernel/Debugging/SerialConsoleHowto)
