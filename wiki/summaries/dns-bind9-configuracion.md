---
title: Configuración de Bind9
created: 2026-04-19
updated: 2026-04-19
sources: [curso_dns_bind9]
tags: [dns, bind9, instalacion, configuracion]
---

# Configuración de Bind9

## Resumen de una línea
Instalación de Bind9, configuración de ficheros, creación de zonas directas e inversas, integración con DHCP.

## Instalación

```bash
apt install bind9 bind9-utils
systemctl start bind9
systemctl enable bind9
```

## Ficheros de Configuración

### Estructura
```
/etc/bind/
├── named.conf           # Configuración principal
├── named.conf.local     # Zonas locales (editable)
├── named.conf.options   # Opciones globales
└── /var/cache/bind/
    ├── db.ejemplo.com   # Zona directa
    └── db.0.0.10        # Zona inversa
```

## Configuración Básica

### Fichero named.conf.local
```
zone "example.com" {
    type master;
    file "db.example.com";
    allow-update { key "rndc-key"; };
};

zone "0.0.10.in-addr.arpa" {
    type master;
    file "db.0.0.10";
    allow-update { key "rndc-key"; };
};
```

## Zona Directa (nombre → IP)

### Fichero db.example.com
```
$TTL    86400
@    IN    SOA    dns-1.example.com. root.example.com. (
                  1        ; Serial
             604800        ; Refresh
              86400        ; Retry
            2419200        ; Expire
              86400 )      ; Negative Cache TTL
;
@    IN    NS        dns-1.example.com.
@    IN    MX    10    correo.example.com.

$ORIGIN example.com.
dns-1    IN    A    10.0.0.11
correo   IN    A    10.0.0.200
www      IN    CNAME    dns-1
```

## Zona Inversa (IP → nombre)

### Fichero db.0.0.10
```
$TTL    86400
@    IN    SOA    dns-1.example.com. root.example.com. (
                  1        ; Serial
             604800        ; Refresh
              86400        ; Retry
            2419200        ; Expire
              86400 )      ; Negative Cache TTL
;
@    IN    NS    dns-1.example.com.

$ORIGIN 0.0.10.in-addr.arpa.
11   IN    PTR    dns-1.example.com.
200  IN    PTR    correo.example.com.
```

## Integración con DHCP

**Fichero /etc/dhcp/dhcpd.conf:**
```
ddns-updates on;
ddns-update-style interim;
ddns-domainname "example.com.";
ddns-rev-domainname "0.0.10.in-addr.arpa.";
include "/etc/bind/rndc.key";

zone example.com. {
  primary 127.0.0.1;
  key rndc-key;
}
```

**Resultado:** Máquinas que tomen DHCP aparecen automáticamente en DNS con sus nombres.

## Verificación

### Consultas básicas
```bash
# Consulta zona
dig @10.0.0.11 www.example.com

# Resolución inversa
dig @10.0.0.11 -x 10.0.0.11

# Info de zona
dig @10.0.0.11 NS example.com
```

### Reiniciar servicio
```bash
systemctl restart bind9
tail -f /var/log/syslog  # Ver errores
```

## Relaciones

### Conecta con
- [[dns-conceptos-fundamentales|Fundamentos de DNS]] — Registros SOA, NS, A, PTR
- [[dns-bind9-maestro-esclavo|Servidor Maestro/Esclavo]] — Replicación de zonas
- [[dns-bind9-subdominios|Subdominios en Bind9]] — Delegación

## Fuentes
- [Servidor Bind9 - Configuración](https://fp.josedomingo.org/sri/2526/u5/clase2/) — Setup básico
- [Zonas en Bind9](https://fp.josedomingo.org/sri/2526/u5/clase3/) — Zonas directas e inversas
