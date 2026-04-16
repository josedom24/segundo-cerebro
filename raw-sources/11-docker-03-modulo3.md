# Módulo 03: Gestión de Imágenes

**Fuente:** Curso Docker 2024 - modulo3
**Autor:** José Domingo González López
**URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo3
**URL GitHub:** https://github.com/josedom24/curso_docker_ow



---

# Demostración: Almacenamiento de imágenes y contenedores

## Ejemplo de almacenamiento de imágenes

Se ha creado una imagen que hemos subido a **Docker Hub** llamada `josedom24/servidorweb`. Esta imagen ofrece un servidor web sobre un sistema operativo Debian Linux, con una sencilla página web.

Durante el proceso de generación de la imagen:

* Se ha partido de la imagen `debian:stable-slim` (**Pimera capa**).
* Se ha instalado el servidor web Apache (**Segunda capa**).
* La imagen tiene dos versiones. Las versiones están etiquetadas con las etiquetas **v1** y **v2**. Cada versión tiene un fichero `index.html` diferente. (**Tercera capa**).

Vamos a descargar la primera versión de la imagen (suponemos que no tenemos descargada ninguna imagen en nuestro registro local):

```bash
$ docker pull josedom24/servidorweb:v1
v1: Pulling from josedom24/servidorweb
9532dfcb62dd: Pull complete 
209210f58112: Pull complete 
4f6c4ab344d9: Pull complete 
Digest: sha256:5707a7005d440bf32619e27e37800419b2c52644205da3c6a9edb9d55b8c51de
Status: Downloaded newer image for josedom24/servidorweb:v1
docker.io/josedom24/servidorweb:v1
```
Vemos como se han descargado las 3 capas, y que finalmente tenemos una nueva imagen en nuestro registro local:

```bash
$ docker images
REPOSITORY              TAG       IMAGE ID       CREATED      SIZE
josedom24/servidorweb   v1        d0d75af6b8ec   3 days ago   187MB
```

A continuación descargamos la segunda versión de la imagen:

```bash
$ docker pull josedom24/servidorweb:v2
v2: Pulling from josedom24/servidorweb
9532dfcb62dd: Already exists 
209210f58112: Already exists 
274f48ad3e93: Pull complete 
Digest: sha256:9acd8efeb1f0be80c466a7ebb3772e045ffcb6b12cfbfadaa8b7c4b110bd83ea
Status: Downloaded newer image for josedom24/servidorweb:v2
docker.io/josedom24/servidorweb:v2
```

Podemos observar que las dos primeras capas "ya existen", es decir, ya la tenemos almacenadas en nuestro registro, porque son iguales a las capas de la primera versión de la imagen.

Si visualizamos las imágenes:

```bash
$ docker images
REPOSITORY              TAG       IMAGE ID       CREATED      SIZE
josedom24/servidorweb   v2        f558b3613d2c   3 days ago   187MB
josedom24/servidorweb   v1        d0d75af6b8ec   3 days ago   187MB
```

Podemos pensar que se ha ocupado en el disco duro 187Mb + 187 Mb, pero en realidad el espacio ocupado por las dos primeras capas sólo se guarda en el disco una vez, esas capas se comparten entre las dos versiones de la imagen. Esto lo podemos ver de manera más clara ejecutando el siguiente comando:

```bash
docker system df -v
Images space usage:

REPOSITORY              TAG       IMAGE ID       CREATED      SIZE      SHARED SIZE   UNIQUE SIZE   CONTAINERS
josedom24/servidorweb   v2        f558b3613d2c   3 days ago   187MB     186.8MB       25B           0
josedom24/servidorweb   v1        d0d75af6b8ec   3 days ago   187MB     186.8MB       22B           0
```

De los 187 MB que tienen de tamaño las imágenes, 186,8 MB están compartido (este es el tamaño de las dos primeras capas), por lo tanto el espacio ocupado por cada una de las imágenes corresponde a la tercera capa (el fichero `index.html`) que en este caso es 25B  y 22B.

Por lo tanto, ¿cuánto han ocupado en total estas dos imágenes en el disco duro? Pues sería 186,8MB + 25B + 22B.
El mecanismo de compartir capas entre imágenes hace que se ocupe el menor espacio posible en disco duro, el almacenamiento es muy eficiente.

