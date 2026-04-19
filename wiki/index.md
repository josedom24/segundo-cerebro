---
created: 2026-04-15
updated: 2026-04-19
title: Wiki Pledin
---

## 🔗 Enlaces Rápidos

- [Blog/Microblog](https://www.josedomingo.org) — Blog personal
- [Plataforma](https://plataforma.josedomingo.org) — Plataforma de enseñanza
- [Módulos](https://fp.josedomingo.org) — Cursos y módulos

---

## 📊 Análisis y Síntesis

- [[utilidad-pods-podman|Utilidad de Pods en Podman]] — Orquestación local, generación YAML K8s, alternativa a Swarm

---

## 📰 Artículos y Recursos

- [[spf-dkim-dmarc-profundizacion|SPF, DKIM y DMARC - Profundización]] — Estándares de autenticación, implementación progresiva, reportes
- [[vagrant-introduccion|Vagrant - Introducción y Conceptos Fundamentales]] — Automatización de VMs, providers, provisioning, ciclo de vida
- [[vagrant-libvirt-configuracion|Vagrant + libvirt - Configuración Completa de Networking y Almacenamiento]] — Networking, almacenamiento persistente, multi-VM, casos de uso
- [[vagrant-creacion-boxes|Creación de Custom Boxes para Vagrant]] — Empaquetar, versionar, distribuir boxes, Vagrant Cloud

---

## 📚 Conceptos (25)

### Plataformas Principales (10)
- [[docker|Docker]] — Plataforma de containerización con imágenes, registros, Compose
- [[kubernetes|Kubernetes]] — Orquestador cloud-native: master/worker, auto-scaling, rolling updates
- [[openshift|OpenShift]] — Distribución empresarial de Kubernetes con PaaS, ImageStream, BuildConfig, Routes
- [[podman|Podman]] — Runtime daemonless, rootless nativo, Pods, Quadlet
- [[kvm|KVM (Kernel-based Virtual Machine)]] — Hipervisor integrado en Linux para virtualización
- [[proxmox|Proxmox VE: Plataforma de Virtualización]] — Plataforma virtualización: KVM + LXC, gestión centralizada
- [[openstack|OpenStack]] — Plataforma cloud IaaS: compute, storage, networking, imágenes
- [[helm|Helm]] — Package manager de Kubernetes: charts, templating, distribución
- [[apache|Apache]] — Servidor web modular: virtual hosting, módulos, autenticación, proxy inverso
- [[vagrant|Vagrant]] — Automatización de VMs: Infrastructure as Code, reproducibilidad, provisioning declarativo

### OpenShift-specific Patterns (6)
- [[paas|PaaS (Platform as a Service)]] — Modelo Platform as a Service: abstracción de infraestructura, automatización CI/CD
- [[imagestream|ImageStream]] — Abstracción OpenShift: referencias a imágenes, triggers, gestión automática
- [[build|Build (BuildConfig en OpenShift)]] — CI/CD nativo en OpenShift: S2I, Docker build, webhook triggers
- [[route|Route]] — Exposición de servicios: TLS, hostname/path routing, alternativa a Ingress
- [[template|Template]] — Plantillas parametrizadas: aplicaciones complejas, variables, objetos preconfigurados
- [[deploymentconfig|DeploymentConfig]] — Despliegues con triggers, rolling updates, lifecycle hooks pre/post

### Kubernetes Patterns (5)
- [[deployment|Deployment]] — Orquestación declarativa: rolling updates, rollbacks, replicación
- [[service|Service]] — Exposición de Pods: load balancing, DNS, múltiples tipos
- [[pod|Pod]] — Unidad mínima: 1+ contenedores, network compartida, efímeros
- [[statefulset|StatefulSet]] — Aplicaciones stateful: identidad persistente, almacenamiento dedicado
- [[job|Job]] — Tareas batch: completación garantizada, reintentos, ejecución paralela

### Storage Patterns (2)
- [[volume|Volume]] — Almacenamiento persistente e independiente (K8s, OpenStack, Proxmox, KVM)
- [[snapshot|Snapshot]] — Captura punto-en-tiempo: backup, clones, rollback

### Protocolos y Seguridad (4)
- [[http|HTTP]] — Protocolo request/response stateless: métodos GET/POST, códigos estado, cabeceras, negociación contenido
- [[tls|TLS]] — Encriptación transport-layer: PKI, certificados X.509, handshake, HTTPS, openssl
- [[spf|SPF (Sender Policy Framework)]] — Autenticación DNS para autorizar MTAs que envían correo
- [[dkim|DKIM]] — Firma digital criptográfica para validar autenticidad de correos
- [[dmarc|DMARC]] — Política unificada: SPF + DKIM + reportes de fallos

### Correo (1)
- [[postfix|Postfix]] — Servidor MTA: enrutamiento, entrega y gestión de correo electrónico

### Abstracciones Base (1)
- [[contenedores|Contenedores]] — Virtualización a nivel SO con kernel compartido

---

## 🏗️ Infraestructura y Plataformas

### KVM & libvirt

#### Introducción a KVM & libvirt
- [[introduccion-kvm|Introducción a la Virtualización con KVM - libvirt]] — Virtualización completa, QEMU/KVM stack, arquitectura
- [[virt-manager-setup|Instalación y Configuración de virt-manager]] — Instalación, configuración inicial, redes default, almacenamiento
- [[creacion-vms|Creación de Máquinas Virtuales en virt-manager]] — Wizard instalación, Linux/Windows, hardware, detalles VM
- [[almacenamiento-kvm|Almacenamiento en KVM - virt-manager]] — Storage pools, volúmenes, QCOW2, snapshots, thin provisioning
- [[clonacion-kvm|Clonación de Máquinas Virtuales en KVM]] — Full clone vs linked clone, problemas identidad, gestión
- [[redes-kvm|Redes en KVM - libvirt]] — NAT privadas, aisladas, bridge públicas, macvtap, configuración
- [[consola-serie-kvm|Acceso por Consola Serie en KVM]] — Acceso serie, getty, administración remota, bajo overhead

#### Profundización en KVM / libvirt
- [[conceptos-avanzados-kvm|Conceptos Avanzados de Virtualización en KVM]] — Aislamiento seguridad, benchmarking, disaster recovery, cloud computing
- [[setup-avanzado-kvm|Setup Avanzado de KVM/QEMU]] — Virtualización anidada, CPU host-passthrough, requisitos hardware
- [[virsh-cli-kvm|Gestión de Máquinas Virtuales con virsh]] — Gestión dominios XML, ciclo de vida, volúmenes, virt-viewer
- [[almacenamiento-virsh|Almacenamiento en KVM - libvirt con virsh]] — Pool types (dir/lvm/zfs/nfs), qemu-img, snapshots
- [[clonacion-virsh|Clonación Avanzada con virsh]] — virt-clone, virt-install, virt-customize, templates, batch
- [[redes-virsh|Redes Virtuales con virsh]] — Definición XML, DHCP/DNS, bridges (virbr), leases
- [[instalacion-red-kvm|Instalación de VMs por Red en KVM]] — virt-install --location, preseed/kickstart, automatización

### Proxmox VE
- [[introduccion-proxmox|Introducción a la Virtualización con Proxmox VE]] — Virtualización, tipos de hipervisores (KVM, LXC), plataforma gestión
- [[instalacion-proxmox|Instalación de Proxmox VE]] — Requisitos, proceso instalación, GUI, estructura cluster, storage/red por defecto
- [[creacion-maquinas-virtuales-proxmox|Creación de Máquinas Virtuales en Proxmox]] — ISO, dispositivos VirtIO, creación Linux/Windows, Qemu-guest-agent, acceso remoto
- [[almacenamiento-proxmox|Gestión de Almacenamiento en Proxmox]] — Tipos storage, Directory, LVM thin, adición discos, resize/move/detach, snapshots
- [[clonacion-snapshots-backups-proxmox|Clonación, Snapshots y Backups en Proxmox]] — Full/linked clone, plantillas, snapshots y rollback, backups (stop/suspend/snapshot)
- [[linux-containers-lxc-proxmox|Trabajando con Linux Containers (LXC) en Proxmox]] — Gestión LXC vs VMs, descarga plantillas, creación contenedores, ciclo de vida, mount points
- [[redes-proxmox|Gestión de Redes en Proxmox VE]] — Linux Bridge, vmbr0 público, redes internas, firewall 3 niveles (datacenter/nodo/VM)
- [[usuarios-permisos-proxmox|Gestión de Usuarios y Permisos en Proxmox VE]] — Autenticación (PAM, Proxmox), usuarios/grupos, roles, privilegios, pools de recursos, RBAC

### OpenStack
- [[introduccion-openstack|Introducción a OpenStack]] — Cloud IaaS, Horizon (web), OpenStack Client (CLI), claves SSH, grupos de seguridad
- [[glance-imagenes-openstack|Glance: Gestión de Imágenes en OpenStack]] — Catálogo de imágenes, formatos QCOW2/raw, snapshots, visibilidad
- [[nova-instancias-openstack|Nova: Gestión de Instancias en OpenStack]] — Ciclo de vida VM, sabores (flavors), snapshots, redimensión, cloud-init
- [[cinder-almacenamiento-openstack|Cinder: Gestión de Almacenamiento en OpenStack]] — Volúmenes persistentes, adjunción a instancias, snapshots, tipos storage
- [[neutron-redes-openstack|Neutron: Gestión de Redes en OpenStack]] — Redes privadas, routers, Floating IPs, grupos de seguridad, SDN

### Docker
- [[introduccion-docker|Introducción a Docker]] — Conceptos, diferencias con VMs, instalación
- [[docker-run-y-ciclo-vida|Ejecución de Contenedores en Docker]] — docker run, ciclo de vida, mapeamiento de puertos
- [[imagenes-y-docker-hub|Gestión de Imágenes en Docker]] — Capas, Docker Hub, comandos de gestión
- [[volumenes-bind-mounts|Almacenamiento en Docker]] — Volúmenes, bind mounts, tmpfs, persistencia
- [[redes-docker|Redes en Docker]] — Bridge, DNS, mapeamiento de puertos, SNAT/DNAT
- [[docker-compose|Docker Compose]] — Orquestación declarativa, servicios, volúmenes, variables
- [[dockerfile-y-construccion|Creación de Imágenes en Docker]] — Dockerfile, docker build, caching, multi-stage, best practices
- [[docker-desktop|Docker Desktop]] — GUI para contenedores, imágenes, volúmenes, builds, extensiones

### Podman
- [[introduccion-podman|Introducción a Podman]] — Daemonless, rootless nativo, Pods, Quadlet
- [[ejecucion-contenedores-podman|Ejecución de Contenedores con Podman]] — podman run, rootless vs rootful
- [[imagenes-podman|Gestión de Imágenes OCI en Podman]] — Pull, push, registros múltiples
- [[almacenamiento-redes-podman|Almacenamiento y Redes en Podman]] — Volúmenes, bind mounts, redes bridge
- [[pods-podman|Gestión de Pods en Podman]] — Pods nativos, generación YAML Kubernetes
- [[quadlet-systemd|Systemd y Quadlet: Gestión de Contenedores]] — Gestión de contenedores como servicios systemd
- [[podman-compose|Escenarios Multicontenedor con podman-compose]] — Escenarios multicontenedor, compose.yaml
- [[construccion-imagenes-podman|Construcción y Distribución de Imágenes OCI]] — Dockerfile, podman build, distribución
- [[seguridad-podman|Seguridad en Podman]] — Rootless, SELinux, AppArmor
- [[casos-practicos-podman|Casos Prácticos y Aplicaciones con Podman]] — WordPress, GuestBook, integración Kubernetes

### Kubernetes
- [[introduccion-kubernetes|Introducción a Kubernetes]] — Orquestación, arquitectura master/worker, por qué k8s
- [[instalacion-kubernetes|Instalación de Kubernetes]] — minikube, kubeadm, kind, kubectl setup
- [[pods-contenedores|Pods: Contenedores en Kubernetes]] — Unidad mínima, efímeros, health checks
- [[replicasets|ReplicaSets: Escalabilidad y Tolerancia a Fallos]] — Escalabilidad, auto-reparación, tolerancia a fallos
- [[deployments|Deployments: Ciclo de Vida Completo]] — Ciclo de vida, rolling updates, rollbacks
- [[services-acceso|Services: Acceso a Aplicaciones]] — ClusterIP, NodePort, LoadBalancer, Ingress, DNS
- [[configmaps-y-secrets|Despliegues Parametrizados: ConfigMaps y Secrets]] — Parametrización, configuración, credenciales
- [[almacenamiento-kubernetes|Almacenamiento en Kubernetes]] — PersistentVolumes, PVCs, provisioning
- [[statefulsets-daemonsets-jobs|Otras Cargas de Trabajo: StatefulSets, DaemonSets, Jobs]] — Cargas de trabajo especializadas
- [[helm-empaquetado|Helm: Empaquetado y Despliegue de Aplicaciones]] — Charts, package manager, templating

### OpenShift v4

#### Kubernetes y OpenShift
- [[introduccion-openshift|Introducción a OpenShift v4]] — Distribución K8s enterprise, Developer Sandbox, características
- [[developer-sandbox|Red Hat OpenShift Dedicated Developer Sandbox]] — Entorno cloud gratuito, proyectos, acceso web
- [[code-ready-containers|CRC (CodeReady Containers)]] — Code Ready Containers, instalación, requisitos, primeros pasos
- [[pods-replicasets-deployments|OpenShift como Distribución de Kubernetes]] — Recursos Kubernetes en OpenShift
- [[services-routes|Acceso a las Aplicaciones]] — Acceso a aplicaciones, exposición, routing
- [[configmaps-secrets|Despliegues Parametrizados]] — Parametrización, credenciales, configuración
- [[almacenamiento-openshift|Almacenamiento en OpenShift v4]] — Volumes, PersistentVolumes, PersistentVolumeClaims
- [[recursos-avanzados|Otros Recursos para Manejar Aplicaciones]] — StatefulSet, DaemonSet, Jobs, CronJobs, HPA
- [[aplicacion-ejemplo-citas|Ejemplo Final: Aplicación Citas]] — Despliegue multi-componente, microservices

#### OpenShift como PaaS
- [[openshift-paas|Introducción a OpenShift v4 como PaaS]] — Características PaaS, abstracciones, flujos de trabajo
- [[metodos-despliegue|Despliegue de Aplicaciones en OpenShift v4]] — Image, Source-to-Image (S2I), Dockerfile, Templates
- [[imagestream-gestion|ImageStreams: Gestión de Imágenes]] — Abstracción de imágenes, triggers automáticos, importación
- [[buildconfig-cicd|Builds: Construcción Automática de Imágenes]] — Construcción automatizada, S2I, Docker build, webhooks
- [[imagepull-registros|ImageStreams Avanzado: Etiquetas y Actualizaciones]] — ImagePullSecrets, registros privados, seguridad
- [[deployconfig-rolling-updates|DeployConfig y Rolling Updates]] — Despliegues avanzados, hooks lifecycle, rollbacks
- [[services-routes-avanzado|Acceso a Aplicaciones: Services y Routes]] — Exposición de aplicaciones, TLS, balanceo de carga
- [[operadores-knative-tekton|Extensiones de OpenShift: Operadores, Knative, Tekton]] — Extensiones, serverless, CI/CD declarativa
- [[monitorizacion-prometheus|Monitorización y Observabilidad]] — Prometheus, Grafana, logs, alertas, health checks
- [[seguridad-rbac-policies|Seguridad en OpenShift]] — Control de acceso, aislamiento red, Secrets, SecurityContext

---

## 🌐 Servicios y Aplicaciones

### Apache2
- [[fundamentos-apache|Fundamentos de Apache]] — HTTP, introducción, instalación en Debian/Ubuntu
- [[configuracion-apache|Configuración de Apache]] — Ficheros config, directivas clave, contextos Directory
- [[virtual-hosting-apache|Virtual Hosting en Apache]] — Múltiples dominios, NameVhost, a2ensite/a2dissite
- [[directorios-urls-apache|Directorios y URLs en Apache]] — Options, Alias, Redirect, DirectoryIndex, negociación
- [[autenticacion-apache|Autenticación en Apache]] — Control acceso, auth básica/digest, .htaccess, políticas Require
- [[modulos-apache|Módulos en Apache]] — a2enmod/a2dismod, mod_userdir, mod_dav, mod_rewrite, MPM
- [[aplicaciones-web-apache|Aplicaciones Web en Apache]] — mod_php, PHP-FPM, Python/WSGI, Node.js
- [[https-apache|HTTPS en Apache]] — mod_ssl, certificados, Let's Encrypt, CAcert, configuración TLS
- [[seguridad-apache|Seguridad en Apache]] — mod_security2, hardening, headers, permisos, logs
- [[proxy-logs-apache|Proxy Inverso y Análisis de Logs en Apache]] — mod_proxy, balanceo carga, AWStats

---

### Postfix: Correo Electrónico
- [[correo-conceptos-basicos|Fundamentos de Correo Electrónico]] — Agentes (MUA/MTA/MDA), protocolos (SMTP/POP3/IMAP), viaje del email
- [[correo-envio-a-internet|Envío de Correo con Postfix]] — Autenticación (SPF, DKIM, DMARC), seguridad en tránsito
- [[correo-recepcion-desde-internet|Recepción de Correo con Postfix]] — Registros MX, usuarios locales/virtuales, validación
- [[correo-postfix-instalacion|Instalación y Configuración de Postfix]] — Opciones instalación, parámetros esenciales, tipos servidor
- [[correo-configuracion-avanzada|Configuración Avanzada de Postfix]] — SMTPd restrictions, SPF verificación, antivirus (ClamAV), spam (SpamAssassin)
- [[correo-clientes-remotos|Clientes Remotos: POP3, IMAP y SMTP 587]] — Recepción/envío remoto, Dovecot, TLS, autenticación SASL
