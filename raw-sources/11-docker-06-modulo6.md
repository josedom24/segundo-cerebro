# Módulo 06: Docker Compose

**Fuente:** Curso Docker 2024 - modulo6
**Autor:** José Domingo González López
**URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo6
**URL GitHub:** https://github.com/josedom24/curso_docker_ow



---

# Almacenamiento con Docker Compose

## Definiendo volúmenes Docker con Docker Compose

Además de definir los servicios (parámetro `services`) en el fichero `compose.yaml`, podemos definir los volúmenes que vamos a necesitar en nuestra infraestructura. Además, como hemos visto, podremos indicar que volumen va a utilizar cada contenedor.

Veamos un ejemplo, puedes encontrar el fichero en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

El contenido del fichero `compose.yaml` es:

```yaml
version: '3.1'
services:
  db:
    container_name: contenedor_mariadb
    image: mariadb
    restart: always
    environment:
      MARIADB_ROOT_PASSWORD: asdasd
    volumes:
      - mariadb_data:/var/lib/mysql
volumes:
    mariadb_data:
```

Y podemos iniciar el escenario:

```bash
$ docker compose up -d
[+] Running 3/3
 ✔ Network mariadb_default        Created                                         0.1s 
 ✔ Volume "mariadb_mariadb_data"  Created                                         0.0s 
 ✔ Container contenedor_mariadb   Started                                         0.5s

$ docker compose ps
NAME                 IMAGE     COMMAND                           SERVICE   CREATED              STATUS              PORTS
contenedor_mariadb   mariadb   "docker-entrypoint.sh mariadbd"   db        About a minute ago   Up About a minute   3306/tcp
```

Y comprobamos que se ha creado un nuevo volumen:

```bash
$ docker volume ls
DRIVER    VOLUME NAME
local     mariadb_mariadb_data
...
```

En la definición del servicio `db` hemos indicado que el contenedor montará el volumen en un directorio determinado con el parámetro `volumes`. Podemos comprobar que efectivamente se ha realizado el montaje:

```bash
$ docker inspect -f '{{json .Mounts}}' contenedor_mariadb
[{"Type":"volume","Name":"mariadb_mariadb_data","Source":"/var/lib/docker/volumes/mariadb_mariadb_data/_data","Destination":"/var/lib/mysql","Driver":"local","Mode":"z","RW":true,"Propagation":""}]
```

Recuerda que si necesitas iniciar el escenario desde 0, debes eliminar el volumen:

```bash
$ docker compose down -v
[+] Running 3/3
 ✔ Container contenedor_mariadb  Removed                                          0.8s 
 ✔ Volume mariadb_mariadb_data   Removed                                          0.1s 
 ✔ Network mariadb_default       Removed                                          0.1s
```

## Utilización de bind mount con Docker Compose

De forma similar podemos indicar que un contenedor va a utilizar bind mount como almacenamiento. En este caso sería:

```yaml
version: '3.1'
services:
  db:
    container_name: contenedor_mariadb
    image: mariadb
    restart: always
    environment:
      MARIADB_ROOT_PASSWORD: asdasd
    volumes:
      - ./data:/var/lib/mysql
```

Y después de iniciar el escenario podemos ver cómo se ha creado el directorio `data`:

```bash
$ cd data/
/data$ ls
aria_log.00000001  aria_log_control  ibdata1  ib_logfile0  ibtmp1  mysql
```

Hay que tener en cuenta que si usamos bind mount, el comando `docker compose down -v` no eliminará el directorio donde se guardan los datos, en este caso `./data`.

---

# El comando docker compose

Vamos a usar la instrucción `docker compose` para gestionar el ciclo de vida del escenario que tenemos definido en el fichero `compose.yaml`. 

Puedes encontrar el fichero en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

**Es importante destacar que debemos ejecutar `docker compose` en el directorio en el que se encuentra el fichero `compose.yaml`**.

## Despliegue de Let's Chat

