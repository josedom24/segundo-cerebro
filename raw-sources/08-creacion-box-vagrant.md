# Creación de un box para Vagrant

**Fecha:** 20 de septiembre de 2025  
**URL:** https://www.josedomingo.org/pledin/2025/09/creacion-box-vagrant/

## Resumen Ejecutivo

Proceso completo para crear una imagen personalizada (box) de Debian 13 compatible con Vagrant usando libvirt como proveedor de virtualización.

## Desafío Inicial

Intentó crear una imagen desde cero pero enfrentó problemas con:
- [[|Configuración de red
- [[|Resolución de nombres DNS
- [[|Compatibilidad con Vagrant

## Solución Adoptada

Comenzar desde la box oficial "debian/bookworm64" y actualizarla a Debian 13, garantizando compatibilidad verificada.

## Proceso de Actualización

**Pasos clave:**
- [[|Partir de Debian 12 (Bookworm)
- [[|Modificar repositorios cambiando "bookworm" a "trixie"
- [[|Ejecutar `apt full-upgrade`
- [[|Limpieza del sistema

## Preparación para Conversión

- [[|Instalar utilidades necesarias (curl)
- [[|Reemplazar claves SSH con la "clave pública estándar de Vagrant"
- [[|Limpiar archivos temporales
- [[|Llenar espacio libre con ceros para optimizar compresión

## Conversión Técnica

El box requiere tres componentes empaquetados:
- `box.img`: Imagen comprimida
- `metadata.json`: Información del proveedor
- `Vagrantfile`: Configuración base

## Distribución

Publica el resultado en el Vagrant Box Registry oficial, permitiendo acceso comunitario mediante:
```bash
vagrant init josedom24/debian13
```
