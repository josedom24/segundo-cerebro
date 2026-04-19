---
title: Subdominios en Bind9
created: 2026-04-19
updated: 2026-04-19
sources: [curso_dns_bind9]
tags: [dns, bind9, configuracion]
---

# Subdominios en Bind9

## Resumen de una línea
Subdominios virtuales dentro de una zona y delegación a servidores DNS separados.

## Dos Enfoques

### 1. Subdominio Virtual (Un solo servidor)
Un servidor DNS tiene autoridad sobre dominio y subdominio.

**Fichero db.example.com:**
```
$ORIGIN example.com.
dns-1    IN    A    10.0.0.11
www      IN    CNAME    dns-1

$ORIGIN es.example.com.
web      IN    A    10.0.0.100
www      IN    CNAME    web
```

**Consulta:**
```bash
dig @10.0.0.11 www.es.example.com
# Respuesta: CNAME web.es.example.com, A 10.0.0.100
# Servidor con autoridad: dns-1.example.com (NS)
```

**Característica:** Un solo servidor (dns-1) gestiona ambas zonas.

### 2. Delegación de Subdominio (Servidores separados)
Servidor maestro delega subdominio a otro servidor DNS.

**Arquitectura:**
```
dns-1.example.com (10.0.0.11)
    ↓ gestiona example.com
    └─ delega es.example.com a dns-3.es.example.com (10.0.0.13)
```

## Configuración: Dominio Principal

**Fichero db.example.com (en dns-1):**
```
$ORIGIN example.com.
@        IN    NS    dns-1
dns-1    IN    A    10.0.0.11

$ORIGIN es.example.com.
@        IN    NS    dns-3
dns-3    IN    A    10.0.0.13
```

**Significado:** El servidor autorizado para es.example.com es dns-3.es.example.com en 10.0.0.13.

## Configuración: Subdominio

**En dns-3 (10.0.0.13), fichero /etc/bind/named.conf.local:**
```
zone "es.example.com" {
    type master;
    file "db.es.example.com";
};
```

**Fichero db.es.example.com:**
```
$TTL    86400
@    IN    SOA    dns-3.es.example.com. admin.es.example.com. (
                  1        ; Serial
             604800        ; Refresh
              86400        ; Retry
            2419200        ; Expire
              86400 )      ; Negative Cache TTL
;
@    IN    NS    dns-3.es.example.com.

$ORIGIN es.example.com.
dns-3    IN    A    10.0.0.13
web      IN    A    10.0.0.100
www      IN    CNAME    web
```

## Flujo de Consulta

**Cliente pregunta por www.es.example.com:**

1. Cliente pregunta a su DNS recursivo
2. Recursivo pregunta a root servers
3. Root servers remiten a servidor TLD (.com)
4. TLD remite a dns-1.example.com (NS de example.com)
5. dns-1 responde: "Para es.example.com pregunta a dns-3.es.example.com"
6. Recursivo pregunta a dns-3
7. dns-3 responde con autoridad (AA): www.es.example.com → 10.0.0.100

## Ventajas de Delegación

- ✅ Escalabilidad: Cada subdominio gestiona su propia zona
- ✅ Independencia: Cambios en subdominio sin afectar principal
- ✅ Descentralización: Administración distribuida
- ✅ Redundancia: Cada subdominio puede tener maestro/esclavo

## Relaciones

### Conecta con
- [[dns-conceptos-fundamentales|Fundamentos de DNS]] — Zonas, autoridad, delegación
- [[dns-bind9-configuracion|Configuración de Bind9]] — Setup de zonas
- [[dns-bind9-maestro-esclavo|Servidor Maestro/Esclavo]] — Replicación de subdominios

## Fuentes
- [Subdominios en Bind9](https://fp.josedomingo.org/sri/2526/u5/clase5/) — Virtual y delegación
- [Curso DNS Bind9](https://github.com/josedom24/curso_dns_bind9) — Ejemplos prácticos
