# Módulo 04: Almacenamiento

**Fuente:** Curso Docker 2024 - modulo4
**Autor:** José Domingo González López
**URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo4
**URL GitHub:** https://github.com/josedom24/curso_docker_ow



---

# Almacenamiento en Docker

![docker](img/almacenamiento.png)

Ante la situación anteriormente descrita, Docker nos proporciona varias soluciones para persistir los datos de los contenedores. Las opciones que nos ofrece Docker para gestionar el almacenamiento de los contenedores son:

* Los **volúmenes Docker**.
* Los **bind mount**.
* Los **tmpfs mounts**.


## Volúmenes Docker

* Los volúmenes son creados y gestionados por Docker.
* Un volumen corresponde a un directorio en el Host Docker, por tanto, la información se almacena en una parte del sistema de ficheros que es gestionada por Docker.
* Cuando se usa un volumen en un contenedor, el directorio correspondiente se monta en el sistema de archivo del contenedor.
* En sistemas Linux, los volúmenes se crean en `/var/lib/docker/volumes/`.
* Los procesos ajenos a Docker no deben modificar esta parte del sistema de archivos.
* Un volumen dado puede ser montado en múltiples contenedores simultáneamente. 
* Cuando ningún contenedor en ejecución está utilizando un volumen, el volumen sigue estando disponible para Docker y no se elimina automáticamente. 
* Cuando creas un volumen, puede tener nombre o ser anónimo. 
* A los volúmenes anónimos se les da un nombre aleatorio que se garantiza que sea único dentro de un Host Docker dado. 
* La gestión de los volúmenes se hace con el comando `docker volume`.

## Bind Mount

* Nos permite que un archivo o directorio del Host Docker se monte en un contenedor.
* El archivo o directorio es referenciado por su ruta completa en el Host Docker.
* No es necesario que el archivo o directorio ya exista en el Host Docker. Se crea bajo demanda si aún no existe.
* No puedes utilizar el cliente Docker para gestionarlos.
* Al realizar cambios sobre los ficheros del bind mount en el anfitrión, se cambian directamente en el contenedor.

## tmpfs mounts

* Un montaje tmpfs no persiste en disco, ni en el Host Docker ni dentro de un contenedor. 
* Puede ser utilizado por un contenedor durante la vida útil del contenedor, para almacenar el estado no persistente o información sensible.

## Cuando usar volúmenes Docker

* Compartir datos entre múltiples contenedores en ejecución.
* Cuando no se garantiza que el Host Docker tenga una determinada estructura de directorios o archivos. Los volúmenes te ayudan a desacoplar la configuración del Host Docker del tiempo de ejecución del contenedor.
* Cuando desea almacenar los datos de su contenedor en un servidor remoto o en un proveedor de nube.
* Cuando necesites hacer copias de seguridad, restaurar o migrar datos de un Host Docker a otro, los volúmenes son una mejor opción, ya que simplemente debes copiar el directorio `/var/lib/docker/volumes/<nombre-volumen>`.

## Cuando usar bind mounts

* Compartir archivos de configuración desde la máquina anfitriona a los contenedores.
* Compartir código fuente o artefactos de construcción entre un entorno de desarrollo en el Host Docker y un contenedor.
* Cuando hay necesidad de que otras aplicaciones que no sean Docker tengan acceso a esos ficheros, ya sean código, ficheros etc...

## Aspectos a tener en cuenta en el uso de volúmenes o bind mount

* Si montas un volumen vacío en un directorio del contenedor en el que existen archivos o directorios, estos archivos o directorios se propagan (copian) al volumen. 
* Del mismo modo, si inicias un contenedor y especificas un volumen que aún no existe, se creará un volumen vacío para ti. 
* Si montas un bind mount o un volumen no vacío en un directorio del contenedor en el que existen algunos archivos o directorios, estos archivos o directorios quedan ocultos por el montaje.

## Uso de almacenamiento en contenedores

En la creación de contenedores con `docker run` puedo indicar que vamos a usar almacenamiento para guardar la información de ciertos directorios. Tanto en el caso de uso de volúmenes como en el caso del uso de bind mount podemos indicar el uso de almacenamiento en la creación de un contenedor con las siguientes parámetros del comando `docker run`:

* El parámetro `--volume` o `-v`
* El parámetro `--mount`

En general, `--mount` es más explícito y detallado. La mayor diferencia es que la sintaxis `-v` combina todas las opciones en un solo campo, mientras que la sintaxis `--mount` las separa.

