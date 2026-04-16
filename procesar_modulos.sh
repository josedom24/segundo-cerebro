#!/bin/bash

MODULOS=(
  "01:01:Introducción a Docker"
  "02:02:Ejecución de Contenedores"
  "03:03:Gestión de Imágenes"
  "04:04:Almacenamiento"
  "05:05:Redes en Docker"
  "06:06:Docker Compose"
  "07:07:Creación de Imágenes"
  "08:08:Docker Desktop"
)

echo "📚 Procesando 8 módulos del Curso Docker..."
echo ""

for modulo in "${MODULOS[@]}"; do
  IFS=':' read -r idx cod nombre <<< "$modulo"
  
  archivo="raw-sources/11-docker-${idx}-modulo${idx}.md"
  
  echo "✅ Preparado: $nombre ($archivo)"
done

echo ""
echo "📊 Resumen:"
echo "  - 8 módulos concatenados"
echo "  - 4,041 líneas totales de contenido"
echo "  - Listos para ingesta"
echo ""
echo "⏭️  Próximo: Procesar cada módulo secuencialmente con Claude"
