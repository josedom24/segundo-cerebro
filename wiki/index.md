---
created: 2026-04-15
updated: 2026-04-15
---

# Índice del Vault

**Última actualización:** 2026-04-16  
**Total de páginas:** 76  
**Cursos ingeridos:** 7 (Docker, Kubernetes, Podman, KVM Intro, KVM Avanzado, Proxmox, OpenStack)

---

## 📚 Conceptos (10)

### Virtualización
- [[KVM]] — Hipervisor integrado en Linux para virtualización

### Cloud Computing (IaaS)
- [[OpenStack]] — Plataforma cloud IaaS: compute, storage, networking, imágenes

### Contenedores
- [[Contenedores]] — Virtualización a nivel SO con kernel compartido
- [[Docker]] — Plataforma de containerización con imágenes, registros, Compose
- [[Docker Compose]] — Orquestación de múltiples contenedores con YAML
- [[Dockerfile]] — Sintaxis para definir y construir imágenes Docker
- [[Podman]] — Runtime daemonless, rootless nativo, Pods, Quadlet

### Orquestación
- [[Kubernetes]] — Orquestador cloud-native: master/worker, auto-scaling, rolling updates
- [[Helm]] — Package manager de Kubernetes: charts, templating, distribución

---

## 📄 Resúmenes de Fuentes (Cursos)

### Docker
- [[introduccion-docker|Introducción a Docker]] — Conceptos, diferencias con VMs, instalación
- [[docker-run-y-ciclo-vida|Docker Run y Ciclo de Vida]] — docker run, ciclo de vida, mapeamiento de puertos
- [[imagenes-y-docker-hub|Imágenes y Docker Hub]] — Capas, Docker Hub, comandos de gestión
- [[volumenes-bind-mounts|Volúmenes y Bind Mounts]] — Volúmenes, bind mounts, tmpfs, persistencia
- [[redes-docker|Redes en Docker]] — Bridge, DNS, mapeamiento de puertos, SNAT/DNAT
- [[docker-compose|Docker Compose]] — Orquestación declarativa, servicios, volúmenes, variables
- [[dockerfile-y-construccion|Dockerfile y Construcción]] — Dockerfile, docker build, caching, multi-stage, best practices
- [[docker-desktop|Docker Desktop]] — GUI para contenedores, imágenes, volúmenes, builds, extensiones

### Kubernetes
- [[introduccion-kubernetes|Introducción a Kubernetes]] — Orquestación, arquitectura master/worker, por qué k8s
- [[instalacion-kubernetes|Instalación de Kubernetes]] — minikube, kubeadm, kind, kubectl setup
- [[pods-contenedores|Pods: Contenedores en Kubernetes]] — Unidad mínima, efímeros, health checks
- [[replicasets|ReplicaSets]] — Escalabilidad, auto-reparación, tolerancia a fallos
- [[deployments|Deployments]] — Ciclo de vida, rolling updates, rollbacks
- [[services-acceso|Services: Acceso a Aplicaciones]] — ClusterIP, NodePort, LoadBalancer, Ingress, DNS
- [[configmaps-y-secrets|ConfigMaps y Secrets]] — Parametrización, configuración, credenciales
- [[almacenamiento-kubernetes|Almacenamiento en Kubernetes]] — PersistentVolumes, PVCs, provisioning
- [[statefulsets-daemonsets-jobs|StatefulSets, DaemonSets, Jobs]] — Cargas de trabajo especializadas
- [[helm-empaquetado|Helm: Empaquetado de Aplicaciones]] — Charts, package manager, templating

### Podman
- [[introduccion-podman|Introducción a Podman]] — Daemonless, rootless nativo, Pods, Quadlet
- [[ejecucion-contenedores-podman|Ejecución de Contenedores]] — podman run, rootless vs rootful
- [[imagenes-podman|Gestión de Imágenes OCI]] — Pull, push, registros múltiples
- [[almacenamiento-redes-podman|Almacenamiento y Redes]] — Volúmenes, bind mounts, redes bridge
- [[pods-podman|Gestión de Pods]] — Pods nativos, generación YAML Kubernetes
- [[quadlet-systemd|Systemd y Quadlet]] — Gestión de contenedores como servicios systemd
- [[podman-compose|podman-compose]] — Escenarios multicontenedor, compose.yaml
- [[construccion-imagenes-podman|Construcción de Imágenes OCI]] — Dockerfile, podman build, distribución
- [[seguridad-podman|Seguridad en Podman]] — Rootless, SELinux, AppArmor
- [[casos-practicos-podman|Casos Prácticos]] — WordPress, GuestBook, integración Kubernetes

