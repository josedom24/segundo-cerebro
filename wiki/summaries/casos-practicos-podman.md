---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_podman_ow]
tags: [podman, casos-practicos, ejemplos, aplicaciones]
---

# Casos Prácticos y Aplicaciones con Podman

## Resumen de una línea
Casos prácticos con Podman: Drupal, GuestBook, Temperaturas, WordPress; integración con Kubernetes.

## Información
- **Fuente:** Curso Podman 2024 - Módulos 3-7 (casos prácticos)

---

## Patrón General

```
1. Crear pod o usar compose
2. Ejecutar contenedores (web, app, DB)
3. Configurar redes y volúmenes
4. Probar
5. (Opcional) Generar YAML Kubernetes
```

---

## Caso: WordPress + MariaDB (Pod)

```bash
# Crear pod
podman pod create wordpress-pod

# MariaDB
podman run --pod wordpress-pod \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=wordpress \
  -v db-data:/var/lib/mysql \
  mariadb

# WordPress
podman run --pod wordpress-pod \
  -e WORDPRESS_DB_HOST=localhost \
  -e WORDPRESS_DB_NAME=wordpress \
  -e WORDPRESS_DB_USER=root \
  -e WORDPRESS_DB_PASSWORD=secret \
  -p 8080:80 \
  wordpress

# Acceder: http://localhost:8080
```

---

## Caso: WordPress + MariaDB (Compose)

```yaml
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: secret

  db:
    image: mariadb:latest
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: secret
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:
```

```bash
podman-compose up -d
```

---

## Caso: WordPress + Systemd (Quadlet)

```ini
# /etc/systemd/system/container-wordpress.service
[Unit]
Description=WordPress with MariaDB

[Container]
Image=wordpress:latest
Ports=8080:80
Environment=WORDPRESS_DB_HOST=localhost
Depends=container-mariadb.service

[Service]
Restart=always

[Install]
WantedBy=default.target
```

```bash
systemctl enable --now container-wordpress
```

---

## GuestBook (Aplicación Demo)

Aplicación multi-tier:
```
Frontend (Node.js)
  ↓
Backend API (Python)
  ↓
Redis (Cache)
  ↓
Base de datos
```

Con Podman:

```bash
# Cada servicio en su contenedor
podman run --net mynet redis
podman run --net mynet -e REDIS_HOST=redis python-api
podman run --net mynet -e API_HOST=api node-frontend
```

---

## Temperaturas (Aplicación Demo)

Aplicación de sensores:
```
Web (Django)
  ↓
API REST
  ↓
Base de datos
  ↓
MQTT (sensores)
```

---

## Generar YAML Kubernetes

```bash
# Ejecutar en Podman
podman pod create myapp
podman run --pod myapp nginx
podman run --pod myapp myapp:latest

# Exportar a Kubernetes
podman generate kube myapp > myapp.yaml

# Ejecutar en Kubernetes
kubectl apply -f myapp.yaml
```

---

## Patrones Comunes

### 1. Desarrollo Local

```bash
podman-compose up -d

# Desarrollo rápido, cambios inmediatos
```

### 2. Testing

```bash
podman run --rm -it app:latest pytest

# Limpiar automáticamente
```

### 3. Producción Pequeña (VPS)

```bash
# Quadlet con systemd
podman run ... && systemctl enable container-app
```

### 4. Migración desde Docker

```bash
# Cambiar docker → podman, nada más
docker-compose up → podman-compose up
```

---

## Relaciones

### Conecta con
- podman-composepodman-compose]]
- [[quadlet-systemd|Quadlet]]
- [[pods-podman|Pods]]
- [[helm-empaquetado|Kubernetes]]

---

## Fuentes

- [Curso Podman 2024 (GitHub)](https://github.com/josedom24/curso_podman_ow)
