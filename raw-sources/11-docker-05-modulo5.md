# Módulo 05: Redes en Docker

**Fuente:** Curso Docker 2024 - modulo5
**Autor:** José Domingo González López
**URL Plataforma:** https://plataforma.josedomingo.org/pledin/cursos/docker2024/modulo5
**URL GitHub:** https://github.com/josedom24/curso_docker_ow



---

# Uso de la red bridge por defecto

Hasta ahora todos los contenedores lo hemos conectado a la red **bridge** por defecto. Como ya hemos dicho las características más importantes de este tipo de red son las siguientes:
    
* Se crea en el Host Docker un *Linux Bridge* llamado **docker0**.
* El direccionamiento de esta red es 172.17.0.0/16.
* Usamos el parámetro `-p` en `docker run` para exponer algún puerto. Se crea una regla DNAT para tener acceso al puerto.
* Los contenedores conectados a un red **bridge** tiene acceso a internet por medio de una regla SNAT.

## Ejemplo de uso de la red bridge por defecto

Vamos a crear un contenedor conectado a la red **bridge** por defecto a partir de la imagen `alpine`. Vamos a mapear el puerto 80/tcp ya que a continuación instalaremos un servidor web en el contenedor:

```bash
docker run -it -p 8080:80 --name contenedor1 alpine ash
```

**Nota**: `ash` es la shell de la distribución Alpine. En realidad no habría que indicarlo, ya que el contenedor va a ejecutar ese comando por defecto.

### Configuración de red del contenedor

Accedemos al contenedor y comprobamos su configuración de red:

```bash
# ip a
...
4: eth0@if5: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP 
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0

# ip r
default via 172.17.0.1 dev eth0
...
```

Hemos visto que su dirección IP está en la red `172.17.0.0/16` y la puerta de enlace es la `172.17.0.1` que corresponde a la dirección IP del Host Docker en esta red. Además podemos ver que la configuración DNS, que se guarda en el fichero `/etc/resolv.conf`, es la misma que la del Host Docker.

```bash
# cat /etc/resolv.conf
```

En el Host Docker podemos comprobar que se ha creado un Linux Bridge al que esta conectado el Host Docker y el contenedor, esta instrucción la podemos ejecutar en otra terminal:

```bash
$ ip a
...
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default 
    link/ether 02:42:09:f8:81:32 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
...
5: vethe6b3199@if4: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default
...
```

### Conectividad del contenedor

Podemos comprobar que el contenedor tiene acceso al exterior:

```bash
# ping www.docker.com
PING www.docker.com (141.193.213.21): 56 data bytes
64 bytes from 141.193.213.21: seq=0 ttl=53 time=10.403 ms
```

Además si instalamos un servidor web podemos acceder utilizando el puerto que hemos mapeado:

```bash
# apk add apache2
# httpd -D foreground
```

Desde el Host Docker podemos probar el acceso:

```bash
$ curl http://localhost:8080
<html><body><h1>It works!</h1></body></html>
```

Vamos a comprobar la configuración de cortafuegos que se ha configurado en el Host Docker. 

* Para permitir que los contenedores conectados a la red **bridge** por defecto tengan conectividad al exterior tenemos que hacer una regla NAT, más concretamente SNAT. 
* Cuando hemos mapeado el puerto 8080/tcp del Host Docker al puerto 80/tcp del contenedor, se ha creado una regla NAT, en concreto DNAT, que hace que todas las peticiones al puerto 8080/tcp del Host Docker se redirijan al puerto 80/tcp del contenedor. Veamos estas reglas iptables, en el Host Docker ejecutando:

```bash
$ sudo iptables -L -n  -t nat
... 
Chain POSTROUTING (policy ACCEPT)
target     prot opt source               destination         
MASQUERADE  all  --  172.17.0.0/16        0.0.0.0/0 
...
Chain DOCKER (2 references)
target     prot opt source               destination         
DNAT       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:8080 to:172.17.0.2:80
...
```

La primera es la regla SNAT que permite a todos los contenedores de la red `172.17.0.0/16` tener acceso al exterior, y la segunda es la regla DNAT que permite la redirección de las peticiones al puerto 8080/tcp del Host Docker al puerto 80/tcp del contenedor que esta en la dirección `172.16.0.2`.

