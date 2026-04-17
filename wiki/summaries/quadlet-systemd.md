---
title: "Systemd y Quadlet: Gestión de Contenedores"
created: 2026-04-15
updated: 2026-04-15
sources: [curso_podman_ow]
tags: [podman]
---

# Systemd y Quadlet: Gestión de Contenedores

## Resumen de una línea
Quadlet permite gestionar contenedores Podman como servicios systemd nativos: archivo .service → systemctl start/stop.

## Información
- **Fuente:** Curso Podman 2024 - Módulo 6


## Concepto: Quadlet

**Quadlet** = Integración Podman + systemd

```ini
# /etc/systemd/system/container-app.service
[Unit]
Description=My Application Container

[Container]
Image=myapp:latest
Exec=python app.py

[Service]
Restart=always

[Install]
WantedBy=default.target
```

```bash
systemctl start container-app
systemctl enable container-app
systemctl status container-app
```


## Sintaxis

### [Container]

```ini
[Container]
Image=nginx:latest
Ports=8080:80
Environment=DB_HOST=localhost
Volume=/home/user/data:/app/data
```

### [Service]

```ini
[Service]
Restart=always           # Reintentar si falla
RestartSec=10           # Segundos entre reintentos
Type=notify             # Notificar cuando está listo
```

### [Install]

```ini
[Install]
WantedBy=default.target
```


## Ventajas

✅ Gestión nativa de systemd  
✅ Logs en systemd (`journalctl`)  
✅ Reinicio automático con host  
✅ Integración con otros servicios systemd  


## Ejemplos

### Servidor Web

```ini
[Unit]
Description=Nginx Web Server

[Container]
Image=nginx:latest
Ports=80:80,443:443

[Service]
Restart=on-failure

[Install]
WantedBy=default.target
```

### Base de Datos

```ini
[Unit]
Description=MariaDB Database

[Container]
Image=mariadb:latest
Environment=MYSQL_ROOT_PASSWORD=secret
Volume=/home/data:/var/lib/mysql

[Service]
Restart=always

[Install]
WantedBy=default.target
```


## Operaciones

```bash
# Habilitar servicio
systemctl enable --now container-app

# Ver logs
journalctl -u container-app -f

# Parar
systemctl stop container-app
```


## Relaciones

### Conecta con
- [[introduccion-podman|Introducción]] — Feature de Podman
- [[pods-podman|Pods]] — También con Pods


## Fuentes

- [Curso Podman 2024 (GitHub)](https://github.com/josedom24/curso_podman_ow)