## Ejemplo de almacenamiento de contenedores

Hemos descargado la imagen `ubuntu` y vemos su tamaño:

```bash
$ docker images
REPOSITORY              TAG       IMAGE ID       CREATED       SIZE
ubuntu                  latest    e34e831650c1   2 weeks ago   77.9MB
```

Si creamos un contenedor interactivo:

```bash
$ docker run -it --name contenedor1 ubuntu
```

Nos salimos, y a continuación visualizamos el tamaño ocupado por el contenedor con la opción `-s` (size) del comando `docker ps`:

```bash
$ docker ps -a -s
CONTAINER ID   IMAGE     COMMAND       CREATED          STATUS                     PORTS     NAMES         SIZE
679822aff71a   ubuntu    "/bin/bash"   25 seconds ago   Exited (0) 9 seconds ago             contenedor1   5B (virtual 77.9MB)
```

Vemos que el tamaño real del contenedor es 5B, aunque el sistema de archivos del contenedor (tamaño virtual) es de 77,9MB. Este tamaño es el de la imagen `ubuntu` cuyo sistema de ficheros se comparte con el contenedor.

Si a continuación volvemos a acceder al contenedor y creamos un fichero:

```bash
$ docker start contenedor1
contenedor1
$ docker attach contenedor1
root@a2d1ce6990d8:/# echo "00000000000000000">file.txt
```

Y volvemos a ver el tamaño, vemos que ha crecido con la creación del fichero:

```bash
$ docker ps -a -s
CONTAINER ID   IMAGE     COMMAND       CREATED         STATUS                     PORTS     NAMES         SIZE
679822aff71a   ubuntu    "/bin/bash"   2 minutes ago   Exited (0) 5 seconds ago             contenedor1   62B (virtual 77.9MB)
```

El tamaño del contenedor ha aumentado, en realidad la **Capa del Contenedor** de lectura y escritura ha aumentado ya que hemos creado un nuevo fichero.

Por todo lo que hemos explicado, ahora se entiende  que **no podemos eliminar una imagen cuando tenemos contenedores creados a partir de ella**.

```bash
$ docker rmi ubuntu
Error response from daemon: conflict: unable to remove repository reference "ubuntu" (must force) - container 679822aff71a is using its referenced image e34e831650c1
```


---

# Registro de imágenes: Docker Hub

## Docker Hub