## Mapeo de puertos

Para terminar este punto, vamos a ver distintas opciones para mapear los puertos en las creación de un contenedor. Como sabemos usamos el parámetro `-p` o `--publish` en el comando `docker run`, veamos algunos ejemplos de las configuraciones que podemos hacer:

* `-p 8080:80`: Mapea el puerto 8080/tcp en el Host Docker al puerto 80/tcp en el contenedor.
* `-p 192.168.1.100:8080:80`: Asigna el puerto 8080/tcp en el Host Docker accediendo a la IP `192.168.1.100` al puerto 80/tcp en el contenedor.
* `-p 8080:80/udp`: Asigna el puerto 8080/tcp del Host Docker al puerto 80/udp del contenedor.
* `-p 8080:80/tcp -p 8080:80/udp`: Mapea el puerto 8080/tcp en el Host Docker al puerto 80/tcp en el contenedor, y mapea el puerto 8080/udp en el Host Docker al puerto 80/udp en el contenedor.

Por ejemplo este contenedor sólo sería accesible desde el Host Docker:

```bash
$ docker run -d -p 127.0.0.1:8081:80 --name contenedor2 nginx
```

## Conectividad entre los contenedores conectados a la red por defecto

Evidentemente los contenedores conectados a la red pode defecto podrán comunicarse usando su dirección IP, sin embargo esta red no ofrece ningún mecanismo de DNS para que podamos conectarnos a otro contenedor usando su nombre. Veamos un ejemplo con los contenedores creados en este apartado:

En primer lugar vamos a averiguar que dirección IP ha tomado el `contenedor2`:

```bash
$ docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' contenedor2
172.17.0.3
```

A continuación desde el `contenedor1`intentamos conectamos al segundo contenedor:

```bash
$ docker attach contenedor1
/ # ping 172.17.0.3
PING 172.17.0.3 (172.17.0.3): 56 data bytes
...

/ # ping contenedor2
ping: bad address 'contenedor2'
```

Como podemos observar tenemos conectividad desde el primer contenedor al segundo, pero sólo usando la dirección IP, no tengo un DNS que me permita conectarme al segundo contenedor utilizando su nombre.

Para terminar, indicar que existe una opción que ya se considera obsoleta ("deprectated") usando el parámetro `--link` para que los contenedores conectados a la red pode defecto se puedan comunicar usando sus nombres. Sin embargo con esta opción se utilizaría resolución estática, es decir se modificarían los ficheros `/etc/hosts` de los contenedores para que puedieran resolver los nombres de los otros contenedores.

---

# Ejemplo 1: Despliegue de la aplicación Guestbook

En este ejemplo vamos a desplegar una aplicación web que requiere de dos servicios (servicio web y servicio de base de datos) para su ejecución. La aplicación se llama Guestbook y necesita los dos siguientes servicios:

* La **aplicación Guestbook** es una aplicación web desarrollada en Python que es servida en el **puerto 5000/tcp**. Utilizaremos la imagen `iesgn/guestbook` para crear el contenedor.
* Esta aplicación guarda la información en una **base de datos no relacional redis**, que utiliza el **puerto 6379/tcp** para conectarnos. Usaremos la imagen `redis` para la creación del contenedor.

La aplicación Guestbook por defecto utiliza el nombre `redis` para conectarse a la base de datos, por lo tanto debemos nombrar al contenedor redis con ese nombre para que tengamos una resolución de nombres adecuada. A continuación veremos cómo podemos configurar la aplicación Guestbook (usando una variable de entorno)  para que se conecte a un contenedor redis con otro nombre.

Los dos contenedores tienen que estar conectados en la misma red bridge definida por el usuario y deben tener acceso por nombres (resolución DNS) ya que de principio no sabemos que dirección IP va a tomar cada contenedor. Por lo tanto vamos a crear los contenedores en la misma red:

```bash
$ docker network create red_guestbook
```

Para ejecutar los contenedores:

```bash
$ docker run -d --name redis --network red_guestbook -v /opt/redis:/data redis redis-server --appendonly yes

$ docker run -d -p 80:5000 --name guestbook --network red_guestbook iesgn/guestbook
```

Algunas observaciones:

