---
title: Servidor Maestro/Esclavo en Bind9
created: 2026-04-19
updated: 2026-04-19
sources: [curso_dns_bind9]
tags: [dns, bind9, configuracion, seguridad]
---

# Servidor Maestro/Esclavo en Bind9

## Resumen de una línea
Replicación de zonas DNS: servidor maestro autorizado, esclavos que sincronizan vía transferencia, número de serie SOA.

## Concepto

Un servidor esclavo contiene una **réplica** de las zonas del servidor maestro. Se produce una **transferencia de zona** (el esclavo solicita la zona completa al maestro) para sincronizarse.

## Servidor Maestro

Servidor principal con autoridad sobre la zona. Almacena ficheros de zona y responde consultas.

**Fichero /etc/bind/named.conf.local:**
```
zone "example.com" {
    type master;
    file "db.example.com";
    notify yes;  # Notifica a esclavos de cambios
    allow-transfer { 10.0.0.12; };  # Solo esclavo autorizado
};
```

## Servidor Esclavo

Servidor secundario que replica la zona del maestro.

**Fichero /etc/bind/named.conf.local:**
```
zone "example.com" {
    type slave;
    file "db.example.com";
    masters { 10.0.0.11; };  # IP del maestro
};
```

**Log de transferencia exitosa:**
```
[notice] zone example.com/IN: transferred serial 2
zone example.com/IN: sending notifies to 10.0.0.11
```

## Transferencia de Zona

### Cómo Funciona
1. Esclavo solicita zona al maestro (comando `dig AXFR`)
2. Maestro responde con todos los registros
3. Esclavo guarda fichero replicado
4. Se sincroniza toda la zona (no registros individuales)

### Seguridad
**Deshabilitar transferencias públicas (por defecto):**
```
# En /etc/bind/named.conf.options
allow-transfer { none; };  # Ninguno por defecto
```

**Autorizar solo esclavos:**
```
allow-transfer { 10.0.0.12; 10.0.0.13; };
```

## Sincronización: Número de Serie SOA

### Principio
El esclavo **solo** inicia transferencia si el **número de serie aumenta**.

**Registro SOA:**
```
@    IN    SOA    maestro.example.com. admin.example.com. (
                  2026041901   ; Serial (YYYYMMDDNN)
                  604800       ; Refresh (1 semana)
                  86400        ; Retry (1 día)
                  2419200      ; Expire (4 semanas)
                  86400 )      ; Negative Cache TTL
```

**Importante:**
- ✅ Si serial **aumenta** → esclavo se sincroniza
- ❌ Si serial **disminuye** → nunca se actualiza (requiere esperar a que supere el anterior)
- ✅ Usar formato YYYYMMDDNN (2026041901, 2026041902, etc.)

## Refresh e Intervalo de Actualización

### Refresh (Intervalo de Actualización)
Frecuencia con que esclavo **revisa** el serial del maestro:
- Por defecto: 604800 seg (1 semana)
- Si serial cambió → inicia transferencia

### Notify (Notificación Automática)
Maestro puede notificar a esclavos de cambios inmediatos:
```
notify yes;  # En zona maestro
```

Sin `notify`, esclavo espera al refresh interval. Con `notify`, se sincroniza casi inmediatamente.

## Tiempo de Caducidad (Expire)

Si esclavo **no puede comunicarse** con maestro durante este intervalo:
- Borra su copia de la zona
- Deja de responder sobre esa zona

Por defecto: 2419200 seg (4 semanas)

## Verificación y Troubleshooting

### Verificar sincronización
```bash
# En maestro: consultar serial
dig @maestro.example.com example.com SOA

# En esclavo: consultar serial (debe ser igual)
dig @esclavo.example.com example.com SOA

# Ambos deben tener AA (Authoritative Answer)
```

### Probar transferencia de zona
```bash
# Solo esclavos autorizados pueden hacer AXFR
dig @maestro.example.com example.com AXFR

# Si no autorizado, será rechazado
```

### Revisar logs
```bash
tail -f /var/log/syslog | grep -i "zone\|transfer\|serial"
```

## Relaciones

### Conecta con
- [[dns-conceptos-fundamentales|Fundamentos de DNS]] — Zona, autoridad, SOA
- [[dns-bind9-configuracion|Configuración de Bind9]] — Setup básico
- [[dns-bind9-subdominios|Subdominios en Bind9]] — Delegación

## Fuentes
- [Servidor Maestro/Esclavo](https://fp.josedomingo.org/sri/2526/u5/clase4/) — Replicación y sincronización
- [Transferencia de Zonas](https://github.com/josedom24/curso_dns_bind9) — Detalles técnicos