* Si usamos `-v` se debe indicar tres campos separados por dos puntos:
    * El primer campo es el nombre del volumen, debe ser único en una determinada máquina. Para volúmenes anónimos, el primer campo se omite.
    * El segundo campo es la ruta donde se montan el archivo o directorio en el contenedor.
    * El tercer campo es opcional, y es una lista de opciones separadas por comas. Por ejemplo podemos indicar `ro` para configurar el montaje sólo de lectura.
* Si usamos `--mount` hay que indicar un conjunto de datos de la forma `clave=valor`, separados por coma.
    * Clave `type`: Indica el tipo de montaje. Los valores pueden ser `bind`, `volume` o `tmpfs`.
    * Clave `source` o `src`: La fuente del montaje. Se indica el volumen o el directorio que se va montar con bind mount.
    * Clave `dst` o `target`: Será la ruta donde está montado el fichero o directorio en el contenedor. 
    * La opción `readonly` o `ro` es optativa, e indica que el montaje es de sólo lectura.
    * La clave `volume-opt` para indicar opciones más específicas del montaje.


## ¿Qué información tenemos que guardar?

¿Qué debemos guardar de forma persistente en un contenedor?

* Los datos de la aplicación.
* Los logs del servicio.
* La configuración del servicio. En este caso podemos añadirla a la imagen, pero será necesaria la creación de una nueva imagen si cambiamos la configuración. Si la guardamos en un volumen hay que tener en cuanta que ese fichero lo tenemos que tener en el entorno de producción (puede ser bueno, porque las configuraciones de los distintos entornos puede variar).




---

# Asociando almacenamiento a los contenedores: bind mount

## Creación de contenedores con bind mount

En este caso, vamos a crear un directorio en el sistema de archivos del Host Docker, donde vamos a crear un fichero `index.html`:

```bash
$ mkdir web
$ cd web
/web$ echo "<h1>Hola</h1>" > index.html
```

Y podemos montar ese directorio en un contenedor, en este caso usamos la opción `-v`:

```bash
$ docker run -d --name my-apache-app -v /home/usuario/web:/usr/local/apache2/htdocs -p 8080:80 httpd:2.4
```

Podemos comprobar en la información del contenedor los puntos de montaje que tiene configurado:

```bash
$ docker inspect --format='{{json .Mounts}}' my-apache-app 
[{"Type":"bind","Source":"/home/usuario/web","Destination":"/usr/local/apache2/htdocs","Mode":"","RW":true,"Propagation":"rprivate"}]
```

Y comprobamos que realmente estamos sirviendo el fichero que tenemos en el directorio que hemos creado.

```bash
$ curl http://localhost:8080
<h1>Hola</h1>
```

Eliminamos el contenedor y volvemos a crear otro con el directorio montado, ahora usando la opción `--mount`:

```bash
$ docker rm -f my-apache-app 
my-apache-app

$ docker run -d --name my-apache-app --mount type=bind,src=/home/usuario/web,dst=/usr/local/apache2/htdocs -p 8080:80 httpd:2.4

$ curl http://localhost:8080
<h1>Hola</h1>
```

Además, podemos comprobar que al modificar el contenido del fichero se modificará en el contenedor:

```bash
$ echo "<h1>Adios</h1>" > web/index.html 
$ curl http://localhost:8080
<h1>Adios</h1>
```

Por último, indicar que si nuestro directorio origen no existe y hacemos un bind mount con `-v`, se creará, pero lo que tendremos en el contenedor será un directorio vacío. Sin embargo, si hacemos un bind mount con la opción `--mount` nos dará un error.


---

# Los contenedores son efímeros

**Los contenedores son efímeros**, es decir, los ficheros, datos y configuraciones que creamos en los contenedores sobreviven a las paradas de los mismos pero, sin embargo, son destruidos si el contenedor es destruido. 

Veamos un ejemplo:

```bash
$ docker run -d --name my-apache-app -p 8080:80 httpd:2.4
ac50cc24ef71ae0263be7794278600d5cc4f085b88cebbf97b7b268212f2a82f
    
$ docker exec my-apache-app bash -c 'echo "<h1>Hola</h1>" > /usr/local/apache2/htdocs/index.html'
    
$ curl http://localhost:8080
<h1>Hola</h1>
    
$ docker rm -f my-apache-app
my-apache-app
    
$ docker run -d --name my-apache-app -p 8080:80 httpd:2.4
bb94716205c780ec4a3a2695722fb35ac616ae4cea573308d9446208afb164dc
    
$ curl http://localhost:8080
<html><body><h1>It works!</h1></body></html>
```