* No es necesario mapear el puerto del contenedor de la base de datos redis, ya que no vamos a acceder desde el exterior. Sin embargo la aplicación Guestbook va a poder acceder a la base de datos porque están conectado a la misma red.
* Al nombrar al contenedor de la base de datos con `redis` se crea una entrada en el DNS que resuelve ese nombre con la dirección IP del contenedor. Como hemos indicado, por defecto, la aplicación Guestbook usa ese nombre para acceder.
* Para conseguir la persistencia de datos en el contenedor de la base de datos redis, montamos un bind mount (también podríamos haber usado un volumen Docker) en el directorio `/data` del contenedor. Además ejecutamos el comando `redis-server --appendonly yes` para que se guarden los datos de la base de datos en ese directorio.

Suponiendo que la dirección IP del Host Docker es la `192.168.121.54` podríamos acceder a la aplicación mediante un navegado web:

![ ](img/guestbook.png)

## Configuración de la aplicación Guestbook

Como hemos indicado anteriormente, en la creación de la imagen `iesgn/guestbook` se ha creado una variable de entorno (llamada `REDIS_SERVER`) donde se configura el nombre del servidor de base de datos redis al que se accede, por defecto el valor de esta variable es `redis`. Por lo tanto, es necesario que el contenedor de la base de datos tenga el nombre `redis` para que el contenedor de Guestbook pueda conectar a la base de datos.

Si creamos un contenedor redis con otro nombre, por ejemplo:

```bash
$ docker run -d --name contenedor_redis --network red_guestbook -v /opt/redis:/data redis redis-server --appendonly yes
```

Tendremos que configurar la aplicación Guestbook para que acceda a la base de datos redis usando como nombre `contenedor_redis`, por lo tanto en la creación tendremos que definir la variable de entorno `REDIS_SERVER`, para ello ejecutamos:

```bash
$ docker run -d -p 80:5000 --name guestbook -e REDIS_SERVER=contenedor_redis --network red_guestbook iesgn/guestbook
```


---

# Ejemplo 2: Despliegue de la aplicación Temperaturas

Vamos a hacer un despliegue completo de una aplicación llamada Temperaturas. Esta aplicación nos permite consultar la temperatura mínima y máxima de todos los municipios de España. Esta aplicación está formada por dos **microservicios**:

* `frontend`: Es una **aplicación escrita en Python** que nos ofrece una página web para hacer las búsquedas y visualizar los resultados. Este microservicio hará peticiones HTTP al segundo microservicio para obtener la información. Este microservicio ofrece el servicio en el puerto **3000/tcp**. Usaremos la imagen `iesgn/temperaturas_frontend` para la creación del contenedor.
* `backend`: Es el segundo microservicio que nos ofrece un **servicio web de tipo API Restful**. A esta API Web podemos hacerles consultas sobre los municipios y sobre las temperaturas. En este caso, se utiliza el puerto **5000/tcp** para ofrecer el servicio. Usaremos la imagen `iesgn/temperaturas_backend` para la creación del contenedor.

El microservicio `frontend` se conecta a `backend` usando el nombre `temperaturas-backend`, dicho de otra manera, en la imagen existe una variable de entorno llamada `TEMP_SERVER` cuyo valor por defecto es `temperaturas-backend:5000`, el nombre del contenedor y el puerto al que accede. Por lo tanto el contenedor con el microservicio `backend` tendrá ese nombre para disponer de una resolución de nombres adecuada en el servidor DNS.

Vamos a crear una red para conectar los dos contenedores:

```bash
$ docker network create red_temperaturas
```

Para crear los contenedores, ejecutamos:

```bash
$ docker run -d --name temperaturas-backend --network red_temperaturas iesgn/temperaturas_backend

$ docker run -d -p 80:3000 --name temperaturas-frontend --network red_temperaturas iesgn/temperaturas_frontend
```

Algunas observaciones:

* Este es un tipo de aplicación, que se caracteriza por **no necesitar guardar información** para su funcionamiento. Son las denominadas **aplicaciones sin estado**, por lo tanto no necesitamos almacenamiento adicional para la aplicación.
* No es necesario mapear el puerto de `backend`, ya que no vamos a acceder desde el exterior. Sin embargo el microservicio `frontend` va a poder acceder a `backend` al puerto 5000/tcp porque están conectado a la misma red.
* Al nombrar al contenedor `backend` con `temperaturas-backend` se crea una entrada en el DNS que resuelve ese nombre con la dirección IP del contenedor. Como hemos indicado, por defecto, el microservicio `frontend` usa ese nombre para conectar.