[Let’s Chat](https://github.com/sdelements/lets-chat) es una aplicación web escrita en Node.js que utilizando una base de datos MongoDB nos posibilita la creación de salas de chats.

Accedemos al directorio donde se encuentra el fichero `compose.yaml` donde hemos definido el escenario para ejecutar la aplicación Let's Chat y  ejecutamos la siguiente instrucción para crear los contenedores:

```bash
docker compose up -d
[+] Running 4/4
 ✔ Network escenario_letschat_default  Created                                      0.1s 
 ✔ Volume "escenario_letschat_mongo"   Create...                                    0.0s 
 ✔ Container mongo                     Started                                      0.3s 
 ✔ Container letschat                  Started                                      0.2s 
```

El parámetro `-d` de la instrucción `docker compose up` nos permite ejecutar los contenedores de forma desatendida (similar al parámetro `-d` en `docker run`). 

Tenemos que tener en cuenta que si no tenemos las imágenes en nuestro registro local, se descargarán. Además podemos ver cómo se ha creado una red bridge definida por el usuario. Esta red se crea con el nombre del proyecto (en nuestro caso el indicado con el parámetro `name`, si no indicamos este parámetro el nombre será el del directorio donde se encuentra el fichero `compose.yaml`) y el termino `default`. También observamos que se ha creado un volumen, en este caso su nombre será el del proyecto unido al nombre que hemos indicado en su definición.

Podemos ver los contenedores que se están ejecutando:

```bash
$ docker compose ps
NAME       IMAGE                  COMMAND                         SERVICE   CREATED              STATUS              PORTS
letschat   sdelements/lets-chat   "npm start"                     app       About a minute ago   Up About a minute   5222/tcp, 0.0.0.0:80->8080/tcp, :::80->8080/tcp
mongo      mongo:4                "docker-entrypoint.sh mongod"   db        About a minute ago   Up About a minute   27017/tcp
```

Podemos acceder desde el navegador a la aplicación:

![letschat](img/letschat.png)


Veamos más comandos que podemos ejecutar con Docker Compose:

* `docker compose stop`: Detiene los contenedores que previamente se han lanzado con `docker compose up`.
* `docker compose run`: Inicia los contenedores descritos en el `compose.yaml` que estén parados.
* `docker compose rm`: Borra los contenedores parados del escenario. Con las opción `-f` elimina también los contenedores en ejecución.
* `docker compose pause`: Pausa los contenedores que previamente se han lanzado con `docker compose up`.
* `docker compose unpause`: Reanuda los contenedores que previamente se han pausado.
* `docker compose restart`: Reinicia los contenedores. Orden ideal para reiniciar servicios con nuevas configuraciones.
* `docker compose logs`: Muestra los logs de todos los servicios del escenario. Con el parámetro `-f` podremos ir viendo los logs en "vivo".
* `docker compose logs servicio1`: Muestra los logs del servicio llamado `servicio1` que estaba descrito en el `compose.yaml`.
* `docker compose exec servicio1 /bin/bash`: Ejecuta una orden, en este caso `/bin/bash` en el servicio `servicio1` que estaba descrito en el `compose.yaml`
* `docker compose top`: Muestra  los procesos que están ejecutándose en cada uno de los contenedores de los servicios.


Para destruir los contenedores creados en el escenario y la red, ejecutamos:

```bash
$ docker compose down
[+] Running 3/3
 ✔ Container letschat        Removed                                             10.4s 
 ✔ Container mongo           Removed                                              0.4s 
 ✔ Network letschat_default  Removed                                              0.1s 
```

Si además queremos eliminar el volumen que se ha creado, usaremos el parámetro `-v`:

```bash
$ docker compose down -v
```



---

# Creando escenarios multicontenedor con Docker Compose

Como hemos visto hasta ahora, en muchas ocasiones necesitamos correr varios contenedores para que nuestra aplicación funcione. En cualquiera de estos casos es necesario tener varios contenedores:

* Si tenemos **aplicaciones monolíticas**, vamos a usar un esquema **multicapa**. Necesitamos **varios servicios** para que la aplicación funcione. Partiendo del principio de que cada contenedor ejecuta un sólo proceso, si necesitamos que la aplicación use varios servicios (web, base de datos, proxy inverso, ...) cada uno de ellos se implementará en un contenedor.
* Si tenemos construida nuestra aplicación con **microservicios**, cada uno de ellos se podrá implementar en un contenedor independiente.

Cuando trabajamos con escenarios donde necesitamos correr varios contenedores podemos utilizar [Docker Compose](https://docs.docker.com/compose/) para gestionarlos.

Vamos a definir el escenario en un fichero llamado `compose.yaml` y vamos a gestionar el ciclo de vida de la aplicación y de todos los contenedores que necesitamos con el comando `docker compose`.

El fichero de definición del escenario también puede ser llamado `compose.yml`, y por compatibilidad con versiones antiguas se puede llamar `docker-compose.yaml` o `docker-compose.yml`.

## Docker Compose V2

Como vemos en la página principal de Docker Compose, el pasado mes de julio de 2023 la versión V1 de Compose dejo de recibir actualizaciones. Por esta razón es muy conveniente usar la versión Compose V2 que viene integrada en el cliente Docker.

En Compose V1 no podíamos hacer uso de Docker Compose utilizando el cliente Docker y teníamos que instalar un programa independiente, escrito en Python, que se llama **docker-compose**. Sin embargo, con Compose V2 se incluye en el cliente Docker la posibilidad de trabajar con Compose usando el comando `docker compose`.

Hay algunas diferencias entre las dos versiones, pero se ha mantenido en un alto porcentaje la compatibilidad y por tanto podemos seguir usando los ficheros `docker-compose.yaml` de Compose V1 en la versión 2.

## Ventajas de usar Docker Compose

* Hacer todo de manera **declarativa** para que no tenga que repetir todo el proceso cada vez que construyo el escenario.
* Los archivos de declaración de Docker Compose se pueden **distribuir** de manera sencilla, aumentando la colaboración entre los equipos de desarrollo.
* Poner en funcionamiento todos los contenedores que necesita mi aplicación de una sola vez y debidamente configurados.
* Garantizar que los contenedores **se arrancan en el orden adecuado**. Por ejemplo: mi aplicación no podrá funcionar debidamente hasta que no esté el servidor de bases de datos funcionando en marcha.
* Asegurarnos de que hay **comunicación** entre los contenedores que pertenecen a la aplicación.
* **Portabilidad entre entornos**: Compose admite variables en el archivo de declaración. Puede utilizar estas variables para personalizar su composición para diferentes entornos o diferentes usuarios.
---

# El fichero compose.yaml

En el fichero `compose.yaml` vamos a definir un escenario multicontenedor usando el formato YAML. **La instrucción `docker compose` se debe ejecutar en el directorio donde se encuentra ese fichero**. Por lo tanto tenderemos un directorio con un fichero `compose.yaml` para cada una de las aplicaciones que queremos desplegar. 

Puedes encontrar los ficheros necesarios para este ejemplo en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

Veamos un fichero de ejemplo `compose.yaml` donde se define el escenario para desplegar la aplicación [Let's Chat](https://github.com/sdelements/lets-chat) que es un chat escrito en NodeJS, que guarda su información en una base de datos MongoDB:

```yaml
version: '3.1'
name: 'escenario_letschat'
services:
  app:
    container_name: letschat
    image: sdelements/lets-chat
    restart: always
    environment:
      LCB_DATABASE_URI: mongodb://mongo/letschat
    ports:
      - 80:8080
    depends_on:
      - db
  db:
    container_name: mongo
    image: mongo:4
    restart: always
    volumes:
      - mongo:/data/db
volumes:
  mongo:
```

## Estructura del fichero compose.yaml

* El parámetro `version` indica el formato de fichero Docker Compose que se está utilizando. Se usa sólo a nivel informativo, no es necesario indicarlo.
* Podemos indicar un nombra al escenario con el parámetro `name`. Si no se indica el nombre del proyecto será el nombre del directorio donde se encuentra el fichero `compose.yaml`.
* Es escenario está formado por `services`. Cada uno ello representa un contenedor.
* Podemos declarar volúmenes con el parámetros `volumes` y declarar redes con el parámetro `network`.

## Definición de los servicios

Como hemos comentado con el parámetro `services` se define la lista de contenedores y su configuración que formarán parte del escenario. Veamos algunos aspectos de la configuración de un servicio:

* Cada servicio tiene un nombre, en nuestro ejemplo se llaman `app` y `db`.
* En la definición del contenedor indicamos un nombre (parámetro `container_name`), la imagen (con el parámetro `image`), las variables de entorno (parámetro `environment`), el mapeo de puertos (parámetro `ports`), los volúmenes (parámetro `volume`),... Iremos estudiando los distintos parámetros cuando veamos más ejemplos.
* `restart: always`: Indicamos la política de reinicio del contenedor si por cualquier circunstancia se para. [Más información](https://docs.docker.com/compose/compose-file/compose-file-v3/#restart).
* `depend on`: Indica la dependencia entre contenedores. No se va a iniciar un contenedor hasta que otro este funcionando. [Más información](https://docs.docker.com/compose/compose-file/compose-file-v3/#depends_on).
* Puedes encontrar todos los parámetros que podemos definir en la [documentación oficial](https://docs.docker.com/compose/compose-file/compose-file-v3/).

## Introducción a las redes con Docker Compose

Cuando creamos un escenario con `docker compose` se crea una **nueva red bridge definida por el usuario** donde se conectan los contenedores, por lo tanto, obtenemos resolución por DNS que resuelve tanto el nombre del contenedor (por ejemplo, `mongo`) como el nombre del servicio (por ejemplo, `db`).


---

# Ejemplo 1: Despliegue de la aplicación Guestbook

En este ejemplo vamos a desplegar con Docker Compose la aplicación Guestbook, que estudiamos en un módulo anterior.

Puedes encontrar el fichero `compose.yaml` en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

El contenido del fichero `compose.yaml` es:

```yaml
  version: '3.1'
services:
  app:
    container_name: guestbook
    image: iesgn/guestbook
    restart: always
    environment:
      REDIS_SERVER: redis
    ports:
      - 8080:5000
  db:
    container_name: redis
    image: redis
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redis:/data
volumes:
  redis:
```

Veamos algunas observaciones:

* Aunque ya sabemos que la variable de entorno `REDIS_SERVER` tiene el valor `redis` por defecto, la hemos indicado para configurar el nombre del contenedor redis.
* Podríamos haber usado también el nombre del servicio, es decir, `REDIS_SERVER: db`, ya que, como hemos comentado, la resolución se puede hacer usando el nombre del contenedor o el nombre del servicio.
* Como vimos cuando desplegamos esta aplicación en un módulo anterior, al crear el contenedor tenemos que ejecutar el comando `redis-server --appendonly yes` para que redis guarde la información de la base de datos en el directorio `/datos`. Para indicar el comando que hay que ejecutar al crear el contenedor usamos el parámetro `command`.
* Por último indicar que hemos usado un volumen docker llamado `redis` para guardar la información de la base de datos.

Para crear el escenario:

```bash
$ docker compose up -d
[+] Running 4/4
 ✔ Network guestbook_default  Created                                                            0.3s 
 ✔ Volume "guestbook_redis"   Created                                                            0.0s 
 ✔ Container redis            Started                                                            0.5s 
 ✔ Container guestbook        Started                                                            0.5s
```

Para listar los contenedores:

```bash
$ docker compose ps
NAME        IMAGE             COMMAND                                                SERVICE   CREATED          STATUS          PORTS
guestbook   iesgn/guestbook   "python3 app.py"                                       app       18 seconds ago   Up 16 seconds   0.0.0.0:8080->5000/tcp, :::8080->5000/tcp
redis       redis             "docker-entrypoint.sh redis-server --appendonly yes"   db        18 seconds ago   Up 16 seconds   6379/tcp
```

Para parar los contenedores:

```bash
$ docker compose stop
[+] Stopping 2/2
 ✔ Container guestbook  Stopped                                                                  0.8s 
 ✔ Container redis      Stopped                                                                  0.8s 
```

Para eliminar el escenario:

```bash
$ docker compose down
[+] Running 3/3
 ✔ Container redis            Removed                                                            0.0s 
 ✔ Container guestbook        Removed                                                            0.0s 
 ✔ Network guestbook_default  Removed                                                            0.3s 
```

Recuerda que para eliminar también el volumen usaremos `docker compose down -v`.


---

# Ejemplo 2: Despliegue de la aplicación Temperaturas

En este ejemplo vamos a desplegar con Docker Compose la aplicación Temperaturas, que estudiamos en un módulo anterior.

Puedes encontrar el fichero `compose.yaml` en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

En este caso el fichero `compose.yaml` puede tener este contenido:

```yaml
version: '3.1'
services:
  frontend:
    container_name: temperaturas-frontend
    image: iesgn/temperaturas_frontend
    restart: always
    ports:
      - 8081:3000
    environment:
      TEMP_SERVER: temperaturas-backend:5000
    depends_on:
      - backend
  backend:
    container_name: temperaturas-backend
    image: iesgn/temperaturas_backend
    restart: always
```

Como hicimos en el ejemplo anterior, aunque no es necesario porque es el valor por defecto, declaramos la variable de entorno `TEMP_SERVER: temperaturas-backend:5000`. Como indicábamos también, podríamos usar el nombre del servicio, de esta manera quedaría como `TEMP_SERVER: backend:5000`.

Para crear el escenario:

```bash
$ docker compose up -d
[+] Running 3/3
 ✔ Network temperaturas_default     Created                                                      0.3s 
 ✔ Container temperaturas-backend   Started                                                      0.2s 
 ✔ Container temperaturas-frontend  Started                                                      0.2s 
```

Para listar los contenedores:

```bash
$ docker compose ps
NAME                    IMAGE                         COMMAND            SERVICE    CREATED          STATUS          PORTS
temperaturas-backend    iesgn/temperaturas_backend    "python3 app.py"   backend    20 seconds ago   Up 18 seconds   5000/tcp
temperaturas-frontend   iesgn/temperaturas_frontend   "python3 app.py"   frontend   20 seconds ago   Up 17 seconds   0.0.0.0:8081->3000/tcp, :::8081->3000/tcp
```
---

---

# Ejemplo 3: Despliegue de WordPress + MariaDB

En este ejemplo vamos a desplegar con Docker Compose la aplicación WordPress + MariaDB, que estudiamos en un módulo anterior.

Puedes encontrar el fichero `compose.yaml` en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

## Utilizando volúmenes Docker

Por ejemplo para la ejecución de WordPress persistente con volúmenes Docker podríamos tener un fichero `compose.yaml` con el siguiente contenido:

```yaml
version: '3.1'
services:
  wordpress:
    container_name: servidor_wp
    image: wordpress
    restart: always
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: user_wp
      WORDPRESS_DB_PASSWORD: asdasd
      WORDPRESS_DB_NAME: bd_wp
    ports:
      - 80:80
    volumes:
      - wordpress_data:/var/www/html
  db:
    container_name: servidor_mysql
    image: mariadb
    restart: always
    environment:
      MARIADB_DATABASE: bd_wp
      MARIADB_USER: user_wp
      MARIADB_PASSWORD: asdasd
      MARIADB_ROOT_PASSWORD: asdasd
    volumes:
      - mariadb_data:/var/lib/mysql
volumes:
    wordpress_data:
    mariadb_data:
```

Para crear el escenario:

```bash
$ docker compose up -d
[+] Running 5/5
 ✔ Network wordpress_default          Created                                                    0.2s 
 ✔ Volume "wordpress_wordpress_data"  Created                                                    0.0s 
 ✔ Volume "wordpress_mariadb_data"    Created                                                    0.0s 
 ✔ Container servidor_mysql           Started                                                    0.5s 
 ✔ Container servidor_wp              Started                                                    0.5s 
```

Para listar los contenedores:

```bash
$ docker compose ps
NAME             IMAGE       COMMAND                                     SERVICE     CREATED          STATUS          PORTS
servidor_mysql   mariadb     "docker-entrypoint.sh mariadbd"             db          21 seconds ago   Up 19 seconds   3306/tcp
servidor_wp      wordpress   "docker-entrypoint.sh apache2-foreground"   wordpress   21 seconds ago   Up 19 seconds   0.0.0.0:80->80/tcp, :::80->80/tcp
```

Para parar los contenedores:

```bash
$ docker compose stop
[+] Stopping 2/2
 ✔ Container servidor_mysql  Stopped                                                             0.9s 
 ✔ Container servidor_wp     Stopped                                                             1.8s 
```

Para borrar los contenedores:

```bash
$ docker compose rm
? Going to remove servidor_wp, servidor_mysql Yes
[+] Removing 2/0
 ✔ Container servidor_mysql  Removed                                                             0.0s 
 ✔ Container servidor_wp     Removed                                                             0.0s 
```

Para eliminar el escenario (contenedores, red y volúmenes):

```bash
$ docker compose down -v
...
```

## Utilizando bind-mount

Por ejemplo para la ejecución de WordPress persistente con bind mount podríamos tener un fichero `compose.yaml` con el siguiente contenido:

```yaml
version: '3.1'
services:
  wordpress:
    container_name: servidor_wp
    image: wordpress
    restart: always
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: user_wp
      WORDPRESS_DB_PASSWORD: asdasd
      WORDPRESS_DB_NAME: bd_wp
    ports:
      - 80:80
    volumes:
      - ./wordpress:/var/www/html
  db:
    container_name: servidor_mysql
    image: mariadb
    restart: always
    environment:
      MARIADB_DATABASE: bd_wp
      MARIADB_USER: user_wp
      MARIADB_PASSWORD: asdasd
      MARIADB_ROOT_PASSWORD: asdasd
    volumes:
      - ./mysql:/var/lib/mysql
```
---

# Ejemplo 4: Despliegue de Apache Tomcat + nginx 

En este ejemplo vamos a desplegar con Docker Compose la aplicación Java con Tomcat y nginx como proxy inverso que vimos en un módulo anterior.

Puedes encontrar el fichero `compose.yaml` en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

El fichero `compose.yaml` sería:

```yaml
version: '3.1'
services:
  aplicacionjava:
    container_name: tomcat
    image: tomcat:9.0
    restart: always
    volumes:
      - ./sample.war:/usr/local/tomcat/webapps/sample.war:ro
  proxy:
    container_name: nginx
    image: nginx
    ports:
      - 80:80
    volumes:
      - ./default.conf:/etc/nginx/conf.d/default.conf:ro
```

Como podemos ver en el directorio donde tenemos guardado el `compose.yaml`, tenemos los dos ficheros: por un lado la aplicación en el fichero `sample.war` y por otro, el fichero de configuración de nginx `default.conf`.

Creamos el escenario:

```bash
$ docker compose up -d
...
```

Comprobar que los contenedores están funcionando:

```bash
$ docker compose ps
...
```

Y acceder al puerto 80/tcp de la dirección IP del Host Docker para acceder a la aplicación.
---

# Ejemplos reales de despliegues usando Docker Compose

En la actualidad la mayoría de los despliegues reales que se hacen con Docker, se realizan usando la herramienta **Docker Compose**, veamos algunos ejemplos:

## Despliegue de Jitsi

[Jitsi](https://meet.jit.si/) es una aplicación de videoconferencia, VoIP, y mensajería instantánea con aplicaciones nativas para iOS y Android, y con soporte para Windows, Linux y Mac OS a través de la web.​ Es compatible con varios protocolos populares de mensajería instantánea y de telefonía, y se distribuye bajo los términos de la licencia Apache, por lo que es software libre y de código abierto. 

Podemos encontrar las instrucciones para desplegarlo con Docker en esta [página](https://github.com/jitsi/docker-jitsi-meet):

1. Descargamos los ficheros del repositorio, descomprimimos el fichero zip y accedemos al directorio:

    ```bash
    $ wget $(curl -s https://api.github.com/repos/jitsi/docker-jitsi-meet/releases/latest | grep 'zip' | cut -d\" -f4)
    $ unzip stable-9258
    $ cd jitsi-docker-jitsi-meet-c92026a/
    ```

2. Utilizamos el fichero de variables globales para configurar la aplicación:

    ```bash
    $ cp env.example .env
    ```

    Tenemos que generar contraseñas dentro de este fichero ejecutando:

    ```bash
    $ ./gen-passwords.sh
    ```

    Además tenemos que indicar el parámetro `PUBLIC_URL`, que está comentado, con la URL que vamos a usar para acceder a la aplicación, por ejemplo:

    ```
    PUBLIC_URL=https://localhost:8443
    ```

3. Creamos los directorios donde vamos a guardar la información de la aplicación:

    ```bash
    $ mkdir -p ~/.jitsi-meet-cfg/{web,transcripts,prosody/config,prosody/prosody-plugins-custom,jicofo,jvb,jigasi,jibri}
    ```

4. Levantamos el escenario y accedemos a la URL que hemos indicado anteriormente desde un navegador web:

    ```bash
    $ docker compose up -d
    ```

    Se crean 4 contenedores que corresponde a cuatro componentes de Jitsi:

    * `web`: Jitsi Meet web UI, aplicación web servida por nginx.
    * `prosody`: [Prosody](https://prosody.im/), servidor XMPP.
    * `jicofo`: [Jicofo], el componente JItsi COnference FOcus.
    * `jvb`: [Jitsi Videobridge](https://github.com/jitsi/jitsi-videobridge), el enrutador de vídeo.

![jitsi](img/jitsi.png)

## Despliegue de Guacamole

[Apache Guacamole](https://guacamole.apache.org/) es un cliente (aplicación web HTML5) capaz de ofrecer funcionalidades para acceso remoto a servidores y otros equipos remotos desde cualquier parte solo con la ayuda de una conexión y un navegador web. 

Podemos instalar [Guacamole con docker](https://guacamole.apache.org/doc/gug/guacamole-docker.html) y aunque en esa página no tenemos el fichero `docker-compose.yml` podemos encontrar ejemplos de instalaciones de muchos usuarios en [GitHub](https://github.com/boschkundendienst/guacamole-docker-compose/).

Las instrucciones que tenemos que ejecutar son las siguientes:

```bash
$ git clone https://github.com/boschkundendienst/guacamole-docker-compose.git
$ cd guacamole-docker-compose
$ ./prepare.sh
$ docker compose up -d
```

El sript `prespare.sh` inicializa la base de datos PostgreSQL, y genera los certificados autofirmados que se van a usar para el acceso por https.

Si vemos el fichero [`docker-compose.yml`](https://github.com/boschkundendienst/guacamole-docker-compose/blob/master/docker-compose.yml) se van a crear cuatro contenedores:

* `guacd`: Es el demonio de Jitsi encargado de gestionar las conexiones remotas.
* `PostgreSQL`: Base de datos donde vamos a guardar la información.
* `Guacamole`: Es la aplicación web que utilizamos para gestionar las conexiones remotas.
* `nginx`: Proxy inverso para acceder a la aplicación web.

Accedemos al la URL `https://localhost:8443` para entrar en la aplicación. El usuario y la contraseña por defecto son `guacadmin`.

![guacamole](img/guacamole.png)




---

# Redes con Docker Compose

Como hemos indicado anteriormente, cuando creamos un escenario con Docker Compose **se crea una nueva red bridge definida por el usuario donde se conectan los contenedores**, por lo tanto, obtenemos resolución por DNS que resuelve tanto el nombre del contenedor, como el nombre del servicio.

Sin embargo en el fichero `compose.yaml` podemos definir y configurar las redes que necesitemos en nuestro escenario, así como la conexión de los distintos contenedores a dichas redes.

Veamos un ejemplo, puedes encontrar el fichero en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

El contenido del fichero `compose.yaml` es:

```yaml
version: '3.1'
services:
  c1:
    container_name: contenedor1
    image: alpine
    restart: always
    networks:
      red_externa:
        ipv4_address: 192.168.10.10
      red_interna:
        ipv4_address: 192.168.20.10
    hostname: contenedor1
    command: ash

  c2:
    container_name: contenedor2
    image: alpine
    restart: always
    networks:
      red_interna:
        ipv4_address: 192.168.20.20
    hostname: contenedor2
    command: ash
networks:
    red_externa:
        ipam:
            config:
              - subnet: 192.168.10.0/24
                gateway: 192.168.10.1
    red_interna:
        ipam:
            config:
              - subnet: 192.168.20.0/24
                gateway: 192.168.20.1
```

## Definición de redes en Docker Compose

* En la definición de los contenedores, hemos configurado la conexión de los contenedores a las redes usando el parámetro `networks`:
    * Indicamos el nombre de la red a la que está conectada.
    * Indicamos su dirección IP con el parámetro `ipv4_address`. Este parámetro es optativo, sino se indica se tomará una dirección IP de forma dinámica.
    * También hemos indicado el nombre del host con el parámetro `hostname`.
* El parámetro `networks` a continuación de la definición de servicios nos permite configurar las redes que vamos a usar en el escenario:
    * Indicamos el nombre de las redes que vamos a crear.
    * Configuramos la red en el parámetro `IPAM` y `config`, por ejemplo indicando el direccionamiento con el parámetro `subnet` y la puerta de enlace de la red con el parámetro `gateway`.

## Creación del escenario

Iniciamos el escenario:

```bash
$ docker-compose up -d
[+] Running 2/4
 ✔ Network redes_red_interna  Created                                                                       5.8s 
 ✔ Network redes_red_externa  Created                                                                       5.4s 
 ✔ Container contenedor2      Started                                                                       4.8s 
 ✔ Container contenedor1      Started                                                                       5.1s 
```

Comprobamos que los dos contenedores se están ejecutando:

```bash
$ $ docker compose ps
NAME          IMAGE     COMMAND     SERVICE   CREATED          STATUS          PORTS
contenedor1   alpine    "ash"   c1        19 seconds ago   Up 13 seconds   
contenedor2   alpine    "ash"       c2        19 seconds ago   Up 14 seconds
```

Comprobamos en el `contenedor1` que el hostname se ha configurado de manera adecuada:

```bash
$ docker compose exec c1 hostname
contenedor1
```

Comprobamos que el `contenedor1` está conectado a las dos redes y tiene las direcciones que hemos indicado:

```bash
$ docker compose exec c1 ip a
257: eth1@if258: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP 
    inet 192.168.20.10/24 brd 192.168.20.255 scope global eth1
...
261: eth0@if262: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP 
    inet 192.168.10.10/24 brd 192.168.10.255 scope global eth0
...
```

Comprobamos que tenemos resolución DNS tanto con el nombre del servicio como con el nombre del contenedor:

```bash
$ docker compose exec c1 nslookup contenedor2
...
Non-authoritative answer:
Name:	contenedor2
Address: 192.168.20.20

$ docker compose exec c1 nslookup c2
...
Non-authoritative answer:
Name:	c2
Address: 192.168.20.20
```

Y por último, comprobamos que hay conectividad:

```bash
docker compose exec c1 ping contenedor2
PING contenedor2 (192.168.20.20): 56 data bytes
64 bytes from 192.168.20.20: seq=0 ttl=64 time=0.072 ms
...
```


---

# Uso de parámetros con Docker Compose

* Nuestro fichero `compose.yaml` se puede parametrizar. Determinados datos se pueden poner con una variable a la que daremos un valor en el momento de creación del escenario.
* La ventaja de parametrizar el fichero `compose.yaml` es que nos permite, con un mismo fichero, desplegar nuestras aplicaciones en diferentes entornos. Por ejemplo, en despliegues en el entorno de desarrollo tendremos unos valores para las variables, y en el despliegue en el entorno de producción tendremos otro conjunto de valores.
* Las variables tienen la forma de `clave=valor` y se guardan en un fichero llamado `.env`.
* Para utilizar las variables en el fichero `compose.yaml` utilizaremos la sintaxis `${clave}`.

Puedes encontrar los ficheros necesarios en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow).

Por ejemplo podríamos parametrizar el despliegue de WordPress + MariaDB utilizando las siguientes variables:

```yaml
version: '3.1'
services:
  wordpress:
    container_name: servidor_wp
    image: wordpress:${VERSION_WP}
    restart: always
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: ${USUARIO}
      WORDPRESS_DB_PASSWORD: ${PASS}
      WORDPRESS_DB_NAME: ${BASEDEDATOS}
    ports:
      - ${PUERTO}:80
    volumes:
      - wordpress_data:/var/www/html
  db:
    container_name: servidor_mysql
    image: mariadb:${VERSION_MDB}
    restart: always
    environment:
      MARIADB_DATABASE: ${BASEDEDATOS}
      MARIADB_USER: ${USUARIO}
      MARIADB_PASSWORD: ${PASS}
      MARIADB_ROOT_PASSWORD: ${PASS_ROOT}
    volumes:
      - mariadb_data:/var/lib/mysql
volumes:
    wordpress_data:
    mariadb_data:
```

Como puedes observar hemos parametrizado las versiones de la imágenes (`VERSION_WP` y `VERSION_MDB`), el puerto de acceso (`PUERTO`) y las credenciales de acceso a la base de datos (`USUARIO`, `PASS`,`PASS_ROOT` y `BASEDEDATOS`).

Al ejecutar `docker compose up` se busca en el mismo directorio donde está el fichero `compose.yaml` un fichero llamado `.env` con la declaración de las variables que vamos a usar. 


## Despliegue de la aplicación en el entorno de desarrollo

En el entorno de desarrollo para desplegar el escenario podríamos tener un fichero `.env` con los siguientes valores:

```
VERSION_WP=latest
VERSION_MDB=latest
PUERTO=8080
USUARIO="prueba"
PASS="asdasd"
PASS_ROOT="asdasd"
BASEDEDATOS="wordpress"
```

Desplegamos el escenario:

```bash
$ docker compose up -d
```

Y podemos comprobar la configuración que hemos desplegado:

```bash
$ docker compose ps
NAME             IMAGE              COMMAND                  SERVICE     CREATED          STATUS          PORTS
servidor_mysql   mariadb:latest     "docker-entrypoint.s…"   db          15 seconds ago   Up 10 seconds   3306/tcp
servidor_wp      wordpress:latest   "docker-entrypoint.s…"   wordpress   15 seconds ago   Up 9 seconds    0.0.0.0:8080->80/tcp, :::8080->80/tcp
```

Vemos las versiones de las imágenes que hemos desplegado (`latest`), el puerto que hemos mapeado (el 8080/tcp) y podemos ver las variables de entorno que se han creado, por ejemplo, en el contenedor de la base de datos:

```bash
$ docker compose exec db env
MARIADB_USER=prueba
MARIADB_PASSWORD=asdasd
MARIADB_ROOT_PASSWORD=asdasd
MARIADB_DATABASE=wordpress
...
```

## Despliegue de la aplicación en el entorno de producción

En este caso en el fichero `.env` tenemos definidas las siguientes variables:

```
VERSION_WP=php8.3-apache
VERSION_MDB=10.5
PUERTO=80
USUARIO="user_server_1345"
PASS="0sFPBmHeDvgu5DOpACFsQ5MhH1J"
PASS_ROOT="4KUHGOa1CWciYopkAw9eBZdBtbu"
BASEDEDATOS="wp_server_bd"
```

Realizamos el despliegue:

```bash
$ docker compose up -d
```

Y podemos comprobar la configuración que hemos desplegado:

```bash
$ docker compose ps
NAME             IMAGE                     COMMAND                  SERVICE     CREATED          STATUS         PORTS
servidor_mysql   mariadb:10.5              "docker-entrypoint.s…"   db          14 seconds ago   Up 2 seconds   3306/tcp
servidor_wp      wordpress:php8.3-apache   "docker-entrypoint.s…"   wordpress   14 seconds ago   Up 3 seconds   0.0.0.0:80->80/tcp, :::80->80/tcp
```

Vemos las versiones de las imágenes que hemos desplegado (`mariadb:10.5` y `wordpress:php8.3-apache`), el puerto que hemos mapeado (el 80/tcp) y podemos ver las variables de entorno que se han creado, por ejemplo, en el contenedor de la base de datos:

```bash
$ docker compose exec db env
MARIADB_USER=user_server_1345
MARIADB_PASSWORD=0sFPBmHeDvgu5DOpACFsQ5MhH1J
MARIADB_ROOT_PASSWORD=4KUHGOa1CWciYopkAw9eBZdBtbu
MARIADB_DATABASE=wp_server_bd
...
```



