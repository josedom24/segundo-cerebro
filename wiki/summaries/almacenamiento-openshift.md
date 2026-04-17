---
created: 2026-04-16
updated: 2026-04-16
sources: [osv4_k8s_curso]
tags: [almacenamiento, openshift, volumes]
---

# Almacenamiento en OpenShift v4 (Curso 1 - Módulo 7)

## Resumen
Gestión del almacenamiento persistente en OpenShift: Volumes, PersistentVolumes, PersistentVolumeClaims, y aprovisionamiento dinámico usando StorageClass.

## Conceptos Clave

### Tipos de Volúmenes
- **Efímero:** Datos desaparecen al eliminar Pod
- **Persistente:** Datos perduran más allá del Pod

### Almacenamiento en Pod
**emptyDir:** Volumen temporal para múltiples contenedores en mismo Pod
```yaml
spec:
  containers:
  - name: app
    volumeMounts:
    - mountPath: /cache
      name: cache
  volumes:
  - name: cache
    emptyDir: {}
```

### PersistentVolume (PV)
**Propósito:** Recurso de almacenamiento en el cluster

**Características:**
- Ciclo de vida independiente de Pods
- Creado por admin del cluster
- Capacidad fija
- Modes de acceso: ReadWriteOnce, ReadOnlyMany, ReadWriteMany

### PersistentVolumeClaim (PVC)
**Propósito:** Solicitud de almacenamiento por usuario

**Workflow:**
1. Admin crea PVs
2. Usuario crea PVC pidiendo capacidad/modo
3. Cluster busca PV que coincida
4. PV se "vincula" (bound) con PVC
5. Usuario monta PVC en Pod

### Aprovisionamiento Estático
```
Admin crea PV (10GB)
  ↓
Desarrollador crea PVC (pide 5GB ReadWriteOnce)
  ↓
Cluster vincula automáticamente
  ↓
PVC en estado "Bound"
```

### Aprovisionamiento Dinámico
**Propósito:** Crear volúmenes automáticamente

**Componentes:**
- **StorageClass:** Define "aprovisionador" y parámetros
- **PVC:** Pide almacenamiento
- **Sistema:** Automáticamente crea PV correspondiente

**Ejemplo:**
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
  iops: "3000"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-claim
spec:
  storageClassName: fast-ssd
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

### Almacenamiento en CRC
- **StorageClass:** `hostpath` (único disponible)
- **Directorio host:** Cada volumen mapea a directorio local
- **Ventaja:** Single-node, almacenamiento compartido
- **Limitación:** No distribuido, solo desarrollo

### Usuarios en CRC
- **Admin (kubeadmin):** Ver/crear PVs, StorageClasses
- **Developer:** Solo crear PVCs

### Montar PVC en Pod
```yaml
spec:
  containers:
  - image: mysql
    volumeMounts:
    - mountPath: /var/lib/mysql
      name: data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: mysql-pvc
```

### Ejemplo: WordPress Persistente
```
WordPress Pod
  ├─ /var/www/html (PVC wordpress-data)
  └─ MySQL Pod
       └─ /var/lib/mysql (PVC mysql-data)

Si Pod cae → datos persisten en PVs
```

## Relaciones

### Conecta con
- Parte de: [[openshift|OpenShift]], [[kubernetes|Kubernetes]]
- Conceptos: [[volume|Volume]] (abstracción conceptual)
- Similar a: [[snapshot|Snapshot]] (backup/restore)

## Fuentes
- [Curso: OpenShift v4](https://plataforma.josedomingo.org/pledin/cursos/osv4_k8s/)
