# Módulo 07: Creación de Imágenes

**Fuente:** Curso Docker 2024 - modulo7
**Autor:** José Domingo González López
**URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo7
**URL GitHub:** https://github.com/josedom24/curso_docker_ow



---

# Creación de imágenes a partir de un Dockerfile

Veamos como podemos automatizar la creación de imágenes Docker, usando un fichero `Dockerfile` y el comando `docker build`. Puedes encontrar los ficheros necesarios en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

1. Vamos a crear un directorio (a este directorio se le llama **contexto**) donde vamos a crear un fichero `Dockerfile` y un fichero `index.html`:

    ```bash
    cd build
    ~/build$ ls
    Dockerfile  index.html
    ```
    El contenido de `Dockerfile` es:

    ```Dockerfile
    # syntax=docker/dockerfile:1
    FROM debian:stable-slim
    RUN apt-get update  && apt-get install -y  apache2 
    WORKDIR /var/www/html
    COPY index.html .
    CMD apache2ctl -D FOREGROUND
    ```

2. Para crear la imagen uso el comando `docker build`, indicando el nombre de la nueva imagen (opción `-t`) y el directorio **contexto**.

    ```bash
    $ docker build -t josedom24/myapache2:v2 .
    ...
    ```
    **Nota:** Pongo como directorio el `.` porque estoy ejecutando esta instrucción dentro del directorio donde está el fichero `Dockerfile`.

    Una vez terminado, podremos comprobar que hemos generado una nueva imagen:

    ```bash
    $ docker images
    REPOSITORY                TAG                 IMAGE ID            CREATED             SIZE
    josedom24/myapache2       v2                  3bd28de7ae88        43 seconds ago      195MB
    ...
    ```
3. En este caso al crear el contenedor a partir de esta imagen no hay que indicar el proceso que se va a ejecutar, porque ya se ha indicando en el fichero `Dockerfile`, con el parámetro `CMD`:

```bash
$ docker run -d -p 8080:80 --name servidor_web josedom24/myapache2:v2 
```            

Si queremos ver los distintos pasos que hemos ejecutado para construir la imagen, podemos ejecutar la siguiente instrucción:

```bash
$ docker history josedom24/myapache2:v2
IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
b4836c1e7b7f   41 seconds ago   CMD ["/bin/sh" "-c" "apache2ctl -D FOREGROUN…   0B        buildkit.dockerfile.v0
<missing>      41 seconds ago   COPY index.html . # buildkit                    22B       buildkit.dockerfile.v0
<missing>      42 seconds ago   WORKDIR /var/www/html                           0B        buildkit.dockerfile.v0
<missing>      44 seconds ago   RUN /bin/sh -c apt-get update  && apt-get in…   131MB     buildkit.dockerfile.v0
<missing>      9 days ago       /bin/sh -c #(nop)  CMD ["bash"]                 0B        
<missing>      9 days ago       /bin/sh -c #(nop) ADD file:17e64d3a682fd256f…   74.8MB
```

Donde vemos los pasos que hemos ejecutado en la construcción de la imagen.

## Uso de la caché en la construcción de imágenes Docker

Como hemos indicado anteriormente, durante la construcción de una imagen Docker, se van guardando en caché las capas intermedias que se van generando. Vamos a ver qué ocurre si volvemos a construir la imagen después de alguna modificación:

1. Si modificamos el fichero `index.html` y volvemos a construir la imagen:

    ```bash
    $ docker build -t josedom24/myapache2:v3 .
    ...
    ```
    
    La construcción será muy rápida, ya que las imágenes intermedias que se van generando no se vuelven a generar porque están guardadas en caché. Sólo se ejecuta la instrucción donde copiamos el fichero que hemos modificado.

2. Si modificamos por ejemplo la instrucción donde se ejecuta la instalación del servidor web y ponemos por ejemplo:

    ```
    ...
    RUN apt-get update  && apt-get install -y  apache2 git
    ...
    ```

    Ahora esa primera instrucción ha cambiado, por lo que se generará una nueva capa distinta a la guardada en caché y todas las demás instrucciones se tendrán que volver a ejecutar.

Si usamos el parámetro `--no-cache` en `docker build` haríamos la construcción de una imagen sin usar las capas cacheadas generadas en construcciones anteriores.




---

# Ciclo de vida de nuestras aplicaciones con Docker

**El ciclo de vida de una aplicación Docker** tendría los siguientes pasos:

* Paso 1: Desarrollo de nuestra aplicación.
* Paso 2: Creación de la imagen Docker.
* Paso 3: Probamos nuestra aplicación en el entorno de desarrollo o prueba.
* Paso 4: Distribuimos nuestra imagen.
* Paso 5: Implantación de la aplicación en el entorno de producción.
* Paso 6: Modificación de la aplicación, volviendo al paso 2.

Puedes encontrar los ficheros necesarios para realizar este ejemplo en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

## Paso 1:Desarrollo de nuestra aplicación