![temperaturas](img/temperaturas.png)

## Configuración de la aplicación Temperaturas

Como hemos indicado anteriormente, en la creación de la imagen `iesgn/temperaturas_frontend` se ha creado una variable de entorno (llamada `TEMP_SERVER`) donde se configura el nombre del servidor y el puerto de acceso que utiliza el microservicio `frontend` para acceder al microservicio `backend`. Por lo tanto, debe corresponder con el nombre y el puerto del microservicio `backend`. Por defecto esta variable tiene como valor `temperaturas-backend:5000`, por lo tanto, es necesario que el contenedor del `backend` se llame `temperaturas-backend` y debe ofrecer el servicio en el puerto 5000/tcp.

Si creamos un contenedor `backend` con otro nombre, por ejemplo:

```bash
$ docker run -d --name temperaturas-api --network red_temperaturas iesgn/temperaturas_backend
```

Tendremos que configurar la aplicación `frontend` para que acceda al `backend` usando como nombre `temperaturas-api`, por lo tanto en la creación tendremos que definir la variable de entorno `TEMP_SERVER`, para ello ejecutamos:

```bash
$ docker run -d -p 80:3000 --name temperaturas-frontend -e TEMP_SERVER=temperaturas-api:5000 --network red_temperaturas iesgn/temperaturas_frontend
```
---

# Ejemplo 3: Despliegue de WordPress + MariaDB

Para la instalación de WordPress necesitamos dos contenedores: uno para ejecutar la base de datos MariaDB (imagen `mariadb`) y el servidor web con la aplicación (imagen `wordpress`). Los dos contenedores tienen que estar en la misma red y deben tener acceso por nombre (resolución DNS) ya que de principio no sabemos que dirección IP va a coger cada contenedor. Por lo tanto vamos a crear los contenedores en la misma red:

```bash
$ docker network create red_wp
```

