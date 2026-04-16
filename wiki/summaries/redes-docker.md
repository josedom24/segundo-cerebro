---
created: 2026-04-15
updated: 2026-04-15
sources: [curso_docker_ow]
tags: [docker, networking, bridge, dns, port-mapping]
---

# Redes en Docker

## Resumen de una línea
Cómo se comunican los contenedores entre sí y con el exterior: redes bridge, mapeamiento de puertos, DNS interno y configuración de networking.

## Información
- **Fuente:** Curso Docker 2024 - Módulo 5
- **URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo5
- **URL GitHub:** https://github.com/josedom24/curso_docker_ow
- **Líneas de contenido:** 699

---

## Conceptos Fundamentales

### Aislamiento de Red en Contenedores

```
Host Docker (192.168.1.100)
    │
    ├─ Red bridge docker0 (172.17.0.0/16)
    │   ├─ contenedor1 (172.17.0.2)
    │   ├─ contenedor2 (172.17.0.3)
    │   └─ contenedor3 (172.17.0.4)
    │
    └─ Red usuario (192.168.0.0/24)
        ├─ app1 (192.168.0.2)
        └─ app2 (192.168.0.3)

Cada red es aislada
Contenedores en la misma red pueden comunicarse
Contenedores en redes diferentes necesitan exposición de puertos
```

---

## Red Bridge por Defecto

### Características

```bash
Bridge name:     docker0
Network:         172.17.0.0/16
Gateway:         172.17.0.1 (Host Docker)
DNS:             heredado del Host
Acceso exterior: SNAT (Source NAT)
Puerto mapping:  DNAT (Destination NAT)
```

### Crear Contenedor en Red Bridge

```bash
# Conectado automáticamente a docker0 (por defecto)
docker run -it --name contenedor1 alpine ash

# Con mapeamiento de puerto
docker run -it -p 8080:80 --name web alpine ash
```

### Configuración de Red en Contenedor

```bash
# Dentro del contenedor
# ip a
4: eth0@if5: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0

# ip r (rutas)
default via 172.17.0.1 dev eth0

# cat /etc/resolv.conf
nameserver 8.8.8.8  (heredado del Host)
```

### Host Docker

```bash
# Ver bridge docker0
$ ip a
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP>
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0

# Ver interfaces virtuales del contenedor
$ ip a
5: vethe6b3199@if4: <BROADCAST,MULTICAST,UP,LOWER_UP>
    master docker0
```

---

## Mapeamiento de Puertos: `-p`

### Sintaxis Básica

```bash
-p [IP_HOST:]PUERTO_HOST:PUERTO_CONTAINER[/PROTOCOLO]
```

### Ejemplos

```bash
# TCP (por defecto)
docker run -p 8080:80 nginx
# Host:8080/tcp → Contenedor:80/tcp

# UDP
docker run -p 8080:80/udp nginx
# Host:8080/udp → Contenedor:80/udp

# Ambos (TCP y UDP)
docker run -p 8080:80/tcp -p 8080:80/udp nginx

# En IP específica (solo desde esa IP)
docker run -p 192.168.1.100:8080:80 nginx
# Solo accesible desde 192.168.1.100:8080

# En localhost (127.0.0.1)
docker run -p 127.0.0.1:8080:80 nginx
# Solo accesible desde localhost

# Puertos múltiples
docker run -p 80:80 -p 443:443 nginx
```

### Ver Mapeos de Puerto

```bash
# Comando docker port
docker port mi-contenedor
80/tcp -> 0.0.0.0:8080
80/tcp -> [::]:8080

# En docker ps
docker ps
PORTS: 0.0.0.0:8080->80/tcp

# Con docker inspect
docker inspect --format='{{.NetworkSettings.Ports}}' mi-contenedor
```

---

## NAT: SNAT y DNAT

### SNAT (Source NAT): Contenedor → Exterior

```
Contenedor 172.17.0.2 → www.google.com
        ↓ (SNAT)
Host 192.168.1.100 → www.google.com

Respuesta: www.google.com → Host 192.168.1.100
        ↓ (Reverse SNAT)
Respuesta: → Contenedor 172.17.0.2
```

**Regla iptables:**
```bash
Chain POSTROUTING
MASQUERADE all -- 172.17.0.0/16 0.0.0.0/0
```

### DNAT (Destination NAT): Host → Contenedor

```
Host 192.168.1.100:8080 → puerto 8080
        ↓ (DNAT)
Contenedor 172.17.0.2:80 → puerto 80

Respuesta: Contenedor 172.17.0.2:80 → 
        ↓ (Reverse DNAT)
Respuesta: Host 192.168.1.100:8080 →
```

**Regla iptables:**
```bash
Chain DOCKER
DNAT tcp -- 0.0.0.0/0 0.0.0.0/0 tcp dpt:8080 to:172.17.0.2:80
```

### Ver Reglas iptables

```bash
sudo iptables -L -n -t nat
# Ver todas las reglas NAT en el host
```

---

## Redes Bridge Definidas por el Usuario

### Ventajas vs Bridge por Defecto

 Aspecto  Bridge por defecto  User-defined 
