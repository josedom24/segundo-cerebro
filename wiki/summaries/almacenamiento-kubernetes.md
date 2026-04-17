---
title: "Almacenamiento en Kubernetes"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_kubernetes_cep]
tags: [almacenamiento, kubernetes]
---

# Almacenamiento en Kubernetes

## Resumen de una línea
PersistentVolume y PersistentVolumeClaim permitendatos persistentes más allá del ciclo de vida de Pods: almacenamiento gestático y dinámico.

## Información
- **Fuente:** Curso Kubernetes - Módulo 8
- **URL GitHub:** https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo8


## Problema: Datos Efímeros

```
Pod con datos
  ├─ Base de datos
  ├─ Archivos de usuario
  └─ Logs

Pod muere → Todos los datos desaparecen ❌
```

**Solución:** Storage persistente


## Conceptos

### PersistentVolume (PV)

Almacenamiento disponible en el clúster:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-storage
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  storageClassName: fast-ssd
  nfs:
    server: "192.168.1.100"
    path: "/exports/data"
```

### PersistentVolumeClaim (PVC)

Solicitud de almacenamiento por parte de un Pod:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: fast-ssd
```

### Ciclo de Vida

```
1. Admin crea PV (almacenamiento disponible)
2. Usuario crea PVC (solicita almacenamiento)
3. Kubernetes vincula PV ↔ PVC
4. Pod monta PVC
5. Datos persisten más allá del Pod
```


## Access Modes (Modos de Acceso)

 Modo  Descripción 
-------------------
 `ReadWriteOnce`  Un nodo, lectura/escritura 
 `ReadOnlyMany`  Muchos nodos, solo lectura 
 `ReadWriteMany`  Muchos nodos, lectura/escritura 


## Aprovisionamiento

### Estático (Manual)

Admin crea PVs manualmente:

```yaml
# Admin crea PV
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-1
spec:
  capacity:
    storage: 100Gi
  nfs:
    server: "nfs.example.com"
    path: "/data"
```

### Dinámico (Automático)

StorageClass define cómo crear storage automáticamente:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com
parameters:
  type: gp2
  iops: "1000"
```

User crea PVC:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
spec:
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 5Gi
```

Kubernetes automáticamente:
1. Crea volumen en cloud (EBS, GCP Disk, etc.)
2. Crea PV
3. Vincula PV ↔ PVC


## Uso en Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  template:
    spec:
      containers:
      - name: mysql
        image: mysql:5.7
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc
```


## Operaciones

```bash
# Crear PVC
kubectl apply -f pvc.yaml

# Ver PVCs
kubectl get pvc

# Ver PVs
kubectl get pv

# Ver vinculación
kubectl describe pvc mysql-pvc

# Eliminar PVC (datos se conservan)
kubectl delete pvc mysql-pvc
```


## Ciclos de Vida de Reclamación

```
Released:    PVC eliminado, PV libre
Retained:    Datos se conservan
Recycle:     Datos se borran automáticamente
Delete:      Almacenamiento en cloud se elimina
```


## Tipos de Storage

 Tipo  Ventaja  Desventaja 
--------------------------
 **NFS**  Compartido  Rendimiento 
 **iSCSI**  Performance  Complejo 
 **EBS (AWS)**  Nativo cloud  Vendor lock-in 
 **GCP Disk**  Nativo cloud  Vendor lock-in 
 **local**  Rápido  No portable 


## Caso de Uso: WordPress + MariaDB

```yaml
# PVC para MariaDB
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mariadb-pvc
spec:
  resources:
    requests:
      storage: 10Gi
# PVC para WordPress
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wordpress-pvc
spec:
  resources:
    requests:
      storage: 5Gi
# Deployment MariaDB con storage
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mariadb
spec:
  template:
    spec:
      containers:
      - name: mariadb
        image: mariadb:latest
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: mariadb-pvc
```


## Relaciones

### Conecta con
- [[deployments|Deployments: Ciclo de Vida Completo]] — Consume storage
- [[configmaps-y-secrets|Despliegues Parametrizados: ConfigMaps y Secrets]] — Credenciales de BD

### Parte de
- Almacenamiento en Kubernetes — Soluciones de almacenamiento


## Fuentes

- [Curso Kubernetes - Módulo 8 (GitHub)](https://github.com/iesgn/curso_kubernetes_cep/tree/main/modulo8)
- [Kubernetes Storage](https://kubernetes.io/docs/concepts/storage/)
- [PersistentVolumes Documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
