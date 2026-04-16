---
created: 2026-04-15
updated: 2026-04-15
sources: [curso-kvm, creacion-box-vagrant]
tags: [virtualization, linux, hypervisor]
aliases: [KVM]
---

# KVM (Kernel-based Virtual Machine)

## Definición
Tecnología de virtualización integrada en el kernel de Linux que actúa como hipervisor, permitiendo ejecutar máquinas virtuales con rendimiento cercano al nativo.

## Características
- **Kernel-based:** Integrado en Linux, no necesita software externo
- **Hipervisor tipo 1:** Acceso directo al hardware
- **Rendimiento nativo:** Mínima sobrecarga
- **Soporte multiplataforma:** x86, ARM, PowerPC

## Gestión

### libvirt
Capa de abstracción que simplifica la gestión de VMs mediante:
- **API estándar:** Acceso programático
- **CLI (virsh):** Herramientas de línea de comandos
- **GUI (virt-manager):** Interfaz gráfica intuitiva

### Niveles de Uso
- **Principiantes:** virt-manager (gráfico e intuitivo)
- **Avanzados:** virsh (línea de comandos, scripts)
- **Automatización:** libvirt API, XML, Terraform

## Casos de Uso
- Laboratorios educativos
- Servidores de prueba
- Entornos de desarrollo
- Infraestructura empresarial

## Relaciones
- **API:** libvirt (gestión)
- **Herramientas:** virt-manager, virt-install
- **Parte de:** Stack de virtualización en Linux
