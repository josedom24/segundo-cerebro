---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_podman_ow]
tags: [podman, compose, docker-compose, orquestacion]
---

# Escenarios Multicontenedor con podman-compose

## Resumen de una línea
podman-compose es equivalente a docker-compose: define múltiples contenedores en YAML, ejecuta con un comando.

## Información
- **Fuente:** Curso Podman 2024 - Módulo 7

---

## Concepto

**podman-compose** = docker-compose para Podman

```yaml
# compose.yaml
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
  
  app:
    image: myapp:latest
    environment:
      DB_HOST: db
  
  db:
    image: mariadb:latest
    environment:
      MYSQL_ROOT_PASSWORD: secret
```

```bash
podman-compose up -d
```

---

## Sintaxis: compose.yaml

### Servicios

```yaml
services:
  nginx:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
```

### Redes

```yaml
services:
  web:
    networks:
      - frontend
  db:
    networks:
      - backend

networks:
  frontend:
  backend:
```

### Volúmenes

```yaml
services:
  db:
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:
```

---

## Comandos

```bash
# Crear y ejecutar
podman-compose up -d

# Ver estado
podman-compose ps

# Logs
podman-compose logs -f

# Parar
podman-compose down

# Eliminar
podman-compose down -v  # También elimina volúmenes
```

---

## Casos de Uso

### WordPress + MariaDB

```yaml
services:
  wordpress:
    image: wordpress:latest
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: secret
    ports:
      - "80:80"
    depends_on:
      - db
  
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
# WordPress disponible en http://localhost
```

---

## Rootless con podman-compose

```bash
# Por defecto funciona bien con rootless
podman-compose up -d

# Nota: en rootless, puertos < 1024 necesitan workaround
```

---

## Relaciones

### Conecta con
- [[ejecucion-contenedores-podman|Ejecución]]
- [[almacenamiento-redes-podman|Almacenamiento y redes]]
- [[docker-compose|Docker Compose]] — Similar

---

## Fuentes

- [Curso Podman 2024 (GitHub)](https://github.com/josedom24/curso_podman_ow)
- [podman-compose GitHub](https://github.com/containers/podman-compose)