Vemos como al eliminar el contenedor, la información que habíamos guardado en el fichero `index.html` se pierde, y al crear un nuevo contenedor ese fichero tendrá el contenido original.

Docker nos ofrece diferentes mecanismos para hacer persistentes los contenedores y no perder los datos de nuestras aplicaciones.
---

# Ejemplo 2: Contenedor MariaDB con almacenamiento persistente

Si estudiamos la documentación de la imagen [`mariadb`](https://hub.docker.com/_/mariadb) en Docker Hub, nos indica que la información que hay que guardar de la base de datos se encuentra en el directorio `/var/lib/mysql`. Por lo tanto si queremos crear una contenedor de MariaDB donde no se pierda los datos de la base de datos, debemos ejecutar:

```bash
$ docker run --name some-mariadb -v /opt/mariadb:/var/lib/mysql -e MARIADB_ROOT_PASSWORD=my-secret-pw -d mariadb:10.5
```
Es decir se va a crear un directorio `/opt/mariadb` en el Host Docker, donde se va a guardar la información de la base de datos. Si tenemos que crear de nuevo el contenedor indicaremos ese directorio como bind mount y volveremos a tener accesible la información.

```bash
$ cd /opt/mariadb
opt/mariadb$ ls
aria_log.00000001  aria_log_control  ib_buffer_pool  ib_logfile0  ibdata1  ibtmp1  multi-master.info  mysql  performance_schema

$ docker exec -it some-mariadb bash -c 'mysql -u root -p$MARIADB_ROOT_PASSWORD'
...
MariaDB [(none)]> create database prueba;
MariaDB [(none)]> quit

$ docker rm -f some-mariadb 
some-mariadb

$ docker run --name some-mariadb --mount type=bind,src=/opt/mariadb,dst=/var/lib/mysql -e MARIADB_ROOT_PASSWORD=my-secret-pw -d mariadb:10.5

$ docker exec -it some-mariadb bash -c 'mysql -u root -p$MARIADB_ROOT_PASSWORD'
...
MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| prueba             |
+--------------------+
4 rows in set (0.003 sec)
```

Para terminar indicar que aunque este ejercicio lo hemos realizado usando bind mount, también podríamos usar volúmenes Docker. En este caso la instrucción de creación del contenedor sería la siguiente:

```bash
$ docker run --name some-mariadb --mount type=volume,src=vol_mariadb,dst=/var/lib/mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mariadb:10.5
```

Recuerda que con el parámetro `--mount` se crea el volumen indicado si no estaba creado, sin embargo nos da un error si al usar bind mount no existe el directorio que indicamos en el parámetro `src`.


---

# Ejemplo 1: Contenedor NextCloud con almacenamiento persistente

[NextCloud](https://nextcloud.com/es/) en una aplicación escrita en PHP que nos posibilita construir una nube privada para guardar nuestros archivos, además de tener otros servicios como agenda, calendario, ...

Vamos a desplegar un contenedor con NextCloud, para simplificar la instalación vamos hacer uso de una base de datos SQLite. Si estudiamos la documentación de la imagen [`nextcloud`](https://hub.docker.com/_/nextcloud) en Docker Hub, la forma más sencilla de no perder la información es crear un volumen para guardar el directorio `/var/www/html` del contenedor. Vamos a realizar el ejercicio usando volúmenes Docker y bind mount.

## Ejemplo con volúmenes

Creamos un volumen:

```bash
$ docker volume create nextcloud
nextcloud
```

Y creamos el contenedor, guardando el directorio `/var/www/html` del contenedor en el volumen creado, con el parámetro `-v`:

```bash
$ docker run -d -p 80:80  -v nextcloud:/var/www/html --name contenedor_nextcloud nextcloud:28.0.1
```

Comprobamos que podemos acceder, terminamos de configurar la aplicación y una vez operativa subimos un ficheros a la aplicación.

A continuación eliminamos el contenedor y creamos uno nuevo con el mismo volumen, ahora usando el parámetro `--mount`::

```bash
$ docker rm -f contenedor_nextcloud

$ docker run -d -p 80:80  --mount type=volume,src=nextcloud,dst=/var/www/html --name contenedor_nextcloud nextcloud:28.0.1
```
Accediendo de nuevo a la aplicación podemos comprobar que la aplicación sigue configurada y que los ficheros subidos no se han perdido.

## Ejemplo con bind mount

En este caso, vamos a crear un directorio en nuestro ordenador, que es el que vamos a montar en el contenedor:

```bash
mkdir /opt/datos_nextcloud
```

Y creamos el contenedor usando el parámetro `-v`:

```bash
$ docker run -d -p 80:80 -v /opt/datos_nextcloud:/var/www/html --name contenedor_nextcloud nextcloud:28.0.1
```

También podríamos usar el parámetro `--mount`:

```bash
$ docker run -d -p 80:80 --mount type=bind,src=/opt/datos_nextcloud,dst=/var/www/html --name contenedor_nextcloud nextcloud:28.0.1
```

Volvemos a acceder, configuramos la aplicación y subimos algún fichero.

Usando bind mount tenemos acceso al directorio:

```bash
$ cd datos_nextcloud/
~/datos_nextcloud$ ls
3rdparty  COPYING  config       core      custom_apps  index.html  lib  ocm-provider  ocs-provider  remote.php  robots.txt  themes
AUTHORS   apps     console.php  cron.php  data         index.php   occ  ocs           public.php    resources   status.php  version.php
```

Podemos comprobar que al eliminar el contenedor y crearlo de nuevo usando el mismo directorio bind mount, toda la configuración y los ficheros subidos no se han perdido.
---

# Otros usos del almacenamiento en Docker

En los ejemplos anteriores hemos usado los volúmenes como copia de seguridad de la información, para hacer persistente los contenedores. En este apartado vamos a ver dos ejemplos explicando otros dos usos que le podemos dar al almacenamiento en Docker.

## Compartir información entre contenedores

En este caso vamos a usar un volumen o bind mount para compartir información entre dos contenedores. Si seguimos el principio de que un contenedor tiene que ejecutar un sólo proceso, en ocasiones nos puede hacer falta que otro contenedor haga una operación auxiliar y genere una información que compartirá con el primero por medio de almacenamiento que estará montado en los dos contenedores.

Un ejemplo podría ser un servicio web que está ofreciendo información que tiene que ir leyendo de un repositorio Git. En este caso podríamos poner un contenedor secundario que cada cierto tiempo leyera el repositorio y le pasara la información al primer contenedor por medio de almacenamiento compartido.

En nuestro ejemplo vamos a hacer algo mucho más sencillo: el contenedor principal es un servidor web que ofrece un fichero `index.html` y este fichero se va actualizando por el segundo contenedor, que en el ejemplo lo único que va a hacer es escribir la fecha y la hora cada segundo en ese fichero. Vemos el ejemplo usando volúmenes Docker:

Lo primero creamos el volumen:

```bash
$ docker volume create datos_compartidos
```

Creamos el primer contenedor con el volumen montado en el *DocumentRoot* del servidor web y el tipo de acceso **solo lectura**, opción `ro`:

```bash
$ docker run -d -p 8081:80 --name contenedor1 -v datos_compartidos:/var/www/html:ro php:7.4-apache
```

A continuación creamos el segundo contenedor con un proceso que va a modificar el fichero `index.html` que guarda en el volumen cada un segundo:

```bash
$ docker run -d  --name contenedor2 --mount type=volume,src=datos_compartidos,dst=/srv debian bash -c "while true; do date >> /srv/index.html;sleep 1;done"
```

Accedemos al puerto 8081/tcp del Host Docker y comprobamos cómo se va actualizando el fichero `index.html`.

Lo podríamos hacer también con bind mount:

```bash
$ docker run -d -p 8081:80 --name contenedor1 -v /opt/compartido:/var/www/html:ro php:7.4-apache
$ docker run -d  --name contenedor2 -v /opt/compartido:/srv debian bash -c "while true; do date >> /srv/index.html;sleep 1;done"
```

Y podríamos ver el contenido del fichero `/opt/compartido/index.html`.


## Comprobar compatibilidad de código entre distintas versiones de un lenguaje de programación

Otro utilidad que le podemos dar al almacenamiento, en este caso a los bind mount, es la posibilidad de comprobar la compatibilidad de un código en diferentes versiones de un lenguaje de programación.

Veamos un ejemplo en PHP: imaginemos que tenemos un código que es compatible y funciona bien en PHP5 y queremos comprobar como se comporta en la versión PHP7. 

Siguiendo la documentación [Migración de PHP 5.6.x a PHP 7.0.x](https://www.php.net/manual/es/migration70.php), he escogido la función [list](https://www.php.net/manual/es/function.list.php) que se comporta de manera distinta en PHP5 que en PHP7: en PHP5, `list()` asigna los valores empezando desde el parámetro más a la derecha y en PHP7, empieza desde el parámetro más a la izquierda. 

Imaginemos que tenemos un directorio `/opt/codigo` con nuestra aplicación `index.php`:

```php
<?php
echo 'Versión actual de PHP: ' . phpversion(). "<br/>";

// Funciona bien en php5 ya que list hace la asignación desde el último al primero
$info = array('cafeína','marrón', 'café');

// Enumerar todas las variables
list($datos[], $datos[], $datos[]) = $info;
echo "El $datos[0] es $datos[1] y la $datos[2] lo hace especial.\n";
?>
```

A continuación vamos a crear dos contenedores que sirvan este código usando imágenes distintas , para cada versión de PHP y usando puertos distintos para acceder a cada versión de la aplicación:

```bash
$ docker run -d -p 8082:80 --name php56 -v /opt/codigo:/var/www/html:ro php:5.6-apache
$ docker run -d -p 8083:80 --name php74 -v /opt/codigo:/var/www/html:ro php:7.4-apache
```

Y ya podemos acceder a las dos aplicaciones que hemos desplegado y comprobar cómo se comportan según la versión de PHP que hemos usado.
---

# Asociando almacenamiento a los contenedores: volúmenes Docker

Antes de usar volúmenes Docker en contenedores para hacer persistir sus datos, vamos a estudiar como podemos gestionar los volúmenes.

## Gestionando volúmenes

Algunos comando útiles para trabajar con volúmenes Docker, son los siguientes.

Podemos crear un volumen indicando su nombre:

```bash
$ docker volume create my-vol
```

Para listar los volúmenes que tenemos creados:

```bash
$ docker volume ls
...
local               my-vol
```

Para obtener información de un volumen:

```bash
$ docker volume inspect my-vol
[
    {
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/my-vol/_data",
        "Name": "my-vol",
        "Options": {},
        "Scope": "local"
    }
]
```

Y para eliminar un volumen, ejecutamos:

```bash
$ docker volume rm my-vol
```


## Creación de contenedores con volúmenes

Lo primero que vamos a hacer es crear un volumen Docker:

```bash
$ docker volume create miweb
miweb
```

A continuación, creamos un contenedor con el volumen asociado, usando el parámetro `--mount`. En este ejemplo vamos a montar nuestro volumen en el directorio *DocumentRoot* del servidor Apache que nos ofrece la imagen `httpd:2.4` (en la documentación de la imagen se nos indica que el directorio *DocumentRoot* es `usr/local/apache2/htdocs`).

```bash
$ docker run -d --name my-apache-app --mount type=volume,src=miweb,dst=/usr/local/apache2/htdocs -p 8080:80 httpd:2.4
```

Podemos comprobar en la información del contenedor los puntos de montajes que tiene configurado:

```bash
$ docker inspect --format='{{json .Mounts}}' my-apache-app 
[{"Type":"volume","Name":"miweb","Source":"/var/lib/docker/volumes/miweb/_data","Destination":"/usr/local/apache2/htdocs","Driver":"local","Mode":"z","RW":true,"Propagation":""}]
```

A continuación, creamos un fichero `index.html` en el directorio donde hemos montado el volumen, por lo tanto esta información no se perderá:

```bash
$ docker exec my-apache-app bash -c 'echo "<h1>Hola</h1>" > /usr/local/apache2/htdocs/index.html'
```

Podemos comprobar el acceso al servidor web usando un navegado web o en este caso usando el comando `curl`:

```bash
$ curl http://localhost:8080
<h1>Hola</h1>
```

A continuación borramos el contenedor:

```bash
$ docker rm -f my-apache-app 
my-apache-app
```

Podemos comprobar que el volumen no se ha borrado, ejecutando `docker volume ls`.

Después de borrar el contenedor, volvemos a crear otro contenedor con el mismo volumen asociado, en esta ocasión vamos a usar el parámetro `-v`:

```bash
$ docker run -d --name my-apache-app -v miweb:/usr/local/apache2/htdocs -p 8080:80 httpd:2.4
```

Y podemos comprobar que no no se ha perdido la información (el fichero `index.html`):

```bash
$ curl http://localhost:8080
<h1>Hola</h1>
```

