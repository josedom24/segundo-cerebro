---
title: Direcciones de Correo Electrónico
created: 2026-04-19
updated: 2026-04-19
sources: [curso_correo_electronico_ies]
tags: [correo, direcciones, usuarios]
---

# Direcciones de Correo Electrónico

## Resumen de una línea
Estructura y formato de las direcciones de correo electrónico: usuarios, dominios y convenciones.

## Estructura

### Partes de una Dirección
```
usuario@dominio.com
└─┬──┘ └────┬─────┘
  │         └─ Dominio (servidor de correo)
  └─ Usuario (buzón local o virtual)
```

### Formato Estándar
- **Usuario:** Conjunto de caracteres válidos (letras, números, puntos, guiones)
- **@:** Separador obligatorio
- **Dominio:** Nombre de dominio válido con extensión (TLD)

### Usuarios Especiales
- **root:** Usuario administrador (buzón raíz del sistema)
- **postmaster:** Cuenta obligatoria para administración de correo
- **abuse:** Contacto para reportar abuso
- **noreply:** Usuario para correos automatizados (no lee respuestas)

## Validación de Dirección

La validez técnica requiere:
1. Sintaxis correcta (usuario@dominio)
2. Dominio resuelve en DNS (registros MX o A)
3. Servidor acepta el usuario (local o virtual)

## Relaciones

### Conecta con
- [[correo-conceptos-basicos|Conceptos de Correo Electrónico]] — Cómo se usan direcciones
- [[correo-alias-redirecciones|Alias y Redirecciones]] — Usuarios virtuales y aliases

## Fuentes
- [Direcciones de Correo Electrónico](https://github.com/josedom24/curso_correo_electronico_ies/blob/main/modulo1/direcciones.md) — Estructura técnica