Siguiendo la documentación de la imagen [`mariadb`](https://hub.docker.com/_/mariadb) y la imagen [`wordpress`](https://hub.docker.com/_/wordpress) podemos ejecutar los siguientes comandos para crear los dos contenedores:

```bash
$ docker run -d --name servidor_mariadb \
                --network red_wp \
                -v vol_mariadb:/var/lib/mysql \
                -e MARIADB_DATABASE=bd_wp \
                -e MARIADB_USER=user_wp \
                -e MARIADB_PASSWORD=asdasd \
                -e MARIADB_ROOT_PASSWORD=asdasd \
                mariadb
                
$ docker run -d --name servidor_wp \
                --network red_wp \
                -v vol_wordpress:/var/www/html/ \
                -e WORDPRESS_DB_HOST=servidor_mariadb \
                -e WORDPRESS_DB_USER=user_wp \
                -e WORDPRESS_DB_PASSWORD=asdasd \
                -e WORDPRESS_DB_NAME=bd_wp \
                -p 80:80 \
                wordpress

$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
5b2c5a82a524        wordpress           "docker-entrypoint.s…"   9 minutes ago       Up 9 minutes        0.0.0.0:80->80/tcp   servidor_wp
f70f22aed3d1        mariadb             "docker-entrypoint.s…"   9 minutes ago       Up 9 minutes        3306/tcp             servidor_mariadb
```

Algunas observaciones:

* El contenedor `servidor_mariadb` **ejecuta un script `docker-entrypoint.sh`** que es el encargado, a partir de las variables de entorno, de configurar la base de datos: crea usuario, crea base de datos, cambia la contraseña del usuario root,... y termina ejecutando el servidor MariaDB.
* Del mismo modo el contenedor `servidor_wp` **ejecuta un script `docker-entrypoint.sh`**, que entre otras cosas, a partir de las variables de entorno, ha creado el fichero `wp-config.php` de WordPress, por lo que durante la instalación no te ha pedido las credenciales de la base de datos.
* Si te das cuenta la **variable de entorno** `WORDPRESS_DB_HOST` la hemos inicializado al nombre del servidor de base de datos. Como están conectada a la misma red bridge definida por el usuario, el contenedor WordPress al intentar acceder al nombre `servidor_mariadb` estará accediendo al contenedor de la base de datos.
* Vamos a **acceder desde el exterior** al servidor web, por lo que hemos mapeado los puertos con la opción `-p`. Sin embargo, en el contenedor de la base de datos no es necesario mapear los puertos porque no vamos a acceder desde el exterior a ese contenedor. Sin embargo, el contenedor `servidor_wp` puede acceder al puerto 3306/tcp del `servidor_mariadb` sin problemas ya que están conectados a la misma red.
* Hemos **usado un volumen** `vol_mariadb` para hacer persistente el contenedor de MariaDB, montándolo en el directorio `/var/lib/mysql.`. Del mismo modo, hemos usado el volumen `vol_wordpress` para guardar la información de WordPress, montándolo en el directorio *DocumentRoot* `var/www/html`.

![wordpress](img/wp.png)
---

# Ejemplo 4: Despliegue de Apache Tomcat + nginx

En este ejemplo vamos a desplegar una aplicación muy sencilla escrita en Java en un servidor de aplicación Tomcat, a la que accederemos utilizando un proxy inverso nginx. En este ejercicio, además de seguir trabajando con las redes de tipo bridge definidas por el usuario, vamos a usar bind mount para montar los ficheros de configuración y de despliegue en los contenedores.

## Desplegando Apache Tomcat

Antes de hacer el despliegue del primer contenedor, vamos a crear una red bridge para conectar los contenedores:

```bash
$ docker network create red_tomcat
```

A continuación, vamos a crear un contenedor a partir de la imagen [`tomcat`](https://hub.docker.com/_/tomcat). En la documentación podemos ver que el directorio `/usr/local/tomcat/webapps/` es donde tenemos que poner el fichero de despliegue `war` (vamos a usar bind mount para montar el fichero war en el directorio). No vamos a mapear puerto porque no vamos a acceder a este contenedor desde el exterior, lo vamos a hacer desde un proxy inverso.

Tenemos un directorio donde tenemos el fichero war (puedes encontrar estos ficheros en el [Repositorio con el código de los ejemplos](https://github.com/josedom24/ejemplos_curso_docker_ow)):

```bash
$ cd ejemplo4
~/ejemplo4$ ls
default.conf  sample.war
```

Y creamos el contenedor conectada a nuestra nueva red, tenemos que ejecutar esta instrucción en el directorio anterior ya que hemos usado `$(pwd)` para indicar el directorio actual:

```bash
$ docker run -d --name aplicacionjava \
                --network red_tomcat \
                -v $(pwd)/sample.war:/usr/local/tomcat/webapps/sample.war:ro \
                tomcat:9.0
```

## Desplegando nginx como proxy inverso

Como vimos anteriormente en el directorio de trabajo tenemos también la configuración de nginx para que funcione como proxy inverso:

```bash
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
	proxy_pass http://aplicacionjava:8080/sample/;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```
Como vemos para realizar el proxy inverso usamos la directiva `proxy_pass`indicando la dirección que nos ofrece tomcat, en este caso usamos el nombre del contenedor anterior (`aplicacionjava`) que será resuelto por el servidor DNS interno, usando el puerto estándar de Apache Tomcat, el 8080/tcp y el directorio `sample` donde se ha desplegado la aplicación. Para la creación del contenedor de nginx:

```bash
$ docker run -d --name proxy \
                -p 80:80 \
                --network red_tomcat \
                -v $(pwd)/default.conf:/etc/nginx/conf.d/default.conf:ro \
                nginx
```

Y al acceder la dirección IP de nuestro host:

![tomcat](img/tomcat.png)
---

# Uso de la red host en Docker

Si utilizamos el tipo de red **host** en un contenedor, la pila de red de ese contenedor no está aislada del Host Docker (el contenedor comparte el espacio de nombres de red del Host Docker), y el contenedor no tiene asignada su propia dirección IP. Por ejemplo, si ejecutas un contenedor que ofrece su servicio en al puerto 80/tcp y utilizas el modo de red del host, la aplicación del contenedor estará disponible en el puerto 80/tcp de la dirección IP del Host Docker.

## Ventajas del uso de la red host

* Para optimizar el rendimiento.
* En situaciones en las que un contenedor necesita manejar un gran rango de puertos.
    Esto se debe a que no requiere traducción de direcciones de red (DNAT), por lo tanto no usaremos la opción `-p` en la creación del contenedor con `docker run`.

El controlador de red **host** sólo funciona en máquinas Linux, y no es compatible con Docker Desktop para Windows o Mac.

## Ejemplo de uso

Vamos a crear un contenedor desde la imagen `nginx` que nos proporciona un servidor web que espera peticiones en el puerto 80/tcp conectado a la red **host**:

```bash
docker run --rm -d --network host --name my_nginx nginx
```
Al listar el contenedor, comprobamos que efectivamente no hemos creado ninguna redirección de puertos:

```bash
$ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS              PORTS     NAMES
d1764a33c096   nginx     "/docker-entrypoint.…"   About a minute ago   Up About a minute             my_nginx
```

Podemos comprobar que no tiene asignada ninguna dirección IP:

```bash
$ docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my_nginx
```

Y en el Host Docker podemos comprobar quien está escuchando en el puerto 80/tcp:

```bash
$ sudo ss -tulpn | grep :80
```

Por último, desde un navegador podemos acceder al puerto 80/tcp del Host Docker para comprobar que funciona. Usando `curl` podemos hacer la prueba desde el mismo Host Docker:

```bash
$ curl http://localhost
```



---

# Introducción a las redes en Docker

Cada vez que creamos un contenedor, esté se conecta a una red virtual y Docker hace una configuración del sistema (usando puentes virtuales e iptables) para que la máquina tenga una dirección IP interna, tenga acceso al exterior, podamos mapear (DNAT) puertos,...
Por lo tanto, los contenedores tienen la capacidad de conectarse a otros contenedores y realizar conexiones a servicios de internet. 

## Tipos de redes

* **Red bridge**: Nos permite que los contenedores estén conectados a una red privada, con un direccionamiento privado conectado a la Host Docker mediante un Linux Bridge. 
    * Nos permiten aislar los contenedores del acceso exterior.
    * Los contenedores conectados a un red **bridge** tienen acceso a internet por medio de una regla SNAT. 
    * Usamos el parámetro `-p` en `docker run` para exponer algún puerto. Se crea una regla DNAT para tener acceso al puerto.
* **Red host**: Si conecto un contenedor a la red **host**, el contenedor ofrece el servicio que tiene configurado en el puerto de la red del Host Docker. No tiene dirección IP propia, sino es cómo si tuviera la dirección IP del Host Docker. Por lo tanto, los puertos son accesibles directamente desde el Host Docker.
* **Red none**: La red **none** no configurará ninguna IP para el contenedor y no tiene acceso a la red externa ni a otros contenedores. Tiene la dirección loopback y se puede usar para ejecutar trabajos por lotes.
* Existen otros tipos de redes para configuraciones avanzadas: **overlay**, **ipvlan** y **macvlan**.

## Redes definidas en la instalación de Docker

Al instalar Docker tenemos una red de cada tipo de las vistas anteriormente:

```bash
$ docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
e77b9d55f17a   bridge    bridge    local
aae71c859f9b   host      host      local
211d98d9ac01   none      null      local
```

## Redes bridge

Existen dos tipos de redes bridge:

* La red **bridge** creada por defecto por Docker para que de forma predeterminada los contenedores tengan conectividad.
* Y las **redes bridge definidas por el usuario**.

### Red bridge por defecto

* Por defecto los contenedores que creamos se conectan a la red de tipo bridge llamada **bridge**.
* Se crea en el Host Docker un *Linux Bridge* llamado **docker0**.
* El direccionamiento de esta red es 172.17.0.0/16.

![ ](img/bridge1.png)

### Red bridge definida por el usuario

* Nos permiten aislar los distintos contenedores que tengo en distintas redes Docker, de tal manera que desde cada una de las redes solo podamos acceder a los equipos de esa misma red.
* Nos proporcionan **resolución DNS** entre los contenedores, por lo que los contenedores puedan conectar a otros contenedores usando su nombre.
* Puedo **conectar en caliente** a los contenedores redes bridge definidas por el usuario. Si uso la red por defecto tengo que parar previamente el contenedor.
* Me permiten **gestionar de manera más segura el aislamiento de los contenedores**, ya que si no indico una red al arrancar un contenedor éste se incluye en la red por defecto donde pueden convivir servicios que no tengan nada que ver.
* Nos proporcionan **más control sobre la configuración de las redes**. Los contenedores de la red por defecto comparten todos la misma configuración de red (MTU, reglas de cortafuegos, etc...).
* Es importante que nuestros contenedores en producción se ejecuten conectados a una red bridge definida por el usuario.

![ ](img/bridge2.png)


---

# Uso de la red bridge definidas por el usuario

En este apartado vamos a trabajar con las dos redes que hemos creado en el apartado anterior.
En primer lugar vamos a crear dos contenedores conectados a la primera red, para ello usaremos el parámetro `--network` en el comando `docker run`:

```bash
$ docker run -d --name servidorweb --network red1 nginx
$ docker run -it --name cliente --network red1 alpine
```

Lo primero que vamos a comprobar es la resolución DNS desde el contenedor `cliente`:

```bash
# nslookup servidorweb
Server:		127.0.0.11
Address:	127.0.0.11:53

Non-authoritative answer:

Non-authoritative answer:
Name:	servidorweb
Address: 172.18.0.2
```

Tenemos un servidor DNS en la dirección IP `172.0.0.11` que nos resuelve el nombre del primer contenedor con su dirección IP. Podemos comprobar que ese servidor DNS es el que tiene configurado el contenedor:

```bash
# cat /etc/resolv.conf 
nameserver 127.0.0.11
```

Y por lo tanto podemos realizar conexiones usando el nombre de los contenedores:

```bash
# ping servidorweb
PING servidorweb (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.399 ms
...
```

## Conectando los contenedores a otras redes

A continuación, creamos un contenedor conectado a la segunda red (`red2`) y comprobamos que no hay conectividad con los dos anteriores:

```bash
$ docker run -it --name cliente2 --network red2 alpine
```

Comprobamos su dirección IP y su puerta de enlace, e intentamos acceder a uno de los contenedores creados anteriormente:


```bash
# ip a
23: eth0@if24: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP 
    inet 192.168.0.1/24 brd 192.168.0.255 scope global eth0
...

# ip r
default via 192.168.0.100 dev eth0 
...

# ping servidorweb
ping: bad address 'servidorweb'
```

Veamos cómo podemos conectar un contenedor a una red. Para ello usaremos el comando `docker network connect` y para desconectarla usaremos `docker network disconnect`. Salimos del contenedor que acabamos de crear, lo iniciamos y lo conectamos a la primera red:

```bash
$ docker start cliente2
$ docker network connect red1 cliente2
$ docker attach cliente2
```

Comprobamos que se ha creado una nueva interfaz de red con el direccionamiento de la red `red1`:

```bash
# ip a
25: eth0@if26: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP 
    inet 192.168.0.1/24 brd 192.168.0.255 scope global eth0
...    
27: eth1@if28: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP 
    inet 172.18.0.3/16 brd 172.18.255.255 scope global eth1
...
```

Ahora podemos comprobar si tenemos conectividad con el contenedor `servidorweb`:

```bash
# ping servidorweb
PING servidorweb (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.238 ms
...
```

Finalmente podemos desconectar el contenedor de la red, ejecutando el siguiente comando:

```bash
$ docker network disconnect red1 cliente2
```

## Más opciones al trabajar con redes en docker

Tanto al crear un contenedor con el parámetro `--network` para conectarlo a una red, como con la instrucción `docker network connect`, podemos usar algunos otros parámetros.

Veamos un ejemplo donde vamos a crear un contenedor en la red `red2` que tenemos creada:

```bash
$ docker run -it --name contenedor --network red2 \
                                   --ip 192.168.0.10 \
                                   --add-host=testing.example.com:192.168.0.20 \
                                   --dns 1.1.1.1 \
                                   --hostname servidor1 \
                                   alpine
```

* `--hostname servidor1`: Indicamos el nombre de la máquina. Lo comprobamos:

    ```bash
    # cat /etc/hostname 
    servidor1
    ```
* `--ip 192.168.0.10`: Nos permite poner una dirección IP fija en el contenedor. Vamos a comprobarlo:

    ```bash
    # ip a
    33: eth0@if34: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP 
    inet 192.168.0.10/24 brd 192.168.0.255 scope global eth0
    ```
* `--add-host=testing.example.com:192.168.100.20`: Añadimos un nuevo nombre de host como resolución estática. Lo comprobamos:

    ```bash
    # cat /etc/hosts
    ...
    192.168.0.20	testing.example.com
    192.168.0.10	servidor1
    
    # ping testing.example.com
    PING testing.example.com (192.168.0.20): 56 data bytes
    ```
* `--dns 1.1.1.1`: Hemos configurado como DNS el servidor `1.1.1.1`. Veamos esto con detenimiento, como hemos visto anteriormente al conectar el contenedor a una red bridge definida por el usuario se crea un servidor DNS que nos permite la resolución por el nombre del contenedor veamos el servidor DNS:
    ```bash
    # cat /etc/resolv.conf 
    nameserver 127.0.0.11
    ...
    ```
    Por defecto este servidor hace forward con el servidor DNS que tenga configurado el anfitrión (es decir usa el DNS del anfitrión para resolver los nombre que no conoce). Con la opción `--dns 1.1.1.1`, estamos cambiando el DNS al que hacemos forwarding, por lo tanto ese cambio no se visualiza en el fichero `/etc/resolv.conf`.

---

# Redes bridge definidas por el usuario

Además de poder usar la red **bridge** por defecto, podemos crear nuevas redes de este tipo, a las que llamamos **redes bridge definidas por el usuario**. Como hemos visto en la introducción este tipo de redes nos proporcionan un mecanismo **DNS** que nos permite el acceso entre contenedores usando su nombre. Este tipo de redes serán las deseadas en entornos de producción.

## Gestión de redes bridge definidas por el usuario

Para crear una red bridge definida por el usuario, ejecutamos la siguiente instrucción: 

```bash
$ docker network create -d bridge red1
```

La opción `-d bridge` es optativa, si no se se indica el tipo,  por defecto se creará una red de tipo bridge. Podemos visualizar las redes que tenemos creadas ejecutando:

```bash
$ docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
...
6dc4142f78ed   red1      bridge    local
```

Para obtener información de la red, podemos ejecutar:

```bash
$ docker network inspect red1
...
    "Config": [
        {
            "Subnet": "172.18.0.0/16",
            "Gateway": "172.18.0.1"
        }
...
```

Al crear la red no hemos indicado el direccionamiento, por lo que se ha asignado uno por defecto. Además en el Host Docker se ha creado un nuevo bridge donde se conectarán los contenedores que estén conectados a esta red:

```bash
$ ip a
...
17: br-6dc4142f78ed: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default 
    inet 172.18.0.1/16 brd 172.18.255.255 scope global br-6dc4142f78ed
...
```

Vemos que la puerta de enlace que recibirán los contenedores conectados a esta red corresponde con la dirección IP del Host Docker en esta red.

Por último, para borrar una red podemos ejecutar:

```bash
$ docker network rm red1
```

Teniendo en cuenta que no puedo borrar una red que tenga contenedores que la estén usando, deberé primero borrar los contenedores o desconectarlos de la red.

## Creación avanzada de redes bridge definidas por el usuario

En la creación de una red de tipo bridge podemos configurar algunos parámetros, por ejemplo el direccionamiento y la puerta enlace. Veamos un ejemplo:

```bash
$ docker network create --subnet 192.168.0.0/24 --gateway 192.168.0.100 red2
```

Podemos comprobar que el direccionamiento lo hemos configurado:


```bash
$ docker network inspect --format='{{range .IPAM.Config}}{{.Subnet}}{{end}}' red2
192.168.0.0/24
```

Y que la dirección IP que hemos asignado a la puerta de enlace, se ha configurado en la interfaz del Host Docker correspondiente al nuevo bridge virtual que se ha creado:

```bash
$ ip a
18: br-123d3e08ec9c: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default 
    inet 192.168.0.100/24 brd 192.168.0.255 scope global br-123d3e08ec9c
```


