---
title: Vagrant
created: 2026-04-17
updated: 2026-04-17
sources: [vagrant-oficial, josedomingo-vagrant-blog]
tags: [vagrant, automatizacion, vm]
aliases: [Vagrant, Infrastructure as Code]
---

# Vagrant

## Definición
Herramienta de automatización que define máquinas virtuales en código declarativo (Vagrantfile), permitiendo reproducibilidad de entornos sin interfaz gráfica.

## Características

- **Infraestructura as Code:** VMs definidas en Vagrantfile (Ruby DSL)
- **Portabilidad:** Mismo Vagrantfile funciona en VirtualBox, libvirt, Hyper-V, AWS
- **Provisioning:** Automatización de instalación/configuración (shell, Ansible, Chef, Puppet)
- **Boxes:** Imágenes preconfiguradas para distribución y reutilización
- **Reproducibilidad:** Garantiza mismo entorno para todo el equipo
- **Versionado:** Vagrantfile se commitea en Git para tracking

## Componentes Principales

- **Vagrantfile:** Definición declarativa de la VM (CPU, RAM, networking, provisioners)
- **Boxes:** Imágenes OS preconfiguradas (Ubuntu, CentOS, Debian, etc.)
- **Providers:** Backends de virtualización (VirtualBox, libvirt/KVM, Hyper-V, Docker, AWS)
- **Provisioners:** Scripts/herramientas que configuran la VM (shell, Ansible, Chef)
- **Networking:** NAT, redes privadas (host-only), públicas (bridged)

## Casos de Uso

- **Desarrollo local reproducible:** Mismo Vagrantfile = mismo entorno local ≈ producción
- **Testing de infrastructure code:** Probar Ansible playbooks, Kubernetes, Terraform
- **Training técnico:** Distribuir Vagrantfile a estudiantes (one-click setup)
- **CI/CD pipelines:** Testing en entorno realista, no en contenedor
- **Equipo sincronizado:** Todos los developers con stack idéntico

## Comparativa: Vagrant vs Alternativas

| Aspecto | Vagrant | Docker | virt-manager |
|--------|---------|--------|-------------|
| **Tipo** | VM completa | Container | VM completa |
| **Definición** | Código (IaC) | Código (Dockerfile) | GUI manual |
| **Reproducibilidad** | ✅ Garantizada | ✅ Garantizada | ❌ Manual |
| **SO realista** | ✅ Kernel real | ❌ Kernel compartido | ✅ Kernel real |
| **Overhead** | 500MB-1GB RAM | 50MB RAM | 500MB-1GB RAM |
| **Equipo** | ✅ Ideal | ⚠️ Setup Dockerfiles | ❌ Setup manual |
| **Curva aprendizaje** | Media | Media | Baja (GUI) |

## Relaciones

### Conecta con
- [[kvm|KVM (Kernel-based Virtual Machine)]] — Backend de virtualización (via libvirt provider)
- Máquinas Virtuales — Lo que Vagrant automatiza y gestiona
- [[docker|Docker]] — Alternativa: filosofía IaC similar, distinta implementación (containers vs VMs)
- Ansible — Provisioning complementario para configuración avanzada

### Contrasta con
- [[virt-manager-setup|Instalación y Configuración de virt-manager]] — GUI manual vs Vagrant IaC
- [[docker|Docker]] — VMs completas vs containers ligeros

### Relacionado con
- **Infraestructura as Code (IaC):** Definir infra en código
- **Reproducibilidad:** Garantizar consistencia entre entornos
- **Automatización:** Reemplazar procesos manuales