[**Docker Hub**](https://hub.docker.com/) es un registro público de imágenes Docker.

![ ](img/docker2.png)

## Conceptos de Docker Hub

* **Repositorio**: Un repositorio nos permite guardar una imagen. De cada imagen podemos tener distintas versiones. Las **etiquetas** nos permiten identificar cada versión.
* **Usuarios**: Nos podemos dar de alta en **Docker Hub** para subir y distribuir nuestras imágenes.
* El nombre de una imagen tiene el siguiente formato: **usuario/nombre:etiqueta**.
* Las imágenes oficiales en Docker Hub no tienen nombre de usuario.

## Tipos de imágenes

Podemos tener varios tipos de imágenes, según lo que nos ofrece:

* Imágenes que nos ofrecen una **distribución completa de un sistema operativo** (Ubuntu, CentOs, Debian, Fedora, Alpine,...). La distribución **alpine** nos ofrece un sistema operativo que sólo incluyen los elementos esenciales necesarios para ejecutar una aplicación, por este motivo ocupa muy poco espacio, por lo tanto sus imágenes son muy pequeñas. Además, nos podemos encontrar imágenes de este tipo con la etiqueta **slim**, en este caso serán imágenes más livianas.
    * Ejemplo: **debian:bookworm**, **debian:bookworm-slim**, **ubuntu:22.04**, **alpine:3**.
* Imágenes que nos ofrecen distintos **servicios** (servidor web, servidor de base de datos,...). En este caso las etiquetas suelen indicar la versión y el sistema operativo base que ofrece el servicio.
    * Ejemplo: **http:2.4-bookworm**, **http:2.4-alpine**, **mariadb:11.2-jammy**, **mariadb:10.6-focal**.
* Imágenes que ofrecen **lenguajes de programación** (PHP, Python, Java, NodeJS,...). En este caso la etiqueta nos puede indicar la versión, el sistema operativo base que se utiliza, el servicio que se está ofreciendo.
    * Ejemplo: **php:bookworm**, **php:fpm-bookworm**, **python:3.12-slim-bookworm**, **openjdk:23-ea-6-jdk-bookworm**.
* Imágenes que ofrecen un CMS completo (WordPress, NextCloud, Drupal,...). Como en el caso anterior, las etiquetas nos informan de la versión, del sistema operativo, del servicio ofrecido,...
    * Ejemplos: **wordpress:6.4.2-php8.1-apache**, **wordpress:6.4.2-php8.1-fpm**, **wordpress:6.4.2-fpm-alpine**.


## Contenido de confianza

![ ](img/official-image-badge-iso.png)

* **Imágenes oficiales Docker**: Son mantenidas y distribuidas directamente por Docker, Inc. Son confiables, bien mantenidas y son una opción segura para utilizar en entornos de producción.

![ ](img/verified-publisher-badge-iso.png)

* **Editor verificado Docker**: Las imágenes que tienen este logotipo, son proporcionadas por usuarios verificados por Docker. Estas imágenes se caracterizan por su actualización continúa para evitar problemas de seguridad.

![ ](img/sponsored-badge-iso.png)

* **Imágenes de código abierto patrocinadas por Docker**: Estas imágenes son publicadas y mantenidas por proyectos de código abierto patrocinados por Docker.

## Introducción a la interfaz web de Docker Hub

Podemos acceder al registro público de imágenes Docker **Docker Hub** en el enlace: [https://hub.docker.com](https://hub.docker.com).

![ ](img/dockerhub.png)

Podemos observar varios elementos:

1. Un formulario de búsqueda, que nos permite buscar imágenes por palabras.
2. Si tenemos muchos resultados tenemos la opción de filtrar la búsqueda por tipo de producto, contenido de confianza, sistema operativo y arquitectura.
3. Al hacer la búsqueda obtenemos una lista de **repositorios**. Cada repositorio puede almacenar distintas versiones de una misma imagen.
4. Podemos darnos de alta en Docker Hub, para gestionar nuestras propias imágenes. 

Si accedemos a un repositorio, visualizaremos la documentación de la imagen (pestaña **Overview**). Iremos estudiando detenidamente la documentación de varias imágenes, pero los apartados más comunes que nos encontramos son los siguientes:

* Descripción de la aplicación o servicio ofrecido por la imagen.
* Etiquetas con las que podemos trabajar en esta imagen.
* Ejemplos de cómo crear contenedores a partir de esta imagen.
* Variables de entorno que puedo crear en la creación para configurar el servicio o la aplicación.
* Directorios que debo guardar para hacer el contenedor persistente.
* Ejemplos de ficheros de Docker Compose para gestionar el ciclo de vida de la aplicación.

En la pestaña **Tags** obtenemos una lista de todas las versiones de la imagen para cada uno de los sistemas operativos y arquitecturas.

![ ](img/dockerhub2.png)


---

# Gestión de Imágenes

Para crear un contenedor es necesario usar una imagen que tengamos descargada en nuestro registro local. Por lo tanto al ejecutar `docker run` se comprueba si tenemos la versión indicada de la imagen y si no es así, se procede a su descarga desde **Docker Hub**.

Otra manera de descargar una imagen a nuestro registro local, es usando la instrucción `docker image pull` o la siguiente instrucción:

```bash
$ docker pull nginx:stable
```

Para mostrar las imágenes que tenemos en nuestro registro local podemos usar `docker image ls` o la siguiente instrucción:

```bash
$ docker images
```

Si queremos borrar una imagen, usaremos la instrucción `docker image rm` o la siguiente instrucción:

```bash
$ docker rmi nginx:stable
```

**Nota**: No podemos eliminar una imagen si tenemos algún contenedor creado a partir de ella.

Si queremos buscar imágenes de **Docker Hub** desde la línea de comandos, podemos usar la instrucción:

```bash
$ docker search nginx
```

Por último es posible obtener información detallada sobre una imagen. Para ello usaremos la instrucción `docker image inspect` o de forma abreviada:

```bash
$ docker inspect nginx:stable
```

La información más destacable que podemos ver:

* El id y el checksum de la imagen.
* Los puertos que se exponen al crear un contenedor.
* La arquitectura y el sistema operativo de la imagen.
* El tamaño de la imagen.
* Las variables de entorno definidas en la imagen.
* El comando que ejecuta el contenedor que se cree a partir de la imagen.
* Las capas.
* Y muchas más cosas...

Podemos usar filtros, como en el caso de los contenedores. Por ejemplo, para mostrar el identificador de la imagen, ejecutamos

```bash
$ docker inspect --format='{{.Id}}' nginx:stable
```

Consultar los puertos que expone el contenedor que creemos a a partir de esta imagen:

```bash
$ docker inspect --format='{{range $port,$key := .Config.ExposedPorts}}{{$port}}{{end}}' nginx:stable
```

Consultar el sistema operativo y la arquitectura:

```bash
$ docker inspect --format='{{.Os}} {{.Architecture}}' nginx:stable
```

Consultar las variables de entorno definidas en la imagen:

```bash
$ docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' nginx:stable
```

Y por último, para consultar los identificadores de las capas que forman la imagen:

```bash
$ docker inspect --format='{{range .RootFS.Layers}}{{println .}}{{end}}' nginx:stable
```
---

# Imágenes Docker

## ¿Qué es una imagen Docker?

* Una imagen es una plantilla de sólo lectura con instrucciones para crear un contenedor Docker. 
* Contiene el sistema de fichero que tendrá el contenedor. 
* Además establece el comando que ejecutará el contenedor por defecto. 
* Podemos crear nuestras propias imágenes o utilizar las creadas por otros y publicadas en un registro. 
* Un contenedor es una instancia ejecutable de una imagen. 

## Registro de imágenes

* El Registro Docker es un componente donde se almacena las imágenes Docker.
* Tenemos un **registro local** donde se almacenan las imágenes desde las que vamos a crear contenedores. 
* Existen **registros remotos** que nos permiten distribuir las imágenes.
* Los registros pueden ser **públicos o privados**. 
* El registro público que nos ofrece Docker se llama [**Docker Hub**](https://hub.docker.com/). 

## Nombre de las imágenes

El nombre de una imagen suele estar formado por tres partes:

**usuario/nombre:etiqueta**

* **usuario**: El nombre del usuario que la ha generado. Las imágenes oficiales en Docker Hub no tienen nombre de usuario.
* **nombre**: Nombre significativo de la imagen.
* **etiqueta**: Nos permite versionar las imágenes. De esta manera controlamos los cambios que se van produciendo en ella. Si no indicamos etiqueta, por defecto se usa la etiqueta **latest**, por lo que la mayoría de las imágenes tienen una versión con este nombre.

## Ejemplo de etiquetas para la imagen wikimedia

[**MediaWiki**](https://www.mediawiki.org/wiki/MediaWiki/es) es una aplicación web escrita en PHP que nos permite elaborar una wiki. Si estudiamos la [documentación](https://hub.docker.com/_/mediawiki) de la imagen `mediawiki`, podemos ver las etiquetas disponibles para la imagen que corresponden a versiones distintas de la aplicación. En enero de 2024 serían las siguientes:

![ ](img/mediawiki_versiones.png)

Cada imagen está identificada por un **identificador**. Una misma imagen, puede estar etiquetada por etiquetas diferentes.

Por ejemplo, en la imagen `mediawiki`, las etiquetas `1.41.0`, `1.41`, `stable` y `latest` apuntan a la misma versión de la imagen.

## La etiqueta latest

Si utilizamos el nombre de una imagen sin indicar la etiqueta, se toma por defecto la etiqueta **latest** que suele corresponder a la última versión de la aplicación. En el caso concreto de la imagen `mediawiki`, observamos que la etiqueta `latest` corresponde a la última versión la `1.41`. Es más, podemos usar las siguientes etiquetas para indicar la misma versión: `1.41.0, 1.41, stable, latest`.

## ¿Para que sirvan las etiquetas de las imágenes?

* Normalmente las etiquetas nos permiten **versionar** las imágenes. 
* Podemos seguir observando que algunas etiquetas, nos indican además de la versión, los **servicios que tienen instalada** la imagen, por ejemplo si usamos la etiqueta `1.41.0-fpm` estaremos creando un contenedor con la ultima versión de la aplicación pero que además tendrá un servidor de aplicaciones php-fpm para servir la aplicación.
* Otro ejemplo: si usamos la etiqueta `1.41.0-fpm-alpine`, además de la última versión y que tiene instalado php-fpm, nos indica que **la imagen base** que se ha usado para crear la imagen es una distribución `alpine` que se caracteriza por ser una distribución muy liviana.


---

# Ejemplo: Desplegando la aplicación MediaWiki

[**MediaWiki**](https://www.mediawiki.org/wiki/MediaWiki/es) es una aplicación web escrita en PHP que nos permite elaborar una wiki. En este ejemplo vamos a crear contenedores usando la imagen [`mediawiki`](https://hub.docker.com/_/mediawiki) que encontramos en Docker Hub. 

## Instalación de distintas versiones de la MediaWiki

Vamos a crear distintos contenedores usando etiquetas distintas al indicar el nombre de la imagen, posteriormente accederemos a la aplicación y podremos ver la versión instalada.

En primer lugar vamos a instalar la última versión:

```bash
docker run -d -p 8080:80 --name mediawiki1 mediawiki
```

Si accedemos a la dirección IP de nuestro ordenador, al puerto 8080/tcp, podemos observar que hemos instalado la versión 1.41.0:

![mediawiki](img/mediawiki141.png)

A continuación vamos a instalar otra versión de la MediaWiki, la 1.40.2, creamos otro contenedor con otro nombre y mapeamos otro puerto:

```bash
docker run -d -p 8081:80 --name mediawiki2 mediawiki:1.40.2
```

Si accedemos a la dirección IP de nuestro ordenador, al puerto 8081/tcp, podemos observar que hemos instalado la versión 1.40.2:

![mediawiki](img/mediawiki1402.png)

Y finalmente vamos a instalar otra versión en otro contenedor:

```bash
docker run -d -p 8082:80 --name mediawiki3 mediawiki:1.39.6
```

Si accedemos a la dirección IP de nuestro ordenador, al puerto 8082/tcp, podemos observar que hemos instalado la versión 1.39.6:

![mediawiki](img/mediawiki1396.png)

**Nota: Puedes observar que la primera imagen que se baja, descarga todas las capas, sin embargo al descargar las otras versiones de la imagen, sólo se bajan las capas que difieren de la primera imagen descargada.**
---

# ¿Cómo se organizan las imágenes?

Las imágenes se construyen a partir de **capas ordenadas**. 

## ¿Qué es una capa?

* Puedes pensar en una capa como un conjunto de cambios en el sistema de archivos. 
* En el proceso de creación de las imágenes, los comandos que cambian el sistema de archivos (instalaciones, modificación de ficheros, copiar ficheros,...) producen una nueva capa.
* Cada capa es sólo un conjunto de diferencias con respecto a la capa anterior.
* Cada capa se guarda en un directorio diferente.
* Cuando tomas todas las capas y las apilas, obtienes una nueva imagen que contiene todos los cambios acumulados.
* Si tienes muchas imágenes basadas en capas similares (capas que contienen sistemas operativos similares o ficheros comunes), entonces todas estas capas comunes serán almacenadas sólo una vez.

## ¿Qué ocurre cuando creamos un contenedor?

![ ](img/layers.png)

* Cuando se crea un nuevo contenedor desde una imagen, su sistema de archivos será la unión de todas las capas de la imagen. 
* Las capas de la imagen son únicamente de lectura, por lo que se añade una nueva capa de lectura-escritura. 
* Todos los cambios efectuados al contenedor específico son almacenados en esa capa.
* Esta capa se suele llamar **Capa del Contenedor**.
* Los contenedores son efímeros, por que cuando lo borramos, se borra la capa del contenedor, por lo que se pierde todos sus datos.
* Por lo tanto cuando creamos un contenedor, el almacenamiento en disco es muy pequeño, ya que las capas de la imagen desde las que se ha creado se comparten con el contenedor y la capa del contenedor en un primer momento tiene muy pocos ficheros.
* Si tenemos un contenedor creado a partir de una imagen, **esta imagen no se puede borrar** ya que sus capas forman parte del sistema de archivos del contenedor en ejecución.

![ ](img/layers2.png)