### KVM & libvirt (Curso Introductorio)
- [[introduccion-kvm|Introducción a KVM/libvirt]] — Virtualización completa, QEMU/KVM stack, virt-manager
- [[virt-manager-setup|Setup de virt-manager]] — Instalación, configuración inicial, redes default, almacenamiento
- [[creacion-vms|Creación de VMs]] — Wizard instalación, Linux/Windows, hardware, detalles VM
- [[almacenamiento-kvm|Almacenamiento en KVM]] — Storage pools, volúmenes, QCOW2, snapshots, thin provisioning
- [[clonacion-kvm|Clonación de VMs]] — Full clone vs linked clone, problemas identidad, gestión
- [[redes-kvm|Redes en KVM]] — NAT privadas, aisladas, bridge públicas, macvtap, configuración
- [[consola-serie-kvm|Consola Serie en KVM]] — Acceso serie, getty, administración remota, bajo overhead

### KVM & libvirt (Curso Avanzado)
- [[conceptos-avanzados-kvm|Conceptos Avanzados]] — Aislamiento seguridad, benchmarking, disaster recovery, cloud computing
- [[setup-avanzado-kvm|Setup Avanzado]] — Virtualización anidada, CPU host-passthrough, requisitos hardware
- [[virsh-cli-kvm|virsh CLI]] — Gestión dominios XML, ciclo de vida, volúmenes, virt-viewer
- [[almacenamiento-virsh|Almacenamiento (virsh)]] — Pool types (dir/lvm/zfs/nfs), qemu-img, snapshots
- [[clonacion-virsh|Clonación (virsh)]] — virt-clone, virt-install, virt-customize, templates, batch
- [[redes-virsh|Redes (virsh)]] — Definición XML, DHCP/DNS, bridges (virbr), leases
- [[instalacion-red-kvm|Instalación por Red]] — virt-install --location, preseed/kickstart, automatización

### Proxmox VE
- [[introduccion-proxmox|Introducción a Proxmox]] — Virtualización, tipos de hipervisores (KVM, LXC), plataforma gestión
- [[instalacion-proxmox|Instalación de Proxmox]] — Requisitos, proceso instalación, GUI, estructura cluster, storage/red por defecto
- [[creacion-maquinas-virtuales-proxmox|Creación de Máquinas Virtuales]] — ISO, dispositivos VirtIO, creación Linux/Windows, Qemu-guest-agent, acceso remoto
- [[almacenamiento-proxmox|Almacenamiento en Proxmox]] — Tipos storage, Directory, LVM thin, adición discos, resize/move/detach, snapshots
- [[clonacion-snapshots-backups-proxmox|Clonación, Snapshots y Backups]] — Full/linked clone, plantillas, snapshots y rollback, backups (stop/suspend/snapshot)
- [[linux-containers-lxc-proxmox|Contenedores LXC]] — Gestión LXC vs VMs, descarga plantillas, creación contenedores, ciclo de vida, mount points
- [[redes-proxmox|Redes en Proxmox]] — Linux Bridge, vmbr0 público, redes internas, firewall 3 niveles (datacenter/nodo/VM)
- [[usuarios-permisos-proxmox|Usuarios y Permisos]] — Autenticación (PAM, Proxmox), usuarios/grupos, roles, privilegios, pools de recursos, RBAC

### OpenStack
- [[introduccion-openstack|Introducción a OpenStack]] — Cloud IaaS, Horizon (web), OpenStack Client (CLI), claves SSH, grupos de seguridad
- [[glance-imagenes-openstack|Glance: Gestión de Imágenes]] — Catálogo de imágenes, formatos QCOW2/raw, snapshots, visibilidad
- [[nova-instancias-openstack|Nova: Gestión de Instancias]] — Ciclo de vida VM, sabores (flavors), snapshots, redimensión, cloud-init
- [[cinder-almacenamiento-openstack|Cinder: Almacenamiento]] — Volúmenes persistentes, adjunción a instancias, snapshots, tipos storage
- [[neutron-redes-openstack|Neutron: Redes Virtuales]] — Redes privadas, routers, Floating IPs, grupos de seguridad, SDN

---

**Nota:** Este índice se actualiza automáticamente con cada nueva ingesta. Es tu punto de entrada al vault.
