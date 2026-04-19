---
title: Alias y Redirecciones de Correo
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, postfix, alias, usuarios-virtuales]
---

# Alias y Redirecciones de Correo

## Resumen de una línea
Creación de usuarios virtuales, alias de correo y redirecciones para enrutar mensajes a diferentes destinos.

## Conceptos

### Alias
Nombre alternativo que apunta a una dirección de correo real.
```
postmaster → root
admin → usuario_real
```

### Usuario Virtual
Usuario que no existe como cuenta del sistema, solo como dirección de correo.
```
soporte@midominio.com → /home/usuario/correos/soporte/
```

### Redirección
Reenvío automático de correo de una dirección a otra.
```
viejo@midominio.com → nuevo@midominio.com
```

## Alias del Sistema

### Archivo `/etc/aliases`

```
# Alias del sistema
postmaster: root
abuse: root
noreply: /dev/null

# Alias a grupo
gerentes: gerente1, gerente2, gerente3

# Alias a archivo
log-correos: /var/mail/logs
```

**Compilar cambios:**
```bash
newaliases
```
O:
```bash
postalias /etc/aliases
```

## Usuarios Virtuales

### Archivo `/etc/postfix/virtual`

```
# Usuarios virtuales para midominio.com
info@midominio.com usuario_real@otro.com
soporte@midominio.com usuario_real
contacto@midominio.com contacto-usuario

# Grupo virtual
direccion@midominio.com usuario1, usuario2, usuario3

# Comodín (catchall)
@midominio.com usuario_por_defecto
```

### Activar Virtual Maps

**Compilar:**
```bash
postmap /etc/postfix/virtual
```

**Configurar en `/etc/postfix/main.cf`:**
```
virtual_alias_maps = hash:/etc/postfix/virtual
virtual_alias_domains = midominio.com
```

**Reiniciar:**
```bash
systemctl restart postfix
```

## Redirecciones

### Redirección Simple
```
correo_viejo@midominio.com correo_nuevo@midominio.com
```

Dirección antigua reenvía a la nueva.

### Redirección a Múltiples
```
admin@midominio.com admin1@midominio.com, admin2@midominio.com
```

Se entrega a varios destinatarios.

## Casos Prácticos

### Ejemplo 1: Postmaster
```
/etc/aliases:
postmaster: root
```
Correos a postmaster van a root del sistema.

### Ejemplo 2: Soporte Multiusuario
```
/etc/postfix/virtual:
soporte@midominio.com user1, user2, user3
```
Correos a soporte se distribuyen entre 3 usuarios.

### Ejemplo 3: Cambio de Nombre
```
/etc/postfix/virtual:
juan.perez@midominio.com nuevo_juan@midominio.com
```
Dirección antigua redirige a nueva.

## Resolución de Problemas

### Alias no funciona
1. Verificar `/etc/aliases` o `/etc/postfix/virtual`
2. ¿Compilado? `newaliases` o `postmap`
3. ¿Postfix reiniciado? `systemctl restart postfix`
4. Revisar log: `tail -f /var/log/mail.log`

### Usuario virtual rechazado
```
550 5.1.1 <virtual@midominio.com>: Recipient rejected
```
→ No está en virtual_maps o virtual_alias_maps

## Relaciones

### Conecta con
- [[correo-recepcion-desde-internet|Recepción desde Internet]] — MX y usuarios
- [[correo-postfix-instalacion|Instalación de Postfix]] — Configuración base

## Fuentes
- [Alias, Redirecciones y Usuarios Virtuales](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo3/alias.md) — Detalles técnicos
