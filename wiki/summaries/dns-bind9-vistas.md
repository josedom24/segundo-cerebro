---
title: Vistas en Bind9
created: 2026-04-19
updated: 2026-04-19
sources: [curso_dns_bind9]
tags: [dns, bind9, configuracion, seguridad]
---

# Vistas en Bind9

## Resumen de una línea
Vistas de DNS: devolver diferentes respuestas según la red del cliente (interna vs externa).

## Concepto

Una máquina con direccionamiento en dos redes puede necesitar resolver diferente según **dónde consulte el cliente**:
- Desde **red interna** (10.0.0.0/24) → IP privada (10.0.0.13)
- Desde **red externa** (172.22.0.0/16) → IP flotante (172.22.0.129)

**Solución:** Vistas de Bind9 que responden diferente según cliente.

## Ejemplo: Máquina con Dos Redes

```
Servidor: servidor.example.org
  └─ Red interna: 10.0.0.13
  └─ Red externa: 172.22.0.129
```

**Requisito:**
- Cliente interno → 10.0.0.13
- Cliente externo → 172.22.0.129

## Configuración

### Fichero /etc/bind/named.conf.local

**Vista Interna:**
```
view interna {
    match-clients { 10.0.0.0/24; 127.0.0.1; };
    allow-recursion { any; };   

    zone "example.org" {
        type master;
        file "db.interna.example.org";
    };
    
    zone "0.0.10.in-addr.arpa" {
        type master;
        file "db.0.0.10";
    };
    
    include "/etc/bind/zones.rfc1918";
    include "/etc/bind/named.conf.default-zones";
};
```

**Vista Externa:**
```
view externa {
    match-clients { 172.22.0.0/16; };
    allow-recursion { any; };   

    zone "example.org" {
        type master;
        file "db.externa.example.org";
    };
    
    zone "22.172.in-addr.arpa" {
        type master;
        file "db.22.172";
    };
    
    include "/etc/bind/zones.rfc1918";
    include "/etc/bind/named.conf.default-zones";
};
```

## Ficheros de Zona

### Zona Interna (db.interna.example.org)
```
$ORIGIN example.org.
@    IN    SOA    servidor.example.org. admin.example.org. (...)
@    IN    NS    servidor

servidor    IN    A    10.0.0.13
```

### Zona Externa (db.externa.example.org)
```
$ORIGIN example.org.
@    IN    SOA    servidor.example.org. admin.example.org. (...)
@    IN    NS    servidor

servidor    IN    A    172.22.0.129
```

### Zona Inversa Interna (db.0.0.10)
```
$ORIGIN 0.0.10.in-addr.arpa.
@    IN    NS    servidor.example.org.
13   IN    PTR    servidor.example.org.
```

### Zona Inversa Externa (db.22.172)
```
$ORIGIN 22.172.in-addr.arpa.
@    IN    NS    servidor.example.org.
129  IN    PTR    servidor.example.org.
```

## Funcionamiento de Vistas

1. **match-clients:** Diferencia qué vista aplicar según IP cliente
2. **Zonas:** Cada vista puede tener diferentes ficheros de zona
3. **Recursión:** Permitida en ambas vistas (allow-recursion)
4. **RFC1918:** Zonas de direcciones privadas (incluidas en cada vista)
5. **Zonas por defecto:** Incluidas en cada vista (no en named.conf principal)

## Control de Acceso

### Parámetros Globales

**En /etc/bind/named.conf.options:**
```
allow-query { any; };           # Quién puede consultar
allow-recursion { 10.0.0.0/24; 127.0.0.1; };  # Quién puede recursión
```

### En Vistas
```
view interna {
    match-clients { 10.0.0.0/24; 127.0.0.1; };
    allow-query { any; };
    allow-recursion { any; };
    ...
};
```

## Importante: Remover Zonas Globales

**Deshabilitar zonas por defecto en named.conf:**
```bash
# Comentar la línea:
// include "/etc/bind/named.conf.default-zones";
```

**Razón:** Las zonas deben estar **dentro** de vistas, no globales.

## Relaciones

### Conecta con
- [[dns-conceptos-fundamentales|Fundamentos de DNS]] — Control de acceso
- [[dns-bind9-configuracion|Configuración de Bind9]] — Setup básico
- [[dns-bind9-maestro-esclavo|Servidor Maestro/Esclavo]] — Replicación de vistas

## Fuentes
- [Vistas en Bind9](https://www.josedomingo.org/pledin/2017/12/vistas-views-en-el-servidor-dns-bind9/) — Configuración avanzada
- [Control de Acceso DNS](https://fp.josedomingo.org/sri/2526/u5/) — Seguridad y vistas
