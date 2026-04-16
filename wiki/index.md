---
created: 2026-04-15
updated: 2026-04-15
---

# Índice del Vault

**Última actualización:** 2026-04-16  
**Total de páginas:** 110  
**Cursos ingeridos:** 9 (Docker, Kubernetes, Podman, KVM Intro, KVM Avanzado, Proxmox, OpenStack, OpenShift v4 K8s, OpenShift v4 PaaS)  
**Estrategia:** Conceptos abstractos reutilizables + Summaries específicos de módulos

---

## 🔗 Enlaces Rápidos

- [Blog/Microblog](https://www.josedomingo.org) — Blog personal
- [Plataforma](https://plataforma.josedomingo.org) — Plataforma de enseñanza
- [Módulos](https://fp.josedomingo.org) — Cursos y módulos

---

## 🏷️ Etiquetas (30)

### Plataformas Mayores (8)
`openshift` `kubernetes` `kvm` `podman` `proxmox` `docker` `openstack` `linux`

### Conceptos Generales (10)
`contenedores` `almacenamiento` `redes` `deployment` `virtualizacion` `seguridad` `orquestacion` `automatizacion` `configuracion` `imagenes`

### Específicas Técnicas (12)
`oci` `imagestream` `instalacion` `pods` `rootless` `bridge` `dns` `services` `templates` `secrets` `vm` `volumes`

---

## 📚 Conceptos (21)

### Plataformas Principales (8)
- [[docker]] — Plataforma de containerización con imágenes, registros, Compose
- [[kubernetes]] — Orquestador cloud-native: master/worker, auto-scaling, rolling updates
- [[openshift]] — Distribución empresarial de Kubernetes con PaaS, ImageStream, BuildConfig, Routes
- [[podman]] — Runtime daemonless, rootless nativo, Pods, Quadlet
- [[kvm]] — Hipervisor integrado en Linux para virtualización
- [[proxmox]] — Plataforma virtualización: KVM + LXC, gestión centralizada
- [[openstack]] — Plataforma cloud IaaS: compute, storage, networking, imágenes
- [[helm]] — Package manager de Kubernetes: charts, templating, distribución

### OpenShift-specific Patterns (6)
- [[paas]] — Modelo Platform as a Service: abstracción de infraestructura, automatización CI/CD
- [[imagestream]] — Abstracción OpenShift: referencias a imágenes, triggers, gestión automática
- [[build]] — CI/CD nativo en OpenShift: S2I, Docker build, webhook triggers
- [[route]] — Exposición de servicios: TLS, hostname/path routing, alternativa a Ingress
- [[template]] — Plantillas parametrizadas: aplicaciones complejas, variables, objetos preconfigurados
- [[deploymentconfig]] — Despliegues con triggers, rolling updates, lifecycle hooks pre/post

### Kubernetes Patterns (5)
- [[deployment]] — Orquestación declarativa: rolling updates, rollbacks, replicación
- [[service]] — Exposición de Pods: load balancing, DNS, múltiples tipos
- [[pod]] — Unidad mínima: 1+ contenedores, network compartida, efímeros
- [[statefulset]] — Aplicaciones stateful: identidad persistente, almacenamiento dedicado
- [[job]] — Tareas batch: completación garantizada, reintentos, ejecución paralela

### Storage Patterns (2)
- [[volume]] — Almacenamiento persistente e independiente (K8s, OpenStack, Proxmox, KVM)
- [[snapshot]] — Captura punto-en-tiempo: backup, clones, rollback

### Abstracciones Base (1)
- [[contenedores]] — Virtualización a nivel SO con kernel compartido

---

## 🏗️ Infraestructura y Plataformas

### KVM & libvirt

#### Curso Introductorio
- [[introduccion-kvm|Introducción a KVM/libvirt]] — Virtualización completa, QEMU/KVM stack, virt-manager
- [[virt-manager-setup|Setup de virt-manager]] — Instalación, configuración inicial, redes default, almacenamiento
- [[creacion-vms|Creación de VMs]] — Wizard instalación, Linux/Windows, hardware, detalles VM
- [[almacenamiento-kvm|Almacenamiento en KVM]] — Storage pools, volúmenes, QCOW2, snapshots, thin provisioning
- [[clonacion-kvm|Clonación de VMs]] — Full clone vs linked clone, problemas identidad, gestión
- [[redes-kvm|Redes en KVM]] — NAT privadas, aisladas, bridge públicas, macvtap, configuración
- [[consola-serie-kvm|Consola Serie en KVM]] — Acceso serie, getty, administración remota, bajo overhead

#### Curso Avanzado
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

### Docker
- [[introduccion-docker|Introducción a Docker]] — Conceptos, diferencias con VMs, instalación
- [[docker-run-y-ciclo-vida|Docker Run y Ciclo de Vida]] — docker run, ciclo de vida, mapeamiento de puertos
- [[imagenes-y-docker-hub|Imágenes y Docker Hub]] — Capas, Docker Hub, comandos de gestión
- [[volumenes-bind-mounts|Volúmenes y Bind Mounts]] — Volúmenes, bind mounts, tmpfs, persistencia
- [[redes-docker|Redes en Docker]] — Bridge, DNS, mapeamiento de puertos, SNAT/DNAT
- [[docker-compose|Docker Compose]] — Orquestación declarativa, servicios, volúmenes, variables
- [[dockerfile-y-construccion|Dockerfile y Construcción]] — Dockerfile, docker build, caching, multi-stage, best practices
- [[docker-desktop|Docker Desktop]] — GUI para contenedores, imágenes, volúmenes, builds, extensiones

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

### OpenShift v4

#### Curso 1: Kubernetes y OpenShift
- [[introduccion-openshift|Introducción a OpenShift]] — Distribución K8s enterprise, Developer Sandbox, características
- [[developer-sandbox|Developer Sandbox]] — Entorno cloud gratuito, proyectos, acceso web
- [[code-ready-containers|Instalación Local (CRC)]] — Code Ready Containers, instalación, requisitos, primeros pasos
- [[pods-replicasets-deployments|Pods, ReplicaSets y Deployments]] — Recursos Kubernetes 1 en OpenShift
- [[services-routes|Services y Routes]] — Acceso a aplicaciones, exposición, routing
- [[configmaps-secrets|ConfigMaps y Secrets]] — Parametrización, credenciales, configuración
- [[almacenamiento-openshift|Almacenamiento en OpenShift]] — Volumes, PersistentVolumes, PersistentVolumeClaims
- [[recursos-avanzados|Recursos Avanzados]] — StatefulSet, DaemonSet, Jobs, CronJobs, HPA
- [[aplicacion-ejemplo-citas|Aplicación Ejemplo: Citas]] — Despliegue multi-componente, microservices

#### Curso 2: OpenShift como Plataforma PaaS
- [[openshift-paas|OpenShift como PaaS]] — Características PaaS, abstracciones, flujos de trabajo
- [[metodos-despliegue|Métodos de Despliegue]] — Image, Source-to-Image (S2I), Dockerfile, Templates
- [[imagestream-gestion|ImageStream y Gestión]] — Abstracción de imágenes, triggers automáticos, importación
- [[buildconfig-cicd|BuildConfig y CI/CD]] — Construcción automatizada, S2I, Docker build, webhooks
- [[imagepull-registros|ImagePull y Registros Privados]] — ImagePullSecrets, registros privados, seguridad
- [[deployconfig-rolling-updates|DeployConfig y Rolling Updates]] — Despliegues avanzados, hooks lifecycle, rollbacks
- [[services-routes-avanzado|Services y Routes Avanzado]] — Exposición de aplicaciones, TLS, balanceo de carga
- [[operadores-knative-tekton|Operadores, Knative y Tekton]] — Extensiones, serverless, CI/CD declarativa
- [[monitorizacion-prometheus|Monitorización con Prometheus]] — Prometheus, Grafana, logs, alertas, health checks
- [[seguridad-rbac-policies|Seguridad: RBAC y Network Policies]] — Control de acceso, aislamiento red, Secrets, SecurityContext
