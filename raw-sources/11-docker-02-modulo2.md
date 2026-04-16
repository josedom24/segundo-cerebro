# Módulo 02: Ejecución de Contenedores

**Fuente:** Curso Docker 2024 - [[|Módulo 2
**Autor:** José Domingo González López
**URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo2
**URL GitHub:** https://github.com/josedom24/curso_docker_ow

---


---

# Ejecución simple de contenedores

En este apartado vamos a crear un contenedor especificando el comando que debe ejecutar a partir de la imagen `ubuntu`.
En este caso vamos a descargar primero la imagen del registro público Docker Hub, y a continuación crearemos el contenedor.

Para descargar una imagen de Docker Hub, ejecutamos el comando `docker pull`:

```bash
$ docker pull ubuntu
Using default tag: latest
latest: Pulling from library/ubuntu
29202e855b20: Pull complete 
Digest: sha256:e6173d4dc55e76b87c4af8db8821b1feae4146dd47341e4d431118c7dd060a74
Status: Downloaded newer image for ubuntu:latest
docker.io/library/ubuntu:latest
```

A continuación, creamos y ejecutamos un nuevo contenedor indicando el comando que va a ejecutar:

```bash
$ docker run ubuntu echo 'Hello world' 
Hello world
```

Comprobamos que el contenedor ha ejecutado el comando que hemos indicado y se ha parado:

```bash
$ docker ps -a
CONTAINER ID        IMAGE              COMMAND                  CREATED               STATUS                      PORTS               NAMES
3bbf39d0ec26        ubuntu             "echo 'Hello wo…"        31 seconds ago        Exited (0) 29 seconds ago                       wizardly_edison
```

Los contenedores que hemos creado se nombran de manera aleatoria. Podemos cambiar el nombre de cualquier contenedor usando el comando `docker rename`:

```bash
$ docker rename wizardly_edison contenedor_ubuntu
```

Y comprobamos que el nombre ha cambiado:

```bash
$ docker ps -a
CONTAINER ID   IMAGE     COMMAND                CREATED         STATUS                     PORTS     NAMES
5bd9366588ef   ubuntu    "echo 'Hello world'"   6 minutes ago   Exited (0) 5 minutes ago             contenedor_ubuntu
```

## Visualizando las imágenes de nuestro registro local

Con el comando `docker images` (también se puede usar `docker image ls`, `docker image list`) podemos visualizar las imágenes que ya tenemos descargadas en nuestro registro local:

```bash
$ docker images
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
ubuntu        latest    e34e831650c1   11 days ago    77.9MB
hello-world   latest    d2c94e258dcb   8 months ago   13.3kB
```

## ¿Qué ocurre cuando creamos un contenedor?

Para terminar podemos ver las distintas etapas por las que pasa la creación de un contenedor ejecutando `docker events`. Para ello en una terminal ejecutamos el comando:

```bash
$ docker events
```

Y en otro terminal ejecutamos un contenedor:

```bash
$ docker run ubuntu echo 'Hello world' 
```

En el primer terminal veremos las operaciones que se han dio produciendo:

```
2024-01-22T21:08:37.947946863+01:00 container create 6167a0dbc036143fcd9d3b2783f6d507fbd72900622f8929a5424dee9264e9f5 (image=ubuntu, name=loving_jennings, org.opencontainers.image.ref.name=ubuntu, org.opencontainers.image.version=22.04)
2024-01-22T21:08:37.953203114+01:00 container attach 6167a0dbc036143fcd9d3b2783f6d507fbd72900622f8929a5424dee9264e9f5 (image=ubuntu, name=loving_jennings, org.opencontainers.image.ref.name=ubuntu, org.opencontainers.image.version=22.04)
2024-01-22T21:08:38.310303971+01:00 network connect 7e6404027e1ec38230c4dc35f40079c6f6366cd61d73a472517e39f598cebab1 (container=6167a0dbc036143fcd9d3b2783f6d507fbd72900622f8929a5424dee9264e9f5, name=bridge, type=bridge)
2024-01-22T21:08:38.966836361+01:00 container start 6167a0dbc036143fcd9d3b2783f6d507fbd72900622f8929a5424dee9264e9f5 (image=ubuntu, name=loving_jennings, org.opencontainers.image.ref.name=ubuntu, org.opencontainers.image.version=22.04)
2024-01-22T21:08:39.392255443+01:00 network disconnect 7e6404027e1ec38230c4dc35f40079c6f6366cd61d73a472517e39f598cebab1 (container=6167a0dbc036143fcd9d3b2783f6d507fbd72900622f8929a5424dee9264e9f5, name=bridge, type=bridge)
2024-01-22T21:08:40.227050098+01:00 container die 6167a0dbc036143fcd9d3b2783f6d507fbd72900622f8929a5424dee9264e9f5 (execDuration=0, exitCode=0, image=ubuntu, name=loving_jennings, org.opencontainers.image.ref.name=ubuntu, org.opencontainers.image.version=22.04)
```
---

# Gestión de contenedores Docker

## Ciclo de vida de los contenedores

Para ver un ejemplo de los comandos que gestionan el ciclo de vida de un contenedor vamos a ejecutar un contenedor demonio que va escribiendo la hora cada segundo, para ver la salida visualizamos sus logs:

```bash
$ docker run -d --name hora-container ubuntu bash -c 'while true; do echo $(date +"%T"); sleep 1; done'
$ docker logs -f hora-container
```
En otra terminal vamos ejecutando los comandos que nos permiten controlar su ciclo de vida:

* `docker start`: Inicia la ejecución de un contenedor que está parado.
* `docker stop`: Detiene la ejecución de un contenedor en ejecución.
* `docker restart`: Para y vuelve a iniciar la ejecución de un contenedor.
* `docker pause`: Pausa la ejecución de un contenedor.
* `docker unpause`: Continúa la ejecución de un contenedor que estaba pausado..


## Ejecución de comandos en contenedores

Si tenemos un contenedor que está iniciado, podemos ejecutar comandos en él con `docker exec`. En esta ocasión vamos a crear un contenedor que hace algo parecido al anterior, pero en este caso guarda la hora en un fichero cada segundo:

```bash
$ docker run -d --name hora-container2 ubuntu bash -c 'while true; do date +"%T" >> hora.txt; sleep 1; done'
$ docker exec hora-container2 ls
...
hora.txt
...
$  docker exec hora-container2 cat hora.txt
```

## Copiar ficheros en contenedores

Con el comando `docker cp` podemos copiar ficheros a o desde un contenedor. Por ejemplo, si tengo un fichero en mi equipo lo puedo copiar al contenedor:

```bash
$ echo "Curso Docker">docker.txt
$ docker cp docker.txt hora-container2:/tmp
Successfully copied 2.05kB to hora-container2:/tmp
```

Podemos comprobar que el fichero existe en el contenedor:

```bash
$ docker exec hora-container2 cat /tmp/docker.txt
Curso Docker
```

Evidentemente, también podemos copiar ficheros desde el contenedor a nuestro equipo:

```bash
docker cp hora-container2:hora.txt .
Successfully copied 5.63kB to /home/usuario/.
```

## Visualizar procesos que se ejecutan en un contenedor

Podemos visualizar los procesos que se están ejecutando en un contenedor con el comando `docker top`:

```bash
$ docker top hora-container2
```

## Obtener información de los contenedores

Para obtener información de cualquier objeto Docker vamos a usar el subcomando `inspect`. En el caso de los contenedores, ejecutamos:

```bash
$ docker inspect hora-container2
```

Nos muestra mucha información en formato JSON (JavaScript Object Notation) y nos da datos sobre aspectos como:

* El id del contenedor.
* Los puertos abiertos y sus redirecciones.
* Los bind mounts y volúmenes usados.
* El tamaño del contenedor (si ejecutamos `docker inspect -s`).
* La configuración de red del contenedor.
* El comando que se esta ejecutando en el contenedor.
* El valor de las variables de entorno.
* Y muchas más cosas....

Como nos devuelve mucha información podemos filtrar los campos que nos interesan, por ejemplo:

El identificado del contenedor:

```bash
$ docker inspect --format='{{.Id}}' hora-container2
```

El nombre de la imagen que hemos usado para crear el contenedor:

```bash
$ docker inspect --format='{{.Config.Image}}' hora-container2
```

El valor de las variables de entorno definidas en el contenedor:

```bash
$ docker container inspect -f '{{range .Config.Env}}{{println .}}{{end}}' hora-container2
```

El comando que hemos ejecutado en el contenedor:

```bash
$ docker inspect --format='{{range .Config.Cmd}}{{println .}}{{end}}' hora-container2
```

La dirección IP que tiene el contenedor:

```bash
$ docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' hora-container2
```








---

# El "Hola Mundo" de Docker

Vamos a crear nuestro primer contenedor, para comprobar que todo está funcionando y vamos a explicar el proceso que se va a realizar en la creación del contenedor.  

```bash
$ docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
719385e32844: Pull complete 
Digest: sha256:a13ec89cdf897b3e551bd9f89d499db6ff3a7f44c5b9eb8bca40da20eb4ea1fa
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

Pero, ¿qué es lo que está sucediendo al ejecutar esa orden?:

1. El cliente Docker se conecta al demonio Docker y le indica que debe crear un contenedor (`docker run`).
2. Al ser la primera vez que se ejecuta un contenedor basado en la imagen `hello-word`, la imagen se descarga del registro público llamado Docker Hub y se guarda en nuestro registro local.
3. Se crea el contenedor que ejecuta un comando que muestra el mensaje que hemos leído.
4. El mensaje se envía al cliente Docker que nos lo muestra en el terminal.

**NOTA**: En realidad todas los comandos del cliente Docker que trabajan con contenedores son subcomandos de `docker container`, pero se puede abreviar omitiendo el comando `container`, es decir estos dos comandos son iguales:

```bash
$ docker container run ...
$ docker run...
```

Si listamos los contenedores que se están ejecutando (`docker ps`):

```bash
$ docker ps
CONTAINER ID   IMAGE         COMMAND    CREATED         STATUS    PORTS     NAMES

```
Comprobamos que este contenedor no se está ejecutando. **Un contenedor ejecuta un proceso y cuando termina la ejecución, el contenedor se para.**

Para ver los contenedores que no se están ejecutando (observa que se ha asignado un nombre aleatorio al contenedor), ejecutamos:

```bash
$ docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED          STATUS                    PORTS     NAMES
e5ea0c675f71   hello-world   "/hello"   31 seconds ago   Exited (0) 29 seconds ago           quirky_hellman
```

Como podemos observar el script que ha ejecutado el contenedor se llama `/hello`.

Para eliminar el contenedor podemos identificarlo con su `id`:

```bash
$ docker rm e5ea0c675f71
```

o con su nombre:

```bash
$ docker rm quirky_hellman
```

## Creación de contenedores sin ejecutarlos

De manera habitual vamos a usar `docker run` para crear y ejecutar un contenedor. Podríamos también crear un contenedor que no se ejecute y posteriormente dar la orden de ejecución. Vamos a observar que la creación de este segundo contenedor será mucho más rápida ya que tenemos la imagen descargada en nuestro registro local. Para crear un contenedor y no iniciar su ejecución utilizaremos el comando `docker create`:

```bash
$ docker create hello-world
```

Podemos ver que el contenedor está creado pero no en ejecución:


```bash
$ docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED         STATUS    PORTS     NAMES
590ac3f01de5   hello-world   "/hello"   6 seconds ago   Created             focused_morse
```

Podemos iniciar la ejecución de este contenedor usando `docker start -a`. La opción `-a` nos permite conectar a la salida estándar del contenedor y poder ver en nuestro terminal la salida.

```bash
$ docker start -a focused_morse

Hello from Docker!
...
```

---

# Etiquetando los contenedores con Labels

Las etiquetas son un mecanismo para guardar metadatos en los objetos Docker: en contenedores, imágenes, volúmenes, redes, etc. Podemos utilizar etiquetas para organizar los distintos objetos Docker que estemos utilizando.

Una etiqueta es una información del tipo clave-valor, almacenado como una cadena. Puede especificar varias etiquetas para un objeto, pero cada clave debe ser única dentro de un objeto. 

Para etiquetar un contenedor en su creación utilizaremos el parámetro `-l` (`--label`). Vamos a crear varios contenedores con distintas etiquetas:

```bash
$ docker run -l servicio=web -l entorno=desarrollo -l aplicacion=apache --name prueba_web ubuntu
$ docker run -l servicio=bd -l entorno=desarrollo -l aplicacion=mysql --name prueba_bd ubuntu
$ docker run -l servicio=web -l entorno=produccion --name web ubuntu
$ docker run -l servicio=bd -l entorno=produccion --name bd ubuntu

$ docker ps -a
CONTAINER ID   IMAGE     COMMAND       CREATED          STATUS                      PORTS     NAMES
6b5742b82a07   ubuntu    "/bin/bash"   7 seconds ago    Exited (0) 5 seconds ago              bd
30d6f1a83749   ubuntu    "/bin/bash"   19 seconds ago   Exited (0) 17 seconds ago             web
3d2ebb7ecfde   ubuntu    "/bin/bash"   39 seconds ago   Exited (0) 36 seconds ago             prueba_bd
553675a1457e   ubuntu    "/bin/bash"   52 seconds ago   Exited (0) 50 seconds ago             prueba_web
```

Hay que tener en cuenta que estos contenedores tendrán además de las etiquetas indicadas en su creación, las etiquetas que estén definidas en la imagen que hemos utilizado para su creación.

A la hora de listar los contenedores podemos filtrar por varios criterios, entre ellos podemos usar las etiquetas para hacer el filtro. 

Por ejemplo, mostrar los contenedores que tienen una etiqueta `aplicacion`:

```bash
$ docker ps -a --filter="label=aplicacion"
```

Mostrar los contenedores que tienen la etiqueta `entorno` con el valor `produccion`:

```bash
$ docker ps -a --filter="label=entorno=produccion"
```

Por último, mostrar los contenedores cuyo servicio es web en el entorno de producción:

```bash
$ docker ps -a --filter="label=entorno=produccion" --filter="label=servicio=web"
```

Para terminar este apartado veamos un filtro que nos devuelve las etiquetas usando el comando `docker inspect`, por ejemplo:

```bash
$ docker inspect --format '{{range $key, $value := .Config.Labels}}{{$key}}: {{$value}}{{"\n"}}{{end}}' prueba_web
aplicacion: apache
entorno: desarrollo
org.opencontainers.image.ref.name: ubuntu
org.opencontainers.image.version: 22.04
servicio: web
```

Como observamos, este contenedor tiene 5 etiquetas, las tres que hemos indicado en su creación, y dos definidas en la imagen `ubuntu`.
---

# Limitando los recursos utilizados por un contenedor Docker

Cuando creamos un contenedor, los procesos que se ejecuten en él pueden usar todos los recursos del Host Docker en el que se está ejecutando. Puedes limitar los recursos de CPU y memoria al crear un contenedor en Docker utilizando las opciones `--cpus` y `--memory` respectivamente. 

## Limitando el uso de CPU

Lo primero que podemos averiguar es el número de CPUs que tiene el Host Docker, para ello ejecutamos el comando:

```bash
$ nproc --all
```

Para limitar la cantidad de recursos de CPU que puede utilizar un contenedor, puedes utilizar la opción `--cpus`. Puedes especificar la cantidad de CPUs que deseas asignar al contenedor, ya sea en términos de núcleos completos o fracciones de núcleos. Por ejemplo, para limitar un contenedor a utilizar un núcleo completo:

```bash
docker run -d --cpus 1 --name servidor_web httpd:2.4
```

Podríamos indicar que utilice medio núcleo (`--cpus=0.5`), o usar 2 núcleos (`--cpus=2`) o usar una fracción de cpu, por ejemplo el 75% (`--cpus=0.75`).

Cuando inspeccionas un contenedor Docker con el comando `docker inspect`, puedes utilizar el campo `NanoCpus` para ver la cantidad de CPU asignada al contenedor en unidades de *nanocpus*. Un *nanocpu* es una unidad de medida que representa la fracción de tiempo de CPU.

```bash
$ docker inspect --format '{{.HostConfig.NanoCpus}}' servidor_web
```

Este comando mostrará la cantidad de CPU asignada al contenedor en unidades de *nanocpus*. Ten en cuenta que la interpretación de estos valores puede no ser intuitiva, pero representan la capacidad de procesamiento relativa asignada al contenedor en comparación con la capacidad total del sistema.

Si deseas obtener información más legible, puedes convertir los *nanocpus* a CPUs utilizando los siguientes comandos:

```bash
nano_cpus=$(docker inspect --format '{{.HostConfig.NanoCpus}}' servidor_web)
cpus=$(echo "scale=2; $nano_cpus / 1000000000" | bc)
echo "CPUs asignadas al contenedor: $cpus"
```

Este fragmento de código convierte los *nanocpus* a CPUs dividiendo por 1000000000 (mil millones) utilizando la herramienta `bc` (calculadora de línea de comandos). La variable `cpus` contendrá la cantidad de CPUs asignadas al contenedor.


## Limitando el uso de memoria


Para limitar la cantidad de memoria que puede utilizar un contenedor, puedes utilizar la opción `--memory`. Puedes especificar la memoria en bytes, kilobytes, megabytes, gigabytes, o utilizando el formato abreviado con las letras *b, k, m, g*. Por ejemplo para limitar un contenedor a 512 megabytes de memoria:

```bash
$ docker run -d --memory 512m --name servidor_web httpd:2.4
```

Con el comando `docker stats` podemos ver los recursos que está consumiendo un contenedor, y además vemos el límite de RAM que le hemos configurado:

```bash
$ docker stats servidor_web
CONTAINER ID   NAME           CPU %     MEM USAGE / LIMIT   MEM %     NET I/O       BLOCK I/O    PIDS
fd2ee83e755a   servidor_web   0.01%     6MiB / 512MiB       1.17%     4.25kB / 0B   0B / 4.1kB   82
```

También podemos usar `docker inspect` para ver el límite de memoria que hemos configurado en un contenedor:

```bash
$ docker inspect --format '{{.HostConfig.Memory}}' servidor_web
```

Este comando te dará el límite de memoria en bytes. Si deseas convertirlo a un formato más legible, puedes hacerlo utilizando las siguientes instrucciones en bash:

```bash
memory_limit=$(docker inspect --format '{{.HostConfig.Memory}}' servidor_web)
memory_limit_mb=$(echo "scale=2; $memory_limit / 1048576" | bc)
echo "Límite de memoria asignado al contenedor: $memory_limit_mb MB"
```

En este fragmento de código, estoy dividiendo el límite de memoria en bytes por 1048576 (que es 1024 al cubo) para convertirlo a megabytes.

## Modificando los límites en tiempo de ejecución

Evidentemente podemos limitar la memoria y el número de CPUs utilizadas al mismo tiempo al crear un contenedor:

```bash
$ docker run -d --memory 512m --cpus 0.5 --name servidor_web httpd:2.4
```

Con la instrucción `docker update` podemos cambiar distintos parámetros de configuración de un contenedor que se está ejecutando, entre ellos podemos cambiar los límites de memoria y CPUs:

```bash
$ docker update --memory 1g --cpus 1.5 servidor_web
```
```
---

# Ejemplo: Configuración de un contenedor con la imagen MariaDB

En ocasiones es obligatorio el inicializar alguna variable de entorno para que el contenedor pueda ser ejecutado. Si miramos la [documentación](https://hub.docker.com/_/mariadb) en Docker Hub de la imagen `mariadb`, observamos que podemos definir algunas variables de entorno para la creación y configuración del contenedor (por ejemplo: `MARIADB_DATABASE`,`MARIADB_USER`, `MARIADB_PASSWORD`,...). Pero hay una que la tenemos que indicar de forma obligatoria, la contraseña del usuario `root` (`MARIADB_ROOT_PASSWORD`), por lo tanto:

```bash
$ docker run -d --name mimariadb -e MARIADB_ROOT_PASSWORD=my-secret-pw mariadb:10.5
$ $ docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS         PORTS             NAMES
09425481aee6   mariadb     "docker-entrypoint.s…"   22 seconds ago   Up 1 second    3306/tcp          mimariadb
```

Podemos ver que se ha creado una variable de entorno:

```bash
$ docker exec -it mimariadb env
...
MARIADB_ROOT_PASSWORD=my-secret-pw
...
```

Y para acceder podemos ejecutar:

```bash
$ docker exec -it mimariadb bash
root@9c3effd891e3:/# mysql -u root -p"$MARIADB_ROOT_PASSWORD" 
...

MariaDB [(none)]> 
```
Otra forma de hacerlo sería:

```bash
$ docker exec -it mimariadb mysql -u root -p -h 127.0.0.1
Enter password: 
...
MariaDB [(none)]> 
```

## Accediendo a servidor de base de datos desde el exterior

En el ejemplo anterior hemos accedido a la base de datos de dos formas: 

1. Ejecutado un comando `bash` para acceder al contenedor y desde dentro hemos utilizado el cliente de MariaDB para acceder a la base de datos.
2. Ejecutando directamente en el contenedor el cliente de MariaDB.

En esta ocasión vamos a mapear los puertos para acceder desde el exterior a la base de datos:

Lo primero que vamos a hacer es eliminar el contenedor anterior:

```bash 
$ docker rm -f mimariadb
```

Y a continuación vamos a crear otro contenedor, pero en esta ocasión vamos a mapear el puerto 3306/tcp del Host Docker con el puerto 3306/tcp del contenedor:

```bash 
$ docker run -d -p 3306:3306 --name mimariadb -e MARIADB_ROOT_PASSWORD=my-secret-pw mariadb:10.5
```

Comprobamos que los puertos se han mapeado y que el contenedor está ejecutándose:

```bash
$ docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS          PORTS                                       NAMES
8d1857ff1d2f   mariadb     "docker-entrypoint.s…"   14 seconds ago   Up 11 seconds   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp   mimariadb
```

Ahora desde nuestro equipo, donde hemos instalado un cliente de MariaDB (`sudo apt install mariadb-client`), nos conectamos al Host Docker:

```bash
$ mysql -u root -p -h 127.0.0.1
Enter password: 
...
MariaDB [(none)]> 
```
---

# Más opciones en la ejecución de contenedores (2ª parte)

## Ejecutando un contenedor demonio

En esta ocasión hemos utilizado la opción `-d` del comando `docker run`, para que la ejecución del comando en el contenedor se haga en segundo plano, de manera desatendida, sin estar conectada a la entrada y salida estándar.

```bash
$ docker run -d --name contenedor4 ubuntu bash -c "while true; do echo hello world; sleep 1; done"
7b6c3b1c0d650445b35a1107ac54610b65a03eda7e4b730ae33bf240982bba08
```

> NOTA: En la instrucción `docker run` hemos ejecutado el comando con `bash -c` que nos permite ejecutar uno o más comandos en el contenedor de forma más compleja (por ejemplo, indicando ficheros dentro del contenedor).

Comprobamos que el contenedor se está ejecutando:

```bash
$ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS     NAMES
c6b1761c8831   ubuntu    "bash -c 'while true…"   5 seconds ago   Up 2 seconds             contenedor4
```

Podemos visualizar los logs del contenedor, ejecutando el siguiente comando:

```bash
$ docker logs contenedor4
```

Con la opción `logs -f` seguimos visualizando los logs en tiempo real.

Por último podemos parar el contenedor y borrarlo con las siguientes instrucciones:

```bash
$ docker stop contenedor4
$ docker rm contenedor4
```

Hay que tener en cuenta que un contenedor que esta ejecutándose no puede ser eliminado. Tendríamos que parar el contenedor y posteriormente borrarlo. Otra opción es borrarlo a la fuerza:

```bash
$ docker rm -f contenedor4
```

## Configuración de contenedores con variables de entorno

Más adelante veremos que al crear un contenedor que necesita alguna configuración específica, lo que vamos a hacer es crear variables de entorno en el contenedor, para que el proceso que inicializa el contenedor pueda realizar dicha configuración.

Para crear una variable de entorno al crear un contenedor usamos el flag `-e` o `--env`:

```bash
$ docker run -it --name contenedor5 -e USUARIO=prueba ubuntu bash
root@91e81200c633:/# echo $USUARIO
prueba
```

---

# Más opciones en la ejecución de contenedores (1ª parte)

Hemos usado el comando `docker run` para crear y ejecutar contenedores. Este comando tiene muchas opciones, veamos algunas de ellas:

## Nombrar los contenedores

A la hora de la creación del contenedor podemos ponerle un nombre (usando el parámetro `--name`) y también, podemos indicar el hostname (con al opción `-h` o `--hostname`). Veamos un ejemplo:

```bash
$ docker run --name contenedor1 -h contendor_ubuntu ubuntu hostname
contendor_ubuntu
```

Hemos comprobado que el hostname lo hemos configurado, y veamos que el nombre del contenedor también lo hemos configurado:

```bash
$ docker ps -a
CONTAINER ID   IMAGE     COMMAND      CREATED          STATUS                      PORTS     NAMES
cea2a22ac6aa   ubuntu    "hostname"   56 seconds ago   Exited (0) 54 seconds ago             contenedor1
```

## Ejecutando un contenedor interactivo

En este caso usamos la opción `-i` para abrir una sesión interactiva, `-t` nos permite crear un pseudo-terminal que nos va a permitir interaccionar con el contenedor. El comando que vamos a ejecutar en el contenedor es `bash` para que podamos acceder al terminal:

```bash
$ docker run -it --name contenedor2 -h cont1 ubuntu bash 
root@cont1:/#
```

El contenedor se para cuando salimos de él. Para volver a conectarnos a él:

```bash
$ docker start contenedor2
contendor2
$ docker attach contenedor2
root@cont1:/#
```

Con `docker attach` nos conectamos a la entrada estándar y a la salida estándar y de error de un contenedor en ejecución, conectándonos a su terminal.

En realidad, todas las imágenes tienen definidas un proceso que se ejecuta por defecto si no se indica de manera explicita cuando creamos el contenedor. En concreto, la imagen `ubuntu` ( y en general todas las imágenes que corresponden al sistemas operativos) tiene definida por defecto el proceso `bash`, por lo que podríamos haber ejecutado:

```bash
$ docker run -it --name contenedor2 ubuntu
```

## Eliminación automática de un contenedor 

Como hemos visto hasta ahora cuando un contenedor termina de ejecutar el comando indicado, se para. Si queremos que cuando finalice la ejecución del contenedor se borre, usaremos la opción `--rm`. Por ejemplo:

```bash
docker run -it --rm --name contenedor3 ubuntu top
```

Cuando salgamos de ejecutar el comando `top` se borrará el contenedor. Puedes ejecutar un `docker ps -a` para comprobarlo.


---

# Ejemplo: Creando un contenedor con un servidor web

En este ejemplo vamos a crear un contenedor demonio que ejecuta un servidor web Apache, para ello vamos a usar la imagen `httpd:2.4` del registro **Docker Hub** (en este caso hemos indicado el nombre de la imagen y su etiqueta `2.4` que nos indica la versión del servidor web que vamos a usar):

```bash
$ docker run -d --name my-apache-app -p 8080:80 httpd:2.4
```

Hay que tener en cuenta que los contenedores que estamos creando se conectan a una red virtual privada y que toman direccionamiento dinámico. No solemos usar la dirección IP del contenedor para acceder al servicio que nos ofrece. Con la opción `-p` mapeamos un puerto del Host Docker, con el puerto del servicio ofrecido por el contenedor. Si accedemos a la dirección IP del ordenador que tiene instalado Docker al primer puerto indicado, se redireccionará la petición a la dirección IP del contenedor al segundo puerto indicado. **Nunca utilizamos directamente la dirección IP del contenedor para acceder a él**. 

Podemos ver los puertos que están mapeados en un contenedor de dos maneras distintas. Usando el comando `docker port`:

```bash
$ docker port my-apache-app
80/tcp -> 0.0.0.0:8080
80/tcp -> [::]:8080
```

O utilizando el comando `docker inspect` con un filtro:

```bash
$ docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}  {{(index $conf 0).HostPort}} -> {{$p}} {{end}}' my-apache-app
```

Para probarlo accedemos desde un navegador web:

* Si estamos accediendo desde el Host Docker, accederemos a `http://localhost:8080`.
* Si estamos accediendo desde un ordenador remoto, accederemos a la dirección IP del Host Docker y al puerto, por ejemplo,si dirección IP del Host Docker es `192.168.121.54`, accederemos a `http://192.168.121.54:8080`:

![web](img/web.png)

Para acceder al log del contenedor podemos ejecutar:

```bash
$ docker logs my-apache-app
```

## Modificación del contenido servido por el servidor web

Si consultamos la documentación de la imagen [`httpd`](https://hub.docker.com/_/httpd) en el registro Docker Hub, podemos determinar que el servidor web que se ejecuta en el contenedor guarda los ficheros que sirve (directorio *DocumentRoot*) en `/usr/local/apache2/htdocs/`. Vamos a crear un nuevo fichero `index.html` en ese directorio.

Lo podemos hacer de varias formas:

* Accediendo de forma interactiva al contenedor y haciendo la modificación:

    ```bash
    $ docker exec -it my-apache-app bash

    root@cf3cd01a4993:/usr/local/apache2# cd /usr/local/apache2/htdocs/
    root@cf3cd01a4993:/usr/local/apache2/htdocs# echo "<h1>Curso Docker</h1>" > index.html
    root@cf3cd01a4993:/usr/local/apache2/htdocs# exit
    ```

* Ejecutando directamente el comando de creación del fichero `index.html` en el contenedor:

    ```bash
    $ docker exec my-apache-app bash -c 'echo "<h1>Curso Docker</h1>" > /usr/local/apache2/htdocs/index.html'
    ```

* Usando el comando `docker cp` y copiando el fichero `index.html` al contenedor:

    ```bash
    $ echo "<h1>Curso Docker</h1>" > index.html
    $ docker cp index.html  my-apache-app:/usr/local/apache2/htdocs/
    ```
    
Independientemente de cómo hayamos creado el fichero, podemos volver a acceder al servidor web y comprobar que efectivamente hemos cambiado el contenido del `index.html`:

![web](img/web2.png)