---------------
 **Resolución DNS**  No automática  ✅ Automática entre contenedores 
 **Aislamiento**  Todos conectados  ✅ Mejor aislamiento 
 **IP fija**  ❌ Aleatoria  ✅ Asignable 
 **Control**  Limitado  ✅ Total 

### Crear Red Bridge

```bash
# Crear red
docker network create mi-red

# Crear con config específica
docker network create \
  --driver bridge \
  --subnet 192.168.0.0/24 \
  --gateway 192.168.0.1 \
  mi-red

# Crear contenedor en la red
docker run -d --name app1 --network mi-red nginx
docker run -d --name app2 --network mi-red nginx

# Ahora app1 puede hacer ping a app2 por nombre
docker exec app1 ping app2  # Funciona ✅
# Sin user-defined network, sería por IP
```

### Gestión de Redes

```bash
# Listar redes
docker network ls

# Información de red
docker network inspect mi-red

# Conectar contenedor a red
docker network connect mi-red contenedor-existente

# Desconectar
docker network disconnect mi-red contenedor
```

---

## Resolución DNS

### DNS Automático en Redes User-defined

```bash
# En red user-defined
docker network create mi-red
docker run -d --name db --network mi-red mysql
docker run -d --name app --network mi-red mi-app

# Dentro de app:
root@app:/# ping db
# Funciona! ✅
# db → 192.168.0.2 (automáticamente)

root@app:/# curl http://db:3306
# También funciona por nombre
```

### DNS en Bridge por Defecto

```bash
# En bridge por defecto
docker run -d --name db1 mysql
docker run -it --name app alpine ash

# Dentro de app:
# ping db1
# ❌ No funciona
# Necesitas saber la IP: docker inspect db1
# 172.17.0.2

# ping 172.17.0.2
# ✅ Funciona (pero por IP, no por nombre)
```

### Configuración DNS Manual

```bash
# Especificar DNS explícitamente
docker run --dns 8.8.8.8 --dns 8.8.4.4 nginx

# Ver DNS del contenedor
docker exec mi-contenedor cat /etc/resolv.conf
nameserver 8.8.8.8
nameserver 8.8.4.4
```

---

## Tipos de Redes en Docker

### 1. Bridge (por defecto)
- Red privada local
- Aislada del host
- NAT para acceso exterior

### 2. Host
- Contenedor comparte red del host
- Sin aislamiento
- Performance máxima

```bash
docker run --network host nginx
# Accesible en puerto 80 del host directamente
```

### 3. None
- Sin red
- Totalmente aislado
- Casos muy específicos

```bash
docker run --network none nginx
```

### 4. User-defined Bridge
- Control total
- DNS automático
- Mejor aislamiento
- **Recomendado para multi-contenedor**

### 5. Overlay
- Para Docker Swarm/Kubernetes
- Redes entre múltiples hosts
- No cubierto en este módulo

---

## Casos de Uso Prácticos

### Caso 1: Web + Base de Datos

```bash
# Crear red
docker network create app-net

# Base de datos
docker run -d \
  --name mysql-db \
  --network app-net \
  -e MYSQL_ROOT_PASSWORD=secret \
  mysql:8.0

# Aplicación web
docker run -d \
  --name app \
  --network app-net \
  -p 8080:3000 \
  mi-app:latest

# app puede hacer: curl http://mysql-db:3306
# Automáticamente! ✅
```

### Caso 2: API + Cache

```bash
docker network create api-net

# Redis cache
docker run -d --name redis --network api-net redis:7

# API
docker run -d \
  --name api \
  --network api-net \
  -p 3000:3000 \
  mi-api:latest

# API conecta a redis:6379 (DNS automático)
```

### Caso 3: Expose a Internet

```bash
# Puerto específico
docker run -d \
  -p 0.0.0.0:80:80 \
  nginx

# Puerto en localhost (local only)
docker run -d \
  -p 127.0.0.1:8080:80 \
  nginx

# Puerto en IP específica
docker run -d \
  -p 192.168.1.100:8080:80 \
  nginx
```

---

## Conceptos Clave

1. **Bridge por defecto:** 172.17.0.0/16, sin DNS automático
2. **User-defined:** Mejor (DNS, aislamiento), usar para multi-contenedor
3. **NAT:** SNAT (salida), DNAT (entrada de puertos)
4. **Mapeamiento:** `-p host:container`, mapea puertos
5. **Aislamiento:** Contenedores en misma red se comunican
6. **DNS:** Automático en user-defined, por IP en default
7. **Resolución:** `contenedor-a` se resuelve a su IP automáticamente
8. **iptables:** Docker configura DNAT/SNAT automáticamente

---

## Relaciones

### Conecta con
- [[docker]] — Plataforma base
- [[contenedores]] — Lo que se comunica
- [[docker-compose|Docker Compose]] — Define redes declarativamente


---

## Flujo Típico

```
1. Crear red: docker network create mi-red
2. Crear contenedores en la red: --network mi-red
3. Contenedores se resuelven por nombre (DNS)
4. Exponer al exterior: -p 8080:80 en el contenedor "frontend"
5. Contenedores internos: sin -p (aislados internamente)
```

---

## Fuentes

- [Curso Docker 2024 - Módulo 5](https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo5)