Vamos a imaginar que nuestro "equipo de desarrollo" ha creado una aplicación web. En este caso tenemos nuestra aplicación web escrita en JavaScript llamada 2048 guardada en un repositorio GitHub. La aplicación 2048 es un juego de habilidad matemática inspirado en el juego 1024 cuyo código original puedes encontrar en este [repositorio GitHub](https://github.com/gabrielecirulli/2048). 

Para realizar este ejercicio he hecho un fork del repositorio en mi cuenta de GitHub, de esta manera podré hacer modificaciones del mismo.

## Paso 2: Creación de la imagen Docker

Vamos a crear una imagen Docker a partir de un fichero `Dockerfile`:

```Dockerfile
# syntax=docker/dockerfile:1
FROM nginx
WORKDIR /usr/share/nginx/html/
ADD https://github.com/josedom24/2048.git .
EXPOSE 80
```

En esta ocasión no hemos usado la instrucción `COPY` para copiar ficheros a la imagen, hemos usado `ADD` que funciona como `COPY` pero que además nos permite copiar ficheros remotos, en este caso hemos copiado los ficheros del repositorio que hemos forkeado.

Creamos nuestra imagen, desde el directorio donde tenemos el `Dockerfile`, ejecutamos:

```bash
$ docker build -t josedom24/2048:v1 .
```
Podemos comprobar que en nuestro entorno local tenemos la imagen que acabamos de crear:

```bash
$ docker images
REPOSITORY          TAG       IMAGE ID       CREATED             SIZE
josedom24/2048      v1        ea9228809799   8 minutes ago       187MB
...
```

## Paso 3: Probamos nuestra aplicación en el entorno de desarrollo

Creamos un contenedor en nuestro entorno de desarrollo:

```bash
$ docker run --name ap2048 -d -p 8080:80 josedom24/2048:v1
  
$ docker ps
CONTAINER ID   IMAGE               COMMAND                  CREATED         STATUS        PORTS                                   NAMES
762397879d5e   josedom24/2048:v1   "/docker-entrypoint.…"   4 seconds ago   Up 1 second   0.0.0.0:8080->80/tcp, :::8080->80/tcp   ap2048
```

Probamos nuestra aplicación:

![docker](img/2048_v1.png)

## Paso 4: Distribuimos nuestra imagen

Vamos a subir nuestra imagen al registro Docker Hub:

```bash
$ docker login
...
$ docker push josedom24/2048:v1
...
```

Comprobamos que está subida al repositorio:

```bash
$ docker search josedom24/2048
NAME             DESCRIPTION   STARS     OFFICIAL
josedom24/2048                 0         
```

## Paso 5: Implantación de la aplicación

En el entorno de producción, bajamos la imagen de Docker Hub y creamos el contenedor:

```bash
$ docker pull josedom24/2048:v1
...
$ docker run --name ap2048_prod -d -p 80:80 josedom24/2048:v1
```

## Paso 6: Modificación de la aplicación

Al modificar el código de la aplicación tenemos que generar una nueva imagen. Podemos cambiar en fichero `index.html` de la aplicación y modificar la siguiente línea indicando la versión:

```html
<h1 class="title">2048 (v2)</h1>
```

Guardamos los cambios en el repositorio y generamos una nueva versión de la imagen:

```bash
$ docker build -t josedom24/2048:v2 .
```

Podemos probarla en el entorno de desarrollo, eliminando el contenedor anterior:

```bash
$ docker rm -f ap2048
$ docker run --name ap2048 -d -p 8080:80 josedom24/2048:v2
```

Y probamos la aplicación:

![docker](img/2048_v2.png)

Subimos la nueva versión de la aplicación a Docker Hub y la bajamos en el entorno de producción. Eliminamos el contenedor de la versión antigua y creamos un nuevo contenedor con la nueva imagen:

En desarrollo:

```bash
$ docker push josedom24/2048:v2
...
```

En producción:

```bash
$ docker pull josedom24/2048:v2
...
$ docker rm -f ap2048_prod
$ docker run --name ap2048_prod -d -p 80:80 josedom24/2048:v2
```
---

# Creación de imágenes con Docker Compose

En este ejemplo vamos a ver la configuración de Docker Compose para construir la imagen que va a utilizar en la creación del servicio. En este caso no se indica la imagen, se indica el directorio de contexto donde encontramos el fichero `Dockerfile` para la construcción de la imagen.

Puedes encontrar los ficheros necesarios para realizar este ejemplo en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

## Ejemplo de construcción de imagen en Docker Compose

En este ejemplo vamos a crear una imagen a a partir de una aplicación Python construida con el framework Flask. El código de la aplicación lo guardamos en el fichero `app.py` y es el siguiente:

```python
import time

import redis
from flask import Flask

app = Flask(__name__)
cache = redis.Redis(host='redis', port=6379)

def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@app.route('/')
def hello():
    count = get_hit_count()
    return 'Hola!!! has entrado en esta página {} veces.\n'.format(count)
```

El programa guarda en una base de datos redis un contador que se incrementa cada vez que accedemos a la página. Es importante apuntar que el nombre que se usa para acceder al servidor de base de datos es `redis`.

En el fichero `requirements.txt` tenemos las dependencias necesarias para que el programa funcione, en nuestro caso el contenido de este fichero es:

```
flask
redis
```

El fichero `Dockerfile` que vamos a usar para la construcción de la imagen tiene el siguiente contenido:

```Dockerfile
# syntax=docker/dockerfile:1
FROM python:3.10-alpine
WORKDIR /code
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
CMD ["flask", "run"]
```

Por último el fichero `compose.yaml` que vamos a usar para levantar el escenario tendrá el siguiente contenido:

```yaml
version: '3.1'
services:
  web:
    build: .
    ports:
      - "8000:5000"
  redis:
    image: "redis:alpine"
```

Como podemos observar, en el servicio `web` no hemos indicado la imagen. Hemos indicado el directorio de contexto, en nuestro caso un punto, en el parámetro `build:`. Al levantar el escenario con Docker Compose, si es necesario se construirá la imagen que vamos a usar para crear el contenedor. Cómo vemos usamos el puerto 8000/tcp para acceder a la aplicación, que internamente usa el puerto estándar de Flask que es el 5000/tcp.

Vamos a construir la aplicación:

```bash
$ docker compose up -d
...
[web internal] load build definition from Dockerfile
...
```

Como vemos para crear el servicio `web` se realiza el proceso de construcción de la imagen a a partir del fichero `Dockerfile`. Podemos acceder a la aplicación accediendo a la URL `http://localhost:8000`, por ejemplo usando el comando `curl`:

```bash
$ curl http://localhost:8000
Hola!!! has entrado en esta página 1 veces.
```

Evidentemente si borramos el escenario y volvemos a acceder no será necesario de nuevo la construcción de la imagen:

```bash
$ docker compose down
...
$ docker compose up -d
[+] Running 2/3
 ✔ Network build_default    Created 
 ✔ Container build-redis-1  Started 
 ✔ Container build-web-1    Started                         
```

Si se produce un cambio en la aplicación o en el fichero `Dockerfile`, la próxima vez que levantemos el escenario tendremos que indicar que queremos volver a construir la imagen con el parámetro `--build`. Por ejemplo, hemos cambiado el mensaje que muestra la aplicación en la función principal de la aplicación, borramos el escenario y lo volvemos a crear indicando que queremos volver a construir la imagen del servicio `web`:

```bash
$ docker compose down
...
$ docker compose up -d --build 
...
 => [web internal] load build definition from Dockerfile       
```



---

# Creación de imágenes a partir de un contenedor

La primera forma para crear nuevas imágenes Docker es partiendo de un contenedor que hayamos modificado. Veamos un ejemplo:

1. Vamos a crear un contenedor a partir de una imagen base.

    ```bash
    $ docker  run -it --name contenedor debian 
    ```

2. Realizamos las modificaciones necesarias en el el contenedor (instalaciones, modificación de archivos,...). Por ejemplo, instalamos un servidor web y modificamos el fichero `index.html`:

    ```bash
    root@2df2bf1488c5:/# apt update && apt install apache2 -y
    root@75f87f84a091:/# echo "<h1>Curso Docker</h1>" > /var/www/html/index.html
    root@75f87f84a091:/# exit
    ```

3. Creamos una nueva imagen partiendo de ese contenedor usando `docker commit`. Con esta instrucción se creará una nueva imagen con las capas de la imagen base más la capa propia del contenedor. Si no indicamos etiqueta en el nombre, la imagen se creará con la etiqueta `latest`. Con la opción `--change` podemos indicar algunos comando que posteriormente estudiaremos al trabajar con los ficheros `Dockerfile`, por ejemplo podremos indicar el proceso que se va ejecutar por defecto al crear un contenedor, usando la instrucción `CMD` (para indicar el servidor web tenemos que ejecutar `apachectl -D FOREGROUND`):

    ```bash
    $ docker commit --change='CMD apachectl -D FOREGROUND' contenedor josedom24/myapache2:v1
    sha256:017a4489735f91f68366f505e4976c111129699785e1ef609aefb51615f98fc4

    $ docker images
    REPOSITORY                TAG                 IMAGE ID            CREATED             SIZE
    josedom24/myapache2       v1              017a4489735f        44 seconds ago      243MB
    ...
    ```

4. Ahora podemos crear un nuevo contenedor a partir de esta nueva imagen:

```bash
$ docker run -d -p 8080:80 --name servidor_web josedom24/myapache2:v1 
             
```

---

# Distribución de imágenes

Como hemos comentado, tenemos dos maneas de distribuir nuestras imágenes Docker:

1. Distribuir nuestras imágenes a través de ficheros, utilizando los comandos `docker save` / `docker load`. 
2. Distribuir nuestras imágenes usando un registro de imágenes, por ejemplo Docker Hub, para ello utilizamos los comandos `docker push` / `docker pull`.

## Distribución a partir de un fichero

1. Guardamos la imagen que queremos distribuir en un archivo `.tar` usando el comando `docker save`:

    ```bash    
    $ docker save josedom24/myapache2:v1 > myapache2.tar
    ```

2. Distribuimos el fichero `.tar`.

3. Si me llega un fichero `.tar` puedo añadir la imagen a mi repositorio local:

    ```bash
    $ docker load -i myapache2.tar          
    Loaded image: josedom24/myapache2:v1
    ```

## Distribución usando Docker Hub

Necesitamos estar registrados en Docker Hub. Durante el registro indicaremos un nombre de usuario y una contraseña con las que podremos acceder al registro.

Los pasos para distribuir nuestra imagen usando Docker Hub, serían:

1. Accedemos a Docker Hub usando el comando `docker login`.

    ```bash
    $ docker login 
    Login with your Docker ID to push and pull images from Docker Hub...
    Username: ...
    Password: ...
    ...
    Login Succeeded
    ```

2. Subimos la nueva imagen a Docker Hub mediante `docker push`. Recuerda que el nombre de la imagen tiene que tener como primera parte el nombre del usuario de Docker Hub que estamos usando.

    ```bash
    $ docker push josedom24/myapache2:v2
    The push refers to repository [docker.io/josedom24/myapache2:v2]
    ...
    ```

3. Podemos bajar la imagen en otro servidor usando `docker pull`.
---

# El fichero Dockerfile

* Podemos automatizar la creación de imágenes Docker, declarando las instrucciones para crear la nueva imagen en un fichero llamado **Dockerfile**. A partir de este fichero y usando el comando **docker build** podemos construir una nueva imagen.
* En el fichero `Dockerfile` tenemos un conjunto de instrucciones que serán ejecutadas de forma secuencial para construir una nueva imagen Docker. 
* Las instrucciones que cambian el sistema de fichero crearán **una nueva capa**.
* La primera línea a añadir a un Dockerfile es una directiva `# syntax=docker/dockerfile:1` que se utiliza para especificar la versión del formato del fichero `Dockerfile` que se va a utilizar. Es opcional, pero recomendable.

## Ejemplo de Dockerfile

```Dockerfile
# syntax=docker/dockerfile:1
FROM debian:stable-slim
RUN apt-get update  && apt-get install -y  apache2 
WORKDIR /var/www/html
COPY index.html .
CMD apache2ctl -D FOREGROUND
```

## Instrucciones en el dockerfile

Las principales instrucciones que podemos usar:

* **FROM**: Sirve para especificar la imagen base sobre la que vamos a construir la nueva.
* **RUN**: Ejecuta una orden creando una nueva capa.  Ejemplo: `RUN apt update && apt install -y git`. En este caso es muy importante que pongamos la opción `-y` porque en el proceso de construcción no puede haber interacción con el usuario.
* **WORKDIR**: Establece el directorio de trabajo dentro de la imagen que estoy creando, las siguientes instrucciones se ejecutarán en este directorio.
* **COPY**: Copia ficheros desde mi equipo a la imagen. Esos ficheros deben estar en el mismo contexto, es decir en el mismo directorio que el fichero `Dockerfile`. Su sintaxis es `COPY [--chown=<usuario>:<grupo>] src dest`. 
* **ADD**: Es similar a COPY pero tiene funcionalidades adicionales como especificar URLs  y tratar archivos comprimidos.
* **LABEL**: Sirve para añadir metadatos a la imagen mediante clave=valor.
* **EXPOSE**: Nos da información acerca de qué puertos tendrá abiertos el contenedor cuando se cree uno en base a la imagen que estamos creando. Es meramente informativo.  
* **ENV**: Para establecer variables de entorno dentro del contenedor. Puede ser usado posteriormente en las órdenes `RUN` añadiendo `$` delante de el nombre de la variable de entorno. 
* **ARG**: Para definir variables para las cuales los usuarios pueden especificar valores a la hora de hacer el proceso de build mediante el parámetro  `--build-arg`. 
* **ENTRYPOINT**: Para establecer el ejecutable que se ejecuta en los contenedores que creamos a partir de esta imagen. El comando no se puede cambiar al crear el contenedor.
* **CMD**: Para establecer el ejecutable por defecto igual que el parámetro anterior. Pero en este caso, si podemos cambiarlo al crear el contenedor.

Para una descripción completa sobre el fichero `Dockerfile`, puedes acceder a la [documentación oficial](https://docs.docker.com/engine/reference/builder/).

## Construyendo imágenes con docker build

* El directorio donde se encuentra el fichero `Dockerfile` lo llamamos **entorno**. En este directorio tendremos los ficheros necesarios para crear la nueva imagen.
* El comando `docker build` construye la nueva imagen leyendo las instrucciones del fichero `Dockerfile` y los ficheros que hay en el **entorno**. El comando `docker build` ejecuta las instrucciones de un `Dockerfile` línea por línea y va mostrando los resultados en pantalla.
* La creación de la imagen es ejecutada por el demonio Docker, que recibe toda la información del entorno. 
* Tenemos que tener en cuenta que cada instrucción ejecutada crea una imagen intermedia, una vez finalizada la construcción de la imagen nos devuelve su id. 
* Algunas imágenes intermedias se guardan en **caché**, otras se borran. 
* Si en algún momento falla la creación de la imagen, al corregir el `Dockerfile` y volver a construir la imagen, los pasos que habían funcionado anteriormente no se repiten ya que tenemos a nuestra disposición las imágenes intermedias guardadas en caché, y el proceso continúa por la instrucción que causó el fallo.

## Buenas prácticas al crear Dockerfile

* **Los contenedores deben ser "efímeros"**: Cuando decimos "efímeros" queremos decir que la creación, parada, despliegue de los contenedores creados a partir de la imagen que vamos a generar con nuestro `Dockerfile` debe tener una mínima configuración.
* **Uso de ficheros `.dockerignore`**: Como hemos indicado anteriormente, todos los ficheros del contexto se envían al demonio Docker. Para aumentar el rendimiento, y no enviar ficheros innecesarios podemos hacer uso de un fichero `.dockerignore`, para excluir ficheros y directorios.
* **No instalar paquetes innecesarios**: Para reducir la complejidad, dependencias, tiempo de creación y tamaño de la imagen resultante, se debe evitar instalar paquetes extras o innecesarios. 
* **Minimizar el número de capas**: Debemos encontrar el balance entre la legibilidad del fichero `Dockerfile` y minimizar el número de capas que generamos.
* **No utilizar la etiqueta `latest`** al indicar la imagen base, ya que está va cambiando con el tiempo y si volvemos a crear la imagen dentro de un tiempo, es posible que estemos usando una imagen base diferente.

---

# Ejemplo 1: Construcción de imágenes con una página estática

En este ejemplo vamos a crear una imagen Docker que tenga un servidor web que nos sirva una página web estática.
Puedes encontrar los ficheros necesarios en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

## Versión 1: Desde una imagen base

Tenemos un directorio, que en Docker se denomina contexto, donde tenemos el fichero `Dockerfile` y un directorio, llamado `public_html` con nuestra página web:

```bash
$ ls
Dockerfile  public_html
```

En este caso vamos a usar una imagen base de un sistema operativo sin ningún servicio. El fichero `Dockerfile` será el siguiente:

```Dockerfile
# syntax=docker/dockerfile:1
FROM debian:stable-slim
RUN apt-get update && apt-get install -y apache2 && apt-get clean && rm -rf /var/lib/apt/lists/*
WORKDIR /var/www/html/
COPY public_html .
EXPOSE 80
CMD apache2ctl -D FOREGROUND
```

* Al usar una imagen base `debian:stable-slim` tenemos que instalar los paquetes necesarios para tener el servidor web, en este caso Apache. 
* Además de la instalación del servicio hemos borrado todos los paquetes que nos hemos bajado, con esto conseguimos que la capa que va a crear la instrucción `RUN` sea lo más pequeña posible.
* A continuación añadiremos el contenido del directorio `public_html` al directorio `/var/www/html/` del contenedor, donde nos hemos posicionado con la instrucción `WORKDIR`. 
* Declaramos el puerto donde se va a ofrecer el servicio. Esta definición es sólo informativa.
* Finalmente indicamos el comando que se deberá ejecutar al crear un contenedor a partir de esta imagen: iniciamos el servidor web en segundo plano.

Para crear la imagen ejecutamos:

```bash
$ docker build -t josedom24/ejemplo1:v1 .
```

Comprobamos que la imagen se ha creado:

```bash
$ docker images
REPOSITORY             TAG                 IMAGE ID            CREATED             SIZE
josedom24/ejemplo1     v1                  8c3275799063        1 minute ago      226MB
```

Podemos ver cómo se ha creado cualquier imagen, usando el comando `docker history`:

```bash
$ docker history josedom24/ejemplo1:v1 
IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
c23cf3f2d251   11 seconds ago   CMD ["/bin/sh" "-c" "apache2ctl -D FOREGROUN…   0B        buildkit.dockerfile.v0
<missing>      11 seconds ago   EXPOSE map[80/tcp:{}]                           0B        buildkit.dockerfile.v0
<missing>      11 seconds ago   COPY public_html . # buildkit                   492kB     buildkit.dockerfile.v0
<missing>      13 seconds ago   WORKDIR /var/www/html/                          0B        buildkit.dockerfile.v0
<missing>      15 seconds ago   RUN /bin/sh -c apt-get update && apt-get ins…   112MB     buildkit.dockerfile.v0
<missing>      41 hours ago     /bin/sh -c #(nop)  CMD ["bash"]                 0B        
<missing>      41 hours ago     /bin/sh -c #(nop) ADD file:17e64d3a682fd256f…   74.8MB    
```

Y podemos crear un contenedor:

```bash
$ docker run -d -p 80:80 --name ejemplo1 josedom24/ejemplo1:v1
```

Y acceder con el navegador a nuestra página:

![ejemplo1](img/ejemplo1.png)


## Versión 2: Desde una imagen con Apache

En este caso el fichero `Dockerfile` sería el siguiente:

```Dockerfile
# syntax=docker/dockerfile:1
FROM httpd:2.4
COPY public_html /usr/local/apache2/htdocs/
EXPOSE 80
```

* No necesitamos instalar nada, ya que la imagen tiene instalado el servidor web. 
* Siguiendo la documentación de la imagen en Docker Hub sabemos que el *DocumentRoot* del servidor web es el directorio `/usr/local/apache2/htdocs/`. 
* No es necesario indicar el `CMD` ya que por defecto el contenedor creado a partir de esta imagen ejecutará el mismo proceso que la imagen base, es decir, la ejecución del servidor web.

De forma similar, crearíamos una imagen y un contenedor:

```bash
$ docker build -t josedom24/ejemplo1:v2 .
$ docker run -d -p 80:80 --name ejemplo1 josedom24/ejemplo1:v2
```

## Versión 3: Desde una imagen con nginx

En este caso el fichero `Dockerfile` sería:

```Dockerfile
# syntax=docker/dockerfile:1
FROM nginx:1.24
COPY public_html /usr/share/nginx/html
EXPOSE 80
```

De forma similar, crearíamos una imagen y un contenedor:

```bash
$ docker build -t josedom24/ejemplo1:v3 .
$ docker run -d -p 80:80 --name ejemplo1 josedom24/ejemplo1:v3
```

---

# Ejemplo 2: Construcción de imágenes con una una aplicación PHP

En este ejemplo vamos a crear una imagen Docker con una página desarrollada con PHP. 
Puedes encontrar los ficheros necesarios en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

## Versión 1: Desde una imagen base

En el contexto vamos a tener el fichero `Dockerfile` y un directorio, llamado `app`, con nuestra aplicación.

En este caso vamos a usar una imagen base de un sistema operativo sin ningún servicio. El fichero `Dockerfile` será el siguiente:

```Dockerfile
# syntax=docker/dockerfile:1
FROM debian:stable-slim
RUN apt-get update && apt-get install -y apache2 libapache2-mod-php php && apt-get clean && rm -rf /var/lib/apt/lists/*
COPY app /var/www/html/
RUN rm /var/www/html/index.html
EXPOSE 80
CMD apache2ctl -D FOREGROUND
```

* Al usar una imagen base `debian:stable-slim` tenemos que instalar los paquetes necesarios para tener el servidor web, PHP y las librerías necesarias. 
* A continuación añadiremos el contenido del directorio `app` al directorio `/var/www/html/` del contenedor. 
* Hemos borrado el fichero `/var/www/html/index.html` para que no sea el fichero que se muestre por defecto.
* Finalmente indicamos el comando que se deberá ejecutar al crear un contenedor a partir de esta imagen: iniciamos el servidor web en segundo plano.

Para crear la imagen ejecutamos:

```bash
$ docker build -t josedom24/ejemplo2:v1 .
```

Comprobamos que la imagen se ha creado:

```bash
$ docker images
REPOSITORY             TAG                 IMAGE ID            CREATED             SIZE
josedom24/ejemplo2     v1                  8c3275799063        1 minute ago      226MB
```

Y podemos crear un contenedor:

```bash
$ docker run -d -p 80:80 --name ejemplo2 josedom24/ejemplo2:v1
```

Y acceder con el navegador a nuestra página:

![ejemplo2](img/ejemplo2.png)

La aplicación tiene un fichero `info.php` que me da información sobre PHP, en este caso observamos que estamos usando la versión 8.2:

![ejemplo2](img/ejemplo2_phpinfo.png)


## Versión 2: Desde una imagen con PHP instalado

En este caso el fichero `Dockerfile` sería el siguiente:

```Dockerfile
# syntax=docker/dockerfile:1
FROM php:7.4-apache
COPY app /var/www/html/
EXPOSE 80
```

* En este caso no necesitamos instalar nada, ya que la imagen tiene instalado el servidor web y PHP. 
* No es necesario indicar el `CMD` ya que por defecto el contenedor creado a partir de esta imagen ejecutará el mismo proceso que la imagen base, es decir, la ejecución del servidor web.

De forma similar, crearíamos una imagen y un contenedor:

```bash
$ docker build -t josedom24/ejemplo2:v2 .
$ docker run -d -p 80:80 --name ejemplo2 josedom24/ejemplo2:v2
```

Podemos acceder al fichero `info.php` para comprobar la versión de PHP que estamos utilizando con esta imagen:

![ejemplo2](img/ejemplo2_phpinfo2.png)
---

# Ejemplo 3: Construcción de imágenes con una una aplicación Python

En este ejemplo vamos a construir una imagen Docker para servir una aplicación escrita en Python utilizando el framework Flask. La aplicación será servida en el puerto 3000/tcp. 

Puedes encontrar los ficheros necesarios en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

En el contexto vamos a tener el fichero `Dockerfile` y un directorio, llamado `app` con nuestra aplicación.

En este caso vamos a usar una imagen base de un sistema operativo sin ningún servicio. El fichero `Dockerfile` será el siguiente:

```Dockerfile
# syntax=docker/dockerfile:1
FROM debian:12
RUN apt-get update && apt-get install -y python3-pip  && apt-get clean && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/share/app
COPY app .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt
EXPOSE 3000
CMD python3 app.py
```

Algunas consideraciones:

* Sólo tenemos que instalar `pip`, que utilizaremos posteriormente para instalar los paquetes Python.
* Copiamos nuestra aplicación en cualquier directorio.
* Con `WORKDIR` nos posicionamos en el directorio indicado. Todas las instrucciones posteriores se realizarán sobre ese directorio.
* Instalamos los paquetes Python con pip, que están listados en el fichero `requirements.txt`.
* El proceso que se va a ejecutar por defecto al iniciar el contenedor será `python3 app.py` que arranca un servidor web en el puerto 3000/tcp ofreciendo la aplicación.

Para crear la imagen ejecutamos:

```bash
$ docker build -t josedom24/ejemplo3:v1 .
```

Comprobamos que la imagen se ha creado:

```bash
$ docker images
REPOSITORY             TAG                 IMAGE ID            CREATED             SIZE
josedom24/ejemplo3     v1                  8c3275799063        1 minute ago      226MB
```

Y podemos crear un contenedor:

```bash
$ docker run -d -p 80:3000 --name ejemplo3 josedom24/ejemplo3:v1
```

Y acceder con el navegador a nuestra página:

![ejemplo3](img/ejemplo3.png)

## Versión 2: Desde una imagen con Python instalado

En este caso el fichero `Dockerfile` podría tener este contenido:

```Dockerfile
# syntax=docker/dockerfile:1
FROM python:3.12.1-bookworm
WORKDIR /usr/share/app
COPY app .
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 3000
CMD python app.py
```
---

# Ejemplo 4: Construcción de imágenes configurables con variables de entorno

En este ejemplo vamos a construir una imagen de una aplicación PHP que necesita conectarse a una base de datos MariaDB para guardar o leer información. Por lo tanto, vamos a construir la imagen que tendrá distintas variables de entorno para configurar las credenciales de acceso a la base de datos. 

Puedes encontrar los ficheros necesarios en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

## Aplicación PHP

Como ejemplo vamos a "dockerizar" una aplicación PHP simple que accede a una tabla de una base de datos. La aplicación la puedes encontrar en el directorio `build/app/index.php`.

Algunas cosas que hay que tener en cuenta:

* Cuando programamos una aplicación tenemos que tener en cuenta que va a ser implantada usando Docker tenemos que hacer algunas modificaciones, por ejemplo en este caso, las credenciales para el acceso a la base de datos la leemos de variables de entorno (que posteriormente serán creadas en el contenedor):

```php
<?php
 // Database host
 $host = getenv('DB_HOST');
 // Database user name
 $user = getenv('DB_USER');
 //Database user password
 $pass = getenv('DB_PASS');
 //Database name
 $db = getenv('DB_NAME');
 // check the MySQL connection status
 $conn = new mysqli($host, $user, $pass,$db);
 if ($conn->connect_error) {
     die("Connection failed: " . $conn->connect_error);
 } else {
     $sql = 'SELECT * FROM users';
     
     if ($result = $conn->query($sql)) {
         while ($data = $result->fetch_object()) {
             $users[] = $data;
         }
     }
     
     foreach ($users as $user) {
        echo "<br>";
        echo $user->username . " " . $user->password;
        echo "<br>";
    }
 }
 mysqli_close($conn);
 ?>
```

* En el fichero `schema.sql` encontramos las instrucciones sql necesarias para inicializar la base de datos.

## Configurar nuestra aplicación con variables de entorno

En los casos en que necesitamos modificar algo en la aplicación o hacer algún proceso en el momento de crear el contenedor, lo que hacemos es crear un script en bash que copiaremos en la imagen y que será la instrucción que indiquemos en el `CMD`. Este script en concreto hará las siguiente operaciones:

1. Utilizando el fichero `schema.sql` (que también guardaremos en la imagen) inicializará la base de datos.
2. Ejecutar el servidor web en segundo plano.

En el directorio de trabajo encontramos:

* `build`: Será el contexto necesario para crear la imagen de la aplicación.
* El fichero `compose.yaml`: Para crear el escenario.

## El contexto (directorio build)

En el directorio de contexto tendremos tres ficheros:

### Fichero script.sh

El fichero `script.sh` que se guardará en la imagen y se ejecutará con al iniciar el contenedor. Su contenido es el siguiente:

```bash
#!/bin/bash
while ! mysql -u ${DB_USER} -p${DB_PASS} -h ${DB_HOST}  -e ";" ; do
	sleep 1
done	
mysql -u ${DB_USER} -p${DB_PASS} -h ${DB_HOST} ${DB_NAME} < /opt/schema.sql
apache2ctl -D FOREGROUND
```

Esperamos hasta que la base de datos esté disponible, inicializamos la base de datos con el fichero `schema.sql` y finalmente iniciamos el servidor web.

### Fichero schema.sql

Son las instrucciones sql que nos permiten crear la tabla necesaria en la base de datos.

### Fichero Dockerfile

El fichero`Dockerfile` sería el siguiente:

```Dockerfile
# syntax=docker/dockerfile:1
FROM php:7.4-apache
RUN apt-get update && apt-get install -y mariadb-client
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
COPY app /var/www/html/
EXPOSE 80
ENV DB_USER user1
ENV DB_PASS asdasd
ENV DB_NAME usuarios
ENV DB_HOST mariadb
COPY script.sh /usr/local/bin/script.sh
COPY schema.sql /opt
RUN chmod +x /usr/local/bin/script.sh
CMD /usr/local/bin/script.sh

```

Algunas observaciones:

1. Creamos la imagen desde una imagen PHP.  
2. Instalamos el cliente de MariaDB que nos hará falta para inicializar la base de datos desde nuestro contenedor de la aplicación.
3. Siguiendo la documentación de la [imagen oficial de PHP](https://hub.docker.com/_/php) instalamos el módulo PHP `mysqli`.
4. Copiamos la aplicación en el servidor web.
6. Creamos las variables de entorno y le damos valores por defecto, por si no se indican en la creación del contenedor.
7. Copiamos los ficheros del script y del esquema de la base de datos a la imagen. Y le damos permisos de ejecución a `script.sh`.
8. Finalmente indicamos con `CMD` el comando que se va a ejecutar al iniciar el contenedor. En este caso ejecutaremos el script.

### Creación de la imagen

Ejecutamos dentro del directorio de contexto:

```bash
$ docker build -t josedom24/aplicacion_php .
```

## Despliegue de la aplicación 

Usaremos el fichero `compose.yaml`:

```yaml
version: '3.1'
services:
  app:
    container_name: contenedor_php
    image: josedom24/aplicacion_php
    restart: always
    environment:
      DB_HOST: servidor_mariadb
      DB_USER: user1
      DB_PASS: asdasd
      DB_NAME: usuarios
    ports:
      - 8080:80
    depends_on:
      - db
  db:
    container_name: servidor_mariadb
    image: mariadb
    restart: always
    environment:
      MARIADB_DATABASE: usuarios
      MARIADB_USER: user1
      MARIADB_PASSWORD: asdasd
      MARIADB_ROOT_PASSWORD: asdasd
    volumes:
      - mariadb_data:/var/lib/mysql
volumes:
    mariadb_data:
```

Y ya podemos levantar el escenario, ejecutando:

```bash
$ docker compose up -d
```

Y finalmente podemos acceder a la aplicación y comprobar que funciona.
---

# Ejemplo 5: Configuración de imágenes con una aplicación Java

En este ejemplo vamos a estudiar como podemos trabajar con el [Servidor de Aplicaciones Apache Tomcat](https://tomcat.apache.org/). Para hacer las pruebas vamos a usar la imagen Docker `bitnami/tomcat` cuya [documentación](https://hub.docker.com/r/bitnami/tomcatJava) puedes encontrar en Docker Hub.

Puedes encontrar los ficheros necesarios en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

En primer lugar vamos a crear un contenedor Docker desde la imagen `bitnami/tomcat` y vamos a hacer un despliegue de un fichero war de forma manual. Además vamos a configurar el contenedor para indicar el usuario y la contraseña que nos va a permitir acceder a la web de administración de Tomcat. Para ello ejecutamos:

```bash
$ docker run -d -p 8080:8080 -e TOMCAT_USERNAME=admin -e TOMCAT_PASSWORD=my-password --name mytomcat bitnami/tomcat:9.0
```

Podemos acceder desde un navegador web, y entraríamos en la página principal de Tomcat:

![tomcat](img/ejemplo5_1.png)

Si accedemos a la URL `/manager/html` entraremos a la zona de administración. Para acceder tendremos que indicar el nombre y la contraseña que hemos indicado en las variables de entorno:

![tomcat](img/ejemplo5_2.png)

Podríamos hacer el despliegue de la aplicación de ejemplo que tenemos desde la zona de administración, pero vamos a copiar el fichero war directamente al directorio de despliegue. En esta imagen dicho directorio es `/opt/bitnami/tomcat/webapps` o `/app` que es un enlace simbólico al directorio anterior. De esta manera:

 ```bash
$ docker cp sample.war mytomcat:/app
```

Para entrar a la aplicación podemos acceder a la URL `/sample`:

![tomcat](img/ejemplo5_3.png)

Por último es muy sencillo crear una nueva imagen con nuestra aplicación desplegada. El fichero `Dockerfiile` sería de la siguiente forma:

```Dockerfile
# syntax=docker/dockerfile:1
FROM bitnami/tomcat:9.0
COPY sample.war /opt/bitnami/tomcat/webapps
```

Creamos la nueva imagen y ejecutamos un nuevo contenedor:

```bash
$ docker build -t josedom24/app_java:v1 .
$ docker run -d -p 8081:8080 -e TOMCAT_PASSWORD=my-password --name app_java josedom24/app_java:v1
```

Finalmente podemos acceder a la aplicación utilizando un navegador web.

---

# Introducción a la construcción y distribución de imágenes Docker

## Construcción de imágenes Docker

Hasta ahora hemos creado contenedores a partir de las imágenes que encontramos en Docker Hub. Estas imágenes las han creado otras personas.

Para crear un contenedor que sirva nuestra aplicación, tendremos que crear una imagen personalizada, es lo que llamamos **"dockerizar"** una aplicación.

![docker](img/build.png)

Tenemos dos mecanismos para construir nueva imágenes:

* **A partir de un contenedor**, podemos crea una nueva imagen usando el comando `docker commit`.
* **Automatizar la construcción** de una imagen Docker declarando los comandos que hay que ejecutar en un fichero llamado `Dockerfile` y usando el comando `docker build` para realizar la construcción.

## Ventajas de la construcción de imágenes usando Dockerfile

El método preferido para la creación de imágenes es el uso de ficheros `Dockerfile` y el comando `docker build`. Los motivos son los siguientes:

* **Podremos reproducir la imagen fácilmente** ya que en el fichero `Dockerfile` tenemos todas y cada una de las órdenes necesarias para la construcción de la imagen. Además el fichero `Dockerfile` se puede distribuir de manera muy sencilla y versionar usando un sistema de control de versiones.
* De manera sencilla podemos **cambiar la imagen base** usando un fichero `Dockerfile`, únicamente tendremos que modificar la primera línea de ese fichero como explicaremos posteriormente.

## Distribución de imágenes Docker

Una vez que hemos creado nuestra imagen personalizada, es hora de distribuirla para desplegarla en el entorno de producción. Para ello vamos a tener varias posibilidades:

* Utilizando los comandos `docker load`, que nos permite guardar una imagen en un fichero que podemos distribuir, para luego recuperar la imagen desde ese fichero con el comando `docker save`.
* Utilizando un registro de imágenes Docker, por ejemplo Docker Hub. En este caso usaremos el comando `docker push` para subir la imagen al registro y posteriormente podremos bajarla usando `docker pull`.
---

# Eliminar objetos Docker no utilizados

## Eliminar imágenes huérfanas

Cuando empezamos a construir nuestras propias imágenes Docker, nos encontramos que al listar las imágenes aparecen algunas con el nombre y la etiqueta con el valor `<none>`. Estas son imágenes intermedias que se han generado y que no forman parte de ninguna imagen, por lo tanto pueden ocupar espacio en disco que no es necesario. Estas imágenes se llaman "colgadas" (dangling).

Por ejemplo:

```bash
$ $ docker images
REPOSITORY           TAG       IMAGE ID       CREATED          SIZE
josedom24/ejemplo1   v1        c23cf3f2d251   3 minutes ago    187MB
<none>               <none>    ea9228809799   36 minutes ago   187MB
...
```
Si queremos borrar estas imágenes podemos ejecutar:

```bash
$ docker image prune
WARNING! This will remove all dangling images.
Are you sure you want to continue? [y/N]
```

Si además añadimos el parámetro `-a` se eliminaran todas las imágenes que no tienen ningún contenedor creado.

```bash
$ docker image prune -a
WARNING! This will remove all images without at least one container associated to them.
Are you sure you want to continue? [y/N] 
```

## Eliminar otros objetos Docker

Si queremos eliminar los contenedores que están parados, podemos ejecutar:

```bash
$ docker container prune
WARNING! This will remove all stopped containers.
Are you sure you want to continue? [y/N] 
```

Para eliminar redes que no se estén utilizando podemos ejecutar:

```bash
$ docker network prune
WARNING! This will remove all custom networks not used by at least one container.
Are you sure you want to continue? [y/N] 
```

Para eliminar volúmenes que no se están utilizando por ningún contenedor:

```bash
$ docker volume prune
WARNING! This will remove anonymous local volumes not used by at least one container.
Are you sure you want to continue? [y/N] 
```

Por último, podemos borrar todos los elementos que no se están utilizando con una sola instrucción: `docker system prune`. Para borrar los volúmenes no usados debemos usar el parámetro `--volumes`:

```bash
$ docker system prune --volumes
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all anonymous volumes not used by at least one container
  - all dangling images
  - unused build cache

Are you sure you want to continue? [y/N] 
```




---

# Uso de ficheros Dockerfile parametrizados

El uso de parámetros en la creación de ficheros `Dockerfile` es una buena forma de añadir flexibilidad a tus construcciones de imágenes Docker. El valor de estos parámetros se pueden pasar a la hora de construir la imagen con el comando `docker build` o indicados valores predeterminados si no se especifican en el momento de la construcción.

Puedes encontrar los ficheros necesarios en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

Veamos un ejemplo:

```Dockerfile
# syntax=docker/dockerfile:1
ARG PHP_VERSION=8.2-apache
FROM php:${PHP_VERSION}
ARG APP_VERSION=desarrollo
ENV VERSION=${APP_VERSION}
COPY app /var/www/html/
EXPOSE 80
```

Para crear los parámetros usamos la instrucción `ARG` en el fichero `Dockerfile`. Hemos creado dos parámetros en la definición del fichero `Dockerfile`:

* `PHP_VERSION`: Donde vamos a indicar la etiqueta de la imagen PHP que vamos a usar en la construcción. Su valor por defecto es `8.2-apache` y como vemos, para hacer referencia a ella usamos `${PHP_VERSION}`.
* `APP_VERSION`: Es un parámetro donde vamos a guardar la versión de la aplicación (`desarrollo`) y que posteriormente utilizaremos para darle valor a la variable de entorno `VERSION`.

Si construimos la imagen sin sobrescribir los valores de los parámetros se tomarán los valores por defecto:

```bash
$ docker build  -t josedom24/app_php:v1 .
$ docker run -d -p 8081:80 --name app1 josedom24/app_php:v1
$ docker exec -it app1 env
...
VERSION=desarrollo
...
```

Como vemos se ha creado una imagen a partir de la imagen `php:8.2-apache` y se ha creado una variable de entorno `VERSION` con el valor por defecto. Si accedemos a la página con un navegador web, veremos la versión de PHP y el valor de la variable de entorno que hemos creado (también podríamos acceder al fichero `info.php` para ver esta información):

![php](img/variables1.png)

Podemos crear otra versión de la imagen sobreescribiendo los parámetros de construcción, para ello usamos el parámetro `--build-arg` en el comando `docker build`:

```bash
$ docker build --build-arg PHP_VERSION=7.4-apache --build-arg APP_VERSION=produccion -t josedom24/app_php:v2 .
$ docker run -d -p 8082:80 --name app2 josedom24/app_php:v2
$ docker exec -it app2 env
...
VERSION=produccion
...
```

Accedemos a esta nueva aplicación y vemos los parámetros que hemos configurado:

![php](img/variables2.png)

